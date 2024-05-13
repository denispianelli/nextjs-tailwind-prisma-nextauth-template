'use server';

import db from '@/db/prisma';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'Password is required.' })
    .trim(),
  newPassword: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^\w]/, { message: 'Contain at least one special character.' })
    .trim(),
  confirmPassword: z
    .string()
    .min(1, { message: 'You must confirm your password.' })
    .trim(),
});

export type ChangePasswordFormState =
  | {
      errors?: {
        currentPassword?: string[];
        newPassword?: string[];
        confirmPassword?: string[];
      };
    }
  | undefined;

export async function changePassword(
  id: string,
  prevState: ChangePasswordFormState,
  formData: FormData,
) {
  const validatedFields = ChangePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword, confirmPassword } =
    validatedFields.data;

  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) return notFound();

    const isValidPassword =
      user.password && (await bcrypt.compare(currentPassword, user.password));

    if (!isValidPassword) {
      return {
        errors: {
          currentPassword: ['Current password is incorrect.'],
        },
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        errors: {
          confirmPassword: ['Passwords do not match.'],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to update password.',
    };
  }

  return {
    message: 'Password updated successfully.',
  };
}
