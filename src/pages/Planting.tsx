import { motion } from "framer-motion";
import { Sprout, Plus, Calendar, MapPin, Droplets, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plantingCycles = [
  {
    id: "1",
    herb: "กัญชง (Hemp)",
    plot: "แปลง A1 - สวนสมุนไพรเชียงใหม่",
    planted: "15 ม.ค. 2569",
    estimated: "15 เม.ย. 2569",
    status: "growing" as const,
    progress: 65,
  },
  {
    id: "2",
    herb: "ฟ้าทะลายโจร",
    plot: "แปลง B2 - ไร่สุขใจ",
    planted: "1 ก.พ. 2569",
    estimated: "1 พ.ค. 2569",
    status: "growing" as const,
    progress: 40,
  },
  {
    id: "3",
    herb: "กระชายขาว",
    plot: "แปลง C1 - สวนรวมพืช",
    planted: "1 ต.ค. 2568",
    estimated: "1 ม.ค. 2569",
    status: "harvested" as const,
    progress: 100,
  },
];

const statusConfig = {
  growing: { label: "กำลังเพาะปลูก", className: "bg-success/15 text-success border-success/30" },
  harvested: { label: "เก็บเกี่ยวแล้ว", className: "bg-info/15 text-info border-info/30" },
};

export default function PlantingPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground md:text-xl">ข้อมูลการเพาะปลูก</h2>
          <p className="text-sm text-muted-foreground">จัดการรอบปลูกและบันทึกข้อมูล</p>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">เพิ่มรอบปลูก</span>
          <span className="sm:hidden">เพิ่ม</span>
        </Button>
      </div>

      <div className="space-y-3">
        {plantingCycles.map((cycle, i) => (
          <motion.div
            key={cycle.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-4 card-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Sprout className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{cycle.herb}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {cycle.plot}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={`text-[10px] ${statusConfig[cycle.status].className}`}>
                {statusConfig[cycle.status].label}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>ความคืบหน้า</span>
                <span>{cycle.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${cycle.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>ปลูก: {cycle.planted}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Sun className="h-3 w-3" />
                <span>เก็บเกี่ยว: {cycle.estimated}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
