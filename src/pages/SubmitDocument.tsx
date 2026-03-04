import { useState } from "react";
import { motion } from "framer-motion";
import { Check, FileText, MapPin, Upload, Shield, CreditCard, Send, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StepApplicantInfo from "@/components/submit/StepApplicantInfo";
import StepPlantSelection from "@/components/submit/StepPlantSelection";
import StepFarmInfo from "@/components/submit/StepFarmInfo";
import StepCompliance from "@/components/submit/StepCompliance";
import StepDocuments from "@/components/submit/StepDocuments";
import StepPaymentPreview from "@/components/submit/StepPaymentPreview";
import StepConfirm from "@/components/submit/StepConfirm";
import type { ApplicantInfo, FarmInfo, ComplianceInfo, UploadedDocument } from "@/types/application";

const steps = [
  { label: "ข้อมูลผู้ยื่น", icon: FileText },
  { label: "ชนิดสมุนไพร", icon: Leaf },
  { label: "พื้นที่เพาะปลูก", icon: MapPin },
  { label: "ความปลอดภัย", icon: Shield },
  { label: "เอกสารแนบ", icon: Upload },
  { label: "ค่าธรรมเนียม", icon: CreditCard },
  { label: "ยืนยัน", icon: Send },
];

export default function SubmitDocumentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const [applicant, setApplicant] = useState<Partial<ApplicantInfo>>({
    applicantType: "individual",
  });
  const [selectedPlant, setSelectedPlant] = useState("");
  const [farm, setFarm] = useState<Partial<FarmInfo>>({});
  const [compliance, setCompliance] = useState<Partial<ComplianceInfo>>({
    hasCCTV: false,
    hasFencing: false,
    hasAccessLog: false,
    hasBiometric: false,
    hasSecurityGuard: false,
    sopDocuments: [],
  });
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  const handleSubmit = () => {
    toast({
      title: "ยื่นคำขอสำเร็จ",
      description: "คำขอของคุณถูกส่งเรียบร้อยแล้ว รหัส GACP-2026-00999 รอการชำระค่าตรวจเอกสาร ฿5,000",
    });
    setCurrentStep(0);
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0: return applicant.fullName && applicant.idCard && applicant.phone;
      case 1: return !!selectedPlant;
      case 2: return farm.farmName && farm.province;
      default: return true;
    }
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
                <div className={`h-px w-3 sm:w-6 ${done ? "bg-success" : "bg-border"}`} />
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
        {currentStep === 0 && (
          <StepApplicantInfo value={applicant} onChange={setApplicant} />
        )}
        {currentStep === 1 && (
          <StepPlantSelection value={selectedPlant} onChange={setSelectedPlant} />
        )}
        {currentStep === 2 && (
          <StepFarmInfo value={farm} onChange={setFarm} />
        )}
        {currentStep === 3 && (
          <StepCompliance value={compliance} onChange={setCompliance} selectedPlant={selectedPlant} />
        )}
        {currentStep === 4 && (
          <StepDocuments documents={documents} onChange={setDocuments} selectedPlant={selectedPlant} />
        )}
        {currentStep === 5 && (
          <StepPaymentPreview />
        )}
        {currentStep === 6 && (
          <StepConfirm applicant={applicant} farm={farm} selectedPlant={selectedPlant} />
        )}
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
          <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canGoNext()}>
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
