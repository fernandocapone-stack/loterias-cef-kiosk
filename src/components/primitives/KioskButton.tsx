import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-accent text-white hover:bg-accent-dark shadow-sm',
  secondary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  outline:   'bg-white text-primary border-2 border-primary hover:bg-primary/5',
  ghost:     'bg-transparent text-white/70 hover:bg-white/10',
  danger:    'bg-danger text-white hover:bg-danger/90 shadow-sm',
  success:   'bg-success text-white hover:bg-success/90 shadow-sm',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-10 px-4 text-kiosk-xs rounded-lg gap-1.5',
  md: 'h-12 px-6 text-kiosk-sm rounded-lg gap-2',
  lg: 'h-14 sm:h-16 px-7 sm:px-9 text-kiosk-base rounded-lg gap-2.5',
};

const KioskButton = forwardRef<HTMLButtonElement, Props>(function KioskButton(
  { variant = 'primary', size = 'md', fullWidth, className = '', children, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className={cn(
        'font-semibold inline-flex items-center justify-center',
        'transition-colors duration-150',
        'disabled:opacity-40 disabled:pointer-events-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
});

export default KioskButton;
