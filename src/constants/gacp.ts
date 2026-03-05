import type { PlantType, DocumentCategory, RequiredDocument, ApplicationStatus, ApplicationType } from "@/types/application";

export const APPLICATION_TYPES: { value: ApplicationType; label: string; desc: string }[] = [
  { value: "NEW", label: "ยื่นใหม่", desc: "ยื่นขอรับรอง GACP ครั้งแรก" },
  { value: "RENEW", label: "ต่ออายุ", desc: "ต่ออายุใบรับรอง GACP ที่หมดอายุ" },
  { value: "AMEND", label: "ขอใบแทน", desc: "ขอใบแทนกรณีสูญหาย/ชำรุด" },
];

export const PLANT_TYPES: PlantType[] = [
  { code: "CAN", nameTh: "กัญชา", nameEn: "Cannabis", controlLevel: "HIGH_CONTROL" },
  { code: "KRA", nameTh: "กระท่อม", nameEn: "Kratom", controlLevel: "HIGH_CONTROL" },
  { code: "HMP", nameTh: "กัญชง", nameEn: "Hemp", controlLevel: "HIGH_CONTROL" },
  { code: "TUR", nameTh: "ขมิ้นชัน", nameEn: "Turmeric", controlLevel: "GENERAL" },
  { code: "GIN", nameTh: "ขิง", nameEn: "Ginger", controlLevel: "GENERAL" },
  { code: "GAL", nameTh: "กระชายดำ", nameEn: "Black Galingale", controlLevel: "GENERAL" },
  { code: "PLA", nameTh: "ไพล", nameEn: "Plai", controlLevel: "GENERAL" },
  { code: "FAT", nameTh: "ฟ้าทะลายโจร", nameEn: "Andrographis", controlLevel: "GENERAL" },
];

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  { key: "IDENTITY", nameTh: "เอกสารระบุตัวตน", description: "บัตร ปชช., ทะเบียนบ้าน, หนังสือรับรองนิติบุคคล" },
  { key: "LICENSE", nameTh: "ใบอนุญาต", description: "ภ.ท. 11/13/16, ใบรับจดแจ้ง, แบบ ภ.ท. 12" },
  { key: "PROPERTY", nameTh: "เอกสารสถานที่", description: "โฉนด, สัญญาเช่า, แผนที่, แบบแปลน, รูปถ่าย" },
  { key: "COMPLIANCE", nameTh: "เอกสาร SOP/ความปลอดภัย", description: "SOP, แผนความปลอดภัย, CCTV Plan, แผนการผลิต" },
  { key: "FINANCIAL", nameTh: "เอกสารการเงิน", description: "ใบเสร็จ, สัญญาซื้อขาย, บัญชีแหล่งที่มา" },
  { key: "OTHER", nameTh: "เอกสารอื่นๆ", description: "ผลแล็บ, ใบรับรอง GAP/Organic, หนังสือรับรองอบรม" },
];

