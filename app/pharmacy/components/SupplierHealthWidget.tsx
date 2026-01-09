"use client";

import React from "react";
import { 
  Truck, 
  Star, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Package,
  ChevronRight,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Supplier {
  id: string;
  name: string;
  rating: "A" | "B" | "C" | "D";
  onTimeRate: number;
  returnsThisMonth: number;
  priceChange?: number;
  topItem?: string;
  status: "excellent" | "good" | "warning" | "critical";
}

interface SupplierHealthWidgetProps {
  suppliers?: Supplier[];
}

export function SupplierHealthWidget({ suppliers: propSuppliers }: SupplierHealthWidgetProps) {
  // Default suppliers - would come from API
  const defaultSuppliers: Supplier[] = [
    {
      id: "1",
      name: "MedSupply India",
      rating: "A",
      onTimeRate: 98,
      returnsThisMonth: 0,
      topItem: "Paracetamol",
      status: "excellent",
    },
    {
      id: "2",
      name: "PharmaCorp",
      rating: "B",
      onTimeRate: 87,
      returnsThisMonth: 2,
      priceChange: 5,
      topItem: "Amoxicillin",
      status: "good",
    },
    {
      id: "3",
      name: "GenericMeds Ltd",
      rating: "C",
      onTimeRate: 72,
      returnsThisMonth: 5,
      priceChange: 12,
      topItem: "Omeprazole",
      status: "warning",
    },
  ];

  const suppliers = propSuppliers || defaultSuppliers;

  const ratingColors = {
    A: "bg-green-100 text-green-700 border-green-200",
    B: "bg-blue-100 text-blue-700 border-blue-200",
    C: "bg-amber-100 text-amber-700 border-amber-200",
    D: "bg-red-100 text-red-700 border-red-200",
  };

  const statusColors = {
    excellent: "border-l-green-500",
    good: "border-l-blue-500",
    warning: "border-l-amber-500",
    critical: "border-l-red-500",
  };

  const bestSupplier = suppliers.find(s => s.status === "excellent") || suppliers[0];
  const needsAttention = suppliers.filter(s => s.status === "warning" || s.status === "critical");

  return (
    <div className="relative bg-gradient-to-br from-slate-50/30 via-white to-blue-50/20 rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
      {/* Decorative blur orbs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Truck className="h-5 w-5 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Supplier Health</h3>
        </div>
        <Link href="/pharmacy/suppliers">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500 hover:text-healthcare-primary">
            View All
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Best Performer Highlight */}
      <div className="mx-5 mb-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-green-800">Best Performer</p>
              <Badge className={cn("text-[10px]", ratingColors[bestSupplier.rating])}>
                {bestSupplier.rating}
              </Badge>
            </div>
            <p className="text-xs text-green-700">
              {bestSupplier.name} • {bestSupplier.onTimeRate}% on-time • 0 returns
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-3 w-3",
                  star <= (bestSupplier.rating === "A" ? 5 : bestSupplier.rating === "B" ? 4 : 3)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Needs Attention Section */}
      {needsAttention.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Needs Attention
          </p>
          <div className="space-y-3">
            {needsAttention.map((supplier) => (
              <div
                key={supplier.id}
                className={cn(
                  "flex items-center gap-4 p-3.5 rounded-xl border border-l-4 bg-white hover:shadow-sm transition-all cursor-pointer",
                  statusColors[supplier.status]
                )}
              >
                <Badge className={cn("text-[10px] px-1.5", ratingColors[supplier.rating])}>
                  {supplier.rating}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {supplier.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {supplier.onTimeRate}% on-time
                    </span>
                    {supplier.returnsThisMonth > 0 && (
                      <span className="flex items-center gap-1 text-red-600">
                        <Package className="h-3 w-3" />
                        {supplier.returnsThisMonth} returns
                      </span>
                    )}
                  </div>
                </div>
                {supplier.priceChange && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    supplier.priceChange > 0 ? "text-red-600" : "text-green-600"
                  )}>
                    {supplier.priceChange > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {supplier.priceChange > 0 ? "+" : ""}{supplier.priceChange}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Alert */}
      <div className="mx-5 mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-amber-600" />
          <div className="flex-1">
            <p className="text-xs font-medium text-amber-800">
              Price Alert: GenericMeds raised Omeprazole by 12%
            </p>
            <p className="text-[10px] text-amber-600 mt-0.5">
              Consider alternate supplier for better rates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
