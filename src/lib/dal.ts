import 'server-only';

import { auth } from '@/auth';
import db from '@/db/prisma';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const getUser = cache(async () => {
  try {
    const session = await auth();
    if (!session) return null;
    const data = await db.user.findUnique({
      where: { email: session?.user?.email ?? undefined },
      select: {
        id: true,
        email: true,
        name: true,
        firstname: true,
        lastname: true,
        image: true,
      },
    });
    const user = data;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return { isAuth: true, userId: session?.user?.id };
});
