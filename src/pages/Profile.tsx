import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-lg font-bold text-foreground md:text-xl">โปรไฟล์สมาชิก</h2>
        <p className="text-sm text-muted-foreground">ข้อมูลส่วนตัวและการตั้งค่าบัญชี</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-5 card-shadow"
      >
        {/* Avatar area */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">นายสมชาย ใจดี</h3>
            <p className="text-xs text-muted-foreground">สมาชิกตั้งแต่ มกราคม 2569</p>
            <Badge variant="outline" className="mt-1 bg-success/10 text-[10px] text-success border-success/30">
              <Shield className="mr-1 h-3 w-3" />
              ยืนยันตัวตนแล้ว
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <User className="h-3 w-3" /> ชื่อ-นามสกุล
            </Label>
            <Input defaultValue="นายสมชาย ใจดี" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <Mail className="h-3 w-3" /> อีเมล
            </Label>
            <Input defaultValue="somchai@email.com" type="email" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <Phone className="h-3 w-3" /> เบอร์โทรศัพท์
            </Label>
            <Input defaultValue="081-234-5678" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3" /> จังหวัด
            </Label>
            <Input defaultValue="เชียงใหม่" />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button>บันทึกข้อมูล</Button>
        </div>
      </motion.div>
    </div>
  );
}
