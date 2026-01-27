import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'accent' | 'warning' | 'danger';
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = 'default',
}: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const variantStyles = {
    default: 'bg-card border-border',
    accent: 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground border-transparent',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-transparent',
    danger: 'bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground border-transparent',
  };

  const iconBgStyles = {
    default: 'bg-secondary',
    accent: 'bg-white/20',
    warning: 'bg-white/20',
    danger: 'bg-white/20',
  };

  const textStyles = {
    default: 'text-foreground',
    accent: 'text-accent-foreground',
    warning: 'text-white',
    danger: 'text-destructive-foreground',
  };

  const subtextStyles = {
    default: 'text-muted-foreground',
    accent: 'text-accent-foreground/80',
    warning: 'text-white/80',
    danger: 'text-destructive-foreground/80',
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-5 shadow-card transition-all duration-200 hover:shadow-soft animate-fade-in',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn('text-sm font-medium', subtextStyles[variant])}>
            {title}
          </p>
          <p className={cn('text-3xl font-bold tracking-tight', textStyles[variant])}>
            {value}
          </p>
          {(change !== undefined || changeLabel) && (
            <div className="flex items-center gap-1.5">
              {change !== undefined && (
                <span
                  className={cn(
                    'flex items-center text-sm font-medium',
                    isPositive && 'text-emerald-500',
                    isNegative && 'text-red-500',
                    !isPositive && !isNegative && subtextStyles[variant]
                  )}
                >
                  {isPositive && <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
                  {isNegative && <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                  {isPositive && '+'}
                  {change}%
                </span>
              )}
              {changeLabel && (
                <span className={cn('text-sm', subtextStyles[variant])}>
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-xl',
            iconBgStyles[variant]
          )}
        >
          <Icon className={cn('w-6 h-6', textStyles[variant])} />
        </div>
      </div>
    </div>
  );
}
