import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Download, Eye, Search, Filter, CheckCircle, Clock,
  AlertCircle, Upload, FolderOpen, File, Image, FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type DocStatus = "approved" | "pending" | "rejected" | "expired";
type DocCategory = "all" | "application" | "financial" | "certificate" | "audit" | "compliance";

interface Document {
  id: string;
  name: string;
  category: DocCategory;
  applicationId: string;
  uploadedDate: string;
  status: DocStatus;
  fileType: string;
  fileSize: string;
  description?: string;
}

const mockDocuments: Document[] = [
  { id: "DOC-001", name: "บัตรประจำตัวประชาชน", category: "application", applicationId: "GACP-2026-00123", uploadedDate: "28 ก.พ. 2569", status: "approved", fileType: "PDF", fileSize: "1.2 MB", description: "สำเนาบัตรประชาชนผู้สมัคร" },
  { id: "DOC-002", name: "โฉนดที่ดิน / สัญญาเช่า", category: "application", applicationId: "GACP-2026-00123", uploadedDate: "28 ก.พ. 2569", status: "approved", fileType: "PDF", fileSize: "3.5 MB", description: "เอกสารสิทธิ์ที่ดินแปลงปลูก" },
  { id: "DOC-003", name: "แผนที่แปลงปลูก", category: "application", applicationId: "GACP-2026-00123", uploadedDate: "28 ก.พ. 2569", status: "approved", fileType: "JPG", fileSize: "2.1 MB" },
  { id: "DOC-004", name: "ใบเสนอราคา (QT-001)", category: "financial", applicationId: "GACP-2026-00123", uploadedDate: "1 มี.ค. 2569", status: "approved", fileType: "PDF", fileSize: "0.5 MB" },
  { id: "DOC-005", name: "ใบแจ้งหนี้ (INV-001)", category: "financial", applicationId: "GACP-2026-00123", uploadedDate: "1 มี.ค. 2569", status: "approved", fileType: "PDF", fileSize: "0.5 MB" },
  { id: "DOC-006", name: "ใบเสร็จรับเงิน (RCT-001)", category: "financial", applicationId: "GACP-2026-00123", uploadedDate: "1 มี.ค. 2569", status: "approved", fileType: "PDF", fileSize: "0.4 MB" },
  { id: "DOC-007", name: "ใบกำกับภาษี (TAX-001)", category: "financial", applicationId: "GACP-2026-00123", uploadedDate: "1 มี.ค. 2569", status: "approved", fileType: "PDF", fileSize: "0.4 MB" },
  { id: "DOC-008", name: "ใบรับรอง GACP", category: "certificate", applicationId: "GACP-2026-00123", uploadedDate: "15 มี.ค. 2569", status: "approved", fileType: "PDF", fileSize: "1.8 MB", description: "ใบรับรอง GACP-TH-2569-00123" },
  { id: "DOC-009", name: "รายงานการตรวจประเมิน", category: "audit", applicationId: "GACP-2026-00123", uploadedDate: "10 มี.ค. 2569", status: "approved", fileType: "PDF", fileSize: "5.2 MB", description: "ผลการตรวจประเมินหน้างาน" },
  { id: "DOC-010", name: "SOP การเพาะปลูก", category: "compliance", applicationId: "GACP-2026-00123", uploadedDate: "25 ก.พ. 2569", status: "approved", fileType: "PDF", fileSize: "2.3 MB" },
  { id: "DOC-011", name: "ผลตรวจสารตกค้าง", category: "compliance", applicationId: "GACP-2026-00123", uploadedDate: "5 มี.ค. 2569", status: "approved", fileType: "PDF", fileSize: "0.8 MB" },
  { id: "DOC-012", name: "แบบคำขอ GACP", category: "application", applicationId: "GACP-2026-00456", uploadedDate: "1 มี.ค. 2569", status: "pending", fileType: "PDF", fileSize: "1.0 MB" },
  { id: "DOC-013", name: "สำเนาทะเบียนบ้าน", category: "application", applicationId: "GACP-2026-00456", uploadedDate: "1 มี.ค. 2569", status: "pending", fileType: "PDF", fileSize: "0.9 MB" },
  { id: "DOC-014", name: "ใบเสนอราคา (QT-002)", category: "financial", applicationId: "GACP-2026-00456", uploadedDate: "2 มี.ค. 2569", status: "pending", fileType: "PDF", fileSize: "0.5 MB" },
  { id: "DOC-015", name: "ผลตรวจคุณภาพน้ำ", category: "compliance", applicationId: "GACP-2026-00789", uploadedDate: "3 มี.ค. 2569", status: "rejected", fileType: "PDF", fileSize: "1.1 MB", description: "ผลตรวจไม่ผ่านเกณฑ์ กรุณาส่งใหม่" },
  { id: "DOC-016", name: "ใบรับรอง GACP (หมดอายุ)", category: "certificate", applicationId: "GACP-2025-00050", uploadedDate: "1 มี.ค. 2567", status: "expired", fileType: "PDF", fileSize: "1.7 MB" },
];

