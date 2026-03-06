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

export interface CultivationInfo {
  // Seed / Variety
  seedVariety: string;
  seedSource: string;
  seedCertification?: string;
  plantAge?: string;

  // Cultivation
  cultivationMethod: CultivationMethod;
  cultivationStartDate: string;
  growthCycleDays: number;
  plantingDensity?: string;
  numberOfPlants?: number;

  // Fertilizer
  fertilizerType: FertilizerType;
  fertilizerDetails: string;
  fertilizerFrequency: string;
  organicCertified?: boolean;
  compostSource?: string;

  // Irrigation
  irrigationType: IrrigationType;
  irrigationFrequency: string;
  waterQualityTest?: boolean;
  waterTestDate?: string;

  // Harvesting
  expectedHarvestDate: string;
  harvestMethod: HarvestMethod;
  harvestCriteria: string;
  estimatedYieldKg: number;

  // Post-harvest
  dryingMethod: DryingMethod;
  dryingTemperature?: string;
  dryingDuration?: string;
  trimmingMethod?: string;
  packagingMethod?: string;
  storageCondition?: string;
  storageTemperature?: string;

  // Quality Control
  qualityControlMeasures: string;
  samplingFrequency?: string;
  labTestingPlan?: string;
  pesticideUsage: boolean;
  pesticideDetails?: string;
  heavyMetalTest?: boolean;
  microbialTest?: boolean;
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
