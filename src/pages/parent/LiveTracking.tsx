import { useMemo } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { MapCard } from '@/components/safepath/MapCard';
import { StatusChip } from '@/components/safepath/StatusChip';
import { Battery, Clock, MapPin, Radio, Wifi } from 'lucide-react';

export default function LiveTracking() {
  const { children, wearables, routes } = useAppData();
  const child = children[0];
  const device = wearables.find((w) => w.id === child?.assignedWearableId || w.childId === child?.id);
  const route = routes.find((r) => r.childId === child?.id) ?? routes[0];
  const currentPos = route?.actualRoute?.length ? route.actualRoute[route.actualRoute.length - 1] : undefined;
  const hasMapData = !!currentPos;

  const geofences = useMemo(() => {
    if (!route) return [];
    return [route.homeGeofence, route.schoolGeofence].filter(Boolean);
  }, [route]);

  if (!child || !device) return <div className="rounded-3xl border bg-card p-6">No tracking data available yet.</div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live tracking</h1>
          <p className="text-sm text-muted-foreground">Map shows only real GPS points received from the device.</p>
        </div>
        <StatusChip status={child.currentStatus} size="lg" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[30px] border bg-card p-3 shadow-safe-lg">
          {hasMapData ? (
            <MapCard
              center={currentPos}
              childPosition={currentPos}
              actualRoute={route?.actualRoute ?? []}
              geofences={geofences}
              stopPoints={[]}
              height="h-[420px] md:h-[560px]"
              className="border-0 shadow-none"
            />
          ) : (
            <div className="flex h-[420px] md:h-[560px] items-center justify-center rounded-2xl bg-background text-center text-sm text-muted-foreground">
              Waiting for real GPS coordinates from the device.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
            <h3 className="text-sm font-semibold">Current position</h3>
            <div className="mt-4 rounded-2xl bg-background px-4 py-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4" />
                <span className="break-all">{currentPos ? `${currentPos.lat.toFixed(6)}, ${currentPos.lng.toFixed(6)}` : 'No GPS fix yet'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
            <h3 className="text-sm font-semibold">Device</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-muted-foreground"><Battery className="h-4 w-4" /> Battery</span><span className="font-semibold">{device.batteryLevel}%</span></div>
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-muted-foreground"><Wifi className="h-4 w-4" /> Signal</span><span className="font-semibold">{device.signalStrength}%</span></div>
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-muted-foreground"><Radio className="h-4 w-4" /> Connectivity</span><span className="font-semibold capitalize">{device.connectivityState.replace('-', ' ')}</span></div>
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Last sync</span><span className="font-semibold">{device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Not available'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
