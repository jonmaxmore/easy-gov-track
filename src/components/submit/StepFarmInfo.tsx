import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { THAI_PROVINCES } from "@/constants/gacp";
import type { FarmInfo } from "@/types/application";

interface Props {
  value: Partial<FarmInfo>;
  onChange: (v: Partial<FarmInfo>) => void;
}

export default function StepFarmInfo({ value, onChange }: Props) {
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
          />
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
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">
            จังหวัด <span className="text-destructive">*</span>
          </Label>
          <Select value={value.province} onValueChange={(v) => update("province", v)}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกจังหวัด" />
            </SelectTrigger>
            <SelectContent>
              {THAI_PROVINCES.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">อำเภอ</Label>
          <Input
            placeholder="อำเภอ"
            value={value.district || ""}
            onChange={(e) => update("district", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">ตำบล</Label>
          <Input
            placeholder="ตำบล"
            value={value.subDistrict || ""}
            onChange={(e) => update("subDistrict", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">พิกัด GPS (ละติจูด)</Label>
          <Input
            placeholder="เช่น 18.7883"
            type="number"
            step="any"
            value={value.gpsLat || ""}
            onChange={(e) => update("gpsLat", parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">ที่อยู่แปลงเพาะปลูก (โดยละเอียด)</Label>
        <Textarea
          placeholder="ที่อยู่โดยละเอียด"
          rows={3}
          value={value.address || ""}
          onChange={(e) => update("address", e.target.value)}
        />
      </div>
    </div>
  );
}
