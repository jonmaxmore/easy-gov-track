import { useState } from "react";
import { motion } from "framer-motion";
import { Check, FileText, Upload, Leaf, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { label: "ข้อมูลทั่วไป", icon: FileText },
  { label: "พื้นที่เพาะปลูก", icon: MapPin },
  { label: "เอกสารแนบ", icon: Upload },
  { label: "ยืนยัน", icon: Send },
];

export default function SubmitDocumentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "ยื่นคำขอสำเร็จ",
      description: "คำขอของคุณถูกส่งเรียบร้อยแล้ว รอการตรวจสอบ",
    });
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-lg font-bold text-foreground md:text-xl">ยื่นคำขอรับรอง GACP</h2>
        <p className="text-sm text-muted-foreground">กรอกข้อมูลตามขั้นตอนเพื่อยื่นขอรับรองมาตรฐาน</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={i} className="flex items-center gap-1">
              <button
                onClick={() => i <= currentStep && setCurrentStep(i)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  done
                    ? "bg-success/15 text-success"
                    : active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <step.icon className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`h-px w-4 sm:w-8 ${done ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-border bg-card p-4 card-shadow md:p-6"
      >
        {currentStep === 0 && <StepGeneralInfo />}
        {currentStep === 1 && <StepFarmInfo />}
        {currentStep === 2 && <StepDocuments />}
        {currentStep === 3 && <StepConfirm />}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          ย้อนกลับ
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)}>
            ถัดไป
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gold-gradient border-0">
            <Send className="mr-1 h-4 w-4" />
            ยื่นคำขอ
          </Button>
        )}
      </div>
    </div>
  );
}

function StepGeneralInfo() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">ข้อมูลทั่วไปของผู้ยื่นคำขอ</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">ชื่อ-นามสกุล</Label>
          <Input placeholder="กรอกชื่อ-นามสกุล" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">เลขบัตรประชาชน</Label>
          <Input placeholder="X-XXXX-XXXXX-XX-X" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">เบอร์โทรศัพท์</Label>
          <Input placeholder="0XX-XXX-XXXX" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">อีเมล</Label>
          <Input placeholder="email@example.com" type="email" />
        </div>
      </div>
    </div>
  );
}

function StepFarmInfo() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">ข้อมูลพื้นที่เพาะปลูก</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">ชื่อแปลง/สวน</Label>
          <Input placeholder="ชื่อแปลงเพาะปลูก" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">ชนิดสมุนไพร</Label>
          <Input placeholder="เช่น กัญชง, ฟ้าทะลายโจร" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">พื้นที่ (ไร่)</Label>
          <Input placeholder="0.00" type="number" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">จังหวัด</Label>
          <Input placeholder="เลือกจังหวัด" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">ที่อยู่แปลงเพาะปลูก</Label>
        <Textarea placeholder="ที่อยู่โดยละเอียด" rows={3} />
      </div>
    </div>
  );
}

function StepDocuments() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">เอกสารแนบ</h3>
      <p className="text-xs text-muted-foreground">อัพโหลดเอกสารที่เกี่ยวข้องเพื่อประกอบการพิจารณา</p>

      {[
        "สำเนาบัตรประชาชน",
        "สำเนาทะเบียนบ้าน",
        "แผนผังแปลงเพาะปลูก",
        "ใบอนุญาตปลูก (ถ้ามี)",
      ].map((doc) => (
        <div
          key={doc}
          className="flex items-center justify-between rounded-lg border border-dashed border-border p-3"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{doc}</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            <Upload className="mr-1 h-3 w-3" />
            อัพโหลด
          </Button>
        </div>
      ))}
    </div>
  );
}

function StepConfirm() {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Leaf className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-sm font-semibold">ยืนยันการยื่นคำขอ</h3>
      <p className="mx-auto max-w-sm text-xs text-muted-foreground">
        กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนกดยื่นคำขอ หลังจากยื่นแล้วจะไม่สามารถแก้ไขได้
        จนกว่าเจ้าหน้าที่จะส่งกลับแก้ไข
      </p>
    </div>
  );
}
