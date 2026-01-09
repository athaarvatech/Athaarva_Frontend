"use client";

import React, { useState, useEffect } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicineCombobox } from "./MedicineCombobox";
import { ExpiryPicker } from "./ExpiryPicker";
import {
  type StockEntryFormState,
  type StockEntryItem,
  type PackType,
  type GSTRate,
  type Medicine,
  PACK_OPTIONS,
  GST_OPTIONS,
  DEFAULT_FORM_STATE,
  calculateAmount,
  calculateNetRate,
  formatExpiry,
  getExpiryDate,
  isExpiringSoon,
  isExpired,
  generateId,
} from "../types";

interface StockEntryFormStripProps {
  onAddItem: (item: StockEntryItem) => void;
  editingItem?: StockEntryItem | null;
  onCancelEdit?: () => void;
}

export function StockEntryFormStrip({
  onAddItem,
  editingItem,
  onCancelEdit,
}: StockEntryFormStripProps) {
  const [formState, setFormState] = useState<StockEntryFormState>(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof StockEntryFormState, string>>>({});

  // Computed values
  const amount = calculateAmount(formState.qty, formState.rate);
  const netRate = calculateNetRate(
    formState.rate,
    formState.discountPercent,
    formState.gstPercent
  );

  // Load editing item into form
  useEffect(() => {
    if (editingItem) {
      const { month, year } = parseExpiryString(editingItem.expiry);
      setFormState({
        medicineName: editingItem.medicineName,
        medicineId: editingItem.medicineId,
        hsn: editingItem.hsn,
        batchNo: editingItem.batchNo,
        expiryMonth: month,
        expiryYear: year,
        pack: editingItem.pack,
        qty: editingItem.qty,
        freeQty: editingItem.freeQty,
        rate: editingItem.rate,
        discountPercent: editingItem.discountPercent,
        gstPercent: editingItem.gstPercent,
        mrp: editingItem.mrp,
      });
    }
  }, [editingItem]);

  function parseExpiryString(expiry: string): { month: number; year: number } {
    const months: Record<string, number> = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
      Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
    };
    const [monthStr, yearStr] = expiry.split("-");
    return {
      month: months[monthStr] || 1,
      year: 2000 + parseInt(yearStr, 10),
    };
  }

  const handleMedicineSelect = (name: string, medicine?: Medicine) => {
    setFormState((prev) => ({
      ...prev,
      medicineName: name,
      medicineId: medicine?.id,
      hsn: medicine?.hsn || prev.hsn,
      pack: medicine?.defaultPack || prev.pack,
      gstPercent: medicine?.defaultGst || prev.gstPercent,
    }));
    if (errors.medicineName) {
      setErrors((prev) => ({ ...prev, medicineName: undefined }));
    }
  };

  const handleChange = (
    field: keyof StockEntryFormState,
    value: string | number
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Enforce uppercase for batch numbers
    const value = e.target.value.toUpperCase();
    handleChange("batchNo", value);
  };

  const handleNumberChange = (
    field: keyof StockEntryFormState,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    handleChange(field, value);
  };

  const handleExpiryChange = (month: number, year: number) => {
    setFormState((prev) => ({
      ...prev,
      expiryMonth: month,
      expiryYear: year,
    }));
    if (errors.expiryMonth || errors.expiryYear) {
      setErrors((prev) => ({
        ...prev,
        expiryMonth: undefined,
        expiryYear: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StockEntryFormState, string>> = {};

    if (!formState.medicineName.trim()) {
      newErrors.medicineName = "Medicine name is required";
    }
    if (!formState.batchNo.trim()) {
      newErrors.batchNo = "Batch number is required";
    }
    if (formState.qty <= 0) {
      newErrors.qty = "Quantity must be greater than 0";
    }
    if (formState.rate <= 0) {
      newErrors.rate = "Rate must be greater than 0";
    }
    if (formState.mrp <= 0) {
      newErrors.mrp = "MRP is required";
    }

    const expiryDate = getExpiryDate(formState.expiryMonth, formState.expiryYear);
    if (isExpired(expiryDate)) {
      newErrors.expiryMonth = "Cannot add expired medicine";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validate()) return;

    const expiryDate = getExpiryDate(formState.expiryMonth, formState.expiryYear);
    
    const item: StockEntryItem = {
      id: editingItem?.id || generateId(),
      medicineId: formState.medicineId,
      medicineName: formState.medicineName,
      hsn: formState.hsn,
      batchNo: formState.batchNo,
      expiry: formatExpiry(formState.expiryMonth, formState.expiryYear),
      expiryDate,
      pack: formState.pack,
      qty: formState.qty,
      freeQty: formState.freeQty,
      rate: formState.rate,
      amount,
      discountPercent: formState.discountPercent,
      gstPercent: formState.gstPercent,
      netRate,
      mrp: formState.mrp,
      isExpiringSoon: isExpiringSoon(expiryDate),
      isExpired: isExpired(expiryDate),
    };

    onAddItem(item);
    resetForm();
  };

  const resetForm = () => {
    setFormState(DEFAULT_FORM_STATE);
    setErrors({});
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-healthcare-primary/5 to-healthcare-secondary/5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            {editingItem ? "Edit Medicine Entry" : "Add New Medicine"}
          </h3>
          <span className="text-xs text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Enter</kbd> to add
          </span>
        </div>
      </div>

      {/* Form Fields - Horizontal Layout */}
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <div className="p-4 space-y-4">
          {/* Row 1: Medicine Name, HSN, Batch, Expiry */}
          <div className="grid grid-cols-12 gap-3">
            {/* Medicine Name - 4 cols */}
            <div className="col-span-12 md:col-span-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Medicine Name <span className="text-red-500">*</span>
              </label>
              <MedicineCombobox
                value={formState.medicineName}
                onChange={handleMedicineSelect}
                error={errors.medicineName}
                autoFocus={!editingItem}
              />
            </div>

            {/* HSN - 2 cols */}
            <div className="col-span-6 md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                HSN Code
              </label>
              <Input
                type="text"
                value={formState.hsn}
                onChange={(e) => handleChange("hsn", e.target.value)}
                placeholder="30049099"
                className="h-10 text-sm"
              />
            </div>

            {/* Batch No - 3 cols */}
            <div className="col-span-6 md:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Batch No. <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formState.batchNo}
                onChange={handleBatchChange}
                placeholder="ABC123"
                className={cn(
                  "h-10 text-sm uppercase font-mono",
                  errors.batchNo && "border-red-400"
                )}
              />
              {errors.batchNo && (
                <p className="mt-1 text-xs text-red-500">{errors.batchNo}</p>
              )}
            </div>

            {/* Expiry - 3 cols */}
            <div className="col-span-12 md:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Expiry <span className="text-red-500">*</span>
              </label>
              <ExpiryPicker
                month={formState.expiryMonth}
                year={formState.expiryYear}
                onChange={handleExpiryChange}
                error={errors.expiryMonth}
              />
            </div>
          </div>

          {/* Row 2: Pack, Qty, Free, Rate, Amount, Disc%, GST%, Net Rate, MRP */}
          <div className="grid grid-cols-12 gap-3">
            {/* Pack - 1.5 cols */}
            <div className="col-span-4 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Pack
              </label>
              <Select
                value={formState.pack}
                onValueChange={(value) => handleChange("pack", value as PackType)}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PACK_OPTIONS.map((pack) => (
                    <SelectItem key={pack} value={pack}>
                      {pack}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Qty - 1 col */}
            <div className="col-span-4 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                QTY <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                value={formState.qty || ""}
                onChange={(e) => handleNumberChange("qty", e)}
                placeholder="0"
                className={cn(
                  "h-10 text-sm text-center font-medium",
                  errors.qty && "border-red-400"
                )}
              />
            </div>

            {/* Free - 1 col */}
            <div className="col-span-4 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                FREE
              </label>
              <Input
                type="number"
                min="0"
                value={formState.freeQty || ""}
                onChange={(e) => handleNumberChange("freeQty", e)}
                placeholder="0"
                className="h-10 text-sm text-center"
              />
            </div>

            {/* Rate - 1.5 cols */}
            <div className="col-span-4 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Rate <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formState.rate || ""}
                onChange={(e) => handleNumberChange("rate", e)}
                placeholder="0.00"
                className={cn(
                  "h-10 text-sm text-right font-medium",
                  errors.rate && "border-red-400"
                )}
              />
            </div>

            {/* Amount (Read-only) - 1.5 cols */}
            <div className="col-span-4 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Amount
              </label>
              <Input
                type="text"
                value={amount.toFixed(2)}
                readOnly
                className="h-10 text-sm text-right bg-gray-50 font-semibold text-healthcare-primary"
              />
            </div>

            {/* Discount % - 1 col */}
            <div className="col-span-4 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Disc %
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formState.discountPercent || ""}
                onChange={(e) => handleNumberChange("discountPercent", e)}
                placeholder="0"
                className="h-10 text-sm text-center"
              />
            </div>

            {/* GST % - 1.5 cols */}
            <div className="col-span-6 md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                GST %
              </label>
              <Select
                value={formState.gstPercent.toString()}
                onValueChange={(value) =>
                  handleChange("gstPercent", parseInt(value) as GSTRate)
                }
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GST_OPTIONS.map((gst) => (
                    <SelectItem key={gst.value} value={gst.value.toString()}>
                      {gst.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Net Rate (Read-only) - 1.5 cols */}
            <div className="col-span-6 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                N. Rate
              </label>
              <Input
                type="text"
                value={netRate.toFixed(2)}
                readOnly
                className="h-10 text-sm text-right bg-gray-50 font-semibold text-gray-700"
              />
            </div>

            {/* MRP - 1.5 cols */}
            <div className="col-span-6 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                MRP <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formState.mrp || ""}
                onChange={(e) => handleNumberChange("mrp", e)}
                placeholder="0.00"
                className={cn(
                  "h-10 text-sm text-right font-medium",
                  errors.mrp && "border-red-400"
                )}
              />
            </div>

            {/* Action Buttons - 2 cols */}
            <div className="col-span-6 md:col-span-2 flex items-end gap-2">
              <Button
                type="submit"
                className="flex-1 h-10 bg-healthcare-primary hover:bg-healthcare-secondary text-white font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                {editingItem ? "Update" : "Add"}
              </Button>
              {(editingItem || formState.medicineName) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="h-10 px-3"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
