// GACP Application State Machine & Types
// Based on canonical workflow: https://github.com/jonmaxmore/GACP-Certification-Application
// + GACP Thailand standards from DTAM (กรมการแพทย์แผนไทยฯ)

export type ApplicationStatus =
  | "DRAFT"
  | "REGISTERED"
  | "SUBMITTED"
  | "PENDING_DOC_FEE"
  | "DOC_FEE_PAID"
  | "ASSIGNED_FOR_REVIEW"
  | "REVISION_REQUESTED"
  | "DOC_APPROVED"
  | "PENDING_AUDIT_FEE"
  | "AUDIT_FEE_PAID"
  | "AUDIT_CONFIRMED"
  | "AUDIT_PASSED"
  | "CAR_PENDING"
  | "CAR_REVIEWING"
  | "APPROVED"
  | "CERTIFIED"
  | "REJECTED";

export type PlantControlLevel = "HIGH_CONTROL" | "GENERAL";

export type ApplicantType = "individual" | "enterprise" | "cooperative";

export type ApplicationType = "NEW" | "RENEW" | "AMEND";

export type LandOwnershipType = "owned" | "leased" | "government" | "community";

export type CultivationMethod = "outdoor" | "greenhouse" | "indoor" | "hydroponic" | "mixed";

export type FertilizerType = "organic" | "chemical" | "mixed" | "none";

export type IrrigationType = "drip" | "sprinkler" | "flood" | "manual" | "rain_fed";

export type HarvestMethod = "manual" | "mechanical" | "mixed";

export type DryingMethod = "sun_dry" | "shade_dry" | "oven" | "dehumidifier" | "freeze_dry";

export type PropagationMethod = "seed" | "cutting" | "tissue_culture" | "rhizome" | "division" | "layering";

export type SoilPreparationMethod = "plowing" | "raised_bed" | "no_till" | "composting" | "mulching";

export type PestControlMethod = "ipm" | "biological" | "chemical" | "organic" | "physical" | "none";

export type WeedControlMethod = "manual_weeding" | "mulching" | "cover_crop" | "herbicide" | "mechanical" | "none";

export type CleaningMethod = "water_wash" | "brush_clean" | "air_blow" | "no_wash";

export interface PlantType {
  code: string;
  nameTh: string;
  nameEn: string;
  controlLevel: PlantControlLevel;
}

export interface DocumentCategory {
  key: string;
  nameTh: string;
  description: string;
}

export interface RequiredDocument {
  id: string;
  category: string;
  nameTh: string;
  required: boolean;
  forControlLevel?: PlantControlLevel;
  forPlantCodes?: string[];
  forApplicationTypes?: ApplicationType[];
  description?: string;
}

export interface UploadedDocument {
  docId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: "pending" | "approved" | "rejected";
  comment?: string;
}

