import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { THAI_PROVINCES } from "@/constants/gacp";
import type { FarmInfo, LandOwnershipType } from "@/types/application";

interface Props {
  value: Partial<FarmInfo>;
  onChange: (v: Partial<FarmInfo>) => void;
  errors?: Record<string, string>;
}

const landOwnershipTypes: { value: LandOwnershipType; label: string }[] = [
  { value: "owned", label: "เจ้าของกรรมสิทธิ์" },
  { value: "leased", label: "เช่า/ยืม" },
  { value: "government", label: "ที่ราชการ" },
  { value: "community", label: "ที่ชุมชน/สหกรณ์" },
];

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-[11px] text-destructive mt-0.5">{error}</p>;
}

export default function StepFarmInfo({ value, onChange, errors = {} }: Props) {
  const update = (key: keyof FarmInfo, val: string | number) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">ข้อมูลพื้นที่เพาะปลูก</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">
            ชื่อแปลง/สวน <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="ชื่อแปลงเพาะปลูก"
            value={value.farmName || ""}
            onChange={(e) => update("farmName", e.target.value)}
            className={errors.farmName ? "border-destructive" : ""}
          />
          <FieldError error={errors.farmName} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">
            พื้นที่ (ไร่) <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="0.00"
            type="number"
            value={value.areaRai || ""}
            onChange={(e) => update("areaRai", parseFloat(e.target.value))}
            className={errors.areaRai ? "border-destructive" : ""}
          />
          <FieldError error={errors.areaRai} />
        </div>
      </div>

      {/* Land Ownership */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">สิทธิ์ในที่ดิน <span className="text-destructive">*</span></Label>
        <RadioGroup
          value={value.landOwnership || "owned"}
          onValueChange={(v) => update("landOwnership", v)}
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {landOwnershipTypes.map((t) => (
            <label
              key={t.value}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs transition-colors ${
                value.landOwnership === t.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value={t.value} />
              <span>{t.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">เลขที่โฉนด/เอกสารสิทธิ์</Label>
          <Input
            placeholder="เลขที่เอกสารสิทธิ์"
            value={value.landDocNumber || ""}
            onChange={(e) => update("landDocNumber", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">ประเภทอาคาร/โรงเรือน</Label>
          <Input
            placeholder="เช่น โรงเรือนปิด, เรือนกระจก, เปิดโล่ง"
            value={value.buildingType || ""}
            onChange={(e) => update("buildingType", e.target.value)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label className="text-xs">
            จังหวัด <span className="text-destructive">*</span>
          </Label>
          <Select value={value.province} onValueChange={(v) => update("province", v)}>
            <SelectTrigger className={errors.province ? "border-destructive" : ""}>
              <SelectValue placeholder="เลือกจังหวัด" />
            </SelectTrigger>
            <SelectContent>
              {THAI_PROVINCES.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError error={errors.province} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">อำเภอ <span className="text-destructive">*</span></Label>
          <Input
            placeholder="อำเภอ"
            value={value.district || ""}
            onChange={(e) => update("district", e.target.value)}
            className={errors.district ? "border-destructive" : ""}
          />
          <FieldError error={errors.district} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">ตำบล <span className="text-destructive">*</span></Label>
          <Input
            placeholder="ตำบล"
            value={value.subDistrict || ""}
            onChange={(e) => update("subDistrict", e.target.value)}
            className={errors.subDistrict ? "border-destructive" : ""}
          />
          <FieldError error={errors.subDistrict} />
        </div>
      </div>

      {/* GPS */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">พิกัด GPS (จาก Google Maps)</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground">ละติจูด (Latitude)</Label>
            <Input
              placeholder="เช่น 18.7883"
              type="number"
              step="any"
              value={value.gpsLat || ""}
              onChange={(e) => update("gpsLat", parseFloat(e.target.value))}
              className={errors.gpsLat ? "border-destructive" : ""}
            />
            <FieldError error={errors.gpsLat} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground">ลองจิจูด (Longitude)</Label>
            <Input
              placeholder="เช่น 98.9853"
              type="number"
              step="any"
              value={value.gpsLng || ""}
              onChange={(e) => update("gpsLng", parseFloat(e.target.value))}
              className={errors.gpsLng ? "border-destructive" : ""}
            />
            <FieldError error={errors.gpsLng} />
          </div>
        </div>
      </div>

      {/* Environmental */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">แหล่งน้ำ</Label>
          <Input
            placeholder="เช่น บ่อบาดาล, ประปา, คลองชลประทาน"
            value={value.waterSource || ""}
            onChange={(e) => update("waterSource", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">ประเภทดิน</Label>
          <Input
            placeholder="เช่น ดินร่วน, ดินเหนียว, ดินทราย"
            value={value.soilType || ""}
            onChange={(e) => update("soilType", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">ที่อยู่แปลงเพาะปลูก (โดยละเอียด) <span className="text-destructive">*</span></Label>
        <Textarea
          placeholder="ที่อยู่โดยละเอียด"
          rows={3}
          value={value.address || ""}
          onChange={(e) => update("address", e.target.value)}
          className={errors.address ? "border-destructive" : ""}
        />
        <FieldError error={errors.address} />
      </div>
    </div>
  );
}
