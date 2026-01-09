"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  TrendingDown,
  Package,
  ShoppingCart,
  X,
  CheckCircle,
  Info,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TabsPills, TabsContent, type TabItem } from "@/components/ui/tabs-pills";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { usePharmacyAlerts } from "@/contexts/PharmacyAlertContext";
import type { PharmacyAlert as AlertType } from "@/contexts/PharmacyAlertContext";
import type { PharmacyStats } from "@/hooks/usePharmacyStats";

interface SmartAlertHubProps {
  stats?: PharmacyStats;
}

// Severity styles
const severityStyles: Record<"critical" | "urgent" | "warning" | "info", { bg: string; border: string; icon: string; badge: string }> = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    badge: "bg-red-100 text-red-800 border-red-200",
  },
  urgent: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-800 border-orange-200",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
  },
};

// Alert Card Component
function AlertCard({ alert, onAction, onDismiss }: { 
  alert: AlertType; 
  onAction: (alertId: string, action: string) => void;
  onDismiss: (alertId: string) => void;
}) {
  const styles = severityStyles[alert.severity];
  const TypeIcon = AlertTriangle;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "p-4 rounded-lg border transition-all bg-white shadow-sm hover:shadow-md",
        styles.border,
        !alert.isRead && "ring-2 ring-offset-2 ring-offset-white",
        alert.severity === "critical" && !alert.isRead && "ring-red-300",
        alert.severity === "urgent" && !alert.isRead && "ring-orange-300",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          alert.severity === "critical" && "bg-red-100",
          alert.severity === "urgent" && "bg-orange-100",
          alert.severity === "warning" && "bg-amber-100",
          alert.severity === "info" && "bg-blue-100",
        )}>
          <TypeIcon className={cn("h-5 w-5", styles.icon)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                {alert.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {alert.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-gray-400 hover:text-gray-600"
              onClick={() => onDismiss(alert.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Metadata badges */}
          {alert.metadata && (
            <div className="flex flex-wrap gap-2 mt-3">
              {alert.metadata.medicineName && (
                <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
                  {alert.metadata.medicineName}
                </Badge>
              )}
              {alert.metadata.currentStock !== undefined && (
                <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
                  Stock: {alert.metadata.currentStock}
                </Badge>
              )}
              {alert.metadata.daysUntilExpiry !== undefined && (
                <Badge className={cn("text-xs font-medium px-2.5 py-0.5 border", styles.badge)}>
                  {alert.metadata.daysUntilExpiry} days left
                </Badge>
              )}
              {alert.metadata.affectedItems !== undefined && (
                <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
                  {alert.metadata.affectedItems} items
                </Badge>
              )}
            </div>
          )}

          {/* Action buttons */}
          {alert.actionLabel && alert.actionFn && (
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                size="sm"
                className="h-8 text-xs font-medium bg-healthcare-primary hover:bg-healthcare-primary/90"
                onClick={() => {
                  alert.actionFn?.();
                  onAction(alert.id, "action");
                }}
              >
                <Package className="h-3.5 w-3.5 mr-1.5" />
                {alert.actionLabel}
              </Button>
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-gray-400 mt-2">
            {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Main Smart Alert Hub Component
export function SmartAlertHub({ stats }: SmartAlertHubProps) {
  const { alerts, unreadCount, urgentCount, markAllRead, dismissAlert, markAsRead } = usePharmacyAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Categorize alerts
  const categorizedAlerts = useMemo(() => {
    const critical = alerts.filter(a => a.severity === "critical");
    const urgent = alerts.filter(a => a.severity === "urgent");
    const warning = alerts.filter(a => a.severity === "warning");
    const info = alerts.filter(a => a.severity === "info");
    const unread = alerts.filter(a => !a.isRead);
    const actionable = alerts.filter(a => a.actionLabel && a.actionFn);
    
    return { critical, urgent, warning, info, unread, actionable, all: alerts };
  }, [alerts]);

  const handleAction = (alertId: string, action: string) => {
    const alert = alerts.find(a => a.id === alertId);
    
    // Show toast feedback
    toast.success(`Action triggered`, {
      description: `Processing action for ${alert?.metadata?.medicineName || "items"}...`,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo action"),
      },
    });

    // Mark as read
    markAsRead(alertId);
  };

  const handleDismiss = (alertId: string) => {
    dismissAlert(alertId);
    toast("Alert dismissed", { duration: 2000 });
  };

  const handleMarkAllRead = () => {
    markAllRead();
    toast.success("All alerts marked as read");
  };

  const tabs: TabItem[] = [
    { value: "all", label: "All", badge: alerts.length },
    { value: "urgent", label: "Urgent", badge: urgentCount > 0 ? urgentCount : undefined },
    { value: "actions", label: "Actions", badge: categorizedAlerts.actionable.length > 0 ? categorizedAlerts.actionable.length : undefined },
  ];

  const getFilteredAlerts = () => {
    switch (activeTab) {
      case "urgent":
        return [...categorizedAlerts.critical, ...categorizedAlerts.urgent];
      case "actions":
        return categorizedAlerts.actionable;
      default:
        return categorizedAlerts.all;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "relative text-gray-500 hover:text-healthcare-primary hover:bg-healthcare-primary/10 transition-colors",
            isOpen && "text-healthcare-primary bg-healthcare-primary/10"
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
              <span className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                urgentCount > 0 ? "animate-ping bg-red-400" : "bg-blue-400"
              )} />
              <span className={cn(
                "relative inline-flex rounded-full h-4 w-4 text-[10px] font-bold text-white items-center justify-center",
                urgentCount > 0 ? "bg-red-500" : "bg-blue-500"
              )}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-lg p-0 bg-gray-50">
        <SheetHeader className="px-6 py-5 bg-white border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-healthcare-primary" />
                Pharmacy Alerts
              </SheetTitle>
              <SheetDescription className="text-sm mt-1">
                {unreadCount} unread • {urgentCount} urgent
              </SheetDescription>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="hover:bg-gray-100">
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <Separator />

        {/* Stats Summary Bar */}
        {stats && (
          <div className="px-6 py-3 bg-white border-b">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-gray-500">Stock-outs</p>
                <p className="text-lg font-bold text-red-600">{stats.stockOutRisk.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fast Movers</p>
                <p className="text-lg font-bold text-blue-600">{stats.fastMovers.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Batches</p>
                <p className="text-lg font-bold text-amber-600">{stats.batchesNeedingAction.length}</p>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 bg-white">
          <TabsPills 
            tabs={tabs} 
            defaultValue="all" 
            onValueChange={setActiveTab}
          >
            <TabsContent value="all" className="mt-0" />
            <TabsContent value="urgent" className="mt-0" />
            <TabsContent value="actions" className="mt-0" />
          </TabsPills>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 max-h-[calc(100vh-280px)]">
          <AnimatePresence mode="popLayout">
            {getFilteredAlerts().length > 0 ? (
              getFilteredAlerts().map(alert => (
                <AlertCard 
                  key={alert.id} 
                  alert={alert} 
                  onAction={handleAction}
                  onDismiss={handleDismiss}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center px-4"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-5 shadow-sm">
                  <CheckCircle className="h-10 w-10 text-green-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  All caught up!
                </h3>
                <p className="text-sm text-gray-600 max-w-[240px]">
                  No {activeTab === "urgent" ? "urgent " : activeTab === "actions" ? "actionable " : ""}alerts at the moment.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Alerts Collapsible */}
          {activeTab === "all" && categorizedAlerts.info.length > 0 && (
            <Collapsible className="mt-4">
              <CollapsibleTrigger className="w-full">
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  Information & Suggestions ({categorizedAlerts.info.length})
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-2">
                  {categorizedAlerts.info.map(alert => (
                    <AlertCard 
                      key={alert.id} 
                      alert={alert} 
                      onAction={handleAction}
                      onDismiss={handleDismiss}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* Advanced Insights Section */}
        {stats && stats.stockOutRisk.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Predicted Stock-Outs
            </h4>
            <div className="space-y-2">
              {stats.stockOutRisk.slice(0, 2).map((risk, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 font-medium truncate flex-1">
                    {risk.medicineName}
                  </span>
                  <Badge variant="destructive" className="ml-2 text-[10px]">
                    {risk.daysUntilStockout}d left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default SmartAlertHub;
