'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import db from '@/db/prisma';
import { redirect } from 'next/navigation';

type LoginForm = {
  email: string;
  password: string;
};

export async function authenticate(loginForm: LoginForm) {
  const { email } = loginForm;

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

    await signIn('credentials', loginForm);
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
