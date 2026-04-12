import { Outlet, Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SchoolSidebar } from '@/components/safepath/SchoolSidebar';
import { Bell, Building2, ShieldCheck } from 'lucide-react';

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[radial-gradient(circle_at_top_right,_hsl(var(--accent)/0.08),_transparent_28%),linear-gradient(180deg,hsl(var(--background)),hsl(220_22%_95%))]">
        <SchoolSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                <div>
                  <p className="text-sm font-semibold">School Monitoring Console</p>
                  <p className="hidden text-xs text-muted-foreground sm:block">Institutional oversight, pickup supervision, and rapid incident response</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-full border border-safe/15 bg-safe/5 px-3 py-2 text-xs font-semibold text-safe md:inline-flex">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Dual-monitoring enabled
                </div>
                <Link to="/notifications" className="relative rounded-full border bg-card p-2.5 shadow-safe transition-colors hover:bg-muted">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-high-risk" />
                </Link>
                <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 shadow-safe">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary"><Building2 className="h-4 w-4 text-white" /></div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold leading-none">School Admin</p>
                    <p className="text-[11px] text-muted-foreground">SafePath School</p>
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
