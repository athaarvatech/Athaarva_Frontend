"use client";

import { useMemo } from "react";
import type { StockEntryItem } from "@/app/pharmacy/types";

export interface PharmacyStats {
  // Health Metrics
  healthScore: number;
  expiredCount: number;
  expiringSoonCount: number;
  lowStockCount: number;
  
  // Financial Metrics
  totalInventoryValue: number;
  valueAtRisk: number; // Expiring in 30 days
  averageMargin: number;
  
  // Sales Intelligence
  topSeller: {
    name: string;
    velocity: number; // % change
    currentStock: number;
  } | null;
  
  fastMovers: Array<{
    name: string;
    velocity: number;
    suggestion: string;
  }>;
  
  // Predictions
  stockOutRisk: Array<{
    medicineName: string;
    daysUntilStockout: number;
    suggestedReorderQty: number;
  }>;
  
  // Batch Analysis
  batchesNeedingAction: Array<{
    batchNo: string;
    medicineName: string;
    action: "discount" | "return" | "remove";
    reason: string;
    urgency: "critical" | "urgent" | "warning";
  }>;
}

export function usePharmacyStats(items: StockEntryItem[]): PharmacyStats {
  return useMemo(() => {
    if (items.length === 0) {
      return {
        healthScore: 100,
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
    }

    // 1. Health Score Calculation
    const expiredCount = items.filter(i => i.isExpired).length;
    const expiringSoonCount = items.filter(i => i.isExpiringSoon && !i.isExpired).length;
    const lowStockCount = items.filter(i => i.qty < 20).length; // Threshold: 20 units
    
    const healthPenalty = (expiredCount * 15) + (expiringSoonCount * 5) + (lowStockCount * 3);
    const healthScore = Math.max(0, Math.min(100, 100 - healthPenalty));

    // 2. Financial Metrics
    const totalInventoryValue = items.reduce((sum, item) => sum + (item.mrp * item.qty), 0);
    
    const valueAtRisk = items
      .filter(i => i.isExpiringSoon || i.isExpired)
      .reduce((sum, item) => sum + (item.mrp * item.qty), 0);
    
    const averageMargin = items.length > 0
      ? items.reduce((sum, item) => sum + ((item.mrp - item.netRate) / item.mrp * 100), 0) / items.length
      : 0;

    // 3. Sales Intelligence (Mock velocity - in real app, compare with historical data)
    const itemsWithVelocity = items.map(item => ({
      ...item,
      // Simulate velocity based on stock levels (lower stock = higher velocity)
      velocity: item.qty < 50 ? Math.random() * 30 + 10 : Math.random() * 10,
    })).sort((a, b) => b.velocity - a.velocity);

    const topSeller = itemsWithVelocity.length > 0 ? {
      name: itemsWithVelocity[0].medicineName,
      velocity: Math.round(itemsWithVelocity[0].velocity),
      currentStock: itemsWithVelocity[0].qty,
    } : null;

    const fastMovers = itemsWithVelocity.slice(0, 3).map(item => ({
      name: item.medicineName,
      velocity: Math.round(item.velocity),
      suggestion: item.qty < 30 
        ? `Reorder ${Math.ceil((50 - item.qty) / 10) * 10} units urgently`
        : `Stock adequate for ${Math.ceil(item.qty / (item.velocity / 7))} days`,
    }));

    // 4. Stock-out Predictions
    const stockOutRisk = items
      .filter(item => item.qty < 30 && !item.isExpired)
      .map(item => {
        const estimatedDailyUsage = 3; // Mock: 3 units/day
        const daysUntilStockout = Math.floor(item.qty / estimatedDailyUsage);
        const suggestedReorderQty = Math.max(50, Math.ceil(item.qty * 2 / 10) * 10);
        
        return {
          medicineName: item.medicineName,
          daysUntilStockout,
          suggestedReorderQty,
        };
      })
      .sort((a, b) => a.daysUntilStockout - b.daysUntilStockout)
      .slice(0, 5);

    // 5. Batch Action Recommendations
    const batchesNeedingAction = items
      .filter(item => item.isExpired || item.isExpiringSoon || item.qty < 10)
      .map(item => {
        if (item.isExpired) {
          return {
            batchNo: item.batchNo,
            medicineName: item.medicineName,
            action: "remove" as const,
            reason: "Expired - immediate removal required",
            urgency: "critical" as const,
          };
        }
        if (item.isExpiringSoon && item.qty > 20) {
          return {
            batchNo: item.batchNo,
            medicineName: item.medicineName,
            action: "discount" as const,
            reason: `${item.qty} units expiring soon - run clearance sale`,
            urgency: "urgent" as const,
          };
        }
        if (item.qty < 10) {
          return {
            batchNo: item.batchNo,
            medicineName: item.medicineName,
            action: "return" as const,
            reason: "Low quantity - consider returning to supplier",
            urgency: "warning" as const,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof batchesNeedingAction;

    return {
      healthScore,
      expiredCount,
      expiringSoonCount,
      lowStockCount,
      totalInventoryValue,
      valueAtRisk,
      averageMargin,
      topSeller,
      fastMovers,
      stockOutRisk,
      batchesNeedingAction,
    };
  }, [items]);
}
