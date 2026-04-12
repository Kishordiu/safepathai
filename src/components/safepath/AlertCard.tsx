import { cn } from '@/lib/utils';
import type { Alert } from '@/types';
import { ChevronDown, ChevronUp, Bell, MessageSquare, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

const severityStyles = {
  low: 'border-l-safe',
  medium: 'border-l-monitoring',
  high: 'border-l-suspicious',
  critical: 'border-l-high-risk',
};

const channelIcons: Record<string, React.ElementType> = {
  app: Bell,
  sms: MessageSquare,
  email: Mail,
  call: Phone,
};

interface AlertCardProps {
  alert: Alert;
  className?: string;
}

export function AlertCard({ alert, className }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const timeAgo = getTimeAgo(alert.timestamp);

  return (
    <div className={cn(
      'rounded-2xl border border-l-4 bg-card p-4 transition-all hover:shadow-safe-md cursor-pointer',
      severityStyles[alert.severity],
      !alert.isRead && 'ring-1 ring-primary/20',
      className
    )} onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-semibold',
              alert.severity === 'critical' ? 'bg-high-risk/15 text-high-risk' :
              alert.severity === 'high' ? 'bg-suspicious/15 text-suspicious' :
              alert.severity === 'medium' ? 'bg-monitoring/15 text-monitoring' :
              'bg-safe/15 text-safe'
            )}>
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">{alert.childName}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            {!alert.isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
          </div>
          <p className="mt-1.5 text-sm font-medium leading-snug">{alert.triggerReason}</p>
          <div className="mt-2 flex items-center gap-1.5">
            {alert.deliveries.map((d, i) => {
              const Icon = channelIcons[d.channel] || Bell;
              return (
                <span key={i} className={cn(
                  'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs',
                  d.deliveredStatus === 'delivered' ? 'bg-safe/10 text-safe' :
                  d.deliveredStatus === 'pending' ? 'bg-monitoring/10 text-monitoring' :
                  'bg-muted text-muted-foreground'
                )}>
                  <Icon className="w-3 h-3" />
                  {d.channel.toUpperCase()}
                </span>
              );
            })}
            <span className="ml-auto text-xs text-muted-foreground">
              Confidence: {alert.confidence}%
            </span>
          </div>
        </div>
        <button className="p-1 rounded-lg hover:bg-muted transition-colors" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-border space-y-3 animate-fade-in">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Why This Was Flagged</p>
            <ul className="space-y-1">
              {alert.contributingConditions.map((c, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div><span className="text-muted-foreground">Risk Type: </span><span className="font-medium">{alert.predictedRiskType}</span></div>
            <div><span className="text-muted-foreground">Trend: </span><span className={cn('font-medium', alert.trendStatus === 'escalating' ? 'text-high-risk' : alert.trendStatus === 'de-escalating' ? 'text-safe' : 'text-monitoring')}>{alert.trendStatus}</span></div>
            <div><span className="text-muted-foreground">Status: </span><span className="font-medium capitalize">{alert.escalationState}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
