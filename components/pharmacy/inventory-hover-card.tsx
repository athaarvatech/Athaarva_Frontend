"use client";

import React from "react";
import { 
  TrendingDown, 
  TrendingUp, 
  Package, 
  Calendar, 
  ShoppingCart,
  AlertTriangle,
  Clock,
  Percent,
  Activity
} from "lucide-react";
import { toast } from "sonner";

import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface MedicineInsight {
  id: string;
  name: string;
  batchNo: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  avgDailySales: number;
  daysUntilExpiry: number;
  daysUntilStockout: number | null;
  lastRestocked: string;
  pricePerUnit: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
}

interface InventoryHoverCardProps {
  medicine: MedicineInsight;
  trigger: React.ReactNode;
  onQuickReorder?: (medicineId: string, suggestedQty: number) => void;
  onCreateDiscount?: (medicineId: string) => void;
  onRemoveStock?: (medicineId: string) => void;
}

// Mini sparkline chart (simplified SVG)
function MiniSparkline({ trend }: { trend: "up" | "down" | "stable" }) {
  const defaultData = trend === "up" 
    ? [2, 3, 2, 4, 3, 5, 4, 6] 
    : trend === "down" 
    ? [6, 5, 4, 5, 3, 4, 2, 3] 
    : [3, 3, 4, 3, 4, 3, 4, 3];
  
  const chartData = defaultData;
  const max = Math.max(...chartData);
  const min = Math.min(...chartData);
  const range = max - min || 1;
  
  const points = chartData.map((value, i) => {
    const x = (i / (chartData.length - 1)) * 50;
    const y = 16 - ((value - min) / range) * 12;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="50" height="20" className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "#6b7280"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InventoryHoverCard({ 
  medicine, 
  trigger,
  onQuickReorder,
  onCreateDiscount,
  onRemoveStock,
}: InventoryHoverCardProps) {
  const stockPercentage = (medicine.currentStock / medicine.maxStock) * 100;
  const isLowStock = medicine.currentStock <= medicine.minStock;
  const isExpiringSoon = medicine.daysUntilExpiry <= 30 && medicine.daysUntilExpiry > 0;
  const isExpired = medicine.daysUntilExpiry <= 0;
  
  const suggestedReorderQty = Math.max(
    medicine.maxStock - medicine.currentStock,
    medicine.avgDailySales * 30 // 30 days supply
  );

  const handleQuickReorder = () => {
    onQuickReorder?.(medicine.id, suggestedReorderQty);
    toast.success("Purchase order created", {
      description: `${medicine.name} x ${suggestedReorderQty} units`,
      action: {
        label: "View PO",
        onClick: () => console.log("View PO"),
      },
    });
  };

  const handleCreateDiscount = () => {
    onCreateDiscount?.(medicine.id);
    toast.success("Discount created", {
      description: `20% off applied to ${medicine.name}`,
    });
  };

  const handleRemoveStock = () => {
    onRemoveStock?.(medicine.id);
    toast.success("Stock removed", {
      description: `Expired stock of ${medicine.name} removed from inventory`,
    });
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {trigger}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 p-0" 
        side="right" 
        align="start"
        showArrow
      >
        {/* Header */}
        <div className={cn(
          "p-3 rounded-t-xl",
          isExpired ? "bg-red-50 dark:bg-red-950" :
          isExpiringSoon ? "bg-amber-50 dark:bg-amber-950" :
          isLowStock ? "bg-orange-50 dark:bg-orange-950" :
          "bg-green-50 dark:bg-green-950"
        )}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {medicine.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Batch: {medicine.batchNo}
              </p>
            </div>
            {isExpired ? (
              <Badge variant="destructive" className="text-xs">Expired</Badge>
            ) : isExpiringSoon ? (
              <Badge className="bg-amber-500 text-xs">Expiring Soon</Badge>
            ) : isLowStock ? (
              <Badge className="bg-orange-500 text-xs">Low Stock</Badge>
            ) : (
              <Badge className="bg-green-500 text-xs">In Stock</Badge>
            )}
          </div>
        </div>

        <div className="p-3 space-y-3">
          {/* Stock Level Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Stock Level</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {medicine.currentStock} / {medicine.maxStock}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  stockPercentage < 20 ? "bg-red-500" :
                  stockPercentage < 40 ? "bg-orange-500" :
                  stockPercentage < 60 ? "bg-amber-500" :
                  "bg-green-500"
                )}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              />
            </div>
          </div>

          <Separator />

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {/* Sales Trend */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                medicine.trend === "up" ? "bg-green-100 dark:bg-green-900" :
                medicine.trend === "down" ? "bg-red-100 dark:bg-red-900" :
                "bg-gray-100 dark:bg-gray-800"
              )}>
                {medicine.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : medicine.trend === "down" ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Activity className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Sales Trend</p>
                <div className="flex items-center gap-1">
                  <MiniSparkline trend={medicine.trend} />
                  <span className={cn(
                    "text-xs font-medium",
                    medicine.trend === "up" ? "text-green-600" :
                    medicine.trend === "down" ? "text-red-600" :
                    "text-gray-600"
                  )}>
                    {medicine.trend === "up" ? "+" : ""}{medicine.trendPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Sales */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Avg Daily Sales</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {medicine.avgDailySales} units
                </p>
              </div>
            </div>

            {/* Days Until Expiry */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isExpired ? "bg-red-100 dark:bg-red-900" :
                isExpiringSoon ? "bg-amber-100 dark:bg-amber-900" :
                "bg-gray-100 dark:bg-gray-800"
              )}>
                <Calendar className={cn(
                  "h-4 w-4",
                  isExpired ? "text-red-600" :
                  isExpiringSoon ? "text-amber-600" :
                  "text-gray-600"
                )} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Expiry</p>
                <p className={cn(
                  "text-sm font-semibold",
                  isExpired ? "text-red-600" :
                  isExpiringSoon ? "text-amber-600" :
                  "text-gray-900 dark:text-gray-100"
                )}>
                  {isExpired ? "Expired" : `${medicine.daysUntilExpiry} days`}
                </p>
              </div>
            </div>

            {/* Stockout Prediction */}
            {medicine.daysUntilStockout !== null && (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  medicine.daysUntilStockout <= 7 ? "bg-red-100 dark:bg-red-900" :
                  medicine.daysUntilStockout <= 14 ? "bg-orange-100 dark:bg-orange-900" :
                  "bg-gray-100 dark:bg-gray-800"
                )}>
                  <Clock className={cn(
                    "h-4 w-4",
                    medicine.daysUntilStockout <= 7 ? "text-red-600" :
                    medicine.daysUntilStockout <= 14 ? "text-orange-600" :
                    "text-gray-600"
                  )} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Stockout In</p>
                  <p className={cn(
                    "text-sm font-semibold",
                    medicine.daysUntilStockout <= 7 ? "text-red-600" :
                    medicine.daysUntilStockout <= 14 ? "text-orange-600" :
                    "text-gray-900 dark:text-gray-100"
                  )}>
                    ~{medicine.daysUntilStockout} days
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="flex gap-2">
            {isLowStock && !isExpired && (
              <Button 
                size="sm" 
                className="flex-1 h-8 text-xs"
                onClick={handleQuickReorder}
              >
                <Package className="h-3 w-3 mr-1" />
                Reorder ({suggestedReorderQty})
              </Button>
            )}
            {isExpiringSoon && !isExpired && (
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 h-8 text-xs"
                onClick={handleCreateDiscount}
              >
                <Percent className="h-3 w-3 mr-1" />
                20% Discount
              </Button>
            )}
            {isExpired && (
              <Button 
                size="sm" 
                variant="destructive"
                className="flex-1 h-8 text-xs"
                onClick={handleRemoveStock}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Remove Stock
              </Button>
            )}
            {!isLowStock && !isExpiringSoon && !isExpired && (
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 h-8 text-xs"
              >
                View Details
              </Button>
            )}
          </div>

          {/* Last Restocked */}
          <p className="text-[10px] text-gray-400 text-center">
            Last restocked: {medicine.lastRestocked}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default InventoryHoverCard;
