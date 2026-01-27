import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  subtitle?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = 'default',
  subtitle,
}: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const variantStyles = {
    default: 'bg-card border-border',
    primary: 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-transparent',
    success: 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-transparent',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-transparent',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white border-transparent',
  };

  const iconBgStyles = {
    default: 'bg-secondary',
    primary: 'bg-white/20',
    success: 'bg-white/20',
    warning: 'bg-white/20',
    danger: 'bg-white/20',
  };

  const textStyles = {
    default: 'text-foreground',
    primary: 'text-primary-foreground',
    success: 'text-white',
    warning: 'text-white',
    danger: 'text-white',
  };

  const subtextStyles = {
    default: 'text-muted-foreground',
    primary: 'text-primary-foreground/80',
    success: 'text-white/80',
    warning: 'text-white/80',
    danger: 'text-white/80',
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md animate-fade-in',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn('text-sm font-medium', subtextStyles[variant])}>
            {title}
          </p>
          <p className={cn('text-3xl font-bold tracking-tight', textStyles[variant])}>
            {value}
          </p>
          {subtitle && (
            <p className={cn('text-sm', subtextStyles[variant])}>
              {subtitle}
            </p>
          )}
          {(change !== undefined || changeLabel) && (
            <div className="flex items-center gap-1.5 pt-1">
              {change !== undefined && (
                <span
                  className={cn(
                    'flex items-center text-sm font-medium',
                    variant === 'default' && isPositive && 'text-emerald-600',
                    variant === 'default' && isNegative && 'text-red-600',
                    variant !== 'default' && 'text-white/90'
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
