"use client";

import React from "react";
import { 
  Trash2, 
  ShoppingCart, 
  RotateCcw, 
  Percent, 
  FileSpreadsheet,
  Zap,
  Mail,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

interface QuickAction {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  count?: number;
  onClick?: () => void;
  href?: string;
}

interface QuickActionsBarProps {
  expiredCount?: number;
  lowStockCount?: number;
  expiringSoonCount?: number;
}

export function QuickActionsBar({ 
  expiredCount = 3, 
  lowStockCount = 5, 
  expiringSoonCount = 8 
}: QuickActionsBarProps) {

  const handleClearExpired = () => {
    toast.success("Marked for disposal", {
      description: `${expiredCount} expired items marked for removal`,
    });
  };

  const handleReorderLowStock = () => {
    toast.success("Purchase order created", {
      description: `Auto-generated PO for ${lowStockCount} low stock items`,
    });
  };

  const handleApplyDiscount = () => {
    toast("Discount wizard opened", {
      description: `${expiringSoonCount} items eligible for bulk discount`,
    });
  };

  const handleEmailSupplier = () => {
    toast.info("Email draft ready", {
      description: "Pre-drafted return request email opened",
    });
  };

  const handleGenerateReport = () => {
    toast.success("Report generating...", {
      description: "Inventory report will download shortly",
    });
  };

  const quickActions: QuickAction[] = [
    {
      id: "clear-expired",
      title: "Clear Expired",
      icon: Trash2,
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100 border-red-200",
      count: expiredCount,
      onClick: handleClearExpired,
    },
    {
      id: "reorder-low",
      title: "Reorder Low Stock",
      icon: ShoppingCart,
      color: "text-amber-600",
      bgColor: "bg-amber-50 hover:bg-amber-100 border-amber-200",
      count: lowStockCount,
      onClick: handleReorderLowStock,
    },
    {
      id: "bulk-discount",
      title: "Apply Discount",
      icon: Percent,
      color: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      count: expiringSoonCount,
      onClick: handleApplyDiscount,
    },
    {
      id: "email-supplier",
      title: "Email Supplier",
      icon: Mail,
      color: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      onClick: handleEmailSupplier,
    },
    {
      id: "generate-report",
      title: "Generate Report",
      icon: FileSpreadsheet,
      color: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100 border-green-200",
      onClick: handleGenerateReport,
    },
  ];

  return (
    <div className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
        <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <Zap className="h-4 w-4 text-amber-500" />
        </div>
        <span className="text-base font-semibold text-gray-700">Quick Actions</span>
        <Badge variant="outline" className="text-[10px] ml-auto">One-click shortcuts</Badge>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-5 gap-4 p-5">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className={cn(
              "h-auto flex flex-col items-center gap-3 py-5 px-4 transition-all",
              "border rounded-xl",
              action.bgColor
            )}
            onClick={action.onClick}
          >
            <div className="relative">
              <action.icon className={cn("h-6 w-6", action.color)} />
              {action.count !== undefined && action.count > 0 && (
                <Badge 
                  className="absolute -top-2 -right-3 h-4 min-w-4 px-1 text-[9px] bg-gray-800 hover:bg-gray-800"
                >
                  {action.count}
                </Badge>
              )}
            </div>
            <span className={cn("text-sm font-medium text-center leading-tight", action.color)}>
              {action.title}
            </span>
          </Button>
        ))}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Pro tip: Use keyboard shortcuts for faster navigation</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">K</kbd>
              <span className="ml-1">Search</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">N</kbd>
              <span className="ml-1">New Entry</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
