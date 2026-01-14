"use client";

import React, { useMemo, useEffect } from "react";
import {
  Edit2,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import type { StockEntryItem } from "../types";
import { formatCurrency } from "../types";
import { usePharmacyAlerts } from "@/contexts/PharmacyAlertContext";
import { InventoryHoverCard } from "@/components/pharmacy/inventory-hover-card";

interface InventoryTableProps {
  items: StockEntryItem[];
  onEdit: (item: StockEntryItem) => void;
  onDelete: (id: string) => void;
  onExportExcel: () => void;
  onSaveInvoice?: () => void;
  onPrintInvoice?: () => void;
  isSubmitting?: boolean;
}

export function InventoryTable({
  items,
  onEdit,
  onDelete,
  onExportExcel,
  onSaveInvoice,
  onPrintInvoice,
  isSubmitting = false,
}: InventoryTableProps) {
  const { syncInventoryStats } = usePharmacyAlerts();

  // Sync inventory stats to alert system whenever items change
  useEffect(() => {
    if (items.length > 0) {
      syncInventoryStats(items);
    }
  }, [items, syncInventoryStats]);

  // Calculate totals
  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        totalQty: acc.totalQty + item.qty,
        totalFreeQty: acc.totalFreeQty + item.freeQty,
        totalAmount: acc.totalAmount + item.amount,
      }),
      { totalQty: 0, totalFreeQty: 0, totalAmount: 0 }
    );
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No items added yet
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Start adding medicines using the form above. Items will appear here
            as you add them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header with Export */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Invoice Items
          </h3>
          <Badge variant="secondary" className="bg-healthcare-primary/10 text-healthcare-primary">
            {items.length} {items.length === 1 ? "item" : "items"}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportExcel}
          className="gap-2 text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-10 text-center">#</TableHead>
              <TableHead className="min-w-[200px]">Medicine Name</TableHead>
              <TableHead className="text-center">HSN</TableHead>
              <TableHead className="text-center">Batch</TableHead>
              <TableHead className="text-center">Expiry</TableHead>
              <TableHead className="text-center">Pack</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-center">Free</TableHead>
              <TableHead className="text-right">Purchase Rate</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">MRP</TableHead>
              <TableHead className="text-center w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={item.id}
                className={cn(
                  "transition-colors",
                  // Zebra striping
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                  // Highlight expiring soon
                  item.isExpiringSoon && "bg-amber-50/50 hover:bg-amber-50",
                  item.isExpired && "bg-red-50/50 hover:bg-red-50"
                )}
              >
                <TableCell className="text-center font-medium text-gray-500">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <InventoryHoverCard
                    medicine={{
                      id: item.medicineId || item.id,
                      name: item.medicineName,
                      batchNo: item.batchNo,
                      currentStock: item.qty,
                      minStock: 20,
                      maxStock: 500,
                      trend: "stable",
                      trendPercent: 0,
                      avgDailySales: Math.floor(Math.random() * 20) + 5,
                      daysUntilExpiry: Math.floor((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
                      daysUntilStockout: item.qty < 50 ? Math.floor(item.qty / 5) : null,
                      lastRestocked: new Date().toISOString(),
                      pricePerUnit: item.rate,
                    }}
                    trigger={
                      <div className="flex items-start gap-2 cursor-pointer hover:text-healthcare-primary transition-colors">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {item.medicineName}
                          </p>
                          {item.medicineId && (
                            <p className="text-xs text-gray-500">
                              ID: {item.medicineId}
                            </p>
                          )}
                        </div>
                      </div>
                    }
                  />
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600 font-mono">
                  {item.hsn || "-"}
                </TableCell>
                <TableCell className="text-center">
                  <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-700">
                    {item.batchNo}
                  </code>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        item.isExpired && "text-red-600",
                        item.isExpiringSoon && !item.isExpired && "text-amber-600",
                        !item.isExpired && !item.isExpiringSoon && "text-gray-700"
                      )}
                    >
                      {item.expiry}
                    </span>
                    {(item.isExpired || item.isExpiringSoon) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle
                              className={cn(
                                "h-3.5 w-3.5",
                                item.isExpired ? "text-red-500" : "text-amber-500"
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {item.isExpired
                              ? "This medicine is expired!"
                              : "Expiring within 6 months"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600">
                  {item.pack}
                </TableCell>
                <TableCell className="text-center font-semibold text-gray-900">
                  {item.qty}
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600">
                  {item.freeQty || "-"}
                </TableCell>
                <TableCell className="text-right text-sm font-mono">
                  {formatCurrency(item.rate)}
                </TableCell>
                <TableCell className="text-right font-semibold text-healthcare-primary font-mono">
                  {formatCurrency(item.amount)}
                </TableCell>
                <TableCell className="text-right font-semibold text-gray-900 font-mono">
                  {formatCurrency(item.mrp)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-healthcare-primary hover:bg-healthcare-primary/10"
                            onClick={() => onEdit(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => onDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer with Totals */}
      <div className="border-t border-gray-200">
        {/* Summary Row */}
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between text-sm text-gray-600">
          <span>
            <strong className="text-gray-700">{items.length}</strong> items
          </span>
          <span>•</span>
          <span>
            <strong className="text-gray-700">{totals.totalQty}</strong> total qty
            {totals.totalFreeQty > 0 && (
              <span className="text-green-600 ml-1">(+{totals.totalFreeQty} free)</span>
            )}
          </span>
        </div>

        {/* Invoice Total Bar - Similar to your image */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Invoice Total</p>
                <p className="text-3xl font-bold">{formatCurrency(totals.totalAmount)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>

        {/* Subtotal Breakdown */}
        <div className="px-6 py-4 bg-white space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="h-4 w-4" />
              <span>Subtotal (Purchase Amount)</span>
            </div>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totals.totalAmount)}
            </span>
          </div>

          <div className="bg-teal-50 rounded-lg p-4 mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">₹</span>
                </div>
                <span className="font-semibold text-gray-900 text-lg">Total Amount</span>
              </div>
              <span className="text-2xl font-bold text-teal-600">
                {formatCurrency(totals.totalAmount)}
              </span>
            </div>
          </div>

          {/* Quantity Summary */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
            <span>
              <strong className="text-gray-700">{items.length}</strong> items
            </span>
            <span>•</span>
            <span>
              <strong className="text-gray-700">{totals.totalQty}</strong> total qty
            </span>
          </div>

          {/* Action Buttons */}
          {(onSaveInvoice || onPrintInvoice) && (
            <div className="flex gap-3 pt-4">
              {onPrintInvoice && (
                <Button
                  variant="outline"
                  onClick={onPrintInvoice}
                  className="flex-1 h-12 gap-2 text-base"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </Button>
              )}
              {onSaveInvoice && (
                <Button
                  onClick={onSaveInvoice}
                  disabled={isSubmitting}
                  className="flex-1 h-12 gap-2 text-base bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {isSubmitting ? "Saving..." : "Save Invoice"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
