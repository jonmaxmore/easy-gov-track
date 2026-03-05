import { useState } from "react";
import { FileText, Upload, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRelevantDocuments, DOCUMENT_CATEGORIES, PLANT_TYPES } from "@/constants/gacp";
import type { UploadedDocument, ApplicationType } from "@/types/application";
import { useToast } from "@/hooks/use-toast";

interface Props {
  documents: UploadedDocument[];
  onChange: (docs: UploadedDocument[]) => void;
  selectedPlant: string;
  applicationType: ApplicationType;
}

export default function StepDocuments({ documents, onChange, selectedPlant, applicationType }: Props) {
  const { toast } = useToast();

  const relevantDocs = getRelevantDocuments(selectedPlant, applicationType);
  const uploadedIds = documents.map((d) => d.docId);

  const handleUpload = (docId: string, docName: string) => {
    const newDoc: UploadedDocument = {
      docId,
      fileName: `${docName}.pdf`,
      fileSize: Math.floor(Math.random() * 5000) + 500,
      uploadedAt: new Date().toISOString(),
      status: "pending",
    };
    onChange([...documents, newDoc]);
    toast({
      title: "อัปโหลดสำเร็จ",
      description: `${docName} ถูกอัปโหลดเรียบร้อย`,
    });
  };

  const requiredCount = relevantDocs.filter((d) => d.required).length;
  const uploadedRequiredCount = relevantDocs.filter(
    (d) => d.required && uploadedIds.includes(d.id)
  ).length;
  const totalUploaded = relevantDocs.filter(d => uploadedIds.includes(d.id)).length;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">เอกสารแนบ</h3>
        <p className="text-xs text-muted-foreground">
          อัปโหลดเอกสารที่เกี่ยวข้อง • อัปโหลดแล้ว {uploadedRequiredCount}/{requiredCount} รายการบังคับ
          ({totalUploaded}/{relevantDocs.length} ทั้งหมด)
        </p>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${requiredCount > 0 ? (uploadedRequiredCount / requiredCount) * 100 : 0}%` }}
        />
      </div>

      {/* Info about plant-specific requirements */}
      {selectedPlant && (
        <div className="rounded-lg border border-info/20 bg-info/5 p-3">
          <div className="flex gap-2">
            <Info className="h-4 w-4 shrink-0 text-info mt-0.5" />
            <div className="text-xs text-info">
              <p className="font-medium">
                เอกสารสำหรับ {PLANT_TYPES.find(p => p.code === selectedPlant)?.nameTh} ({applicationType === "NEW" ? "ยื่นใหม่" : applicationType === "RENEW" ? "ต่ออายุ" : "ขอใบแทน"})
              </p>
              <p className="mt-0.5">ระบบแสดงเอกสารที่เกี่ยวข้องกับชนิดพืชและประเภทการยื่นที่เลือก</p>
            </div>
          </div>
        </div>
      )}

      {/* Group by category */}
      {DOCUMENT_CATEGORIES.map((category) => {
        const catDocs = relevantDocs.filter((d) => d.category === category.key);
        if (catDocs.length === 0) return null;

        const catRequired = catDocs.filter(d => d.required).length;
        const catUploaded = catDocs.filter(d => uploadedIds.includes(d.id)).length;

        return (
          <div key={category.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-foreground">{category.nameTh}</h4>
                <span className="text-[10px] text-muted-foreground">({category.description})</span>
              </div>
              <span className={`text-[10px] font-medium ${catUploaded === catDocs.length ? "text-success" : "text-muted-foreground"}`}>
                {catUploaded}/{catDocs.length}
              </span>
            </div>

            {catDocs.map((doc) => {
              const uploaded = uploadedIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    uploaded
                      ? "border-success/30 bg-success/5"
                      : doc.required
                      ? "border-dashed border-destructive/30"
                      : "border-dashed border-border"
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    {uploaded ? (
                      <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                    ) : doc.required ? (
                      <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0">
                      <span className="text-sm">{doc.nameTh}</span>
                      {doc.required && !uploaded && (
                        <span className="ml-1.5 text-[10px] font-medium text-destructive">*จำเป็น</span>
                      )}
                      {doc.description && (
                        <p className="text-[10px] text-muted-foreground truncate">{doc.description}</p>
                      )}
                      {uploaded && (
                        <p className="text-[10px] text-success">อัปโหลดแล้ว</p>
                      )}
                    </div>
                  </div>
                  {!uploaded ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs shrink-0 ml-2"
                      onClick={() => handleUpload(doc.id, doc.nameTh)}
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      อัปโหลด
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive shrink-0 ml-2"
                      onClick={() => onChange(documents.filter((d) => d.docId !== doc.id))}
                    >
                      ลบ
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
