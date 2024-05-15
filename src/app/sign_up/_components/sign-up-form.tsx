'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { isEmailAvailable, signup } from '@/app/sign_up/_actions/sign-up';
import { Loader2 } from 'lucide-react';

import { useDebouncedCallback } from 'use-debounce';
import { GitHubSignIn, GoogleSignIn } from '@/app/login/_actions/login';

export function SignUpForm() {
  const [state, action] = useFormState(signup, undefined);
  const { theme, resolvedTheme } = useTheme();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isEmailFree, setIsEmailFree] = useState(true);

  const handleEmailChange = useDebouncedCallback((term) => {
    setEmailInput(term);
    isEmailAvailable(term).then((available) => {
      if (!available) {
        setIsEmailFree(false);
      } else {
        setIsEmailFree(true);
      }
    });
  }, 300);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <form action={action} className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname">
                  First name{' '}
                  <span className="text-xs text-gray-400">(optional)</span>
                </Label>
                <Input
                  id="firstname"
                  name="firstname"
                  placeholder="Max"
                  variant={state?.errors?.firstname ? 'destructive' : 'default'}
                />
                {state?.errors?.firstname ? (
                  <p className="text-xs text-destructive">
                    {state.errors.firstname}
                  </p>
                ) : (
                  <span className="text-xs">&nbsp;</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">
                  Last name{' '}
                  <span className="text-xs text-gray-400">(optional)</span>
                </Label>
                <Input
                  id="lastname"
                  name="lastname"
                  placeholder="Robinson"
                  variant={state?.errors?.lastname ? 'destructive' : 'default'}
                />
                {state?.errors?.lastname ? (
                  <p className="text-xs text-destructive">
                    {state.errors.lastname}
                  </p>
                ) : (
                  <span className="text-xs">&nbsp;</span>
                )}
              </div>
            </div>
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
                onChange={(e) => handleEmailChange(e.target.value)}
                variant={
                  state?.errors?.email || !isEmailFree
                    ? 'destructive'
                    : 'default'
                }
              />
              {state?.errors?.email || state?.message || !isEmailFree ? (
                <p className="text-xs text-red-500">
                  {state?.errors?.email ||
                    state?.message ||
                    'Email already in use.'}{' '}
                </p>
              ) : (
                <span className="text-xs">&nbsp;</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                onChange={(e) => setPasswordInput(e.target.value)}
                id="password"
                name="password"
                type="password"
                variant={state?.errors?.password ? 'destructive' : 'default'}
              />
              <ul className="list-inside list-disc text-xs">
                <p className="mb-1">Your password must:</p>
                {renderValidationMessage(
                  'Be at least 8 characters long',
                  passwordInput,
                  passwordInput.length >= 8,
                )}
                {renderValidationMessage(
                  'Contain at least one letter',
                  passwordInput,
                  /[a-zA-Z]/.test(passwordInput),
                )}
                {renderValidationMessage(
                  'Contain at least one number',
                  passwordInput,
                  /\d/.test(passwordInput),
                )}
                {renderValidationMessage(
                  'Contain at least one special character',
                  passwordInput,
                  /[^\w]/.test(passwordInput),
                )}
                {state?.errors?.password?.includes('Password is required.') ? (
                  <p className="text-red-500">Password is required.</p>
                ) : (
                  <p>&nbsp;</p>
                )}
              </ul>
            </div>
            <SignUpButton isEmailFree={isEmailFree} />
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
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function renderValidationMessage(
  message: string,
  input: string,
  isValid: boolean,
) {
  return input === '' || input === null ? (
    <li className="ml-2">{message}</li>
  ) : (
    <li className={isValid ? 'ml-2 text-green-500' : 'ml-2 text-red-500'}>
      {' '}
      {message}
    </li>
  );
}

function SignUpButton({ isEmailFree }: { isEmailFree: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full"
      aria-disabled={pending || !isEmailFree}
    >
      {pending ? (
        <Loader2 className="size-6 animate-spin"></Loader2>
      ) : (
        'Create an account'
      )}
    </Button>
  );
}
