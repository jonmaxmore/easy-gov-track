import { Leaf, User, MapPin, FileText } from "lucide-react";
import { PLANT_TYPES } from "@/constants/gacp";
import type { ApplicantInfo, FarmInfo } from "@/types/application";

interface Props {
  applicant: Partial<ApplicantInfo>;
  farm: Partial<FarmInfo>;
  selectedPlant: string;
}

export default function StepConfirm({ applicant, farm, selectedPlant }: Props) {
  const plant = PLANT_TYPES.find((p) => p.code === selectedPlant);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-3 text-sm font-semibold">ยืนยันการยื่นคำขอ</h3>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนกดยื่นคำขอ
          หลังจากยื่นแล้ว ฟอร์มจะถูกล็อก จนกว่าเจ้าหน้าที่จะส่งกลับแก้ไข
        </p>
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <SummaryCard
          icon={User}
          title="ผู้ยื่นคำขอ"
          items={[
            { label: "ชื่อ", value: applicant.fullName || "-" },
            { label: "เลขบัตร", value: applicant.idCard || "-" },
            { label: "โทร", value: applicant.phone || "-" },
            { label: "ประเภท", value: applicant.applicantType === "individual" ? "รายบุคคล" : applicant.applicantType === "enterprise" ? "วิสาหกิจชุมชน" : "นิติบุคคล" },
          ]}
        />

        <SummaryCard
          icon={Leaf}
          title="ชนิดสมุนไพร"
          items={[
            { label: "พืช", value: plant ? `${plant.nameTh} (${plant.nameEn})` : "-" },
            { label: "ระดับควบคุม", value: plant?.controlLevel === "HIGH_CONTROL" ? "ควบคุมเข้มงวด" : "ทั่วไป" },
          ]}
        />

        <SummaryCard
          icon={MapPin}
          title="พื้นที่เพาะปลูก"
          items={[
            { label: "แปลง", value: farm.farmName || "-" },
            { label: "พื้นที่", value: farm.areaRai ? `${farm.areaRai} ไร่` : "-" },
            { label: "จังหวัด", value: farm.province || "-" },
          ]}
        />
      </div>

      <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
        <p className="text-xs text-warning font-medium">
          ⚠️ หลังจากยื่นคำขอ ท่านจะต้องชำระค่าตรวจเอกสาร ฿5,000 ภายใน 7 วัน
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType;
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-xs font-semibold">{title}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {items.map((item) => (
          <div key={item.label}>
            <span className="text-[10px] text-muted-foreground">{item.label}: </span>
            <span className="text-[11px] font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
