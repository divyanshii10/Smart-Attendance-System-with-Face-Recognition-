import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatusIndicatorProps {
    status: 'active' | 'inactive' | 'warning' | 'error';
    label: string;
    description?: string;
    icon?: ReactNode;
}

export const StatusIndicator = ({ status, label, description, icon }: StatusIndicatorProps) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'active':
                return {
                    dot: 'bg-green-500 shadow-glow-green',
                    text: 'text-green-400',
                    bg: 'bg-green-500/10 border-green-500/30',
                };
            case 'warning':
                return {
                    dot: 'bg-yellow-500 shadow-[0_0_10px_rgba(255,255,0,0.5)]',
                    text: 'text-yellow-400',
                    bg: 'bg-yellow-500/10 border-yellow-500/30',
                };
            case 'error':
                return {
                    dot: 'bg-red-500 shadow-glow-red',
                    text: 'text-red-400',
                    bg: 'bg-red-500/10 border-red-500/30',
                };
            default:
                return {
                    dot: 'bg-gray-500',
                    text: 'text-gray-400',
                    bg: 'bg-gray-500/10 border-gray-500/30',
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${styles.bg} backdrop-blur-sm`}
        >
            {/* Pulsing status dot */}
            <div className="relative">
                <motion.div
                    className={`w-3 h-3 rounded-full ${styles.dot}`}
                    animate={status === 'active' ? {
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1],
                    } : {}}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                {status === 'active' && (
                    <motion.div
                        className={`absolute inset-0 rounded-full ${styles.dot}`}
                        animate={{
                            scale: [1, 2],
                            opacity: [0.5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                    />
                )}
            </div>

            {/* Icon (optional) */}
            {icon && <div className={styles.text}>{icon}</div>}

            {/* Label and description */}
            <div className="flex-1">
                <p className={`text-sm font-medium ${styles.text}`}>{label}</p>
                {description && (
                    <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                )}
            </div>
        </motion.div>
    );
};
