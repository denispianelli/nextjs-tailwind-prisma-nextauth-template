'use client';

import { useEffect } from 'react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-muted/40">
      <Card>
        <CardHeader>
          <CardTitle className="mx-auto">Something went wrong!</CardTitle>
          <CardDescription>
            We&apos;re sorry, something went wrong. Please try again.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="mx-auto" onClick={() => reset()}>
            Try again
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
