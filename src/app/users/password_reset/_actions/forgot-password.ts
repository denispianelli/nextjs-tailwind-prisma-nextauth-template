'use server';

import db from '@/db/prisma';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { sendPasswordResetEmail } from '@/services/email-service';

type ForgotPasswordForm = {
  email: string;
};

export async function forgotPassword(forgotPasswordForm: ForgotPasswordForm) {
  const { email } = forgotPasswordForm;

  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
    },
  });

  if (!user) {
    return {
      message:
        'If the email is associated with an account, a password reset link will be sent.',
    };
  }

  const token = uuidv4();
  const hashedToken = await bcrypt.hash(token, 10);
  const tokenExpiry = new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 10);

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
