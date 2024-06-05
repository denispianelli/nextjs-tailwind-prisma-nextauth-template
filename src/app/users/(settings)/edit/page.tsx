import { auth } from '@/auth';
import { getUser } from '@/lib/dal';
import { notFound, redirect } from 'next/navigation';
import ChangePasswordForm from './_components/change-password-form';

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const user = await getUser();

  if (!user) {
    return notFound();
  }
  return <ChangePasswordForm user={user} />;
}
