import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  animate?: boolean;
}

export const Card = ({ children, className = "", title, animate = true }: CardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    ref,
    initial: { opacity: 0, y: 20 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.5, ease: "easeOut" }
  } : {};

  return (
    <Component
      {...animationProps}
      className={`
        rounded-2xl
        border border-white/[0.06]
        bg-[#111827]
        shadow-[0_4px_24px_rgba(0,0,0,0.3)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-300
        p-5
        text-white
        ${className}
      `}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-[#E5E7EB]">{title}</h3>
      )}
      {children}
    </Component>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

// Animated counter component
const AnimatedCounter = ({ value }: { value: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return <span ref={ref}>{displayValue}</span>;
};

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = 'blue'
}: StatCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isNumeric = typeof value === 'number';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`
        rounded-2xl
        border border-white/[0.06]
        bg-[#111827]
        p-6
        text-white
        shadow-[0_4px_24px_rgba(0,0,0,0.3)]
        cursor-pointer
        transition-all duration-300
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#9CA3AF]">{title}</p>
          <motion.p
            className="text-3xl font-bold mt-2 text-[#E5E7EB]"
            initial={{ scale: 0.8 }}
            animate={isInView ? { scale: 1 } : { scale: 0.8 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            {isNumeric ? <AnimatedCounter value={value} /> : value}
          </motion.p>

          {trend && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.4 }}
              className={`text-sm mt-2 ${trend.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </motion.p>
          )}
        </div>

        <motion.div
          className="p-4 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};