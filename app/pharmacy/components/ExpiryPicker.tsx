"use client";

import React, { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { isExpiringSoon, isExpired, getExpiryDate, formatExpiry } from "../types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

interface ExpiryPickerProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
  disabled?: boolean;
  error?: string;
}

export function ExpiryPicker({
  month,
  year,
  onChange,
  disabled = false,
  error,
}: ExpiryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(year);
  const containerRef = useRef<HTMLDivElement>(null);

  const expiryDate = getExpiryDate(month, year);
  const expired = isExpired(expiryDate);
  const expiringSoon = isExpiringSoon(expiryDate);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMonthSelect = (selectedMonth: number) => {
    onChange(selectedMonth, displayYear);
    setIsOpen(false);
  };

  const handlePrevYear = () => {
    setDisplayYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setDisplayYear((prev) => prev + 1);
  };

  const getMonthStatus = (m: number) => {
    const date = getExpiryDate(m, displayYear);
    if (isExpired(date)) return "expired";
    if (isExpiringSoon(date)) return "warning";
    return "normal";
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 w-full h-10 px-3 rounded-lg border bg-white text-left text-sm transition-all",
          "focus:outline-none focus:border-healthcare-primary focus:ring-1 focus:ring-healthcare-primary",
          disabled && "bg-gray-50 opacity-60 cursor-not-allowed",
          expired && "border-red-400 bg-red-50",
          expiringSoon && !expired && "border-amber-400 bg-amber-50",
          !expired && !expiringSoon && !error && "border-gray-200",
          error && "border-red-400"
        )}
      >
        <CalendarDays className={cn(
          "h-4 w-4",
          expired ? "text-red-500" : expiringSoon ? "text-amber-500" : "text-gray-400"
        )} />
        <span className={cn(
          "flex-1 font-medium",
          expired ? "text-red-700" : expiringSoon ? "text-amber-700" : "text-gray-900"
        )}>
          {formatExpiry(month, year)}
        </span>
        {expired && (
          <span className="flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertTriangle className="h-3 w-3" />
            Expired
          </span>
        )}
        {expiringSoon && !expired && (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
            <AlertTriangle className="h-3 w-3" />
            Soon
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePrevYear}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold text-gray-900">{displayYear}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNextYear}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {MONTHS.map((monthName, index) => {
              const m = index + 1;
              const status = getMonthStatus(m);
              const isSelected = m === month && displayYear === year;

              return (
                <button
                  key={monthName}
                  type="button"
                  onClick={() => handleMonthSelect(m)}
                  className={cn(
                    "py-2 px-1 text-xs font-medium rounded-md transition-all",
                    isSelected && "bg-healthcare-primary text-white",
                    !isSelected && status === "expired" && "bg-red-50 text-red-400 cursor-not-allowed",
                    !isSelected && status === "warning" && "bg-amber-50 text-amber-700 hover:bg-amber-100",
                    !isSelected && status === "normal" && "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  )}
                  disabled={status === "expired"}
                >
                  {monthName}
                </button>
              );
            })}
          </div>

          {/* Quick select for common future dates */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Quick Select:</p>
            <div className="flex gap-1.5">
              {[6, 12, 24, 36].map((monthsAhead) => {
                const futureDate = new Date();
                futureDate.setMonth(futureDate.getMonth() + monthsAhead);
                const futureMonth = futureDate.getMonth() + 1;
                const futureYear = futureDate.getFullYear();
                
                return (
                  <button
                    key={monthsAhead}
                    type="button"
                    onClick={() => {
                      setDisplayYear(futureYear);
                      onChange(futureMonth, futureYear);
                      setIsOpen(false);
                    }}
                    className="flex-1 py-1.5 text-xs font-medium text-healthcare-primary bg-healthcare-primary/10 rounded hover:bg-healthcare-primary/20 transition-colors"
                  >
                    +{monthsAhead}M
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
