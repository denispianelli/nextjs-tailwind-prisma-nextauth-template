import { auth } from '@/auth';
import { DeleteAccount } from '@/components/delete-account';
import { ProfileForm } from '@/components/profile-form';
import { UserAvatarForm } from '@/components/user-avatar-form';
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
    <div className="grid gap-6">
      <ProfileForm user={user} />
      <UserAvatarForm user={user} />
      <DeleteAccount user={user} />
    </div>
  );
}