export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  // ─── IDENTITY ───────────────────────────────────────────
  { id: "ID_CARD", category: "IDENTITY", nameTh: "สำเนาบัตรประชาชน", required: true },
  { id: "HOUSE_REG", category: "IDENTITY", nameTh: "สำเนาทะเบียนบ้าน", required: true },
  { id: "MEDICAL_CERT", category: "IDENTITY", nameTh: "ใบรับรองแพทย์", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "CORP_CERT", category: "IDENTITY", nameTh: "หนังสือรับรองนิติบุคคล (กรณีนิติบุคคล)", required: false },
  { id: "POWER_ATT", category: "IDENTITY", nameTh: "หนังสือมอบอำนาจ (กรณีมอบอำนาจ)", required: false },
  { id: "COVER_LETTER", category: "IDENTITY", nameTh: "หนังสือนำส่ง (Cover Letter)", required: true, forControlLevel: "HIGH_CONTROL", description: "ปะหน้าแฟ้มเอกสาร สรุปใจความสำคัญ" },

  // ─── LICENSE ────────────────────────────────────────────
  { id: "BHT_12", category: "LICENSE", nameTh: "แบบคำขอ ภ.ท. 12", required: true, forControlLevel: "HIGH_CONTROL", description: "แบบคำขอรับใบอนุญาตสมุนไพรควบคุม" },
  { id: "BHT_11", category: "LICENSE", nameTh: "ใบอนุญาต ภ.ท. 11 (ปลูก)", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "BHT_13", category: "LICENSE", nameTh: "ใบอนุญาต ภ.ท. 13 (ส่งออก)", required: false, forControlLevel: "HIGH_CONTROL" },
  { id: "BHT_16", category: "LICENSE", nameTh: "ใบอนุญาต ภ.ท. 16 (นำเข้า)", required: false, forControlLevel: "HIGH_CONTROL" },
  { id: "REG_NOTICE", category: "LICENSE", nameTh: "ใบรับจดแจ้ง", required: false },
  { id: "OLD_CERT", category: "LICENSE", nameTh: "ต้นฉบับใบรับรองเก่า", required: true, forApplicationTypes: ["RENEW"], description: "ใบรับรอง GACP ที่จะต่ออายุ" },
  { id: "POLICE_REPORT", category: "LICENSE", nameTh: "ใบแจ้งความ (กรณีสูญหาย)", required: true, forApplicationTypes: ["AMEND"], description: "ใบแจ้งความกรณีใบรับรองสูญหาย" },
  { id: "DAMAGED_CERT_PHOTO", category: "LICENSE", nameTh: "ภาพถ่ายใบรับรองเดิม (กรณีชำรุด)", required: false, forApplicationTypes: ["AMEND"] },

  // ─── PROPERTY ───────────────────────────────────────────
  { id: "LAND_TITLE", category: "PROPERTY", nameTh: "โฉนดที่ดิน / น.ส.3 / ส.ป.ก.", required: true },
  { id: "LEASE_AGR", category: "PROPERTY", nameTh: "สัญญาเช่า (กรณีเช่าที่ดิน)", required: false },
  { id: "LANDLORD_CONSENT", category: "PROPERTY", nameTh: "หนังสือยินยอมให้ใช้สถานที่", required: true, forControlLevel: "HIGH_CONTROL", description: "ต้องระบุคำว่า 'สมุนไพรควบคุม' ให้ชัดเจน" },
  { id: "FARM_MAP", category: "PROPERTY", nameTh: "แผนที่ตั้ง/แผนผังแปลงเพาะปลูก", required: true },
  { id: "GPS_COORDS", category: "PROPERTY", nameTh: "พิกัด GPS แปลงปลูก (Google Maps)", required: true },
  { id: "BUILDING_PLAN", category: "PROPERTY", nameTh: "แบบแปลนโรงเรือน/อาคาร", required: true, forControlLevel: "HIGH_CONTROL", description: "แบบแปลนอาคารพร้อมผังจุดสำคัญ" },
  { id: "FARM_PHOTOS_EXT", category: "PROPERTY", nameTh: "รูปถ่ายภายนอก (พร้อมคำบรรยาย)", required: true, description: "รูปถ่ายสถานที่ภายนอก 4 ทิศ พร้อมคำบรรยาย" },
  { id: "FARM_PHOTOS_INT", category: "PROPERTY", nameTh: "รูปถ่ายภายใน (พร้อมคำบรรยาย)", required: true, forControlLevel: "HIGH_CONTROL", description: "รูปถ่ายภายในอาคาร/โรงเรือน" },
  { id: "STORAGE_PHOTOS", category: "PROPERTY", nameTh: "รูปถ่ายตู้เก็บของ/คลังสินค้า", required: true, forControlLevel: "HIGH_CONTROL" },

  // ─── COMPLIANCE ─────────────────────────────────────────
  { id: "SOP_DOC", category: "COMPLIANCE", nameTh: "เอกสาร SOP กระบวนการผลิต (ครบ 7 ขั้นตอน)", required: true, description: "ครอบคลุม: เพาะ, เก็บเกี่ยว, ทำแห้ง, ทริม, บรรจุ, จัดเก็บ, กำจัดของเสีย" },
  { id: "PRODUCTION_PLAN", category: "COMPLIANCE", nameTh: "แผนการผลิต (Production Plan)", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "CP_CCP_TABLE", category: "COMPLIANCE", nameTh: "ตารางวิเคราะห์ CP/CCP", required: true, forControlLevel: "HIGH_CONTROL", description: "Critical Control Points Analysis" },
  { id: "SECURITY_PLAN", category: "COMPLIANCE", nameTh: "แผนมาตรการรักษาความปลอดภัย", required: true, forControlLevel: "HIGH_CONTROL", description: "อธิบายการจัดพื้นที่ มาตรการคัดกรอง การควบคุมบัญชี" },
  { id: "CCTV_PLAN", category: "COMPLIANCE", nameTh: "แผนผังตำแหน่งกล้อง CCTV", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "ACCESS_LOG", category: "COMPLIANCE", nameTh: "แบบบันทึกผู้เข้า-ออกพื้นที่", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "PEST_MGMT", category: "COMPLIANCE", nameTh: "แผนการจัดการศัตรูพืช (IPM)", required: true },
  { id: "WATER_MGMT", category: "COMPLIANCE", nameTh: "แผนการจัดการน้ำ", required: true },
  { id: "OPERATION_REPORT", category: "COMPLIANCE", nameTh: "รายงานผลการดำเนินงาน", required: true, forApplicationTypes: ["RENEW"], description: "รายงานผลการดำเนินงานตลอดอายุใบรับรอง" },
  { id: "SOP_UPDATED", category: "COMPLIANCE", nameTh: "SOP ฉบับปรับปรุง (ถ้ามี)", required: false, forApplicationTypes: ["RENEW"] },

  // ─── FINANCIAL ──────────────────────────────────────────
  { id: "SOURCING_RECORD", category: "FINANCIAL", nameTh: "บัญชีรายการแหล่งที่มาสมุนไพร", required: true, forControlLevel: "HIGH_CONTROL", description: "ยืนยันว่าสินค้าถูกกฎหมาย ซื้อจากผู้ได้รับอนุญาต" },
  { id: "SOURCE_LICENSE", category: "FINANCIAL", nameTh: "สำเนาใบอนุญาตผู้ผลิตต้นทาง", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "PURCHASE_AGR", category: "FINANCIAL", nameTh: "สัญญาซื้อขายผลผลิต (ถ้ามี)", required: false },

  // ─── OTHER ──────────────────────────────────────────────
  { id: "SOIL_TEST", category: "OTHER", nameTh: "ผลตรวจวิเคราะห์ดิน/วัสดุปลูก (Soil)", required: true, forPlantCodes: ["CAN", "HMP"], description: "ผลแล็บต้องไม่เกิน 6 เดือน" },
  { id: "WATER_TEST", category: "OTHER", nameTh: "ผลตรวจวิเคราะห์น้ำ (Water)", required: true, forPlantCodes: ["CAN", "HMP"], description: "ผลแล็บต้องไม่เกิน 6 เดือน" },
  { id: "FLOWER_TEST", category: "OTHER", nameTh: "ผลตรวจช่อดอก (Flower Analysis)", required: true, forPlantCodes: ["CAN"], description: "THC/CBD content analysis" },
  { id: "VARIETY_CERT", category: "OTHER", nameTh: "หนังสือรับรองสายพันธุ์", required: true, forPlantCodes: ["KRA"], description: "รับรองสายพันธุ์กระท่อมที่ปลูก" },
  { id: "GACP_TRAINING", category: "OTHER", nameTh: "หนังสือรับรองอบรม GACP", required: true, forControlLevel: "HIGH_CONTROL", description: "ผ่านการอบรมมาตรฐาน GACP" },
  { id: "LAB_RESULTS", category: "OTHER", nameTh: "ผลตรวจห้องปฏิบัติการ (ปัจจุบัน)", required: true, forApplicationTypes: ["RENEW"], description: "ผลตรวจวิเคราะห์ปัจจุบัน สำหรับต่ออายุ" },
  { id: "ARSENIC_TEST", category: "OTHER", nameTh: "ผลวิเคราะห์สารหนู (Arsenic Test)", required: false, forPlantCodes: ["TUR"], description: "สำหรับขมิ้นชันที่มีเหง้า" },
  { id: "GAP_CERT", category: "OTHER", nameTh: "ใบรับรอง GAP (ถ้ามี)", required: false },
  { id: "ORGANIC_CERT", category: "OTHER", nameTh: "ใบรับรอง Organic (ถ้ามี)", required: false },
  { id: "VIDEO_LINK", category: "OTHER", nameTh: "ลิงค์วิดีโอสถานที่ (ถ้ามี)", required: false, forControlLevel: "HIGH_CONTROL" },
];

