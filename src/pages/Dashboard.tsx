import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatusCard from "@/components/StatusCard";
import ApplicationList, { Application } from "@/components/ApplicationList";
import {
  FileText, Clock, CheckCircle, AlertTriangle, Leaf, ArrowRight,
  Sprout, Award, BarChart3, CreditCard, Building2, ClipboardList, Bell, FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mockApplications: Application[] = [
  { id: "GACP-2026-00123", title: "ขอรับรองมาตรฐาน GACP - กัญชง", submittedDate: "28 ก.พ. 2569", status: "approved", type: "รายบุคคล" },
  { id: "GACP-2026-00456", title: "ขอรับรองมาตรฐาน GACP - ฟ้าทะลายโจร", submittedDate: "1 มี.ค. 2569", status: "pending", type: "รายบุคคล" },
  { id: "GACP-2026-00789", title: "ต่ออายุใบรับรอง - กระชายขาว", submittedDate: "2 มี.ค. 2569", status: "reviewing", type: "วิสาหกิจ" },
  { id: "GACP-2026-00101", title: "ขอรับรองมาตรฐาน GACP - ขมิ้นชัน", submittedDate: "-", status: "draft", type: "รายบุคคล" },
];

const quickActions = [
  { icon: FileText, label: "ยื่นคำขอรับรอง", description: "ยื่นคำขอใหม่", path: "/submit", color: "bg-primary/10 text-primary" },
  { icon: CreditCard, label: "การชำระเงิน", description: "จัดการการเงิน", path: "/payments", color: "bg-warning/10 text-warning" },
  { icon: Sprout, label: "ข้อมูลการปลูก", description: "บันทึกรอบปลูก", path: "/planting", color: "bg-success/10 text-success" },
  { icon: Award, label: "ใบรับรอง", description: "ดูใบรับรอง", path: "/certificates", color: "bg-secondary/10 text-secondary" },
  { icon: Building2, label: "สถานประกอบการ", description: "จัดการฟาร์ม", path: "/establishments", color: "bg-info/10 text-info" },
  { icon: ClipboardList, label: "SOP Builder", description: "สร้าง SOP", path: "/sop-builder", color: "bg-primary/10 text-primary" },
  { icon: BarChart3, label: "Track & Trace", description: "ตรวจสอบ QR", path: "/track", color: "bg-info/10 text-info" },
  { icon: Bell, label: "แจ้งเตือน", description: "ข่าวสารล่าสุด", path: "/notifications", color: "bg-destructive/10 text-destructive" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground md:text-xl">สวัสดีครับ, สมชาย</h2>
          <p className="text-sm text-muted-foreground">ยินดีต้อนรับสู่ระบบรับรองมาตรฐาน GACP</p>
        </div>
        <Link to="/submit" className="hidden sm:block">
          <Button size="sm">
            <FileText className="mr-1 h-4 w-4" />
            ยื่นคำขอใหม่
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatusCard icon={FileText} label="คำขอทั้งหมด" value={4} variant="primary" />
        <StatusCard icon={Clock} label="รอตรวจสอบ" value={1} variant="warning" />
        <StatusCard icon={CheckCircle} label="อนุมัติแล้ว" value={1} variant="success" />
        <StatusCard icon={AlertTriangle} label="ร่าง" value={1} />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">เมนูลัด</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={action.path}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:bg-muted/50"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-card-foreground">{action.label}</p>
                  <p className="text-[10px] text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile CTA */}
      <Link to="/submit" className="sm:hidden block">
        <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/15 p-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">ยื่นคำขอรับรองใหม่</span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </Link>

      {/* Applications */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">คำขอล่าสุด</h3>
        <ApplicationList applications={mockApplications} />
      </div>
    </div>
  );
}
