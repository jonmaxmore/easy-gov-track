import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ApplicantInfo, ApplicantType } from "@/types/application";
import { Switch } from "@/components/ui/switch";

interface Props {
  value: Partial<ApplicantInfo>;
  onChange: (v: Partial<ApplicantInfo>) => void;
}

const applicantTypes: { value: ApplicantType; label: string; desc: string }[] = [
  { value: "individual", label: "รายบุคคล", desc: "เกษตรกรรายบุคคล" },
  { value: "enterprise", label: "วิสาหกิจชุมชน", desc: "กลุ่มวิสาหกิจชุมชน" },
  { value: "cooperative", label: "นิติบุคคล/สหกรณ์", desc: "บริษัท หรือ สหกรณ์การเกษตร" },
];

export default function StepApplicantInfo({ value, onChange }: Props) {
  const update = (key: keyof ApplicantInfo, val: string | boolean) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold">ข้อมูลผู้ยื่นคำขอ</h3>

      {/* Applicant Type */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">ประเภทผู้ยื่น</Label>
        <RadioGroup
          value={value.applicantType || "individual"}
          onValueChange={(v) => update("applicantType", v)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {applicantTypes.map((t) => (
            <label
              key={t.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                value.applicantType === t.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value={t.value} />
              <div>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-[11px] text-muted-foreground">{t.desc}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Personal Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">
            ชื่อ-นามสกุล <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="กรอกชื่อ-นามสกุล"
            value={value.fullName || ""}
            onChange={(e) => update("fullName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">
            เลขบัตรประชาชน <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="X-XXXX-XXXXX-XX-X"
            value={value.idCard || ""}
            onChange={(e) => update("idCard", e.target.value)}
            maxLength={17}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">
            เบอร์โทรศัพท์ <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="0XX-XXX-XXXX"
            value={value.phone || ""}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">อีเมล</Label>
          <Input
            placeholder="email@example.com"
            type="email"
            value={value.email || ""}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">ตำแหน่ง</Label>
          <Input
            placeholder="เช่น เจ้าของกิจการ, กรรมการผู้จัดการ"
            value={value.position || ""}
            onChange={(e) => update("position", e.target.value)}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <Label className="text-xs">
          ที่อยู่ (ตามบัตรประชาชน) <span className="text-destructive">*</span>
        </Label>
        <Textarea
          placeholder="ที่อยู่โดยละเอียด"
          rows={2}
          value={value.address || ""}
          onChange={(e) => update("address", e.target.value)}
        />
      </div>

      {/* Organization info for enterprise/cooperative */}
      {value.applicantType !== "individual" && (
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-primary">ข้อมูลองค์กร/นิติบุคคล</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">
                ชื่อองค์กร/วิสาหกิจ <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="ชื่อองค์กร"
                value={value.organizationName || ""}
                onChange={(e) => update("organizationName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">เลขทะเบียนนิติบุคคล</Label>
              <Input
                placeholder="เลขทะเบียน"
                value={value.organizationId || ""}
                onChange={(e) => update("organizationId", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">ผู้มีอำนาจลงนาม</Label>
              <Input
                placeholder="ชื่อผู้มีอำนาจลงนาม"
                value={value.authorizedPerson || ""}
                onChange={(e) => update("authorizedPerson", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Power of Attorney */}
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">มอบอำนาจ</p>
          <p className="text-[11px] text-muted-foreground">ยื่นคำขอแทนโดยผู้รับมอบอำนาจ</p>
        </div>
        <Switch
          checked={!!value.powerOfAttorney}
          onCheckedChange={(v) => update("powerOfAttorney", v)}
        />
      </div>
    </div>
  );
}
