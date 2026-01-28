"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HospitalCard, HospitalCardData } from "./HospitalCard";

const STORAGE_KEY = "athaarva_recent_hospitals";
const MAX_RECENT = 5;

export interface RecentHospital extends HospitalCardData {
  lastVisited: string;
}

interface RecentHospitalsProps {
  onSelect: (hospital: HospitalCardData) => void;
  className?: string;
  maxDisplay?: number;
  showClearAll?: boolean;
}

// Utility functions for managing recent hospitals
export const recentHospitalsStorage = {
  get: (): RecentHospital[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  add: (hospital: HospitalCardData): void => {
    if (typeof window === "undefined") return;
    try {
      const recent = recentHospitalsStorage.get();
      // Remove if already exists
      const filtered = recent.filter((h) => h.id !== hospital.id);
      // Add to beginning with timestamp
      const updated: RecentHospital[] = [
        {
          ...hospital,
          lastVisited: new Date().toISOString(),
          isRecent: true,
        },
        ...filtered,
      ].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving recent hospital:", error);
    }
  },

  remove: (hospitalId: string): void => {
    if (typeof window === "undefined") return;
    try {
      const recent = recentHospitalsStorage.get();
      const filtered = recent.filter((h) => h.id !== hospitalId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error removing recent hospital:", error);
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing recent hospitals:", error);
    }
  },
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function RecentHospitals({
  onSelect,
  className,
  maxDisplay = 3,
  showClearAll = true,
}: RecentHospitalsProps) {
  const [recentHospitals, setRecentHospitals] = useState<RecentHospital[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRecentHospitals(recentHospitalsStorage.get());
  }, []);

  const handleRemove = (hospitalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    recentHospitalsStorage.remove(hospitalId);
    setRecentHospitals(recentHospitalsStorage.get());
  };

  const handleClearAll = () => {
    recentHospitalsStorage.clear();
    setRecentHospitals([]);
  };

  // Don't render on server or if no recent hospitals
  if (!mounted || recentHospitals.length === 0) {
    return null;
  }

  const displayHospitals = recentHospitals.slice(0, maxDisplay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-3", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700">
            Recently Visited
          </h3>
        </div>
        {showClearAll && recentHospitals.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 h-auto py-1 px-2"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Hospital list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {displayHospitals.map((hospital, index) => (
            <motion.div
              key={hospital.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <HospitalCard
                hospital={{ ...hospital, isRecent: true }}
                onClick={onSelect}
                variant="compact"
                index={index}
              />
              
              {/* Remove button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleRemove(hospital.id, e)}
                className={cn(
                  "absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "hover:bg-red-50 hover:text-red-500"
                )}
              >
                <X className="h-3.5 w-3.5" />
              </Button>

              {/* Time indicator */}
              <span className="absolute right-24 top-1/2 -translate-y-1/2 text-xs text-gray-400 hidden sm:block">
                {formatRelativeTime(hospital.lastVisited)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show more link if there are more */}
      {recentHospitals.length > maxDisplay && (
        <button
          onClick={() => setRecentHospitals(recentHospitalsStorage.get())}
          className="flex items-center gap-1 text-sm text-healthcare-primary hover:text-healthcare-secondary transition-colors"
        >
          <span>View all {recentHospitals.length} recent</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

export default RecentHospitals;
