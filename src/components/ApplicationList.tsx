import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface Application {
  id: string;
  title: string;
  submittedDate: string;
  status: "draft" | "pending" | "reviewing" | "approved" | "rejected";
  type: string;
}

const statusConfig = {
  draft: { label: "ร่าง", icon: FileText, className: "bg-muted text-muted-foreground" },
  pending: { label: "รอตรวจสอบ", icon: Clock, className: "bg-warning/15 text-warning border-warning/30" },
  reviewing: { label: "กำลังตรวจสอบ", icon: AlertCircle, className: "bg-info/15 text-info border-info/30" },
  approved: { label: "อนุมัติแล้ว", icon: CheckCircle, className: "bg-success/15 text-success border-success/30" },
  rejected: { label: "ไม่อนุมัติ", icon: AlertCircle, className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function ApplicationList({ applications }: { applications: Application[] }) {
  return (
    <div className="space-y-2">
      {applications.map((app, i) => {
        const config = statusConfig[app.status];
        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/application/${app.id}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50 md:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-card-foreground">{app.title}</p>
                <p className="text-xs text-muted-foreground">
                  {app.type} · ยื่นเมื่อ {app.submittedDate}
                </p>
              </div>
              <Badge variant="outline" className={`shrink-0 text-[10px] ${config.className}`}>
                {config.label}
              </Badge>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
