import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, FileText, User, MapPin, Leaf, Calendar, Phone, Mail,
  CheckCircle, Clock, AlertCircle, Download, MessageSquare, Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ProviderLayout from "@/components/ProviderLayout";

const mockDetail = {
  id: "1",
  appNumber: "APP-2026-001",
  applicant: "นายสมชาย ใจดี",
  idCard: "1-1234-56789-01-2",
  phone: "081-234-5678",
  email: "somchai@email.com",
  herb: "กัญชง (Hemp)",
  farmName: "สวนสมุนไพรเชียงใหม่",
  province: "เชียงใหม่",
  area: "5.5 ไร่",
  address: "123 หมู่ 4 ต.แม่ริม อ.แม่ริม จ.เชียงใหม่ 50180",
  type: "รายบุคคล",
  status: "pending_review",
  submittedDate: "28 ก.พ. 2569",
  documents: [
    { name: "สำเนาบัตรประชาชน", uploaded: true },
    { name: "สำเนาทะเบียนบ้าน", uploaded: true },
    { name: "แผนผังแปลงเพาะปลูก", uploaded: true },
    { name: "ใบอนุญาตปลูก", uploaded: false },
  ],
  timeline: [
    { date: "28 ก.พ. 69", event: "ยื่นคำขอ", actor: "นายสมชาย ใจดี", icon: FileText },
    { date: "28 ก.พ. 69", event: "ระบบรับคำขอ", actor: "ระบบอัตโนมัติ", icon: CheckCircle },
    { date: "1 มี.ค. 69", event: "รอตรวจเอกสาร", actor: "อยู่ในคิว", icon: Clock },
  ],
};

export default function ProviderApplicationDetailPage() {
  const { id } = useParams();

  return (
    <ProviderLayout title={`คำขอ ${mockDetail.appNumber}`}>
      <div className="space-y-6">
        {/* Back */}
        <Link to="/provider/applications" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> กลับไปรายการคำขอ
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-foreground">{mockDetail.appNumber}</h2>
              <Badge variant="outline" className="bg-warning/15 text-warning border-warning/30 text-[10px]">รอตรวจเอกสาร</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{mockDetail.applicant} · {mockDetail.type}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <MessageSquare className="mr-1 h-3.5 w-3.5" /> ส่งกลับแก้ไข
            </Button>
            <Button size="sm" className="text-xs">
              <CheckCircle className="mr-1 h-3.5 w-3.5" /> อนุมัติ
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Applicant Info */}
            <Section title="ข้อมูลผู้ยื่นคำขอ" icon={User}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem icon={User} label="ชื่อ-นามสกุล" value={mockDetail.applicant} />
                <InfoItem icon={FileText} label="เลขบัตรประชาชน" value={mockDetail.idCard} />
                <InfoItem icon={Phone} label="เบอร์โทร" value={mockDetail.phone} />
                <InfoItem icon={Mail} label="อีเมล" value={mockDetail.email} />
              </div>
            </Section>

            {/* Farm Info */}
            <Section title="ข้อมูลแปลงเพาะปลูก" icon={Sprout}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem icon={Leaf} label="ชนิดสมุนไพร" value={mockDetail.herb} />
                <InfoItem icon={MapPin} label="ชื่อแปลง" value={mockDetail.farmName} />
                <InfoItem icon={MapPin} label="จังหวัด" value={mockDetail.province} />
                <InfoItem icon={Sprout} label="พื้นที่" value={mockDetail.area} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{mockDetail.address}</p>
            </Section>

            {/* Documents */}
            <Section title="เอกสารแนบ" icon={FileText}>
              <div className="space-y-2">
                {mockDetail.documents.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between rounded-lg border border-border p-2.5">
                    <div className="flex items-center gap-2">
                      {doc.uploaded ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs font-medium">{doc.name}</span>
                    </div>
                    {doc.uploaded && (
                      <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                        <Download className="mr-1 h-3 w-3" /> ดาวน์โหลด
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Reviewer Note */}
            <Section title="หมายเหตุเจ้าหน้าที่" icon={MessageSquare}>
              <Textarea placeholder="เพิ่มหมายเหตุสำหรับคำขอนี้..." rows={3} className="text-xs" />
              <Button size="sm" className="mt-2 text-xs">บันทึกหมายเหตุ</Button>
            </Section>
          </div>

          {/* Right: Timeline */}
          <div>
            <div className="rounded-xl border border-border bg-card p-4 card-shadow sticky top-20">
              <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> ไทม์ไลน์
              </h4>
              <div className="space-y-4">
                {mockDetail.timeline.map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                        <event.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {i < mockDetail.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs font-semibold text-card-foreground">{event.event}</p>
                      <p className="text-[10px] text-muted-foreground">{event.actor}</p>
                      <p className="text-[10px] text-muted-foreground/60">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 card-shadow">
      <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-primary" /> {title}
      </h4>
      {children}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-xs font-medium text-card-foreground">{value}</p>
      </div>
    </div>
  );
}
