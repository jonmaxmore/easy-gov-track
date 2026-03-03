import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Search, Leaf, MapPin, Calendar, User, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlantingRecord {
  id: string;
  herbName: string;
  farmName: string;
  location: string;
  plantedDate: string;
  harvestDate: string;
  farmer: string;
  status: "growing" | "harvested" | "certified";
}

const mockRecords: PlantingRecord[] = [
  {
    id: "GACP-2026-00123",
    herbName: "กัญชง (Hemp)",
    farmName: "สวนสมุนไพรเชียงใหม่",
    location: "อ.แม่ริม จ.เชียงใหม่",
    plantedDate: "15 ม.ค. 2569",
    harvestDate: "15 เม.ย. 2569",
    farmer: "นายสมชาย ใจดี",
    status: "certified",
  },
  {
    id: "GACP-2026-00456",
    herbName: "ฟ้าทะลายโจร",
    farmName: "ไร่สุขใจ",
    location: "อ.เมือง จ.นครราชสีมา",
    plantedDate: "1 ก.พ. 2569",
    harvestDate: "ยังไม่เก็บเกี่ยว",
    farmer: "นางสมหญิง รักษ์ดิน",
    status: "growing",
  },
];

const statusLabels = {
  growing: { label: "กำลังเพาะปลูก", color: "text-warning" },
  harvested: { label: "เก็บเกี่ยวแล้ว", color: "text-info" },
  certified: { label: "ได้รับการรับรอง", color: "text-success" },
};

export default function TrackTracePage() {
  const [searchId, setSearchId] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<PlantingRecord | null>(null);

  const handleSearch = () => {
    const found = mockRecords.find((r) => r.id.toLowerCase().includes(searchId.toLowerCase()));
    setSelectedRecord(found || null);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <h2 className="text-lg font-bold text-foreground md:text-xl">Track & Trace</h2>
        <p className="text-sm text-muted-foreground">ตรวจสอบข้อมูลการปลูกสมุนไพรด้วย QR Code</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="ค้นหาด้วยรหัส เช่น GACP-2026-00123"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} className="shrink-0">
          <Search className="mr-1 h-4 w-4" />
          ค้นหา
        </Button>
      </div>

      {/* Sample Records */}
      {!selectedRecord && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">ตัวอย่างข้อมูล (คลิกเพื่อดู)</p>
          {mockRecords.map((record) => (
            <motion.button
              key={record.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedRecord(record)}
              className="w-full rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{record.herbName}</span>
                </div>
                <span className={`text-xs font-medium ${statusLabels[record.status].color}`}>
                  {statusLabels[record.status].label}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{record.id}</p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Record Detail + QR */}
      {selectedRecord && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <button
            onClick={() => setSelectedRecord(null)}
            className="text-xs font-medium text-primary hover:underline"
          >
            ← กลับ
          </button>

          <div className="rounded-xl border border-border bg-card p-5 card-shadow-lg">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-xl border-2 border-primary/20 bg-primary-foreground p-3">
                  <QRCodeSVG
                    value={`https://gacp.go.th/trace/${selectedRecord.id}`}
                    size={140}
                    fgColor="hsl(153, 100%, 20%)"
                    level="H"
                  />
                </div>
                <p className="text-[10px] font-medium text-muted-foreground">สแกนเพื่อตรวจสอบ</p>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">รหัสอ้างอิง</p>
                  <p className="font-mono text-sm font-bold text-primary">{selectedRecord.id}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoRow icon={Leaf} label="ชนิดสมุนไพร" value={selectedRecord.herbName} />
                  <InfoRow icon={MapPin} label="พื้นที่ปลูก" value={selectedRecord.location} />
                  <InfoRow icon={Calendar} label="วันปลูก" value={selectedRecord.plantedDate} />
                  <InfoRow icon={Calendar} label="วันเก็บเกี่ยว" value={selectedRecord.harvestDate} />
                  <InfoRow icon={User} label="เกษตรกร" value={selectedRecord.farmer} />
                  <InfoRow
                    icon={CheckCircle}
                    label="สถานะ"
                    value={statusLabels[selectedRecord.status].label}
                    valueClassName={statusLabels[selectedRecord.status].color}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium ${valueClassName || "text-card-foreground"}`}>{value}</p>
      </div>
    </div>
  );
}
