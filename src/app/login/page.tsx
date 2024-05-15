import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from './_components/login-form';

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <main className="h-[calc(100vh-64px)]">
      <LoginForm />
    </main>
  );
}
