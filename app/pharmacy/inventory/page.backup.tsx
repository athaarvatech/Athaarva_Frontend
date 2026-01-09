"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Package,
  AlertTriangle,
  Clock,
  XCircle,
  ArrowUpDown,
  Eye,
  Edit,
  MoreHorizontal,
  Plus,
  RefreshCw,
} from "lucide-react";
import * as XLSX from "xlsx";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InventoryItem, formatCurrency } from "../types";

// Mock inventory data
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

const categories = [
  "All Categories",
  "Analgesics",
  "Antibiotics",
  "Antacids",
  "Antidiabetics",
  "Antihistamines",
  "Cardiovascular",
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
  { value: "expiring-soon", label: "Expiring Soon" },
  { value: "expired", label: "Expired" },
];

function getStatusBadge(status: InventoryItem["status"]) {
  const styles = {
    "in-stock": "bg-green-100 text-green-700 border-green-200",
    "low-stock": "bg-amber-100 text-amber-700 border-amber-200",
    "out-of-stock": "bg-red-100 text-red-700 border-red-200",
    "expiring-soon": "bg-orange-100 text-orange-700 border-orange-200",
    expired: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const labels = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
    "expiring-soon": "Expiring Soon",
    expired: "Expired",
  };
  return (
    <Badge variant="outline" className={styles[status]}>
      {labels[status]}
    </Badge>
  );
}

function getStatusIcon(status: InventoryItem["status"]) {
  switch (status) {
    case "in-stock":
      return <Package className="h-4 w-4 text-green-600" />;
    case "low-stock":
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case "out-of-stock":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "expiring-soon":
      return <Clock className="h-4 w-4 text-orange-600" />;
    case "expired":
      return <XCircle className="h-4 w-4 text-gray-600" />;
  }
}

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] =
    useState<keyof InventoryItem>("medicineName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter and sort inventory
  const filteredInventory = useMemo(() => {
    let result = [...mockInventory];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.medicineName.toLowerCase().includes(searchLower) ||
          item.genericName?.toLowerCase().includes(searchLower) ||
          item.batchNo.toLowerCase().includes(searchLower) ||
          item.manufacturer?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categoryFilter !== "All Categories") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [search, categoryFilter, statusFilter, sortField, sortDirection]);

  // Stats
  const stats = useMemo(() => {
    const totalItems = mockInventory.length;
    const inStock = mockInventory.filter((i) => i.status === "in-stock").length;
    const lowStock = mockInventory.filter(
      (i) => i.status === "low-stock"
    ).length;
    const outOfStock = mockInventory.filter(
      (i) => i.status === "out-of-stock"
    ).length;
    const expiringSoon = mockInventory.filter(
      (i) => i.status === "expiring-soon"
    ).length;
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

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    const exportData = filteredInventory.map((item) => ({
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
    XLSX.writeFile(
      wb,
      `Inventory_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            View and manage your complete medicine inventory
          </p>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Total Items</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {stats.totalItems}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-800">
                    {stats.inStock}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm text-amber-600">Low Stock</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {stats.lowStock}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-red-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-800">
                    {stats.outOfStock}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600">Expiring</p>
                  <p className="text-2xl font-bold text-orange-800">
                    {stats.expiringSoon + stats.expired}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-teal-600" />
                <div>
                  <p className="text-sm text-teal-600">Stock Value</p>
                  <p className="text-lg font-bold text-teal-800">
                    {formatCurrency(stats.totalValue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medicines, batch numbers, manufacturers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategoryFilter("All Categories");
                setStatusFilter("all");
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Inventory List
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredInventory.length} items)
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("medicineName")}
                      className="flex items-center gap-1 hover:text-healthcare-primary"
                    >
                      Medicine
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Pack</TableHead>
                  <TableHead className="text-right">
                    <button
                      onClick={() => handleSort("currentStock")}
                      className="flex items-center gap-1 hover:text-healthcare-primary ml-auto"
                    >
                      Stock
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">MRP</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={`
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      ${item.status === "expired" ? "opacity-60" : ""}
                      hover:bg-teal-50/50
                    `}
                  >
                    <TableCell className="text-gray-500">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.medicineName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.manufacturer}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.batchNo}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`${
                          item.status === "expired"
                            ? "text-red-600"
                            : item.status === "expiring-soon"
                            ? "text-orange-600"
                            : "text-gray-700"
                        }`}
                      >
                        {item.expiry}
                      </span>
                    </TableCell>
                    <TableCell>{item.pack}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-medium ${
                          item.currentStock <= item.reorderLevel
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {item.currentStock}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.purchaseRate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.mrp)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.currentStock * item.purchaseRate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem && getStatusIcon(selectedItem.status)}
              {selectedItem?.medicineName}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Generic Name</p>
                  <p className="font-medium">
                    {selectedItem.genericName || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Manufacturer</p>
                  <p className="font-medium">
                    {selectedItem.manufacturer || "-"}
                  </p>
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
                  <p className="font-medium font-mono">
                    {selectedItem.batchNo}
                  </p>
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
                  <p className="font-medium">
                    {selectedItem.currentStock} units
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Rate / MRP</p>
                  <p className="font-medium">
                    {formatCurrency(selectedItem.purchaseRate)} /{" "}
                    {formatCurrency(selectedItem.mrp)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Value</p>
                  <p className="font-medium text-lg text-healthcare-primary">
                    {formatCurrency(
                      selectedItem.currentStock * selectedItem.purchaseRate
                    )}
                  </p>
                </div>
              </div>
              <div className="col-span-2 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">
                      {selectedItem.location || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="font-medium">
                      {selectedItem.vendorName || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
