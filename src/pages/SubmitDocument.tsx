import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, FileText, MapPin, Upload, Shield, CreditCard, Send, Leaf, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StepApplicantInfo from "@/components/submit/StepApplicantInfo";
import StepPlantSelection from "@/components/submit/StepPlantSelection";
import StepFarmInfo from "@/components/submit/StepFarmInfo";
import StepCultivation from "@/components/submit/StepCultivation";
import StepCompliance from "@/components/submit/StepCompliance";
import StepDocuments from "@/components/submit/StepDocuments";
import StepPaymentPreview from "@/components/submit/StepPaymentPreview";
import StepConfirm from "@/components/submit/StepConfirm";
import { PLANT_TYPES, getRelevantDocuments } from "@/constants/gacp";
import {
  applicantSchema,
  plantSelectionSchema,
  farmInfoSchema,
  cultivationSchema,
  complianceSchema,
  validateComplianceForPlant,
  validateCultivationForHighControl,
  getZodErrors,
} from "@/lib/validations";
import type { ApplicantInfo, FarmInfo, ComplianceInfo, CultivationInfo, UploadedDocument, ApplicationType } from "@/types/application";

const steps = [
  { label: "ข้อมูลผู้ยื่น", icon: FileText },
  { label: "ชนิดสมุนไพร", icon: Leaf },
  { label: "พื้นที่เพาะปลูก", icon: MapPin },
  { label: "แผนเพาะปลูก", icon: Sprout },
  { label: "ความปลอดภัย", icon: Shield },
  { label: "เอกสารแนบ", icon: Upload },
  { label: "ค่าธรรมเนียม", icon: CreditCard },
  { label: "ยืนยัน", icon: Send },
];

