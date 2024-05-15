'use client';

import { changePassword } from '@/app/users/(settings)/edit/_actions/change-password';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import { useRef } from 'react';

export type User = {
  id: string;
  email: string | undefined;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  image: string | null;
};

export function ChangePasswordForm({ user }: { user: User }) {
  const ref = useRef<HTMLFormElement>(null);
  const changePasswordWithId = changePassword.bind(null, user.id);
  const [state, action] = useFormState(changePasswordWithId, undefined);

  return (
    <form
      ref={ref}
      action={(formData) => {
        action(formData);
        if (ref.current) ref.current.reset();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Change your password</CardTitle>
          <div className="text-muted-foreground">
            <p className="mt-2 text-xs">Your password must:</p>
            <ul className="list-inside list-disc text-xs">
              <li className="ml-2">Be at least 8 characters long</li>
              <li className="ml-2">Contain at least one letter</li>
              <li className="ml-2">Contain at least one number</li>
              <li className="ml-2">Contain at least one special character</li>
            </ul>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid w-96 gap-6">
            <div className="grid gap-2">
              {state?.message && (
                <div className="rounded-md border-2 border-green-700 bg-green-100 p-2 text-sm text-green-700">
                  {state?.message}
                </div>
              )}
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                name="currentPassword"
                placeholder="Enter your current password"
                variant={
                  state?.errors?.currentPassword ? 'destructive' : 'default'
                }
              />
              {state?.errors?.currentPassword && (
                <div className="text-xs text-destructive">
                  {state.errors.currentPassword}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="Enter your new password"
                variant={state?.errors?.newPassword ? 'destructive' : 'default'}
              />
              {state?.errors?.newPassword &&
                state.errors.newPassword.map((error) => (
                  <div key={error} className="text-xs text-destructive">
                    {error}
                  </div>
                ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                variant={
                  state?.errors?.confirmPassword ? 'destructive' : 'default'
                }
              />
              {state?.errors?.confirmPassword && (
                <div className="text-xs text-destructive">
                  {state.errors.confirmPassword}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
