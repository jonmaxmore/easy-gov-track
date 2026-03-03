import { motion } from "framer-motion";
import { Award, Download, Eye, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const certificates = [
  {
    id: "CERT-2026-001",
    herb: "กัญชง (Hemp)",
    issuedDate: "15 มี.ค. 2569",
    expiryDate: "14 มี.ค. 2571",
    status: "active" as const,
    certNumber: "GACP-TH-2569-00123",
  },
  {
    id: "CERT-2025-045",
    herb: "ขมิ้นชัน",
    issuedDate: "10 ส.ค. 2568",
    expiryDate: "9 ส.ค. 2570",
    status: "active" as const,
    certNumber: "GACP-TH-2568-00045",
  },
  {
    id: "CERT-2024-012",
    herb: "ฟ้าทะลายโจร",
    issuedDate: "5 มี.ค. 2567",
    expiryDate: "4 มี.ค. 2569",
    status: "expired" as const,
    certNumber: "GACP-TH-2567-00012",
  },
];

const statusConfig = {
  active: { label: "ใช้งานได้", className: "bg-success/15 text-success border-success/30" },
  expired: { label: "หมดอายุ", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function CertificatesPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-lg font-bold text-foreground md:text-xl">ใบรับรอง GACP</h2>
        <p className="text-sm text-muted-foreground">ใบรับรองมาตรฐานทั้งหมดของคุณ</p>
      </div>

      <div className="space-y-3">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-4 card-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  cert.status === "active" ? "bg-success/10" : "bg-muted"
                }`}>
                  <Award className={`h-5 w-5 ${cert.status === "active" ? "text-success" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{cert.herb}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{cert.certNumber}</p>
                </div>
              </div>
              <Badge variant="outline" className={`text-[10px] ${statusConfig[cert.status].className}`}>
                {statusConfig[cert.status].label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>ออกเมื่อ: {cert.issuedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>หมดอายุ: {cert.expiryDate}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs flex-1">
                <Eye className="mr-1 h-3 w-3" />
                ดูใบรับรอง
              </Button>
              <Button variant="outline" size="sm" className="text-xs flex-1">
                <Download className="mr-1 h-3 w-3" />
                ดาวน์โหลด
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
