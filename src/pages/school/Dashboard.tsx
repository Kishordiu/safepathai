import { useAppData } from '@/hooks/useAppData';
import { AlertCard } from '@/components/safepath/AlertCard';
import { StatCard } from '@/components/safepath/StatCard';
import { StatusChip } from '@/components/safepath/StatusChip';
import { AlertTriangle, ClipboardCheck, RadioTower, Route, School, Shield, Users } from 'lucide-react';

export default function SchoolDashboard() {
  const { children, alerts, wearables, pickupRecords, routes } = useAppData();
  const activeAlerts = alerts.filter((a) => !a.isRead).slice(0, 4);
  const riskCount = children.filter((c) => c.currentStatus !== 'safe').length;
  const onlineDevices = wearables.filter((w) => w.connectivityState === 'online').length;
  const mismatches = pickupRecords.filter((r) => r.mismatchFlag).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"><School className="h-3.5 w-3.5" /> School access</div>
        <h1 className="text-2xl font-bold">School dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor students, alerts, pickup status, and device health.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monitored Children" value={children.length} icon={Users} />
        <StatCard label="Active Alerts" value={activeAlerts.length} icon={AlertTriangle} variant={activeAlerts.length ? 'warning' : 'safe'} />
        <StatCard label="Students at Risk" value={riskCount} icon={Shield} variant={riskCount ? 'warning' : 'safe'} />
        <StatCard label="Devices Online" value={`${onlineDevices}/${wearables.length}`} icon={RadioTower} variant="safe" />
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <div className="rounded-[30px] border bg-card p-5 shadow-safe-md xl:col-span-3">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold">Student safety states</h3><StatusChip status={riskCount ? 'monitoring' : 'safe'} /></div>
          <div className="space-y-3">
            {children.map((child) => (
              <div key={child.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border bg-background p-4">
                <div>
                  <p className="font-semibold">{child.name}</p>
                  <p className="text-sm text-muted-foreground">{child.grade} • {child.school}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusChip status={child.currentStatus} />
                  <span className="text-xs text-muted-foreground">Parent: {child.parentName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="alerts" className="xl:col-span-2 space-y-4 scroll-mt-24">
          {activeAlerts.length ? activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />) : (
            <div className="rounded-[28px] border bg-card p-6 text-sm text-muted-foreground shadow-safe-md">No unresolved school-facing alert is active right now.</div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div id="pickup" className="rounded-[30px] border bg-card p-5 shadow-safe-md scroll-mt-24">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><ClipboardCheck className="h-4 w-4 text-primary" /> Pickup oversight</div>
          <div className="space-y-3 text-sm">
            <div className="rounded-2xl bg-background px-4 py-3">Verified today: <span className="font-semibold">{pickupRecords.filter((r) => !r.mismatchFlag).length}</span></div>
            <div className="rounded-2xl bg-background px-4 py-3 text-high-risk">Mismatch cases on record: <span className="font-semibold">{mismatches}</span></div>
            <p className="text-muted-foreground">School visibility focuses on authorized pickup, mismatch detection, and active response context.</p>
          </div>
        </div>
        <div id="devices" className="rounded-[30px] border bg-card p-5 shadow-safe-md scroll-mt-24">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><RadioTower className="h-4 w-4 text-primary" /> Device health</div>
          <div className="space-y-3">
            {wearables.slice(0, 4).map((device) => (
              <div key={device.id} className="rounded-2xl bg-background px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-2"><span className="font-medium">{device.deviceType} • {device.childName || 'Assigned child'}</span><span className="text-muted-foreground">{device.batteryLevel}%</span></div>
                <p className="mt-1 text-xs text-muted-foreground">Connectivity: {device.connectivityState.replace('-', ' ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="entry-exit" className="rounded-[30px] border bg-card p-5 shadow-safe-md scroll-mt-24">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Route className="h-4 w-4 text-primary" /> Entry / Exit Monitoring</div>
          <div className="space-y-3">
            {routes.slice(0, 3).map((route, index) => (
              <div key={`${route.childId}-${index}`} className="rounded-2xl bg-background px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-2"><span className="font-medium">Campus movement</span><span className="font-semibold">{route.stabilityScore}%</span></div>
                <p className="mt-1 text-xs text-muted-foreground">{route.anomalyFlags.length ? route.anomalyFlags.join(', ') : 'No entry / exit issue'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
