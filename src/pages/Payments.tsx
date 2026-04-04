import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard, FileText, CheckCircle, Clock, AlertCircle,
  Download, Receipt, ArrowRight, Filter, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DOC_FEE, AUDIT_FEE } from "@/constants/gacp";

type PaymentStatus = "paid" | "pending" | "overdue";
type DocType = "QUOTATION" | "INVOICE" | "RECEIPT" | "TAX_INVOICE";

interface PaymentRecord {
  id: string;
  applicationId: string;
  type: "DOC_FEE" | "AUDIT_FEE";
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  dueDate: string;
  transactionId?: string;
  documents: { type: DocType; label: string; ready: boolean }[];
}

const DOC_LIFECYCLE: { type: DocType; label: string; abbr: string; color: string }[] = [
  { type: "QUOTATION", label: "ใบเสนอราคา", abbr: "QT", color: "text-info" },
  { type: "INVOICE", label: "ใบแจ้งหนี้", abbr: "INV", color: "text-warning" },
  { type: "RECEIPT", label: "ใบเสร็จรับเงิน", abbr: "RCT", color: "text-success" },
  { type: "TAX_INVOICE", label: "ใบกำกับภาษี", abbr: "TAX", color: "text-primary" },
];

const mockPayments: PaymentRecord[] = [
  {
    id: "PAY-001",
    applicationId: "GACP-2026-00123",
    type: "DOC_FEE",
    amount: DOC_FEE,
    status: "paid",
    paidAt: "1 มี.ค. 2569",
    dueDate: "5 มี.ค. 2569",
    transactionId: "TXN-20260301-001",
    documents: [
      { type: "QUOTATION", label: "ใบเสนอราคา", ready: true },
      { type: "INVOICE", label: "ใบแจ้งหนี้", ready: true },
      { type: "RECEIPT", label: "ใบเสร็จรับเงิน", ready: true },
      { type: "TAX_INVOICE", label: "ใบกำกับภาษี", ready: true },
    ],
  },
  {
    id: "PAY-002",
    applicationId: "GACP-2026-00123",
    type: "AUDIT_FEE",
    amount: AUDIT_FEE,
    status: "pending",
    dueDate: "15 มี.ค. 2569",
    documents: [
      { type: "QUOTATION", label: "ใบเสนอราคา", ready: true },
      { type: "INVOICE", label: "ใบแจ้งหนี้", ready: true },
      { type: "RECEIPT", label: "ใบเสร็จรับเงิน", ready: false },
      { type: "TAX_INVOICE", label: "ใบกำกับภาษี", ready: false },
    ],
  },
  {
    id: "PAY-003",
    applicationId: "GACP-2026-00456",
    type: "DOC_FEE",
    amount: DOC_FEE,
    status: "overdue",
    dueDate: "10 มี.ค. 2569",
    documents: [
      { type: "QUOTATION", label: "ใบเสนอราคา", ready: true },
      { type: "INVOICE", label: "ใบแจ้งหนี้", ready: true },
      { type: "RECEIPT", label: "ใบเสร็จรับเงิน", ready: false },
      { type: "TAX_INVOICE", label: "ใบกำกับภาษี", ready: false },
    ],
  },
];

const statusConfig: Record<PaymentStatus, { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
  paid: { label: "ชำระแล้ว", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  pending: { label: "รอชำระ", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  overdue: { label: "เกินกำหนด", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function PaymentsPage() {
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = mockPayments.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search && !p.applicationId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPaid = mockPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = mockPayments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-lg font-bold text-foreground md:text-xl">การชำระเงิน</h2>
        <p className="text-sm text-muted-foreground">จัดการการชำระเงินและดาวน์โหลดเอกสารทางการเงิน</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <p className="text-[10px] font-medium text-muted-foreground">ชำระแล้ว</p>
          <p className="mt-1 text-xl font-bold text-success">฿{totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <p className="text-[10px] font-medium text-muted-foreground">ค้างชำระ</p>
          <p className="mt-1 text-xl font-bold text-warning">฿{totalPending.toLocaleString()}</p>
        </div>
        <div className="hidden md:block rounded-xl border border-border bg-card p-4 card-shadow">
          <p className="text-[10px] font-medium text-muted-foreground">รายการทั้งหมด</p>
          <p className="mt-1 text-xl font-bold text-foreground">{mockPayments.length}</p>
        </div>
      </div>

      {/* Document Lifecycle Legend */}
      <div className="rounded-xl border border-border bg-card p-4 card-shadow">
        <h3 className="text-xs font-semibold mb-3">วงจรเอกสารการเงิน (Document Lifecycle)</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {DOC_LIFECYCLE.map((doc, i) => (
            <div key={doc.type} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 ${doc.color}`}>
                <Receipt className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold whitespace-nowrap">{doc.abbr}</span>
                <span className="text-[10px] whitespace-nowrap hidden sm:inline">{doc.label}</span>
              </div>
              {i < DOC_LIFECYCLE.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
          {(["all", "paid", "pending", "overdue"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "all" ? "ทั้งหมด" : statusConfig[f].label}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="ค้นหารหัสคำขอ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        {filtered.map((payment, i) => {
          const sc = statusConfig[payment.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 card-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sc.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${sc.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">
                        {payment.type === "DOC_FEE" ? "ค่าตรวจเอกสาร" : "ค่าประเมินหน้างาน"}
                      </p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      คำขอ: {payment.applicationId} • {payment.paidAt ? `ชำระเมื่อ ${payment.paidAt}` : `กำหนดชำระ ${payment.dueDate}`}
                    </p>
                    {payment.transactionId && (
                      <p className="text-[10px] text-muted-foreground">TXN: {payment.transactionId}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-foreground">฿{payment.amount.toLocaleString()}</p>
                  {payment.status !== "paid" && (
                    <Link to={`/payment/${payment.applicationId}`}>
                      <Button size="sm" className="mt-1 text-xs gold-gradient border-0">
                        <CreditCard className="mr-1 h-3 w-3" />
                        ชำระเงิน
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Document Lifecycle for this payment */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[10px] font-medium text-muted-foreground mb-2">เอกสารทางการเงิน</p>
                <div className="flex flex-wrap gap-1.5">
                  {payment.documents.map((doc) => (
                    <button
                      key={doc.type}
                      disabled={!doc.ready}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                        doc.ready
                          ? "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 cursor-pointer"
                          : "border-border bg-muted/30 text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {doc.ready ? <Download className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {doc.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
