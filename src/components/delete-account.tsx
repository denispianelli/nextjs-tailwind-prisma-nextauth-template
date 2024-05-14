'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

import { Trash2 } from 'lucide-react';
import {
  deleteAccount,
  logout,
} from '@/app/users/(settings)/profile/edit/_actions/delete';

export type User = {
  id: string;
  email: string | undefined;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  image: string | null;
};

export function DeleteAccount({ user }: { user: User }) {
  const { toast } = useToast();

  const handleContinueButtonClick = async () => {
    const result = await deleteAccount(user.id);
    toast({
      description: `${result.message}`,
    });
    await logout();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Delete account</CardTitle>
        <CardDescription>
          Please note that this action is irreversible and all your data will be
          permanently removed. Proceed with caution as this action cannot be
          undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-muted-foreground">
              <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Delete
              account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleContinueButtonClick}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
