'use client';

import { updateProfile } from '@/app/users/(settings)/profile/edit/_actions/profile';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { User } from '@/lib/definitions';
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

const updateProfileSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: 'At least 2 characters.' })
    .max(255)
    .optional()
    .or(z.literal('')),
  lastname: z
    .string()
    .min(2, { message: 'At least 2 characters.' })
    .max(255)
    .optional()
    .or(z.literal('')),
  email: z.string().email(),
});

export function ProfileForm({ user }: { user: User }) {
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email,
    },
  });

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    const result = await updateProfile(values, user.id);

    if (result?.message) {
      form.setError('email', {
        message: result.message,
      });
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <FormInput {...field} placeholder="Max" />
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
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <FormInput {...field} placeholder="Robinson" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <FormInput type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <UpdateProfileButton />
            </CardFooter>
          </Card>{' '}
        </form>
      </Form>
    </div>
  );
}

function UpdateProfileButton() {
  const { isSubmitting } = useFormState();
  const router = useRouter();

  return (
    <Button
      type="submit"
      aria-disabled={isSubmitting}
      onClick={() => isSubmitting && router.refresh()}
    >
      {isSubmitting ? (
        <Loader2 className="size-6 animate-spin"></Loader2>
      ) : (
        'Save'
      )}
    </Button>
  );
}
