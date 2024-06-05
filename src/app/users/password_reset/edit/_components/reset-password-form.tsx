'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { resetPassword } from '@/app/users/password_reset/edit/_actions/reset-password';

import { useSearchParams, useRouter } from 'next/navigation';

import { z } from 'zod';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const ResetPasswordFormSchema = z
  .object({
    email: z.string().email().trim(),
    newPassword: z
      .string()
      .min(1, { message: 'Password is required.' })
      .min(8, { message: 'Be at least 8 characters long.' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^\w]/, { message: 'Contain at least one special character.' })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: 'You must confirm your password.' })
      .trim(),
  })
  .refine(
    (values) => {
      return values.newPassword === values.confirmPassword;
    },
    {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    },
  );

export default function ResetPasswordForm({
  isTokenValid,
}: {
  isTokenValid: boolean;
}) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: email ?? '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
    const result = await resetPassword(values);

    toast({
      title: result.message,
      variant: 'success',
    });

    router.replace('/login');
  }

  if (!isTokenValid) {
    router.replace('/login');

    toast({
      title: 'Invalid or expired token',
      variant: 'destructive',
    });

    return <Loader2 size={40} className="mx-auto animate-spin" />;
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
              <input type="hidden" name="email" value={email ?? undefined} />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      New password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormInput type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm new password{' '}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormInput type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ResetPasswordButton />
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

function ResetPasswordButton() {
  const { isSubmitting } = useFormState();

  return (
    <Button type="submit" className="w-full" aria-disabled={isSubmitting}>
      Submit
    </Button>
  );
}
