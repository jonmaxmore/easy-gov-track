import { motion } from "framer-motion";
import { Award, Download, Eye, Calendar, CheckCircle, MapPin, Ruler, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const certificates = [
  {
    id: "CERT-2026-001",
    farmName: "แปลงสมุนไพรบ้านดอยสะเก็ด",
    farmArea: 12.5,
    province: "เชียงใหม่",
    district: "ดอยสะเก็ด",
    certNumber: "GACP-TH-2569-00123",
    issuedDate: "15 มี.ค. 2569",
    expiryDate: "14 มี.ค. 2572",
    issuedDateRaw: new Date("2026-03-15"),
    expiryDateRaw: new Date("2029-03-14"),
    status: "active" as const,
    herbsGrown: ["กัญชง (Hemp)", "ขมิ้นชัน"],
    auditor: "ดร.สมชาย วิทยากร",
    lastAuditDate: "10 มี.ค. 2569",
    auditScore: 92,
  },
  {
    id: "CERT-2025-045",
    farmName: "สวนสมุนไพรทุ่งสง",
    farmArea: 8.0,
    province: "นครศรีธรรมราช",
    district: "ทุ่งสง",
    certNumber: "GACP-TH-2568-00045",
    issuedDate: "10 ส.ค. 2568",
    expiryDate: "9 ส.ค. 2571",
    issuedDateRaw: new Date("2025-08-10"),
    expiryDateRaw: new Date("2028-08-09"),
    status: "active" as const,
    herbsGrown: ["ฟ้าทะลายโจร", "ขิง"],
    auditor: "ดร.วิภาวดี ศรีสุข",
    lastAuditDate: "5 ส.ค. 2568",
    auditScore: 88,
  },
  {
    id: "CERT-2024-012",
    farmName: "ฟาร์มสมุนไพรปากช่อง",
    farmArea: 5.3,
    province: "นครราชสีมา",
    district: "ปากช่อง",
    certNumber: "GACP-TH-2567-00012",
    issuedDate: "5 มี.ค. 2567",
    expiryDate: "4 มี.ค. 2570",
    issuedDateRaw: new Date("2024-03-05"),
    expiryDateRaw: new Date("2027-03-04"),
    status: "expired" as const,
    herbsGrown: ["บัวบก"],
    auditor: "ดร.ประเสริฐ จันทร์เพ็ญ",
    lastAuditDate: "1 มี.ค. 2567",
    auditScore: 85,
  },
];

const statusConfig = {
  active: { label: "ใช้งานได้", className: "bg-success/15 text-success border-success/30" },
  expired: { label: "หมดอายุ", className: "bg-destructive/15 text-destructive border-destructive/30" },
  expiring_soon: { label: "ใกล้หมดอายุ", className: "bg-warning/15 text-warning border-warning/30" },
};

function getRemainingDays(expiryDate: Date): number {
  const now = new Date();
  return Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getCertProgress(issuedDate: Date, expiryDate: Date): number {
  const now = new Date();
  const total = expiryDate.getTime() - issuedDate.getTime();
  const elapsed = now.getTime() - issuedDate.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

function getEffectiveStatus(cert: typeof certificates[0]) {
  if (cert.status === "expired") return "expired";
  const remaining = getRemainingDays(cert.expiryDateRaw);
  if (remaining <= 180) return "expiring_soon";
  return "active";
}

export default function CertificatesPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-lg font-bold text-foreground md:text-xl">ใบรับรอง GACP</h2>
        <p className="text-sm text-muted-foreground">
          ใบรับรองมาตรฐานรายฟาร์ม (1 ฟาร์ม = 1 ใบรับรอง, อายุ 3 ปี)
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-success">{certificates.filter(c => c.status === "active").length}</p>
          <p className="text-[10px] text-muted-foreground">ใช้งานได้</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-warning">
            {certificates.filter(c => getEffectiveStatus(c) === "expiring_soon").length}
          </p>
          <p className="text-[10px] text-muted-foreground">ใกล้หมดอายุ</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-lg font-bold text-destructive">{certificates.filter(c => c.status === "expired").length}</p>
          <p className="text-[10px] text-muted-foreground">หมดอายุ</p>
        </div>
      </div>

      <div className="space-y-3">
        {certificates.map((cert, i) => {
          const effectiveStatus = getEffectiveStatus(cert);
          const remaining = getRemainingDays(cert.expiryDateRaw);
          const progress = getCertProgress(cert.issuedDateRaw, cert.expiryDateRaw);

          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 card-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    effectiveStatus === "active" ? "bg-success/10"
                    : effectiveStatus === "expiring_soon" ? "bg-warning/10"
                    : "bg-muted"
                  }`}>
                    <Award className={`h-5 w-5 ${
                      effectiveStatus === "active" ? "text-success"
                      : effectiveStatus === "expiring_soon" ? "text-warning"
                      : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{cert.farmName}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{cert.certNumber}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] ${statusConfig[effectiveStatus].className}`}>
                  {statusConfig[effectiveStatus].label}
                </Badge>
              </div>

              {/* Farm Info */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{cert.district}, {cert.province}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  <span>พื้นที่ {cert.farmArea} ไร่</span>
                </div>
              </div>

              {/* Herbs grown on this farm */}
              <div className="flex flex-wrap gap-1 mb-2">
                {cert.herbsGrown.map((herb) => (
                  <span key={herb} className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {herb}
                  </span>
                ))}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>ออกเมื่อ: {cert.issuedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>หมดอายุ: {cert.expiryDate}</span>
                </div>
              </div>

              {/* Validity Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">อายุใบรับรอง (3 ปี)</span>
                  <span className={`font-medium ${
                    remaining <= 0 ? "text-destructive" : remaining <= 180 ? "text-warning" : "text-success"
                  }`}>
                    {remaining <= 0 ? "หมดอายุแล้ว" : `เหลือ ${remaining} วัน`}
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-1.5"
                />
              </div>

              {/* Audit Info */}
              <div className="rounded-lg bg-muted/50 p-2 mb-3 text-[10px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>ผู้ตรวจ: {cert.auditor}</span>
                  <span>คะแนน: <span className="font-semibold text-foreground">{cert.auditScore}/100</span></span>
                </div>
                <div className="mt-0.5">ตรวจล่าสุด: {cert.lastAuditDate}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs flex-1">
                  <Eye className="mr-1 h-3 w-3" />
                  ดูใบรับรอง
                </Button>
                <Button variant="outline" size="sm" className="text-xs flex-1">
                  <Download className="mr-1 h-3 w-3" />
                  ดาวน์โหลด
                </Button>
                {effectiveStatus === "expiring_soon" && (
                  <Button size="sm" className="text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    ต่ออายุ
                  </Button>
                )}
                {effectiveStatus === "expired" && (
                  <Button size="sm" variant="destructive" className="text-xs">
                    <RefreshCw className="mr-1 h-3 w-3" />
                    ยื่นต่ออายุ
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
