import { Leaf, User, MapPin, FileText, Shield, Upload, CheckCircle2, Sprout } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PLANT_TYPES, PRE_SUBMIT_CHECKLIST, getRelevantDocuments } from "@/constants/gacp";
import type { ApplicantInfo, FarmInfo, ComplianceInfo, CultivationInfo, UploadedDocument, ApplicationType } from "@/types/application";
import { useState } from "react";

interface Props {
  applicant: Partial<ApplicantInfo>;
  farm: Partial<FarmInfo>;
  cultivation: Partial<CultivationInfo>;
  compliance: Partial<ComplianceInfo>;
  documents: UploadedDocument[];
  selectedPlant: string;
  applicationType: ApplicationType;
}

const cultivationMethodLabels: Record<string, string> = {
  outdoor: "กลางแจ้ง", greenhouse: "โรงเรือน", indoor: "ในร่ม", hydroponic: "ไฮโดรโปนิกส์", mixed: "ผสมผสาน",
};
const fertilizerLabels: Record<string, string> = {
  organic: "อินทรีย์", chemical: "เคมี", mixed: "ผสมผสาน", none: "ไม่ใช้",
};
const irrigationLabels: Record<string, string> = {
  drip: "น้ำหยด", sprinkler: "สปริงเกลอร์", flood: "ท่วมขัง", manual: "รดน้ำด้วยมือ", rain_fed: "น้ำฝน",
};
const harvestLabels: Record<string, string> = {
  manual: "เก็บมือ", mechanical: "เครื่องจักร", mixed: "ผสมผสาน",
};
const dryingLabels: Record<string, string> = {
  sun_dry: "ตากแดด", shade_dry: "ตากในร่ม", oven: "อบ", dehumidifier: "ลดความชื้น", freeze_dry: "แช่แข็งอบแห้ง",
};

