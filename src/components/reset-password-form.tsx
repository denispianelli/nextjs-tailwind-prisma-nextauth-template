'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';

import { useFormState, useFormStatus } from 'react-dom';
import { resetPassword } from '@/app/users/password_reset/edit/_actions/reset-password';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ResetPasswordForm() {
  const [state, action] = useFormState(resetPassword, undefined);

  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: 'Success',
        description: state?.message,
      });
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }, [router, state?.message, toast]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Change your password</CardTitle>
        <CardDescription>Enter and confirm your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="my-4 list-inside list-disc text-xs">
          <p className="mb-1">Your password must:</p>
          <li className="ml-2">Be at least 8 characters long</li>
          <li className="ml-2">Contain at least one letter</li>
          <li className="ml-2">Contain at least one number</li>
          <li className="ml-2">Contain at least one special character</li>
        </ul>
        <div className="grid gap-4">
          <form action={action} className="grid gap-2">
            <input type="hidden" name="email" value={email ?? undefined} />
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                name="newPassword"
                variant={state?.errors?.newPassword ? 'destructive' : 'default'}
                placeholder=""
              />
            </div>
            {state?.errors?.newPassword &&
              state.errors.newPassword.map((error) => {
                return (
                  <p key={error} className="text-xs text-red-500">
                    {error}
                  </p>
                );
              })}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                variant={
                  state?.errors?.confirmPassword ? 'destructive' : 'default'
                }
                placeholder=""
              />
              {state?.errors?.confirmPassword &&
                state.errors.confirmPassword.map((error) => {
                  return (
                    <p key={error} className="text-xs text-red-500">
                      {error}
                    </p>
                  );
                })}
            </div>
            <ResetPasswordButton />
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function ResetPasswordButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      Submit
    </Button>
  );
}
