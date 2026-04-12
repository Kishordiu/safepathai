import { useAppData } from '@/hooks/useAppData';
import { Badge } from '@/components/ui/badge';
import { Clock3, Phone, ShieldCheck, TriangleAlert, UserCheck } from 'lucide-react';

export default function PickupPage() {
  const { pickupRecords, children } = useAppData();
  const latestChild = children[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-safe/15 bg-safe/5 px-3 py-1 text-xs font-semibold text-safe">
          <ShieldCheck className="h-3.5 w-3.5" /> Verified pickup oversight
        </div>
        <h1 className="text-2xl font-bold">Pickup verification</h1>
        <p className="text-sm text-muted-foreground">Every pickup event is stored with verification state so school staff and parents can review who collected the child and when.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md"><p className="text-sm text-muted-foreground">Verified pickups</p><p className="mt-2 text-2xl font-bold">{pickupRecords.filter((r) => r.verificationState === 'verified').length}</p></div>
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md"><p className="text-sm text-muted-foreground">Mismatch events</p><p className="mt-2 text-2xl font-bold text-high-risk">{pickupRecords.filter((r) => r.mismatchFlag).length}</p></div>
        <div className="rounded-[28px] border bg-card p-5 shadow-safe-md"><p className="text-sm text-muted-foreground">Primary contact</p><p className="mt-2 text-lg font-bold">{latestChild?.parentName ?? 'Registered parent'}</p></div>
      </div>

      <div className="rounded-[32px] border bg-card p-5 shadow-safe-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Pickup event log</h3>
          <Badge variant="secondary" className="rounded-full px-3 py-1">School gate mode</Badge>
        </div>
        <div className="space-y-3">
          {pickupRecords.map((record) => (
            <div key={record.id} className="rounded-[24px] border bg-background p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold">{record.childName}</h4>
                    <Badge className="rounded-full" variant={record.mismatchFlag ? 'destructive' : 'secondary'}>{record.verificationState}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Picked up by {record.authorizedPerson}</p>
                  {record.notes && <p className="text-xs text-high-risk">{record.notes}</p>}
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 md:text-right">
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock3 className="h-4 w-4" /> {new Date(record.pickupTime).toLocaleString()}</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><UserCheck className="h-4 w-4" /> Verified by gate admin</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><Phone className="h-4 w-4" /> Contact on file</span>
                </div>
              </div>
              {record.mismatchFlag && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-high-risk/20 bg-high-risk/5 px-4 py-3 text-sm text-high-risk">
                  <TriangleAlert className="h-4 w-4" /> Unauthorized pickup attempt was blocked and escalated to school staff.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
