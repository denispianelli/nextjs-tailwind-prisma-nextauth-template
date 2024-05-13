import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { CircleAlert } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'border-2 border-red-500 focus:border-0',
      },
    },
  },
);

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps & { variant?: 'default' | 'destructive' }
>(({ className, type, variant, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(InputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
      {variant === 'destructive' && (
        <CircleAlert className="absolute right-2 top-0 h-5 w-5 translate-y-2/4 text-red-500" />
      )}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
