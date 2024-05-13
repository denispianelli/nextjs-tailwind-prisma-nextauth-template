'use server';

import db from '@/db/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const ResetPasswordFormSchema = z.object({
  email: z.string().email().trim(),
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

export type resetPasswordFormState =
  | {
      errors?: {
        password?: string[];
        confirmPassword?: string[];
      };
    }
  | undefined;

export async function resetPassword(
  prevState: resetPasswordFormState,
  formData: FormData,
) {
  const validatedFields = ResetPasswordFormSchema.safeParse({
    email: formData.get('email'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, newPassword, confirmPassword } = validatedFields.data;

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
      email,
    },
    data: {
      password: hashedPassword,
      emailVerified: true,
      otp: null,
      otp_expires: null,
    },
  });

  return {
    message: 'Your password has been successfully updated.',
  };
}
