"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  Search,
  User,
  Building2,
  Phone,
  FileText,
  Stethoscope,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  Package,
  Printer,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  DispenseType,
  StockOutItem,
  MOCK_MEDICINE_STOCK,
  MOCK_DEPARTMENTS,
  formatCurrency,
  generateId,
} from "../types";

// Payment modes
const PAYMENT_MODES = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "credit", label: "Credit", icon: FileText },
];

export default function StockOutPage() {
  // Form state
  const [dispenseType, setDispenseType] = useState<DispenseType>("patient");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [prescriptionNo, setPrescriptionNo] = useState("");
  const [remarks, setRemarks] = useState("");

  // Medicine search
  const [searchQuery, setSearchQuery] = useState("");
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);

  // Cart items
  const [cartItems, setCartItems] = useState<StockOutItem[]>([]);

  // Payment
  const [paymentMode, setPaymentMode] = useState<string>("cash");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [billNo, setBillNo] = useState("");

  // Filter medicines based on search
  const filteredMedicines = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return MOCK_MEDICINE_STOCK.filter(
      (med) =>
        med.medicineName.toLowerCase().includes(query) ||
        med.genericName.toLowerCase().includes(query) ||
        med.batchNo.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [searchQuery]);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.amount, 0);
    const totalGst = cartItems.reduce(
      (sum, item) => sum + (item.amount * item.gstPercent) / 100,
      0
    );
    const discountAmount = (subtotal * discountPercent) / 100;
    const grandTotal = subtotal + totalGst - discountAmount;
    const change = amountReceived - grandTotal;

    return {
      subtotal,
      totalGst,
      discountAmount,
      grandTotal,
      change: change > 0 ? change : 0,
      totalItems: cartItems.length,
      totalQty: cartItems.reduce((sum, item) => sum + item.dispenseQty, 0),
    };
  }, [cartItems, discountPercent, amountReceived]);

  // Add medicine to cart
  const handleAddToCart = useCallback(
    (medicine: (typeof MOCK_MEDICINE_STOCK)[0]) => {
      // Check if already in cart
      const existingIndex = cartItems.findIndex(
        (item) => item.id === medicine.id
      );

      if (existingIndex >= 0) {
        // Increment quantity
        const updated = [...cartItems];
        const item = updated[existingIndex];
        if (item.dispenseQty < medicine.availableQty) {
          item.dispenseQty += 1;
          item.amount = item.dispenseQty * item.rate;
          item.netAmount = item.amount + (item.amount * item.gstPercent) / 100;
          setCartItems(updated);
          toast.success(`Added 1 more ${medicine.medicineName}`);
        } else {
          toast.error("Cannot exceed available stock");
        }
      } else {
        // Add new item
        const newItem: StockOutItem = {
          id: medicine.id,
          medicineId: medicine.id,
          medicineName: medicine.medicineName,
          genericName: medicine.genericName,
          batchNo: medicine.batchNo,
          expiry: medicine.expiry,
          expiryDate: medicine.expiryDate,
          pack: medicine.pack,
          availableQty: medicine.availableQty,
          dispenseQty: 1,
          rate: medicine.mrp,
          amount: medicine.mrp,
          gstPercent: medicine.gstPercent,
          netAmount: medicine.mrp + (medicine.mrp * medicine.gstPercent) / 100,
        };
        setCartItems((prev) => [...prev, newItem]);
        toast.success(`Added ${medicine.medicineName} to cart`);
      }

      setSearchQuery("");
      setShowMedicineSearch(false);
    },
    [cartItems]
  );

  // Update quantity
  const handleUpdateQuantity = useCallback((itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(
            1,
            Math.min(item.availableQty, item.dispenseQty + delta)
          );
          const amount = newQty * item.rate;
          return {
            ...item,
            dispenseQty: newQty,
            amount,
            netAmount: amount + (amount * item.gstPercent) / 100,
          };
        }
        return item;
      })
    );
  }, []);

  // Remove from cart
  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success("Item removed from cart");
  }, []);

  // Clear cart
  const handleClearCart = useCallback(() => {
    setCartItems([]);
    setDiscountPercent(0);
    setAmountReceived(0);
    toast.info("Cart cleared");
  }, []);

  // Complete sale
  const handleCompleteSale = useCallback(async () => {
    // Validation
    if (dispenseType === "patient" && !patientName.trim()) {
      toast.error("Please enter patient name");
      return;
    }
    if (dispenseType !== "patient" && !departmentId) {
      toast.error("Please select a department");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }
    if (paymentMode === "cash" && amountReceived < totals.grandTotal) {
      toast.error("Amount received is less than total");
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate bill number
    const newBillNo = `BILL-${format(new Date(), "yyyyMMdd")}-${generateId()
      .slice(-4)
      .toUpperCase()}`;
    setBillNo(newBillNo);

    setIsSaving(false);
    setShowSuccessModal(true);
    toast.success("Sale completed successfully!");
  }, [
    dispenseType,
    patientName,
    departmentId,
    cartItems,
    paymentMode,
    amountReceived,
    totals.grandTotal,
  ]);

  // Reset form for new sale
  const handleNewSale = useCallback(() => {
    setPatientName("");
    setPatientPhone("");
    setDepartmentId("");
    setDoctorName("");
    setPrescriptionNo("");
    setRemarks("");
    setCartItems([]);
    setDiscountPercent(0);
    setAmountReceived(0);
    setShowSuccessModal(false);
    setBillNo("");
  }, []);

  // Print bill
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Get department name
  const getDepartmentName = (id: string) => {
    return MOCK_DEPARTMENTS.find((d) => d.id === id)?.name || "";
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/pharmacy">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Stock Out / Dispense
            </h1>
            <p className="text-gray-600">
              Dispense medicines to patients or departments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cartItems.length > 0 && (
            <Button variant="outline" onClick={handleNewSale}>
              New Sale
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form & Medicine Search */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispense Type & Customer Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Dispense Details</CardTitle>
                <CardDescription>
                  Select dispense type and enter recipient details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dispense Type */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: "patient", label: "Patient", icon: User },
                    {
                      value: "department",
                      label: "Department",
                      icon: Building2,
                    },
                    { value: "ward", label: "Ward", icon: Package },
                    { value: "ot", label: "OT", icon: Stethoscope },
                  ].map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={
                        dispenseType === type.value ? "default" : "outline"
                      }
                      className={`h-12 ${
                        dispenseType === type.value
                          ? "bg-healthcare-primary hover:bg-healthcare-secondary"
                          : ""
                      }`}
                      onClick={() =>
                        setDispenseType(type.value as DispenseType)
                      }
                    >
                      <type.icon className="h-4 w-4 mr-2" />
                      {type.label}
                    </Button>
                  ))}
                </div>

                {/* Patient Details */}
                {dispenseType === "patient" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-400" />
                        Patient Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        Phone Number
                      </Label>
                      <Input
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Stethoscope className="h-4 w-4 text-gray-400" />
                        Doctor Name
                      </Label>
                      <Input
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        placeholder="Prescribing doctor"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        Prescription No.
                      </Label>
                      <Input
                        value={prescriptionNo}
                        onChange={(e) => setPrescriptionNo(e.target.value)}
                        placeholder="RX-XXXX"
                      />
                    </div>
                  </div>
                )}

                {/* Department Details */}
                {dispenseType !== "patient" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        Select Department{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={departmentId}
                        onValueChange={setDepartmentId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose department" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name} ({dept.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        Remarks
                      </Label>
                      <Input
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Any special notes"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Medicine Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Add Medicines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowMedicineSearch(true);
                    }}
                    onFocus={() => setShowMedicineSearch(true)}
                    placeholder="Search by medicine name, generic name, or batch..."
                    className="pl-10"
                  />

                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {showMedicineSearch && filteredMedicines.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto"
                      >
                        {filteredMedicines.map((medicine) => (
                          <button
                            key={medicine.id}
                            onClick={() => handleAddToCart(medicine)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {medicine.medicineName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {medicine.genericName} •{" "}
                                  {medicine.manufacturer}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    Batch: {medicine.batchNo}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Exp: {medicine.expiry}
                                  </Badge>
                                  <Badge
                                    variant={
                                      medicine.availableQty > 50
                                        ? "default"
                                        : medicine.availableQty > 10
                                        ? "secondary"
                                        : "destructive"
                                    }
                                    className="text-xs"
                                  >
                                    Stock: {medicine.availableQty}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-healthcare-primary">
                                  {formatCurrency(medicine.mrp)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {medicine.pack}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {showMedicineSearch &&
                    searchQuery.length > 0 &&
                    filteredMedicines.length === 0 && (
                      <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg p-4 text-center text-gray-500">
                        No medicines found for &quot;{searchQuery}&quot;
                      </div>
                    )}
                </div>

                {/* Click outside to close */}
                {showMedicineSearch && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMedicineSearch(false)}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Cart Items Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart ({cartItems.length} items)
                  </CardTitle>
                  {cartItems.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleClearCart}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No medicines added yet</p>
                    <p className="text-sm">Search and add medicines above</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Medicine</TableHead>
                          <TableHead className="text-center">Batch</TableHead>
                          <TableHead className="text-center">Expiry</TableHead>
                          <TableHead className="text-center">Rate</TableHead>
                          <TableHead className="text-center">Qty</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {item.medicineName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.genericName} • {item.pack}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-mono text-sm">
                              {item.batchNo}
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {item.expiry}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatCurrency(item.rate)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    handleUpdateQuantity(item.id, -1)
                                  }
                                  disabled={item.dispenseQty <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-10 text-center font-medium">
                                  {item.dispenseQty}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    handleUpdateQuantity(item.id, 1)
                                  }
                                  disabled={
                                    item.dispenseQty >= item.availableQty
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-center text-gray-500 mt-1">
                                Avl: {item.availableQty}
                              </p>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.amount)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Payment & Summary */}
        <div className="space-y-6">
          {/* Payment Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span>{totals.totalItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Qty</span>
                    <span>{totals.totalQty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST</span>
                    <span>{formatCurrency(totals.totalGst)}</span>
                  </div>

                  {/* Discount */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm text-gray-600">Discount %</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={discountPercent}
                      onChange={(e) =>
                        setDiscountPercent(
                          Math.min(100, Math.max(0, Number(e.target.value)))
                        )
                      }
                      className="h-8 w-20 text-right"
                    />
                    <span className="text-sm text-gray-500">
                      -{formatCurrency(totals.discountAmount)}
                    </span>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Grand Total</span>
                      <span className="text-healthcare-primary">
                        {formatCurrency(totals.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="space-y-2">
                  <Label>Payment Mode</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_MODES.map((mode) => (
                      <Button
                        key={mode.value}
                        type="button"
                        variant={
                          paymentMode === mode.value ? "default" : "outline"
                        }
                        className={`h-10 ${
                          paymentMode === mode.value
                            ? "bg-healthcare-primary hover:bg-healthcare-secondary"
                            : ""
                        }`}
                        onClick={() => setPaymentMode(mode.value)}
                      >
                        <mode.icon className="h-4 w-4 mr-2" />
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Amount Received (for cash) */}
                {paymentMode === "cash" && (
                  <div className="space-y-2">
                    <Label>Amount Received</Label>
                    <Input
                      type="number"
                      min={0}
                      value={amountReceived || ""}
                      onChange={(e) =>
                        setAmountReceived(Number(e.target.value))
                      }
                      placeholder="Enter amount"
                      className="text-right font-medium"
                    />
                    {amountReceived > 0 && totals.change > 0 && (
                      <div className="flex justify-between text-sm bg-green-50 p-2 rounded">
                        <span className="text-green-700">Change</span>
                        <span className="font-bold text-green-700">
                          {formatCurrency(totals.change)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Complete Sale Button */}
                <Button
                  className="w-full h-12 bg-healthcare-primary hover:bg-healthcare-secondary text-lg"
                  onClick={handleCompleteSale}
                  disabled={cartItems.length === 0 || isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Complete Sale
                    </>
                  )}
                </Button>

                {/* Print Button */}
                {cartItems.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Bill
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {totals.totalItems}
                  </p>
                  <p className="text-xs text-blue-600">Items</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {totals.totalQty}
                  </p>
                  <p className="text-xs text-green-600">Units</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Sale Completed Successfully
            </DialogTitle>
            <DialogDescription>
              The sale has been recorded and stock has been updated.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Bill No:</span>
              <span className="font-medium font-mono">{billNo}</span>
              <span className="text-gray-600">
                {dispenseType === "patient" ? "Patient:" : "Department:"}
              </span>
              <span className="font-medium">
                {dispenseType === "patient"
                  ? patientName
                  : getDepartmentName(departmentId)}
              </span>
              <span className="text-gray-600">Items:</span>
              <span className="font-medium">{totals.totalItems}</span>
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-healthcare-primary">
                {formatCurrency(totals.grandTotal)}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Bill
            </Button>
            <Button
              onClick={handleNewSale}
              className="bg-healthcare-primary hover:bg-healthcare-secondary"
            >
              New Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
