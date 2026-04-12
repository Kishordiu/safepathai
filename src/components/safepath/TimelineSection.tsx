import { cn } from '@/lib/utils';
import { Home, MapPin, School, CheckCircle, Wifi, Route } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  home: Home, route: Route, stop: MapPin, school: School, check: CheckCircle, signal: Wifi,
};

const statusColor: Record<string, string> = {
  safe: 'bg-safe text-safe-foreground',
  monitoring: 'bg-monitoring text-monitoring-foreground',
  suspicious: 'bg-suspicious text-suspicious-foreground',
  'high-risk': 'bg-high-risk text-high-risk-foreground',
};

interface TimelineEvent {
  time: string;
  event: string;
  status: 'safe' | 'monitoring' | 'suspicious' | 'high-risk';
  icon: string;
}

interface TimelineSectionProps {
  events: TimelineEvent[];
  title?: string;
  className?: string;
}

export function TimelineSection({ events, title = "Today's Timeline", className }: TimelineSectionProps) {
  return (
    <div className={cn('rounded-2xl border bg-card p-5', className)}>
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-0">
        {events.map((ev, i) => {
          const Icon = iconMap[ev.icon] || MapPin;
          return (
            <div key={i} className="flex items-start gap-3 relative">
              {i < events.length - 1 && (
                <div className="absolute left-[13px] top-7 bottom-0 w-px bg-border" />
              )}
              <div className={cn('w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 z-10', statusColor[ev.status])}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="pb-4 min-w-0">
                <p className="text-sm font-medium">{ev.event}</p>
                <p className="text-xs text-muted-foreground">{ev.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
