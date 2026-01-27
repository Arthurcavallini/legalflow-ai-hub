import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  className,
  variant = 'primary',
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const gradients = {
    primary: 'from-primary to-accent',
    success: 'from-success to-success/70',
    warning: 'from-warning to-warning/70',
    danger: 'from-destructive to-destructive/70',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full rounded-full bg-border/50', heights[size])}>
        <div
          className={cn(
            'rounded-full bg-gradient-to-r transition-all duration-500 ease-out',
            heights[size],
            gradients[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground mt-1">{Math.round(percentage)}%</span>
      )}
    </div>
  );
}
