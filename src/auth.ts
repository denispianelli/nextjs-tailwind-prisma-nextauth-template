import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import db from './db/prisma';
import bcrypt from 'bcryptjs';

import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { User, PrismaClient } from '@prisma/client';

globalThis.prisma ??= new PrismaClient();

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user');
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(globalThis.prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await getUser(email as string);

        if (!user) return null;

        const isValidPassword =
          user.password &&
          (await bcrypt.compare(password as string, user.password));

        if (isValidPassword) return user;

        return null;
      },
    }),
    Google({
      authorization:
        'https://accounts.google.com/o/oauth2/auth/authorize?response_type=code&prompt=login',
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
