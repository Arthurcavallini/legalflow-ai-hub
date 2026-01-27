import { cn } from '@/lib/utils';

interface CircularGaugeProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

export function CircularGauge({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  className,
  variant = 'primary',
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(value / max, 1);
  const offset = circumference - percentage * circumference;

  const gradientColors = {
    primary: { start: 'hsl(36, 100%, 55%)', end: 'hsl(25, 80%, 45%)' },
    success: { start: 'hsl(142, 60%, 50%)', end: 'hsl(142, 60%, 35%)' },
    warning: { start: 'hsl(36, 100%, 55%)', end: 'hsl(25, 80%, 45%)' },
    danger: { start: 'hsl(0, 72%, 55%)', end: 'hsl(0, 72%, 40%)' },
  };

  const colors = gradientColors[variant];
  const gradientId = `gauge-gradient-${variant}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-border"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${colors.start})`,
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-2xl font-bold text-foreground">{label}</span>
        )}
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
