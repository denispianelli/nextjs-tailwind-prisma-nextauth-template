import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SignUpForm } from './_components/sign-up-form';

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <main className="flex h-[calc(100vh-64px)] items-center justify-center bg-muted/40">
      <SignUpForm />
    </main>
  );
}