/** Get documents relevant to a specific plant and application type */
export function getRelevantDocuments(plantCode: string, applicationType: ApplicationType): RequiredDocument[] {
  const plant = PLANT_TYPES.find(p => p.code === plantCode);
  if (!plant) return [];

  return REQUIRED_DOCUMENTS.filter(doc => {
    // Filter by control level
    if (doc.forControlLevel && doc.forControlLevel !== plant.controlLevel) return false;
    // Filter by specific plant codes
    if (doc.forPlantCodes && !doc.forPlantCodes.includes(plantCode)) return false;
    // Filter by application type
    if (doc.forApplicationTypes && !doc.forApplicationTypes.includes(applicationType)) return false;
    // Exclude RENEW/AMEND-only docs for NEW applications
    if (!doc.forApplicationTypes) return true;
    return true;
  });
}

export const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร",
  "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท",
  "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง",
  "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม",
  "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส",
  "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์",
  "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พังงา", "พัทลุง",
  "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่",
  "พะเยา", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน",
  "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง",
  "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย",
  "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
  "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี",
  "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย",
  "หนองบัวลำภู", "อ่างทอง", "อุดรธานี", "อุทัยธานี", "อุตรดิตถ์",
  "อุบลราชธานี", "อำนาจเจริญ",
];

