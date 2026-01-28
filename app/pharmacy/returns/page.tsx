"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Download,
  Package,
  RotateCcw,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MoreHorizontal,
  Filter,
  Building2,
  FileText,
} from "lucide-react";
import * as XLSX from "xlsx";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

import {
  ReturnEntry,
  ReturnItem,
  ReturnType,
  ReturnStatus,
  formatCurrency,
  generateId,
} from "../types";

// Mock returns data
const mockReturns: ReturnEntry[] = [
  {
    id: "1",
    returnNo: "RTN-2026-001",
    returnType: "vendor",
    returnDate: new Date(2026, 0, 5),
    vendorId: "v1",
    vendorName: "MedSupply Corp",
    items: [
      {
        id: "i1",
        medicineId: "m1",
        medicineName: "Paracetamol 500mg",
        batchNo: "BAT001",
        expiry: "Dec-26",
        qty: 50,
        rate: 25.5,
        amount: 1275,
        reason: "Damaged packaging",
      },
    ],
    totalAmount: 1275,
    status: "pending",
    remarks: "Damaged during transit",
    createdAt: "2026-01-05T10:30:00",
    createdBy: "Admin",
  },
  {
    id: "2",
    returnNo: "RTN-2026-002",
    returnType: "expired",
    returnDate: new Date(2026, 0, 4),
    items: [
      {
        id: "i2",
        medicineId: "m5",
        medicineName: "Azithromycin 500mg",
        batchNo: "AZI567",
        expiry: "Dec-25",
        qty: 25,
        rate: 95.0,
        amount: 2375,
        reason: "Expired stock",
      },
    ],
    totalAmount: 2375,
    status: "approved",
    remarks: "Expired medicines - to be destroyed",
    createdAt: "2026-01-04T14:00:00",
    createdBy: "Admin",
    approvedBy: "Manager",
    approvedAt: "2026-01-05T09:00:00",
  },
  {
    id: "3",
    returnNo: "RTN-2026-003",
    returnType: "damaged",
    returnDate: new Date(2026, 0, 3),
    items: [
      {
        id: "i3",
        medicineId: "m2",
        medicineName: "Amoxicillin 500mg",
        batchNo: "AMX789",
        expiry: "Mar-26",
        qty: 10,
        rate: 85.0,
        amount: 850,
        reason: "Broken seals",
      },
    ],
    totalAmount: 850,
    status: "completed",
    remarks: "Stock written off",
    createdAt: "2026-01-03T11:00:00",
    createdBy: "Admin",
    approvedBy: "Manager",
    approvedAt: "2026-01-03T16:00:00",
  },
  {
    id: "4",
    returnNo: "RTN-2026-004",
    returnType: "vendor",
    returnDate: new Date(2026, 0, 2),
    vendorId: "v2",
    vendorName: "PharmaCare",
    items: [
      {
        id: "i4",
        medicineId: "m3",
        medicineName: "Omeprazole 20mg",
        batchNo: "OMP456",
        expiry: "Feb-26",
        qty: 30,
        rate: 45.0,
        amount: 1350,
        reason: "Near expiry - vendor recall",
      },
    ],
    totalAmount: 1350,
    status: "rejected",
    remarks: "Vendor rejected return request",
    createdAt: "2026-01-02T09:00:00",
    createdBy: "Admin",
  },
];

// Mock medicines for dropdown
const mockMedicines = [
  {
    id: "m1",
    name: "Paracetamol 500mg",
    batchNo: "BAT001",
    expiry: "Dec-26",
    stock: 500,
    rate: 25.5,
  },
  {
    id: "m2",
    name: "Amoxicillin 500mg",
    batchNo: "AMX789",
    expiry: "Mar-26",
    stock: 45,
    rate: 85.0,
  },
  {
    id: "m3",
    name: "Omeprazole 20mg",
    batchNo: "OMP456",
    expiry: "Feb-26",
    stock: 120,
    rate: 45.0,
  },
  {
    id: "m5",
    name: "Azithromycin 500mg",
    batchNo: "AZI567",
    expiry: "Dec-25",
    stock: 25,
    rate: 95.0,
  },
];

