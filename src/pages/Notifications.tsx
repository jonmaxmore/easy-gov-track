import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, CheckCircle, CreditCard, FileText, AlertTriangle, Clock,
  Calendar, MessageSquare, Shield, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NotiType = "payment" | "status" | "audit" | "document" | "system";

interface Notification {
  id: string;
  type: NotiType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const typeConfig: Record<NotiType, { icon: typeof Bell; color: string; bg: string }> = {
  payment: { icon: CreditCard, color: "text-warning", bg: "bg-warning/10" },
  status: { icon: FileText, color: "text-info", bg: "bg-info/10" },
  audit: { icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
  document: { icon: MessageSquare, color: "text-secondary", bg: "bg-secondary/10" },
  system: { icon: Shield, color: "text-muted-foreground", bg: "bg-muted" },
};

const mockNotifications: Notification[] = [
  {
    id: "n1", type: "payment", title: "รอชำระค่าประเมินหน้างาน",
    message: "คำขอ GACP-2026-00123 เอกสารผ่านแล้ว กรุณาชำระค่าประเมิน ฿25,000 ภายใน 15 มี.ค. 2569",
    createdAt: "5 นาทีที่แล้ว", read: false, actionUrl: "/payment/GACP-2026-00123", actionLabel: "ชำระเงิน",
  },
  {
    id: "n2", type: "status", title: "เอกสารผ่านการตรวจสอบ",
    message: "คำขอ GACP-2026-00123 ผ่านการตรวจเอกสารแล้ว โดย ดร.สมศรี รักษ์มาตรฐาน",
    createdAt: "2 ชั่วโมงที่แล้ว", read: false,
  },
  {
    id: "n3", type: "audit", title: "นัดหมายตรวจประเมินหน้างาน",
    message: "คำขอ GACP-2026-00789 นัดหมายลงพื้นที่วันที่ 20 มี.ค. 2569 เวลา 09:00 น.",
    createdAt: "1 วันที่แล้ว", read: true,
  },
  {
    id: "n4", type: "document", title: "ส่งกลับแก้ไข SOP",
    message: "Auditor ส่งกลับ SOP กระบวนการผลิต กรุณาเพิ่มขั้นตอน QC",
    createdAt: "2 วันที่แล้ว", read: true, actionUrl: "/application/GACP-2026-00456", actionLabel: "ดูรายละเอียด",
  },
  {
    id: "n5", type: "system", title: "ระบบปรับปรุงเวอร์ชัน",
    message: "ระบบ GACP Certification ปรับปรุงเป็นเวอร์ชัน 2.5 เพิ่มฟีเจอร์ Document Lifecycle",
    createdAt: "3 วันที่แล้ว", read: true,
  },
  {
    id: "n6", type: "payment", title: "ชำระเงินสำเร็จ",
    message: "ชำระค่าตรวจเอกสาร ฿5,000 สำเร็จ TXN: PAY-20260301-001",
    createdAt: "1 สัปดาห์ที่แล้ว", read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground md:text-xl">แจ้งเตือน</h2>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} รายการยังไม่ได้อ่าน` : "ไม่มีรายการใหม่"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />
            อ่านทั้งหมด
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((noti, i) => {
          const tc = typeConfig[noti.type];
          const NotiIcon = tc.icon;
          return (
            <motion.div
              key={noti.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-xl border p-4 transition-colors ${
                noti.read
                  ? "border-border bg-card"
                  : "border-primary/20 bg-primary/[0.02]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tc.bg}`}>
                  <NotiIcon className={`h-4 w-4 ${tc.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${noti.read ? "text-foreground" : "text-primary"}`}>
                        {!noti.read && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary" />}
                        {noti.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{noti.message}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{noti.createdAt}</span>
                  </div>
                  {noti.actionUrl && (
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                        {noti.actionLabel}
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
