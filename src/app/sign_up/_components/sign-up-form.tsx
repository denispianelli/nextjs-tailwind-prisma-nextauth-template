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
import { useState } from 'react';
import { isEmailAvailable, signup } from '@/app/sign_up/_actions/sign-up';
import { Loader2 } from 'lucide-react';

import { useDebouncedCallback } from 'use-debounce';
import OAuthProviders from '@/components/oauth-providers';
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const SignupFormSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: 'At least 2 characters.' })
    .trim()
    .optional()
    .or(z.literal('')),
  lastname: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim()
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please enter a valid email.' })
    .trim()
    .refine(
      async (email) => {
        const available = await isEmailAvailable(email);
        return available;
      },
      {
        message: 'Email already in use',
      },
    ),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^\w]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

export function SignUpForm() {
  const [isEmailFree, setIsEmailFree] = useState(true);

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  });

  const email = form.watch('email');

  const handleEmailChange = useDebouncedCallback(() => {
    isEmailAvailable(email).then((available) => {
      if (!available) {
        setIsEmailFree(false);
        form.setError('email', {
          message: 'Email already in use',
        });
      } else {
        setIsEmailFree(true);
      }
    });
  }, 300);

  async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    await signup(values);
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First name{' '}
                        <span className="text-xs text-gray-400">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <FormInput placeholder="Max" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last name{' '}
                        <span className="text-xs text-gray-400">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <FormInput placeholder="Robinson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormInput
                        type="email"
                        autoComplete="email"
                        placeholder="m@exemple.com"
                        onChange={(e) => {
                          field.onChange(e);
                          handleEmailChange();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormInput
                        type="password"
                        autoComplete="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SignUpButton isEmailFree={isEmailFree} />
            </form>
          </Form>
          <div className="mx-auto my-4 flex w-full items-center justify-evenly text-sm font-semibold text-gray-600 before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
            or
          </div>
          <OAuthProviders />
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

function SignUpButton({ isEmailFree }: { isEmailFree: boolean }) {
  const { isSubmitting } = useFormState();

  return (
    <Button
      type="submit"
      className="w-full"
      aria-disabled={isSubmitting || !isEmailFree}
    >
      {isSubmitting ? (
        <Loader2 className="size-6 animate-spin"></Loader2>
      ) : (
        'Create an account'
      )}
    </Button>
  );
}
