import { Link, useLocation } from 'react-router-dom';
import { BubbleButton } from '@/components/safepath/BubbleButton';
import { Menu, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const links = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Contact', to: '/contact' },
];

export function PublicNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-primary shadow-safe-md">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold tracking-tight text-foreground">SafePath AI</p>
            <p className="hidden text-[11px] text-muted-foreground sm:block">Predictive child safety platform</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'text-sm font-medium transition-colors hover:text-foreground',
                location.pathname === item.to ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login"><BubbleButton variant="ghost" size="sm">Parent Login</BubbleButton></Link>
          <Link to="/admin/login"><BubbleButton variant="outline" size="sm">School Login</BubbleButton></Link>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-card shadow-safe">
                <Menu className="h-5 w-5 text-foreground" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm border-l bg-background p-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-primary shadow-safe-md">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-bold">SafePath AI</p>
                      <p className="text-xs text-muted-foreground">Child safety intelligence</p>
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} className="rounded-full border p-2 text-muted-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-2 px-5 py-6">
                  {links.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
                        location.pathname === item.to ? 'bg-primary/10 text-primary' : 'bg-card text-foreground hover:bg-muted'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="space-y-3 border-t px-5 py-5">
                  <Link to="/login" onClick={() => setOpen(false)} className="block"><BubbleButton variant="ghost" size="md" className="w-full">Parent Login</BubbleButton></Link>
                  <Link to="/admin/login" onClick={() => setOpen(false)} className="block"><BubbleButton variant="outline" size="md" className="w-full">School Login</BubbleButton></Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
