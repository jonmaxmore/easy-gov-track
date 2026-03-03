import StatusCard from "@/components/StatusCard";
import ApplicationList, { Application } from "@/components/ApplicationList";
import { FileText, Clock, CheckCircle, AlertTriangle, Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const mockApplications: Application[] = [
  {
    id: "GACP-2026-00123",
    title: "ขอรับรองมาตรฐาน GACP - กัญชง",
    submittedDate: "28 ก.พ. 2569",
    status: "approved",
    type: "รายบุคคล",
  },
  {
    id: "GACP-2026-00456",
    title: "ขอรับรองมาตรฐาน GACP - ฟ้าทะลายโจร",
    submittedDate: "1 มี.ค. 2569",
    status: "pending",
    type: "รายบุคคล",
  },
  {
    id: "GACP-2026-00789",
    title: "ต่ออายุใบรับรอง - กระชายขาว",
    submittedDate: "2 มี.ค. 2569",
    status: "reviewing",
    type: "วิสาหกิจ",
  },
  {
    id: "GACP-2026-00101",
    title: "ขอรับรองมาตรฐาน GACP - ขมิ้นชัน",
    submittedDate: "-",
    status: "draft",
    type: "รายบุคคล",
  },
];

const Index = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground md:text-xl">สวัสดีครับ, สมชาย</h2>
          <p className="text-sm text-muted-foreground">ยินดีต้อนรับสู่ระบบรับรองมาตรฐาน GACP</p>
        </div>
        <Link to="/submit">
          <Button size="sm" className="hidden sm:flex">
            <FileText className="mr-1 h-4 w-4" />
            ยื่นคำขอใหม่
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatusCard icon={FileText} label="คำขอทั้งหมด" value={4} variant="primary" />
        <StatusCard icon={Clock} label="รอตรวจสอบ" value={1} variant="warning" />
        <StatusCard icon={CheckCircle} label="อนุมัติแล้ว" value={1} variant="success" />
        <StatusCard icon={AlertTriangle} label="ร่าง" value={1} />
      </div>

      {/* Quick Action - mobile */}
      <Link to="/submit" className="sm:hidden">
        <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/15 p-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">ยื่นคำขอรับรองใหม่</span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </Link>

      {/* Applications */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">คำขอล่าสุด</h3>
        <ApplicationList applications={mockApplications} />
      </div>
    </div>
  );
};

export default Index;
