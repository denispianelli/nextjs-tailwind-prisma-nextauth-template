import { auth } from '@/auth';
import { ChangePasswordForm } from '@/components/change-password-form';
import { getUser } from '@/lib/dal';
import { notFound, redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const user = await getUser();

  if (!user) {
    return notFound();
  }
  return (
    <div>
      <ChangePasswordForm user={user} />
    </div>
  );
}
