import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Plus, CheckCircle, Clock, Download, Eye, Trash2,
  ClipboardList, Leaf, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SOP_STEPS } from "@/constants/gacp";
import { useToast } from "@/hooks/use-toast";

interface SOPDocument {
  id: string;
  plantName: string;
  farmName: string;
  progress: number;
  steps: { key: string; completed: boolean; lastUpdated?: string }[];
  status: "draft" | "complete" | "submitted";
  createdAt: string;
}

const mockSOPs: SOPDocument[] = [
  {
    id: "SOP-001",
    plantName: "กัญชง",
    farmName: "สวนสมุนไพรเชียงใหม่",
    progress: 85,
    steps: SOP_STEPS.map((s, i) => ({
      key: s.key,
      completed: i < 6,
      lastUpdated: i < 6 ? "3 มี.ค. 2569" : undefined,
    })),
    status: "draft",
    createdAt: "1 มี.ค. 2569",
  },
  {
    id: "SOP-002",
    plantName: "ฟ้าทะลายโจร",
    farmName: "สวนสมุนไพรเชียงใหม่",
    progress: 100,
    steps: SOP_STEPS.map((s) => ({
      key: s.key,
      completed: true,
      lastUpdated: "28 ก.พ. 2569",
    })),
    status: "submitted",
    createdAt: "25 ก.พ. 2569",
  },
];

export default function SOPBuilderPage() {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>("SOP-001");

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground md:text-xl">SOP Builder</h2>
          <p className="text-sm text-muted-foreground">
            สร้างและจัดการเอกสาร SOP กระบวนการผลิต 7 ขั้นตอน
          </p>
        </div>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">สร้าง SOP ใหม่</span>
        </Button>
      </div>

      {/* SOP Requirement Info */}
      <div className="rounded-xl border border-info/20 bg-info/5 p-4">
        <div className="flex gap-2">
          <ClipboardList className="h-5 w-5 shrink-0 text-info mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-info">SOP 7 ขั้นตอนหลัก (บังคับ)</p>
            <p className="text-[11px] text-info/80 mt-1">
              GACP กำหนดให้ต้องจัดทำ SOP ครอบคลุมทุกขั้นตอนการผลิต ตั้งแต่การเพาะปลูกจนถึงการกำจัดของเสีย
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SOP_STEPS.map((step) => (
                <span key={step.key} className="rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
                  {step.icon} {step.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SOP List */}
      <div className="space-y-3">
        {mockSOPs.map((sop, i) => {
          const isExpanded = expandedId === sop.id;
          const completedSteps = sop.steps.filter((s) => s.completed).length;
          return (
            <motion.div
              key={sop.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card card-shadow overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : sop.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      sop.status === "submitted" ? "bg-success/10" : "bg-primary/10"
                    }`}>
                      <FileText className={`h-5 w-5 ${sop.status === "submitted" ? "text-success" : "text-primary"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{sop.plantName}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          sop.status === "submitted"
                            ? "bg-success/10 text-success"
                            : sop.status === "complete"
                            ? "bg-info/10 text-info"
                            : "bg-warning/10 text-warning"
                        }`}>
                          {sop.status === "submitted" ? "ยื่นแล้ว" : sop.status === "complete" ? "พร้อมยื่น" : "ร่าง"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Leaf className="h-3 w-3" />
                        {sop.farmName} • {sop.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-muted-foreground">{completedSteps}/{SOP_STEPS.length}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={sop.progress} className="h-1.5" />
                </div>
              </button>

              {/* Expanded Steps */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t border-border px-4 pb-4"
                >
                  <div className="mt-3 space-y-1.5">
                    {sop.steps.map((step) => {
                      const sopStep = SOP_STEPS.find((s) => s.key === step.key);
                      if (!sopStep) return null;
                      return (
                        <div
                          key={step.key}
                          className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                            step.completed
                              ? "border-success/20 bg-success/5"
                              : "border-dashed border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {step.completed ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm">
                              {sopStep.icon} {sopStep.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {step.lastUpdated && (
                              <span className="text-[10px] text-muted-foreground">{step.lastUpdated}</span>
                            )}
                            <Button variant={step.completed ? "ghost" : "outline"} size="sm" className="text-xs h-7">
                              {step.completed ? <Eye className="h-3 w-3" /> : "แก้ไข"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    {sop.status !== "submitted" && (
                      <Button size="sm" className="text-xs flex-1" disabled={sop.progress < 100}>
                        <Download className="mr-1 h-3 w-3" />
                        ดาวน์โหลด PDF
                      </Button>
                    )}
                    {sop.status === "submitted" && (
                      <Button variant="outline" size="sm" className="text-xs flex-1">
                        <Download className="mr-1 h-3 w-3" />
                        ดาวน์โหลด SOP
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
