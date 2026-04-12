import { Link } from 'react-router-dom';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { PublicNav } from '@/components/safepath/PublicNav';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, ArrowRight, Bell, Brain, CheckCircle2, MapPinned, Phone, Route, Shield, ShieldCheck, Smartphone, Users } from 'lucide-react';

const highlights = [
  {
    icon: Brain,
    title: 'Predictive route intelligence',
    body: 'Models home, school, and usual travel behavior so anomalies are detected before they become emergencies.',
  },
  {
    icon: Bell,
    title: 'Escalation beyond the app',
    body: 'Critical events are designed to trigger SMS, email, and call workflows so alerts are not missed when the app is closed.',
  },
  {
    icon: Users,
    title: 'Parent + school safety layer',
    body: 'Parents receive full visibility, while schools get operational safety oversight for entry, exit, and pickup incidents.',
  },
];

const featureGrid = [
  'Usual route vs live route comparison',
  'Home and school geofence tracking',
  'Abnormal inactivity and prolonged stop detection',
  'Connectivity-aware status during commute',
  'Pickup verification and mismatch logging',
  'Exportable safety reports for review',
];

const faqs = [
  {
    q: 'How is this different from a normal GPS tracker?',
    a: 'A normal tracker only shows location. SafePath AI interprets location, timing, route consistency, and movement signals to detect suspicious situations and explain why the alert happened.',
  },
  {
    q: 'Does the child need to press SOS?',
    a: 'No. The product is intentionally designed around passive monitoring, especially for younger children who may panic or may not know when to ask for help.',
  },
  {
    q: 'What happens if Wi‑Fi is not available?',
    a: 'The product experience is designed to be connectivity-aware and cellular-ready, with delayed sync and escalation states represented clearly in the dashboard.',
  },
  {
    q: 'Who can see the child data?',
    a: 'Parents have full visibility for their child. School staff are intended to receive only the operational safety views needed for school entry, exit, pickup, and incident response.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNav />

      <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="absolute inset-0 -z-10 hero-grid opacity-30" />
        <div className="page-shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <ShieldCheck className="h-4 w-4" /> AI-enabled predictive child safety
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              A child safety platform that understands when a journey feels{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">unusual</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              SafePath AI combines a passive wearable, route intelligence, and real-time parent-school visibility to detect route deviation, stop anomalies, inactivity risk, and critical incidents without relying on manual SOS.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register"><BubbleButton size="lg">Start building now <ArrowRight className="h-4 w-4" /></BubbleButton></Link>
              <Link to="/contact"><BubbleButton variant="outline" size="lg">Request school demo</BubbleButton></Link>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="inline-flex items-center gap-2 rounded-2xl border bg-card/80 px-4 py-3 shadow-safe"><CheckCircle2 className="h-4 w-4 text-safe" /> No manual SOS dependency</div>
              <div className="inline-flex items-center gap-2 rounded-2xl border bg-card/80 px-4 py-3 shadow-safe"><CheckCircle2 className="h-4 w-4 text-safe" /> Explainable risk reasoning</div>
              <div className="inline-flex items-center gap-2 rounded-2xl border bg-card/80 px-4 py-3 shadow-safe"><CheckCircle2 className="h-4 w-4 text-safe" /> Parent + school dual monitoring</div>
              <div className="inline-flex items-center gap-2 rounded-2xl border bg-card/80 px-4 py-3 shadow-safe"><CheckCircle2 className="h-4 w-4 text-safe" /> SMS, email, call escalation</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-10 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-4 bottom-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
            <div className="panel-soft relative overflow-hidden p-5 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary/10 via-accent/10 to-transparent" />
              <div className="relative grid gap-4">
                <div className="rounded-[28px] border bg-background/80 p-5 shadow-safe-md">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live child status</p>
                      <h3 className="mt-2 text-xl font-bold">Aanya Sharma</h3>
                      <p className="text-sm text-muted-foreground">School commute • confidence 92%</p>
                    </div>
                    <span className="rounded-full bg-safe/10 px-3 py-1 text-xs font-semibold text-safe">Safe</span>
                  </div>
                  <div className="rounded-[24px] border bg-card p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="font-semibold">Usual route alignment</span>
                      <span className="text-muted-foreground">94%</span>
                    </div>
                    <div className="h-3 rounded-full bg-muted">
                      <div className="h-3 rounded-full gradient-primary" style={{ width: '94%' }} />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-background px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Connectivity</p>
                        <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold"><Smartphone className="h-4 w-4 text-primary" /> Cellular active</p>
                      </div>
                      <div className="rounded-2xl bg-background px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current risk</p>
                        <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold"><Shield className="h-4 w-4 text-safe" /> Safe and on route</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Route className="h-5 w-5" /></div>
                    <p className="text-sm font-semibold">Route intelligence</p>
                    <p className="mt-2 text-sm text-muted-foreground">Compares expected route with actual movement to surface deviation and timing anomalies.</p>
                  </div>
                  <div className="rounded-[28px] border bg-card p-5 shadow-safe-md">
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-high-risk/10 text-high-risk"><Phone className="h-5 w-5" /></div>
                    <p className="text-sm font-semibold">Emergency escalation</p>
                    <p className="mt-2 text-sm text-muted-foreground">Critical incidents are designed to escalate beyond the app using channels parents and schools already rely on.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="page-shell grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="panel-soft p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><item.icon className="h-6 w-6" /></div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="page-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="panel-soft p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Why this product matters</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Built to solve the real weaknesses in current child safety systems.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">SafePath AI is designed around the situations that make parents anxious and school teams reactive: no manual SOS, weak network conditions, route ambiguity, raw logs that mean nothing, and app-only alerts that go unnoticed.</p>
            <div className="mt-6 grid gap-3">
              {featureGrid.map((item) => (
                <div key={item} className="inline-flex items-center gap-3 rounded-2xl bg-background px-4 py-3 text-sm shadow-safe">
                  <CheckCircle2 className="h-4 w-4 text-safe" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel-soft p-6">
              <MapPinned className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-lg font-bold">Location with context</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Home geofence, school geofence, usual route overlap, and stop duration all contribute to a meaningful safety view.</p>
            </div>
            <div className="panel-soft p-6">
              <AlertTriangle className="h-7 w-7 text-suspicious" />
              <h3 className="mt-4 text-lg font-bold">Explainable alerts</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Instead of a vague warning, the platform tells parents exactly what changed and why confidence increased.</p>
            </div>
            <div className="panel-soft p-6">
              <Users className="h-7 w-7 text-accent" />
              <h3 className="mt-4 text-lg font-bold">Shared responsibility</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Parents get full child visibility while school teams get the operational views required for pickup and incident response.</p>
            </div>
            <div className="panel-soft p-6">
              <Phone className="h-7 w-7 text-high-risk" />
              <h3 className="mt-4 text-lg font-bold">Escalation that reaches people</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">The system is designed around app, SMS, email, and call escalation so emergencies do not depend on a single open screen.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="page-shell grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="panel-soft p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Frequently asked questions</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Clear enough for parents, robust enough for judges.</h2>
            <Accordion type="single" collapsible className="mt-6 space-y-3">
              {faqs.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="rounded-2xl border bg-background px-4">
                  <AccordionTrigger className="text-left text-sm font-semibold">{item.q}</AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-7 text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="panel-soft overflow-hidden p-0">
            <div className="gradient-primary p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Ready to build</p>
              <h2 className="mt-3 text-3xl font-bold">Bring the final judge-ready product experience together.</h2>
              <p className="mt-4 text-sm leading-7 text-white/80">Start with the parent flow, show the school oversight, and let the route intelligence speak for the problem you are solving.</p>
            </div>
            <div className="space-y-3 p-6 sm:p-8">
              <Link to="/register" className="block"><BubbleButton size="lg" className="w-full justify-center">Create project account <ArrowRight className="h-4 w-4" /></BubbleButton></Link>
              <Link to="/contact" className="block"><BubbleButton variant="outline" size="lg" className="w-full justify-center">Talk to schools / mentors</BubbleButton></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
