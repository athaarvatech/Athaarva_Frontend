"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Package,
  Activity,
  Zap,
  Sparkles,
  ShoppingCart,
  Percent,
  RefreshCw,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PharmacyStats } from "@/hooks/usePharmacyStats";

interface MonthlyOverviewEnhancedProps {
  stats?: PharmacyStats;
}

export function MonthlyOverviewEnhanced({ stats }: MonthlyOverviewEnhancedProps) {
  const [expandedView, setExpandedView] = useState(false);

  // Default stats when none provided
  const defaultStats: PharmacyStats = {
    healthScore: 85,
    expiredCount: 0,
    expiringSoonCount: 0,
    lowStockCount: 0,
    totalInventoryValue: 0,
    valueAtRisk: 0,
    averageMargin: 0,
    topSeller: null,
    fastMovers: [],
    stockOutRisk: [],
    batchesNeedingAction: [],
  };

  const displayStats = stats || defaultStats;

  // Calculate realistic metrics
  const totalInventoryWorth = displayStats.totalInventoryValue;
  const capitalAtRisk = displayStats.valueAtRisk;
  const riskPercentage = totalInventoryWorth > 0 
    ? ((capitalAtRisk / totalInventoryWorth) * 100).toFixed(1)
    : "0";
  
  // Stock turnover health (fresh stock ratio)
  const totalItems = displayStats.expiredCount + displayStats.expiringSoonCount + displayStats.lowStockCount;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const healthyItems = Math.max(0, 100 - totalItems); // Mock: assume 100 total items
  const turnoverHealth = totalItems > 0 ? Math.max(0, 100 - (totalItems * 2)) : 85;
  
  // Procurement efficiency (avg discount from MRP)
  const procurementEfficiency = displayStats.averageMargin || 18.5;
  const industryStandard = 22;
  const efficiencyGap = (procurementEfficiency - industryStandard).toFixed(1);

  // Alert thresholds
  const hasHighWastage = capitalAtRisk > (totalInventoryWorth * 0.05);
  const hasStockOutRisk = displayStats.stockOutRisk.length > 5;
  const hasPoorEfficiency = procurementEfficiency < 15;

  return (
    <div className="relative bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 rounded-2xl p-6 border border-gray-200/50 shadow-sm overflow-hidden">
      {/* Decorative blur orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-healthcare-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Inventory Intelligence</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Real-time
          </Badge>
        </div>

        {/* Main Metrics - Horizontal Grid */}
        <div className="grid grid-cols-4 gap-6">
          {/* Total Inventory Worth */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <TrendingUp className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-2">Total Inventory</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{(totalInventoryWorth / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Current stock value
            </p>
          </div>

          {/* Capital at Risk */}
          <div className={cn(
            "border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group",
            hasHighWastage 
              ? "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200" 
              : "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                hasHighWastage ? "bg-red-500" : "bg-amber-500"
              )}>
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <Badge className={cn(
                "text-[10px] px-2 py-0.5",
                hasHighWastage ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              )}>
                {riskPercentage}%
              </Badge>
            </div>
            <p className={cn(
              "text-xs font-semibold uppercase tracking-wide mb-2",
              hasHighWastage ? "text-red-700" : "text-amber-700"
            )}>
              Capital at Risk
            </p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{(capitalAtRisk / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {displayStats.expiredCount + displayStats.expiringSoonCount} batches expiring
            </p>
          </div>

          {/* Turnover Health */}
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-green-500 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  turnoverHealth > 70 ? "bg-green-500" : 
                  turnoverHealth > 50 ? "bg-amber-500" : "bg-red-500"
                )} />
              </div>
            </div>
            <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-2">Turnover Health</p>
            <p className="text-2xl font-bold text-gray-900">{turnoverHealth}%</p>
            <p className="text-xs text-green-600 mt-2">
              {turnoverHealth > 70 ? "Healthy flow" : "Needs attention"}
            </p>
          </div>

          {/* Procurement Efficiency */}
          <div className={cn(
            "border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group",
            hasPoorEfficiency 
              ? "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200"
              : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                hasPoorEfficiency ? "bg-orange-500" : "bg-purple-500"
              )}>
                <Percent className="h-5 w-5 text-white" />
              </div>
              <TrendingDown className="h-4 w-4 text-gray-400" />
            </div>
            <p className={cn(
              "text-xs font-semibold uppercase tracking-wide mb-2",
              hasPoorEfficiency ? "text-orange-700" : "text-purple-700"
            )}>
              Avg Discount
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {procurementEfficiency.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {parseFloat(efficiencyGap) < 0 
                ? `${Math.abs(parseFloat(efficiencyGap))}% below optimal` 
                : `${efficiencyGap}% above optimal`}
            </p>
          </div>
        </div>

        {/* Conditional Alerts */}
        {(hasHighWastage || hasStockOutRisk || hasPoorEfficiency) && (
          <div className="space-y-2 pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-3 w-3 text-amber-600" />
              <span className="text-xs font-semibold text-gray-700">Smart Alerts</span>
            </div>
            
            {hasHighWastage && (
              <div className="bg-red-50 border border-red-200 rounded-md p-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-red-900">High Wastage Alert</p>
                    <p className="text-[11px] text-red-700 mt-0.5">
                      {riskPercentage}% of inventory at risk (₹{(capitalAtRisk / 1000).toFixed(0)}K)
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      💡 Review supplier delivery schedules to reduce wastage
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hasStockOutRisk && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-2">
                <div className="flex items-start gap-2">
                  <Package className="h-3 w-3 text-orange-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-orange-900">Stock-Out Risk</p>
                    <p className="text-[11px] text-orange-700 mt-0.5">
                      {displayStats.stockOutRisk.length} items running critically low
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      💡 Reorder before stock-out occurs
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hasPoorEfficiency && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-3 w-3 text-blue-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-blue-900">Procurement Tip</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      Avg discount {procurementEfficiency.toFixed(1)}% (Industry: {industryStandard}%)
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      💡 Consider bulk purchase agreements for better rates
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expandable Details Section */}
        {displayStats.totalInventoryValue > 0 && (
          <div className="pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 text-xs text-gray-600 hover:text-healthcare-primary"
              onClick={() => setExpandedView(!expandedView)}
            >
              {expandedView ? "Hide" : "Show"} Detailed Breakdown
              <TrendingDown className={cn(
                "h-3 w-3 ml-2 transition-transform",
                expandedView && "rotate-180"
              )} />
            </Button>

            {expandedView && (
              <div className="space-y-3 mt-3 animate-in slide-in-from-top-2">
                {/* Top Movers */}
                {displayStats.fastMovers.length > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-md p-3 border border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Fast Movers
                    </p>
                    <div className="space-y-1.5">
                      {displayStats.fastMovers.slice(0, 3).map((mover, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 font-medium truncate flex-1">
                            {mover.name}
                          </span>
                          <Badge variant="outline" className="bg-white text-green-700 border-green-200 text-[10px] ml-2">
                            {mover.velocity.toFixed(1)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Out Risks */}
                {displayStats.stockOutRisk.length > 0 && (
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-md p-3 border border-red-200">
                    <p className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Stock-Out Predictions
                    </p>
                    <div className="space-y-1.5">
                      {displayStats.stockOutRisk.slice(0, 3).map((risk, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 font-medium truncate flex-1">
                            {risk.medicineName}
                          </span>
                          <Badge variant="destructive" className="text-[10px] ml-2">
                            {risk.daysUntilStockout}d left
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State for New Users */}
        {displayStats.totalInventoryValue === 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center border border-gray-200 mt-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Start Adding Inventory
            </p>
            <p className="text-xs text-gray-500">
              Add your first stock entry to see real-time insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
