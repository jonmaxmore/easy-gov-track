import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว", description: "กรุณาตรวจสอบอีเมลของคุณ" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Link to="/login" className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> กลับไปหน้าเข้าสู่ระบบ
        </Link>

        <h2 className="text-lg font-bold text-foreground mb-1">ลืมรหัสผ่าน</h2>
        <p className="text-xs text-muted-foreground mb-6">
          กรอกอีเมลเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">อีเมล</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="email@example.com" type="email" className="pl-9" />
            </div>
          </div>
          <Button type="submit" className="w-full">ส่งลิงก์รีเซ็ต</Button>
        </form>
      </motion.div>
    </div>
  );
}
