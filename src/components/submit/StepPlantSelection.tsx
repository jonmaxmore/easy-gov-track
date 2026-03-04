import { PLANT_TYPES } from "@/constants/gacp";
import { Leaf, Shield, ShieldCheck } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function StepPlantSelection({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">เลือกชนิดสมุนไพรที่ต้องการขอรับรอง</h3>
      <p className="text-xs text-muted-foreground">
        ชนิดพืชจะกำหนดเอกสารและข้อกำหนดความปลอดภัยที่ต้องใช้
      </p>

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
    </div>
  );
}
