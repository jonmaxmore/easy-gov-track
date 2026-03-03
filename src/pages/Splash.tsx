import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const stages = [
  { progress: 15, text: "Initializing System..." },
  { progress: 35, text: "Loading Resources..." },
  { progress: 65, text: "Verifying Security..." },
  { progress: 85, text: "Finalizing..." },
  { progress: 100, text: "Welcome" },
];

export default function SplashPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing System...");

  useEffect(() => {
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].progress);
        setStatusText(stages[currentStage].text);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(() => navigate("/login"), 600);
      }
    }, 350);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[60px]" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[60px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        {/* Logo */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[30px]" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full gov-gradient shadow-xl">
            <Leaf className="h-14 w-14 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Typography */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold tracking-wider text-foreground">GACP THAILAND</h1>
          <p className="text-sm font-medium text-muted-foreground">
            National Herbal Certification Platform
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex w-56 flex-col items-center gap-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full gov-gradient"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="text-xs font-medium text-muted-foreground">{statusText}</p>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-muted-foreground/60">
          Department of Thai Traditional and Alternative Medicine
        </p>
      </div>
    </div>
  );
}
