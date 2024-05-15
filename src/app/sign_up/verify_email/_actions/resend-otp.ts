'use server';

import db from '@/db/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendMail } from '@/services/email-service';

export async function resendOtp(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    if (user.emailVerified) {
      return {
        message: 'Email already verified',
      };
    }

    const otp = crypto.randomInt(100000, 999999);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    const otpExpires = new Date();
    otpExpires.setHours(otpExpires.getHours() + 24);

    await db.user.update({
      where: {
        email,
      },
      data: {
        otp: hashedOtp,
        otp_expires: otpExpires,
      },
    });

    await sendMail(otp.toString(), email);

    return {
      message: 'A new code has been sent to your email.',
    };
  } catch (error) {
    throw error;
  }
}
