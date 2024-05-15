import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { VerifyEmailForm } from './_components/verify-email-form';
import db from '@/db/prisma';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    email?: string;
  };
}) {
  const session = await auth();

  const email = searchParams?.email;
  console.log('email:', email);

  if (session || !email) {
    redirect('/');
  }

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.emailVerified) {
    redirect('/');
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-muted/40">
      <VerifyEmailForm />
    </main>
  );
}
