import { ResetPasswordForm } from '@/components/reset-password-form';
import verifyToken from './_actions/verify-token';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  const token = searchParams.reset_password_token as string;
  const email = searchParams.email as string;

  if (!token || !email) {
    redirect('/login');
  }

  const isTokenValid = await verifyToken(token, email);

  return (
    <main className="flex h-[calc(100vh-64px)] items-center">
      <ResetPasswordForm isTokenValid={isTokenValid} />
    </main>
  );
}
