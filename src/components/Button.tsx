import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'outline' | 'ghost' | 'icon';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  outline:
    'border border-primary text-primary px-lg py-sm rounded hover:bg-primary/10 transition-colors font-label-caps text-label-caps flex items-center gap-sm',
  ghost:
    'text-on-surface-variant hover:text-on-background px-lg py-sm rounded transition-colors font-label-caps text-label-caps flex items-center gap-sm',
  icon: 'p-sm rounded-md border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all duration-200 flex items-center justify-center bg-surface-container',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const Button = ({ variant = 'outline', className = '', children, ...rest }: ButtonProps) => {
  return (
    <button type="button" className={`${VARIANT_CLASSES[variant]} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
};

export default Button;
