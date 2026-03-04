import type { PlantType, DocumentCategory, RequiredDocument, ApplicationStatus } from "@/types/application";

export const PLANT_TYPES: PlantType[] = [
  { code: "CAN", nameTh: "กัญชา", nameEn: "Cannabis", controlLevel: "HIGH_CONTROL" },
  { code: "KRA", nameTh: "กระท่อม", nameEn: "Kratom", controlLevel: "HIGH_CONTROL" },
  { code: "TUR", nameTh: "ขมิ้นชัน", nameEn: "Turmeric", controlLevel: "GENERAL" },
  { code: "GIN", nameTh: "ขิง", nameEn: "Ginger", controlLevel: "GENERAL" },
  { code: "GAL", nameTh: "กระชายดำ", nameEn: "Black Galingale", controlLevel: "GENERAL" },
  { code: "PLA", nameTh: "ไพล", nameEn: "Plai", controlLevel: "GENERAL" },
  { code: "HMP", nameTh: "กัญชง", nameEn: "Hemp", controlLevel: "HIGH_CONTROL" },
  { code: "FAT", nameTh: "ฟ้าทะลายโจร", nameEn: "Andrographis", controlLevel: "GENERAL" },
];

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  { key: "IDENTITY", nameTh: "เอกสารระบุตัวตน", description: "บัตร ปชช., ทะเบียนบ้าน, หนังสือรับรองนิติบุคคล" },
  { key: "LICENSE", nameTh: "ใบอนุญาต", description: "ภ.ท. 11/13/16, ใบรับจดแจ้ง" },
  { key: "PROPERTY", nameTh: "เอกสารสถานที่", description: "โฉนด, สัญญาเช่า, แผนที่, รูปถ่าย" },
  { key: "COMPLIANCE", nameTh: "เอกสาร SOP/ความปลอดภัย", description: "มาตรการรักษาความปลอดภัย, SOP, CCTV Plan" },
  { key: "FINANCIAL", nameTh: "เอกสารการเงิน", description: "ใบเสร็จ, สัญญาซื้อขาย" },
  { key: "OTHER", nameTh: "เอกสารอื่นๆ", description: "ผลแล็บ, ใบรับรอง GAP/Organic" },
];

