"use client";

import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Package,
  Clock,
  ShoppingCart,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StockPrediction {
  medicineName: string;
  currentStock: number;
  avgDailySales: number;
  daysUntilStockout: number;
  velocityChange: number;
  suggestedReorderQty: number;
  reorderBy: string;
}

interface PredictiveStockWidgetProps {
  predictions?: StockPrediction[];
}

export function PredictiveStockWidget({ predictions: propPredictions }: PredictiveStockWidgetProps) {
  // Default predictions - would come from API
  const defaultPredictions: StockPrediction[] = [
    {
      medicineName: "Paracetamol 500mg",
      currentStock: 150,
      avgDailySales: 45,
      daysUntilStockout: 3,
      velocityChange: 45.2,
      suggestedReorderQty: 500,
      reorderBy: "Tomorrow",
    },
    {
      medicineName: "Omeprazole 20mg",
      currentStock: 80,
      avgDailySales: 12,
      daysUntilStockout: 7,
      velocityChange: 15,
      suggestedReorderQty: 200,
      reorderBy: "Friday",
    },
    {
      medicineName: "Azithromycin 500mg",
      currentStock: 45,
      avgDailySales: 5,
      daysUntilStockout: 9,
      velocityChange: -8,
      suggestedReorderQty: 100,
      reorderBy: "Next Week",
    },
  ];

  const predictions = propPredictions || defaultPredictions;

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return "text-red-600 bg-red-50 border-red-200";
    if (days <= 7) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  const getProgressColor = (days: number) => {
    if (days <= 3) return "[&>div]:bg-red-500";
    if (days <= 7) return "[&>div]:bg-amber-500";
    return "[&>div]:bg-blue-500";
  };

  return (
    <div className="relative bg-gradient-to-br from-cyan-50/30 via-white to-blue-50/20 rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
      {/* Decorative blur orbs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-100 flex items-center justify-center">
            <Zap className="h-5 w-5 text-cyan-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Stock Predictions</h3>
        </div>
        <Badge variant="outline" className="text-[10px]">
          AI Powered
        </Badge>
      </div>

      {/* Predictions List */}
      <div className="p-5 pt-2 space-y-4">
        {predictions.map((prediction, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all cursor-pointer"
          >
            {/* Medicine Name & Velocity */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                  {prediction.medicineName}
                </p>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                prediction.velocityChange > 0 ? "text-green-600" : "text-gray-500"
              )}>
                {prediction.velocityChange > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3" />
                    +{prediction.velocityChange}% faster
                  </>
                ) : prediction.velocityChange < 0 ? (
                  <>
                    <TrendingDown className="h-3 w-3" />
                    {prediction.velocityChange}% slower
                  </>
                ) : (
                  <span className="text-gray-400">Stable</span>
                )}
              </div>
            </div>

            {/* Stock Level Progress */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">
                  {prediction.currentStock} units remaining
                </span>
                <span className="text-gray-400">
                  ~{prediction.avgDailySales}/day
                </span>
              </div>
              <Progress 
                value={Math.min(100, (prediction.daysUntilStockout / 14) * 100)} 
                className={cn("h-1.5", getProgressColor(prediction.daysUntilStockout))}
              />
            </div>

            {/* Prediction & Action */}
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={cn("text-[10px]", getUrgencyColor(prediction.daysUntilStockout))}
              >
                <Clock className="h-3 w-3 mr-1" />
                Stock-out in {prediction.daysUntilStockout} days
              </Badge>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Reorder</span>
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-[10px]">
                  {prediction.suggestedReorderQty} units by {prediction.reorderBy}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-Reorder Suggestion */}
      <div className="mx-5 mb-5 p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-cyan-500 flex items-center justify-center">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-cyan-800">
              Auto-Reorder Available
            </p>
            <p className="text-[10px] text-cyan-600">
              3 items can be automatically reordered based on predictions
            </p>
          </div>
          <Badge className="bg-cyan-500 hover:bg-cyan-600 text-white text-[10px] cursor-pointer">
            Enable
          </Badge>
        </div>
      </div>
    </div>
  );
}