const categoryConfig: Record<string, { label: string; icon: typeof FileText }> = {
  all: { label: "ทั้งหมด", icon: FolderOpen },
  application: { label: "คำขอ", icon: FileText },
  financial: { label: "การเงิน", icon: FileSpreadsheet },
  certificate: { label: "ใบรับรอง", icon: File },
  audit: { label: "ตรวจประเมิน", icon: Eye },
  compliance: { label: "มาตรฐาน", icon: CheckCircle },
};

const statusConfig: Record<DocStatus, { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
  approved: { label: "อนุมัติ", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  pending: { label: "รอตรวจ", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  rejected: { label: "ไม่ผ่าน", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
  expired: { label: "หมดอายุ", icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted" },
};

const fileIconMap: Record<string, typeof FileText> = {
  PDF: FileText,
  JPG: Image,
  PNG: Image,
  XLS: FileSpreadsheet,
};

export default function DocumentsPage() {
  const [category, setCategory] = useState<DocCategory>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DocStatus>("all");

  const filtered = mockDocuments.filter((d) => {
    if (category !== "all" && d.category !== category) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.applicationId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: mockDocuments.length,
    approved: mockDocuments.filter((d) => d.status === "approved").length,
    pending: mockDocuments.filter((d) => d.status === "pending").length,
    rejected: mockDocuments.filter((d) => d.status === "rejected").length,
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground md:text-xl">จัดการเอกสาร</h2>
          <p className="text-sm text-muted-foreground">เอกสารทั้งหมดในระบบ GACP Certification</p>
        </div>
        <Button size="sm" className="gold-gradient border-0">
          <Upload className="mr-1 h-3.5 w-3.5" />
          อัปโหลด
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <p className="text-[10px] font-medium text-muted-foreground">เอกสารทั้งหมด</p>
          <p className="mt-1 text-xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <p className="text-[10px] font-medium text-muted-foreground">อนุมัติแล้ว</p>
          <p className="mt-1 text-xl font-bold text-success">{stats.approved}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <p className="text-[10px] font-medium text-muted-foreground">รอตรวจสอบ</p>
          <p className="mt-1 text-xl font-bold text-warning">{stats.pending}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <p className="text-[10px] font-medium text-muted-foreground">ไม่ผ่าน</p>
          <p className="mt-1 text-xl font-bold text-destructive">{stats.rejected}</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {Object.entries(categoryConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => setCategory(key as DocCategory)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                category === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="h-3 w-3" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="ค้นหาเอกสารหรือรหัสคำขอ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "approved", "pending", "rejected", "expired"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "all" ? "ทั้งหมด" : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">ไม่พบเอกสาร</p>
          </div>
        )}
        {filtered.map((doc, i) => {
          const sc = statusConfig[doc.status];
          const StatusIcon = sc.icon;
          const FileIcon = fileIconMap[doc.fileType] || FileText;
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 card-shadow hover:border-primary/20 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${sc.bg} ${sc.color}`}>
                    <StatusIcon className="h-2.5 w-2.5" />
                    {sc.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {doc.applicationId} • {doc.uploadedDate} • {doc.fileType} {doc.fileSize}
                </p>
                {doc.description && (
                  <p className="text-[10px] text-muted-foreground/70 truncate">{doc.description}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-card p-4 card-shadow">
        <p className="text-xs text-muted-foreground">
          แสดง {filtered.length} จาก {mockDocuments.length} รายการ
        </p>
      </div>
    </div>
  );
}
