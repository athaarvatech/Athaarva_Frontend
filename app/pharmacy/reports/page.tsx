"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
  Activity,
  Timer,
  Zap,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";

import { formatCurrency } from "../types";
import { usePharmacyReports, type RefreshInterval } from "@/hooks/usePharmacyReports";

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

function getLowStockStatusColor(status: string) {
  switch (status) {
    case "critical":
      return "bg-red-100 text-red-700 border-red-200";
    case "low":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "warning":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLastUpdated(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// Loading skeleton components
function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("this-month");
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshIntervalValue, setRefreshIntervalValue] = useState<RefreshInterval>(60000);

  // Use the dynamic reports hook with auto-refresh
  const {
    data,
    liveStats,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh,
    autoRefresh,
    toggleAutoRefresh,
    refreshInterval,
    setRefreshInterval,
  } = usePharmacyReports({
    autoRefresh: true,
    refreshInterval: refreshIntervalValue,
  });

  // Memoized calculations
  const stockSummary = useMemo(() => data?.stockSummary ?? null, [data]);
  const monthlyStats = useMemo(() => data?.monthlyStats ?? null, [data]);
  const categoryWiseStock = useMemo(() => data?.categoryWiseStock ?? [], [data]);
  const expiryAlerts = useMemo(() => data?.expiryAlerts ?? [], [data]);
  const lowStockAlerts = useMemo(() => data?.lowStockAlerts ?? [], [data]);
  const vendorPurchases = useMemo(() => data?.vendorPurchases ?? [], [data]);
  const stockMovement = useMemo(() => data?.stockMovement ?? [], [data]);

  const handleExportReport = (reportType: string) => {
    if (!data) return;

    let exportData: Record<string, unknown>[] = [];
    let filename = "";

    switch (reportType) {
      case "stock-summary":
        exportData = categoryWiseStock.map((c) => ({
          Category: c.name,
          Items: c.items,
          "Stock Value": c.value,
          Percentage: `${c.percentage}%`,
        }));
        filename = "Stock_Summary";
        break;
      case "expiry-alerts":
        exportData = expiryAlerts.map((e) => ({
          Medicine: e.medicineName,
          Batch: e.batchNo,
          Expiry: formatDate(e.expiryDate),
          "Days to Expiry": e.daysUntilExpiry,
          Quantity: e.qty,
          Value: e.value,
          Status: e.status,
        }));
        filename = "Expiry_Alerts";
        break;
      case "low-stock":
        exportData = lowStockAlerts.map((l) => ({
          Medicine: l.medicineName,
          "Current Stock": l.currentQty,
          "Reorder Level": l.reorderLevel,
          "Last Ordered": formatDate(l.lastPurchaseDate),
          "Days Until Stockout": l.daysUntilStockout,
          Status: l.status,
        }));
        filename = "Low_Stock_Alerts";
        break;
      case "vendor-purchases":
        exportData = vendorPurchases.map((v) => ({
          Vendor: v.vendorName,
          "Total Purchases": formatCurrency(v.totalPurchases),
          "Items Supplied": v.itemsSupplied,
          "Last Purchase": formatDate(v.lastPurchase),
          "Credit Balance": formatCurrency(v.creditBalance),
          "Payment Terms": v.paymentTerms,
          "Reliability": `${v.reliability}%`,
        }));
        filename = "Vendor_Purchases";
        break;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    XLSX.writeFile(
      wb,
      `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleRefreshIntervalChange = (value: string) => {
    const interval = value === "manual" ? null : parseInt(value) as RefreshInterval;
    setRefreshIntervalValue(interval);
    setRefreshInterval(interval);
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Live Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Reports & Analytics
            </h1>
            <AnimatePresence>
              {autoRefresh && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 gap-1.5">
                    <Activity className="h-3 w-3 animate-pulse" />
                    Live
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">
              Comprehensive insights into your pharmacy inventory
            </p>
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                • Updated {formatLastUpdated(lastUpdated)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Auto-refresh interval selector */}
          <Select 
            value={refreshInterval?.toString() ?? "manual"} 
            onValueChange={handleRefreshIntervalChange}
          >
            <SelectTrigger className="w-[140px]">
              <Timer className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Refresh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30000">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  30 seconds
                </div>
              </SelectItem>
              <SelectItem value="60000">1 minute</SelectItem>
              <SelectItem value="300000">5 minutes</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>

          {/* Date range selector */}
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
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

          {/* Auto-refresh toggle */}
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={toggleAutoRefresh}
            className="gap-2"
          >
            <Activity className={autoRefresh ? "h-4 w-4 animate-pulse" : "h-4 w-4"} />
            {autoRefresh ? "Auto" : "Manual"}
          </Button>

          {/* Manual refresh button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refresh} 
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900">Failed to load reports</p>
                <p className="text-xs text-red-700">{error.message}</p>
              </div>
              <Button size="sm" variant="outline" onClick={refresh} className="ml-auto">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : monthlyStats ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
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
                          Live updates
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
              transition={{ duration: 0.3, delay: 0.1 }}
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
                          Live updates
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
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Profit Margin</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {monthlyStats.profitMargin.toFixed(1)}%
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-purple-600">
                          Turnover: {monthlyStats.turnoverRate}x
                        </span>
                      </div>
                    </div>
                    <BarChart3 className="h-10 w-10 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Active Vendors</p>
                      <p className="text-2xl font-bold text-orange-800">
                        {monthlyStats.vendorsActive}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-orange-600">
                          Avg Order: {formatCurrency(monthlyStats.avgOrderValue)}
                        </span>
                      </div>
                    </div>
                    <Building2 className="h-10 w-10 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : null}
      </div>

      {/* Tabbed Reports */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expiry">
            Expiry Alerts
            {!isLoading && expiryAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {expiryAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock
            {!isLoading && lowStockAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {lowStockAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stock Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stock Summary</CardTitle>
                <CardDescription>
                  Current inventory status and distribution
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("stock-summary")}
                disabled={isLoading || !data}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : stockSummary ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-sm text-blue-600">Total Items</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {stockSummary.totalItems.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm text-green-600">Total Value</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(stockSummary.totalValue)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-600">Low Stock</p>
                      <p className="text-2xl font-bold text-red-900">
                        {stockSummary.lowStockItems}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <p className="text-sm text-orange-600">Expiring Soon</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {stockSummary.expiringSoonItems}
                      </p>
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Category-wise Distribution</h3>
                    {categoryWiseStock.map((category, index) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{category.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">{category.items} items</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(category.value)}
                            </span>
                            <span className="text-gray-500">{category.percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          {/* Stock Movement Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement (6 Months)</CardTitle>
              <CardDescription>Inward vs Outward trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-96 w-full" />
              ) : stockMovement.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowDownRight className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-green-600">Total Inward</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(stockMovement.reduce((sum, m) => sum + m.inward, 0))}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                        <span className="text-xs font-medium text-red-600">Total Outward</span>
                      </div>
                      <p className="text-2xl font-bold text-red-900">
                        {formatCurrency(stockMovement.reduce((sum, m) => sum + m.outward, 0))}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">Net Movement</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(stockMovement.reduce((sum, m) => sum + m.netMovement, 0))}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Chart */}
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={stockMovement}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorInward" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                          </linearGradient>
                          <linearGradient id="colorOutward" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#6b7280"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          style={{ fontSize: '12px' }}
                          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                          formatter={(value: number) => [formatCurrency(value), '']}
                          labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          iconType="circle"
                        />
                        
                        {/* Area charts for visual appeal */}
                        <Area
                          type="monotone"
                          dataKey="inward"
                          fill="url(#colorInward)"
                          stroke="none"
                        />
                        <Area
                          type="monotone"
                          dataKey="outward"
                          fill="url(#colorOutward)"
                          stroke="none"
                        />
                        
                        {/* Line charts for trends */}
                        <Line
                          type="monotone"
                          dataKey="inward"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: '#10b981', r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Inward"
                        />
                        <Line
                          type="monotone"
                          dataKey="outward"
                          stroke="#ef4444"
                          strokeWidth={3}
                          dot={{ fill: '#ef4444', r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Outward"
                        />
                        
                        {/* Bar for net movement */}
                        <Bar
                          dataKey="netMovement"
                          fill="#3b82f6"
                          opacity={0.6}
                          radius={[8, 8, 0, 0]}
                          name="Net Movement"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Month-by-Month Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {stockMovement.map((month, index) => (
                      <motion.div
                        key={month.month}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">{month.month}</span>
                          {month.netMovement >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-green-600">In:</span>
                            <span className="font-medium text-gray-900">
                              ₹{(month.inward / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-600">Out:</span>
                            <span className="font-medium text-gray-900">
                              ₹{(month.outward / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 border-t">
                            <span className="text-gray-500">Net:</span>
                            <span className={`font-semibold ${month.netMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {month.netMovement >= 0 ? '+' : ''}₹{(month.netMovement / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <p className="text-center text-gray-500 py-8">No stock movement data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expiry Alerts Tab */}
        <TabsContent value="expiry" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expiry Alerts</CardTitle>
                <CardDescription>
                  Medicines expiring soon or already expired
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("expiry-alerts")}
                disabled={isLoading || !data}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeleton />
              ) : expiryAlerts.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Batch No</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Days Left</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiryAlerts.map((alert, index) => (
                        <motion.tr
                          key={alert.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium">{alert.medicineName}</TableCell>
                          <TableCell>{alert.batchNo}</TableCell>
                          <TableCell>{formatDate(alert.expiryDate)}</TableCell>
                          <TableCell>
                            <span
                              className={
                                alert.daysUntilExpiry < 0
                                  ? "text-red-600 font-semibold"
                                  : alert.daysUntilExpiry < 30
                                  ? "text-orange-600 font-semibold"
                                  : "text-yellow-600"
                              }
                            >
                              {alert.daysUntilExpiry < 0
                                ? `${Math.abs(alert.daysUntilExpiry)} days ago`
                                : `${alert.daysUntilExpiry} days`}
                            </span>
                          </TableCell>
                          <TableCell>{alert.qty}</TableCell>
                          <TableCell>{formatCurrency(alert.value)}</TableCell>
                          <TableCell>
                            <Badge className={getExpiryStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No expiry alerts at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>
                  Items below reorder level or running out soon
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("low-stock")}
                disabled={isLoading || !data}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeleton />
              ) : lowStockAlerts.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Reorder Level</TableHead>
                        <TableHead>Days Until Stockout</TableHead>
                        <TableHead>Last Ordered</TableHead>
                        <TableHead>Avg Daily Sales</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockAlerts.map((alert, index) => (
                        <motion.tr
                          key={alert.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium">{alert.medicineName}</TableCell>
                          <TableCell>
                            <span className={alert.currentQty === 0 ? "text-red-600 font-semibold" : ""}>
                              {alert.currentQty}
                            </span>
                          </TableCell>
                          <TableCell>{alert.reorderLevel}</TableCell>
                          <TableCell>
                            <span
                              className={
                                alert.daysUntilStockout <= 7
                                  ? "text-red-600 font-semibold"
                                  : alert.daysUntilStockout <= 14
                                  ? "text-orange-600"
                                  : "text-gray-600"
                              }
                            >
                              {alert.daysUntilStockout} days
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(alert.lastPurchaseDate)}</TableCell>
                          <TableCell>{alert.avgDailySales.toFixed(1)}</TableCell>
                          <TableCell>
                            <Badge className={getLowStockStatusColor(alert.status)}>
                              {alert.status}
                            </Badge>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">All stock levels are healthy</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vendor Purchases</CardTitle>
                <CardDescription>
                  Top vendors and purchase history
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("vendor-purchases")}
                disabled={isLoading || !data}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeleton />
              ) : vendorPurchases.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Total Purchases</TableHead>
                        <TableHead>Items Supplied</TableHead>
                        <TableHead>Last Purchase</TableHead>
                        <TableHead>Credit Balance</TableHead>
                        <TableHead>Payment Terms</TableHead>
                        <TableHead>Reliability</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorPurchases.map((vendor, index) => (
                        <motion.tr
                          key={vendor.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                          <TableCell>{formatCurrency(vendor.totalPurchases)}</TableCell>
                          <TableCell>{vendor.itemsSupplied}</TableCell>
                          <TableCell>{formatDate(vendor.lastPurchase)}</TableCell>
                          <TableCell>
                            {vendor.creditBalance > 0 ? (
                              <span className="text-orange-600">
                                {formatCurrency(vendor.creditBalance)}
                              </span>
                            ) : (
                              <span className="text-green-600">Paid</span>
                            )}
                          </TableCell>
                          <TableCell>{vendor.paymentTerms}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={vendor.reliability} className="h-2 w-16" />
                              <span className="text-sm text-gray-600">{vendor.reliability}%</span>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No vendor data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
