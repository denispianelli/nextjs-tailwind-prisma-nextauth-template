'use server';

import crypto from 'crypto';
import db from '@/db/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { sendMail } from '@/services/email-service';

const SignupFormSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: 'At least 2 characters.' })
    .trim()
    .optional()
    .or(z.literal('')),
  lastname: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim()
    .optional()
    .or(z.literal('')),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^\w]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

export type signUpFormState =
  | {
      errors?: {
        firstname?: string[];
        lastname?: string[];
        password?: string[];
        email?: string[];
      };
      message?: string;
    }
  | undefined;

export async function signup(prevState: signUpFormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, firstname, lastname } = validatedFields.data;

  const isEmailFree = await isEmailAvailable(email);

  if (!isEmailFree) {
    return { message: 'Email already in use' };
  }

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
