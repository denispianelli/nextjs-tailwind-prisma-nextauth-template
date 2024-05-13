'use server';

import db from '@/db/prisma';
import { z } from 'zod';
import { notFound } from 'next/navigation';
import { isEmailAvailable } from '@/app/sign_up/_actions/sign-up';

const updateProfileSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: 'At least 2 characters.' })
    .max(255)
    .optional()
    .or(z.literal('')),
  lastname: z
    .string()
    .min(2, { message: 'At least 2 characters.' })
    .max(255)
    .optional()
    .or(z.literal('')),
  email: z.string().email(),
});

export type UpdateProfileFormState =
  | {
      errors?: {
        firstname?: string[];
        lastname?: string[];
        email?: string[];
      };
      message?: string;
    }
  | undefined;

export async function updateProfile(
  id: string,
  prevState: UpdateProfileFormState,
  formData: FormData,
) {
  const validateFields = updateProfileSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { firstname, lastname, email } = validateFields.data;

  const isEmailFree = await isEmailAvailable(email);
  console.log('isEmailFree:', isEmailFree);

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
