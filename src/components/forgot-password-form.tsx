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
import { useFormState, useFormStatus } from 'react-dom';
import { forgotPassword } from '@/app/users/password_reset/_actions/forgot-password';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const [state, action] = useFormState(forgotPassword, undefined);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state?.message) {
      toast({
        description: state?.message,
      });
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    }
  }, [state?.message, toast, router, state]); // Include 'state' in the dependency array

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <form action={action} className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="	"
                variant={state?.errors?.email ? 'destructive' : 'default'}
              />
              {state?.errors?.email ? (
                <p className="text-xs text-destructive">{state.errors.email}</p>
              ) : (
                <span className="text-xs">&nbsp;</span>
              )}
            </div>
            <ForgotPasswordButton />
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function ForgotPasswordButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? <Loader2 className="size-6 animate-spin"></Loader2> : 'Submit'}
    </Button>
  );
}
