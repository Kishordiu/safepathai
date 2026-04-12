import { cn } from '@/lib/utils';
import type { SafetyStatus } from '@/types';
import { Shield, Eye, AlertTriangle, AlertOctagon, Siren } from 'lucide-react';

const config: Record<SafetyStatus, { label: string; bg: string; text: string; icon: React.ElementType; pulse?: boolean }> = {
  safe: { label: 'Safe', bg: 'bg-safe/15', text: 'text-safe', icon: Shield },
  monitoring: { label: 'Monitoring', bg: 'bg-monitoring/15', text: 'text-monitoring', icon: Eye },
  suspicious: { label: 'Suspicious', bg: 'bg-suspicious/15', text: 'text-suspicious', icon: AlertTriangle },
  'high-risk': { label: 'High Risk', bg: 'bg-high-risk/15', text: 'text-high-risk', icon: AlertOctagon, pulse: true },
  emergency: { label: 'Emergency', bg: 'bg-emergency/15', text: 'text-emergency', icon: Siren, pulse: true },
};

interface StatusChipProps {
  status: SafetyStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusChip({ status, size = 'md', className }: StatusChipProps) {
  const c = config[status];
  const Icon = c.icon;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-semibold transition-all',
      c.bg, c.text, sizeClasses[size],
      c.pulse && 'animate-pulse-safe',
      className
    )}>
      <Icon className={cn(size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
      {c.label}
    </span>
  );
}
