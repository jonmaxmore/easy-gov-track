import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, ChevronRight, AlertTriangle, Clock, CheckCircle, TrendingUp,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import ProviderLayout from "@/components/ProviderLayout";

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
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const filtered = mockQueue.filter((item) => {
    if (priorityFilter === "urgent" && item.priority !== "urgent") return false;
    if (query && !item.applicant.includes(query) && !item.appNumber.includes(query)) return false;
    return true;
  });

  return (
    <ProviderLayout title="แดชบอร์ด">
      <div className="space-y-6">
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
                <Input placeholder="ค้นหา..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8 h-8 text-xs" />
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ทั้งหมด</SelectItem>
                  <SelectItem value="urgent">เร่งด่วน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="divide-y divide-border">
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <Link
                  to={`/provider/applications/${item.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
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
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}

function MetricCard({ icon: Icon, label, value, variant }: {
  icon: React.ElementType; label: string; value: number;
  variant: "primary" | "destructive" | "warning" | "default";
}) {
  const styles = { primary: "gov-gradient text-primary-foreground", destructive: "bg-destructive/10 border border-destructive/20", warning: "bg-warning/10 border border-warning/20", default: "bg-card border border-border" };
  const iconStyles = { primary: "bg-primary-foreground/20 text-primary-foreground", destructive: "bg-destructive/20 text-destructive", warning: "bg-warning/20 text-warning", default: "bg-muted text-muted-foreground" };
  const valueStyles = { primary: "text-primary-foreground", destructive: "text-destructive", warning: "text-warning", default: "text-foreground" };

  return (
    <div className={`rounded-lg p-3 card-shadow ${styles[variant]}`}>
      <div className="flex items-center gap-2.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconStyles[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className={`text-[10px] font-medium ${variant === "primary" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{label}</p>
          <p className={`text-lg font-bold ${valueStyles[variant]}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
