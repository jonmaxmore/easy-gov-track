import { z } from "zod";

// ─── Step 0: Applicant Info ──────────────────────────────────

export const applicantSchema = z.object({
  fullName: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล").max(200),
  idCard: z
    .string()
    .min(1, "กรุณากรอกเลขบัตรประชาชน")
    .regex(/^[0-9]{1}-?[0-9]{4}-?[0-9]{5}-?[0-9]{2}-?[0-9]{1}$/, "รูปแบบเลขบัตรประชาชนไม่ถูกต้อง (13 หลัก)"),
  phone: z
    .string()
    .min(1, "กรุณากรอกเบอร์โทร")
    .regex(/^0[0-9]{1,2}-?[0-9]{3}-?[0-9]{4}$/, "เบอร์โทรไม่ถูกต้อง (เช่น 0XX-XXX-XXXX)"),
  email: z.string().email("อีเมลไม่ถูกต้อง").or(z.literal("")).optional(),
  applicantType: z.enum(["individual", "enterprise", "cooperative"]),
  address: z.string().min(1, "กรุณากรอกที่อยู่").max(500),
  position: z.string().optional(),
  organizationName: z.string().optional(),
  organizationId: z.string().optional(),
  authorizedPerson: z.string().optional(),
  powerOfAttorney: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.applicantType !== "individual") {
    if (!data.organizationName || data.organizationName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณากรอกชื่อองค์กร/วิสาหกิจ",
        path: ["organizationName"],
      });
    }
  }
});

// ─── Step 1: Plant Selection ─────────────────────────────────

export const plantSelectionSchema = z.object({
  selectedPlant: z.string().min(1, "กรุณาเลือกชนิดสมุนไพร"),
  applicationType: z.enum(["NEW", "RENEW", "AMEND"]),
});

// ─── Step 2: Farm Info ───────────────────────────────────────

export const farmInfoSchema = z.object({
  farmName: z.string().min(1, "กรุณากรอกชื่อแปลง/สวน").max(200),
  areaRai: z.number({ invalid_type_error: "กรุณากรอกพื้นที่" }).min(0.01, "พื้นที่ต้องมากกว่า 0"),
  province: z.string().min(1, "กรุณาเลือกจังหวัด"),
  district: z.string().min(1, "กรุณากรอกอำเภอ").max(100),
  subDistrict: z.string().min(1, "กรุณากรอกตำบล").max(100),
  landOwnership: z.enum(["owned", "leased", "government", "community"]),
  landDocNumber: z.string().optional(),
  buildingType: z.string().optional(),
  address: z.string().min(1, "กรุณากรอกที่อยู่แปลง").max(500),
  waterSource: z.string().optional(),
  soilType: z.string().optional(),
  gpsLat: z.number().min(5.5, "ละติจูดของไทยอยู่ระหว่าง 5.5-20.5").max(20.5, "ละติจูดของไทยอยู่ระหว่าง 5.5-20.5").optional().or(z.nan()),
  gpsLng: z.number().min(97, "ลองจิจูดของไทยอยู่ระหว่าง 97-106").max(106, "ลองจิจูดของไทยอยู่ระหว่าง 97-106").optional().or(z.nan()),
});

// ─── Step 3: Cultivation Plan (Deep-dive) ────────────────────

