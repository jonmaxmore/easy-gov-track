import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Building2, QrCode, Smartphone, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DOC_FEE, AUDIT_FEE } from "@/constants/gacp";

const paymentMethods = [
  { value: "promptpay", label: "PromptPay / QR Code", icon: QrCode, desc: "สแกน QR ผ่าน Mobile Banking" },
  { value: "transfer", label: "โอนผ่านธนาคาร", icon: Building2, desc: "โอนเงินเข้าบัญชีกรมฯ" },
  { value: "card", label: "บัตรเครดิต/เดบิต", icon: CreditCard, desc: "Visa, Mastercard, JCB" },
  { value: "mobile", label: "Mobile Banking", icon: Smartphone, desc: "KBank, SCB, BBL, KTB" },
];

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [method, setMethod] = useState("promptpay");
  const [processing, setProcessing] = useState(false);

  // Determine which fee (mock: use DOC_FEE for demo)
  const feeType = "DOC_FEE";
  const amount = feeType === "DOC_FEE" ? DOC_FEE : AUDIT_FEE;
  const feeLabel = feeType === "DOC_FEE" ? "ค่าตรวจเอกสาร" : "ค่าประเมินหน้างาน";

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "ชำระเงินสำเร็จ",
        description: `ชำระ ${feeLabel} ฿${amount.toLocaleString()} เรียบร้อย ระบบจะอัปเดตสถานะอัตโนมัติ`,
      });
      navigate(`/application/${id}`);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-20 md:pb-6">
      <Link to={`/application/${id}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        กลับ
      </Link>

      <div>
        <h2 className="text-lg font-bold text-foreground">ชำระค่าธรรมเนียม</h2>
        <p className="text-sm text-muted-foreground">คำขอ: {id}</p>
      </div>

      {/* Fee Summary */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 text-center">
        <p className="text-xs text-muted-foreground">{feeLabel}</p>
        <p className="mt-1 text-3xl font-bold text-primary">฿{amount.toLocaleString()}</p>
        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-success">
          <Shield className="h-3 w-3" />
          <span>การชำระเงินปลอดภัยผ่านระบบอัตโนมัติ</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">เลือกวิธีชำระเงิน</h3>
        <RadioGroup value={method} onValueChange={setMethod} className="space-y-2">
          {paymentMethods.map((m) => (
            <label
              key={m.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                method === m.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value={m.value} />
              <m.icon className={`h-5 w-5 ${method === m.value ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <p className="text-sm font-medium">{m.label}</p>
                <p className="text-[11px] text-muted-foreground">{m.desc}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* PromptPay QR (mock) */}
      {method === "promptpay" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6"
        >
          <p className="text-xs font-medium text-muted-foreground">สแกน QR Code เพื่อชำระเงิน</p>
          <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-muted/30">
            <div className="text-center">
              <QrCode className="mx-auto h-16 w-16 text-primary/30" />
              <p className="mt-2 text-[10px] text-muted-foreground">QR Code จะแสดงเมื่อเชื่อมต่อระบบจริง</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">หมดอายุใน 15 นาที</p>
        </motion.div>
      )}

      {/* Card Details (mock) */}
      {method === "card" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 rounded-xl border border-border bg-card p-4"
        >
          <div className="space-y-1.5">
            <Label className="text-xs">หมายเลขบัตร</Label>
            <Input placeholder="XXXX XXXX XXXX XXXX" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">วันหมดอายุ</Label>
              <Input placeholder="MM/YY" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">CVV</Label>
              <Input placeholder="XXX" type="password" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Pay Button */}
      <Button
        onClick={handlePay}
        disabled={processing}
        className="w-full gold-gradient border-0 py-6 text-base font-semibold"
        size="lg"
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
            />
            กำลังดำเนินการ...
          </span>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            ชำระเงิน ฿{amount.toLocaleString()}
          </>
        )}
      </Button>

      <p className="text-center text-[10px] text-muted-foreground">
        หลังชำระเงินสำเร็จ ระบบจะเปลี่ยนสถานะคำขอโดยอัตโนมัติผ่าน Webhook
        ไม่ต้องแจ้งเจ้าหน้าที่เพิ่มเติม
      </p>
    </div>
  );
}
