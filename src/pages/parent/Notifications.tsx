import { useAppData } from '@/hooks/useAppData';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, Mail, MessageSquare, Phone } from 'lucide-react';

const iconMap = { app: Bell, email: Mail, sms: MessageSquare, call: Phone } as const;

export default function NotificationsPage() {
  const { alerts } = useAppData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"><Bell className="h-3.5 w-3.5" /> Multi-channel delivery</div>
        <h1 className="text-2xl font-bold">Notification center</h1>
        <p className="text-sm text-muted-foreground">See which alerts reached the app, SMS, email, and call layers, along with acknowledgement progress.</p>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-[30px] border bg-card p-5 shadow-safe-md">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold">{alert.childName}</h3>
                <p className="text-sm text-muted-foreground">{alert.triggerReason}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge className="rounded-full" variant="secondary">{alert.severity}</Badge>
                <Badge className="rounded-full" variant={alert.isRead ? 'secondary' : 'default'}>{alert.isRead ? 'Reviewed' : 'New'}</Badge>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {alert.deliveries.map((delivery, idx) => {
                const Icon = iconMap[delivery.channel];
                return (
                  <div key={idx} className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold capitalize"><Icon className="h-4 w-4 text-primary" /> {delivery.channel}</div>
                      <Badge className="rounded-full" variant="secondary">{delivery.deliveredStatus}</Badge>
                    </div>
                    <p className="mt-2 break-all text-xs text-muted-foreground">{delivery.recipient}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs text-safe"><CheckCircle2 className="h-3.5 w-3.5" /> Sent status: {delivery.sentStatus}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
