import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, HelpCircle, History, LayoutDashboard, LogOut, MapPin, Mic, Shield, ShieldCheck, UserCircle } from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { supabase } from '@/lib/supabase';

const mainItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Tracking', url: '/tracking', icon: MapPin },
  { title: 'Alerts', url: '/alerts', icon: AlertTriangle },
  { title: 'Voice Monitor', url: '/voice-monitor', icon: Mic },
  { title: 'History', url: '/history', icon: History },
  { title: 'Pickup', url: '/pickup', icon: ShieldCheck },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

const bottomItems = [
  { title: 'Settings', url: '/settings', icon: Shield },
  { title: 'Help', url: '/help', icon: HelpCircle },
];

export function ParentSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { children } = useAppData();
  const profileUrl = children[0] ? `/child/${children[0].id}` : '/dashboard';

  const navItems = [
    ...mainItems.slice(0, 3),
    { title: 'Child Profile', url: profileUrl, icon: UserCircle },
    ...mainItems.slice(3),
  ];

  const handleLogout = async () => {
    try {
      await supabase?.auth.signOut();
    } catch (e) {
      console.error(e);
    } finally {
      navigate('/login');
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <NavLink to="/" className="flex items-center gap-2.5 no-underline">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl gradient-primary shadow-safe-md">
            <Shield className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="block truncate text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SafePath AI</span>
              <span className="text-[11px] text-muted-foreground">Parent monitoring</span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Parent Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = location.pathname === item.url || location.pathname.startsWith(item.url + '/');
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.url} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className="space-y-2">
          <SidebarMenu>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={location.pathname === item.url}>
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
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
