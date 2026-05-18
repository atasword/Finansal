import { InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-gray-700 dark:text-sage-200 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-gray-200 dark:border-sage-700 bg-gray-50 dark:bg-sage-800/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-sage-100 placeholder:text-gray-400 dark:placeholder:text-sage-600',
          'focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-400 dark:focus:border-sage-400',
          'hover:border-gray-300 dark:hover:border-sage-600',
          'transition-all duration-150',
          error && 'border-red-400 dark:border-red-500 focus:ring-red-400/40 focus:border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-gray-700 dark:text-sage-200 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-gray-200 dark:border-sage-700 bg-gray-50 dark:bg-sage-800/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-sage-100',
          'focus:outline-none focus:ring-2 focus:ring-sage-400/50 focus:border-sage-400 dark:focus:border-sage-400',
          'hover:border-gray-300 dark:hover:border-sage-600',
          'transition-all duration-150 cursor-pointer',
          error && 'border-red-400 dark:border-red-500 focus:ring-red-400/40 focus:border-red-400',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';
