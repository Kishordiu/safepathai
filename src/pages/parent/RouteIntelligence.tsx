import { useAppData } from '@/hooks/useAppData';
import { MapCard } from '@/components/safepath/MapCard';
import { RiskScoreGauge } from '@/components/safepath/RiskScoreGauge';
import { AlertTriangle, BarChart3, Clock3, MapPin, Route } from 'lucide-react';

export default function RouteIntelligence() {
  const { children, routes } = useAppData();
  const child = children[0];
  const route = routes.find((r) => r.childId === child?.id) ?? routes[0];

  if (!child || !route) return null;

  const travelTimeTrend = [
    { day: 'Mon', time: 18 },
    { day: 'Tue', time: 17 },
    { day: 'Wed', time: 19 },
    { day: 'Thu', time: 20 },
    { day: 'Fri', time: route.travelTimeMins },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-semibold text-accent">
            <Route className="h-3.5 w-3.5" /> AI route intelligence
          </div>
          <h1 className="text-2xl font-bold">Usual route vs unusual route</h1>
          <p className="text-sm text-muted-foreground">This page explains how SafePath AI models travel rhythm, expected geofence movement, and stop points before escalating risk.</p>
        </div>
        <RiskScoreGauge score={route.stabilityScore} label="Route trust" size="sm" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border bg-card p-3 shadow-safe-lg">
          <MapCard
            className="border-0 shadow-none"
            height="h-[520px]"
            center={route.actualRoute[route.actualRoute.length - 1]}
            childPosition={route.actualRoute[route.actualRoute.length - 1]}
            expectedRoute={route.expectedRoute}
            actualRoute={route.actualRoute}
            geofences={[route.homeGeofence, route.schoolGeofence]}
            stopPoints={route.stopPoints}
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
            <h3 className="text-sm font-semibold">Model summary</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-2xl bg-background px-4 py-3">
                <p className="font-semibold">Expected commute</p>
                <p className="text-muted-foreground">{route.expectedTravelTimeMins} minutes between home and school geofences.</p>
              </div>
              <div className="rounded-2xl bg-background px-4 py-3">
                <p className="font-semibold">Observed commute</p>
                <p className="text-muted-foreground">{route.travelTimeMins} minutes with {route.stopPoints.length} identified stop point(s).</p>
              </div>
              <div className="rounded-2xl bg-background px-4 py-3">
                <p className="font-semibold">Anomaly flags</p>
                <p className="text-muted-foreground">{route.anomalyFlags.length ? route.anomalyFlags.join(', ') : 'None currently active'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
            <h3 className="text-sm font-semibold">Stop point interpretation</h3>
            <div className="mt-4 space-y-3">
              {route.stopPoints.map((sp, i) => (
                <div key={i} className="rounded-2xl border bg-background px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 font-semibold"><MapPin className={`h-4 w-4 ${sp.isExpected ? 'text-safe' : 'text-monitoring'}`} /> {sp.label || 'Stop point'}</div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${sp.isExpected ? 'bg-safe/10 text-safe' : 'bg-monitoring/10 text-monitoring'}`}>{sp.isExpected ? 'Expected' : 'Review'}</span>
                  </div>
                  <p className="mt-2 text-muted-foreground">Stop duration: {sp.durationMins} minutes. {sp.isExpected ? 'This aligns with the usual travel pattern.' : 'This stop extends outside the expected route model.'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Travel time trend</h3>
            <p className="text-sm text-muted-foreground">Weekly variance helps the model understand whether delays are routine or suspicious.</p>
          </div>
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex h-40 items-end gap-3">
          {travelTimeTrend.map((item) => (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-semibold">{item.time}m</span>
              <div className="w-full rounded-t-2xl gradient-primary" style={{ height: `${(item.time / 24) * 100}%` }} />
              <span className="text-xs text-muted-foreground">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <div className="inline-flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="h-4 w-4 text-monitoring" /> Deviation logic</div>
          <p className="mt-3 text-sm text-muted-foreground">Flags when route overlap drops, timing drifts, or stop behavior leaves the learned corridor.</p>
        </div>
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <div className="inline-flex items-center gap-2 text-sm font-semibold"><Clock3 className="h-4 w-4 text-primary" /> Timing logic</div>
          <p className="mt-3 text-sm text-muted-foreground">Uses historical commute windows to distinguish normal delays from suspicious lateness.</p>
        </div>
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <div className="inline-flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-safe" /> Geofence logic</div>
          <p className="mt-3 text-sm text-muted-foreground">Tracks entry and exit behavior at home and school so school transitions remain explainable and verifiable.</p>
        </div>
      </div>
    </div>
  );
}