export interface ApplicationComment {
  id: string;
  author: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface ApplicationTimeline {
  status: ApplicationStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface FarmInfo {
  farmName: string;
  plantType: string;
  areaRai: number;
  province: string;
  district: string;
  subDistrict: string;
  address: string;
  gpsLat?: number;
  gpsLng?: number;
  landOwnership: LandOwnershipType;
  landDocNumber?: string;
  buildingType?: string;
  waterSource?: string;
  soilType?: string;
}

// ─── Cultivation (Deep-dive GACP) ────────────────────────────

export interface SoilPreparation {
  method: SoilPreparationMethod;
  soilTestDate?: string;
  soilPH?: number;
  organicMatter?: string; // e.g. "2.5%"
  soilAmendments: string; // เช่น ปูนโดโลไมต์ 200 กก./ไร่
  preparationDate: string;
  tillageDepth?: string; // ความลึกในการไถ เช่น 30 ซม.
}

export interface SeedlingInfo {
  propagationMethod: PropagationMethod;
  seedVariety: string;
  seedSource: string;
  seedCertification?: string;
  seedLotNumber?: string;
  germinationRate?: number; // %
  nurseryDuration?: string; // ระยะเวลาเพาะกล้า เช่น 30 วัน
  nurseryMethod?: string; // วิธีเพาะกล้า
  plantAge?: string;
  seedTreatment?: string; // การเตรียมเมล็ด เช่น แช่น้ำ 24 ชม.
}

export interface FertilizerSchedule {
  stage: string; // ระยะการเติบโต เช่น "ระยะกล้า", "ระยะเจริญเติบโต", "ระยะออกดอก"
  fertilizerName: string;
  formula?: string; // สูตรปุ๋ย เช่น 15-15-15
  ratePerRai: string; // อัตราการใช้ต่อไร่
  applicationMethod: string; // วิธีใส่ เช่น หว่าน, โรย, ผสมน้ำ
  frequency: string; // ความถี่
}

export interface PestDiseaseManagement {
  controlMethod: PestControlMethod;
  commonPests: string; // ศัตรูพืชที่พบบ่อย
  commonDiseases: string; // โรคพืชที่พบบ่อย
  preventionMeasures: string; // มาตรการป้องกัน
  biologicalAgents?: string; // ตัวห้ำ/ตัวเบียน
  chemicalUsed?: string; // สารเคมีที่ใช้ (ถ้ามี)
  chemicalFrequency?: string;
  withdrawalPeriodDays?: number; // ระยะหยุดใช้ก่อนเก็บเกี่ยว (วัน)
  ipmStrategy?: string; // กลยุทธ์ IPM
  weedControl: WeedControlMethod;
  weedControlDetails?: string;
}

export interface IrrigationPlan {
  irrigationType: IrrigationType;
  irrigationFrequency: string;
  waterSource: string;
  waterQualityTest: boolean;
  waterTestDate?: string;
  waterTestLab?: string;
  phLevel?: number;
  ecLevel?: number; // ค่าการนำไฟฟ้า
  waterScheduleByStage?: string; // ปริมาณน้ำตามระยะการเจริญเติบโต
}

export interface EnvironmentalMonitoring {
  hasTemperatureLog: boolean;
  hasHumidityLog: boolean;
  hasRainfallLog: boolean;
  hasLightIntensityLog: boolean;
  monitoringFrequency: string; // เช่น "ทุกวัน", "สัปดาห์ละครั้ง"
  monitoringEquipment?: string; // เช่น เทอร์โมมิเตอร์ ไฮโกรมิเตอร์
  optimalTempRange?: string; // เช่น 25-35°C
  optimalHumidityRange?: string; // เช่น 60-80%
}

export interface HarvestInfo {
  harvestMethod: HarvestMethod;
  expectedHarvestDate: string;
  harvestCriteria: string;
  maturityIndicators: string; // ตัวชี้วัดความสมบูรณ์ เช่น สีใบ, ขนาดเหง้า
  activeIngredientTarget?: string; // ปริมาณสารสำคัญเป้าหมาย
  harvestTime?: string; // ช่วงเวลาเก็บ เช่น เช้ามืด, ก่อนแดดจัด
  harvestTools: string; // เครื่องมือ เช่น มีดคม กรรไกร ตะกร้า
  estimatedYieldKg: number;
  yieldPerRai?: number;
  numberOfHarvestsPerYear?: number;
  harvestSeasons?: string; // ฤดูกาลเก็บเกี่ยว
}

export interface PostHarvestInfo {
  // Cleaning
  cleaningMethod: CleaningMethod;
  cleaningDetails?: string;

  // Drying
  dryingMethod: DryingMethod;
  dryingTemperature?: string;
  dryingDuration?: string;
  targetMoistureContent?: string; // ความชื้นเป้าหมาย เช่น 10%
  dryingEquipment?: string;

  // Trimming / Processing
  trimmingMethod?: string;
  sortingCriteria?: string; // เกณฑ์การคัดเลือก เช่น ขนาด สี กลิ่น
  processingMethod?: string; // การแปรรูป เช่น บด ฝาน หั่น

  // Packaging
  packagingMethod?: string;
  packagingMaterial?: string; // วัสดุบรรจุ เช่น ถุง PE, ถุงอลูมิเนียม
  labelingInfo?: string; // ข้อมูลบนฉลาก
  batchTraceability: boolean; // ระบบ Lot/Batch

  // Storage
  storageCondition?: string;
  storageTemperature?: string;
  storageHumidity?: string;
  storageDuration?: string; // อายุการเก็บ
  storageContainerType?: string; // ภาชนะจัดเก็บ

  // Waste
  wasteManagementPlan: string; // แผนจัดการของเสีย
  compostingPlan?: string;
}

export interface QualityControl {
  qualityControlMeasures: string;
  samplingFrequency: string;
  labTestingPlan: string;
  labName?: string; // ชื่อห้องปฏิบัติการ
  pesticideResidueTest: boolean;
  heavyMetalTest: boolean;
  microbialTest: boolean;
  aflatoxinTest?: boolean;
  activeIngredientTest?: boolean;
  moistureTest?: boolean;
  testFrequency?: string; // ความถี่การส่งตรวจ
  acceptanceCriteria?: string; // เกณฑ์การยอมรับ
  rejectionProcedure?: string; // ขั้นตอนเมื่อไม่ผ่าน
  recordKeepingMethod: string; // วิธีบันทึก เช่น สมุดบันทึก, แอป, Excel
}

export interface CropRotation {
  hasCropRotation: boolean;
  rotationPlan?: string; // เช่น ปลูกถั่วสลับ, พักดิน 3 เดือน
  previousCrop?: string; // พืชที่ปลูกก่อนหน้า
  fallowPeriod?: string; // ระยะพักดิน
}

export interface CultivationInfo {
  // Soil Preparation
  soilPreparation: SoilPreparation;

  // Seedling
  seedling: SeedlingInfo;

  // Cultivation
  cultivationMethod: CultivationMethod;
  cultivationStartDate: string;
  growthCycleDays: number;
  plantingDensity?: string;
  plantingSpacing?: string; // ระยะปลูก เช่น 50x50 ซม.
  numberOfPlants?: number;
  rowDirection?: string; // ทิศทางแถว เช่น เหนือ-ใต้

  // Fertilizer
  fertilizerType: FertilizerType;
  fertilizerSchedule: FertilizerSchedule[];
  organicCertified?: boolean;
  compostSource?: string;

  // Pest & Disease
  pestManagement: PestDiseaseManagement;

  // Irrigation
  irrigation: IrrigationPlan;

  // Environmental
  environmentalMonitoring: EnvironmentalMonitoring;

  // Harvesting
  harvest: HarvestInfo;

  // Post-harvest
  postHarvest: PostHarvestInfo;

  // Quality Control
  qualityControl: QualityControl;

  // Crop Rotation
  cropRotation: CropRotation;
}

export interface ApplicantInfo {
  fullName: string;
  idCard: string;
  phone: string;
  email: string;
  applicantType: ApplicantType;
  address: string;
  position?: string;
  organizationName?: string;
  organizationId?: string;
  authorizedPerson?: string;
  powerOfAttorney?: boolean;
}

export interface ComplianceInfo {
  hasCCTV: boolean;
  hasFencing: boolean;
  hasAccessLog: boolean;
  hasBiometric: boolean;
  hasSecurityGuard: boolean;
  fenceHeight?: number;
  cctvCount?: number;
  hasZoning: boolean;
  hasInventoryControl: boolean;
  hasScreeningMeasure: boolean;
  sopDocuments: string[];
  securityPlan: string;
  sopCoverage: {
    cultivation: boolean;
    harvesting: boolean;
    drying: boolean;
    trimming: boolean;
    packaging: boolean;
    storage: boolean;
    wasteDisposal: boolean;
  };
  productionPlan?: string;
  pestManagement?: string;
  waterManagement?: string;
}

export interface Application {
  id: string;
  applicationType: ApplicationType;
  applicant: ApplicantInfo;
  farm: FarmInfo;
  cultivation: CultivationInfo;
  compliance: ComplianceInfo;
  documents: UploadedDocument[];
  status: ApplicationStatus;
  timeline: ApplicationTimeline[];
  comments: ApplicationComment[];
  createdAt: string;
  updatedAt: string;
  assignedAuditor?: string;
  auditDate?: string;
  totalScore?: number;
  certificateId?: string;
  previousCertificateId?: string;
}

export interface PaymentInfo {
  id: string;
  applicationId: string;
  type: "DOC_FEE" | "AUDIT_FEE";
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  paidAt?: string;
  transactionId?: string;
}
