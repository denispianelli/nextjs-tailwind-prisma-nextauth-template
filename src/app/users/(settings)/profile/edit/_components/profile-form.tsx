'use client';

import { updateProfile } from '@/app/users/(settings)/profile/edit/_actions/profile';
import { useFormState, useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export type User = {
  id: string;
  email: string | undefined;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  image: string | null;
};

export function ProfileForm({ user }: { user: User }) {
  const updateProfileWithId = updateProfile.bind(null, user.id);
  const [state, action] = useFormState(updateProfileWithId, undefined);

  return (
    <div className="grid gap-6">
      <form action={action} className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstname">First name</Label>
                  <Input
                    type="text"
                    id="firstname"
                    name="firstname"
                    defaultValue={user.firstname ?? undefined}
                    placeholder="Max"
                    variant={
                      state?.errors?.firstname ? 'destructive' : 'default'
                    }
                  />
                  {state?.errors?.firstname && (
                    <div className="text-xs text-destructive">
                      {state.errors.firstname}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input
                    type="text"
                    id="lastname"
                    name="lastname"
                    defaultValue={user.lastname ?? undefined}
                    placeholder="Robinson"
                    variant={
                      state?.errors?.lastname ? 'destructive' : 'default'
                    }
                  />
                  {state?.errors?.lastname && (
                    <div className="text-xs text-destructive">
                      {state.errors.lastname}
                    </div>
                  )}
                </div>
              </div>
              <div className="md:w-2/4">
                <Label>Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user.email}
                  variant={
                    state?.errors?.email || state?.message
                      ? 'destructive'
                      : 'default'
                  }
                />
                {state?.errors?.email && (
                  <div className="text-xs text-destructive">
                    {state.errors.email}
                  </div>
                )}
                {state?.message && (
                  <div className="text-xs text-destructive">
                    {state.message}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <UpdateProfileButton />
          </CardFooter>
        </Card>{' '}
      </form>
    </div>
  );
}

function UpdateProfileButton() {
  const { pending } = useFormStatus();
  const router = useRouter();
  return (
    <Button
      type="submit"
      aria-disabled={pending}
      onClick={() => pending && router.refresh()}
    >
      {pending ? <Loader2 className="size-6 animate-spin"></Loader2> : 'Save'}
    </Button>
  );
}
