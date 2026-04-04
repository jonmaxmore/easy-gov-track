import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Eye,
  EyeOff,
  CreditCard,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type IdentifierType = "idcard" | "phone" | "email" | "unknown";

function detectType(value: string): IdentifierType {
  const clean = value.replace(/-/g, "").trim();
  if (/^\d{13}$/.test(clean)) return "idcard";
  if (/^0\d{9}$/.test(clean)) return "phone";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "email";
  return "unknown";
}

const identifierIcons: Record<IdentifierType, React.ElementType> = {
  idcard: CreditCard,
  phone: Phone,
  email: Mail,
  unknown: CreditCard,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<"th" | "en">("th");

  const idType = detectType(identifier);
  const IdIcon = identifierIcons[idType];

  const copy = lang === "th" ? {
    brand: "ระบบออกใบรับรองมาตรฐาน GACP",
    title: "เข้าสู่ระบบ",
    subtitle: "สำหรับประชาชน / เกษตรกร",
    idLabel: "เลขประจำตัวประชาชน / อีเมล / เบอร์โทร",
    idPlaceholder: "x-xxxx-xxxxx-xx-x",
    password: "รหัสผ่าน",
    forgot: "ลืมรหัสผ่าน?",
    signIn: "เข้าสู่ระบบ",
    
    noAccount: "ยังไม่มีบัญชี?",
    register: "สมัครสมาชิก",
    providerLogin: "สำหรับเจ้าหน้าที่",
    quick1: "ยื่นคำขอรับรอง GACP",
    quick2: "ติดตามการชำระเงินและสถานะ",
    quick3: "ดูผลการรับรองและ Trace",
    secure: "ข้อมูลปลอดภัย 🔒",
  } : {
    brand: "GACP Digital Certification Platform",
    title: "Sign In",
    subtitle: "Citizen / Farmer Portal",
    idLabel: "National ID / Email / Phone",
    idPlaceholder: "National ID / Email / Phone",
    password: "Password",
    forgot: "Forgot password?",
    signIn: "Sign In",
    thaiId: "Continue with Thai ID",
    noAccount: "Don't have an account?",
    register: "Register",
    providerLogin: "Staff Login",
    quick1: "Submit GACP certification",
    quick2: "Track payment and audit status",
    quick3: "View certificates and trace",
    secure: "Encrypted connection 🔒",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: lang === "th" ? "เข้าสู่ระบบสำเร็จ" : "Login successful" });
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex lg:w-[45%] gov-gradient relative overflow-hidden flex-col justify-between p-10">
        <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-primary-foreground/5 blur-[80px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-primary-foreground tracking-wide">GACP THAILAND</h2>
              <p className="text-[10px] text-primary-foreground/60">{copy.brand}</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-primary-foreground leading-tight mb-4">
            National Herbal<br />Certification Platform
          </h1>
          <p className="text-sm text-primary-foreground/70 max-w-xs">
            {lang === "th"
              ? "แพลตฟอร์มดิจิทัลสำหรับการรับรองมาตรฐาน GACP สมุนไพรควบคุมแห่งประเทศไทย"
              : "Digital platform for GACP standard certification for controlled herbs in Thailand"}
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {[copy.quick1, copy.quick2, copy.quick3].map((text, i) => (
            <div key={i} className="flex items-center gap-2 text-primary-foreground/80">
              <ChevronRight className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs">{text}</span>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-[10px] text-primary-foreground/40">
          Department of Thai Traditional and Alternative Medicine
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden gov-gradient px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-primary-foreground tracking-wide">GACP THAILAND</span>
            </div>
            <button
              onClick={() => setLang(lang === "th" ? "en" : "th")}
              className="flex items-center gap-1 rounded-full bg-primary-foreground/10 px-2.5 py-1 text-[10px] font-medium text-primary-foreground"
            >
              <Globe className="h-3 w-3" />
              {lang === "th" ? "EN" : "TH"}
            </button>
          </div>
          <p className="text-xs text-primary-foreground/70">{copy.brand}</p>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            {/* Language toggle - desktop */}
            <div className="hidden lg:flex justify-end mb-6">
              <button
                onClick={() => setLang(lang === "th" ? "en" : "th")}
                className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                <Globe className="h-3.5 w-3.5" />
                {lang === "th" ? "EN" : "TH"}
              </button>
            </div>

            <h2 className="text-xl font-bold text-foreground">{copy.title}</h2>
            <p className="mb-6 text-sm text-muted-foreground">{copy.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">{copy.idLabel}</Label>
                <div className="relative">
                  <IdIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={copy.idPlaceholder}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">{copy.password}</Label>
                  <Link to="/forgot-password" className="text-[10px] font-medium text-primary hover:underline">
                    {copy.forgot}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "..." : copy.signIn}
              </Button>

            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              {copy.noAccount}{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                {copy.register}
              </Link>
            </div>

            <div className="mt-3 text-center">
              <Link
                to="/provider/login"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-primary"
              >
                <ShieldCheck className="h-3 w-3" />
                {copy.providerLogin}
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/60">
              <ShieldCheck className="h-3 w-3" />
              {copy.secure}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
