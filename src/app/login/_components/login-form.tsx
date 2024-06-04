'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleAlert, Loader2 } from 'lucide-react';
import { authenticate } from '@/app/login/_actions/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm, useFormState } from 'react-hook-form';

import { useToast } from '@/components/ui/use-toast';
import OAuthProviders from '@/components/oauth-providers';

const LoginFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
  })
  .required();

export default function LoginForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    const result = await authenticate(values);

    if (result) {
      toast({
        description: (
          <div className="flex w-full items-center gap-2">
            <CircleAlert />
            <p>Invalid credentials</p>
          </div>
        ),
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back!',
      });
    }
  }

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
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-2"
              >
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
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>
                            Password <span className="text-red-500">*</span>
                          </FormLabel>
                          <Link
                            href="/users/password_reset"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <FormInput
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <LoginButton />
              </form>
            </Form>
            <div className="mx-auto my-4 flex w-full items-center justify-evenly text-sm font-semibold text-gray-600 before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              or
            </div>
            <OAuthProviders />
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
  const { isSubmitting } = useFormState();

  return (
    <Button type="submit" className="w-full" aria-disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 size-6 animate-spin" />
          Login
        </>
      ) : (
        'Login'
      )}
    </Button>
  );
}

export { LoginFormSchema };
