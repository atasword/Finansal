import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white/92 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-200/70 dark:border-white/[0.06] shadow-sm shadow-gray-200/50 dark:shadow-black/30 hover:shadow-lg hover:shadow-gray-200/60 dark:hover:shadow-black/40 dark:hover:border-white/[0.09] transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-100/80 dark:border-gray-800/80 flex items-center justify-between', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-gray-100/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-800/20 rounded-b-2xl', className)}
      {...props}
    />
  );
}