export default function SubmitDocumentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [attemptedNext, setAttemptedNext] = useState(false);
  const { toast } = useToast();

  const [applicationType, setApplicationType] = useState<ApplicationType>("NEW");
  const [applicant, setApplicant] = useState<Partial<ApplicantInfo>>({
    applicantType: "individual",
  });
  const [selectedPlant, setSelectedPlant] = useState("");
  const [farm, setFarm] = useState<Partial<FarmInfo>>({ landOwnership: "owned" });
  const [cultivation, setCultivation] = useState<Partial<CultivationInfo>>({
    cultivationMethod: "outdoor",
    fertilizerType: "organic",
    fertilizerSchedule: [],
    soilPreparation: { method: "", preparationDate: "", soilAmendments: "" } as any,
    seedling: { propagationMethod: "", seedVariety: "", seedSource: "" } as any,
    pestManagement: { controlMethod: "", commonPests: "", commonDiseases: "", preventionMeasures: "", weedControl: "" } as any,
    irrigation: { irrigationType: "drip", irrigationFrequency: "", waterSource: "", waterQualityTest: false } as any,
    environmentalMonitoring: { hasTemperatureLog: false, hasHumidityLog: false, hasRainfallLog: false, hasLightIntensityLog: false, monitoringFrequency: "" } as any,
    harvest: { harvestMethod: "manual", expectedHarvestDate: "", harvestCriteria: "", maturityIndicators: "", harvestTools: "", estimatedYieldKg: 0 } as any,
    postHarvest: { cleaningMethod: "", dryingMethod: "shade_dry", batchTraceability: false, wasteManagementPlan: "" } as any,
    qualityControl: { qualityControlMeasures: "", samplingFrequency: "", labTestingPlan: "", recordKeepingMethod: "", pesticideResidueTest: false, heavyMetalTest: false, microbialTest: false } as any,
    cropRotation: { hasCropRotation: false } as any,
  });
  const [compliance, setCompliance] = useState<Partial<ComplianceInfo>>({
    hasCCTV: false,
    hasFencing: false,
    hasAccessLog: false,
    hasBiometric: false,
    hasSecurityGuard: false,
    hasZoning: false,
    hasInventoryControl: false,
    hasScreeningMeasure: false,
    sopDocuments: [],
    sopCoverage: {
      cultivation: false, harvesting: false, drying: false,
      trimming: false, packaging: false, storage: false, wasteDisposal: false,
    },
  });
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  const plant = PLANT_TYPES.find((p) => p.code === selectedPlant);
  const isHighControl = plant?.controlLevel === "HIGH_CONTROL";

  const validateCurrentStep = (): boolean => {
    let errors: Record<string, string> = {};

    switch (currentStep) {
      case 0: {
        const result = applicantSchema.safeParse(applicant);
        errors = getZodErrors(result);
        break;
      }
      case 1: {
        const result = plantSelectionSchema.safeParse({ selectedPlant, applicationType });
        errors = getZodErrors(result);
        break;
      }
      case 2: {
        const result = farmInfoSchema.safeParse(farm);
        errors = getZodErrors(result);
        break;
      }
      case 3: {
        const result = cultivationSchema.safeParse(cultivation);
        errors = getZodErrors(result);
        break;
      }
      case 4: {
        const result = complianceSchema.safeParse(compliance);
        errors = getZodErrors(result);
        if (Object.keys(errors).length === 0 && plant) {
          const complianceErrors = validateComplianceForPlant(
            compliance as any,
            plant.controlLevel,
            plant.code
          );
          if (complianceErrors.length > 0) {
            errors["_compliance"] = complianceErrors.join("; ");
          }
        }
        break;
      }
      case 5: {
        const relevantDocs = getRelevantDocuments(selectedPlant, applicationType);
        const requiredIds = relevantDocs.filter((d) => d.required).map((d) => d.id);
        const uploadedIds = documents.map((d) => d.docId);
        const missing = requiredIds.filter((id) => !uploadedIds.includes(id));
        if (missing.length > 0) {
          errors["_documents"] = `ยังขาดเอกสารบังคับ ${missing.length} รายการ`;
        }
        break;
      }
      default:
        break;
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    setAttemptedNext(true);
    if (validateCurrentStep()) {
      setStepErrors({});
      setAttemptedNext(false);
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "กรุณาตรวจสอบข้อมูล",
        description: "มีข้อมูลที่ยังไม่ครบ กรุณากรอกให้ครบถ้วน",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    toast({
      title: "ยื่นคำขอสำเร็จ",
      description: "คำขอของคุณถูกส่งเรียบร้อยแล้ว รหัส GACP-2026-00999 รอการชำระค่าตรวจเอกสาร ฿5,000",
    });
    setCurrentStep(0);
  };

  const errorCount = Object.keys(stepErrors).length;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-lg font-bold text-foreground md:text-xl">ยื่นคำขอรับรอง GACP</h2>
        <p className="text-sm text-muted-foreground">กรอกข้อมูลตามขั้นตอนเพื่อยื่นขอรับรองมาตรฐาน (1 ฟาร์ม = 1 ใบรับรอง, อายุ 3 ปี)</p>
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

      {/* Validation Error Banner */}
      {attemptedNext && errorCount > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="text-xs font-medium text-destructive">
            ⚠️ พบข้อผิดพลาด {errorCount} รายการ กรุณาตรวจสอบข้อมูลด้านล่าง
          </p>
          {stepErrors["_compliance"] && (
            <p className="mt-1 text-[11px] text-destructive">{stepErrors["_compliance"]}</p>
          )}
          {stepErrors["_documents"] && (
            <p className="mt-1 text-[11px] text-destructive">{stepErrors["_documents"]}</p>
          )}
        </div>
      )}

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-border bg-card p-4 card-shadow md:p-6"
      >
        {currentStep === 0 && (
          <StepApplicantInfo value={applicant} onChange={setApplicant} errors={attemptedNext ? stepErrors : {}} />
        )}
        {currentStep === 1 && (
          <StepPlantSelection
            value={selectedPlant}
            onChange={setSelectedPlant}
            applicationType={applicationType}
            onApplicationTypeChange={setApplicationType}
            errors={attemptedNext ? stepErrors : {}}
          />
        )}
        {currentStep === 2 && (
          <StepFarmInfo value={farm} onChange={setFarm} errors={attemptedNext ? stepErrors : {}} />
        )}
        {currentStep === 3 && (
          <StepCultivation
            value={cultivation}
            onChange={setCultivation}
            errors={attemptedNext ? stepErrors : {}}
            isHighControl={isHighControl}
          />
        )}
        {currentStep === 4 && (
          <StepCompliance value={compliance} onChange={setCompliance} selectedPlant={selectedPlant} errors={attemptedNext ? stepErrors : {}} />
        )}
        {currentStep === 5 && (
          <StepDocuments
            documents={documents}
            onChange={setDocuments}
            selectedPlant={selectedPlant}
            applicationType={applicationType}
          />
        )}
        {currentStep === 6 && (
          <StepPaymentPreview />
        )}
        {currentStep === 7 && (
          <StepConfirm
            applicant={applicant}
            farm={farm}
            cultivation={cultivation}
            compliance={compliance}
            documents={documents}
            selectedPlant={selectedPlant}
            applicationType={applicationType}
          />
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setStepErrors({});
            setAttemptedNext(false);
            setCurrentStep(Math.max(0, currentStep - 1));
          }}
          disabled={currentStep === 0}
        >
          ย้อนกลับ
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>
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
