import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { PublicNav } from '@/components/safepath/PublicNav';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const contactCards = [
  { icon: Mail, title: 'Email', value: 'hello@safepath.ai' },
  { icon: Phone, title: 'Support line', value: '+91 1800 123 4567' },
  { icon: Building, title: 'School partnerships', value: 'schools@safepath.ai' },
  { icon: MapPin, title: 'Office', value: 'Chennai / Mumbai hybrid operations' },
];

export default function Contact() {
  const [mode, setMode] = useState<'general' | 'school' | 'demo'>('general');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNav />

      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="page-shell max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Shield className="h-4 w-4" /> Contact SafePath AI
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">Let’s shape the final child safety rollout together.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">Whether you are pitching, prototyping, or planning school adoption, this page should feel like a real product company — not a generic hackathon placeholder.</p>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="page-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel-soft p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap gap-2">
              {[
                ['general', 'General inquiry'],
                ['school', 'School partnership'],
                ['demo', 'Request demo'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key as typeof mode)}
                  className={key === mode ? 'rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-safe-md' : 'rounded-full bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary'}
                >
                  {label}
                </button>
              ))}
            </div>

            <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input className="h-11 rounded-2xl" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input className="h-11 rounded-2xl" placeholder="you@example.com" type="email" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input className="h-11 rounded-2xl" placeholder="+91 XXXXX XXXXX" type="tel" />
                </div>
                <div className="space-y-2">
                  <Label>{mode === 'school' ? 'School / organisation' : 'Role / context'}</Label>
                  <Input className="h-11 rounded-2xl" placeholder={mode === 'school' ? 'Institution name' : 'Parent, mentor, admin...'} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{mode === 'demo' ? 'What do you want to see in the demo?' : 'Message'}</Label>
                <Textarea className="min-h-[140px] rounded-3xl" placeholder={mode === 'demo' ? 'Tell us the flow you want to review...' : 'Share your requirement, rollout context, or question...'} />
              </div>
              <BubbleButton size="lg">{mode === 'demo' ? 'Request demo' : mode === 'school' ? 'Submit partnership request' : 'Send message'}</BubbleButton>
            </form>
          </div>

          <div className="space-y-6">
            <div className="panel-soft p-6 sm:p-8">
              <h2 className="text-xl font-bold">Get in touch</h2>
              <div className="mt-5 space-y-4">
                {contactCards.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-2xl bg-background px-4 py-4 shadow-safe">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><item.icon className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel-soft overflow-hidden p-0">
              <div className="gradient-primary p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Suggested next step</p>
                <h3 className="mt-3 text-2xl font-bold">Use this page as the polished public face of the platform.</h3>
                <p className="mt-3 text-sm leading-7 text-white/80">A strong contact flow helps the project feel like a real deployable product, not just a hackathon dashboard.</p>
              </div>
              <div className="p-6">
                <Link to="/register"><BubbleButton size="lg" className="w-full justify-center">Create project account</BubbleButton></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
