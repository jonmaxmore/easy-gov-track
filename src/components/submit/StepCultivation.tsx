import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Droplets, Scissors, ThermometerSun, FlaskConical, Bug, Leaf, BarChart3, RefreshCw, Package, Microscope, Plus, Trash2 } from "lucide-react";
import type {
  CultivationInfo, CultivationMethod, FertilizerType, IrrigationType, HarvestMethod, DryingMethod,
  PropagationMethod, SoilPreparationMethod, PestControlMethod, WeedControlMethod, CleaningMethod,
  FertilizerSchedule,
} from "@/types/application";

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

const propagationMethods: { value: PropagationMethod; label: string }[] = [
  { value: "seed", label: "เมล็ด" },
  { value: "cutting", label: "ปักชำ/กิ่งพันธุ์" },
  { value: "tissue_culture", label: "เพาะเลี้ยงเนื้อเยื่อ" },
  { value: "rhizome", label: "เหง้า/หัว" },
  { value: "division", label: "แยกกอ" },
  { value: "layering", label: "ตอนกิ่ง" },
];

const soilPrepMethods: { value: SoilPreparationMethod; label: string }[] = [
  { value: "plowing", label: "ไถพรวน" },
  { value: "raised_bed", label: "แปลงยกร่อง" },
  { value: "no_till", label: "ไม่ไถพรวน (No-till)" },
  { value: "composting", label: "หมักปุ๋ย" },
  { value: "mulching", label: "คลุมดิน (Mulching)" },
];

const pestControlMethods: { value: PestControlMethod; label: string }[] = [
  { value: "ipm", label: "IPM (จัดการศัตรูพืชแบบผสมผสาน)" },
  { value: "biological", label: "ชีวภาพ (ตัวห้ำ/ตัวเบียน)" },
  { value: "chemical", label: "สารเคมี" },
  { value: "organic", label: "สารชีวภัณฑ์/อินทรีย์" },
  { value: "physical", label: "กายภาพ (กับดัก/ไล่)" },
  { value: "none", label: "ไม่มี" },
];

const weedControlMethods: { value: WeedControlMethod; label: string }[] = [
  { value: "manual_weeding", label: "ถอนมือ" },
  { value: "mulching", label: "คลุมดิน" },
  { value: "cover_crop", label: "พืชคลุมดิน" },
  { value: "herbicide", label: "สารกำจัดวัชพืช" },
  { value: "mechanical", label: "เครื่องจักร" },
  { value: "none", label: "ไม่มี" },
];

const cleaningMethods: { value: CleaningMethod; label: string }[] = [
  { value: "water_wash", label: "ล้างน้ำ" },
  { value: "brush_clean", label: "แปรง/ปัด" },
  { value: "air_blow", label: "เป่าลม" },
  { value: "no_wash", label: "ไม่ล้าง" },
];

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-[11px] text-destructive mt-0.5">{error}</p>;
}

function SectionTitle({ icon: Icon, title, color = "text-primary" }: { icon: React.ElementType; title: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`h-4 w-4 ${color}`} />
      <h4 className="text-xs font-semibold">{title}</h4>
    </div>
  );
}

const defaultFertilizerSchedule: FertilizerSchedule = {
  stage: "", fertilizerName: "", formula: "", ratePerRai: "", applicationMethod: "", frequency: "",
};

