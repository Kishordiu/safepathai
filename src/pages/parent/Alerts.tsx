import { useMemo, useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { AlertCard } from '@/components/safepath/AlertCard';
import { ExportButton } from '@/components/safepath/ExportButton';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { ShieldAlert } from 'lucide-react';
import { AlertSignalWindow } from '@/components/safepath/AlertSignalWindow';

const severities = ['all', 'critical', 'high', 'medium', 'low'] as const;

export default function AlertsPage() {
  const { alerts } = useAppData();
  const [signalOpen, setSignalOpen] = useState(false);
  const [severity, setSeverity] = useState<string>('all');
  const [tab, setTab] = useState<'active' | 'recent'>('active');

  const filtered = useMemo(() => alerts.filter((a) => {
    if (severity !== 'all' && a.severity !== severity) return false;
    if (tab === 'active') return !a.isRead;
    return true;
  }), [alerts, severity, tab]);

  const seriousAlert = filtered.find((a) => a.severity === 'high' || a.severity === 'critical');

  return (
    <div className="space-y-5 animate-fade-in">
      <AlertSignalWindow open={signalOpen} onOpenChange={setSignalOpen} childName={seriousAlert?.childName ?? 'Child'} childId={seriousAlert?.childId} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-high-risk/15 bg-high-risk/5 px-3 py-1 text-xs font-semibold text-high-risk">
            <ShieldAlert className="h-3.5 w-3.5" /> Alerts
          </div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-sm text-muted-foreground">Live incident feed.</p>
        </div>
        <div className="flex items-center gap-2">
          {seriousAlert ? <BubbleButton variant="outline" size="sm" onClick={() => setSignalOpen(true)}>Protected access</BubbleButton> : null}
          <ExportButton label="Export PDF" />
        </div>
      </div>

      <section className="rounded-[28px] border bg-card p-5 shadow-safe-md">
        <div className="flex flex-wrap gap-2">
          {(['active', 'recent'] as const).map((t) => (
            <BubbleButton key={t} variant={tab === t ? 'primary' : 'outline'} size="sm" onClick={() => setTab(t)}>
              {t === 'active' ? `Active (${alerts.filter((a) => !a.isRead).length})` : 'All'}
            </BubbleButton>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {severities.map((s) => (
            <button key={s} onClick={() => setSeverity(s)} className={`rounded-full px-3 py-2 text-xs font-semibold transition-all ${severity === s ? 'bg-primary text-primary-foreground shadow-safe' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {s === 'all' ? 'All severities' : s}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        {filtered.length ? filtered.map((a) => <AlertCard key={a.id} alert={a} />) : (
          <div className="rounded-[28px] border bg-card p-12 text-center shadow-safe-md">
            <p className="text-lg font-semibold">No alerts</p>
            <p className="mt-1 text-sm text-muted-foreground">No alert matches this view.</p>
          </div>
        )}
      </section>
    </div>
  );
}
