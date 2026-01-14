"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Building2,
} from "lucide-react";
import * as XLSX from "xlsx";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

import { formatCurrency } from "../types";

// Mock data for reports
const stockSummary = {
  totalItems: 1245,
  totalValue: 2847500,
  lowStockItems: 23,
  expiringItems: 18,
  expiredItems: 5,
  outOfStockItems: 12,
  avgTurnoverDays: 45,
  reorderPending: 15,
};

const monthlyStats = {
  purchases: 456200,
  purchasesChange: 12.5,
  sales: 612800,
  salesChange: 8.3,
  returns: 15600,
  returnsChange: -5.2,
  profit: 156600,
  profitMargin: 25.6,
};

const categoryWiseStock = [
  { category: "Antibiotics", items: 245, value: 589600, percentage: 20.7 },
  { category: "Analgesics", items: 198, value: 456200, percentage: 16.0 },
  { category: "Antidiabetics", items: 156, value: 398500, percentage: 14.0 },
  { category: "Cardiovascular", items: 134, value: 356800, percentage: 12.5 },
  { category: "Antacids", items: 112, value: 245600, percentage: 8.6 },
  { category: "Antihistamines", items: 98, value: 198400, percentage: 7.0 },
  { category: "Vitamins", items: 89, value: 178500, percentage: 6.3 },
  { category: "Others", items: 213, value: 423900, percentage: 14.9 },
];

const expiryAlerts = [
  {
    medicine: "Azithromycin 500mg",
    batch: "AZI567",
    expiry: "Dec-25",
    daysToExpiry: -10,
    qty: 25,
    value: 2375,
    status: "expired",
  },
  {
    medicine: "Omeprazole 20mg",
    batch: "OMP456",
    expiry: "Feb-26",
    daysToExpiry: 22,
    qty: 120,
    value: 5400,
    status: "critical",
  },
  {
    medicine: "Amoxicillin 500mg",
    batch: "AMX789",
    expiry: "Mar-26",
    daysToExpiry: 51,
    qty: 45,
    value: 3825,
    status: "warning",
  },
  {
    medicine: "Cetirizine 10mg",
    batch: "CET123",
    expiry: "Apr-26",
    daysToExpiry: 81,
    qty: 80,
    value: 1440,
    status: "warning",
  },
  {
    medicine: "Metformin 500mg",
    batch: "MET567",
    expiry: "May-26",
    daysToExpiry: 112,
    qty: 200,
    value: 6400,
    status: "caution",
  },
];

const lowStockAlerts = [
  {
    medicine: "Amoxicillin 500mg",
    currentStock: 45,
    reorderLevel: 50,
    lastOrdered: "2025-12-20",
    vendor: "Sun Pharma",
  },
  {
    medicine: "Cetirizine 10mg",
    currentStock: 0,
    reorderLevel: 50,
    lastOrdered: "2025-12-15",
    vendor: "Cipla Ltd",
  },
  {
    medicine: "Azithromycin 500mg",
    currentStock: 25,
    reorderLevel: 40,
    lastOrdered: "2025-12-10",
    vendor: "Lupin",
  },
  {
    medicine: "Pantoprazole 40mg",
    currentStock: 18,
    reorderLevel: 30,
    lastOrdered: "2025-12-25",
    vendor: "Dr. Reddy's",
  },
  {
    medicine: "Ciprofloxacin 500mg",
    currentStock: 22,
    reorderLevel: 35,
    lastOrdered: "2025-12-28",
    vendor: "Cipla Ltd",
  },
];

const vendorPurchases = [
  {
    vendor: "MedSupply Corp",
    purchases: 45,
    amount: 189500,
    lastPurchase: "2026-01-05",
  },
  {
    vendor: "PharmaCare",
    purchases: 38,
    amount: 156200,
    lastPurchase: "2026-01-04",
  },
  {
    vendor: "Generic Pharma Ltd",
    purchases: 32,
    amount: 98700,
    lastPurchase: "2026-01-02",
  },
  {
    vendor: "Sun Pharma",
    purchases: 28,
    amount: 87600,
    lastPurchase: "2025-12-28",
  },
  {
    vendor: "Cipla Ltd",
    purchases: 25,
    amount: 76800,
    lastPurchase: "2025-12-25",
  },
];

