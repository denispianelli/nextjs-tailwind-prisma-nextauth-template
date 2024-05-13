'use server';

import { AuthError } from 'next-auth';
import { z } from 'zod';
import { signIn } from '@/auth';
import db from '@/db/prisma';
import { redirect } from 'next/navigation';

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please enter a valid email.' })
    .trim(),
  password: z.string().min(1, { message: 'Password is required.' }).trim(),
});

export type loginFormState =
  | {
      errors?: {
        password?: string[];
        email?: string[];
      };
      message?: string;
    }
  | undefined;

export async function authenticate(
  prevState: loginFormState,
  formData: FormData,
) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    const user = await db.user.findUnique({
      where: {
        email: email as string,
      },
    });

    if (!user) {
      return { message: 'Invalid credentials' };
    }

    if (user.emailVerified === false) {
      redirect(`/sign_up/verify_email?email=${encodeURIComponent(email)}`);
    }

    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials' };
        default:
          return { message: 'Something went wrong' };
      }
    }
    throw error;
  }
}

export async function GoogleSignIn() {
  await signIn('google');
}

export async function GitHubSignIn() {
  await signIn('github');
}