export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  // IDENTITY - All
  { id: "ID_CARD", category: "IDENTITY", nameTh: "สำเนาบัตรประชาชน", required: true },
  { id: "HOUSE_REG", category: "IDENTITY", nameTh: "สำเนาทะเบียนบ้าน", required: true },
  { id: "CORP_CERT", category: "IDENTITY", nameTh: "หนังสือรับรองนิติบุคคล (กรณีนิติบุคคล)", required: false },
  { id: "POWER_ATT", category: "IDENTITY", nameTh: "หนังสือมอบอำนาจ (กรณีมอบอำนาจ)", required: false },

  // LICENSE - HIGH_CONTROL only
  { id: "BHT_11", category: "LICENSE", nameTh: "ใบอนุญาต ภ.ท. 11 (ปลูก)", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "BHT_13", category: "LICENSE", nameTh: "ใบอนุญาต ภ.ท. 13 (ส่งออก)", required: false, forControlLevel: "HIGH_CONTROL" },
  { id: "BHT_16", category: "LICENSE", nameTh: "ใบอนุญาต ภ.ท. 16 (นำเข้า)", required: false, forControlLevel: "HIGH_CONTROL" },
  { id: "REG_NOTICE", category: "LICENSE", nameTh: "ใบรับจดแจ้ง", required: false },

  // PROPERTY - All
  { id: "LAND_TITLE", category: "PROPERTY", nameTh: "โฉนดที่ดิน / น.ส.3 / ส.ป.ก.", required: true },
  { id: "LEASE_AGR", category: "PROPERTY", nameTh: "สัญญาเช่า (กรณีเช่าที่ดิน)", required: false },
  { id: "FARM_MAP", category: "PROPERTY", nameTh: "แผนผังแปลงเพาะปลูก", required: true },
  { id: "FARM_PHOTOS", category: "PROPERTY", nameTh: "รูปถ่ายแปลง (อย่างน้อย 4 ทิศ)", required: true },
  { id: "GPS_COORDS", category: "PROPERTY", nameTh: "พิกัด GPS แปลงปลูก", required: true },

  // COMPLIANCE
  { id: "SOP_DOC", category: "COMPLIANCE", nameTh: "เอกสาร SOP กระบวนการผลิต", required: true },
  { id: "SECURITY_PLAN", category: "COMPLIANCE", nameTh: "แผนรักษาความปลอดภัยสถานที่", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "CCTV_PLAN", category: "COMPLIANCE", nameTh: "แผนผังตำแหน่งกล้อง CCTV", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "ACCESS_LOG", category: "COMPLIANCE", nameTh: "แบบบันทึกผู้เข้า-ออกพื้นที่", required: true, forControlLevel: "HIGH_CONTROL" },
  { id: "PEST_MGMT", category: "COMPLIANCE", nameTh: "แผนการจัดการศัตรูพืช", required: true },
  { id: "WATER_MGMT", category: "COMPLIANCE", nameTh: "แผนการจัดการน้ำ", required: true },
  { id: "SOIL_TEST", category: "COMPLIANCE", nameTh: "ผลตรวจวิเคราะห์ดิน", required: false },
  { id: "WATER_TEST", category: "COMPLIANCE", nameTh: "ผลตรวจวิเคราะห์น้ำ", required: false },

  // FINANCIAL
  { id: "PURCHASE_AGR", category: "COMPLIANCE", nameTh: "สัญญาซื้อขายผลผลิต (ถ้ามี)", required: false },

  // OTHER
  { id: "GAP_CERT", category: "OTHER", nameTh: "ใบรับรอง GAP (ถ้ามี)", required: false },
  { id: "ORGANIC_CERT", category: "OTHER", nameTh: "ใบรับรอง Organic (ถ้ามี)", required: false },
  { id: "LAB_RESULTS", category: "OTHER", nameTh: "ผลตรวจห้องปฏิบัติการ (ถ้ามี)", required: false },
];

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
  SUBMITTED: { label: "ยื่นแล้ว", color: "text-info", bgColor: "bg-info/10", description: "ส่งคำขอเรียบร้อย รอชำระค่าตรวจเอกสาร", userAction: "ชำระค่าตรวจเอกสาร ฿5,000" },
  PENDING_DOC_FEE: { label: "รอชำระค่าตรวจเอกสาร", color: "text-warning", bgColor: "bg-warning/10", description: "รอยืนยันการชำระเงิน ฿5,000", userAction: "ชำระเงิน" },
  DOC_FEE_PAID: { label: "ชำระค่าตรวจเอกสารแล้ว", color: "text-success", bgColor: "bg-success/10", description: "รอมอบหมายเจ้าหน้าที่ตรวจ" },
  ASSIGNED_FOR_REVIEW: { label: "กำลังตรวจเอกสาร", color: "text-info", bgColor: "bg-info/10", description: "เจ้าหน้าที่กำลังตรวจสอบเอกสาร (ฟอร์มถูกล็อก)" },
  REVISION_REQUESTED: { label: "ส่งกลับแก้ไข", color: "text-destructive", bgColor: "bg-destructive/10", description: "เจ้าหน้าที่ส่งกลับให้แก้ไข", userAction: "แก้ไขและส่งกลับ" },
  DOC_APPROVED: { label: "เอกสารผ่าน", color: "text-success", bgColor: "bg-success/10", description: "เอกสารผ่านการตรวจ รอชำระค่าประเมินหน้างาน", userAction: "ชำระค่าประเมินหน้างาน ฿25,000" },
  PENDING_AUDIT_FEE: { label: "รอชำระค่าประเมิน", color: "text-warning", bgColor: "bg-warning/10", description: "รอยืนยันการชำระเงิน ฿25,000", userAction: "ชำระเงิน" },
  AUDIT_FEE_PAID: { label: "ชำระค่าประเมินแล้ว", color: "text-success", bgColor: "bg-success/10", description: "รอนัดหมายลงพื้นที่" },
  AUDIT_CONFIRMED: { label: "นัดหมายแล้ว", color: "text-info", bgColor: "bg-info/10", description: "นัดหมายลงพื้นที่เรียบร้อย" },
  AUDIT_PASSED: { label: "ผ่านประเมินหน้างาน", color: "text-success", bgColor: "bg-success/10", description: "ผ่านการประเมินหน้างาน รออนุมัติขั้นสุดท้าย" },
  CAR_PENDING: { label: "พบข้อบกพร่อง (CAR)", color: "text-destructive", bgColor: "bg-destructive/10", description: "พบข้อบกพร่องจากการตรวจหน้างาน", userAction: "อัปโหลดหลักฐานแก้ไข" },
  CAR_REVIEWING: { label: "กำลังตรวจ CAR", color: "text-info", bgColor: "bg-info/10", description: "เจ้าหน้าที่กำลังตรวจหลักฐานแก้ไข" },
  APPROVED: { label: "อนุมัติแล้ว", color: "text-success", bgColor: "bg-success/10", description: "ผ่านการอนุมัติ กำลังออกใบรับรอง" },
  CERTIFIED: { label: "ได้รับใบรับรอง", color: "text-success", bgColor: "bg-success/10", description: "ได้รับใบรับรอง GACP แล้ว", userAction: "ดาวน์โหลดใบรับรอง" },
  REJECTED: { label: "ไม่ผ่าน", color: "text-destructive", bgColor: "bg-destructive/10", description: "คำขอไม่ผ่านเกณฑ์" },
};

export const DOC_FEE = 5000;
export const AUDIT_FEE = 25000;
