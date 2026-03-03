import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProviderLayout from "@/components/ProviderLayout";

const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const currentMonth = "มีนาคม 2569";

// Generate calendar days
const calendarDays = Array.from({ length: 35 }, (_, i) => {
  const day = i - 5; // offset for starting day
  if (day < 1 || day > 31) return null;
  return day;
});

const events = [
  { day: 5, title: "ตรวจแปลง - น.ส.ดวงใจ", location: "ขอนแก่น", time: "09:00", type: "audit" },
  { day: 10, title: "ตรวจแปลง - นายประเสริฐ", location: "ลำพูน", time: "10:00", type: "audit" },
  { day: 15, title: "ประชุมทีมตรวจสอบ", location: "ออนไลน์", time: "14:00", type: "meeting" },
  { day: 20, title: "Deadline แก้ไข - APP-2026-004", location: "-", time: "-", type: "deadline" },
  { day: 25, title: "ตรวจแปลง - วิสาหกิจ", location: "สุราษฎร์ธานี", time: "09:30", type: "audit" },
];

const eventDays = new Set(events.map((e) => e.day));

const typeConfig: Record<string, { label: string; className: string }> = {
  audit: { label: "ตรวจสอบ", className: "bg-primary/10 text-primary" },
  meeting: { label: "ประชุม", className: "bg-info/10 text-info" },
  deadline: { label: "กำหนดส่ง", className: "bg-destructive/10 text-destructive" },
};

export default function ProviderCalendarPage() {
  return (
    <ProviderLayout title="ปฏิทิน">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-4 card-shadow"
          >
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              {currentMonth}
            </h3>

            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-2">{d}</div>
              ))}
              {calendarDays.map((day, i) => (
                <div
                  key={i}
                  className={`relative aspect-square flex items-center justify-center rounded-lg text-xs transition-colors ${
                    day === null
                      ? ""
                      : day === 3
                      ? "bg-primary text-primary-foreground font-bold"
                      : eventDays.has(day!)
                      ? "bg-primary/10 text-primary font-semibold cursor-pointer hover:bg-primary/20"
                      : "text-card-foreground hover:bg-muted cursor-pointer"
                  }`}
                >
                  {day}
                  {day !== null && eventDays.has(day) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground">กิจกรรมที่กำลังมาถึง</h4>
            {events.map((event, i) => {
              const config = typeConfig[event.type];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg border border-border bg-card p-3 card-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground">
                        {event.day}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-card-foreground">{event.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          {event.time !== "-" && (
                            <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{event.time}</span>
                          )}
                          {event.location !== "-" && (
                            <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{event.location}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={`text-[8px] border-0 ${config.className}`}>{config.label}</Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