export const STATUS_CONFIG: Record<ApplicationStatus, {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  userAction?: string;
}> = {
  DRAFT: { label: "ร่าง", color: "text-muted-foreground", bgColor: "bg-muted", description: "กำลังกรอกข้อมูล" },
  REGISTERED: { label: "ลงทะเบียนแล้ว", color: "text-info", bgColor: "bg-info/10", description: "สมัครสมาชิกและพร้อมยื่นคำขอ" },
  SUBMITTED: { label: "ยื่นแล้ว", color: "text-info", bgColor: "bg-info/10", description: "ส่งคำขอเรียบร้อย รอชำระค่าตรวจเอกสาร", userAction: "ชำระค่าตรวจเอกสาร ฿5,000" },
  PENDING_DOC_FEE: { label: "รอชำระค่าตรวจเอกสาร", color: "text-warning", bgColor: "bg-warning/10", description: "รอยืนยันการชำระเงิน ฿5,000", userAction: "ชำระเงิน" },
  DOC_FEE_PAID: { label: "ชำระค่าตรวจเอกสารแล้ว", color: "text-success", bgColor: "bg-success/10", description: "รอ Coordinator มอบหมาย Auditor" },
  ASSIGNED_FOR_REVIEW: { label: "กำลังตรวจเอกสาร", color: "text-info", bgColor: "bg-info/10", description: "Auditor กำลังตรวจสอบเอกสาร (ฟอร์มถูกล็อก)" },
  REVISION_REQUESTED: { label: "ส่งกลับแก้ไข", color: "text-destructive", bgColor: "bg-destructive/10", description: "Auditor ส่งกลับให้แก้ไข พร้อม comment", userAction: "แก้ไขและส่งกลับ" },
  DOC_APPROVED: { label: "เอกสารผ่าน", color: "text-success", bgColor: "bg-success/10", description: "เอกสารผ่านการตรวจ รอชำระค่าประเมินหน้างาน", userAction: "ชำระค่าประเมินหน้างาน ฿25,000" },
  PENDING_AUDIT_FEE: { label: "รอชำระค่าประเมิน", color: "text-warning", bgColor: "bg-warning/10", description: "รอยืนยันการชำระเงิน ฿25,000", userAction: "ชำระเงิน" },
  AUDIT_FEE_PAID: { label: "ชำระค่าประเมินแล้ว", color: "text-success", bgColor: "bg-success/10", description: "รอ Coordinator นัดหมายลงพื้นที่" },
  AUDIT_CONFIRMED: { label: "นัดหมายแล้ว", color: "text-info", bgColor: "bg-info/10", description: "นัดหมายลงพื้นที่เรียบร้อย รอ Auditor ลงพื้นที่" },
  AUDIT_PASSED: { label: "ผ่านประเมินหน้างาน", color: "text-success", bgColor: "bg-success/10", description: "ผ่านการประเมิน รอ Head Auditor อนุมัติขั้นสุดท้าย" },
  CAR_PENDING: { label: "พบข้อบกพร่อง (CAR)", color: "text-destructive", bgColor: "bg-destructive/10", description: "Auditor พบข้อบกพร่องจากการตรวจหน้างาน", userAction: "อัปโหลดหลักฐานแก้ไข" },
  CAR_REVIEWING: { label: "กำลังตรวจ CAR", color: "text-info", bgColor: "bg-info/10", description: "Auditor กำลังตรวจหลักฐานแก้ไข" },
  APPROVED: { label: "อนุมัติแล้ว", color: "text-success", bgColor: "bg-success/10", description: "Head Auditor อนุมัติ กำลังออกใบรับรอง (PDF+QR)" },
  CERTIFIED: { label: "ได้รับใบรับรอง", color: "text-success", bgColor: "bg-success/10", description: "ได้รับใบรับรอง GACP แล้ว", userAction: "ดาวน์โหลดใบรับรอง" },
  REJECTED: { label: "ไม่ผ่าน", color: "text-destructive", bgColor: "bg-destructive/10", description: "คำขอไม่ผ่านเกณฑ์" },
};

