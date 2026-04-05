import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, QrCode, User, Menu, X, Leaf,
  Sprout, Award, CreditCard, Building2, ClipboardList, Bell, Settings, FolderOpen,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { path: "/submit", label: "ยื่นเอกสาร", icon: FileText },
  { path: "/payments", label: "การชำระเงิน", icon: CreditCard },
  { path: "/establishments", label: "สถานประกอบการ", icon: Building2 },
  { path: "/planting", label: "การปลูก", icon: Sprout },
  { path: "/certificates", label: "ใบรับรอง", icon: Award },
  { path: "/sop-builder", label: "SOP", icon: ClipboardList },
  { path: "/track", label: "Trace", icon: QrCode },
  { path: "/notifications", label: "แจ้งเตือน", icon: Bell },
  { path: "/profile", label: "โปรไฟล์", icon: User },
];

const bottomNavItems = [
  { path: "/dashboard", label: "หน้าหลัก", icon: LayoutDashboard },
  { path: "/submit", label: "ยื่นเอกสาร", icon: FileText },
  { path: "/payments", label: "ชำระเงิน", icon: CreditCard },
  { path: "/notifications", label: "แจ้งเตือน", icon: Bell },
  { path: "/profile", label: "โปรไฟล์", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="gov-gradient sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between md:h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold leading-tight text-primary-foreground">
                GACP Certification
              </h1>
              <p className="text-[10px] leading-tight text-primary-foreground/70">
                ระบบรับรองมาตรฐาน GACP
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.slice(0, 8).map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
            {/* More menu items */}
            <Link
              to="/settings"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Settings className="h-3.5 w-3.5" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-primary-foreground/80 hover:bg-primary-foreground/10 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-14 z-40 border-b border-border bg-card p-4 shadow-lg md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/settings"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  location.pathname === "/settings" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
              >
                <Settings className="h-5 w-5" />
                ตั้งค่า
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container py-4 md:py-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card md:hidden">
        <div className="flex items-center justify-around py-2">
          {bottomNavItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
