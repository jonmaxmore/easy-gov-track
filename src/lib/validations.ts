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
    if (!data.organizationId || data.organizationId.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณากรอกเลขทะเบียนนิติบุคคล",
        path: ["organizationId"],
      });
    }
  }
  if (data.powerOfAttorney) {
    if (!data.authorizedPerson || data.authorizedPerson.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณากรอกชื่อผู้รับมอบอำนาจ",
        path: ["authorizedPerson"],
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
}).superRefine((data, ctx) => {
  // Land doc required for leased/government
  if ((data.landOwnership === "leased" || data.landOwnership === "government") &&
      (!data.landDocNumber || data.landDocNumber.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณากรอกเลขที่เอกสารสิทธิ์/สัญญาเช่า",
      path: ["landDocNumber"],
    });
  }
  // If one GPS coord is provided, the other is required
  const hasLat = data.gpsLat !== undefined && !isNaN(data.gpsLat);
  const hasLng = data.gpsLng !== undefined && !isNaN(data.gpsLng);
  if (hasLat && !hasLng) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณากรอกลองจิจูดด้วย",
      path: ["gpsLng"],
    });
  }
  if (hasLng && !hasLat) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณากรอกละติจูดด้วย",
      path: ["gpsLat"],
    });
  }
});

// ─── Step 3: Cultivation Plan (Deep-dive GACP) ───────────────
// NOTE: All nested sections are REQUIRED — no .optional()

const soilPreparationSchema = z.object({
  method: z.string().min(1, "กรุณาเลือกวิธีเตรียมดิน"),
  preparationDate: z.string().min(1, "กรุณาระบุวันที่เตรียมดิน"),
  soilAmendments: z.string().min(1, "กรุณาระบุสารปรับปรุงดิน"),
  soilTestDate: z.string().optional(),
  soilPH: z.number().min(0, "pH ต้อง ≥ 0").max(14, "pH ต้อง ≤ 14").optional().or(z.nan()),
  organicMatter: z.string().optional(),
  tillageDepth: z.string().optional(),
});

const seedlingSchema = z.object({
  propagationMethod: z.string().min(1, "กรุณาเลือกวิธีขยายพันธุ์"),
  seedVariety: z.string().min(1, "กรุณาระบุสายพันธุ์"),
  seedSource: z.string().min(1, "กรุณาระบุแหล่งที่มาเมล็ดพันธุ์"),
  seedCertification: z.string().optional(),
  seedLotNumber: z.string().optional(),
  germinationRate: z.number().min(0).max(100).optional().or(z.nan()),
  nurseryDuration: z.string().optional(),
  nurseryMethod: z.string().optional(),
  plantAge: z.string().optional(),
  seedTreatment: z.string().optional(),
});

const fertilizerScheduleSchema = z.object({
  stage: z.string().min(1, "กรุณาระบุระยะการเติบโต"),
  fertilizerName: z.string().min(1, "กรุณาระบุชื่อปุ๋ย"),
  formula: z.string().optional(),
  ratePerRai: z.string().min(1, "กรุณาระบุอัตราการใช้ต่อไร่"),
  applicationMethod: z.string().min(1, "กรุณาระบุวิธีใส่ปุ๋ย"),
  frequency: z.string().min(1, "กรุณาระบุความถี่"),
});

const pestManagementSchema = z.object({
  controlMethod: z.string().min(1, "กรุณาเลือกวิธีควบคุมศัตรูพืช"),
  commonPests: z.string().min(1, "กรุณาระบุศัตรูพืชที่พบบ่อย"),
  commonDiseases: z.string().min(1, "กรุณาระบุโรคพืชที่พบบ่อย"),
  preventionMeasures: z.string().min(1, "กรุณาระบุมาตรการป้องกัน"),
  weedControl: z.string().min(1, "กรุณาเลือกวิธีจัดการวัชพืช"),
  biologicalAgents: z.string().optional(),
  chemicalUsed: z.string().optional(),
  chemicalFrequency: z.string().optional(),
  withdrawalPeriodDays: z.number().min(0).optional().or(z.nan()),
  ipmStrategy: z.string().optional(),
  weedControlDetails: z.string().optional(),
}).superRefine((data, ctx) => {
  // If chemical or IPM with chemical, require chemicalUsed & withdrawal
  if (data.controlMethod === "chemical" || data.controlMethod === "ipm") {
    if (data.controlMethod === "chemical" && (!data.chemicalUsed || data.chemicalUsed.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุสารเคมีที่ใช้",
        path: ["chemicalUsed"],
      });
    }
    if (data.controlMethod === "chemical") {
      const wd = data.withdrawalPeriodDays;
      if (wd === undefined || isNaN(wd)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "กรุณาระบุระยะหยุดใช้สารเคมีก่อนเก็บเกี่ยว (วัน)",
          path: ["withdrawalPeriodDays"],
        });
      }
    }
  }
  if ((data.controlMethod === "biological" || data.controlMethod === "ipm") &&
      (!data.biologicalAgents || data.biologicalAgents.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาระบุตัวห้ำ/ตัวเบียนที่ใช้",
      path: ["biologicalAgents"],
    });
  }
});

