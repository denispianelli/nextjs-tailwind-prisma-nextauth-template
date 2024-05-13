'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { useRef } from 'react';
import {
  removeUserAvatar,
  updateUserAvatar,
} from '@/app/users/(settings)/profile/edit/_actions/avatar';
import { useFormState } from 'react-dom';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export type User = {
  id: string;
  email: string;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  image: string | null;
};

export function UserAvatarForm({ user }: { user: User }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const updateUserAvatarWithId = updateUserAvatar.bind(null, user.id);
  const [state, action] = useFormState(updateUserAvatarWithId, undefined);

  const router = useRouter();

  const handleEditClick = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = () => {
    formRef.current?.requestSubmit();
    router.refresh();
  };

  const handleRemoveClick = async () => {
    await removeUserAvatar(user.id);
    router.refresh();
  };

  return (
    <form ref={formRef} action={action} className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent>
          <Image
            src={user.image || '/avatar-placeholder.svg'}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full"
          />
          {state?.image && (
            <div className="text-xs text-destructive">{state.image}</div>
          )}
          <input
            type="file"
            className="hidden"
            name="image"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex gap-2">
            <Button type="button" onClick={handleEditClick}>
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveClick}
            >
              Remove
            </Button>
          </div>
        </CardFooter>{' '}
      </Card>
    </form>
  );
}
