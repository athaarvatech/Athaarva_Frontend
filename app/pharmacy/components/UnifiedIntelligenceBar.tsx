"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Activity, 
  DollarSign, 
  AlertCircle, 
  ArrowUpRight, 
  Sparkles,
  Package,
  RefreshCw,
  Percent,
  Calendar,
  Clock,
  Zap,
  TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BatchAnalysisModal } from "@/components/pharmacy/batch-analysis-modal";
import type { PharmacyStats } from "@/hooks/usePharmacyStats";

interface UnifiedIntelligenceBarProps {
  stats?: PharmacyStats;
}

export function UnifiedIntelligenceBar({ stats }: UnifiedIntelligenceBarProps) {
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

  // Calculate metrics
  const totalInventoryWorth = displayStats.totalInventoryValue;
  const capitalAtRisk = displayStats.valueAtRisk;
  const riskPercentage = totalInventoryWorth > 0 
    ? ((capitalAtRisk / totalInventoryWorth) * 100).toFixed(1)
    : "0";
  const totalItems = displayStats.expiredCount + displayStats.expiringSoonCount + displayStats.lowStockCount;
  const turnoverHealth = totalItems > 0 ? Math.max(0, 100 - (totalItems * 2)) : 85;
  const procurementEfficiency = displayStats.averageMargin || 18.5;
  const industryStandard = 22;

  // Expiry timeline breakdown (mock data - would come from real API)
  const expiryTimeline = {
    thisWeek: { count: 2, value: 15000 },
    thisMonth: { count: 8, value: 45000 },
    next90Days: { count: displayStats.expiringSoonCount, value: capitalAtRisk },
  };

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
    <div className="relative bg-gradient-to-br from-healthcare-primary/5 via-white to-emerald-50/20 rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
      {/* Decorative blur orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-healthcare-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-healthcare-primary/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-healthcare-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Inventory Intelligence</h3>
          <Badge variant="outline" className="text-xs ml-2">Real-time</Badge>
        </div>
        {displayStats.batchesNeedingAction.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-healthcare-primary font-medium group h-8"
            onClick={() => setShowBatchModal(true)}
          >
            <AlertCircle className="h-4 w-4 mr-1 text-amber-600" />
            {displayStats.batchesNeedingAction.length} batches need action
            <ArrowUpRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        )}
      </div>

      {/* Main Content - 6 Column Grid */}
      <div className="relative grid grid-cols-6 gap-6 p-6 pt-4">
        
        {/* 1. Health Score with Animated Circle */}
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="relative">
            <svg className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={2 * Math.PI * 36}
                strokeDashoffset={(2 * Math.PI * 36) - (animatedScore / 100) * (2 * Math.PI * 36)}
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
              <span className="text-xl font-bold text-gray-900">{animatedScore}</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Health</p>
            <p className="text-sm font-medium text-gray-700">
              {displayStats.healthScore > 80 ? "Excellent" : displayStats.healthScore > 60 ? "Good" : "Attention"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="absolute left-[16.66%] top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* 2. Total Inventory Value */}
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inventory</p>
            <p className="text-xl font-bold text-gray-900">₹{(totalInventoryWorth / 100000).toFixed(1)}L</p>
          </div>
        </div>

        {/* Divider */}
        <div className="absolute left-[33.33%] top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* 3. Value at Risk with Timeline */}
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="p-3 rounded-xl bg-red-100/80 text-red-600 relative">
            <DollarSign className="h-6 w-6" />
            {capitalAtRisk > 10000 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">At Risk</p>
              <Badge variant="destructive" className="text-[9px] px-1 py-0">{riskPercentage}%</Badge>
            </div>
            <p className="text-xl font-bold text-gray-900">₹{(capitalAtRisk / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Divider */}
        <div className="absolute left-[50%] top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* 4. Turnover Health */}
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Turnover</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900">{turnoverHealth}%</p>
              <div className={cn(
                "h-2 w-2 rounded-full",
                turnoverHealth > 70 ? "bg-green-500" : 
                turnoverHealth > 50 ? "bg-amber-500" : "bg-red-500"
              )} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="absolute left-[66.66%] top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* 5. Top Mover */}
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 relative overflow-hidden">
            <TrendingUp className="h-6 w-6 relative z-10" />
            <Sparkles className="h-3 w-3 absolute top-1 right-1 text-blue-400 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top Mover</p>
            {displayStats.topSeller ? (
              <div className="flex items-center gap-1">
                <p className="text-sm font-bold text-gray-900 truncate max-w-[80px]">
                  {displayStats.topSeller.name.split(' ')[0]}
                </p>
                <span className="text-sm font-bold text-blue-600">+{displayStats.topSeller.velocity}%</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="absolute left-[83.33%] top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

        {/* 6. Avg Discount */}
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
            <Percent className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Discount</p>
            <div className="flex items-center gap-1">
              <p className="text-xl font-bold text-gray-900">{procurementEfficiency.toFixed(0)}%</p>
              {procurementEfficiency < industryStandard && (
                <TrendingDown className="h-3 w-3 text-amber-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Urgency Bar */}
      <div className="relative border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">EXPIRY TIMELINE</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
                <Clock className="h-3 w-3 text-red-600" />
                <span className="text-xs font-medium text-red-700">This Week:</span>
                <span className="text-xs font-bold text-red-800">₹{(expiryTimeline.thisWeek.value / 1000).toFixed(0)}K</span>
                <Badge variant="destructive" className="text-[9px] px-1 py-0">{expiryTimeline.thisWeek.count}</Badge>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                <span className="text-xs font-medium text-amber-700">This Month:</span>
                <span className="text-xs font-bold text-amber-800">₹{(expiryTimeline.thisMonth.value / 1000).toFixed(0)}K</span>
                <Badge className="text-[9px] px-1 py-0 bg-amber-100 text-amber-700">{expiryTimeline.thisMonth.count}</Badge>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
                <span className="text-xs font-medium text-gray-600">90 Days:</span>
                <span className="text-xs font-bold text-gray-800">₹{(expiryTimeline.next90Days.value / 1000).toFixed(0)}K</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0">{expiryTimeline.next90Days.count}</Badge>
              </div>
            </div>
          </div>

          {/* Industry Benchmark */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Zap className="h-3 w-3" />
            <span>Wastage: <span className={cn("font-semibold", parseFloat(riskPercentage) > 5 ? "text-red-600" : "text-green-600")}>{riskPercentage}%</span></span>
            <span className="text-gray-300">|</span>
            <span>Target: <span className="font-semibold text-gray-700">&lt;5%</span></span>
          </div>
        </div>
      </div>

      {/* Batch Analysis Modal */}
      <BatchAnalysisModal 
        open={showBatchModal}
        onOpenChange={setShowBatchModal}
        stats={displayStats}
      />
    </div>
  );
}
