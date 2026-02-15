import { motion } from 'framer-motion';
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
  disabled,
  ...props
}: ButtonProps) => {

  const variants = {
    primary:
      'bg-cyan-500 hover:bg-cyan-450 text-black shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]',
    success:
      'bg-green-500 hover:bg-green-450 text-black shadow-[0_0_15px_rgba(0,255,0,0.4)] hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]',
    danger:
      'bg-red-500 hover:bg-red-450 text-white shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]',
    outline:
      'border border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={`
        rounded-xl font-semibold transition-all relative
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        ) : leftIcon}
        {children}
      </span>

      {/* Ripple effect */}
      {!disabled && !isLoading && (
        <motion.span
          className="absolute inset-0 rounded-xl bg-white/20"
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.button>
  );
};