export default function StepConfirm({ applicant, farm, cultivation, compliance, documents, selectedPlant, applicationType }: Props) {
  const plant = PLANT_TYPES.find((p) => p.code === selectedPlant);
  const [checklist, setChecklist] = useState<boolean[]>(PRE_SUBMIT_CHECKLIST.map(() => false));

  const relevantDocs = getRelevantDocuments(selectedPlant, applicationType);
  const requiredDocs = relevantDocs.filter(d => d.required);
  const uploadedRequired = requiredDocs.filter(d => documents.some(u => u.docId === d.id)).length;
  const missingDocs = requiredDocs.filter(d => !documents.some(u => u.docId === d.id));

  const isHighControl = plant?.controlLevel === "HIGH_CONTROL";

  const toggleCheck = (i: number) => {
    const next = [...checklist];
    next[i] = !next[i];
    setChecklist(next);
  };

  // Safe nested access
  const seed = cultivation.seedling || {} as any;
  const harv = cultivation.harvest || {} as any;
  const post = cultivation.postHarvest || {} as any;
  const irr = cultivation.irrigation || {} as any;
  const qc = cultivation.qualityControl || {} as any;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-3 text-sm font-semibold">ยืนยันการยื่นคำขอ</h3>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนกดยื่นคำขอ
          หลังจากยื่นแล้ว ฟอร์มจะถูกล็อก จนกว่า Auditor จะส่งกลับแก้ไข
        </p>
      </div>

      <div className="space-y-3">
        <SummaryCard icon={User} title="ผู้ยื่นคำขอ" items={[
          { label: "ชื่อ", value: applicant.fullName || "-" },
          { label: "เลขบัตร", value: applicant.idCard || "-" },
          { label: "โทร", value: applicant.phone || "-" },
          { label: "ประเภท", value: applicant.applicantType === "individual" ? "รายบุคคล" : applicant.applicantType === "enterprise" ? "วิสาหกิจชุมชน" : "นิติบุคคล" },
          ...(applicant.organizationName ? [{ label: "องค์กร", value: applicant.organizationName }] : []),
        ]} />

        <SummaryCard icon={Leaf} title="ชนิดสมุนไพรและประเภทคำขอ" items={[
          { label: "พืช", value: plant ? `${plant.nameTh} (${plant.nameEn})` : "-" },
          { label: "ระดับควบคุม", value: isHighControl ? "ควบคุมเข้มงวด" : "ทั่วไป" },
          { label: "ประเภท", value: applicationType === "NEW" ? "ยื่นใหม่" : applicationType === "RENEW" ? "ต่ออายุ" : "ขอใบแทน" },
        ]} />

        <SummaryCard icon={MapPin} title="พื้นที่เพาะปลูก (1 ฟาร์ม = 1 ใบรับรอง)" items={[
          { label: "แปลง", value: farm.farmName || "-" },
          { label: "พื้นที่", value: farm.areaRai ? `${farm.areaRai} ไร่` : "-" },
          { label: "จังหวัด", value: farm.province || "-" },
          { label: "อำเภอ/ตำบล", value: `${farm.district || "-"} / ${farm.subDistrict || "-"}` },
          ...(farm.gpsLat && farm.gpsLng ? [{ label: "GPS", value: `${farm.gpsLat}, ${farm.gpsLng}` }] : []),
        ]} />

        <SummaryCard icon={Sprout} title="แผนการเพาะปลูก" items={[
          { label: "สายพันธุ์", value: seed.seedVariety || "-" },
          { label: "แหล่งพันธุ์", value: seed.seedSource || "-" },
          { label: "วิธีปลูก", value: cultivationMethodLabels[cultivation.cultivationMethod || ""] || "-" },
          { label: "เริ่มปลูก", value: cultivation.cultivationStartDate || "-" },
          { label: "รอบปลูก", value: cultivation.growthCycleDays ? `${cultivation.growthCycleDays} วัน` : "-" },
          { label: "ปุ๋ย", value: fertilizerLabels[cultivation.fertilizerType || ""] || "-" },
          { label: "ตารางปุ๋ย", value: `${(cultivation.fertilizerSchedule || []).length} ระยะ` },
          { label: "ระบบน้ำ", value: irrigationLabels[irr.irrigationType || ""] || "-" },
          { label: "เก็บเกี่ยว", value: harvestLabels[harv.harvestMethod || ""] || "-" },
          { label: "ผลผลิตคาด", value: harv.estimatedYieldKg ? `${harv.estimatedYieldKg} กก.` : "-" },
          { label: "ทำแห้ง", value: dryingLabels[post.dryingMethod || ""] || "-" },
          { label: "ตรวจสารตกค้าง", value: qc.pesticideResidueTest ? "✅" : "❌" },
        ]} />

        <SummaryCard icon={Shield} title="มาตรการความปลอดภัย" items={[
          { label: "CCTV", value: compliance?.hasCCTV ? `✅ (${compliance.cctvCount || "-"} ตัว)` : "❌" },
          { label: "รั้ว", value: compliance?.hasFencing ? `✅ (${compliance.fenceHeight || "-"} ม.)` : "❌" },
          { label: "Access Log", value: compliance?.hasAccessLog ? "✅" : "❌" },
          { label: "Biometric", value: compliance?.hasBiometric ? "✅" : "❌" },
          { label: "Zoning", value: compliance?.hasZoning ? "✅" : "❌" },
          { label: "SOP", value: `${Object.values(compliance?.sopCoverage || {}).filter(Boolean).length}/7 ขั้นตอน` },
        ]} />

        <SummaryCard icon={Upload} title="เอกสารแนบ" items={[
          { label: "อัปโหลดแล้ว", value: `${uploadedRequired}/${requiredDocs.length} รายการบังคับ` },
          { label: "รวมทั้งหมด", value: `${documents.length} ไฟล์` },
        ]} />
      </div>

      {missingDocs.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="text-xs font-medium text-destructive mb-2">
            ⚠️ เอกสารบังคับที่ยังไม่ได้อัปโหลด ({missingDocs.length} รายการ):
          </p>
          <ul className="space-y-1">
            {missingDocs.map(doc => (
              <li key={doc.id} className="text-[11px] text-destructive">• {doc.nameTh}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          Checklist ก่อนยื่น
        </h4>
        <div className="space-y-1.5">
          {PRE_SUBMIT_CHECKLIST.map((item, i) => {
            if (!isHighControl && item.includes("HIGH_CONTROL")) return null;
            return (
              <label key={i} className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 transition-colors ${
                checklist[i] ? "border-success/30 bg-success/5" : "border-border"
              }`}>
                <Checkbox checked={checklist[i]} onCheckedChange={() => toggleCheck(i)} />
                <span className="text-xs">{item.replace(" (กรณี HIGH_CONTROL)", isHighControl ? "" : "")}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
        <p className="text-xs text-warning font-medium">
          ⚠️ ใบรับรอง GACP ออกให้รายฟาร์ม (1 ฟาร์ม = 1 ใบรับรอง) อายุ 3 ปี
          หลังจากยื่นจะต้องชำระค่าตรวจเอกสาร ฿5,000 ภายใน 7 วัน
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, items }: { icon: React.ElementType; title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-xs font-semibold">{title}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`}>
            <span className="text-[10px] text-muted-foreground">{item.label}: </span>
            <span className="text-[11px] font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
