'use server';

import db from '@/db/prisma';
import { notFound } from 'next/navigation';
import { isEmailAvailable } from '@/app/sign_up/_actions/sign-up';

type ProfileForm = {
  firstname?: string;
  lastname?: string;
  email: string;
};

export async function updateProfile(profileForm: ProfileForm, id: string) {
  const { firstname, lastname, email } = profileForm;

  const isEmailFree = await isEmailAvailable(email);

  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) return notFound();

  if (email !== user.email && !isEmailFree) {
    return { message: 'Email already in use' };
  }

  await db.user.update({
    where: { id },
    data: {
      firstname,
      lastname,
      email,
    },
  });
}
