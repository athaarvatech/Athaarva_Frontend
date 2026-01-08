"use client";

import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import {
  VendorCombobox,
  StockEntryFormStrip,
  InventoryTable,
  FloatingTotalCard,
} from "../components";

import type { Vendor, StockEntryItem } from "../types";

export default function StockEntryPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  // Invoice header state
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Items state
  const [items, setItems] = useState<StockEntryItem[]>([]);
  const [editingItem, setEditingItem] = useState<StockEntryItem | null>(null);

  // UI state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Add item handler
  const handleAddItem = useCallback((item: StockEntryItem) => {
    setItems((prev) => {
      // Check if we're editing an existing item
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = item;
        toast.success("Item updated successfully");
        return updated;
      }
      toast.success(`Added ${item.medicineName} to invoice`);
      return [...prev, item];
    });
    setEditingItem(null);
  }, []);

  // Edit item handler
  const handleEditItem = useCallback((item: StockEntryItem) => {
    setEditingItem(item);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Delete item handler
  const handleDeleteItem = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteConfirmId) {
      setItems((prev) => prev.filter((item) => item.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      toast.success("Item removed from invoice");
    }
  }, [deleteConfirmId]);

  // Export to Excel handler
  const handleExportExcel = useCallback(async () => {
    if (items.length === 0) {
      toast.error("No items to export");
      return;
    }

    try {
      // Dynamic import xlsx
      const XLSX = await import("xlsx");

      // Prepare data for Excel
      const excelData = items.map((item, index) => ({
        "S.No": index + 1,
        "Medicine Name": item.medicineName,
        "HSN": item.hsn,
        "Batch No": item.batchNo,
        "Expiry": item.expiry,
        "Pack": item.pack,
        "Qty": item.qty,
        "Free": item.freeQty,
        "Rate": item.rate,
        "Amount": item.amount,
        "Disc %": item.discountPercent,
        "GST %": item.gstPercent,
        "Net Rate": item.netRate,
        "MRP": item.mrp,
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      ws["!cols"] = [
        { wch: 5 },  // S.No
        { wch: 30 }, // Medicine Name
        { wch: 12 }, // HSN
        { wch: 12 }, // Batch No
        { wch: 10 }, // Expiry
        { wch: 8 },  // Pack
        { wch: 6 },  // Qty
        { wch: 6 },  // Free
        { wch: 10 }, // Rate
        { wch: 12 }, // Amount
        { wch: 8 },  // Disc %
        { wch: 8 },  // GST %
        { wch: 10 }, // Net Rate
        { wch: 10 }, // MRP
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Stock Entry");

      // Generate filename
      const vendorName = vendor?.name?.replace(/[^a-zA-Z0-9]/g, "_") || "Vendor";
      const dateStr = format(new Date(invoiceDate), "yyyy-MM-dd");
      const filename = `Stock_Entry_${vendorName}_${invoiceNo || dateStr}.xlsx`;

      // Download
      XLSX.writeFile(wb, filename);
      toast.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export Excel file");
    }
  }, [items, vendor, invoiceNo, invoiceDate]);

  // Save invoice handler
  const handleSaveInvoice = useCallback(async () => {
    // Validation
    if (!vendor) {
      toast.error("Please select a vendor");
      return;
    }
    if (!invoiceNo.trim()) {
      toast.error("Please enter invoice number");
      return;
    }
    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Success
    setIsSaving(false);
    setShowSuccessModal(true);
    toast.success("Invoice saved successfully!");
  }, [vendor, invoiceNo, items]);

  // Print handler
  const handlePrintInvoice = useCallback(() => {
    window.print();
  }, []);

  // Cancel edit handler
  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
  }, []);

  // Reset form for new invoice
  const handleNewInvoice = useCallback(() => {
    setVendor(null);
    setInvoiceNo("");
    setInvoiceDate(format(new Date(), "yyyy-MM-dd"));
    setItems([]);
    setEditingItem(null);
    setShowSuccessModal(false);
  }, []);

  return (
    <div className="space-y-6 pb-32">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/hospital/${subdomain}/admin/pharmacy`}>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Stock In / Purchase Entry
            </h1>
            <p className="text-gray-600">
              Add medicines from vendor invoice to inventory
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <Button variant="outline" onClick={handleNewInvoice}>
              New Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Vendor Selection */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="h-4 w-4 inline mr-2 text-gray-400" />
                  Vendor / Supplier <span className="text-red-500">*</span>
                </label>
                <VendorCombobox
                  selectedVendor={vendor}
                  onVendorSelect={setVendor}
                  onAddNew={() => toast.info("Add vendor feature coming soon!")}
                />
              </div>

              {/* Invoice Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-2 text-gray-400" />
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value.toUpperCase())}
                  placeholder="INV-2025-0001"
                  className="h-10 uppercase font-mono"
                />
              </div>

              {/* Invoice Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2 text-gray-400" />
                  Invoice Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {/* Vendor Details Display */}
            {vendor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                  <span>
                    <strong>GSTIN:</strong> {vendor.gstin || "N/A"}
                  </span>
                  <span>
                    <strong>Drug License:</strong> {vendor.drugLicenseNo || "N/A"}
                  </span>
                  <span>
                    <strong>Phone:</strong> {vendor.phone || "N/A"}
                  </span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Medicine Entry Form Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <StockEntryFormStrip
          onAddItem={handleAddItem}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />
      </motion.div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <InventoryTable
          items={items}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onExportExcel={handleExportExcel}
        />
      </motion.div>

      {/* Floating Total Card */}
      <FloatingTotalCard
        items={items}
        onSaveInvoice={handleSaveInvoice}
        onPrintInvoice={handlePrintInvoice}
        isSubmitting={isSaving}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this item from the invoice? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Invoice Saved Successfully
            </DialogTitle>
            <DialogDescription>
              The purchase entry has been saved to the inventory. All {items.length}{" "}
              items have been added to stock.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Vendor:</span>
              <span className="font-medium">{vendor?.name}</span>
              <span className="text-gray-600">Invoice No:</span>
              <span className="font-medium font-mono">{invoiceNo}</span>
              <span className="text-gray-600">Items:</span>
              <span className="font-medium">{items.length}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuccessModal(false)}>
              View Invoice
            </Button>
            <Button
              onClick={handleNewInvoice}
              className="bg-healthcare-primary hover:bg-healthcare-secondary"
            >
              New Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
