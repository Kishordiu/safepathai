import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { AlertTriangle, Building2, ClipboardList, DoorOpen, LayoutDashboard, LogOut, RadioTower, Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const items = [
  { title: 'Dashboard', url: '/school/dashboard', icon: LayoutDashboard },
  { title: 'Safety Incidents', url: '/school/dashboard#alerts', icon: AlertTriangle },
  { title: 'Entry / Exit', url: '/school/dashboard#entry-exit', icon: DoorOpen },
  { title: 'Pickup Verification', url: '/school/dashboard#pickup', icon: ClipboardList },
  { title: 'Device Health', url: '/school/dashboard#devices', icon: RadioTower },
];

export function SchoolSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase?.auth.signOut();
    } catch (e) {
      console.error(e);
    } finally {
      navigate('/admin/login');
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <NavLink to="/school/dashboard" className="flex items-center gap-2.5 no-underline">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-safe-md"><Building2 className="h-4 w-4 text-white" /></div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="block truncate text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SafePath School</span>
              <span className="text-[11px] text-muted-foreground">Operational monitoring</span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>School Console</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === '/school/dashboard' && item.url === '/school/dashboard'}>
                    <NavLink to={item.url} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="hover:bg-sidebar-accent">
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 text-xs text-muted-foreground">
        {!collapsed && <div className="inline-flex items-start gap-2 rounded-2xl border border-safe/10 bg-safe/5 p-3"><Shield className="mt-0.5 h-4 w-4 text-safe" /> School visibility is limited to incidents, entry/exit review, pickup verification, && device health only.</div>}
      </SidebarFooter>
    </Sidebar>
  );
}
