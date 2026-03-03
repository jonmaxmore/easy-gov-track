import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: "default" | "primary" | "warning" | "success";
}

const variantStyles = {
  default: "bg-card border border-border",
  primary: "gov-gradient text-primary-foreground",
  warning: "bg-warning/10 border border-warning/20",
  success: "bg-success/10 border border-success/20",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  warning: "bg-warning/20 text-warning",
  success: "bg-success/20 text-success",
};

const textVariantStyles = {
  default: "text-foreground",
  primary: "text-primary-foreground",
  warning: "text-warning",
  success: "text-success",
};

export default function StatusCard({ icon: Icon, label, value, variant = "default" }: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg p-4 card-shadow ${variantStyles[variant]}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconVariantStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs font-medium ${variant === "primary" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {label}
          </p>
          <p className={`text-xl font-bold ${textVariantStyles[variant]}`}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
