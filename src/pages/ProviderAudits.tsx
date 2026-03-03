import { motion } from "framer-motion";
import {
  ClipboardList, MapPin, Calendar, User, CheckCircle, Clock, Eye, AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProviderLayout from "@/components/ProviderLayout";

const mockAudits = [
  { id: "1", appNumber: "APP-2026-003", applicant: "น.ส.ดวงใจ สมุนไพร", herb: "กระชายขาว", location: "อ.เมือง จ.ขอนแก่น", scheduledDate: "5 มี.ค. 69", auditor: "ดร.สุชาติ วิจัย", status: "scheduled", mode: "on-site" },
  { id: "2", appNumber: "APP-2026-006", applicant: "นายประเสริฐ ทองแท้", herb: "กัญชง", location: "อ.เมือง จ.ลำพูน", scheduledDate: "10 มี.ค. 69", auditor: "ดร.สุชาติ วิจัย", status: "scheduled", mode: "on-site" },
  { id: "3", appNumber: "APP-2026-007", applicant: "สหกรณ์สมุนไพรเหนือ", herb: "ฟ้าทะลายโจร", location: "อ.แม่ริม จ.เชียงใหม่", scheduledDate: "20 ก.พ. 69", auditor: "ดร.วิภา ตรวจดี", status: "completed", mode: "on-site" },
  { id: "4", appNumber: "APP-2026-008", applicant: "นายสมศักดิ์ ปลูกดี", herb: "ขมิ้นชัน", location: "อ.หาดใหญ่ จ.สงขลา", scheduledDate: "25 ก.พ. 69", auditor: "ดร.วิภา ตรวจดี", status: "completed", mode: "remote" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  scheduled: { label: "นัดตรวจแล้ว", className: "bg-info/15 text-info border-info/30" },
  completed: { label: "ตรวจเสร็จ", className: "bg-success/15 text-success border-success/30" },
  overdue: { label: "เลยกำหนด", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function ProviderAuditsPage() {
  return (
    <ProviderLayout title="การตรวจสอบ">
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 card-shadow text-center">
            <p className="text-lg font-bold text-info">2</p>
            <p className="text-[10px] text-muted-foreground">รอตรวจ</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 card-shadow text-center">
            <p className="text-lg font-bold text-success">2</p>
            <p className="text-[10px] text-muted-foreground">ตรวจเสร็จ</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 card-shadow text-center">
            <p className="text-lg font-bold text-destructive">0</p>
            <p className="text-[10px] text-muted-foreground">เลยกำหนด</p>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {mockAudits.map((audit, i) => {
            const status = statusConfig[audit.status];
            return (
              <motion.div
                key={audit.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-card p-4 card-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-primary">{audit.appNumber}</span>
                        <Badge variant="outline" className="text-[9px]">{audit.mode === "remote" ? "Remote" : "On-site"}</Badge>
                      </div>
                      <p className="text-xs font-semibold text-card-foreground">{audit.applicant}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${status.className}`}>{status.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mb-3">
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{audit.location}</div>
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{audit.scheduledDate}</div>
                  <div className="flex items-center gap-1"><User className="h-3 w-3" />{audit.auditor}</div>
                  <div className="flex items-center gap-1">
                    {audit.status === "completed" ? <CheckCircle className="h-3 w-3 text-success" /> : <Clock className="h-3 w-3" />}
                    {audit.herb}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-[10px] flex-1">
                    <Eye className="mr-1 h-3 w-3" /> ดูรายละเอียด
                  </Button>
                  {audit.status === "scheduled" && (
                    <Button size="sm" className="text-[10px] flex-1">
                      <ClipboardList className="mr-1 h-3 w-3" /> เริ่มตรวจ
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ProviderLayout>
  );
}
