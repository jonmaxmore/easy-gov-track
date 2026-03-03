import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf, Eye, EyeOff, CreditCard, Mail, Phone, User, Check, ChevronRight, ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { label: "ข้อมูลส่วนตัว", icon: User },
  { label: "ช่องทางติดต่อ", icon: Mail },
  { label: "ตั้งรหัสผ่าน", icon: CreditCard },
  { label: "ยืนยัน", icon: Check },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "สมัครสมาชิกสำเร็จ!", description: "กรุณาเข้าสู่ระบบเพื่อเริ่มต้นใช้งาน" });
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[40%] gov-gradient relative overflow-hidden flex-col justify-center p-10">
        <div className="absolute -bottom-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-primary-foreground/5 blur-[80px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-sm font-bold text-primary-foreground tracking-wide">GACP THAILAND</h2>
          </div>

          <h1 className="text-2xl font-bold text-primary-foreground leading-tight mb-4">
            สมัครสมาชิกเพื่อเริ่มต้น<br />ยื่นขอรับรองมาตรฐาน
          </h1>
          <p className="text-sm text-primary-foreground/60 max-w-xs">
            ลงทะเบียนเพื่อเข้าถึงระบบยื่นคำขอ ติดตามสถานะ และจัดการใบรับรอง GACP
          </p>

          {/* Steps preview */}
          <div className="mt-10 space-y-3">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm ${
                  i <= step ? "text-primary-foreground" : "text-primary-foreground/40"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    i < step
                      ? "bg-secondary text-secondary-foreground"
                      : i === step
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary-foreground/10 text-primary-foreground/40"
                  }`}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className="font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden gov-gradient px-4 py-4">
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-primary-foreground/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary-foreground" />
              <span className="text-sm font-bold text-primary-foreground">สมัครสมาชิก</span>
            </div>
          </div>
        </div>

        {/* Mobile stepper */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-3 border-b border-border">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className={`flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  i < step
                    ? "bg-success/15 text-success"
                    : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-4 ${i < step ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-12">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm"
          >
            <div className="hidden lg:block mb-2">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-3 w-3" /> กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>

            <h2 className="text-lg font-bold text-foreground mb-1">
              {steps[step].label}
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              ขั้นตอนที่ {step + 1} จาก {steps.length}
            </p>

            {step === 0 && (
              <div className="space-y-4">
                <Field label="เลขบัตรประชาชน 13 หลัก" placeholder="x-xxxx-xxxxx-xx-x" icon={CreditCard} />
                <Field label="ชื่อ" placeholder="ชื่อจริง" icon={User} />
                <Field label="นามสกุล" placeholder="นามสกุล" icon={User} />
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <Field label="เบอร์โทรศัพท์" placeholder="0XX-XXX-XXXX" icon={Phone} />
                <Field label="อีเมล" placeholder="email@example.com" icon={Mail} type="email" />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">รหัสผ่าน</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="อย่างน้อย 8 ตัวอักษร" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">ยืนยันรหัสผ่าน</Label>
                  <Input type="password" placeholder="กรอกรหัสผ่านอีกครั้ง" />
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold">ตรวจสอบข้อมูลก่อนยืนยัน</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    กรุณาตรวจสอบว่าข้อมูลทั้งหมดถูกต้อง
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(v) => setAcceptTerms(v === true)}
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                    ข้าพเจ้ายอมรับ{" "}
                    <Link to="/terms" className="text-primary hover:underline">ข้อกำหนดการใช้งาน</Link>
                    {" "}และ{" "}
                    <Link to="/privacy" className="text-primary hover:underline">นโยบายความเป็นส่วนตัว</Link>
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  ย้อนกลับ
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} className="flex-1">
                  ถัดไป <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!acceptTerms || isLoading}
                  className="flex-1 gold-gradient border-0"
                >
                  {isLoading ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
                </Button>
              )}
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              มีบัญชีอยู่แล้ว?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                เข้าสู่ระบบ
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  icon: Icon,
  type = "text",
}: {
  label: string;
  placeholder: string;
  icon: React.ElementType;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={placeholder} type={type} className="pl-9" />
      </div>
    </div>
  );
}
