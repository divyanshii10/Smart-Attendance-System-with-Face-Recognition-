import { motion } from 'framer-motion';
import { useState, InputHTMLAttributes } from 'react';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const AnimatedInput = ({ label, error, icon, className = '', ...props }: AnimatedInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(e.target.value.length > 0);
        props.onChange?.(e);
    };

    return (
        <div className="relative">
            {/* Icon */}
            {icon && (
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? 'text-neon-cyan' : 'text-gray-400'
                    }`}>
                    {icon}
                </div>
            )}

            {/* Input */}
            <motion.input
                {...props}
                onChange={handleChange}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
                className={`
          w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
          bg-white/5 backdrop-blur-sm
          border-2 transition-all duration-300
          ${error
                        ? 'border-red-500/50 focus:border-red-500'
                        : isFocused
                            ? 'border-neon-cyan shadow-glow-cyan'
                            : 'border-white/10 hover:border-white/20'
                    }
          rounded-lg
          text-white placeholder-gray-500
          outline-none
          ${className}
        `}
                whileFocus={{
                    scale: 1.01,
                }}
            />

            {/* Floating label */}
            {label && (
                <motion.label
                    animate={{
                        top: isFocused || hasValue ? '-0.5rem' : '50%',
                        fontSize: isFocused || hasValue ? '0.75rem' : '1rem',
                        color: error ? '#EF4444' : isFocused ? '#00FFFF' : '#9CA3AF',
                    }}
                    className={`
            absolute ${icon ? 'left-10' : 'left-4'}
            -translate-y-1/2
            px-2 bg-cyber-dark
            pointer-events-none
            font-medium
            transition-colors
          `}
                >
                    {label}
                </motion.label>
            )}

            {/* Error message */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1 ml-1"
                >
                    {error}
                </motion.p>
            )}

            {/* Glow effect on focus */}
            {isFocused && !error && (
                <motion.div
                    layoutId="input-glow"
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            )}
        </div>
    );
};
