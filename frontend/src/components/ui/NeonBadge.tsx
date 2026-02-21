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
            solid: 'bg-[#4F46E5]/15 text-[#4F46E5] border-[#4F46E5]/40',
            outline: 'bg-transparent text-[#4F46E5] border-[#4F46E5]',
            glow: 'bg-[#4F46E5]/15 text-[#4F46E5] border-[#4F46E5]/40',
        },
        green: {
            solid: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40',
            outline: 'bg-transparent text-[#10B981] border-[#10B981]',
            glow: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40',
        },
        red: {
            solid: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40',
            outline: 'bg-transparent text-[#EF4444] border-[#EF4444]',
            glow: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40',
        },
        yellow: {
            solid: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40',
            outline: 'bg-transparent text-yellow-400 border-yellow-500',
            glow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40',
        },
        blue: {
            solid: 'bg-[#4F46E5]/15 text-[#4F46E5] border-[#4F46E5]/40',
            outline: 'bg-transparent text-[#4F46E5] border-[#4F46E5]',
            glow: 'bg-[#4F46E5]/15 text-[#4F46E5] border-[#4F46E5]/40',
        },
        purple: {
            solid: 'bg-[#4F46E5]/15 text-[#4F46E5] border-[#4F46E5]/40',
            outline: 'bg-transparent text-[#4F46E5] border-[#4F46E5]',
            glow: 'bg-[#4F46E5]/15 text-[#4F46E5] border-[#4F46E5]/40',
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
