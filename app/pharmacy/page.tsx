"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  PackagePlus,
  PackageMinus,
  Truck,
  BarChart3,
  Settings,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Quick stats mock data
const stats = {
  totalMedicines: 1245,
  lowStock: 23,
  expiringSoon: 18,
  totalValue: 2847500,
  monthlyPurchases: 456200,
  monthlySales: 612800,
};

// Quick actions
const quickActions = [
  {
    title: "Stock In",
    description: "Add new medicine purchases to inventory",
    icon: PackagePlus,
    href: "stock-entry",
    color: "bg-green-500",
    badge: null,
  },
  {
    title: "Stock Out",
    description: "Record medicine dispensing",
    icon: PackageMinus,
    href: "stock-out",
    color: "bg-blue-500",
    badge: null,
  },
  {
    title: "Purchase Orders",
    description: "Create and manage purchase orders",
    icon: Truck,
    href: "purchase-orders",
    color: "bg-purple-500",
    badge: "3 pending",
  },
  {
    title: "Inventory Report",
    description: "View complete stock report",
    icon: BarChart3,
    href: "reports",
    color: "bg-orange-500",
    badge: null,
  },
];

// Alerts
const alerts = [
  {
    id: 1,
    type: "low-stock",
    message: "Paracetamol 500mg is running low (15 units left)",
    severity: "warning",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "expiry",
    message: "Amoxicillin 500mg batch ABC123 expires in 30 days",
    severity: "danger",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "low-stock",
    message: "Omeprazole 20mg is running low (8 units left)",
    severity: "warning",
    time: "1 day ago",
  },
];

export default function PharmacyPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pharmacy Inventory Management
          </h1>
          <p className="text-gray-600">
            Manage medicine stock, purchases, and dispensing
          </p>
        </div>
        <Link href="/pharmacy/stock-entry">
          <Button className="gap-2 bg-healthcare-primary hover:bg-healthcare-secondary">
            <PackagePlus className="h-4 w-4" />
            New Stock Entry
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Medicines</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalMedicines.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">In inventory</p>
                </div>
                <div className="h-10 w-10 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-healthcare-primary" />
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Low Stock Items</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {stats.lowStock}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">Need reorder</p>
                </div>
                <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Expiring Soon</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.expiringSoon}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Within 6 months</p>
                </div>
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Stock Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{(stats.totalValue / 100000).toFixed(1)}L
                  </p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% this month
                  </div>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link href={`/pharmacy/${action.href}`}>
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-healthcare-primary transition-colors">
                          {action.title}
                        </h3>
                        {action.badge && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-orange-100 text-orange-700"
                          >
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-healthcare-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / Alerts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Alerts</CardTitle>
                  <CardDescription>
                    Stock warnings and notifications
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.severity === "danger"
                        ? "bg-red-50 border-red-200"
                        : "bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`h-5 w-5 mt-0.5 ${
                          alert.severity === "danger"
                            ? "text-red-500"
                            : "text-amber-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            alert.severity === "danger"
                              ? "text-red-800"
                              : "text-amber-800"
                          }`}
                        >
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.time}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-xs h-7">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Purchases</span>
                  <span className="font-semibold">
                    ₹{(stats.monthlyPurchases / 1000).toFixed(0)}K
                  </span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Sales</span>
                  <span className="font-semibold text-green-600">
                    ₹{(stats.monthlySales / 1000).toFixed(0)}K
                  </span>
                </div>
                <Progress
                  value={85}
                  className="h-2 bg-green-100 [&>div]:bg-green-500"
                />
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gross Margin</span>
                  <span className="font-bold text-healthcare-primary">
                    {(
                      ((stats.monthlySales - stats.monthlyPurchases) /
                        stats.monthlySales) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/pharmacy/settings">
                <Button variant="outline" className="w-full gap-2">
                  <Settings className="h-4 w-4" />
                  Configure Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
