import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

import Landing from "./pages/Landing";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import ParentLogin from "./pages/auth/ParentLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ParentDashboard from "./pages/parent/Dashboard";
import LiveTracking from "./pages/parent/LiveTracking";
import Alerts from "./pages/parent/Alerts";
import ChildProfile from "./pages/parent/ChildProfile";
import RouteIntelligence from "./pages/parent/RouteIntelligence";
import HistoryPage from "./pages/parent/History";
import PickupPage from "./pages/parent/Pickup";
import NotificationsPage from "./pages/parent/Notifications";
import SettingsPage from "./pages/parent/Settings";
import HelpPage from "./pages/parent/Help";
import SchoolDashboard from "./pages/school/Dashboard";
import VoiceMonitor from "./pages/parent/VoiceMonitor";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Auth pages */}
          <Route path="/login" element={<ParentLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Parent Dashboard */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<ParentDashboard />} />
            <Route path="/tracking" element={<LiveTracking />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/voice-monitor" element={<VoiceMonitor />} />
            <Route path="/child/:id" element={<ChildProfile />} />
            <Route path="/routes" element={<RouteIntelligence />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/pickup" element={<PickupPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/school/dashboard" element={<SchoolDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
