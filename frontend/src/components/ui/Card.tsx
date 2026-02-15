import { ReactNode } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`
        rounded-2xl
        border border-cyan-400/20
        bg-white/5
        backdrop-blur-2xl
        shadow-[0_0_25px_rgba(0,255,255,0.08)]
        hover:shadow-[0_0_40px_rgba(0,255,255,0.18)]
        transition-all duration-300
        p-5
        text-white
        ${className}
      `}
    >
      {children}
    </div>
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

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = 'blue'
}: StatCardProps) => {

  const glow = {
    blue: 'shadow-cyan-500/30',
    green: 'shadow-green-500/30',
    red: 'shadow-red-500/30',
    yellow: 'shadow-yellow-500/30',
  };

  return (
    <div
      className={`
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
        text-white
        shadow-lg ${glow[color]}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-200">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>

          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>

        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};