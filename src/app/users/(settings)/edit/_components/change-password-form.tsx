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
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/lib/definitions';

const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'Password is required.' })
    .trim(),
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
});

export default function ChangePasswordForm({ user }: { user: User }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
    const result = await changePassword(values, user.id);

    if (result.errors) {
      toast({
        title: 'Error',
        description:
          result.errors.currentPassword || result.errors.confirmPassword,
        variant: 'destructive',
      });
    }

    if (result.message) {
      toast({
        title: 'Success',
        description: result.message,
        variant: 'success',
      });
      form.reset();
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Change your password</CardTitle>
              <div className="text-muted-foreground">
                <p className="mt-2 text-xs">Your password must:</p>
                <ul className="list-inside list-disc text-xs">
                  <li className="ml-2">Be at least 8 characters long</li>
                  <li className="ml-2">Contain at least one letter</li>
                  <li className="ml-2">Contain at least one number</li>
                  <li className="ml-2">
                    Contain at least one special character
                  </li>
                </ul>
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Current Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormInput
                        type="password"
                        placeholder="Enter your current password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      New Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormInput
                        type="password"
                        placeholder="Enter your new password"
                        {...field}
                      />
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
                      Confirm Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormInput
                        type="password"
                        placeholder="Confirm your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <ChangePasswordButton />
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

function ChangePasswordButton() {
  const { isSubmitting } = useFormState();

  return (
    <Button type="submit" aria-disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 size-6 animate-spin" />
          Save
        </>
      ) : (
        'Save'
      )}
    </Button>
  );
}
