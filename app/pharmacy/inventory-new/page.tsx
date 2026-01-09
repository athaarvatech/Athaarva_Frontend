"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Package,
  AlertTriangle,
  Clock,
  XCircle,
  Plus,
  TrendingUp,
} from "lucide-react";
import * as XLSX from "xlsx";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ModernInventoryTable, InventoryItem } from "@/components/pharmacy/modern-inventory-table";

// Mock inventory data with notes for expandable rows
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    medicineId: "med-1",
    medicineName: "Paracetamol 500mg",
    genericName: "Paracetamol",
    manufacturer: "Cipla Ltd",
    category: "Analgesics",
    hsn: "30049099",
    batchNo: "BAT001",
    expiry: "Dec-26",
    expiryDate: new Date(2026, 11, 31),
    pack: "10T",
    currentStock: 500,
    reorderLevel: 100,
    purchaseRate: 25.5,
    mrp: 35.0,
    gstPercent: 12,
    vendorName: "MedSupply Corp",
    location: "Rack A-1",
    lastUpdated: "2026-01-05",
    status: "in-stock",
    notes: "Common painkiller and fever reducer. Keep adequate stock. Fast-moving item.",
  },
  {
    id: "2",
    medicineId: "med-2",
    medicineName: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    manufacturer: "Sun Pharma",
    category: "Antibiotics",
    hsn: "30041020",
    batchNo: "AMX789",
    expiry: "Mar-26",
    expiryDate: new Date(2026, 2, 31),
    pack: "10T",
    currentStock: 45,
    reorderLevel: 50,
    purchaseRate: 85.0,
    mrp: 120.0,
    gstPercent: 12,
    vendorName: "PharmaCare",
    location: "Rack B-2",
    lastUpdated: "2026-01-03",
    status: "low-stock",
    notes: "Requires prescription. Reorder immediately as stock is below minimum level.",
  },
  {
    id: "3",
    medicineId: "med-3",
    medicineName: "Omeprazole 20mg",
    genericName: "Omeprazole",
    manufacturer: "Dr. Reddy's",
    category: "Antacids",
    hsn: "30049099",
    batchNo: "OMP456",
    expiry: "Feb-26",
    expiryDate: new Date(2026, 1, 28),
    pack: "15T",
    currentStock: 120,
    reorderLevel: 30,
    purchaseRate: 45.0,
    mrp: 65.0,
    gstPercent: 12,
    vendorName: "MedSupply Corp",
    location: "Rack A-3",
    lastUpdated: "2026-01-04",
    status: "expiring-soon",
    notes: "Expiring in less than 60 days. Prioritize sales or consider returns.",
  },
  {
    id: "4",
    medicineId: "med-4",
    medicineName: "Metformin 500mg",
    genericName: "Metformin HCl",
    manufacturer: "USV Pharma",
    category: "Antidiabetics",
    hsn: "30049099",
    batchNo: "MET234",
    expiry: "Aug-27",
    expiryDate: new Date(2027, 7, 31),
    pack: "30T",
    currentStock: 800,
    reorderLevel: 100,
    purchaseRate: 32.0,
    mrp: 48.0,
    gstPercent: 5,
    vendorName: "PharmaCare",
    location: "Rack C-1",
    lastUpdated: "2026-01-02",
    status: "in-stock",
  },
  {
    id: "5",
    medicineId: "med-5",
    medicineName: "Azithromycin 500mg",
    genericName: "Azithromycin",
    manufacturer: "Lupin",
    category: "Antibiotics",
    hsn: "30041020",
    batchNo: "AZI567",
    expiry: "Dec-25",
    expiryDate: new Date(2025, 11, 31),
    pack: "10T",
    currentStock: 25,
    reorderLevel: 40,
    purchaseRate: 95.0,
    mrp: 145.0,
    gstPercent: 12,
    vendorName: "MedSupply Corp",
    location: "Rack B-1",
    lastUpdated: "2026-01-01",
    status: "expired",
    notes: "EXPIRED. Do not dispense. Arrange for returns to vendor immediately.",
  },
  {
    id: "6",
    medicineId: "med-6",
    medicineName: "Cetirizine 10mg",
    genericName: "Cetirizine",
    manufacturer: "Cipla Ltd",
    category: "Antihistamines",
    hsn: "30049099",
    batchNo: "CET890",
    expiry: "Jul-27",
    expiryDate: new Date(2027, 6, 31),
    pack: "10T",
    currentStock: 0,
    reorderLevel: 50,
    purchaseRate: 18.0,
    mrp: 28.0,
    gstPercent: 12,
    vendorName: "PharmaCare",
    location: "Rack A-2",
    lastUpdated: "2025-12-28",
    status: "out-of-stock",
    notes: "Out of stock. Popular allergy medication. Order urgently.",
  },
  {
    id: "7",
    medicineId: "med-7",
    medicineName: "Ibuprofen 400mg",
    genericName: "Ibuprofen",
    manufacturer: "Abbott",
    category: "Analgesics",
    hsn: "30049099",
    batchNo: "IBU123",
    expiry: "Sep-27",
    expiryDate: new Date(2027, 8, 30),
    pack: "10T",
    currentStock: 350,
    reorderLevel: 75,
    purchaseRate: 22.0,
    mrp: 32.0,
    gstPercent: 12,
    vendorName: "MedSupply Corp",
    location: "Rack A-4",
    lastUpdated: "2026-01-06",
    status: "in-stock",
    notes: "Anti-inflammatory pain reliever. Moderate demand.",
  },
  {
    id: "8",
    medicineId: "med-8",
    medicineName: "Atorvastatin 10mg",
    genericName: "Atorvastatin",
    manufacturer: "Zydus",
    category: "Cardiovascular",
    hsn: "30049099",
    batchNo: "ATO456",
    expiry: "Nov-27",
    expiryDate: new Date(2027, 10, 30),
    pack: "15T",
    currentStock: 200,
    reorderLevel: 50,
    purchaseRate: 55.0,
    mrp: 85.0,
    gstPercent: 12,
    vendorName: "PharmaCare",
    location: "Rack D-1",
    lastUpdated: "2026-01-07",
    status: "in-stock",
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const totalItems = mockInventory.length;
    const inStock = mockInventory.filter((i) => i.status === "in-stock").length;
    const lowStock = mockInventory.filter((i) => i.status === "low-stock").length;
    const outOfStock = mockInventory.filter((i) => i.status === "out-of-stock").length;
    const expiringSoon = mockInventory.filter((i) => i.status === "expiring-soon").length;
    const expired = mockInventory.filter((i) => i.status === "expired").length;
    const totalValue = mockInventory.reduce(
      (sum, i) => sum + i.currentStock * i.purchaseRate,
      0
    );
    return {
      totalItems,
      inStock,
      lowStock,
      outOfStock,
      expiringSoon,
      expired,
      totalValue,
    };
  }, []);

  const handleExport = () => {
    const exportData = mockInventory.map((item) => ({
      "Medicine Name": item.medicineName,
      "Generic Name": item.genericName || "",
      Manufacturer: item.manufacturer || "",
      Category: item.category || "",
      HSN: item.hsn,
      "Batch No": item.batchNo,
      Expiry: item.expiry,
      Pack: item.pack,
      "Current Stock": item.currentStock,
      "Reorder Level": item.reorderLevel,
      "Purchase Rate": item.purchaseRate,
      MRP: item.mrp,
      "GST %": item.gstPercent,
      "Stock Value": item.currentStock * item.purchaseRate,
      Status: item.status,
      Location: item.location || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `Inventory_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    console.log("Edit item:", item);
    // Implement edit logic
  };

  const handleDelete = (id: string) => {
    console.log("Delete item:", id);
    // Implement delete logic
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">View and manage your complete medicine inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/pharmacy/stock-entry">
            <Button className="gap-2 bg-healthcare-primary hover:bg-teal-700">
              <Plus className="h-4 w-4" />
              Add Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Total Items</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-800">{stats.inStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm text-amber-600">Low Stock</p>
                  <p className="text-2xl font-bold text-amber-800">{stats.lowStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-red-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-800">{stats.outOfStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600">Expiring</p>
                  <p className="text-2xl font-bold text-orange-800">{stats.expiringSoon + stats.expired}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600">Stock Value</p>
                  <p className="text-lg font-bold text-teal-800">{formatCurrency(stats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modern Table */}
      <ModernInventoryTable
        data={mockInventory}
        onView={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.medicineName}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Generic Name</p>
                  <p className="font-medium">{selectedItem.genericName || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Manufacturer</p>
                  <p className="font-medium">{selectedItem.manufacturer || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{selectedItem.category || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">HSN Code</p>
                  <p className="font-medium font-mono">{selectedItem.hsn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Batch Number</p>
                  <p className="font-medium font-mono">{selectedItem.batchNo}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="font-medium">{selectedItem.expiry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pack Size</p>
                  <p className="font-medium">{selectedItem.pack}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Stock</p>
                  <p className="font-medium">{selectedItem.currentStock} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Rate / MRP</p>
                  <p className="font-medium">
                    {formatCurrency(selectedItem.purchaseRate)} / {formatCurrency(selectedItem.mrp)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Value</p>
                  <p className="font-medium text-lg text-healthcare-primary">
                    {formatCurrency(selectedItem.currentStock * selectedItem.purchaseRate)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function useMemo<T>(factory: () => T, deps: unknown[]): T {
  const [value] = React.useState(factory);
  return value;
}