export const cultivationSchema = z.object({
  // Soil Preparation
  soilPreparation: z.object({
    method: z.string().min(1, "กรุณาเลือกวิธีเตรียมดิน"),
    preparationDate: z.string().min(1, "กรุณาระบุวันที่เตรียมดิน"),
    soilAmendments: z.string().min(1, "กรุณาระบุสารปรับปรุงดิน"),
    soilTestDate: z.string().optional(),
    soilPH: z.number().optional(),
    organicMatter: z.string().optional(),
    tillageDepth: z.string().optional(),
  }).optional().default({}),

  // Seedling
  seedling: z.object({
    propagationMethod: z.string().min(1, "กรุณาเลือกวิธีขยายพันธุ์"),
    seedVariety: z.string().min(1, "กรุณาระบุสายพันธุ์"),
    seedSource: z.string().min(1, "กรุณาระบุแหล่งที่มาเมล็ดพันธุ์"),
    seedCertification: z.string().optional(),
    seedLotNumber: z.string().optional(),
    germinationRate: z.number().optional(),
    nurseryDuration: z.string().optional(),
    nurseryMethod: z.string().optional(),
    plantAge: z.string().optional(),
    seedTreatment: z.string().optional(),
  }).optional().default({}),

  // Cultivation
  cultivationMethod: z.enum(["outdoor", "greenhouse", "indoor", "hydroponic", "mixed"]),
  cultivationStartDate: z.string().min(1, "กรุณาระบุวันที่เริ่มปลูก"),
  growthCycleDays: z.number({ invalid_type_error: "กรุณาระบุรอบการเจริญเติบโต" }).min(1, "ต้องมากกว่า 0 วัน"),
  plantingDensity: z.string().optional(),
  plantingSpacing: z.string().optional(),
  numberOfPlants: z.number().optional(),
  rowDirection: z.string().optional(),

  // Fertilizer
  fertilizerType: z.enum(["organic", "chemical", "mixed", "none"]),
  fertilizerSchedule: z.array(z.object({
    stage: z.string(),
    fertilizerName: z.string(),
    formula: z.string().optional(),
    ratePerRai: z.string(),
    applicationMethod: z.string(),
    frequency: z.string(),
  })).min(1, "กรุณาเพิ่มตารางปุ๋ยอย่างน้อย 1 ระยะ"),
  organicCertified: z.boolean().optional(),
  compostSource: z.string().optional(),

  // Pest Management
  pestManagement: z.object({
    controlMethod: z.string().min(1, "กรุณาเลือกวิธีควบคุมศัตรูพืช"),
    commonPests: z.string().min(1, "กรุณาระบุศัตรูพืชที่พบบ่อย"),
    commonDiseases: z.string().min(1, "กรุณาระบุโรคพืชที่พบบ่อย"),
    preventionMeasures: z.string().min(1, "กรุณาระบุมาตรการป้องกัน"),
    weedControl: z.string().min(1, "กรุณาเลือกวิธีจัดการวัชพืช"),
    biologicalAgents: z.string().optional(),
    chemicalUsed: z.string().optional(),
    chemicalFrequency: z.string().optional(),
    withdrawalPeriodDays: z.number().optional(),
    ipmStrategy: z.string().optional(),
    weedControlDetails: z.string().optional(),
  }).optional().default({}),

  // Irrigation
  irrigation: z.object({
    irrigationType: z.string().min(1, "กรุณาเลือกระบบการให้น้ำ"),
    irrigationFrequency: z.string().min(1, "กรุณาระบุความถี่ในการให้น้ำ"),
    waterSource: z.string().min(1, "กรุณาระบุแหล่งน้ำ"),
    waterQualityTest: z.boolean().optional(),
    waterTestDate: z.string().optional(),
    waterTestLab: z.string().optional(),
    phLevel: z.number().optional(),
    ecLevel: z.number().optional(),
    waterScheduleByStage: z.string().optional(),
  }).optional().default({}),

  // Environmental Monitoring
  environmentalMonitoring: z.object({
    hasTemperatureLog: z.boolean().optional(),
    hasHumidityLog: z.boolean().optional(),
    hasRainfallLog: z.boolean().optional(),
    hasLightIntensityLog: z.boolean().optional(),
    monitoringFrequency: z.string().min(1, "กรุณาระบุความถี่ตรวจวัด"),
    monitoringEquipment: z.string().optional(),
    optimalTempRange: z.string().optional(),
    optimalHumidityRange: z.string().optional(),
  }).optional().default({}),

  // Harvest
  harvest: z.object({
    harvestMethod: z.string().min(1, "กรุณาเลือกวิธีเก็บเกี่ยว"),
    expectedHarvestDate: z.string().min(1, "กรุณาระบุวันที่คาดว่าจะเก็บเกี่ยว"),
    harvestCriteria: z.string().min(1, "กรุณาระบุเกณฑ์การเก็บเกี่ยว"),
    maturityIndicators: z.string().min(1, "กรุณาระบุตัวชี้วัดความสมบูรณ์"),
    harvestTools: z.string().min(1, "กรุณาระบุเครื่องมือเก็บเกี่ยว"),
    estimatedYieldKg: z.number({ invalid_type_error: "กรุณาระบุผลผลิตที่คาด" }).min(0.1, "ต้องมากกว่า 0"),
    activeIngredientTarget: z.string().optional(),
    harvestTime: z.string().optional(),
    yieldPerRai: z.number().optional(),
    numberOfHarvestsPerYear: z.number().optional(),
    harvestSeasons: z.string().optional(),
  }).optional().default({}),

  // Post-harvest
  postHarvest: z.object({
    cleaningMethod: z.string().min(1, "กรุณาเลือกวิธีทำความสะอาด"),
    cleaningDetails: z.string().optional(),
    dryingMethod: z.string().min(1, "กรุณาเลือกวิธีทำแห้ง"),
    dryingTemperature: z.string().optional(),
    dryingDuration: z.string().optional(),
    targetMoistureContent: z.string().optional(),
    dryingEquipment: z.string().optional(),
    trimmingMethod: z.string().optional(),
    sortingCriteria: z.string().optional(),
    processingMethod: z.string().optional(),
    packagingMethod: z.string().optional(),
    packagingMaterial: z.string().optional(),
    labelingInfo: z.string().optional(),
    batchTraceability: z.boolean().optional(),
    storageCondition: z.string().optional(),
    storageTemperature: z.string().optional(),
    storageHumidity: z.string().optional(),
    storageDuration: z.string().optional(),
    storageContainerType: z.string().optional(),
    wasteManagementPlan: z.string().min(1, "กรุณาระบุแผนจัดการของเสีย"),
    compostingPlan: z.string().optional(),
  }).optional().default({}),

  // Quality Control
  qualityControl: z.object({
    qualityControlMeasures: z.string().min(1, "กรุณาระบุมาตรการควบคุมคุณภาพ"),
    samplingFrequency: z.string().min(1, "กรุณาระบุความถี่สุ่มตัวอย่าง"),
    labTestingPlan: z.string().min(1, "กรุณาระบุแผนส่งตรวจ"),
    labName: z.string().optional(),
    pesticideResidueTest: z.boolean().optional(),
    heavyMetalTest: z.boolean().optional(),
    microbialTest: z.boolean().optional(),
    aflatoxinTest: z.boolean().optional(),
    activeIngredientTest: z.boolean().optional(),
    moistureTest: z.boolean().optional(),
    testFrequency: z.string().optional(),
    acceptanceCriteria: z.string().optional(),
    rejectionProcedure: z.string().optional(),
    recordKeepingMethod: z.string().min(1, "กรุณาระบุวิธีบันทึกข้อมูล"),
  }).optional().default({}),

  // Crop Rotation
  cropRotation: z.object({
    hasCropRotation: z.boolean().optional(),
    rotationPlan: z.string().optional(),
    previousCrop: z.string().optional(),
    fallowPeriod: z.string().optional(),
  }).optional().default({}),
});

