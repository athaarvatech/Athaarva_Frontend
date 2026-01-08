"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Receipt,
  IndianRupee,
  Percent,
  Calculator,
  ChevronUp,
  ChevronDown,
  Save,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { StockEntryItem, InvoiceTotals } from "../types";
import { formatCurrency, calculateLineTotal } from "../types";

interface FloatingTotalCardProps {
  items: StockEntryItem[];
  onSaveInvoice?: () => void;
  onPrintInvoice?: () => void;
  isSubmitting?: boolean;
}

export function FloatingTotalCard({
  items,
  onSaveInvoice,
  onPrintInvoice,
  isSubmitting = false,
}: FloatingTotalCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  // Calculate all totals
  const totals: InvoiceTotals = useMemo(() => {
    let subtotal = 0;
    let totalQty = 0;
    let totalDiscount = 0;
    let totalGst = 0;

    items.forEach((item) => {
      const lineCalc = calculateLineTotal(
        item.qty,
        item.rate,
        item.discountPercent,
        item.gstPercent
      );
      subtotal += lineCalc.amount;
      totalQty += item.qty + item.freeQty;
      totalDiscount += lineCalc.discount;
      totalGst += lineCalc.gst;
    });

    const sgst = totalGst / 2;
    const cgst = totalGst / 2;
    const grandTotal = subtotal - totalDiscount + totalGst;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalItems: items.length,
      totalQty,
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      totalGst: parseFloat(totalGst.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden min-w-[320px]">
        {/* Header - Always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full px-4 py-3 flex items-center justify-between transition-colors",
            "bg-gradient-to-r from-healthcare-primary to-healthcare-secondary",
            "hover:from-healthcare-primary/90 hover:to-healthcare-secondary/90"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-white/80">Invoice Total</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(totals.grandTotal)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium text-white">
              {totals.totalItems} items
            </span>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-white/80" />
            ) : (
              <ChevronUp className="h-5 w-5 text-white/80" />
            )}
          </div>
        </button>

        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 space-y-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calculator className="h-4 w-4" />
                    <span>Subtotal</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>

                {/* Discount */}
                {totals.totalDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Percent className="h-4 w-4" />
                      <span>Discount</span>
                    </div>
                    <span className="font-medium text-green-600">
                      - {formatCurrency(totals.totalDiscount)}
                    </span>
                  </div>
                )}

                {/* Tax Breakdown */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>SGST</span>
                    <span>{formatCurrency(totals.sgst)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>CGST</span>
                    <span>{formatCurrency(totals.cgst)}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Total GST</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(totals.totalGst)}
                    </span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="bg-healthcare-primary/5 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-healthcare-primary" />
                      <span className="font-semibold text-gray-900">
                        Grand Total
                      </span>
                    </div>
                    <span className="text-xl font-bold text-healthcare-primary">
                      {formatCurrency(totals.grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Quantity Summary */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-1">
                  <span>
                    <strong className="text-gray-700">{totals.totalItems}</strong> items
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-gray-700">{totals.totalQty}</strong> total qty
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {onPrintInvoice && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPrintInvoice}
                      className="flex-1 gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                  )}
                  {onSaveInvoice && (
                    <Button
                      size="sm"
                      onClick={onSaveInvoice}
                      disabled={isSubmitting}
                      className="flex-1 gap-2 bg-healthcare-primary hover:bg-healthcare-secondary"
                    >
                      <Save className="h-4 w-4" />
                      {isSubmitting ? "Saving..." : "Save Invoice"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
