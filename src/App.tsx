import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

// Pages
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import SubmitDocument from "./pages/SubmitDocument";
import TrackTrace from "./pages/TrackTrace";
import Profile from "./pages/Profile";
import Planting from "./pages/Planting";
import Certificates from "./pages/Certificates";
import ProviderLogin from "./pages/ProviderLogin";
import ProviderDashboard from "./pages/ProviderDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Pages that don't use the AppLayout
const noLayoutRoutes = ["/", "/login", "/register", "/forgot-password", "/provider/login", "/provider/dashboard"];

function AppRoutes() {
  const location = useLocation();
  const useLayout = !noLayoutRoutes.includes(location.pathname);

  const routes = (
    <Routes>
      {/* Auth flow */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Provider */}
      <Route path="/provider/login" element={<ProviderLogin />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />

      {/* Main app */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/submit" element={<SubmitDocument />} />
      <Route path="/track" element={<TrackTrace />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/planting" element={<Planting />} />
      <Route path="/certificates" element={<Certificates />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  if (useLayout) {
    return <AppLayout>{routes}</AppLayout>;
  }

  return routes;
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
