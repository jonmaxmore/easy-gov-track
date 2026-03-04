import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, FileText, MapPin, Clock, CheckCircle, AlertCircle,
  CreditCard, Calendar, Download, MessageSquare, Leaf, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATUS_CONFIG, PLANT_TYPES, DOC_FEE, AUDIT_FEE } from "@/constants/gacp";
import type { ApplicationStatus, ApplicationTimeline, ApplicationComment } from "@/types/application";

// Mock data for a single application
const mockApp = {
  id: "GACP-2026-00123",
  status: "DOC_APPROVED" as ApplicationStatus,
  plantCode: "HMP",
  applicantName: "นายสมชาย ใจดี",
  farmName: "สวนสมุนไพรเชียงใหม่",
  province: "เชียงใหม่",
  areaRai: 5.5,
  createdAt: "28 ก.พ. 2569",
  timeline: [
    { status: "DRAFT" as ApplicationStatus, timestamp: "28 ก.พ. 2569 09:00", actor: "สมชาย ใจดี", note: "สร้างคำขอ" },
    { status: "SUBMITTED" as ApplicationStatus, timestamp: "28 ก.พ. 2569 14:30", actor: "สมชาย ใจดี", note: "ยื่นคำขอ" },
    { status: "PENDING_DOC_FEE" as ApplicationStatus, timestamp: "28 ก.พ. 2569 14:31", actor: "ระบบ", note: "รอชำระค่าตรวจเอกสาร" },
    { status: "DOC_FEE_PAID" as ApplicationStatus, timestamp: "1 มี.ค. 2569 10:15", actor: "Webhook", note: "ชำระ ฿5,000 สำเร็จ (TXN: PAY-20260301-001)" },
    { status: "ASSIGNED_FOR_REVIEW" as ApplicationStatus, timestamp: "1 มี.ค. 2569 11:00", actor: "Coordinator", note: "มอบหมายให้ ดร.สมศรี ตรวจเอกสาร" },
    { status: "REVISION_REQUESTED" as ApplicationStatus, timestamp: "2 มี.ค. 2569 16:00", actor: "ดร.สมศรี", note: "ส่งกลับแก้ไข SOP กระบวนการผลิต" },
    { status: "ASSIGNED_FOR_REVIEW" as ApplicationStatus, timestamp: "3 มี.ค. 2569 09:30", actor: "สมชาย ใจดี", note: "แก้ไขและส่งกลับ" },
    { status: "DOC_APPROVED" as ApplicationStatus, timestamp: "3 มี.ค. 2569 15:00", actor: "ดร.สมศรี", note: "เอกสารผ่านการตรวจสอบ" },
  ] as ApplicationTimeline[],
  comments: [
    {
      id: "c1",
      author: "ดร.สมศรี รักษ์มาตรฐาน",
      role: "Auditor",
      content: "เอกสาร SOP กระบวนการผลิตยังไม่ครบถ้วน กรุณาเพิ่มขั้นตอนการควบคุมคุณภาพและการบันทึกข้อมูลระหว่างการผลิต",
      createdAt: "2 มี.ค. 2569 16:00",
    },
    {
      id: "c2",
      author: "สมชาย ใจดี",
      role: "User",
      content: "แก้ไข SOP เรียบร้อยแล้ว เพิ่มขั้นตอน QC และ Data Recording ตามที่แนะนำ",
      createdAt: "3 มี.ค. 2569 09:30",
    },
    {
      id: "c3",
      author: "ดร.สมศรี รักษ์มาตรฐาน",
      role: "Auditor",
      content: "เอกสารครบถ้วนสมบูรณ์ ผ่านการตรวจสอบ",
      createdAt: "3 มี.ค. 2569 15:00",
    },
  ] as ApplicationComment[],
  payments: [
    { type: "DOC_FEE" as const, amount: DOC_FEE, status: "paid" as const, paidAt: "1 มี.ค. 2569", transactionId: "PAY-20260301-001" },
    { type: "AUDIT_FEE" as const, amount: AUDIT_FEE, status: "pending" as const },
  ],
};

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const app = mockApp; // In real app, fetch by id
  const statusConfig = STATUS_CONFIG[app.status];
  const plant = PLANT_TYPES.find((p) => p.code === app.plantCode);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Back */}
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        กลับหน้าหลัก
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">{app.id}</h2>
          <p className="text-sm text-muted-foreground">ยื่นเมื่อ {app.createdAt}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}>
          <CheckCircle className="h-3.5 w-3.5" />
          {statusConfig.label}
        </span>
      </div>

      {/* User Action Banner */}
      {statusConfig.userAction && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-lg border-2 border-primary/30 bg-primary/5 p-4"
        >
          <div>
            <p className="text-sm font-semibold text-primary">ดำเนินการต่อ</p>
            <p className="text-xs text-muted-foreground">{statusConfig.description}</p>
          </div>
          <Link to={`/payment/${app.id}`}>
            <Button size="sm" className="gold-gradient border-0">
              <CreditCard className="mr-1 h-4 w-4" />
              {statusConfig.userAction}
            </Button>
          </Link>
        </motion.div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: Info cards */}
        <div className="space-y-4 md:col-span-2">
          {/* Application Info */}
          <div className="rounded-xl border border-border bg-card p-4 card-shadow">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              ข้อมูลคำขอ
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InfoItem label="ชนิดสมุนไพร" value={plant ? `${plant.nameTh}` : "-"} />
              <InfoItem label="ระดับควบคุม" value={plant?.controlLevel === "HIGH_CONTROL" ? "เข้มงวด" : "ทั่วไป"} />
              <InfoItem label="ผู้ยื่น" value={app.applicantName} />
              <InfoItem label="แปลงปลูก" value={app.farmName} />
              <InfoItem label="จังหวัด" value={app.province} />
              <InfoItem label="พื้นที่" value={`${app.areaRai} ไร่`} />
            </div>
          </div>

          {/* Payment Status */}
          <div className="rounded-xl border border-border bg-card p-4 card-shadow">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              สถานะการชำระเงิน
            </h3>
            <div className="space-y-2">
              {app.payments.map((pay) => (
                <div
                  key={pay.type}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    pay.status === "paid"
                      ? "border-success/20 bg-success/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {pay.status === "paid" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {pay.type === "DOC_FEE" ? "ค่าตรวจเอกสาร" : "ค่าประเมินหน้างาน"}
                      </p>
                      {pay.paidAt && (
                        <p className="text-[10px] text-muted-foreground">ชำระเมื่อ {pay.paidAt}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">฿{pay.amount.toLocaleString()}</p>
                    <span
                      className={`text-[10px] font-medium ${
                        pay.status === "paid" ? "text-success" : "text-warning"
                      }`}
                    >
                      {pay.status === "paid" ? "ชำระแล้ว" : "รอชำระ"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="rounded-xl border border-border bg-card p-4 card-shadow">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              ความคิดเห็นเจ้าหน้าที่
            </h3>
            <div className="space-y-3">
              {app.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`rounded-lg border p-3 ${
                    comment.role === "Auditor"
                      ? "border-info/20 bg-info/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold">{comment.author}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          comment.role === "Auditor"
                            ? "bg-info/10 text-info"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {comment.role === "Auditor" ? "เจ้าหน้าที่" : "ผู้ยื่น"}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{comment.createdAt}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <h3 className="mb-4 text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            ลำดับเหตุการณ์
          </h3>
          <div className="relative space-y-0">
            {app.timeline.map((event, i) => {
              const config = STATUS_CONFIG[event.status];
              const isLast = i === app.timeline.length - 1;
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isLast ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className={`text-xs font-semibold ${isLast ? "text-primary" : "text-foreground"}`}>
                      {config.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{event.timestamp}</p>
                    {event.note && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{event.note}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground">โดย: {event.actor}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
