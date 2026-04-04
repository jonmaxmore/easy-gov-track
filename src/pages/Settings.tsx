import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Bell, Globe, Shield, Moon, Sun, Smartphone, Mail,
  Key, LogOut, ChevronRight, User, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [emailNoti, setEmailNoti] = useState(true);
  const [smsNoti, setSmsNoti] = useState(true);
  const [pushNoti, setPushNoti] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<"th" | "en">("th");

  const handleSave = () => {
    toast({ title: "บันทึกการตั้งค่าสำเร็จ" });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-lg font-bold text-foreground md:text-xl">ตั้งค่า</h2>
        <p className="text-sm text-muted-foreground">จัดการบัญชีและการตั้งค่าระบบ</p>
      </div>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
        <div className="gov-gradient p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-foreground">นายสมชาย ใจดี</p>
              <p className="text-xs text-primary-foreground/70">somchai@email.com • 081-234-5678</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-1">
          <SettingsRow icon={User} label="แก้ไขข้อมูลส่วนตัว" />
          <SettingsRow icon={Key} label="เปลี่ยนรหัสผ่าน" />
          <SettingsRow icon={Eye} label="ความเป็นส่วนตัว" />
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl border border-border bg-card p-4 card-shadow space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          การแจ้งเตือน
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs">แจ้งเตือนทางอีเมล</Label>
            </div>
            <Switch checked={emailNoti} onCheckedChange={setEmailNoti} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs">แจ้งเตือนทาง SMS</Label>
            </div>
            <Switch checked={smsNoti} onCheckedChange={setSmsNoti} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs">Push Notification</Label>
            </div>
            <Switch checked={pushNoti} onCheckedChange={setPushNoti} />
          </div>
        </div>
      </motion.div>

      {/* Display */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-4 card-shadow space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          การแสดงผล
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {darkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
              <Label className="text-xs">โหมดมืด</Label>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label className="text-xs">ภาษา</Label>
            </div>
            <div className="flex gap-1">
              {(["th", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    lang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {l === "th" ? "ไทย" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-4 card-shadow space-y-1">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-primary" />
          ความปลอดภัย
        </h3>
        <SettingsRow icon={Key} label="การยืนยันตัวตนสองขั้นตอน (2FA)" />
        <SettingsRow icon={Smartphone} label="อุปกรณ์ที่เข้าสู่ระบบ" />
        <SettingsRow icon={Shield} label="ประวัติการเข้าสู่ระบบ" />
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button onClick={handleSave} className="w-full">
          บันทึกการตั้งค่า
        </Button>
        <Button variant="outline" className="w-full text-destructive hover:text-destructive gap-2">
          <LogOut className="h-4 w-4" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );
}

function SettingsRow({ icon: Icon, label }: { icon: typeof Bell; label: string }) {
  return (
    <button className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
