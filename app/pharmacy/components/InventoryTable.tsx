"use client";

import React, { useMemo } from "react";
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

interface InventoryTableProps {
  items: StockEntryItem[];
  onEdit: (item: StockEntryItem) => void;
  onDelete: (id: string) => void;
  onExportExcel: () => void;
}

export function InventoryTable({
  items,
  onEdit,
  onDelete,
  onExportExcel,
}: InventoryTableProps) {
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
              <TableHead className="min-w-[200px]">Particulars</TableHead>
              <TableHead className="text-center">HSN</TableHead>
              <TableHead className="text-center">Batch</TableHead>
              <TableHead className="text-center">Expiry</TableHead>
              <TableHead className="text-center">Pack</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-center">Free</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Disc%</TableHead>
              <TableHead className="text-center">GST%</TableHead>
              <TableHead className="text-right">N.Rate</TableHead>
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
                  <div className="flex items-start gap-2">
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
                <TableCell className="text-center text-sm text-gray-600">
                  {item.discountPercent > 0 ? `${item.discountPercent}%` : "-"}
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600">
                  {item.gstPercent}%
                </TableCell>
                <TableCell className="text-right text-sm font-mono text-gray-700">
                  {formatCurrency(item.netRate)}
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
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Total Items: <span className="font-semibold">{items.length}</span>
          </p>
          <div className="flex items-center gap-6">
            <p className="text-sm text-gray-600">
              Total Qty: <span className="font-semibold">{totals.totalQty}</span>
              {totals.totalFreeQty > 0 && (
                <span className="text-green-600"> (+{totals.totalFreeQty} free)</span>
              )}
            </p>
            <p className="text-sm text-gray-600">
              Total Amount:{" "}
              <span className="font-bold text-healthcare-primary">
                {formatCurrency(totals.totalAmount)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
