import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'safe' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border',
  safe: 'bg-safe/5 border-safe/20',
  warning: 'bg-monitoring/5 border-monitoring/20',
  danger: 'bg-high-risk/5 border-high-risk/20',
};

const iconVariant = {
  default: 'bg-primary/10 text-primary',
  safe: 'bg-safe/15 text-safe',
  warning: 'bg-monitoring/15 text-monitoring',
  danger: 'bg-high-risk/15 text-high-risk',
};

export function StatCard({ label, value, subtitle, icon: Icon, trend, trendValue, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-safe-md',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trendValue && (
            <p className={cn('text-xs font-medium', trend === 'up' ? 'text-safe' : trend === 'down' ? 'text-high-risk' : 'text-muted-foreground')}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        <div className={cn('rounded-xl p-2.5', iconVariant[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