const irrigationSchema = z.object({
  irrigationType: z.string().min(1, "กรุณาเลือกระบบการให้น้ำ"),
  irrigationFrequency: z.string().min(1, "กรุณาระบุความถี่ในการให้น้ำ"),
  waterSource: z.string().min(1, "กรุณาระบุแหล่งน้ำ"),
  waterQualityTest: z.boolean().optional(),
  waterTestDate: z.string().optional(),
  waterTestLab: z.string().optional(),
  phLevel: z.number().min(0).max(14).optional().or(z.nan()),
  ecLevel: z.number().min(0).optional().or(z.nan()),
  waterScheduleByStage: z.string().optional(),
}).superRefine((data, ctx) => {
  // If water quality test is true, require test date
  if (data.waterQualityTest) {
    if (!data.waterTestDate || data.waterTestDate.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุวันที่ตรวจคุณภาพน้ำ",
        path: ["waterTestDate"],
      });
    }
  }
});

const environmentalMonitoringSchema = z.object({
  hasTemperatureLog: z.boolean().optional(),
  hasHumidityLog: z.boolean().optional(),
  hasRainfallLog: z.boolean().optional(),
  hasLightIntensityLog: z.boolean().optional(),
  monitoringFrequency: z.string().min(1, "กรุณาระบุความถี่ตรวจวัด"),
  monitoringEquipment: z.string().optional(),
  optimalTempRange: z.string().optional(),
  optimalHumidityRange: z.string().optional(),
});

const harvestSchema = z.object({
  harvestMethod: z.string().min(1, "กรุณาเลือกวิธีเก็บเกี่ยว"),
  expectedHarvestDate: z.string().min(1, "กรุณาระบุวันที่คาดว่าจะเก็บเกี่ยว"),
  harvestCriteria: z.string().min(1, "กรุณาระบุเกณฑ์การเก็บเกี่ยว"),
  maturityIndicators: z.string().min(1, "กรุณาระบุตัวชี้วัดความสมบูรณ์"),
  harvestTools: z.string().min(1, "กรุณาระบุเครื่องมือเก็บเกี่ยว"),
  estimatedYieldKg: z.number({ invalid_type_error: "กรุณาระบุผลผลิตที่คาด" }).min(0.1, "ต้องมากกว่า 0"),
  activeIngredientTarget: z.string().optional(),
  harvestTime: z.string().optional(),
  yieldPerRai: z.number().min(0).optional().or(z.nan()),
  numberOfHarvestsPerYear: z.number().min(1).optional().or(z.nan()),
  harvestSeasons: z.string().optional(),
});

const postHarvestSchema = z.object({
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
}).superRefine((data, ctx) => {
  // If drying method is oven/dehumidifier/freeze_dry, require temperature & duration
  if (["oven", "dehumidifier", "freeze_dry"].includes(data.dryingMethod)) {
    if (!data.dryingTemperature || data.dryingTemperature.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุอุณหภูมิทำแห้ง",
        path: ["dryingTemperature"],
      });
    }
    if (!data.dryingDuration || data.dryingDuration.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุระยะเวลาทำแห้ง",
        path: ["dryingDuration"],
      });
    }
  }
  // Target moisture always recommended
  if (!data.targetMoistureContent || data.targetMoistureContent.trim() === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาระบุความชื้นเป้าหมาย (เช่น ≤ 10%)",
      path: ["targetMoistureContent"],
    });
  }
});

const qualityControlSchema = z.object({
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
});

const cropRotationSchema = z.object({
  hasCropRotation: z.boolean().optional(),
  rotationPlan: z.string().optional(),
  previousCrop: z.string().optional(),
  fallowPeriod: z.string().optional(),
});

