import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PLANT_TYPES, SOP_STEPS } from "@/constants/gacp";
import { ShieldAlert, Camera, Lock, ClipboardList, Fingerprint, ShieldCheck, MapPin, Package } from "lucide-react";
import type { ComplianceInfo } from "@/types/application";

interface Props {
  value: Partial<ComplianceInfo>;
  onChange: (v: Partial<ComplianceInfo>) => void;
  selectedPlant: string;
  errors?: Record<string, string>;
}

export default function StepCompliance({ value, onChange, selectedPlant, errors = {} }: Props) {
  const plant = PLANT_TYPES.find((p) => p.code === selectedPlant);
  const isHighControl = plant?.controlLevel === "HIGH_CONTROL";

  const toggleField = (key: keyof ComplianceInfo) =>
    onChange({ ...value, [key]: !value[key] });

  const sopCoverage = value.sopCoverage || {
    cultivation: false, harvesting: false, drying: false,
    trimming: false, packaging: false, storage: false, wasteDisposal: false,
  };

  const toggleSop = (key: string) => {
    onChange({
      ...value,
      sopCoverage: { ...sopCoverage, [key]: !sopCoverage[key as keyof typeof sopCoverage] },
    });
  };

  const sopCompleted = Object.values(sopCoverage).filter(Boolean).length;

  const securityItems = [
    { key: "hasCCTV" as const, icon: Camera, label: "กล้อง CCTV 24/7", required: isHighControl, desc: "ติดตั้งกล้องวงจรปิดครอบคลุมพื้นที่ (Medical Grade)" },
    { key: "hasFencing" as const, icon: ShieldAlert, label: "รั้ว ≥ 2 เมตร", required: isHighControl, desc: "รั้วรอบพื้นที่ปลูกสูงไม่ต่ำกว่า 2 เมตร (High Security)" },
    { key: "hasAccessLog" as const, icon: ClipboardList, label: "สมุดลงชื่อผู้เข้า-ออก (Access Log)", required: isHighControl, desc: "บันทึกการเข้า-ออกพื้นที่ทุกครั้ง" },
    { key: "hasBiometric" as const, icon: Fingerprint, label: "ระบบ Biometric / Key Card", required: selectedPlant === "CAN", desc: "ระบบสแกนนิ้วมือหรือบัตรผ่าน" },
    { key: "hasSecurityGuard" as const, icon: ShieldCheck, label: "เจ้าหน้าที่รักษาความปลอดภัย", required: false, desc: "มีเจ้าหน้าที่ดูแลรักษาความปลอดภัย" },
    { key: "hasZoning" as const, icon: MapPin, label: "การแบ่งโซนพื้นที่ (Zoning)", required: isHighControl, desc: "แบ่งพื้นที่เป็นสัดส่วนชัดเจน" },
    { key: "hasInventoryControl" as const, icon: Package, label: "ระบบควบคุมบัญชี (Inventory Control)", required: isHighControl, desc: "บัญชีรับ-จ่ายสินค้า (Stock Card)" },
    { key: "hasScreeningMeasure" as const, icon: Lock, label: "มาตรการคัดกรองผู้ซื้อ (Screening)", required: isHighControl, desc: "ตรวจบัตรประชาชนทุกครั้ง ไม่จำหน่ายผู้อายุ <20" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">มาตรการรักษาความปลอดภัยและ SOP</h3>
        {isHighControl && (
          <div className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-xs font-medium text-destructive">
              ⚠️ {plant?.nameTh} เป็นพืชควบคุมเข้มงวด ต้องมีมาตรการรักษาความปลอดภัยครบตามข้อกำหนด
            </p>
          </div>
        )}
        {errors["_compliance"] && (
          <div className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-xs font-medium text-destructive">⚠️ {errors["_compliance"]}</p>
          </div>
        )}
      </div>

      {/* Security Items */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-foreground">มาตรการรักษาความปลอดภัย</h4>
        {securityItems.map((item) => (
          <div
            key={item.key}
            className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
              value[item.key] ? "border-success/30 bg-success/5" : item.required && !value[item.key] ? "border-destructive/30" : "border-border"
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

      {/* CCTV & Fence Details */}
      {isHighControl && (
        <div className="grid gap-4 sm:grid-cols-2">
          {value.hasCCTV && (
            <div className="space-y-1.5">
              <Label className="text-xs">จำนวนกล้อง CCTV (ตัว)</Label>
              <Input
                type="number"
                placeholder="จำนวนกล้อง"
                value={value.cctvCount || ""}
                onChange={(e) => onChange({ ...value, cctvCount: parseInt(e.target.value) })}
              />
            </div>
          )}
          {value.hasFencing && (
            <div className="space-y-1.5">
              <Label className="text-xs">ความสูงรั้ว (เมตร)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="≥ 2.0"
                value={value.fenceHeight || ""}
                onChange={(e) => onChange({ ...value, fenceHeight: parseFloat(e.target.value) })}
                className={errors.fenceHeight ? "border-destructive" : ""}
              />
              {value.fenceHeight !== undefined && value.fenceHeight < 2 && (
                <p className="text-[11px] text-destructive">รั้วต้องสูง ≥ 2 เมตร</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* SOP Coverage Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-foreground">SOP ครอบคลุม 7 ขั้นตอนหลัก <span className="text-destructive">*</span></h4>
          <span className={`text-[10px] font-medium ${sopCompleted === 7 ? "text-success" : "text-warning"}`}>
            {sopCompleted}/7 ขั้นตอน
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SOP_STEPS.map((step) => (
            <label
              key={step.key}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 transition-colors ${
                sopCoverage[step.key as keyof typeof sopCoverage]
                  ? "border-success/30 bg-success/5"
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <Checkbox
                checked={sopCoverage[step.key as keyof typeof sopCoverage]}
                onCheckedChange={() => toggleSop(step.key)}
              />
              <span className="text-sm">{step.icon} {step.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Plans */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-foreground">แผนงานเพิ่มเติม</h4>
        <div className="space-y-1.5">
          <Label className="text-xs">แผนรักษาความปลอดภัย</Label>
          <Textarea
            placeholder="อธิบายมาตรการรักษาความปลอดภัย, การจัดพื้นที่, มาตรการคัดกรอง..."
            rows={3}
            value={value.securityPlan || ""}
            onChange={(e) => onChange({ ...value, securityPlan: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">แผนการจัดการศัตรูพืช (IPM)</Label>
          <Textarea
            placeholder="อธิบายแผนการจัดการศัตรูพืช..."
            rows={2}
            value={value.pestManagement || ""}
            onChange={(e) => onChange({ ...value, pestManagement: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">แผนการจัดการน้ำ</Label>
          <Textarea
            placeholder="อธิบายแหล่งน้ำและระบบชลประทาน..."
            rows={2}
            value={value.waterManagement || ""}
            onChange={(e) => onChange({ ...value, waterManagement: e.target.value })}
          />
        </div>
        {isHighControl && (
          <div className="space-y-1.5">
            <Label className="text-xs">แผนการผลิต (Production Plan)</Label>
            <Textarea
              placeholder="อธิบายแผนการผลิตโดยรวม..."
              rows={2}
              value={value.productionPlan || ""}
              onChange={(e) => onChange({ ...value, productionPlan: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
