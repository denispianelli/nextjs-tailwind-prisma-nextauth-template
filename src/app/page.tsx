'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { Check, Copy, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [copied, setCopied] = useState(false);

  const text = `npx create-next-app -e https://github.com/denispianelli/nextjs-tailwind-prisma-nextauth-template my-app`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <main className="flex h-[calc(100vh-64px)] flex-col items-center justify-center bg-muted/40">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        Welcome to your new app!
      </h1>
      <Alert className="mt-6  w-auto">
        <Terminal className="h-4 w-4" />
        <AlertTitle className="text-sm">
          {' '}
          ~ npx create-next-app -e
          https://github.com/denispianelli/nextjs-tailwind-prisma-nextauth-template
          my-app
          <Button variant="default" onClick={copyToClipboard} className="ml-4">
            <Copy
              className={clsx('h-4 w-4 ease-in-out', {
                hidden: copied,
              })}
            />
            <Check
              className={clsx('h-4 w-4 ease-in-out', {
                hidden: !copied,
              })}
            />
          </Button>
        </AlertTitle>
      </Alert>
    </main>
  );
}
