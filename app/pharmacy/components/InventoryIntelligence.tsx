"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Activity, DollarSign, AlertCircle, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BatchAnalysisModal } from "@/components/pharmacy/batch-analysis-modal";
import type { PharmacyStats } from "@/hooks/usePharmacyStats";

interface InventoryIntelligenceProps {
  stats?: PharmacyStats;
}

export function InventoryIntelligence({ stats }: InventoryIntelligenceProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Default mock stats for dashboard
  const defaultStats: PharmacyStats = {
    healthScore: 82,
    expiredCount: 3,
    expiringSoonCount: 18,
    lowStockCount: 23,
    totalInventoryValue: 2847500,
    valueAtRisk: 124500,
    averageMargin: 28.5,
    topSeller: {
      name: "Paracetamol 500mg",
      velocity: 45.2,
      currentStock: 450,
    },
    fastMovers: [
      { name: "Paracetamol 500mg", velocity: 45.2, suggestion: "Maintain stock levels" },
      { name: "Amoxicillin 500mg", velocity: 38.5, suggestion: "Consider bulk ordering" },
    ],
    stockOutRisk: [
      { medicineName: "Omeprazole 20mg", daysUntilStockout: 5, suggestedReorderQty: 200 },
      { medicineName: "Azithromycin 500mg", daysUntilStockout: 8, suggestedReorderQty: 150 },
    ],
    batchesNeedingAction: [
      { batchNo: "BTH123", medicineName: "Crocin", action: "discount", reason: "Expiring soon", urgency: "high" },
      { batchNo: "BTH456", medicineName: "Dolo 650", action: "remove", reason: "Expired", urgency: "critical" },
    ],
  };

  const displayStats = stats || defaultStats;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = displayStats.healthScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= displayStats.healthScore) {
        setAnimatedScore(displayStats.healthScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [displayStats.healthScore]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative bg-gradient-to-br from-healthcare-primary/5 via-white to-emerald-50/20 rounded-2xl p-6 border border-gray-200/50 shadow-sm overflow-hidden mb-6">
      {/* Decorative blur orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-healthcare-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative grid grid-cols-3 gap-6">
        
        {/* 1. Health Score with Animated Circle */}
        <div className="flex items-center gap-4 group cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="relative">
            <svg className="w-24 h-24 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={cn(
                  "transition-all duration-1000 ease-out",
                  displayStats.healthScore > 80 ? "text-emerald-500" :
                  displayStats.healthScore > 60 ? "text-amber-500" :
                  "text-red-500"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{animatedScore}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-healthcare-primary" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Health Score</span>
            </div>
            <div className="text-sm text-gray-600 leading-tight flex items-center gap-2">
              <span>
                {displayStats.healthScore > 80 ? "Excellent" : displayStats.healthScore > 60 ? "Good" : "Needs Attention"}
              </span>
              <Badge variant="secondary" className="text-xs">
                {displayStats.expiredCount + displayStats.expiringSoonCount + displayStats.lowStockCount} alerts
              </Badge>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 h-20 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* 2. Value At Risk */}
        <div className="flex items-center gap-4 group cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="p-3 rounded-xl bg-red-100/80 text-red-600 relative">
            <DollarSign className="h-6 w-6" />
            {displayStats.valueAtRisk > 10000 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Value at Risk</span>
              {displayStats.valueAtRisk > 10000 && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                  HIGH
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{(displayStats.valueAtRisk / 1000).toFixed(1)}K
            </p>
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-gray-500">
                {displayStats.expiredCount + displayStats.expiringSoonCount} items expiring
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="absolute left-2/3 top-1/2 -translate-y-1/2 h-20 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* 3. Top Mover with Sparkline Effect */}
        <div className="flex items-center gap-4 group cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 relative overflow-hidden">
            <TrendingUp className="h-6 w-6 relative z-10" />
            <Sparkles className="h-4 w-4 absolute top-1 right-1 text-blue-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top Mover</span>
            </div>
            {displayStats.topSeller ? (
              <>
                <p className="text-sm font-bold text-gray-900 truncate max-w-[160px]">
                  {displayStats.topSeller.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">+{displayStats.topSeller.velocity}%</span>
                  <span className="text-xs text-gray-500">velocity</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No data yet</p>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      {displayStats.batchesNeedingAction.length > 0 && (
        <div className="relative mt-6 pt-4 border-t border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                {displayStats.batchesNeedingAction.length} batches need action
              </span>
            </div>
            <Button 
              variant="link" 
              className="h-auto p-0 text-healthcare-primary font-medium group"
              onClick={() => setShowBatchModal(true)}
            >
              View details
              <ArrowUpRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      )}

      {/* Batch Analysis Modal */}
      <BatchAnalysisModal 
        open={showBatchModal}
        onOpenChange={setShowBatchModal}
        stats={displayStats}
      />
    </div>
  );
}
