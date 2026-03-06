import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sprout, Droplets, Scissors, ThermometerSun, FlaskConical, Bug } from "lucide-react";
import type { CultivationInfo, CultivationMethod, FertilizerType, IrrigationType, HarvestMethod, DryingMethod } from "@/types/application";

interface Props {
  value: Partial<CultivationInfo>;
  onChange: (v: Partial<CultivationInfo>) => void;
  errors?: Record<string, string>;
  isHighControl: boolean;
}

const cultivationMethods: { value: CultivationMethod; label: string }[] = [
  { value: "outdoor", label: "กลางแจ้ง (Outdoor)" },
  { value: "greenhouse", label: "โรงเรือน (Greenhouse)" },
  { value: "indoor", label: "ในร่ม (Indoor)" },
  { value: "hydroponic", label: "ไฮโดรโปนิกส์ (Hydroponic)" },
  { value: "mixed", label: "ผสมผสาน (Mixed)" },
];

const fertilizerTypes: { value: FertilizerType; label: string }[] = [
  { value: "organic", label: "อินทรีย์ (Organic)" },
  { value: "chemical", label: "เคมี (Chemical)" },
  { value: "mixed", label: "ผสมผสาน" },
  { value: "none", label: "ไม่ใช้ปุ๋ย" },
];

const irrigationTypes: { value: IrrigationType; label: string }[] = [
  { value: "drip", label: "น้ำหยด (Drip)" },
  { value: "sprinkler", label: "สปริงเกลอร์ (Sprinkler)" },
  { value: "flood", label: "ท่วมขัง (Flood)" },
  { value: "manual", label: "รดน้ำด้วยมือ (Manual)" },
  { value: "rain_fed", label: "อาศัยน้ำฝน (Rain-fed)" },
];

const harvestMethods: { value: HarvestMethod; label: string }[] = [
  { value: "manual", label: "เก็บด้วยมือ (Manual)" },
  { value: "mechanical", label: "เครื่องจักร (Mechanical)" },
  { value: "mixed", label: "ผสมผสาน" },
];

const dryingMethods: { value: DryingMethod; label: string }[] = [
  { value: "sun_dry", label: "ตากแดด (Sun Dry)" },
  { value: "shade_dry", label: "ตากในร่ม (Shade Dry)" },
  { value: "oven", label: "อบ (Oven)" },
  { value: "dehumidifier", label: "เครื่องลดความชื้น (Dehumidifier)" },
  { value: "freeze_dry", label: "แช่แข็งอบแห้ง (Freeze Dry)" },
];

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-[11px] text-destructive mt-0.5">{error}</p>;
}

