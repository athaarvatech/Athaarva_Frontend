"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressBarProps {
  value: number;
  className?: string;
  onComplete?: () => void;
}

export function AnimatedProgressBar({ value, className, onComplete }: AnimatedProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    // Only animate forward, never backwards
    if (value > displayValue) {
      const increment = Math.ceil((value - displayValue) / 20); // Smooth increments
      const interval = setInterval(() => {
        setDisplayValue(prev => {
          const next = prev + increment;
          if (next >= value) {
            clearInterval(interval);
            return value;
          }
          return next;
        });
      }, 20);

      return () => clearInterval(interval);
    } else if (value < displayValue) {
      // If value decreases (step back), update immediately
      setDisplayValue(value);
    }
  }, [value, displayValue]);

  useEffect(() => {
    if (displayValue === 100 && !hasCompleted) {
      setHasCompleted(true);
      
      // Trigger confetti
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#007C7C', '#50C878', '#14b8a6']
        });
        
        // Second burst
        setTimeout(() => {
          confetti.default({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#007C7C', '#50C878', '#14b8a6']
          });
        }, 200);
        
        setTimeout(() => {
          confetti.default({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#007C7C', '#50C878', '#14b8a6']
          });
        }, 400);
      });

      onComplete?.();
    }
  }, [displayValue, hasCompleted, onComplete]);

  return (
    <div className={cn("relative w-full h-2 bg-gray-200 rounded-full overflow-hidden", className)}>
      <motion.div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-healthcare-emerald to-teal-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${displayValue}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {/* Shimmer effect when at 100% */}
      {displayValue === 100 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      )}
      
      {/* Pulse effect while progressing */}
      {displayValue > 0 && displayValue < 100 && (
        <motion.div
          className="absolute right-0 top-0 w-8 h-full bg-white/30"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </div>
  );
}
