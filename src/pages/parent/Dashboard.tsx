import { Link } from 'react-router-dom';
import { useAppData } from '@/hooks/useAppData';
import { StatusChip } from '@/components/safepath/StatusChip';
import { StatCard } from '@/components/safepath/StatCard';
import { AlertCard } from '@/components/safepath/AlertCard';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { AlertTriangle, Battery, MapPin, Shield, UserCircle, Wifi } from 'lucide-react';

export default function ParentDashboard() {
  const { children, wearables, alerts, routes, loading } = useAppData();

  const child = children[0];
  const device = wearables.find((w) => w.id === child?.assignedWearableId || w.childId === child?.id);
  const route = routes.find((r) => r.childId === child?.id) ?? routes[0];
  const activeAlerts = alerts.filter((a) => !a.isRead);
  const latestPoint = route?.actualRoute?.length ? route.actualRoute[route.actualRoute.length - 1] : null;

  if (loading) return <div className="rounded-3xl border bg-card p-6">Loading...</div>;
  if (!child || !device) return <div className="rounded-3xl border bg-card p-6">No child data available yet.</div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <section className="rounded-[28px] border bg-card p-5 shadow-safe-md sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary"><UserCircle className="h-7 w-7 text-white" /></div>
              <div>
                <h1 className="text-2xl font-bold">{child.name}</h1>
                <p className="text-sm text-muted-foreground">{child.grade} • {child.school}</p>
              </div>
            </div>
            <StatusChip status={child.currentStatus} size="sm" />
            <p className="text-sm text-muted-foreground">Current child status, latest device state, and recent alerts.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/tracking"><BubbleButton><MapPin className="h-4 w-4" /> Tracking</BubbleButton></Link>
            <Link to="/alerts"><BubbleButton variant="outline"><AlertTriangle className="h-4 w-4" /> Alerts</BubbleButton></Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Battery" value={`${device.batteryLevel}%`} icon={Battery} variant={device.batteryLevel > 25 ? 'safe' : 'warning'} />
        <StatCard label="Connectivity" value={device.connectivityState.replace('-', ' ')} icon={Wifi} variant={device.connectivityState === 'online' ? 'safe' : 'warning'} />
        <StatCard label="Open Alerts" value={activeAlerts.length} icon={AlertTriangle} variant={activeAlerts.length ? 'warning' : 'safe'} />
        <StatCard label="Current State" value={child.currentStatus} icon={Shield} variant={child.currentStatus === 'safe' ? 'safe' : 'warning'} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <h2 className="text-base font-semibold">Latest location</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-2xl bg-background px-4 py-3">
              <p className="font-medium">Coordinates</p>
              <p className="mt-1 break-all text-muted-foreground">
                {latestPoint ? `${latestPoint.lat.toFixed(6)}, ${latestPoint.lng.toFixed(6)}` : 'Waiting for GPS data'}
              </p>
            </div>
            <div className="rounded-2xl bg-background px-4 py-3">
              <p className="font-medium">Last sync</p>
              <p className="mt-1 text-muted-foreground">{device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Not available'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <h2 className="text-base font-semibold">Recent alerts</h2>
          <div className="mt-4 space-y-3">
            {activeAlerts.length ? activeAlerts.slice(0, 2).map((a) => <AlertCard key={a.id} alert={a} />) : (
              <div className="rounded-2xl bg-background px-4 py-6 text-sm text-muted-foreground">No active alerts.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
