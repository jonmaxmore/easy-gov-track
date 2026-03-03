import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Shield, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ProviderLayout from "@/components/ProviderLayout";

export default function ProviderProfilePage() {
  return (
    <ProviderLayout title="โปรไฟล์">
      <div className="max-w-2xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5 card-shadow"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full gov-gradient">
              <span className="text-xl font-bold text-primary-foreground">จ</span>
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">ดร.สุชาติ วิจัย</h3>
              <p className="text-xs text-muted-foreground">เจ้าหน้าที่ตรวจสอบ · กรมการแพทย์แผนไทยฯ</p>
              <div className="mt-1 flex gap-1.5">
                <Badge variant="outline" className="bg-primary/10 text-[9px] text-primary border-primary/30">
                  <Shield className="mr-0.5 h-2.5 w-2.5" /> Document Reviewer
                </Badge>
                <Badge variant="outline" className="bg-success/10 text-[9px] text-success border-success/30">
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs"><User className="h-3 w-3" />ชื่อ-นามสกุล</Label>
              <Input defaultValue="ดร.สุชาติ วิจัย" />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs"><Mail className="h-3 w-3" />อีเมล</Label>
              <Input defaultValue="suchat@gacp.go.th" type="email" />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs"><Phone className="h-3 w-3" />เบอร์โทร</Label>
              <Input defaultValue="02-123-4567" />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-xs"><MapPin className="h-3 w-3" />หน่วยงาน</Label>
              <Input defaultValue="กรมการแพทย์แผนไทยและการแพทย์ทางเลือก" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Key className="mr-1 h-3 w-3" /> เปลี่ยนรหัสผ่าน
            </Button>
            <Button size="sm" className="text-xs">บันทึกข้อมูล</Button>
          </div>
        </motion.div>
      </div>
    </ProviderLayout>
  );
}
