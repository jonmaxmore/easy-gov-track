import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

// Auth pages
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Citizen pages
import Dashboard from "./pages/Dashboard";
import SubmitDocument from "./pages/SubmitDocument";
import TrackTrace from "./pages/TrackTrace";
import Profile from "./pages/Profile";
import Planting from "./pages/Planting";
import Certificates from "./pages/Certificates";
import ApplicationDetail from "./pages/ApplicationDetail";
import Payment from "./pages/Payment";
import Payments from "./pages/Payments";
import Documents from "./pages/Documents";
import Establishments from "./pages/Establishments";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import SOPBuilder from "./pages/SOPBuilder";

// Provider pages
import ProviderLogin from "./pages/ProviderLogin";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderApplications from "./pages/ProviderApplications";
import ProviderApplicationDetail from "./pages/ProviderApplicationDetail";
import ProviderAudits from "./pages/ProviderAudits";
import ProviderCalendar from "./pages/ProviderCalendar";
import ProviderAccounting from "./pages/ProviderAccounting";
import ProviderAnalytics from "./pages/ProviderAnalytics";
import ProviderCertificates from "./pages/ProviderCertificates";
import ProviderProfile from "./pages/ProviderProfile";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Pages that don't use the citizen AppLayout
const noLayoutPrefixes = ["/provider", "/login", "/register", "/forgot-password"];

function AppRoutes() {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const isNoLayout = isRoot || noLayoutPrefixes.some((p) => location.pathname.startsWith(p));

  const routes = (
    <Routes>
      {/* Auth flow */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Provider portal (has its own layout) */}
      <Route path="/provider/login" element={<ProviderLogin />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/provider/applications" element={<ProviderApplications />} />
      <Route path="/provider/applications/:id" element={<ProviderApplicationDetail />} />
      <Route path="/provider/audits" element={<ProviderAudits />} />
      <Route path="/provider/calendar" element={<ProviderCalendar />} />
      <Route path="/provider/accounting" element={<ProviderAccounting />} />
      <Route path="/provider/analytics" element={<ProviderAnalytics />} />
      <Route path="/provider/certificates" element={<ProviderCertificates />} />
      <Route path="/provider/profile" element={<ProviderProfile />} />

      {/* Citizen app */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/submit" element={<SubmitDocument />} />
      <Route path="/track" element={<TrackTrace />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/planting" element={<Planting />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/application/:id" element={<ApplicationDetail />} />
      <Route path="/payment/:id" element={<Payment />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/establishments" element={<Establishments />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/sop-builder" element={<SOPBuilder />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  if (isNoLayout) {
    return routes;
  }

  return <AppLayout>{routes}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
