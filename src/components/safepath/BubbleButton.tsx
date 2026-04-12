import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface BubbleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'safe' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variants = {
  primary: 'gradient-primary text-white shadow-safe-md hover:shadow-safe-lg',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border-2 border-primary/20 text-primary bg-transparent hover:bg-primary/5',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  safe: 'gradient-safe text-white shadow-safe-md hover:shadow-safe-lg',
  danger: 'gradient-risk text-white shadow-safe-md hover:shadow-safe-lg',
};

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

export const BubbleButton = forwardRef<HTMLButtonElement, BubbleButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
        'hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
BubbleButton.displayName = 'BubbleButton';
