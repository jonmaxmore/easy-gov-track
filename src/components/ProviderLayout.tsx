import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, ClipboardList, Award, Calendar, BarChart3,
  Bell, Leaf, LogOut, Menu, X, Receipt, User,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", path: "/provider/dashboard" },
  { icon: FileText, label: "คำขอรับรอง", path: "/provider/applications" },
  { icon: ClipboardList, label: "การตรวจสอบ", path: "/provider/audits" },
  { icon: Award, label: "ใบรับรอง", path: "/provider/certificates" },
  { icon: Calendar, label: "ปฏิทิน", path: "/provider/calendar" },
  { icon: Receipt, label: "การเงิน", path: "/provider/accounting" },
  { icon: BarChart3, label: "วิเคราะห์", path: "/provider/analytics" },
  { icon: User, label: "โปรไฟล์", path: "/provider/profile" },
];

export default function ProviderLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gov-gradient">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-sidebar-foreground">GACP Provider</h2>
            <p className="text-[10px] text-sidebar-foreground/50">เจ้าหน้าที่ตรวจสอบ</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-3.5 w-3.5" />
            ออกจากระบบ
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-foreground"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-sm font-bold text-foreground lg:text-base">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              จ
            </div>
          </div>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/80 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              className="w-60 h-full bg-sidebar border-r border-sidebar-border p-4 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-sidebar-primary" />
                <span className="text-sm font-bold text-sidebar-foreground">GACP Provider</span>
              </div>
              {sidebarItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-sidebar-border mt-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-sidebar-foreground/60"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  ออกจากระบบ
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