export const DOC_FEE = 5000;
export const AUDIT_FEE = 25000;

/** SOP 7 ขั้นตอนหลักที่ต้องครอบคลุม */
export const SOP_STEPS = [
  { key: "cultivation", label: "การเพาะปลูก", icon: "🌱" },
  { key: "harvesting", label: "การเก็บเกี่ยว", icon: "🌾" },
  { key: "drying", label: "การทำแห้ง", icon: "☀️" },
  { key: "trimming", label: "การทริม/ตัดแต่ง", icon: "✂️" },
  { key: "packaging", label: "การบรรจุ", icon: "📦" },
  { key: "storage", label: "การจัดเก็บ", icon: "🏪" },
  { key: "wasteDisposal", label: "การกำจัดของเสีย", icon: "♻️" },
] as const;

/** Pre-submission checklist based on repo research */
export const PRE_SUBMIT_CHECKLIST = [
  "ชื่อ-นามสกุล ตรงกันทุกเอกสาร (รวมถึงจุดและวรรค)",
  "ที่อยู่ตรงกันทุกฉบับ",
  "ลายเซ็นครบทุกจุด",
  "รูปถ่ายมีคำบรรยายใต้ภาพ",
  "หนังสือยินยอมระบุ 'สมุนไพรควบคุม' ชัดเจน (กรณี HIGH_CONTROL)",
  "ผลแล็บยังไม่หมดอายุ (ไม่เกิน 6 เดือน)",
  "SOP ครอบคลุมทั้ง 7 ขั้นตอนหลัก",
];
