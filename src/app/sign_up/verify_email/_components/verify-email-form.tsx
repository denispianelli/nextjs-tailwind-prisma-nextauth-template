'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import clsx from 'clsx';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { Loader2, PenLine } from 'lucide-react';
import { TriangleAlert } from 'lucide-react';
import { Check } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useFormState } from 'react-dom';
import { verifyOTP } from '@/app/sign_up/verify_email/_actions/verify-otp';
import { Input } from '@/components/ui/input';
import { useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { resendOtp } from '@/app/sign_up/verify_email/_actions/resend-otp';

const FormSchema = z.object({
  emailDisabled: z.string().email(),
  email: z.string().email(),
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export function VerifyEmailForm() {
  const [state, action] = useFormState(verifyOTP, undefined);
  const [codeLinkAvailable, setCodeLinkAvailable] = useState(true);
  const [counter, setCounter] = useState(30);

  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    if (state?.successMessage) {
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }, [state?.successMessage, router]);

  useEffect(() => {
    const counterInterval = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          setCodeLinkAvailable(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(counterInterval);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emailDisabled: email ?? '',
      email: email ?? '',
      pin: '',
    },
  });

  async function handleSendNewCodeButtonClick() {
    if (!email) {
      return;
    }

    const response = await resendOtp(email);

    setCodeLinkAvailable(false);

    toast({
      description: `${response.message}`,
    });
  }

  return (
    <Form {...form}>
      <form
        action={action}
        className="flex w-auto flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
      >
        <FormLabel
          className="scroll-m-20 text-2xl font-semibold tracking-tight"
          htmlFor="email"
        >
          Verify your email
        </FormLabel>

        <div className="mb-6 flex items-center gap-1">
          <FormField
            control={form.control}
            name="emailDisabled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem hidden>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => router.push('/sign_up')}
          >
            {' '}
            <PenLine size={16} />
          </Button>
        </div>
        <FormDescription className="text-center">
          Please enter the verification code sent to your email.
        </FormDescription>

        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center space-y-4">
              {state?.errorMessage && (
                <p className="flex items-center gap-2 rounded-md border border-destructive bg-red-50 p-2 text-xs text-destructive">
                  <TriangleAlert size={16} />
                  {state.errorMessage}
                </p>
              )}
              {state?.successMessage && (
                <p className="flex items-center gap-2 rounded-md border bg-green-50 p-2 text-sm text-green-800">
                  <Check size={16} />
                  {state.successMessage}
                </p>
              )}
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot
                      className={clsx({
                        'border border-r-0 border-destructive':
                          state?.errors?.pin,
                      })}
                      index={0}
                    />
                    <InputOTPSlot
                      className={clsx({
                        'border border-r-0 border-destructive':
                          state?.errors?.pin,
                      })}
                      index={1}
                    />
                    <InputOTPSlot
                      className={clsx({
                        'border border-r-0 border-destructive':
                          state?.errors?.pin,
                      })}
                      index={2}
                    />
                    <InputOTPSlot
                      className={clsx({
                        'border border-r-0 border-destructive':
                          state?.errors?.pin,
                      })}
                      index={3}
                    />
                    <InputOTPSlot
                      className={clsx({
                        'border border-r-0 border-destructive':
                          state?.errors?.pin,
                      })}
                      index={4}
                    />
                    <InputOTPSlot
                      className={clsx({
                        'border border-destructive': state?.errors?.pin,
                      })}
                      index={5}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>

              {state?.errors?.pin ? (
                <p className="text-sm text-destructive">{state.errors.pin}</p>
              ) : (
                <p className="text-sm">&nbsp;</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <p
            className={clsx('text-xs font-medium', {
              'text-[#868B94]': !codeLinkAvailable,
            })}
          >
            Did not receive a code?
            <Button
              type="button"
              className="px-1 text-xs "
              variant="link"
              disabled={!codeLinkAvailable}
              onClick={handleSendNewCodeButtonClick}
            >
              Send a new one{codeLinkAvailable ? '' : ` in ${counter}s`}
            </Button>
          </p>
        </div>
        <VerifyOtpButton />
      </form>
    </Form>
  );
}

function VerifyOtpButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <div className="flex gap-1">
          <Loader2 size={16} /> Please wait
        </div>
      ) : (
        'Submit'
      )}
    </Button>
  );
}
