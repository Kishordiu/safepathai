import { BubbleButton } from '@/components/safepath/BubbleButton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Settings, MapPinned, BellRing, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground mb-3"><Settings className="h-3.5 w-3.5" /> Parent Settings</div>
        <h1 className="text-2xl font-bold">Notifications, Safe Zones & Sensitivity</h1>
        <p className="text-sm text-muted-foreground">Customize how SafePath AI alerts you and how strict route monitoring should be.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border bg-card p-5 shadow-safe-md space-y-5">
          <h3 className="font-semibold inline-flex items-center gap-2"><BellRing className="h-4 w-4 text-primary" /> Alert Preferences</h3>
          {[
            'Push notifications for all alerts',
            'SMS for high risk and emergency',
            'Email summaries for incidents',
            'Automated call for critical events'
          ].map((label, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3">
              <Label>{label}</Label>
              <Switch defaultChecked={idx < 3} />
            </div>
          ))}
        </div>
        <div className="rounded-3xl border bg-card p-5 shadow-safe-md space-y-5">
          <h3 className="font-semibold inline-flex items-center gap-2"><MapPinned className="h-4 w-4 text-primary" /> Safe Zone Preferences</h3>
          <div className="space-y-2">
            <Label>Home Geofence Radius (meters)</Label>
            <Input defaultValue="150" className="rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Label>School Geofence Radius (meters)</Label>
            <Input defaultValue="200" className="rounded-2xl" />
          </div>
          <div className="space-y-3">
            <Label>Route Anomaly Sensitivity</Label>
            <Slider defaultValue={[70]} max={100} step={1} />
            <p className="text-xs text-muted-foreground">Higher sensitivity catches smaller route deviations faster.</p>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border bg-card p-5 shadow-safe-md">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-semibold inline-flex items-center gap-2"><Shield className="h-4 w-4 text-safe" /> Privacy & Report Controls</h3>
            <p className="mt-1 text-sm text-muted-foreground">Control report generation and school-visible safety metadata.</p>
          </div>
          <BubbleButton>Save Preferences</BubbleButton>
        </div>
      </div>
    </div>
  );
}
