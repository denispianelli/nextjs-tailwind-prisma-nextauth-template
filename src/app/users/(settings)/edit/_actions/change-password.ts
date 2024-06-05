'use server';

import db from '@/db/prisma';
import { notFound, redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export async function changePassword(
  changePasswordForm: ChangePasswordForm,
  id: string,
) {
  const { currentPassword, newPassword, confirmPassword } = changePasswordForm;

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
          currentPassword: 'Your current password is incorrect.',
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
