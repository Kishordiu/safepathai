import { Outlet, Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ParentSidebar } from '@/components/safepath/ParentSidebar';
import { Bell, Search, Shield, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.08),_transparent_25%),linear-gradient(180deg,hsl(var(--background)),hsl(220_28%_95%))]">
        <ParentSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 px-4 md:px-6">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
                <div className="relative max-w-md flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search child status, reports, alerts..." className="h-11 rounded-full border-border/70 bg-card pl-10 shadow-safe" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Predictive monitoring active
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Link to="/notifications" className="relative rounded-full border bg-card p-2.5 shadow-safe transition-colors hover:bg-muted">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-high-risk" />
                </Link>
                <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-safe">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary"><Shield className="h-4 w-4 text-white" /></div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold leading-none">Parent Console</p>
                    <p className="text-[11px] text-muted-foreground">SafePath AI</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <div className="page-shell space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
