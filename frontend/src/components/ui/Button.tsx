import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  className = '',
  ...props
}: ButtonProps) => {

  const variants = {
    primary:
      'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,255,255,0.5)]',
    success:
      'bg-green-500 hover:bg-green-400 text-black',
    danger:
      'bg-red-500 hover:bg-red-400 text-white',
    outline:
      'border border-cyan-400 text-cyan-300 hover:bg-cyan-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        rounded-xl font-semibold transition-all
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
};