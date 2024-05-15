'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleAlert } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  GitHubSignIn,
  GoogleSignIn,
  authenticate,
} from '@/app/login/_actions/login';

export default function LoginForm() {
  const [state, dispatch] = useFormState(authenticate, undefined);
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="h-full w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {state?.message && (
              <>
                <CircleAlert className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{state?.message}</p>
              </>
            )}
          </div>
          <div className="grid gap-4">
            <form action={dispatch} className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  variant={
                    state?.errors?.email || state?.message
                      ? 'destructive'
                      : 'default'
                  }
                />
                {state?.errors?.email ? (
                  <p className="text-xs text-red-500">
                    {state.errors.email.map((error) => (
                      <span key={error}>{error}&nbsp;</span>
                    ))}
                  </p>
                ) : (
                  <span className="text-xs">&nbsp;</span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Link
                    href="/users/password_reset"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  variant={
                    state?.errors?.password || state?.message
                      ? 'destructive'
                      : 'default'
                  }
                />
                {state?.errors?.password ? (
                  <p className="text-xs text-red-500">
                    {state.errors.password}
                  </p>
                ) : (
                  <span className="text-xs">&nbsp;</span>
                )}
              </div>
              <LoginButton />
            </form>
            <div className="mx-auto my-4 flex w-full items-center justify-evenly text-sm font-semibold text-gray-600 before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              or
            </div>
            <form action={GoogleSignIn}>
              <Button type="submit" variant="outline" className="w-full gap-3">
                <Image
                  src="/icons/Google__G__logo.svg"
                  alt="Google"
                  width="24"
                  height="24"
                  priority
                />
                Login with Google
              </Button>
            </form>{' '}
            <form action={GitHubSignIn}>
              <Button variant="outline" className="w-full gap-3">
                <Image
                  src={
                    theme === 'dark' || resolvedTheme === 'dark'
                      ? '/icons/github-mark-white.svg'
                      : '/icons/github-mark.svg'
                  }
                  alt="Google"
                  width="24"
                  height="24"
                />
                Login with Github
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/sign_up" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-[calc(100vh-64px)] w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      Login
    </Button>
  );
}