// ─── Step 4: Compliance ──────────────────────────────────────

export const complianceSchema = z.object({
  hasCCTV: z.boolean(),
  hasFencing: z.boolean(),
  hasAccessLog: z.boolean(),
  hasBiometric: z.boolean(),
  hasSecurityGuard: z.boolean(),
  hasZoning: z.boolean(),
  hasInventoryControl: z.boolean(),
  hasScreeningMeasure: z.boolean(),
  fenceHeight: z.number().optional(),
  cctvCount: z.number().optional(),
  securityPlan: z.string().optional(),
  pestManagement: z.string().optional(),
  waterManagement: z.string().optional(),
  productionPlan: z.string().optional(),
  sopDocuments: z.array(z.string()).optional(),
  sopCoverage: z.object({
    cultivation: z.boolean(),
    harvesting: z.boolean(),
    drying: z.boolean(),
    trimming: z.boolean(),
    packaging: z.boolean(),
    storage: z.boolean(),
    wasteDisposal: z.boolean(),
  }),
});

/** Validate compliance with plant-specific rules */
export function validateComplianceForPlant(
  compliance: z.infer<typeof complianceSchema>,
  controlLevel: "HIGH_CONTROL" | "GENERAL",
  plantCode: string
): string[] {
  const errors: string[] = [];

  if (controlLevel === "HIGH_CONTROL") {
    if (!compliance.hasCCTV) errors.push("พืชควบคุมเข้มงวดต้องมีกล้อง CCTV");
    if (!compliance.hasFencing) errors.push("พืชควบคุมเข้มงวดต้องมีรั้ว ≥ 2 เมตร");
    if (!compliance.hasAccessLog) errors.push("พืชควบคุมเข้มงวดต้องมีสมุดลงชื่อผู้เข้า-ออก");
    if (!compliance.hasZoning) errors.push("พืชควบคุมเข้มงวดต้องมีการแบ่งโซนพื้นที่");
    if (!compliance.hasInventoryControl) errors.push("พืชควบคุมเข้มงวดต้องมีระบบควบคุมบัญชี");
    if (compliance.hasFencing && compliance.fenceHeight && compliance.fenceHeight < 2) {
      errors.push("รั้วต้องสูงไม่ต่ำกว่า 2 เมตร");
    }
  }

  if (plantCode === "CAN" && !compliance.hasBiometric) {
    errors.push("กัญชาต้องมีระบบ Biometric / Key Card");
  }

  const sopCoverage = compliance.sopCoverage;
  const sopCount = Object.values(sopCoverage).filter(Boolean).length;
  if (sopCount < 7) {
    errors.push(`SOP ต้องครอบคลุมทั้ง 7 ขั้นตอน (ปัจจุบัน ${sopCount}/7)`);
  }

  return errors;
}

// ─── Step 5: Documents ───────────────────────────────────────

export function validateDocuments(
  uploadedDocIds: string[],
  requiredDocIds: string[]
): string[] {
  return requiredDocIds.filter((id) => !uploadedDocIds.includes(id));
}

// ─── Helper: get errors as Record<string, string> ────────────

export function getZodErrors(result: z.SafeParseReturnType<unknown, unknown>): Record<string, string> {
  if (result.success) return {};
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });
  return errors;
}