export default function StepCultivation({ value, onChange, errors = {}, isHighControl }: Props) {
  const [activeTab, setActiveTab] = useState("soil");

  // Nested updaters
  const updateRoot = (key: keyof CultivationInfo, val: unknown) => onChange({ ...value, [key]: val });
  const updateNested = (section: keyof CultivationInfo, key: string, val: unknown) => {
    const current = (value[section] as unknown as Record<string, unknown>) || {};
    onChange({ ...value, [section]: { ...current, [key]: val } });
  };

  const soil = value.soilPreparation || {} as any;
  const seed = value.seedling || {} as any;
  const pest = value.pestManagement || {} as any;
  const irr = value.irrigation || {} as any;
  const env = value.environmentalMonitoring || {} as any;
  const harv = value.harvest || {} as any;
  const post = value.postHarvest || {} as any;
  const qc = value.qualityControl || {} as any;
  const crop = value.cropRotation || {} as any;
  const fertSchedule: FertilizerSchedule[] = value.fertilizerSchedule || [];

  const addFertSchedule = () => {
    onChange({ ...value, fertilizerSchedule: [...fertSchedule, { ...defaultFertilizerSchedule }] });
  };
  const removeFertSchedule = (i: number) => {
    onChange({ ...value, fertilizerSchedule: fertSchedule.filter((_, idx) => idx !== i) });
  };
  const updateFertSchedule = (i: number, key: keyof FertilizerSchedule, val: string) => {
    const next = [...fertSchedule];
    next[i] = { ...next[i], [key]: val };
    onChange({ ...value, fertilizerSchedule: next });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">แผนการเพาะปลูกและการจัดการผลผลิต (GACP Deep-dive)</h3>
        <p className="text-xs text-muted-foreground mt-1">
          กรอกรายละเอียดครบทุกด้าน: การเตรียมดิน, พันธุ์, ปุ๋ย, ศัตรูพืช, น้ำ, สิ่งแวดล้อม, เก็บเกี่ยว, แปรรูป, QC
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 h-auto gap-0.5">
          <TabsTrigger value="soil" className="text-[10px] px-1 py-1.5">🌱 เตรียมดิน/พันธุ์</TabsTrigger>
          <TabsTrigger value="grow" className="text-[10px] px-1 py-1.5">🌿 ปลูก/ปุ๋ย</TabsTrigger>
          <TabsTrigger value="protect" className="text-[10px] px-1 py-1.5">🛡️ ศัตรูพืช/น้ำ</TabsTrigger>
          <TabsTrigger value="harvest" className="text-[10px] px-1 py-1.5">✂️ เก็บเกี่ยว</TabsTrigger>
          <TabsTrigger value="quality" className="text-[10px] px-1 py-1.5">🔬 QC/หมุนเวียน</TabsTrigger>
        </TabsList>

        {/* ═══ TAB 1: Soil Preparation & Seedling ═══ */}
        <TabsContent value="soil" className="space-y-6 mt-4">
          <section className="space-y-3">
            <SectionTitle icon={Leaf} title="การเตรียมดิน" color="text-amber-600" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีเตรียมดิน <span className="text-destructive">*</span></Label>
                <Select value={soil.method} onValueChange={(v) => updateNested("soilPreparation", "method", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือกวิธีเตรียมดิน" /></SelectTrigger>
                  <SelectContent>
                    {soilPrepMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors["soilPreparation.method"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วันที่เตรียมดิน <span className="text-destructive">*</span></Label>
                <Input type="date" value={soil.preparationDate || ""} onChange={(e) => updateNested("soilPreparation", "preparationDate", e.target.value)} />
                <FieldError error={errors["soilPreparation.preparationDate"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วันที่ตรวจดิน</Label>
                <Input type="date" value={soil.soilTestDate || ""} onChange={(e) => updateNested("soilPreparation", "soilTestDate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ค่า pH ดิน</Label>
                <Input type="number" step="0.1" placeholder="เช่น 6.5" value={soil.soilPH || ""} onChange={(e) => updateNested("soilPreparation", "soilPH", parseFloat(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">อินทรียวัตถุ (%)</Label>
                <Input placeholder="เช่น 2.5%" value={soil.organicMatter || ""} onChange={(e) => updateNested("soilPreparation", "organicMatter", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ความลึกในการไถ</Label>
                <Input placeholder="เช่น 30 ซม." value={soil.tillageDepth || ""} onChange={(e) => updateNested("soilPreparation", "tillageDepth", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">สารปรับปรุงดิน <span className="text-destructive">*</span></Label>
              <Textarea placeholder="เช่น ปูนโดโลไมต์ 200 กก./ไร่, ปุ๋ยคอก 500 กก./ไร่" rows={2} value={soil.soilAmendments || ""} onChange={(e) => updateNested("soilPreparation", "soilAmendments", e.target.value)} />
              <FieldError error={errors["soilPreparation.soilAmendments"]} />
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle icon={Sprout} title="เมล็ดพันธุ์ / กิ่งพันธุ์ / การเพาะกล้า" color="text-success" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีขยายพันธุ์ <span className="text-destructive">*</span></Label>
                <Select value={seed.propagationMethod} onValueChange={(v) => updateNested("seedling", "propagationMethod", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือกวิธี" /></SelectTrigger>
                  <SelectContent>
                    {propagationMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors["seedling.propagationMethod"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">สายพันธุ์ <span className="text-destructive">*</span></Label>
                <Input placeholder="เช่น พันธุ์หางกระรอก" value={seed.seedVariety || ""} onChange={(e) => updateNested("seedling", "seedVariety", e.target.value)} />
                <FieldError error={errors["seedling.seedVariety"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">แหล่งที่มา <span className="text-destructive">*</span></Label>
                <Input placeholder="เช่น ศูนย์วิจัย มก." value={seed.seedSource || ""} onChange={(e) => updateNested("seedling", "seedSource", e.target.value)} />
                <FieldError error={errors["seedling.seedSource"]} />
              </div>
              {isHighControl && (
                <div className="space-y-1.5">
                  <Label className="text-xs">เลขที่หนังสือรับรองสายพันธุ์</Label>
                  <Input value={seed.seedCertification || ""} onChange={(e) => updateNested("seedling", "seedCertification", e.target.value)} />
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">เลข Lot เมล็ดพันธุ์</Label>
                <Input placeholder="เลข Lot" value={seed.seedLotNumber || ""} onChange={(e) => updateNested("seedling", "seedLotNumber", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">อัตราการงอก (%)</Label>
                <Input type="number" placeholder="เช่น 85" value={seed.germinationRate || ""} onChange={(e) => updateNested("seedling", "germinationRate", parseFloat(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ระยะเวลาเพาะกล้า</Label>
                <Input placeholder="เช่น 30 วัน" value={seed.nurseryDuration || ""} onChange={(e) => updateNested("seedling", "nurseryDuration", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีเพาะกล้า</Label>
                <Input placeholder="เช่น ถาดเพาะ 104 หลุม" value={seed.nurseryMethod || ""} onChange={(e) => updateNested("seedling", "nurseryMethod", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">การเตรียมเมล็ด</Label>
                <Input placeholder="เช่น แช่น้ำ 24 ชม." value={seed.seedTreatment || ""} onChange={(e) => updateNested("seedling", "seedTreatment", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">อายุต้นพันธุ์ ณ วันยื่น</Label>
                <Input placeholder="เช่น 3 เดือน" value={seed.plantAge || ""} onChange={(e) => updateNested("seedling", "plantAge", e.target.value)} />
              </div>
            </div>
          </section>
        </TabsContent>

        {/* ═══ TAB 2: Cultivation & Fertilizer ═══ */}
        <TabsContent value="grow" className="space-y-6 mt-4">
          <section className="space-y-3">
            <SectionTitle icon={Sprout} title="วิธีการเพาะปลูก" color="text-success" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">รูปแบบการปลูก <span className="text-destructive">*</span></Label>
                <Select value={value.cultivationMethod} onValueChange={(v) => updateRoot("cultivationMethod", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    {cultivationMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors.cultivationMethod} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วันที่เริ่มปลูก <span className="text-destructive">*</span></Label>
                <Input type="date" value={value.cultivationStartDate || ""} onChange={(e) => updateRoot("cultivationStartDate", e.target.value)} />
                <FieldError error={errors.cultivationStartDate} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">รอบการเจริญเติบโต (วัน) <span className="text-destructive">*</span></Label>
                <Input type="number" placeholder="เช่น 120" value={value.growthCycleDays || ""} onChange={(e) => updateRoot("growthCycleDays", parseInt(e.target.value))} />
                <FieldError error={errors.growthCycleDays} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ระยะปลูก</Label>
                <Input placeholder="เช่น 50x50 ซม." value={value.plantingSpacing || ""} onChange={(e) => updateRoot("plantingSpacing", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ความหนาแน่น</Label>
                <Input placeholder="เช่น 4 ต้น/ตร.ม." value={value.plantingDensity || ""} onChange={(e) => updateRoot("plantingDensity", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">จำนวนต้น</Label>
                <Input type="number" value={value.numberOfPlants || ""} onChange={(e) => updateRoot("numberOfPlants", parseInt(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ทิศทางแถว</Label>
                <Input placeholder="เช่น เหนือ-ใต้" value={value.rowDirection || ""} onChange={(e) => updateRoot("rowDirection", e.target.value)} />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle icon={FlaskConical} title="ปุ๋ยและสารอาหาร" color="text-warning" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">ประเภทปุ๋ย <span className="text-destructive">*</span></Label>
                <Select value={value.fertilizerType} onValueChange={(v) => updateRoot("fertilizerType", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    {fertilizerTypes.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors.fertilizerType} />
              </div>
              {value.fertilizerType === "organic" && (
                <>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-xs font-medium">ได้รับรองอินทรีย์</p>
                    </div>
                    <Switch checked={!!value.organicCertified} onCheckedChange={(v) => updateRoot("organicCertified", v)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">แหล่งปุ๋ยหมัก</Label>
                    <Input placeholder="เช่น ทำเอง, สหกรณ์" value={value.compostSource || ""} onChange={(e) => updateRoot("compostSource", e.target.value)} />
                  </div>
                </>
              )}
            </div>

            {/* Fertilizer Schedule by Growth Stage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">ตารางใส่ปุ๋ยตามระยะการเติบโต <span className="text-destructive">*</span></Label>
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={addFertSchedule}>
                  <Plus className="h-3 w-3 mr-1" /> เพิ่มระยะ
                </Button>
              </div>
              <FieldError error={errors["fertilizerSchedule"]} />
              {fertSchedule.length === 0 && (
                <p className="text-[11px] text-muted-foreground bg-muted/50 p-3 rounded-lg text-center">
                  ยังไม่มีตารางปุ๋ย กดปุ่ม "เพิ่มระยะ" เพื่อเพิ่ม เช่น ระยะกล้า, ระยะเจริญเติบโต, ระยะออกดอก
                </p>
              )}
              {fertSchedule.map((sched, i) => (
                <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground">ระยะที่ {i + 1}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeFertSchedule(i)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Input placeholder="ระยะ เช่น กล้า" value={sched.stage} onChange={(e) => updateFertSchedule(i, "stage", e.target.value)} className="text-xs" />
                    <Input placeholder="ชื่อปุ๋ย" value={sched.fertilizerName} onChange={(e) => updateFertSchedule(i, "fertilizerName", e.target.value)} className="text-xs" />
                    <Input placeholder="สูตร เช่น 15-15-15" value={sched.formula || ""} onChange={(e) => updateFertSchedule(i, "formula", e.target.value)} className="text-xs" />
                    <Input placeholder="อัตรา/ไร่" value={sched.ratePerRai} onChange={(e) => updateFertSchedule(i, "ratePerRai", e.target.value)} className="text-xs" />
                    <Input placeholder="วิธีใส่ เช่น หว่าน" value={sched.applicationMethod} onChange={(e) => updateFertSchedule(i, "applicationMethod", e.target.value)} className="text-xs" />
                    <Input placeholder="ความถี่ เช่น ทุก 2 สัปดาห์" value={sched.frequency} onChange={(e) => updateFertSchedule(i, "frequency", e.target.value)} className="text-xs" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* ═══ TAB 3: Pest Management & Irrigation ═══ */}
        <TabsContent value="protect" className="space-y-6 mt-4">
          <section className="space-y-3">
            <SectionTitle icon={Bug} title="การจัดการศัตรูพืชและโรค (IPM)" color="text-destructive" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีควบคุมศัตรูพืช <span className="text-destructive">*</span></Label>
                <Select value={pest.controlMethod} onValueChange={(v) => updateNested("pestManagement", "controlMethod", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    {pestControlMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors["pestManagement.controlMethod"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีจัดการวัชพืช <span className="text-destructive">*</span></Label>
                <Select value={pest.weedControl} onValueChange={(v) => updateNested("pestManagement", "weedControl", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    {weedControlMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors["pestManagement.weedControl"]} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">ศัตรูพืชที่พบบ่อย <span className="text-destructive">*</span></Label>
              <Textarea placeholder="เช่น เพลี้ยอ่อน, หนอนกระทู้, แมลงหวี่ขาว" rows={2} value={pest.commonPests || ""} onChange={(e) => updateNested("pestManagement", "commonPests", e.target.value)} />
              <FieldError error={errors["pestManagement.commonPests"]} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">โรคพืชที่พบบ่อย <span className="text-destructive">*</span></Label>
              <Textarea placeholder="เช่น โรคราน้ำค้าง, โรคใบจุด, โรครากเน่า" rows={2} value={pest.commonDiseases || ""} onChange={(e) => updateNested("pestManagement", "commonDiseases", e.target.value)} />
              <FieldError error={errors["pestManagement.commonDiseases"]} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">มาตรการป้องกัน <span className="text-destructive">*</span></Label>
              <Textarea placeholder="เช่น ใช้กับดักกาวเหลือง, สลับแปลง, ตัดแต่งกิ่ง" rows={2} value={pest.preventionMeasures || ""} onChange={(e) => updateNested("pestManagement", "preventionMeasures", e.target.value)} />
              <FieldError error={errors["pestManagement.preventionMeasures"]} />
            </div>
            {(pest.controlMethod === "biological" || pest.controlMethod === "ipm") && (
              <div className="space-y-1.5">
                <Label className="text-xs">ตัวห้ำ/ตัวเบียนที่ใช้</Label>
                <Input placeholder="เช่น แมลงช้างปีกใส, ตัวเบียน Trichogramma" value={pest.biologicalAgents || ""} onChange={(e) => updateNested("pestManagement", "biologicalAgents", e.target.value)} />
              </div>
            )}
            {(pest.controlMethod === "chemical" || pest.controlMethod === "ipm") && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">สารเคมีที่ใช้ <span className="text-destructive">*</span></Label>
                  <Input placeholder="ชื่อสารเคมี อัตราการใช้" value={pest.chemicalUsed || ""} onChange={(e) => updateNested("pestManagement", "chemicalUsed", e.target.value)} />
                  <FieldError error={errors["pestManagement.chemicalUsed"]} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">ระยะหยุดก่อนเก็บเกี่ยว (วัน)</Label>
                  <Input type="number" placeholder="เช่น 14" value={pest.withdrawalPeriodDays || ""} onChange={(e) => updateNested("pestManagement", "withdrawalPeriodDays", parseInt(e.target.value))} />
                </div>
              </div>
            )}
            {pest.controlMethod === "ipm" && (
              <div className="space-y-1.5">
                <Label className="text-xs">กลยุทธ์ IPM</Label>
                <Textarea placeholder="อธิบายกลยุทธ์ IPM โดยละเอียด" rows={2} value={pest.ipmStrategy || ""} onChange={(e) => updateNested("pestManagement", "ipmStrategy", e.target.value)} />
              </div>
            )}
          </section>

          <section className="space-y-3">
            <SectionTitle icon={Droplets} title="ระบบชลประทานและการให้น้ำ" color="text-info" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">ระบบการให้น้ำ <span className="text-destructive">*</span></Label>
                <Select value={irr.irrigationType} onValueChange={(v) => updateNested("irrigation", "irrigationType", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    {irrigationTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors["irrigation.irrigationType"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ความถี่ <span className="text-destructive">*</span></Label>
                <Input placeholder="เช่น วันละ 2 ครั้ง" value={irr.irrigationFrequency || ""} onChange={(e) => updateNested("irrigation", "irrigationFrequency", e.target.value)} />
                <FieldError error={errors["irrigation.irrigationFrequency"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">แหล่งน้ำ <span className="text-destructive">*</span></Label>
                <Input placeholder="เช่น บ่อบาดาล, ประปา" value={irr.waterSource || ""} onChange={(e) => updateNested("irrigation", "waterSource", e.target.value)} />
                <FieldError error={errors["irrigation.waterSource"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ปริมาณน้ำตามระยะ</Label>
                <Input placeholder="เช่น กล้า 2 ลิตร/ต้น, โต 5 ลิตร/ต้น" value={irr.waterScheduleByStage || ""} onChange={(e) => updateNested("irrigation", "waterScheduleByStage", e.target.value)} />
              </div>
            </div>
            {isHighControl && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-xs font-medium">ตรวจคุณภาพน้ำ</p>
                    <p className="text-[10px] text-muted-foreground">มีผลตรวจจากห้องแล็บ</p>
                  </div>
                  <Switch checked={!!irr.waterQualityTest} onCheckedChange={(v) => updateNested("irrigation", "waterQualityTest", v)} />
                </div>
                {irr.waterQualityTest && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs">วันที่ตรวจ</Label>
                      <Input type="date" value={irr.waterTestDate || ""} onChange={(e) => updateNested("irrigation", "waterTestDate", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">ชื่อห้องแล็บ</Label>
                      <Input value={irr.waterTestLab || ""} onChange={(e) => updateNested("irrigation", "waterTestLab", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">ค่า pH น้ำ</Label>
                      <Input type="number" step="0.1" value={irr.phLevel || ""} onChange={(e) => updateNested("irrigation", "phLevel", parseFloat(e.target.value))} />
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <SectionTitle icon={BarChart3} title="การตรวจวัดสิ่งแวดล้อม" color="text-primary" />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { key: "hasTemperatureLog", label: "บันทึกอุณหภูมิ" },
                { key: "hasHumidityLog", label: "บันทึกความชื้น" },
                { key: "hasRainfallLog", label: "บันทึกปริมาณฝน" },
                { key: "hasLightIntensityLog", label: "บันทึกแสง" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <p className="text-xs font-medium">{label}</p>
                  <Switch checked={!!env[key]} onCheckedChange={(v) => updateNested("environmentalMonitoring", key, v)} />
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">ความถี่ตรวจวัด <span className="text-destructive">*</span></Label>
                <Input placeholder="เช่น ทุกวัน" value={env.monitoringFrequency || ""} onChange={(e) => updateNested("environmentalMonitoring", "monitoringFrequency", e.target.value)} />
                <FieldError error={errors["environmentalMonitoring.monitoringFrequency"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">อุปกรณ์ตรวจวัด</Label>
                <Input placeholder="เช่น เทอร์โมมิเตอร์ ไฮโกรมิเตอร์" value={env.monitoringEquipment || ""} onChange={(e) => updateNested("environmentalMonitoring", "monitoringEquipment", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">อุณหภูมิเหมาะสม</Label>
                <Input placeholder="เช่น 25-35°C" value={env.optimalTempRange || ""} onChange={(e) => updateNested("environmentalMonitoring", "optimalTempRange", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ความชื้นเหมาะสม</Label>
                <Input placeholder="เช่น 60-80%" value={env.optimalHumidityRange || ""} onChange={(e) => updateNested("environmentalMonitoring", "optimalHumidityRange", e.target.value)} />
              </div>
            </div>
          </section>
        </TabsContent>

        {/* ═══ TAB 4: Harvest & Post-harvest ═══ */}
        <TabsContent value="harvest" className="space-y-6 mt-4">
          <section className="space-y-3">
            <SectionTitle icon={Scissors} title="การเก็บเกี่ยว" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีเก็บเกี่ยว <span className="text-destructive">*</span></Label>
                <Select value={harv.harvestMethod} onValueChange={(v) => updateNested("harvest", "harvestMethod", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    {harvestMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors["harvest.harvestMethod"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วันที่คาดว่าเก็บเกี่ยว <span className="text-destructive">*</span></Label>
                <Input type="date" value={harv.expectedHarvestDate || ""} onChange={(e) => updateNested("harvest", "expectedHarvestDate", e.target.value)} />
                <FieldError error={errors["harvest.expectedHarvestDate"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ผลผลิตคาด (กก.) <span className="text-destructive">*</span></Label>
                <Input type="number" value={harv.estimatedYieldKg || ""} onChange={(e) => updateNested("harvest", "estimatedYieldKg", parseFloat(e.target.value))} />
                <FieldError error={errors["harvest.estimatedYieldKg"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ผลผลิตต่อไร่ (กก.)</Label>
                <Input type="number" value={harv.yieldPerRai || ""} onChange={(e) => updateNested("harvest", "yieldPerRai", parseFloat(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">จำนวนครั้งเก็บ/ปี</Label>
                <Input type="number" value={harv.numberOfHarvestsPerYear || ""} onChange={(e) => updateNested("harvest", "numberOfHarvestsPerYear", parseInt(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ช่วงเวลาเก็บ</Label>
                <Input placeholder="เช่น เช้ามืด 5-7 โมง" value={harv.harvestTime || ""} onChange={(e) => updateNested("harvest", "harvestTime", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">ตัวชี้วัดความสมบูรณ์ <span className="text-destructive">*</span></Label>
              <Textarea placeholder="เช่น ใบเริ่มเหลือง, เหง้าขนาด ≥ 5 ซม., สารสำคัญ ≥ 1.5%" rows={2} value={harv.maturityIndicators || ""} onChange={(e) => updateNested("harvest", "maturityIndicators", e.target.value)} />
              <FieldError error={errors["harvest.maturityIndicators"]} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">เกณฑ์การเก็บเกี่ยว <span className="text-destructive">*</span></Label>
              <Textarea placeholder="เช่น อายุ 120 วัน, ดอกบาน 70%" rows={2} value={harv.harvestCriteria || ""} onChange={(e) => updateNested("harvest", "harvestCriteria", e.target.value)} />
              <FieldError error={errors["harvest.harvestCriteria"]} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">เครื่องมือเก็บเกี่ยว <span className="text-destructive">*</span></Label>
              <Input placeholder="เช่น มีดคม กรรไกร ตะกร้า" value={harv.harvestTools || ""} onChange={(e) => updateNested("harvest", "harvestTools", e.target.value)} />
              <FieldError error={errors["harvest.harvestTools"]} />
            </div>
            {isHighControl && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">ปริมาณสารสำคัญเป้าหมาย</Label>
                  <Input placeholder="เช่น CBD ≥ 5%, Curcumin ≥ 3%" value={harv.activeIngredientTarget || ""} onChange={(e) => updateNested("harvest", "activeIngredientTarget", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">ฤดูกาลเก็บเกี่ยว</Label>
                  <Input placeholder="เช่น พ.ย. - ม.ค." value={harv.harvestSeasons || ""} onChange={(e) => updateNested("harvest", "harvestSeasons", e.target.value)} />
                </div>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <SectionTitle icon={ThermometerSun} title="การแปรรูปหลังเก็บเกี่ยว" color="text-destructive" />
            {/* Cleaning */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีทำความสะอาด <span className="text-destructive">*</span></Label>
                <Select value={post.cleaningMethod} onValueChange={(v) => updateNested("postHarvest", "cleaningMethod", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    {cleaningMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors["postHarvest.cleaningMethod"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีทำแห้ง <span className="text-destructive">*</span></Label>
                <Select value={post.dryingMethod} onValueChange={(v) => updateNested("postHarvest", "dryingMethod", v)}>
                  <SelectTrigger><SelectValue placeholder="เลือก" /></SelectTrigger>
                  <SelectContent>
                    {dryingMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError error={errors["postHarvest.dryingMethod"]} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs">อุณหภูมิทำแห้ง</Label>
                <Input placeholder="เช่น 40-50°C" value={post.dryingTemperature || ""} onChange={(e) => updateNested("postHarvest", "dryingTemperature", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ระยะเวลาทำแห้ง</Label>
                <Input placeholder="เช่น 3-5 วัน" value={post.dryingDuration || ""} onChange={(e) => updateNested("postHarvest", "dryingDuration", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ความชื้นเป้าหมาย</Label>
                <Input placeholder="เช่น ≤ 10%" value={post.targetMoistureContent || ""} onChange={(e) => updateNested("postHarvest", "targetMoistureContent", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีตัดแต่ง</Label>
                <Input placeholder="เช่น ตัดแต่งมือ" value={post.trimmingMethod || ""} onChange={(e) => updateNested("postHarvest", "trimmingMethod", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">เกณฑ์คัดเลือก</Label>
                <Input placeholder="เช่น ขนาด สี กลิ่น" value={post.sortingCriteria || ""} onChange={(e) => updateNested("postHarvest", "sortingCriteria", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีบรรจุ</Label>
                <Input placeholder="เช่น ซีลสุญญากาศ" value={post.packagingMethod || ""} onChange={(e) => updateNested("postHarvest", "packagingMethod", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วัสดุบรรจุ</Label>
                <Input placeholder="เช่น ถุง PE, ถุงอลูมิเนียม" value={post.packagingMaterial || ""} onChange={(e) => updateNested("postHarvest", "packagingMaterial", e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-xs font-medium">ระบบ Lot/Batch Traceability</p>
                <p className="text-[10px] text-muted-foreground">ติดตามย้อนกลับแต่ละ Lot ได้</p>
              </div>
              <Switch checked={!!post.batchTraceability} onCheckedChange={(v) => updateNested("postHarvest", "batchTraceability", v)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs">สภาพจัดเก็บ</Label>
                <Input placeholder="เช่น ห้องเย็น" value={post.storageCondition || ""} onChange={(e) => updateNested("postHarvest", "storageCondition", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">อุณหภูมิจัดเก็บ</Label>
                <Input placeholder="เช่น 15-25°C" value={post.storageTemperature || ""} onChange={(e) => updateNested("postHarvest", "storageTemperature", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">อายุการเก็บ</Label>
                <Input placeholder="เช่น 1 ปี" value={post.storageDuration || ""} onChange={(e) => updateNested("postHarvest", "storageDuration", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">แผนจัดการของเสีย <span className="text-destructive">*</span></Label>
              <Textarea placeholder="เช่น ทำปุ๋ยหมัก, ส่งกำจัดตามระเบียบ" rows={2} value={post.wasteManagementPlan || ""} onChange={(e) => updateNested("postHarvest", "wasteManagementPlan", e.target.value)} />
              <FieldError error={errors["postHarvest.wasteManagementPlan"]} />
            </div>
          </section>
        </TabsContent>

        {/* ═══ TAB 5: Quality Control & Crop Rotation ═══ */}
        <TabsContent value="quality" className="space-y-6 mt-4">
          <section className="space-y-3">
            <SectionTitle icon={Microscope} title="การควบคุมคุณภาพ (QC)" color="text-warning" />
            <div className="space-y-1.5">
              <Label className="text-xs">มาตรการควบคุมคุณภาพ <span className="text-destructive">*</span></Label>
              <Textarea placeholder="เช่น ตรวจวัดความชื้น สุ่มตัวอย่างส่งแล็บ" rows={2} value={qc.qualityControlMeasures || ""} onChange={(e) => updateNested("qualityControl", "qualityControlMeasures", e.target.value)} />
              <FieldError error={errors["qualityControl.qualityControlMeasures"]} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">ความถี่สุ่มตัวอย่าง <span className="text-destructive">*</span></Label>
                <Input placeholder="เช่น ทุก Batch" value={qc.samplingFrequency || ""} onChange={(e) => updateNested("qualityControl", "samplingFrequency", e.target.value)} />
                <FieldError error={errors["qualityControl.samplingFrequency"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">แผนส่งตรวจแล็บ <span className="text-destructive">*</span></Label>
                <Input placeholder="เช่น ก่อนเก็บเกี่ยว หลังอบแห้ง" value={qc.labTestingPlan || ""} onChange={(e) => updateNested("qualityControl", "labTestingPlan", e.target.value)} />
                <FieldError error={errors["qualityControl.labTestingPlan"]} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ชื่อห้องปฏิบัติการ</Label>
                <Input placeholder="เช่น ศูนย์วิทยาศาสตร์การแพทย์" value={qc.labName || ""} onChange={(e) => updateNested("qualityControl", "labName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">วิธีบันทึกข้อมูล <span className="text-destructive">*</span></Label>
                <Input placeholder="เช่น สมุดบันทึก, Excel, แอป" value={qc.recordKeepingMethod || ""} onChange={(e) => updateNested("qualityControl", "recordKeepingMethod", e.target.value)} />
                <FieldError error={errors["qualityControl.recordKeepingMethod"]} />
              </div>
            </div>

            {/* Test switches */}
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { key: "pesticideResidueTest", label: "ตรวจสารตกค้างยาฆ่าแมลง" },
                { key: "heavyMetalTest", label: "ตรวจโลหะหนัก" },
                { key: "microbialTest", label: "ตรวจจุลินทรีย์" },
                { key: "aflatoxinTest", label: "ตรวจอะฟลาทอกซิน" },
                { key: "activeIngredientTest", label: "ตรวจสารสำคัญ" },
                { key: "moistureTest", label: "ตรวจความชื้น" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <p className="text-xs font-medium">{label}</p>
                  <Switch checked={!!qc[key]} onCheckedChange={(v) => updateNested("qualityControl", key, v)} />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">เกณฑ์การยอมรับ</Label>
              <Textarea placeholder="เช่น สารตกค้าง ≤ MRL, โลหะหนัก ≤ เกณฑ์ อย." rows={2} value={qc.acceptanceCriteria || ""} onChange={(e) => updateNested("qualityControl", "acceptanceCriteria", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">ขั้นตอนเมื่อไม่ผ่าน</Label>
              <Textarea placeholder="เช่น กักกัน, ทำลาย, ส่งตรวจซ้ำ" rows={2} value={qc.rejectionProcedure || ""} onChange={(e) => updateNested("qualityControl", "rejectionProcedure", e.target.value)} />
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle icon={RefreshCw} title="การหมุนเวียนพืช" color="text-success" />
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-xs font-medium">มีแผนหมุนเวียนพืช</p>
                <p className="text-[10px] text-muted-foreground">ปลูกพืชสลับหรือพักดิน</p>
              </div>
              <Switch checked={!!crop.hasCropRotation} onCheckedChange={(v) => updateNested("cropRotation", "hasCropRotation", v)} />
            </div>
            {crop.hasCropRotation && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">แผนหมุนเวียน</Label>
                  <Input placeholder="เช่น ปลูกถั่วสลับ" value={crop.rotationPlan || ""} onChange={(e) => updateNested("cropRotation", "rotationPlan", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">พืชที่ปลูกก่อนหน้า</Label>
                  <Input placeholder="เช่น ข้าวโพด" value={crop.previousCrop || ""} onChange={(e) => updateNested("cropRotation", "previousCrop", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">ระยะพักดิน</Label>
                  <Input placeholder="เช่น 3 เดือน" value={crop.fallowPeriod || ""} onChange={(e) => updateNested("cropRotation", "fallowPeriod", e.target.value)} />
                </div>
              </div>
            )}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
