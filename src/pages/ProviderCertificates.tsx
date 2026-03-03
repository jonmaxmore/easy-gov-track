import { motion } from "framer-motion";
import { Award, Download, Eye, Calendar, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import ProviderLayout from "@/components/ProviderLayout";

const certificates = [
  { id: "CERT-2026-001", appNumber: "APP-2026-006", holder: "นายประเสริฐ ทองแท้", herb: "กัญชง", certNumber: "GACP-TH-2569-00123", issuedDate: "15 มี.ค. 69", expiryDate: "14 มี.ค. 71", status: "active" as const },
  { id: "CERT-2026-002", appNumber: "APP-2026-007", holder: "สหกรณ์สมุนไพรเหนือ", herb: "ฟ้าทะลายโจร", certNumber: "GACP-TH-2569-00124", issuedDate: "20 ก.พ. 69", expiryDate: "19 ก.พ. 71", status: "active" as const },
  { id: "CERT-2025-045", appNumber: "APP-2025-045", holder: "นายสมชาย ใจดี", herb: "ขมิ้นชัน", certNumber: "GACP-TH-2568-00045", issuedDate: "10 ส.ค. 68", expiryDate: "9 ส.ค. 70", status: "active" as const },
  { id: "CERT-2024-012", appNumber: "APP-2024-012", holder: "นางสาวรัตนา ดอกไม้", herb: "ฟ้าทะลายโจร", certNumber: "GACP-TH-2567-00012", issuedDate: "5 มี.ค. 67", expiryDate: "4 มี.ค. 69", status: "expired" as const },
];

const statusConfig = {
  active: { label: "ใช้งานได้", className: "bg-success/15 text-success border-success/30" },
  expired: { label: "หมดอายุ", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function ProviderCertificatesPage() {
  const [query, setQuery] = useState("");
  const filtered = certificates.filter(
    (c) => !query || c.holder.includes(query) || c.certNumber.includes(query) || c.herb.includes(query)
  );

  return (
    <ProviderLayout title="ใบรับรอง">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="ค้นหาใบรับรอง..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8 h-9 text-xs" />
          </div>
          <p className="text-xs text-muted-foreground">{filtered.length} ใบ</p>
        </div>

        <div className="space-y-3">
          {filtered.map((cert, i) => {
            const status = statusConfig[cert.status];
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-card p-4 card-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cert.status === "active" ? "bg-success/10" : "bg-muted"}`}>
                      <Award className={`h-5 w-5 ${cert.status === "active" ? "text-success" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-card-foreground">{cert.holder}</p>
                      <p className="font-mono text-[10px] text-primary font-bold">{cert.certNumber}</p>
                      <p className="text-[10px] text-muted-foreground">{cert.herb} · {cert.appNumber}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${status.className}`}>{status.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mb-3">
                  <div className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />ออกเมื่อ: {cert.issuedDate}</div>
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />หมดอายุ: {cert.expiryDate}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-[10px] flex-1"><Eye className="mr-1 h-3 w-3" />ดูใบรับรอง</Button>
                  <Button variant="outline" size="sm" className="text-[10px] flex-1"><Download className="mr-1 h-3 w-3" />ดาวน์โหลด</Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ProviderLayout>
  );
}