export const cultivationSchema = z.object({
  // Soil & Seedling — REQUIRED sections
  soilPreparation: soilPreparationSchema,
  seedling: seedlingSchema,

  // Cultivation basics
  cultivationMethod: z.enum(["outdoor", "greenhouse", "indoor", "hydroponic", "mixed"]),
  cultivationStartDate: z.string().min(1, "กรุณาระบุวันที่เริ่มปลูก"),
  growthCycleDays: z.number({ invalid_type_error: "กรุณาระบุรอบการเจริญเติบโต" }).min(1, "ต้องมากกว่า 0 วัน").max(730, "รอบการเจริญเติบโตไม่ควรเกิน 730 วัน"),
  plantingDensity: z.string().optional(),
  plantingSpacing: z.string().optional(),
  numberOfPlants: z.number().min(1).optional().or(z.nan()),
  rowDirection: z.string().optional(),

  // Fertilizer
  fertilizerType: z.enum(["organic", "chemical", "mixed", "none"]),
  fertilizerSchedule: z.array(fertilizerScheduleSchema),
  organicCertified: z.boolean().optional(),
  compostSource: z.string().optional(),

  // REQUIRED sections
  pestManagement: pestManagementSchema,
  irrigation: irrigationSchema,
  environmentalMonitoring: environmentalMonitoringSchema,
  harvest: harvestSchema,
  postHarvest: postHarvestSchema,
  qualityControl: qualityControlSchema,
  cropRotation: cropRotationSchema,
}).superRefine((data, ctx) => {
  // Fertilizer schedule required unless fertilizerType is "none"
  if (data.fertilizerType !== "none" && data.fertilizerSchedule.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาเพิ่มตารางปุ๋ยอย่างน้อย 1 ระยะ (หรือเลือก \"ไม่ใช้ปุ๋ย\")",
      path: ["fertilizerSchedule"],
    });
  }

  // If organic, compost source is recommended
  if (data.fertilizerType === "organic" && (!data.compostSource || data.compostSource.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาระบุแหล่งปุ๋ยหมัก/อินทรีย์",
      path: ["compostSource"],
    });
  }

  // Harvest date must be after cultivation start date
  if (data.cultivationStartDate && data.harvest.expectedHarvestDate) {
    const start = new Date(data.cultivationStartDate);
    const harvest = new Date(data.harvest.expectedHarvestDate);
    if (harvest <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "วันเก็บเกี่ยวต้องหลังวันเริ่มปลูก",
        path: ["harvest", "expectedHarvestDate"],
      });
    }
  }

  // Soil pH validation
  if (data.soilPreparation.soilPH !== undefined && !isNaN(data.soilPreparation.soilPH)) {
    if (data.soilPreparation.soilPH < 3 || data.soilPreparation.soilPH > 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ค่า pH ดินสำหรับการเพาะปลูกควรอยู่ระหว่าง 3.0-10.0",
        path: ["soilPreparation", "soilPH"],
      });
    }
  }
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
    if (!compliance.hasScreeningMeasure) errors.push("พืชควบคุมเข้มงวดต้องมีมาตรการคัดกรอง");
    if (compliance.hasFencing && compliance.fenceHeight !== undefined && compliance.fenceHeight < 2) {
      errors.push("รั้วต้องสูงไม่ต่ำกว่า 2 เมตร");
    }
    if (compliance.hasFencing && (compliance.fenceHeight === undefined || isNaN(compliance.fenceHeight))) {
      errors.push("กรุณาระบุความสูงรั้ว");
    }
    if (compliance.hasCCTV && (compliance.cctvCount === undefined || compliance.cctvCount < 1)) {
      errors.push("กรุณาระบุจำนวนกล้อง CCTV");
    }
    if (!compliance.securityPlan || compliance.securityPlan.trim() === "") {
      errors.push("พืชควบคุมเข้มงวดต้องมีแผนรักษาความปลอดภัย");
    }
    if (!compliance.productionPlan || compliance.productionPlan.trim() === "") {
      errors.push("พืชควบคุมเข้มงวดต้องมีแผนการผลิต");
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

// ─── Validation for HIGH_CONTROL cultivation extras ──────────

export function validateCultivationForHighControl(
  cultivation: z.infer<typeof cultivationSchema>
): string[] {
  const errors: string[] = [];

  // HIGH_CONTROL requires water quality test
  if (!cultivation.irrigation.waterQualityTest) {
    errors.push("พืชควบคุมเข้มงวดต้องมีผลตรวจคุณภาพน้ำ");
  }

  // HIGH_CONTROL requires batch traceability
  if (!cultivation.postHarvest.batchTraceability) {
    errors.push("พืชควบคุมเข้มงวดต้องมีระบบ Lot/Batch Traceability");
  }

  // HIGH_CONTROL requires at least pesticide + heavy metal tests
  if (!cultivation.qualityControl.pesticideResidueTest) {
    errors.push("พืชควบคุมเข้มงวดต้องตรวจสารตกค้างยาฆ่าแมลง");
  }
  if (!cultivation.qualityControl.heavyMetalTest) {
    errors.push("พืชควบคุมเข้มงวดต้องตรวจโลหะหนัก");
  }
  if (!cultivation.qualityControl.microbialTest) {
    errors.push("พืชควบคุมเข้มงวดต้องตรวจเชื้อจุลินทรีย์");
  }

  // Seed certification required for HIGH_CONTROL
  if (!cultivation.seedling.seedCertification || cultivation.seedling.seedCertification.trim() === "") {
    errors.push("พืชควบคุมเข้มงวดต้องมีหนังสือรับรองสายพันธุ์");
  }

  // Environmental monitoring: at least temperature + humidity required
  if (!cultivation.environmentalMonitoring.hasTemperatureLog) {
    errors.push("พืชควบคุมเข้มงวดต้องบันทึกอุณหภูมิ");
  }
  if (!cultivation.environmentalMonitoring.hasHumidityLog) {
    errors.push("พืชควบคุมเข้มงวดต้องบันทึกความชื้น");
  }

  return errors;
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