// Mock vendors
const mockVendors = [
  { id: "v1", name: "MedSupply Corp" },
  { id: "v2", name: "PharmaCare" },
  { id: "v3", name: "Generic Pharma Ltd" },
];

const returnTypeLabels: Record<ReturnType, string> = {
  vendor: "Vendor Return",
  expired: "Expired Stock",
  damaged: "Damaged Stock",
  customer: "Customer Return",
};

const returnTypeColors: Record<ReturnType, string> = {
  vendor: "bg-blue-100 text-blue-700 border-blue-200",
  expired: "bg-red-100 text-red-700 border-red-200",
  damaged: "bg-orange-100 text-orange-700 border-orange-200",
  customer: "bg-purple-100 text-purple-700 border-purple-200",
};

const returnStatusLabels: Record<ReturnStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  completed: "Completed",
  rejected: "Rejected",
};

const returnStatusColors: Record<ReturnStatus, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

function getStatusIcon(status: ReturnStatus) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "approved":
      return <CheckCircle className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
  }
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnEntry[]>(mockReturns);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnEntry | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // New return form state
  const [newReturn, setNewReturn] = useState({
    returnType: "vendor" as ReturnType,
    vendorId: "",
    remarks: "",
    items: [] as ReturnItem[],
  });

  // Add item state
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    medicineId: "",
    qty: 0,
    reason: "",
  });

  // Stats
  const stats = useMemo(() => {
    const pending = returns.filter((r) => r.status === "pending").length;
    const approved = returns.filter((r) => r.status === "approved").length;
    const completed = returns.filter((r) => r.status === "completed").length;
    const totalValue = returns.reduce((sum, r) => sum + r.totalAmount, 0);
    const vendorReturns = returns.filter(
      (r) => r.returnType === "vendor"
    ).length;
    const expiredReturns = returns.filter(
      (r) => r.returnType === "expired"
    ).length;
    return {
      pending,
      approved,
      completed,
      totalValue,
      vendorReturns,
      expiredReturns,
    };
  }, [returns]);

  // Filtered returns
  const filteredReturns = useMemo(() => {
    let result = [...returns];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.returnNo.toLowerCase().includes(searchLower) ||
          r.vendorName?.toLowerCase().includes(searchLower) ||
          r.items.some((i) =>
            i.medicineName.toLowerCase().includes(searchLower)
          )
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((r) => r.returnType === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [returns, search, typeFilter, statusFilter]);

  const handleExport = () => {
    const exportData = filteredReturns.flatMap((r) =>
      r.items.map((item) => ({
        "Return No": r.returnNo,
        "Return Type": returnTypeLabels[r.returnType],
        "Return Date": new Date(r.returnDate).toLocaleDateString(),
        Vendor: r.vendorName || "-",
        Medicine: item.medicineName,
        Batch: item.batchNo,
        Expiry: item.expiry,
        Qty: item.qty,
        Rate: item.rate,
        Amount: item.amount,
        Reason: item.reason,
        Status: returnStatusLabels[r.status],
        Remarks: r.remarks || "-",
      }))
    );

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Returns");
    XLSX.writeFile(
      wb,
      `Returns_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleAddItem = () => {
    if (!newItem.medicineId || newItem.qty <= 0) return;

    const medicine = mockMedicines.find((m) => m.id === newItem.medicineId);
    if (!medicine) return;

    const item: ReturnItem = {
      id: generateId(),
      medicineId: medicine.id,
      medicineName: medicine.name,
      batchNo: medicine.batchNo,
      expiry: medicine.expiry,
      qty: newItem.qty,
      rate: medicine.rate,
      amount: newItem.qty * medicine.rate,
      reason: newItem.reason,
    };

    setNewReturn((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));

    setNewItem({ medicineId: "", qty: 0, reason: "" });
    setAddingItem(false);
  };

  const handleRemoveItem = (itemId: string) => {
    setNewReturn((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
    }));
  };

  const handleCreateReturn = () => {
    if (newReturn.items.length === 0) return;

    const returnEntry: ReturnEntry = {
      id: generateId(),
      returnNo: `RTN-2026-${String(returns.length + 1).padStart(3, "0")}`,
      returnType: newReturn.returnType,
      returnDate: new Date(),
      vendorId: newReturn.vendorId || undefined,
      vendorName: mockVendors.find((v) => v.id === newReturn.vendorId)?.name,
      items: newReturn.items,
      totalAmount: newReturn.items.reduce((sum, i) => sum + i.amount, 0),
      status: "pending",
      remarks: newReturn.remarks,
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };

    setReturns((prev) => [returnEntry, ...prev]);
    setIsCreateOpen(false);
    setNewReturn({
      returnType: "vendor",
      vendorId: "",
      remarks: "",
      items: [],
    });
  };

  const handleUpdateStatus = (returnId: string, newStatus: ReturnStatus) => {
    setReturns((prev) =>
      prev.map((r) =>
        r.id === returnId
          ? {
              ...r,
              status: newStatus,
              ...(newStatus === "approved" || newStatus === "completed"
                ? {
                    approvedBy: "Manager",
                    approvedAt: new Date().toISOString(),
                  }
                : {}),
            }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Returns Management
          </h1>
          <p className="text-gray-600">
            Manage vendor returns, expired stock, and damaged goods
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-healthcare-primary hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            New Return
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm text-amber-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {stats.pending}
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
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Approved</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {stats.approved}
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
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600">Completed</p>
                  <p className="text-2xl font-bold text-green-800">
                    {stats.completed}
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
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600">Vendor Returns</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {stats.vendorReturns}
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
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-red-600">Expired Returns</p>
                  <p className="text-2xl font-bold text-red-800">
                    {stats.expiredReturns}
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
                  <p className="text-sm text-teal-600">Total Value</p>
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
                placeholder="Search return number, vendor, medicines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Return Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="vendor">Vendor Return</SelectItem>
                <SelectItem value="expired">Expired Stock</SelectItem>
                <SelectItem value="damaged">Damaged Stock</SelectItem>
                <SelectItem value="customer">Customer Return</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Returns Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Returns List
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredReturns.length} entries)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Return No</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((returnEntry, index) => (
                  <TableRow
                    key={returnEntry.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    } hover:bg-teal-50/50`}
                  >
                    <TableCell className="text-gray-500">{index + 1}</TableCell>
                    <TableCell className="font-medium font-mono">
                      {returnEntry.returnNo}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={returnTypeColors[returnEntry.returnType]}
                      >
                        {returnTypeLabels[returnEntry.returnType]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(returnEntry.returnDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{returnEntry.vendorName || "-"}</TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {returnEntry.items.length} item
                        {returnEntry.items.length > 1 ? "s" : ""}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(returnEntry.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          returnStatusColors[returnEntry.status]
                        } flex items-center gap-1 w-fit`}
                      >
                        {getStatusIcon(returnEntry.status)}
                        {returnStatusLabels[returnEntry.status]}
                      </Badge>
                    </TableCell>
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
                            onClick={() => {
                              setSelectedReturn(returnEntry);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {returnEntry.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(returnEntry.id, "approved")
                                }
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(returnEntry.id, "rejected")
                                }
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {returnEntry.status === "approved" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(
                                    returnEntry.id,
                                    "completed"
                                  )
                                }
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReturns.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      No returns found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Return Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-healthcare-primary" />
              Create New Return
            </DialogTitle>
            <DialogDescription>
              Record a new return entry for vendor, expired, or damaged stock
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Return Type and Vendor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Return Type *</Label>
                <Select
                  value={newReturn.returnType}
                  onValueChange={(val) =>
                    setNewReturn((prev) => ({
                      ...prev,
                      returnType: val as ReturnType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor">Vendor Return</SelectItem>
                    <SelectItem value="expired">Expired Stock</SelectItem>
                    <SelectItem value="damaged">Damaged Stock</SelectItem>
                    <SelectItem value="customer">Customer Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newReturn.returnType === "vendor" && (
                <div className="space-y-2">
                  <Label>Vendor *</Label>
                  <Select
                    value={newReturn.vendorId}
                    onValueChange={(val) =>
                      setNewReturn((prev) => ({ ...prev, vendorId: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Items Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Items *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingItem(true)}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {/* Add Item Form */}
              {addingItem && (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Medicine</Label>
                        <Select
                          value={newItem.medicineId}
                          onValueChange={(val) =>
                            setNewItem((prev) => ({ ...prev, medicineId: val }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select medicine" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockMedicines.map((med) => (
                              <SelectItem key={med.id} value={med.id}>
                                {med.name} ({med.batchNo})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={newItem.qty || ""}
                          onChange={(e) =>
                            setNewItem((prev) => ({
                              ...prev,
                              qty: parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="Enter qty"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason</Label>
                        <Input
                          value={newItem.reason}
                          onChange={(e) =>
                            setNewItem((prev) => ({
                              ...prev,
                              reason: e.target.value,
                            }))
                          }
                          placeholder="Return reason"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddingItem(false)}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleAddItem}>
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Items List */}
              {newReturn.items.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Medicine</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newReturn.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.medicineName}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {item.batchNo}
                          </TableCell>
                          <TableCell>{item.expiry}</TableCell>
                          <TableCell className="text-right">
                            {item.qty}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.rate)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.amount)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {item.reason}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="bg-gray-50 px-4 py-2 text-right border-t">
                    <span className="font-medium">Total: </span>
                    <span className="font-bold text-healthcare-primary">
                      {formatCurrency(
                        newReturn.items.reduce((sum, i) => sum + i.amount, 0)
                      )}
                    </span>
                  </div>
                </div>
              )}

              {newReturn.items.length === 0 && !addingItem && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>
                    No items added yet. Click &quot;Add Item&quot; to add
                    medicines to return.
                  </p>
                </div>
              )}
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                value={newReturn.remarks}
                onChange={(e) =>
                  setNewReturn((prev) => ({ ...prev, remarks: e.target.value }))
                }
                placeholder="Additional notes or remarks..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateReturn}
              disabled={newReturn.items.length === 0}
              className="bg-healthcare-primary hover:bg-teal-700"
            >
              Create Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-healthcare-primary" />
              {selectedReturn?.returnNo}
            </DialogTitle>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Return Type</p>
                  <Badge
                    variant="outline"
                    className={returnTypeColors[selectedReturn.returnType]}
                  >
                    {returnTypeLabels[selectedReturn.returnType]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    variant="outline"
                    className={returnStatusColors[selectedReturn.status]}
                  >
                    {returnStatusLabels[selectedReturn.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Return Date</p>
                  <p className="font-medium">
                    {new Date(selectedReturn.returnDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vendor</p>
                  <p className="font-medium">
                    {selectedReturn.vendorName || "-"}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Medicine</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReturn.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.medicineName}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.batchNo}
                        </TableCell>
                        <TableCell className="text-right">{item.qty}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="text-sm">{item.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="bg-gray-50 px-4 py-3 text-right border-t">
                  <span className="font-bold text-lg text-healthcare-primary">
                    Total: {formatCurrency(selectedReturn.totalAmount)}
                  </span>
                </div>
              </div>

              {selectedReturn.remarks && (
                <div>
                  <p className="text-sm text-gray-500">Remarks</p>
                  <p className="text-gray-700">{selectedReturn.remarks}</p>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-500 pt-2 border-t">
                <span>Created by {selectedReturn.createdBy}</span>
                <span>
                  {new Date(selectedReturn.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
