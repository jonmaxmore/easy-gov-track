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

// ─── Step 3: Cultivation Plan ────────────────────────────────

export const cultivationSchema = z.object({
  seedVariety: z.string().min(1, "กรุณาระบุสายพันธุ์"),
  seedSource: z.string().min(1, "กรุณาระบุแหล่งที่มาเมล็ดพันธุ์/กิ่งพันธุ์"),
  seedCertification: z.string().optional(),
  plantAge: z.string().optional(),

  cultivationMethod: z.enum(["outdoor", "greenhouse", "indoor", "hydroponic", "mixed"]),
  cultivationStartDate: z.string().min(1, "กรุณาระบุวันที่เริ่มปลูก"),
  growthCycleDays: z.number({ invalid_type_error: "กรุณาระบุรอบการเจริญเติบโต" }).min(1, "ต้องมากกว่า 0 วัน"),
  plantingDensity: z.string().optional(),
  numberOfPlants: z.number().optional(),

  fertilizerType: z.enum(["organic", "chemical", "mixed", "none"]),
  fertilizerDetails: z.string().min(1, "กรุณาระบุรายละเอียดปุ๋ย/สารอาหาร"),
  fertilizerFrequency: z.string().min(1, "กรุณาระบุความถี่ในการใส่ปุ๋ย"),
  organicCertified: z.boolean().optional(),
  compostSource: z.string().optional(),

  irrigationType: z.enum(["drip", "sprinkler", "flood", "manual", "rain_fed"]),
  irrigationFrequency: z.string().min(1, "กรุณาระบุความถี่ในการให้น้ำ"),
  waterQualityTest: z.boolean().optional(),
  waterTestDate: z.string().optional(),

  expectedHarvestDate: z.string().min(1, "กรุณาระบุวันที่คาดว่าจะเก็บเกี่ยว"),
  harvestMethod: z.enum(["manual", "mechanical", "mixed"]),
  harvestCriteria: z.string().min(1, "กรุณาระบุเกณฑ์การเก็บเกี่ยว (เช่น อายุ, ลักษณะ)"),
  estimatedYieldKg: z.number({ invalid_type_error: "กรุณาระบุผลผลิตที่คาด" }).min(0.1, "ต้องมากกว่า 0"),

  dryingMethod: z.enum(["sun_dry", "shade_dry", "oven", "dehumidifier", "freeze_dry"]),
  dryingTemperature: z.string().optional(),
  dryingDuration: z.string().optional(),
  trimmingMethod: z.string().optional(),
  packagingMethod: z.string().optional(),
  storageCondition: z.string().optional(),
  storageTemperature: z.string().optional(),

  qualityControlMeasures: z.string().min(1, "กรุณาระบุมาตรการควบคุมคุณภาพ"),
  samplingFrequency: z.string().optional(),
  labTestingPlan: z.string().optional(),
  pesticideUsage: z.boolean(),
  pesticideDetails: z.string().optional(),
  heavyMetalTest: z.boolean().optional(),
  microbialTest: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.pesticideUsage && (!data.pesticideDetails || data.pesticideDetails.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาระบุรายละเอียดสารเคมีที่ใช้",
      path: ["pesticideDetails"],
    });
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
    if (compliance.hasFencing && compliance.fenceHeight && compliance.fenceHeight < 2) {
      errors.push("รั้วต้องสูงไม่ต่ำกว่า 2 เมตร");
    }
  }

  if (plantCode === "CAN" && !compliance.hasBiometric) {
    errors.push("กัญชาต้องมีระบบ Biometric / Key Card");
  }

  // SOP must cover all 7 steps
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
  const missing = requiredDocIds.filter((id) => !uploadedDocIds.includes(id));
  return missing;
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
