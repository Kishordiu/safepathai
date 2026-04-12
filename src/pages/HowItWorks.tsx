import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Brain, Eye, MapPin, Phone, Radio, Shield, Users } from 'lucide-react';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { PublicNav } from '@/components/safepath/PublicNav';

const steps = [
  {
    icon: Radio,
    title: 'Wearable sensing layer',
    desc: 'A badge, pendant, or clip collects location, movement, inactivity, and connectivity signals without depending on manual SOS interaction.',
    details: ['GPS + route feed', 'Motion pattern analysis', 'Connectivity status', 'Battery and device health'],
  },
  {
    icon: MapPin,
    title: 'Home, school, and route modeling',
    desc: 'The software models home and school geofences, expected travel windows, and the child’s usual path so the system understands normal movement.',
    details: ['Home geofence', 'School geofence', 'Expected travel time', 'Common stop points'],
  },
  {
    icon: Brain,
    title: 'Predictive anomaly logic',
    desc: 'Movement and route behavior are evaluated for route deviation, prolonged stop, unexpected school exit, inactivity anomalies, and delayed arrival.',
    details: ['Route deviation', 'Stop anomaly', 'Inactivity anomaly', 'Timing inconsistency'],
  },
  {
    icon: Eye,
    title: 'Explainable safety state',
    desc: 'Each incident becomes an explainable safety state with confidence, severity, and a clear reason rather than leaving parents with raw tracking data.',
    details: ['Safe → Emergency states', 'Confidence scoring', 'Why-this-was-flagged view', 'Escalation history'],
  },
  {
    icon: Users,
    title: 'Parent and school visibility',
    desc: 'Parents get full child visibility while school operators receive the limited, practical information needed for pickup, entry/exit, and incident response.',
    details: ['Parent dashboard', 'School console', 'Pickup verification', 'Incident review'],
  },
  {
    icon: Phone,
    title: 'Multi-channel alert escalation',
    desc: 'Critical alerts are designed to continue beyond the web app using channels parents and schools already rely on.',
    details: ['In-app alert', 'SMS alert', 'Email alert', 'Emergency call escalation'],
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNav />

      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="page-shell max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Shield className="h-4 w-4" /> How the intelligence flow works
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">From passive wearable to explainable child safety decisions.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            SafePath AI is designed to make the invisible visible: route confidence, unusual movement, delayed travel, and critical escalation paths that do not rely on one screen being open.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="page-shell max-w-5xl">
          <div className="space-y-5">
            {steps.map((step, index) => (
              <div key={step.title} className="grid gap-4 rounded-[32px] border bg-card p-5 shadow-safe-md sm:grid-cols-[88px_1fr] sm:p-6 lg:p-8">
                <div className="flex flex-col items-start gap-3">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl gradient-primary shadow-safe-md">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Step {String(index + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{step.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{step.desc}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {step.details.map((detail) => (
                      <div key={detail} className="rounded-2xl bg-background px-4 py-3 text-sm font-medium text-foreground shadow-safe">
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="page-shell overflow-hidden rounded-[36px] border bg-card shadow-safe-lg lg:grid lg:grid-cols-[1fr_0.9fr]">
          <div className="p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Why this matters</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">The product is built to solve the exact gaps judges ask about.</h2>
            <div className="mt-6 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>It removes dependence on manual SOS for younger children.</p>
              <p>It adds connectivity-aware states instead of pretending network issues do not matter.</p>
              <p>It turns raw location into route intelligence with explanation and confidence.</p>
              <p>It adds institutional visibility without turning the product into a privacy-free tracker.</p>
            </div>
          </div>
          <div className="gradient-primary p-8 text-white sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Next step</p>
            <h3 className="mt-3 text-3xl font-bold">Turn the flow into a live product experience.</h3>
            <p className="mt-4 text-sm leading-7 text-white/80">Use the parent and school dashboards to show how the same alert becomes visible, understandable, and actionable.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register"><BubbleButton variant="secondary" size="lg">Start with the platform <ArrowRight className="h-4 w-4" /></BubbleButton></Link>
              <Link to="/contact"><BubbleButton variant="ghost" size="lg" className="text-white hover:bg-white/10 hover:text-white">Request walkthrough</BubbleButton></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
