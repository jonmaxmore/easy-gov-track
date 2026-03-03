import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, ClipboardList, Award, Calendar, BarChart3,
  Search, Bell, ChevronRight, AlertTriangle, Clock, CheckCircle, TrendingUp,
  Leaf, LogOut, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const sidebarItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", path: "/provider/dashboard", active: true },
  { icon: FileText, label: "คำขอรับรอง", path: "/provider/dashboard" },
  { icon: ClipboardList, label: "การตรวจสอบ", path: "/provider/dashboard" },
  { icon: Award, label: "ใบรับรอง", path: "/provider/dashboard" },
  { icon: Calendar, label: "ปฏิทิน", path: "/provider/dashboard" },
  { icon: BarChart3, label: "วิเคราะห์", path: "/provider/dashboard" },
];

interface QueueItem {
  id: string;
  appNumber: string;
  applicant: string;
  stage: string;
  priority: "normal" | "urgent";
  date: string;
}

const mockQueue: QueueItem[] = [
  { id: "1", appNumber: "APP-2026-001", applicant: "นายสมชาย ใจดี", stage: "รอตรวจเอกสาร", priority: "urgent", date: "28 ก.พ. 69" },
  { id: "2", appNumber: "APP-2026-002", applicant: "นางสมหญิง รักษ์ดิน", stage: "รอตรวจเอกสาร", priority: "normal", date: "1 มี.ค. 69" },
  { id: "3", appNumber: "APP-2026-003", applicant: "น.ส.ดวงใจ สมุนไพร", stage: "รอนัดตรวจ", priority: "normal", date: "2 มี.ค. 69" },
  { id: "4", appNumber: "APP-2026-004", applicant: "บริษัท สวนสมุนไพร จำกัด", stage: "รอแก้ไข", priority: "urgent", date: "25 ก.พ. 69" },
  { id: "5", appNumber: "APP-2026-005", applicant: "วิสาหกิจชุมชนสมุนไพร", stage: "รอชำระเงิน", priority: "normal", date: "27 ก.พ. 69" },
];

export default function ProviderDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const filtered = mockQueue.filter((item) => {
    if (priorityFilter === "urgent" && item.priority !== "urgent") return false;
    if (query && !item.applicant.includes(query) && !item.appNumber.includes(query)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gov-gradient">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-sidebar-foreground">GACP Provider</h2>
            <p className="text-[10px] text-sidebar-foreground/50">เจ้าหน้าที่ตรวจสอบ</p>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
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
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-foreground"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-sm font-bold text-foreground lg:text-base">แดชบอร์ด</h1>
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

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed inset-0 z-50 bg-background/80 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-60 h-full bg-sidebar border-r border-sidebar-border p-4 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-sidebar-primary" />
                <span className="text-sm font-bold text-sidebar-foreground">GACP Provider</span>
              </div>
              {sidebarItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard icon={TrendingUp} label="ตรวจวันนี้" value={3} variant="primary" />
            <MetricCard icon={AlertTriangle} label="SLA เกินกำหนด" value={2} variant="destructive" />
            <MetricCard icon={Clock} label="รอตอบกลับ" value={5} variant="warning" />
            <MetricCard icon={CheckCircle} label="คิวทั้งหมด" value={mockQueue.length} variant="default" />
          </div>

          {/* Work Queue */}
          <div className="rounded-xl border border-border bg-card card-shadow">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-bold">คิวงาน</h3>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหา..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">ทั้งหมด</SelectItem>
                    <SelectItem value="urgent">เร่งด่วน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="divide-y divide-border">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{item.appNumber}</span>
                      {item.priority === "urgent" && (
                        <Badge variant="destructive" className="text-[9px] px-1.5 py-0">เร่งด่วน</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.applicant}</p>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-medium text-muted-foreground">{item.stage}</p>
                    <p className="text-[10px] text-muted-foreground/60">{item.date}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  variant,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  variant: "primary" | "destructive" | "warning" | "default";
}) {
  const styles = {
    primary: "gov-gradient text-primary-foreground",
    destructive: "bg-destructive/10 border border-destructive/20",
    warning: "bg-warning/10 border border-warning/20",
    default: "bg-card border border-border",
  };
  const iconStyles = {
    primary: "bg-primary-foreground/20 text-primary-foreground",
    destructive: "bg-destructive/20 text-destructive",
    warning: "bg-warning/20 text-warning",
    default: "bg-muted text-muted-foreground",
  };
  const valueStyles = {
    primary: "text-primary-foreground",
    destructive: "text-destructive",
    warning: "text-warning",
    default: "text-foreground",
  };

  return (
    <div className={`rounded-lg p-3 card-shadow ${styles[variant]}`}>
      <div className="flex items-center gap-2.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconStyles[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className={`text-[10px] font-medium ${variant === "primary" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {label}
          </p>
          <p className={`text-lg font-bold ${valueStyles[variant]}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
