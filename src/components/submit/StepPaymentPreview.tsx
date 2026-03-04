import { CreditCard, FileText, MapPin } from "lucide-react";
import { DOC_FEE, AUDIT_FEE } from "@/constants/gacp";

export default function StepPaymentPreview() {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold">ค่าธรรมเนียม</h3>
      <p className="text-xs text-muted-foreground">
        การยื่นขอรับรอง GACP มีค่าธรรมเนียม 2 ขั้นตอน ชำระหลังจากส่งคำขอ
      </p>

      <div className="space-y-3">
        {/* Doc fee */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">ค่าตรวจเอกสาร</p>
                <p className="text-lg font-bold text-primary">฿{DOC_FEE.toLocaleString()}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                ชำระหลังยื่นคำขอ เพื่อเริ่มกระบวนการตรวจสอบเอกสาร
              </p>
              <div className="mt-2 rounded bg-info/10 px-2 py-1">
                <p className="text-[10px] font-medium text-info">ขั้นตอนที่ 1 • ชำระทันทีหลังยื่นคำขอ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit fee */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
              <MapPin className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">ค่าประเมินหน้างาน</p>
                <p className="text-lg font-bold text-secondary">฿{AUDIT_FEE.toLocaleString()}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                ชำระหลังเอกสารผ่านการตรวจ เพื่อนัดหมายเจ้าหน้าที่ลงพื้นที่
              </p>
              <div className="mt-2 rounded bg-warning/10 px-2 py-1">
                <p className="text-[10px] font-medium text-warning">ขั้นตอนที่ 2 • ชำระเมื่อเอกสารผ่าน</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold">รวมค่าธรรมเนียมทั้งหมด</p>
          </div>
          <p className="text-xl font-bold text-primary">฿{(DOC_FEE + AUDIT_FEE).toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          💡 <strong>หมายเหตุ:</strong> ค่าธรรมเนียมจะชำระผ่านระบบออนไลน์อัตโนมัติ
          หลังชำระเงินสำเร็จ ระบบจะเปลี่ยนสถานะคำขอโดยอัตโนมัติ
          ไม่ต้องแจ้งเจ้าหน้าที่เพิ่มเติม
        </p>
      </div>
    </div>
  );
}
