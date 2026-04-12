import { useAppData } from '@/hooks/useAppData';
import { ExportButton } from '@/components/safepath/ExportButton';
import { TimelineSection } from '@/components/safepath/TimelineSection';
import { Badge } from '@/components/ui/badge';
import { Battery, CalendarDays, MapPin, Radio } from 'lucide-react';

export default function HistoryPage() {
  const { children, routes, alerts, timelineEvents, wearables } = useAppData();
  const child = children[0];
  const route = routes.find((r) => r.childId === child?.id) ?? routes[0];
  const device = wearables.find((w) => w.id === child?.assignedWearableId || w.childId === child?.id);
  const childAlerts = alerts.filter((a) => a.childId === child?.id);

  if (!child || !device) return <div className="rounded-3xl border bg-card p-6">No history available yet.</div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"><CalendarDays className="h-3.5 w-3.5" /> History</div>
          <h1 className="text-2xl font-bold">Activity history</h1>
          <p className="text-sm text-muted-foreground">Movement updates, alerts, and device status.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1.5">Today</Badge>
          <ExportButton label="Export PDF" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md"><p className="text-sm text-muted-foreground">Battery</p><div className="mt-3 flex items-center gap-3"><div className="rounded-2xl bg-primary/10 p-3"><Battery className="h-5 w-5 text-primary" /></div><div><p className="text-xl font-bold">{device.batteryLevel}%</p></div></div></div>
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md"><p className="text-sm text-muted-foreground">Connectivity</p><div className="mt-3 flex items-center gap-3"><div className="rounded-2xl bg-accent/10 p-3"><Radio className="h-5 w-5 text-accent" /></div><div><p className="text-xl font-bold capitalize">{device.connectivityState.replace('-', ' ')}</p></div></div></div>
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md"><p className="text-sm text-muted-foreground">Latest position</p><div className="mt-3 flex items-center gap-3"><div className="rounded-2xl bg-safe/10 p-3"><MapPin className="h-5 w-5 text-safe" /></div><div><p className="text-sm font-bold break-all">{route?.actualRoute?.length ? `${route.actualRoute[route.actualRoute.length - 1].lat.toFixed(6)}, ${route.actualRoute[route.actualRoute.length - 1].lng.toFixed(6)}` : 'Waiting for GPS data'}</p></div></div></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <TimelineSection events={timelineEvents} className="xl:col-span-3" title="Timeline" />
        <div className="rounded-[28px] border bg-card p-5 xl:col-span-2 shadow-safe-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Alert history</h3>
            <span className="text-xs text-muted-foreground">{childAlerts.length} events</span>
          </div>
          <div className="space-y-3">
            {childAlerts.length ? childAlerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl border bg-background p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge className="rounded-full" variant="secondary">{alert.severity}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm font-medium">{alert.triggerReason}</p>
              </div>
            )) : <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">No alerts yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