export default function StepCultivation({ value, onChange, errors = {}, isHighControl }: Props) {
  const update = (key: keyof CultivationInfo, val: unknown) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold">แผนการเพาะปลูกและการจัดการผลผลิต</h3>
        <p className="text-xs text-muted-foreground mt-1">
          กรอกรายละเอียดเกี่ยวกับสายพันธุ์ การเพาะปลูก ปุ๋ย ชลประทาน การเก็บเกี่ยว และแปรรูป
        </p>
      </div>

      {/* ─── Seed / Variety ─── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-semibold">สายพันธุ์และแหล่งที่มา</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">สายพันธุ์ <span className="text-destructive">*</span></Label>
            <Input placeholder="เช่น พันธุ์หางกระรอก, พันธุ์ขาวมณี" value={value.seedVariety || ""} onChange={(e) => update("seedVariety", e.target.value)} />
            <FieldError error={errors.seedVariety} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">แหล่งที่มาเมล็ดพันธุ์/กิ่งพันธุ์ <span className="text-destructive">*</span></Label>
            <Input placeholder="เช่น ศูนย์วิจัย มก., ซื้อจากร้านค้า" value={value.seedSource || ""} onChange={(e) => update("seedSource", e.target.value)} />
            <FieldError error={errors.seedSource} />
          </div>
          {isHighControl && (
            <div className="space-y-1.5">
              <Label className="text-xs">หนังสือรับรองสายพันธุ์</Label>
              <Input placeholder="เลขที่หนังสือรับรอง" value={value.seedCertification || ""} onChange={(e) => update("seedCertification", e.target.value)} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">อายุต้นพันธุ์ (ณ วันยื่น)</Label>
            <Input placeholder="เช่น 3 เดือน, 1 ปี" value={value.plantAge || ""} onChange={(e) => update("plantAge", e.target.value)} />
          </div>
        </div>
      </section>

      {/* ─── Cultivation Method ─── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-success" />
          <h4 className="text-xs font-semibold">วิธีการเพาะปลูก</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">รูปแบบการปลูก <span className="text-destructive">*</span></Label>
            <Select value={value.cultivationMethod} onValueChange={(v) => update("cultivationMethod", v)}>
              <SelectTrigger><SelectValue placeholder="เลือกรูปแบบ" /></SelectTrigger>
              <SelectContent>
                {cultivationMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError error={errors.cultivationMethod} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">วันที่เริ่มปลูก <span className="text-destructive">*</span></Label>
            <Input type="date" value={value.cultivationStartDate || ""} onChange={(e) => update("cultivationStartDate", e.target.value)} />
            <FieldError error={errors.cultivationStartDate} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">รอบการเจริญเติบโต (วัน) <span className="text-destructive">*</span></Label>
            <Input type="number" placeholder="เช่น 120" value={value.growthCycleDays || ""} onChange={(e) => update("growthCycleDays", parseInt(e.target.value))} />
            <FieldError error={errors.growthCycleDays} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">ความหนาแน่นการปลูก</Label>
            <Input placeholder="เช่น 4 ต้น/ตร.ม." value={value.plantingDensity || ""} onChange={(e) => update("plantingDensity", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">จำนวนต้น (ต้น)</Label>
            <Input type="number" placeholder="จำนวนต้นที่ปลูก" value={value.numberOfPlants || ""} onChange={(e) => update("numberOfPlants", parseInt(e.target.value))} />
          </div>
        </div>
      </section>

      {/* ─── Fertilizer ─── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-warning" />
          <h4 className="text-xs font-semibold">ปุ๋ยและสารอาหาร</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">ประเภทปุ๋ย <span className="text-destructive">*</span></Label>
            <Select value={value.fertilizerType} onValueChange={(v) => update("fertilizerType", v)}>
              <SelectTrigger><SelectValue placeholder="เลือกประเภทปุ๋ย" /></SelectTrigger>
              <SelectContent>
                {fertilizerTypes.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError error={errors.fertilizerType} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">ความถี่ในการใส่ปุ๋ย <span className="text-destructive">*</span></Label>
            <Input placeholder="เช่น ทุก 2 สัปดาห์, เดือนละครั้ง" value={value.fertilizerFrequency || ""} onChange={(e) => update("fertilizerFrequency", e.target.value)} />
            <FieldError error={errors.fertilizerFrequency} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">รายละเอียดปุ๋ย/สารอาหาร <span className="text-destructive">*</span></Label>
          <Textarea placeholder="ระบุชื่อปุ๋ย สูตร อัตราส่วนที่ใช้ เช่น ปุ๋ยคอก 500 กก./ไร่, สูตร 15-15-15 อัตรา 50 กก./ไร่" rows={2} value={value.fertilizerDetails || ""} onChange={(e) => update("fertilizerDetails", e.target.value)} />
          <FieldError error={errors.fertilizerDetails} />
        </div>
        {value.fertilizerType === "organic" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">ได้รับรองอินทรีย์</p>
                <p className="text-[11px] text-muted-foreground">มีใบรับรอง Organic</p>
              </div>
              <Switch checked={!!value.organicCertified} onCheckedChange={(v) => update("organicCertified", v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">แหล่งทำปุ๋ยหมัก</Label>
              <Input placeholder="เช่น ทำเอง, ซื้อจากสหกรณ์" value={value.compostSource || ""} onChange={(e) => update("compostSource", e.target.value)} />
            </div>
          </div>
        )}
      </section>

      {/* ─── Irrigation ─── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-info" />
          <h4 className="text-xs font-semibold">ระบบชลประทาน/การให้น้ำ</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">ระบบการให้น้ำ <span className="text-destructive">*</span></Label>
            <Select value={value.irrigationType} onValueChange={(v) => update("irrigationType", v)}>
              <SelectTrigger><SelectValue placeholder="เลือกระบบการให้น้ำ" /></SelectTrigger>
              <SelectContent>
                {irrigationTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError error={errors.irrigationType} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">ความถี่ในการให้น้ำ <span className="text-destructive">*</span></Label>
            <Input placeholder="เช่น วันละ 2 ครั้ง, 3 วัน/ครั้ง" value={value.irrigationFrequency || ""} onChange={(e) => update("irrigationFrequency", e.target.value)} />
            <FieldError error={errors.irrigationFrequency} />
          </div>
        </div>
        {isHighControl && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">ตรวจคุณภาพน้ำ</p>
                <p className="text-[11px] text-muted-foreground">มีผลตรวจน้ำจากห้องแล็บ</p>
              </div>
              <Switch checked={!!value.waterQualityTest} onCheckedChange={(v) => update("waterQualityTest", v)} />
            </div>
            {value.waterQualityTest && (
              <div className="space-y-1.5">
                <Label className="text-xs">วันที่ตรวจ</Label>
                <Input type="date" value={value.waterTestDate || ""} onChange={(e) => update("waterTestDate", e.target.value)} />
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─── Harvesting ─── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Scissors className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-semibold">การเก็บเกี่ยว</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">วิธีเก็บเกี่ยว <span className="text-destructive">*</span></Label>
            <Select value={value.harvestMethod} onValueChange={(v) => update("harvestMethod", v)}>
              <SelectTrigger><SelectValue placeholder="เลือกวิธีเก็บเกี่ยว" /></SelectTrigger>
              <SelectContent>
                {harvestMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError error={errors.harvestMethod} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">วันที่คาดว่าเก็บเกี่ยว <span className="text-destructive">*</span></Label>
            <Input type="date" value={value.expectedHarvestDate || ""} onChange={(e) => update("expectedHarvestDate", e.target.value)} />
            <FieldError error={errors.expectedHarvestDate} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">ผลผลิตที่คาดการณ์ (กก.) <span className="text-destructive">*</span></Label>
            <Input type="number" placeholder="กก." value={value.estimatedYieldKg || ""} onChange={(e) => update("estimatedYieldKg", parseFloat(e.target.value))} />
            <FieldError error={errors.estimatedYieldKg} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">เกณฑ์การเก็บเกี่ยว <span className="text-destructive">*</span></Label>
          <Textarea placeholder="เช่น เก็บเมื่ออายุ 120 วัน, ดอกบาน 70%, ใบเริ่มเหลือง, ขนาดเหง้า ≥ 5 ซม." rows={2} value={value.harvestCriteria || ""} onChange={(e) => update("harvestCriteria", e.target.value)} />
          <FieldError error={errors.harvestCriteria} />
        </div>
      </section>

      {/* ─── Post-harvest ─── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ThermometerSun className="h-4 w-4 text-destructive" />
          <h4 className="text-xs font-semibold">การแปรรูปหลังเก็บเกี่ยว</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">วิธีการทำแห้ง <span className="text-destructive">*</span></Label>
            <Select value={value.dryingMethod} onValueChange={(v) => update("dryingMethod", v)}>
              <SelectTrigger><SelectValue placeholder="เลือกวิธีทำแห้ง" /></SelectTrigger>
              <SelectContent>
                {dryingMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError error={errors.dryingMethod} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">อุณหภูมิในการทำแห้ง</Label>
            <Input placeholder="เช่น 40-50°C" value={value.dryingTemperature || ""} onChange={(e) => update("dryingTemperature", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">ระยะเวลาทำแห้ง</Label>
            <Input placeholder="เช่น 3-5 วัน, 12 ชม." value={value.dryingDuration || ""} onChange={(e) => update("dryingDuration", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">วิธีตัดแต่ง (Trimming)</Label>
            <Input placeholder="เช่น ตัดแต่งมือ, เครื่องตัด" value={value.trimmingMethod || ""} onChange={(e) => update("trimmingMethod", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">วิธีบรรจุ</Label>
            <Input placeholder="เช่น ซีลสุญญากาศ, ถุง PE, กล่อง" value={value.packagingMethod || ""} onChange={(e) => update("packagingMethod", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">สภาพการจัดเก็บ</Label>
            <Input placeholder="เช่น ห้องเย็น, ที่แห้ง ไม่โดนแสง" value={value.storageCondition || ""} onChange={(e) => update("storageCondition", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">อุณหภูมิจัดเก็บ</Label>
            <Input placeholder="เช่น 15-25°C" value={value.storageTemperature || ""} onChange={(e) => update("storageTemperature", e.target.value)} />
          </div>
        </div>
      </section>

      {/* ─── Quality Control ─── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-warning" />
          <h4 className="text-xs font-semibold">การควบคุมคุณภาพและการใช้สารเคมี</h4>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">มาตรการควบคุมคุณภาพ <span className="text-destructive">*</span></Label>
          <Textarea placeholder="อธิบายวิธีตรวจสอบคุณภาพ เช่น ตรวจวัดความชื้น, สุ่มตัวอย่างส่งแล็บ, ตรวจสารตกค้าง" rows={2} value={value.qualityControlMeasures || ""} onChange={(e) => update("qualityControlMeasures", e.target.value)} />
          <FieldError error={errors.qualityControlMeasures} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">ความถี่ในการสุ่มตัวอย่าง</Label>
            <Input placeholder="เช่น ทุก Batch, เดือนละครั้ง" value={value.samplingFrequency || ""} onChange={(e) => update("samplingFrequency", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">แผนส่งตรวจห้องปฏิบัติการ</Label>
            <Input placeholder="เช่น ก่อนเก็บเกี่ยว, หลังอบแห้ง" value={value.labTestingPlan || ""} onChange={(e) => update("labTestingPlan", e.target.value)} />
          </div>
        </div>

        {/* Pesticide */}
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium">ใช้สารเคมีกำจัดศัตรูพืช</p>
            <p className="text-[11px] text-muted-foreground">ยาฆ่าแมลง ยากำจัดวัชพืช สารเคมีอื่นๆ</p>
          </div>
          <Switch checked={!!value.pesticideUsage} onCheckedChange={(v) => update("pesticideUsage", v)} />
        </div>
        {value.pesticideUsage && (
          <div className="space-y-1.5">
            <Label className="text-xs">รายละเอียดสารเคมีที่ใช้ <span className="text-destructive">*</span></Label>
            <Textarea placeholder="ระบุชื่อสารเคมี อัตราการใช้ ช่วงเวลาที่ใช้ ระยะเวลาหยุดก่อนเก็บเกี่ยว" rows={2} value={value.pesticideDetails || ""} onChange={(e) => update("pesticideDetails", e.target.value)} />
            <FieldError error={errors.pesticideDetails} />
          </div>
        )}

        {isHighControl && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">ตรวจโลหะหนัก</p>
                <p className="text-[11px] text-muted-foreground">Heavy Metal Testing</p>
              </div>
              <Switch checked={!!value.heavyMetalTest} onCheckedChange={(v) => update("heavyMetalTest", v)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">ตรวจจุลินทรีย์</p>
                <p className="text-[11px] text-muted-foreground">Microbial Testing</p>
              </div>
              <Switch checked={!!value.microbialTest} onCheckedChange={(v) => update("microbialTest", v)} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
