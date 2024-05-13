'use server';

import db from '@/db/prisma';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import fs from 'fs/promises';
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

  await fs.mkdir('public/avatars', { recursive: true });
  const imagePath = `/avatars/${crypto.randomUUID()}-${image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await image.arrayBuffer()),
  );

  if (prevImage?.startsWith('/avatars') && prevImage !== imagePath) {
    await fs.unlink(`public${prevImage}`);
  }

  await db.user.update({
    where: { id },
    data: {
      image: imagePath,
    },
  });

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
