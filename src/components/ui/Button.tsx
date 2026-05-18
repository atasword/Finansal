import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-gradient-to-r from-sage-400 to-sage-500 hover:from-sage-300 hover:to-sage-400 text-white shadow-sm shadow-sage-500/25 focus-visible:ring-sage-400/60',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-sage-800 dark:hover:bg-sage-700 dark:text-sage-100 border border-gray-200 dark:border-sage-700 focus-visible:ring-sage-400/60',
  ghost: 'hover:bg-gray-100 text-gray-600 dark:hover:bg-sage-800/70 dark:text-sage-300 focus-visible:ring-sage-400/60',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/25 focus-visible:ring-red-500/60',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer',
        'active:scale-[0.97] active:brightness-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-sage-900',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
export default Button;
