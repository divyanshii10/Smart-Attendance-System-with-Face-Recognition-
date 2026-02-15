import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'warning' | 'error';
  label: string;
  description?: string;
  icon?: ReactNode;
}

export const StatusIndicator = ({
  status,
  label,
  description,
  icon,
}: StatusIndicatorProps) => {

  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return {
          dot: 'bg-purple-500',
          text: 'text-purple-400',
          bg: 'bg-purple-500/10 border-purple-500/30',
        };
      case 'warning':
        return {
          dot: 'bg-yellow-500',
          text: 'text-yellow-400',
          bg: 'bg-yellow-500/10 border-yellow-500/30',
        };
      case 'error':
        return {
          dot: 'bg-red-500',
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

      <motion.div
        className={`w-3 h-3 rounded-full ${styles.dot}`}
        animate={status === 'active'
          ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
          : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {icon && <div className={styles.text}>{icon}</div>}

      <div>
        <p className={`text-sm font-medium ${styles.text}`}>{label}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </motion.div>
  );
};