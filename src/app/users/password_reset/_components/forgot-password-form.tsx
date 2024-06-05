'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { forgotPassword } from '@/app/users/password_reset/_actions/forgot-password';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
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

const ForgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Please enter a valid email.' })
    .trim(),
});

export function ForgotPasswordForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof ForgotPasswordFormSchema>) {
    const result = await forgotPassword(values);

    toast({
      title: 'Password reset link sent',
      description: result.message,
    });
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
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
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ForgotPasswordButton />
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

function ForgotPasswordButton() {
  const { isSubmitting } = useFormState();

  return (
    <Button type="submit" aria-disabled={isSubmitting}>
      {isSubmitting ? (
        <Loader2 className="size-6 animate-spin"></Loader2>
      ) : (
        'Submit'
      )}
    </Button>
  );
}
