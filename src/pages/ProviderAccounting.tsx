import { motion } from "framer-motion";
import {
  Receipt, CreditCard, CheckCircle, Clock, Download, Eye, Search,
  TrendingUp, Banknote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProviderLayout from "@/components/ProviderLayout";
import { useState } from "react";

const mockPayments = [
  { id: "1", appNumber: "APP-2026-001", applicant: "นายสมชาย ใจดี", amount: "2,500", date: "28 ก.พ. 69", status: "paid", method: "โอนผ่านธนาคาร" },
  { id: "2", appNumber: "APP-2026-002", applicant: "นางสมหญิง รักษ์ดิน", amount: "2,500", date: "1 มี.ค. 69", status: "pending", method: "-" },
  { id: "3", appNumber: "APP-2026-005", applicant: "วิสาหกิจชุมชนสมุนไพร", amount: "5,000", date: "27 ก.พ. 69", status: "pending", method: "-" },
  { id: "4", appNumber: "APP-2026-006", applicant: "นายประเสริฐ ทองแท้", amount: "2,500", date: "20 ก.พ. 69", status: "paid", method: "QR Payment" },
  { id: "5", appNumber: "APP-2026-007", applicant: "สหกรณ์สมุนไพรเหนือ", amount: "5,000", date: "15 ก.พ. 69", status: "paid", method: "โอนผ่านธนาคาร" },
  { id: "6", appNumber: "APP-2026-003", applicant: "น.ส.ดวงใจ สมุนไพร", amount: "3,500", date: "2 มี.ค. 69", status: "overdue", method: "-" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "ชำระแล้ว", className: "bg-success/15 text-success border-success/30" },
  pending: { label: "รอชำระ", className: "bg-warning/15 text-warning border-warning/30" },
  overdue: { label: "เลยกำหนด", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function ProviderAccountingPage() {
  const [query, setQuery] = useState("");
  const filtered = mockPayments.filter(
    (p) => !query || p.applicant.includes(query) || p.appNumber.includes(query)
  );

  const totalPaid = mockPayments.filter((p) => p.status === "paid").reduce((s, p) => s + parseInt(p.amount.replace(",", "")), 0);
  const totalPending = mockPayments.filter((p) => p.status !== "paid").reduce((s, p) => s + parseInt(p.amount.replace(",", "")), 0);

  return (
    <ProviderLayout title="การเงิน">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-lg gov-gradient p-3 card-shadow">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20">
                <Banknote className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-[10px] text-primary-foreground/70">ยอดรวมทั้งหมด</p>
                <p className="text-lg font-bold text-primary-foreground">฿{(totalPaid + totalPending).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 card-shadow">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">ชำระแล้ว</p>
                <p className="text-lg font-bold text-success">฿{totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 card-shadow">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">รอชำระ</p>
                <p className="text-lg font-bold text-warning">฿{totalPending.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 card-shadow">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">จำนวนรายการ</p>
                <p className="text-lg font-bold text-foreground">{mockPayments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="ค้นหาผู้ชำระ, เลขที่คำขอ..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8 h-9 text-xs" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
          <div className="hidden md:grid md:grid-cols-[1fr_100px_100px_120px_100px_80px] gap-3 px-4 py-2.5 border-b border-border bg-muted/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>ผู้ชำระ</span>
            <span>จำนวน</span>
            <span>วันที่</span>
            <span>ช่องทาง</span>
            <span>สถานะ</span>
            <span />
          </div>

          <div className="divide-y divide-border">
            {filtered.map((payment, i) => {
              const status = statusConfig[payment.status];
              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors md:grid md:grid-cols-[1fr_100px_100px_120px_100px_80px]"
                >
                  <div className="min-w-0 flex-1 md:flex-none">
                    <span className="font-mono text-[10px] text-primary font-bold">{payment.appNumber}</span>
                    <p className="text-xs font-medium text-card-foreground truncate">{payment.applicant}</p>
                  </div>
                  <span className="hidden md:block text-xs font-bold text-foreground">฿{payment.amount}</span>
                  <span className="hidden md:block text-xs text-muted-foreground">{payment.date}</span>
                  <span className="hidden md:block text-[10px] text-muted-foreground">{payment.method}</span>
                  <Badge variant="outline" className={`shrink-0 text-[9px] ${status.className}`}>{status.label}</Badge>
                  <Button variant="ghost" size="sm" className="hidden md:flex h-7 text-[10px]">
                    <Eye className="h-3 w-3" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