const stockMovement = [
  { month: "Aug", inward: 125000, outward: 145000 },
  { month: "Sep", inward: 145000, outward: 158000 },
  { month: "Oct", inward: 168000, outward: 172000 },
  { month: "Nov", inward: 189000, outward: 195000 },
  { month: "Dec", inward: 215000, outward: 198000 },
  { month: "Jan", inward: 178000, outward: 156000 },
];

function getExpiryStatusColor(status: string) {
  switch (status) {
    case "expired":
      return "bg-red-100 text-red-700 border-red-200";
    case "critical":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "warning":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "caution":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("this-month");
  const [activeTab, setActiveTab] = useState("overview");

  const handleExportReport = (reportType: string) => {
    let data: Record<string, unknown>[] = [];
    let filename = "";

    switch (reportType) {
      case "stock-summary":
        data = categoryWiseStock.map((c) => ({
          Category: c.category,
          Items: c.items,
          "Stock Value": c.value,
          Percentage: `${c.percentage}%`,
        }));
        filename = "Stock_Summary";
        break;
      case "expiry-alerts":
        data = expiryAlerts.map((e) => ({
          Medicine: e.medicine,
          Batch: e.batch,
          Expiry: e.expiry,
          "Days to Expiry": e.daysToExpiry,
          Quantity: e.qty,
          Value: e.value,
          Status: e.status,
        }));
        filename = "Expiry_Alerts";
        break;
      case "low-stock":
        data = lowStockAlerts.map((l) => ({
          Medicine: l.medicine,
          "Current Stock": l.currentStock,
          "Reorder Level": l.reorderLevel,
          "Last Ordered": l.lastOrdered,
          Vendor: l.vendor,
        }));
        filename = "Low_Stock_Alerts";
        break;
      case "vendor-purchases":
        data = vendorPurchases.map((v) => ({
          Vendor: v.vendor,
          "Total Purchases": v.purchases,
          Amount: v.amount,
          "Last Purchase": v.lastPurchase,
        }));
        filename = "Vendor_Purchases";
        break;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    XLSX.writeFile(
      wb,
      `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your pharmacy inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Monthly Purchases</p>
                  <p className="text-2xl font-bold text-green-800">
                    {formatCurrency(monthlyStats.purchases)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">
                      +{monthlyStats.purchasesChange}%
                    </span>
                  </div>
                </div>
                <TrendingUp className="h-10 w-10 text-green-400" />
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Monthly Sales</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {formatCurrency(monthlyStats.sales)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600">
                      +{monthlyStats.salesChange}%
                    </span>
                  </div>
                </div>
                <DollarSign className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Returns</p>
                  <p className="text-2xl font-bold text-red-800">
                    {formatCurrency(monthlyStats.returns)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowDownRight className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">
                      {monthlyStats.returnsChange}%
                    </span>
                  </div>
                </div>
                <TrendingDown className="h-10 w-10 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-600">Profit Margin</p>
                  <p className="text-2xl font-bold text-teal-800">
                    {monthlyStats.profitMargin}%
                  </p>
                  <p className="text-xs text-teal-600 mt-1">
                    {formatCurrency(monthlyStats.profit)} profit
                  </p>
                </div>
                <PieChart className="h-10 w-10 text-teal-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Alerts</TabsTrigger>
          <TabsTrigger value="stock">Low Stock</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Summary */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-healthcare-primary" />
                    Stock Summary
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportReport("stock-summary")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Items</span>
                      <span className="font-bold">
                        {stockSummary.totalItems.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Value</span>
                      <span className="font-bold text-healthcare-primary">
                        {formatCurrency(stockSummary.totalValue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Avg Turnover
                      </span>
                      <span className="font-bold">
                        {stockSummary.avgTurnoverDays} days
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-amber-600">Low Stock</span>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-700"
                      >
                        {stockSummary.lowStockItems}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-600">
                        Expiring Soon
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-700"
                      >
                        {stockSummary.expiringItems}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-red-600">Out of Stock</span>
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-700"
                      >
                        {stockSummary.outOfStockItems}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Movement Chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-healthcare-primary" />
                  Stock Movement (6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockMovement.map((month) => (
                    <div key={month.month} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <div className="flex gap-4">
                          <span className="text-green-600">
                            ↑ {formatCurrency(month.inward)}
                          </span>
                          <span className="text-red-600">
                            ↓ {formatCurrency(month.outward)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-4">
                        <div
                          className="bg-green-400 rounded-l"
                          style={{ width: `${(month.inward / 250000) * 100}%` }}
                        />
                        <div
                          className="bg-red-400 rounded-r"
                          style={{
                            width: `${(month.outward / 250000) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category-wise Stock */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-healthcare-primary" />
                    Category-wise Stock Distribution
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExportReport("stock-summary")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryWiseStock.map((category) => (
                    <div
                      key={category.category}
                      className="flex items-center gap-4"
                    >
                      <div className="w-24 text-sm font-medium text-gray-700 truncate">
                        {category.category}
                      </div>
                      <div className="flex-1">
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {formatCurrency(category.value)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {category.items} items
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expiry Alerts Tab */}
        <TabsContent value="expiry" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Expiry Alerts
                  </CardTitle>
                  <CardDescription>
                    Medicines expiring within the next 6 months or already
                    expired
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("expiry-alerts")}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Medicine</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="text-center">Days Left</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Value at Risk</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiryAlerts.map((item, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <TableCell className="font-medium">
                        {item.medicine}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.batch}
                      </TableCell>
                      <TableCell>{item.expiry}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-medium ${
                            item.daysToExpiry < 0
                              ? "text-red-600"
                              : item.daysToExpiry < 30
                              ? "text-orange-600"
                              : "text-amber-600"
                          }`}
                        >
                          {item.daysToExpiry < 0
                            ? `${Math.abs(item.daysToExpiry)} days ago`
                            : `${item.daysToExpiry} days`}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{item.qty}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.value)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getExpiryStatusColor(item.status)}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Low Stock Tab */}
        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Low Stock Alerts
                  </CardTitle>
                  <CardDescription>
                    Items below reorder level that need immediate attention
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("low-stock")}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Medicine</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Reorder Level</TableHead>
                    <TableHead>Shortage</TableHead>
                    <TableHead>Last Ordered</TableHead>
                    <TableHead>Vendor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockAlerts.map((item, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    >
                      <TableCell className="font-medium">
                        {item.medicine}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-bold ${
                            item.currentStock === 0
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        >
                          {item.currentStock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.reorderLevel}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={
                              (item.currentStock / item.reorderLevel) * 100
                            }
                            className="w-20 h-2"
                          />
                          <span className="text-sm text-gray-500">
                            {Math.round(
                              (item.currentStock / item.reorderLevel) * 100
                            )}
                            %
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{item.lastOrdered}</TableCell>
                      <TableCell>{item.vendor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-500" />
                    Vendor Purchase Summary
                  </CardTitle>
                  <CardDescription>
                    Top vendors by purchase volume this month
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport("vendor-purchases")}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">
                      Total Purchases
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead>Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPurchases.map((vendor, index) => {
                    const totalAmount = vendorPurchases.reduce(
                      (sum, v) => sum + v.amount,
                      0
                    );
                    const share = (vendor.amount / totalAmount) * 100;
                    return (
                      <TableRow
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }
                      >
                        <TableCell className="text-gray-500">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {vendor.vendor}
                        </TableCell>
                        <TableCell className="text-right">
                          {vendor.purchases}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(vendor.amount)}
                        </TableCell>
                        <TableCell>{vendor.lastPurchase}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={share} className="w-16 h-2" />
                            <span className="text-sm text-gray-500">
                              {share.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
