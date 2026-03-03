import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Search, ChevronRight, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import ProviderLayout from "@/components/ProviderLayout";

const mockApplications = [
  { id: "1", appNumber: "APP-2026-001", applicant: "นายสมชาย ใจดี", herb: "กัญชง", type: "รายบุคคล", status: "pending_review", date: "28 ก.พ. 69", province: "เชียงใหม่" },
  { id: "2", appNumber: "APP-2026-002", applicant: "นางสมหญิง รักษ์ดิน", herb: "ฟ้าทะลายโจร", type: "รายบุคคล", status: "pending_review", date: "1 มี.ค. 69", province: "นครราชสีมา" },
  { id: "3", appNumber: "APP-2026-003", applicant: "น.ส.ดวงใจ สมุนไพร", herb: "กระชายขาว", type: "วิสาหกิจ", status: "scheduled", date: "2 มี.ค. 69", province: "ขอนแก่น" },
  { id: "4", appNumber: "APP-2026-004", applicant: "บริษัท สวนสมุนไพร จำกัด", herb: "ขมิ้นชัน", type: "นิติบุคคล", status: "revision", date: "25 ก.พ. 69", province: "เชียงราย" },
  { id: "5", appNumber: "APP-2026-005", applicant: "วิสาหกิจชุมชนสมุนไพร", herb: "พริกไทย", type: "วิสาหกิจ", status: "pending_payment", date: "27 ก.พ. 69", province: "สุราษฎร์ธานี" },
  { id: "6", appNumber: "APP-2026-006", applicant: "นายประเสริฐ ทองแท้", herb: "กัญชง", type: "รายบุคคล", status: "approved", date: "20 ก.พ. 69", province: "ลำพูน" },
  { id: "7", appNumber: "APP-2026-007", applicant: "สหกรณ์สมุนไพรเหนือ", herb: "ฟ้าทะลายโจร", type: "วิสาหกิจ", status: "approved", date: "15 ก.พ. 69", province: "เชียงใหม่" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pending_review: { label: "รอตรวจเอกสาร", className: "bg-warning/15 text-warning border-warning/30" },
  scheduled: { label: "นัดตรวจแล้ว", className: "bg-info/15 text-info border-info/30" },
  revision: { label: "รอแก้ไข", className: "bg-destructive/15 text-destructive border-destructive/30" },
  pending_payment: { label: "รอชำระเงิน", className: "bg-secondary/15 text-secondary border-secondary/30" },
  approved: { label: "อนุมัติแล้ว", className: "bg-success/15 text-success border-success/30" },
};

export default function ProviderApplicationsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = mockApplications.filter((app) => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (query && !app.applicant.includes(query) && !app.appNumber.includes(query) && !app.herb.includes(query)) return false;
    return true;
  });

  return (
    <ProviderLayout title="คำขอรับรอง">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="ค้นหาผู้ยื่น, เลขที่คำขอ, สมุนไพร..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8 h-9 text-xs" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-36 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ทุกสถานะ</SelectItem>
                <SelectItem value="pending_review">รอตรวจเอกสาร</SelectItem>
                <SelectItem value="scheduled">นัดตรวจแล้ว</SelectItem>
                <SelectItem value="revision">รอแก้ไข</SelectItem>
                <SelectItem value="pending_payment">รอชำระเงิน</SelectItem>
                <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">{filtered.length} รายการ</p>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
          {/* Header - desktop */}
          <div className="hidden md:grid md:grid-cols-[1fr_120px_100px_100px_130px_40px] gap-3 px-4 py-2.5 border-b border-border bg-muted/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>ผู้ยื่นคำขอ</span>
            <span>สมุนไพร</span>
            <span>ประเภท</span>
            <span>จังหวัด</span>
            <span>สถานะ</span>
            <span />
          </div>

          <div className="divide-y divide-border">
            {filtered.map((app, i) => {
              const status = statusConfig[app.status] || { label: app.status, className: "" };
              return (
                <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <Link
                    to={`/provider/applications/${app.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors md:grid md:grid-cols-[1fr_120px_100px_100px_130px_40px]"
                  >
                    <div className="min-w-0 flex-1 md:flex-none">
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-primary font-bold">{app.appNumber}</span>
                          <p className="text-xs font-medium text-card-foreground truncate">{app.applicant}</p>
                          <p className="text-[10px] text-muted-foreground md:hidden">{app.date}</p>
                        </div>
                      </div>
                    </div>
                    <span className="hidden md:block text-xs text-card-foreground">{app.herb}</span>
                    <span className="hidden md:block text-xs text-muted-foreground">{app.type}</span>
                    <span className="hidden md:block text-xs text-muted-foreground">{app.province}</span>
                    <Badge variant="outline" className={`shrink-0 text-[9px] ${status.className}`}>{status.label}</Badge>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground hidden md:block" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
