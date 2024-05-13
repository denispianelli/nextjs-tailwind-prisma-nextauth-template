import { VerifyEmailForm } from '@/components/verify-email-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect('/');
  }
  return (
    <main className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center">
      <VerifyEmailForm />
    </main>
  );
}
