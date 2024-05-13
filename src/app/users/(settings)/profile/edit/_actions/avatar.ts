'use server';

import db from '@/db/prisma';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const fileSchema = z.instanceof(File, { message: 'Required' });
const imageSchema = fileSchema.refine(
  (file) => file.size > 0 && file.type.startsWith('image/'),
);

const updateAvatarSchema = z
  .object({
    image: imageSchema.refine((file) => file.size < 2 * 1024 * 1024, {
      message: 'File size must be less than 2MB',
    }),
  })
  .required();

export async function updateUserAvatar(
  id: string,
  prevState: unknown,
  formData: FormData,
) {
  const result = updateAvatarSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const { image } = result.data;

  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) return notFound();

  const prevImage = user.image;

  try {
    const directoryPath = path.join('public', 'avatars');
    console.log('directoryPath:', directoryPath);
    await fs.mkdir(directoryPath, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }

  const imagePath = `/avatars/${crypto.randomUUID()}-${image.name}`;

  try {
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await image.arrayBuffer()),
    );
  } catch (error) {
    console.error('Error saving file:', error);
  }

  try {
    if (prevImage?.startsWith('/avatars') && prevImage !== imagePath) {
      await fs.unlink(`public${prevImage}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }

  try {
    await db.user.update({
      where: { id },
      data: {
        image: imagePath,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
  }

  revalidatePath('/users/profile/edit');
}

export async function removeUserAvatar(id: string) {
  const user = await db.user.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!user) {
    return notFound();
  }

  await db.user.update({
    where: { id },
    data: { image: null },
  });

  if (user.image?.startsWith('/avatars')) {
    await fs.unlink(`public${user.image}`);
  }
}
