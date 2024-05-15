'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

import {
  removeUserAvatar,
  updateUserAvatar,
} from '@/app/users/(settings)/profile/edit/_actions/avatar';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UploadButton } from '@/lib/utils';

export type User = {
  id: string;
  email: string;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  image: string | null;
};

export function UserAvatarForm({ user }: { user: User }) {
  const { toast } = useToast();

  const router = useRouter();

  const handleUploadClick = async (res: any) => {
    const userId = user.id;
    const imageUrl = res[0].url;

    await updateUserAvatar(userId, imageUrl);

    toast({
      title: 'Success',
      description: 'Avatar uploaded',
    });
    router.refresh();
  };

  const handleRemoveClick = async () => {
    await removeUserAvatar(user.id);
    toast({
      title: 'Success',
      description: 'Avatar removed',
    });
    router.refresh();
  };

  const handleUploadError = (error: Error) => {
    let errorMessage;

    if (error.message.includes('FileSizeMismatch')) {
      errorMessage = 'File is too large';
    }

    if (error.message.includes('InvalidFileType')) {
      errorMessage = 'Invalid file type';
    }
    toast({
      variant: 'destructive',
      title: 'Error',
      description: `${errorMessage || error.message}`,
    });
  };

  return (
    <div className="grid gap-4">
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
            sizes="100px"
            className="aspect-square rounded-full"
            priority={true}
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex gap-2">
            <UploadButton
              className="ut-button:h-10 ut-button:bg-primary ut-button:px-4 ut-button:py-2 ut-button:text-sm ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadClick}
              onUploadError={handleUploadError}
            />
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
    </div>
  );
}
