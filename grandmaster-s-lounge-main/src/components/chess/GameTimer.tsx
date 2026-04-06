import { useEffect, useState, useRef } from "react";
import { formatTime } from "@/lib/chess-utils";
import { Clock } from "lucide-react";

interface GameTimerProps {
  initialTime: number; // seconds
  isActive: boolean;
  color: "w" | "b";
  onTimeout: () => void;
}

const GameTimer = ({ initialTime, isActive, color, onTimeout }: GameTimerProps) => {
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            onTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, onTimeout]);

  const isLow = time < 30;

  return (
    <div
      className={`glass flex items-center gap-2 px-4 py-2 font-mono text-lg font-semibold transition-all ${
        isActive ? "glow-primary border-primary/40" : "opacity-60"
      } ${isLow && isActive ? "text-destructive animate-pulse" : ""}`}
    >
      <Clock className="w-4 h-4" />
      <span>{color === "w" ? "White" : "Black"}</span>
      <span className="ml-auto">{formatTime(time)}</span>
    </div>
  );
};

export default GameTimer;
