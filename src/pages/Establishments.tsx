import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin, Plus, Building2, Leaf, CheckCircle, Clock, AlertTriangle,
  ChevronRight, Globe, Ruler, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Establishment {
  id: string;
  name: string;
  type: "farm" | "greenhouse" | "processing";
  province: string;
  district: string;
  areaRai: number;
  gps: { lat: number; lng: number };
  status: "active" | "pending_cert" | "expired";
  certId?: string;
  certExpiry?: string;
  plants: string[];
}

const mockEstablishments: Establishment[] = [
  {
    id: "EST-001",
    name: "สวนสมุนไพรเชียงใหม่",
    type: "farm",
    province: "เชียงใหม่",
    district: "แม่ริม",
    areaRai: 5.5,
    gps: { lat: 18.91, lng: 98.97 },
    status: "active",
    certId: "GACP-CERT-2026-001",
    certExpiry: "15 มี.ค. 2572",
    plants: ["กัญชง", "ฟ้าทะลายโจร"],
  },
  {
    id: "EST-002",
    name: "ไร่กระท่อมอีสาน",
    type: "farm",
    province: "ขอนแก่น",
    district: "เมือง",
    areaRai: 12,
    gps: { lat: 16.43, lng: 102.83 },
    status: "pending_cert",
    plants: ["กระท่อม"],
  },
  {
    id: "EST-003",
    name: "โรงเรือนขมิ้นชันนครปฐม",
    type: "greenhouse",
    province: "นครปฐม",
    district: "กำแพงแสน",
    areaRai: 3,
    gps: { lat: 14.02, lng: 99.98 },
    status: "expired",
    certId: "GACP-CERT-2025-088",
    certExpiry: "1 ม.ค. 2569",
    plants: ["ขมิ้นชัน"],
  },
];

const statusMap = {
  active: { label: "ใช้งาน", color: "text-success", bg: "bg-success/10", icon: CheckCircle },
  pending_cert: { label: "รอใบรับรอง", color: "text-warning", bg: "bg-warning/10", icon: Clock },
  expired: { label: "หมดอายุ", color: "text-destructive", bg: "bg-destructive/10", icon: AlertTriangle },
};

const typeLabels = {
  farm: "แปลงเพาะปลูก",
  greenhouse: "โรงเรือน",
  processing: "โรงแปรรูป",
};

export default function EstablishmentsPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground md:text-xl">สถานประกอบการ</h2>
          <p className="text-sm text-muted-foreground">จัดการฟาร์มและสถานที่เพาะปลูก (1 ฟาร์ม = 1 ใบรับรอง)</p>
        </div>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">เพิ่มสถานที่</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-3 card-shadow text-center">
          <p className="text-2xl font-bold text-success">{mockEstablishments.filter((e) => e.status === "active").length}</p>
          <p className="text-[10px] text-muted-foreground">ใช้งาน</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 card-shadow text-center">
          <p className="text-2xl font-bold text-warning">{mockEstablishments.filter((e) => e.status === "pending_cert").length}</p>
          <p className="text-[10px] text-muted-foreground">รอรับรอง</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 card-shadow text-center">
          <p className="text-2xl font-bold text-destructive">{mockEstablishments.filter((e) => e.status === "expired").length}</p>
          <p className="text-[10px] text-muted-foreground">หมดอายุ</p>
        </div>
      </div>

      {/* Establishments list */}
      <div className="space-y-3">
        {mockEstablishments.map((est, i) => {
          const st = statusMap[est.status];
          const StIcon = st.icon;
          return (
            <motion.div
              key={est.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card card-shadow overflow-hidden"
            >
              {/* Header with status band */}
              <div className={`px-4 py-2 ${st.bg} flex items-center justify-between`}>
                <div className="flex items-center gap-1.5">
                  <StIcon className={`h-3.5 w-3.5 ${st.color}`} />
                  <span className={`text-xs font-semibold ${st.color}`}>{st.label}</span>
                </div>
                {est.certId && (
                  <span className="text-[10px] text-muted-foreground">{est.certId}</span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{est.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {est.district}, {est.province}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                </div>

                {/* Details Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">ประเภท</p>
                    <p className="text-xs font-medium">{typeLabels[est.type]}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground">พื้นที่</p>
                    </div>
                    <p className="text-xs font-medium">{est.areaRai} ไร่</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground">GPS</p>
                    </div>
                    <p className="text-xs font-medium">{est.gps.lat.toFixed(2)}, {est.gps.lng.toFixed(2)}</p>
                  </div>
                  {est.certExpiry && (
                    <div className="rounded-lg bg-muted/50 p-2">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground">หมดอายุ</p>
                      </div>
                      <p className="text-xs font-medium">{est.certExpiry}</p>
                    </div>
                  )}
                </div>

                {/* Plants */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {est.plants.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <Leaf className="h-2.5 w-2.5" />
                      {p}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                {est.status === "pending_cert" && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <Link to="/submit">
                      <Button size="sm" className="w-full text-xs">
                        ยื่นคำขอรับรอง GACP
                      </Button>
                    </Link>
                  </div>
                )}
                {est.status === "expired" && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <Link to="/submit">
                      <Button size="sm" variant="destructive" className="w-full text-xs">
                        ต่ออายุใบรับรอง
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
