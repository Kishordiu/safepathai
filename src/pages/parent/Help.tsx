import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { LifeBuoy, PhoneCall, Mail } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-3"><LifeBuoy className="h-3.5 w-3.5" /> Support Center</div>
        <h1 className="text-2xl font-bold">Help, Support & Emergency Guidance</h1>
        <p className="text-sm text-muted-foreground">Understand the alert states, escalation channels, and how to respond when SafePath flags a child safety incident.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border bg-card p-5 shadow-safe-md">
          <Accordion type="single" collapsible className="space-y-3">
            {[
              ['What does Monitoring mean?', 'Monitoring means a small anomaly was detected, such as signal drop or slight route variance, but no critical danger is confirmed yet.'],
              ['When are calls triggered?', 'Automated calls are reserved for emergency or critical situations when the child shows severe risk or when app/SMS channels may not be sufficient.'],
              ['Why does the app compare usual and actual routes?', 'This allows SafePath AI to distinguish normal school travel from suspicious deviations or prolonged unexpected stops.'],
              ['Can school admins see every child?', 'Only authorized school users should see the students mapped to their institution. Parent views remain child-specific.']
            ].map(([q, a], i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border bg-background px-4">
                <AccordionTrigger className="text-left hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="rounded-3xl border bg-card p-5 shadow-safe-md space-y-4">
          <h3 className="font-semibold">Need direct support?</h3>
          <div className="rounded-2xl border bg-background p-4">
            <p className="text-sm font-medium inline-flex items-center gap-2"><PhoneCall className="h-4 w-4 text-primary" /> Emergency Support Line</p>
            <p className="mt-1 text-sm text-muted-foreground">+91 90000 11111</p>
          </div>
          <div className="rounded-2xl border bg-background p-4">
            <p className="text-sm font-medium inline-flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Support Email</p>
            <p className="mt-1 text-sm text-muted-foreground">support@safepath.ai</p>
          </div>
          <BubbleButton className="w-full">Request Human Assistance</BubbleButton>
        </div>
      </div>
    </div>
  );
}
