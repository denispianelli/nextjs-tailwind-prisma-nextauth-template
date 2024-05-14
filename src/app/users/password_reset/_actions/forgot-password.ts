'use server';

import db from '@/db/prisma';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { sendPasswordResetEmail } from '@/services/email-service';

const ForgotPasswordFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
});

export type forgotPasswordFormState =
  | {
      errors?: {
        email?: string[];
      };
      message?: string;
    }
  | undefined;

export async function forgotPassword(
  prevState: forgotPasswordFormState,
  formData: FormData,
) {
  const validatedFields = ForgotPasswordFormSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
    },
  });

  if (!user) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      message:
        'You will receive an email with instructions about how to reset your password in a few minutes.',
    };
  }

  const token = uuidv4();
  const hashedToken = await bcrypt.hash(token, 10);
  const tokenExpiry = new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 1);

  await db.user.update({
    where: {
      email,
    },
    data: {
      otp: hashedToken,
      otp_expires: tokenExpiry,
    },
  });

  await sendPasswordResetEmail(email, token);

  return {
    message:
      'If the email is associated with an account, a password reset link will be sent.',
  };
}
