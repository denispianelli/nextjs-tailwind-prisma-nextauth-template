'use server';

import db from '@/db/prisma';
import { notFound } from 'next/navigation';
import { utapi } from '@/app/server/uploadthing';

export async function removeUserAvatar(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: { image: true },
    });

    if (!user) {
      return notFound();
    }

    const imageUrl = user.image;

    if (!imageUrl) {
      return;
    }

    const fileKey = imageUrl.split('https://utfs.io/f/')[1];

    await utapi.deleteFiles(fileKey);

    await db.user.update({
      where: { id },
      data: { image: null },
    });
  } catch (error) {
    console.error('Error removing user avatar:', error);
  }
}
