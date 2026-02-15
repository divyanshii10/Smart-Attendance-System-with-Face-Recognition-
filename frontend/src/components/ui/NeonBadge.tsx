import { motion } from 'framer-motion';

interface NeonBadgeProps {
    label: string;
    color?: 'cyan' | 'green' | 'red' | 'yellow' | 'blue' | 'purple';
    variant?: 'solid' | 'outline' | 'glow';
    pulse?: boolean;
    className?: string;
}

export const NeonBadge = ({
    label,
    color = 'cyan',
    variant = 'solid',
    pulse = false,
    className = ''
}: NeonBadgeProps) => {

    const colorStyles = {
        cyan: {
            solid: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50',
            outline: 'bg-transparent text-neon-cyan border-neon-cyan',
            glow: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan shadow-glow-cyan',
        },
        green: {
            solid: 'bg-green-500/20 text-green-400 border-green-500/50',
            outline: 'bg-transparent text-green-400 border-green-500',
            glow: 'bg-green-500/20 text-green-400 border-green-500 shadow-glow-green',
        },
        red: {
            solid: 'bg-red-500/20 text-red-400 border-red-500/50',
            outline: 'bg-transparent text-red-400 border-red-500',
            glow: 'bg-red-500/20 text-red-400 border-red-500 shadow-glow-red',
        },
        yellow: {
            solid: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            outline: 'bg-transparent text-yellow-400 border-yellow-500',
            glow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500 shadow-[0_0_20px_rgba(255,255,0,0.5)]',
        },
        blue: {
            solid: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            outline: 'bg-transparent text-blue-400 border-blue-500',
            glow: 'bg-blue-500/20 text-blue-400 border-blue-500 shadow-glow-blue',
        },
        purple: {
            solid: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
            outline: 'bg-transparent text-purple-400 border-purple-500',
            glow: 'bg-purple-500/20 text-purple-400 border-purple-500 shadow-glow-purple',
        },
    };

    const Component = pulse ? motion.span : 'span';
    const animationProps = pulse ? {
        animate: {
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1],
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        }
    } : {};

    return (
        <Component
            {...animationProps}
            className={`
        inline-flex items-center px-2.5 py-1
        text-xs font-semibold
        rounded-full border
        backdrop-blur-sm
        ${colorStyles[color][variant]}
        ${className}
      `}
        >
            {label}
        </Component>
    );
};
