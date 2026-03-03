import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, FileText, CheckCircle, Clock, MapPin,
  Leaf,
} from "lucide-react";
import ProviderLayout from "@/components/ProviderLayout";

const monthlyData = [
  { month: "ต.ค.", applications: 12, approved: 8 },
  { month: "พ.ย.", applications: 18, approved: 14 },
  { month: "ธ.ค.", applications: 15, approved: 11 },
  { month: "ม.ค.", applications: 22, approved: 16 },
  { month: "ก.พ.", applications: 28, approved: 20 },
  { month: "มี.ค.", applications: 8, approved: 3 },
];

const topHerbs = [
  { name: "กัญชง", count: 35, percentage: 33 },
  { name: "ฟ้าทะลายโจร", count: 25, percentage: 24 },
  { name: "ขมิ้นชัน", count: 18, percentage: 17 },
  { name: "กระชายขาว", count: 15, percentage: 14 },
  { name: "อื่นๆ", count: 12, percentage: 12 },
];

const topProvinces = [
  { name: "เชียงใหม่", count: 22 },
  { name: "เชียงราย", count: 15 },
  { name: "ขอนแก่น", count: 12 },
  { name: "นครราชสีมา", count: 10 },
  { name: "สุราษฎร์ธานี", count: 8 },
];

const maxBar = Math.max(...monthlyData.map((d) => d.applications));

export default function ProviderAnalyticsPage() {
  return (
    <ProviderLayout title="วิเคราะห์ข้อมูล">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard icon={FileText} label="คำขอทั้งหมด" value="103" change="+12%" positive />
          <KpiCard icon={CheckCircle} label="อนุมัติแล้ว" value="72" change="+8%" positive />
          <KpiCard icon={Users} label="เกษตรกรลงทะเบียน" value="89" change="+15%" positive />
          <KpiCard icon={Clock} label="เวลาเฉลี่ยอนุมัติ" value="14 วัน" change="-2 วัน" positive />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Chart */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-4 card-shadow"
          >
            <h3 className="text-xs font-bold text-foreground mb-4 flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-primary" /> คำขอรายเดือน
            </h3>
            <div className="space-y-2">
              {monthlyData.map((d, i) => (
                <div key={d.month} className="flex items-center gap-3">
                  <span className="w-8 text-[10px] font-medium text-muted-foreground">{d.month}</span>
                  <div className="flex-1 flex gap-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(d.applications / maxBar) * 100}%` }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="h-5 rounded bg-primary/20 flex items-center justify-end pr-1"
                    >
                      <span className="text-[9px] font-bold text-primary">{d.applications}</span>
                    </motion.div>
                  </div>
                  <div className="flex-1 flex gap-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(d.approved / maxBar) * 100}%` }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                      className="h-5 rounded bg-success/20 flex items-center justify-end pr-1"
                    >
                      <span className="text-[9px] font-bold text-success">{d.approved}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-primary/30" />ยื่นคำขอ</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-success/30" />อนุมัติ</span>
            </div>
          </motion.div>

          {/* Top Herbs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-4 card-shadow"
          >
            <h3 className="text-xs font-bold text-foreground mb-4 flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-primary" /> สมุนไพรยอดนิยม
            </h3>
            <div className="space-y-3">
              {topHerbs.map((herb, i) => (
                <div key={herb.name} className="flex items-center gap-3">
                  <span className="w-24 text-xs font-medium text-card-foreground">{herb.name}</span>
                  <div className="flex-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${herb.percentage}%` }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="h-4 rounded bg-primary/15"
                    />
                  </div>
                  <span className="w-12 text-right text-[10px] font-bold text-muted-foreground">{herb.count} ({herb.percentage}%)</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Provinces */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-4 card-shadow"
          >
            <h3 className="text-xs font-bold text-foreground mb-4 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> จังหวัดที่ยื่นคำขอมากที่สุด
            </h3>
            <div className="space-y-2">
              {topProvinces.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-card-foreground">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{p.count} คำขอ</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Approval Rate */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-4 card-shadow flex flex-col items-center justify-center"
          >
            <h3 className="text-xs font-bold text-foreground mb-4">อัตราการอนุมัติ</h3>
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${70 * 2.51} ${100 * 2.51}`}
                  initial={{ strokeDashoffset: 251 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">70%</span>
                <span className="text-[10px] text-muted-foreground">อนุมัติ</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-bold text-success">72</p>
                <p className="text-[10px] text-muted-foreground">อนุมัติ</p>
              </div>
              <div>
                <p className="text-sm font-bold text-warning">23</p>
                <p className="text-[10px] text-muted-foreground">รอดำเนินการ</p>
              </div>
              <div>
                <p className="text-sm font-bold text-destructive">8</p>
                <p className="text-[10px] text-muted-foreground">ไม่อนุมัติ</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProviderLayout>
  );
}

function KpiCard({ icon: Icon, label, value, change, positive }: {
  icon: React.ElementType; label: string; value: string; change: string; positive: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 card-shadow">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">{label}</p>
          <div className="flex items-center gap-1.5">
            <p className="text-lg font-bold text-foreground">{value}</p>
            <span className={`text-[9px] font-medium ${positive ? "text-success" : "text-destructive"}`}>
              {change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
