import { useState } from "react";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REQUIRED_DOCUMENTS, DOCUMENT_CATEGORIES, PLANT_TYPES } from "@/constants/gacp";
import type { UploadedDocument } from "@/types/application";
import { useToast } from "@/hooks/use-toast";

interface Props {
  documents: UploadedDocument[];
  onChange: (docs: UploadedDocument[]) => void;
  selectedPlant: string;
}

export default function StepDocuments({ documents, onChange, selectedPlant }: Props) {
  const { toast } = useToast();
  const plant = PLANT_TYPES.find((p) => p.code === selectedPlant);
  const controlLevel = plant?.controlLevel || "GENERAL";

  // Filter documents relevant to this plant's control level
  const relevantDocs = REQUIRED_DOCUMENTS.filter(
    (doc) => !doc.forControlLevel || doc.forControlLevel === controlLevel
  );

  const uploadedIds = documents.map((d) => d.docId);

  const handleUpload = (docId: string, docName: string) => {
    // Simulate upload
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

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">เอกสารแนบ</h3>
        <p className="text-xs text-muted-foreground">
          อัปโหลดเอกสารที่เกี่ยวข้อง • อัปโหลดแล้ว {uploadedRequiredCount}/{requiredCount} รายการบังคับ
        </p>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${requiredCount > 0 ? (uploadedRequiredCount / requiredCount) * 100 : 0}%` }}
        />
      </div>

      {/* Group by category */}
      {DOCUMENT_CATEGORIES.map((category) => {
        const catDocs = relevantDocs.filter((d) => d.category === category.key);
        if (catDocs.length === 0) return null;

        return (
          <div key={category.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-foreground">{category.nameTh}</h4>
              <span className="text-[10px] text-muted-foreground">({category.description})</span>
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
                  <div className="flex items-center gap-2.5">
                    {uploaded ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : doc.required ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <span className="text-sm">{doc.nameTh}</span>
                      {doc.required && !uploaded && (
                        <span className="ml-1.5 text-[10px] font-medium text-destructive">*จำเป็น</span>
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
                      className="text-xs"
                      onClick={() => handleUpload(doc.id, doc.nameTh)}
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      อัปโหลด
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive"
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
