import { auth } from '@/auth';
import { getUser } from '@/lib/dal';
import { notFound, redirect } from 'next/navigation';
import { DeleteAccount } from './_components/delete-account';
import { ProfileForm } from './_components/profile-form';
import { UserAvatarForm } from './_components/user-avatar-form';

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
    <div className="grid gap-6">
      <ProfileForm user={user} />
      <UserAvatarForm user={user} />
      <DeleteAccount user={user} />
    </div>
  );
}
