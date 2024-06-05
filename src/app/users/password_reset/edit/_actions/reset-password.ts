'use server';

import db from '@/db/prisma';
import bcrypt from 'bcryptjs';
import { notFound } from 'next/navigation';

type ResetPasswordForm = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

export async function resetPassword(resetPasswordForm: ResetPasswordForm) {
  const { email, newPassword, confirmPassword } = resetPasswordForm;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      notFound();
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
  } catch (error) {
    return {
      message: 'Database Error: Failed to update password.',
    };
  }
}
