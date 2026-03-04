import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PLANT_TYPES } from "@/constants/gacp";
import { ShieldAlert, Camera, Lock, ClipboardList, Fingerprint, ShieldCheck } from "lucide-react";
import type { ComplianceInfo } from "@/types/application";

interface Props {
  value: Partial<ComplianceInfo>;
  onChange: (v: Partial<ComplianceInfo>) => void;
  selectedPlant: string;
}

export default function StepCompliance({ value, onChange, selectedPlant }: Props) {
  const plant = PLANT_TYPES.find((p) => p.code === selectedPlant);
  const isHighControl = plant?.controlLevel === "HIGH_CONTROL";

  const toggleField = (key: keyof ComplianceInfo) =>
    onChange({ ...value, [key]: !value[key] });

  const securityItems = [
    { key: "hasCCTV" as const, icon: Camera, label: "กล้อง CCTV 24/7", required: isHighControl, desc: "ติดตั้งกล้องวงจรปิดครอบคลุมพื้นที่" },
    { key: "hasFencing" as const, icon: ShieldAlert, label: "รั้ว ≥ 2 เมตร", required: isHighControl, desc: "รั้วรอบพื้นที่ปลูกสูงไม่ต่ำกว่า 2 เมตร" },
    { key: "hasAccessLog" as const, icon: ClipboardList, label: "สมุดลงชื่อผู้เข้า-ออก", required: isHighControl, desc: "บันทึกการเข้า-ออกพื้นที่ทุกครั้ง" },
    { key: "hasBiometric" as const, icon: Fingerprint, label: "ระบบ Biometric / Key Card", required: false, desc: "ระบบสแกนนิ้วมือหรือบัตร" },
    { key: "hasSecurityGuard" as const, icon: ShieldCheck, label: "เจ้าหน้าที่รักษาความปลอดภัย", required: false, desc: "มีเจ้าหน้าที่ดูแลรักษาความปลอดภัย" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">มาตรการรักษาความปลอดภัย</h3>
        {isHighControl && (
          <div className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-xs font-medium text-destructive">
              ⚠️ {plant?.nameTh} เป็นพืชควบคุมเข้มงวด ต้องมีมาตรการรักษาความปลอดภัยครบตามข้อกำหนด
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {securityItems.map((item) => (
          <div
            key={item.key}
            className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
              value[item.key] ? "border-success/30 bg-success/5" : "border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`h-5 w-5 ${value[item.key] ? "text-success" : "text-muted-foreground"}`} />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{item.label}</p>
                  {item.required && (
                    <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
                      บังคับ
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
            <Switch
              checked={!!value[item.key]}
              onCheckedChange={() => toggleField(item.key)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">แผนรักษาความปลอดภัย (อธิบายเพิ่มเติม)</Label>
        <Textarea
          placeholder="อธิบายมาตรการรักษาความปลอดภัยเพิ่มเติม..."
          rows={3}
          value={value.securityPlan || ""}
          onChange={(e) => onChange({ ...value, securityPlan: e.target.value })}
        />
      </div>
    </div>
  );
}
