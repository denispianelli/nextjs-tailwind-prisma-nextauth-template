'use server';

import crypto from 'crypto';
import db from '@/db/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { sendMail } from '@/services/email-service';

type SignupForm = {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
};

export async function signup(signUpForm: SignupForm) {
  console.log('signup ~ signUpForm:', signUpForm);

  const { email, password, firstname, lastname } = signUpForm;

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = crypto.randomInt(100000, 999999);
  const hashedOtp = await bcrypt.hash(otp.toString(), 10);
  const otpExpires = new Date();
  otpExpires.setHours(otpExpires.getHours() + 24);

  try {
    await sendMail(otp.toString(), email);

    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        otp: hashedOtp,
        otp_expires: otpExpires,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return { message: 'Email already in use' };
      }
    }
    throw error;
  }

  redirect(`/sign_up/verify_email?email=${encodeURIComponent(email)}`);
}

export async function isEmailAvailable(email: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return !user;
  } catch (error) {
    throw error;
  }
}
