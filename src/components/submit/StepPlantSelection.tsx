import { PLANT_TYPES, APPLICATION_TYPES } from "@/constants/gacp";
import { Leaf, Shield, ShieldCheck, FileText, RefreshCw, Replace } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ApplicationType } from "@/types/application";

interface Props {
  value: string;
  onChange: (v: string) => void;
  applicationType: ApplicationType;
  onApplicationTypeChange: (v: ApplicationType) => void;
}

const appTypeIcons: Record<ApplicationType, React.ElementType> = {
  NEW: FileText,
  RENEW: RefreshCw,
  AMEND: Replace,
};

export default function StepPlantSelection({ value, onChange, applicationType, onApplicationTypeChange }: Props) {
  return (
    <div className="space-y-5">
      {/* Application Type */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">ประเภทการยื่นคำขอ</h3>
        <RadioGroup
          value={applicationType}
          onValueChange={(v) => onApplicationTypeChange(v as ApplicationType)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {APPLICATION_TYPES.map((t) => {
            const Icon = appTypeIcons[t.value];
            return (
              <label
                key={t.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  applicationType === t.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value={t.value} />
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Plant Selection */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">เลือกชนิดสมุนไพรที่ต้องการขอรับรอง</h3>
        <p className="text-xs text-muted-foreground">
          ชนิดพืชจะกำหนดเอกสารและข้อกำหนดความปลอดภัยที่ต้องใช้
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PLANT_TYPES.map((plant) => {
          const selected = value === plant.code;
          const isHigh = plant.controlLevel === "HIGH_CONTROL";
          return (
            <button
              key={plant.code}
              onClick={() => onChange(plant.code)}
              className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  isHigh ? "bg-destructive/10" : "bg-success/10"
                }`}
              >
                <Leaf className={`h-5 w-5 ${isHigh ? "text-destructive" : "text-success"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{plant.nameTh}</p>
                  {isHigh ? (
                    <Shield className="h-3.5 w-3.5 text-destructive" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{plant.nameEn}</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    isHigh
                      ? "bg-destructive/10 text-destructive"
                      : "bg-success/10 text-success"
                  }`}
                >
                  {isHigh ? "ควบคุมเข้มงวด" : "ทั่วไป"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info note for application type */}
      {applicationType === "RENEW" && (
        <div className="rounded-lg border border-info/30 bg-info/5 p-3">
          <p className="text-xs text-info">
            📋 การต่ออายุต้องแนบใบรับรองเก่า, รายงานผลการดำเนินงาน และผลตรวจปัจจุบัน
          </p>
        </div>
      )}
      {applicationType === "AMEND" && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
          <p className="text-xs text-warning">
            📋 ขอใบแทนต้องแนบใบแจ้งความ (สูญหาย) หรือภาพถ่ายใบรับรอง (ชำรุด) + สำเนาบัตรประชาชน
          </p>
        </div>
      )}
    </div>
  );
}
