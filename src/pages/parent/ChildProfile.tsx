import { useParams } from 'react-router-dom';
import { useAppData } from '@/hooks/useAppData';
import { StatusChip } from '@/components/safepath/StatusChip';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { AlertTriangle, Battery, Calendar, Clock, Home, Mail, Phone, School, ShieldCheck, UserCircle, Wifi } from 'lucide-react';

export default function ChildProfile() {
  const { id } = useParams();
  const { children, wearables, alerts, pickupRecords } = useAppData();

  const child = children.find((c) => c.id === id) || children[0];
  const device = wearables.find((w) => w.id === child?.assignedWearableId || w.childId === child?.id);
  const childAlerts = alerts.filter((a) => a.childId === child?.id);
  const childPickups = pickupRecords.filter((p) => p.childId === child?.id);

  if (!child || !device) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <UserCircle className="h-3.5 w-3.5" /> Child identity and trust profile
          </div>
          <h1 className="text-2xl font-bold">Child profile</h1>
          <p className="text-sm text-muted-foreground">Core identity, route context, device pairing, emergency contacts, and recent anomalies in one place.</p>
        </div>
        <BubbleButton variant="outline" size="sm">Edit profile</BubbleButton>
      </div>

      <div className="rounded-[32px] border bg-card p-6 shadow-safe-lg">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 items-center justify-center rounded-[26px] gradient-primary shadow-safe-glow">
            <UserCircle className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold">{child.name}</h2>
              <StatusChip status={child.currentStatus} />
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" /> {child.age} years old</span>
              <span className="inline-flex items-center gap-2"><School className="h-4 w-4" /> {child.grade} • {child.school}</span>
              <span className="inline-flex items-center gap-2"><Home className="h-4 w-4" /> Home geofence configured</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> {child.routineSchedule.schoolStart} – {child.routineSchedule.schoolEnd}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <h3 className="mb-4 text-sm font-semibold">Assigned wearable</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Device ID</span><span className="font-mono text-xs">{device.id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="capitalize font-medium">{device.deviceType}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Battery</span><span className="inline-flex items-center gap-1"><Battery className={`h-4 w-4 ${device.batteryLevel > 50 ? 'text-safe' : 'text-monitoring'}`} /> {device.batteryLevel}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Signal</span><span className="inline-flex items-center gap-1"><Wifi className="h-4 w-4 text-primary" /> {device.signalStrength}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Firmware</span><span>{device.firmwareVersion}</span></div>
          </div>
        </div>

        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <h3 className="mb-4 text-sm font-semibold">Routine schedule</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">School hours</span><span className="font-medium">{child.routineSchedule.schoolStart} – {child.routineSchedule.schoolEnd}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expected commute</span><span className="font-medium">{child.routineSchedule.expectedCommuteMins} min</span></div>
            <div>
              <span className="text-muted-foreground">Active days</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {child.routineSchedule.daysOfWeek.map((d) => <span key={d} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{d.slice(0,3)}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <h3 className="mb-4 text-sm font-semibold">Parent / guardian</h3>
          <div className="space-y-3 text-sm">
            <div className="inline-flex items-center gap-2 font-semibold"><UserCircle className="h-4 w-4 text-primary" /> {child.parentName}</div>
            <div className="inline-flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {child.parentEmail || 'Connected through dashboard account'}</div>
            <div className="inline-flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {child.parentPhone || 'Registered parent contact'}</div>
          </div>
        </div>

        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <h3 className="mb-4 text-sm font-semibold">School contact</h3>
          <div className="space-y-3 text-sm">
            <div className="inline-flex items-center gap-2 font-semibold"><School className="h-4 w-4 text-primary" /> {child.schoolAdminName || 'School admin'}</div>
            <div className="inline-flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {child.schoolAdminEmail || 'School dashboard linked'}</div>
            <div className="inline-flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {child.schoolAdminPhone || 'Registered school contact'}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold">Recent alerts</h3><span className="text-xs text-muted-foreground">{childAlerts.length} total</span></div>
          <div className="space-y-2">
            {childAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 rounded-2xl bg-background p-3">
                <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${alert.severity === 'high' || alert.severity === 'critical' ? 'text-high-risk' : alert.severity === 'medium' ? 'text-monitoring' : 'text-safe'}`} />
                <span className="min-w-0 flex-1 truncate text-sm">{alert.triggerReason}</span>
                <span className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold">Pickup history</h3><span className="text-xs text-muted-foreground">{childPickups.length} records</span></div>
          <div className="space-y-2">
            {childPickups.map((pickup) => (
              <div key={pickup.id} className="flex items-center gap-3 rounded-2xl bg-background p-3">
                <ShieldCheck className={`h-4 w-4 flex-shrink-0 ${pickup.mismatchFlag ? 'text-high-risk' : 'text-safe'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{pickup.authorizedPerson}</p>
                  {pickup.notes && <p className="truncate text-xs text-muted-foreground">{pickup.notes}</p>}
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${pickup.mismatchFlag ? 'bg-high-risk/10 text-high-risk' : 'bg-safe/10 text-safe'}`}>{pickup.verificationState}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
