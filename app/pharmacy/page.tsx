"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  PackagePlus,
  PackageMinus,
  Truck,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import new unified components
import { UnifiedIntelligenceBar } from "./components/UnifiedIntelligenceBar";
import { QuickActionsBar } from "./components/QuickActionsBar";
import { DailyTasksChecklist } from "./components/DailyTasksChecklist";
import { SupplierHealthWidget } from "./components/SupplierHealthWidget";
import { PredictiveStockWidget } from "./components/PredictiveStockWidget";
import { ActivityFeed } from "./components/ActivityFeed";

// Quick stats mock data
const stats = {
  totalMedicines: 1245,
  lowStock: 23,
  expiringSoon: 18,
  totalValue: 2847500,
  monthlyPurchases: 456200,
  monthlySales: 612800,
  expiredCount: 3,
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

export default function PharmacyPage() {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl key combinations
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            window.location.href = '/pharmacy/stock-entry';
            break;
          case 'e':
            e.preventDefault();
            // Trigger export
            break;
          case '1':
            e.preventDefault();
            window.location.href = '/pharmacy/stock-entry';
            break;
          case '2':
            e.preventDefault();
            window.location.href = '/pharmacy/stock-out';
            break;
          case '3':
            e.preventDefault();
            window.location.href = '/pharmacy/purchase-orders';
            break;
          case '4':
            e.preventDefault();
            window.location.href = '/pharmacy/reports';
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Pharmacy Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here&apos;s your inventory overview.
          </p>
        </div>
        <Link href="/pharmacy/stock-entry">
          <Button size="lg" className="gap-2 bg-healthcare-primary hover:bg-healthcare-secondary shadow-lg shadow-healthcare-primary/25">
            <PackagePlus className="h-5 w-5" />
            New Stock Entry
            <kbd className="hidden sm:inline-flex ml-2 px-1.5 py-0.5 bg-white/20 rounded text-[10px]">⌘N</kbd>
          </Button>
        </Link>
      </div>

      {/* Stats Cards - More Spacious */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Medicines</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalMedicines.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">In inventory</p>
                </div>
                <div className="h-14 w-14 bg-healthcare-primary/10 rounded-2xl flex items-center justify-center">
                  <Package className="h-7 w-7 text-healthcare-primary" />
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
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-amber-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">
                    {stats.lowStock}
                  </p>
                  <p className="text-sm text-amber-500 mt-2">Need reorder</p>
                </div>
                <div className="h-14 w-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7 text-amber-600" />
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
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-red-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {stats.expiringSoon}
                  </p>
                  <p className="text-sm text-red-500 mt-2">Within 6 months</p>
                </div>
                <div className="h-14 w-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <Clock className="h-7 w-7 text-red-600" />
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
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-green-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Stock Value</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    ₹{(stats.totalValue / 100000).toFixed(1)}L
                  </p>
                  <div className="flex items-center text-sm text-green-500 mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8% this month
                  </div>
                </div>
                <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Quick Navigation</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Navigation Actions - Larger & More Spaced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link href={`/pharmacy/${action.href}`}>
              <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <action.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-healthcare-primary transition-colors">
                          {action.title}
                        </h3>
                        {action.badge && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-orange-100 text-orange-700 font-medium"
                          >
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-healthcare-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Intelligence Hub</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Unified Intelligence Bar - SINGLE SOURCE OF TRUTH */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <UnifiedIntelligenceBar />
      </motion.div>

      {/* Quick Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <QuickActionsBar 
          expiredCount={stats.expiredCount}
          lowStockCount={stats.lowStock}
          expiringSoonCount={stats.expiringSoon}
        />
      </motion.div>

      {/* Section Divider */}
      <div className="flex items-center gap-4 pt-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Detailed Insights</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Three Column Layout for Widgets - More Gap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Tasks Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <DailyTasksChecklist />
        </motion.div>

        {/* Predictive Stock Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <PredictiveStockWidget />
        </motion.div>

        {/* Supplier Health Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <SupplierHealthWidget />
        </motion.div>
      </div>

      {/* Activity Feed - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="pt-2"
      >
        <ActivityFeed />
      </motion.div>
    </div>
  );
}
