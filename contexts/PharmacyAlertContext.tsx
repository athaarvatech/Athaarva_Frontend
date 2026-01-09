"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type AlertSeverity = "critical" | "urgent" | "warning" | "info";

export interface PharmacyAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: Date;
  isRead: boolean;
  actionLabel?: string;
  actionFn?: () => void;
  metadata?: {
    medicineId?: string;
    medicineName?: string;
    batchNo?: string;
    currentStock?: number;
    expiryDate?: string;
    daysUntilExpiry?: number;
    affectedItems?: number;
  };
}

interface PharmacyAlertContextType {
  alerts: PharmacyAlert[];
  unreadCount: number;
  urgentCount: number;
  addAlert: (alert: Omit<PharmacyAlert, "id" | "timestamp" | "isRead">) => void;
  dismissAlert: (id: string) => void;
  markAllRead: () => void;
  markAsRead: (id: string) => void;
  syncInventoryStats: (items: any[]) => void;
}

const PharmacyAlertContext = createContext<PharmacyAlertContextType | undefined>(undefined);

export function PharmacyAlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<PharmacyAlert[]>([]);
  const [syncedBatches, setSyncedBatches] = useState<Set<string>>(new Set());

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const urgentCount = alerts.filter(a => (a.severity === "critical" || a.severity === "urgent") && !a.isRead).length;

  const addAlert = useCallback((alert: Omit<PharmacyAlert, "id" | "timestamp" | "isRead">) => {
    const newAlert: PharmacyAlert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setAlerts((prev) => prev.map(a => ({ ...a, isRead: true })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  }, []);

  // CRITICAL: Sync inventory data to alerts
  const syncInventoryStats = useCallback((items: any[]) => {
    if (!items || items.length === 0) return;

    const today = new Date().toDateString();
    const batchKey = `sync-${today}`;

    // Prevent duplicate syncs for the same day
    if (syncedBatches.has(batchKey)) return;

    const expired = items.filter((i) => i.isExpired);
    const expiring = items.filter((i) => i.isExpiringSoon && !i.isExpired);
    const lowStock = items.filter((i) => i.qty && i.qty < 50); // Example threshold

    // Add critical alerts for expired items
    if (expired.length > 0) {
      addAlert({
        title: `${expired.length} medicine${expired.length > 1 ? 's' : ''} expired`,
        description: "Immediate action required - remove from inventory for compliance",
        severity: "critical",
        actionLabel: "View Expired Items",
        metadata: { affectedItems: expired.length },
      });
    }

    // Add urgent alerts for expiring items
    if (expiring.length > 0) {
      addAlert({
        title: `${expiring.length} medicine${expiring.length > 1 ? 's' : ''} expiring soon`,
        description: "Items will expire within 30 days - plan discount sale or return",
        severity: "urgent",
        actionLabel: "View Expiring Items",
        metadata: { affectedItems: expiring.length },
      });
    }

    // Add warning for low stock
    if (lowStock.length > 0) {
      addAlert({
        title: `${lowStock.length} item${lowStock.length > 1 ? 's' : ''} running low`,
        description: "Stock levels below minimum threshold - consider reordering",
        severity: "warning",
        actionLabel: "View Low Stock",
        metadata: { affectedItems: lowStock.length },
      });
    }

    setSyncedBatches(prev => new Set(prev).add(batchKey));
  }, [addAlert, syncedBatches]);

  // Initial welcome alert
  useEffect(() => {
    const welcomeKey = "welcome-shown";
    if (!localStorage.getItem(welcomeKey)) {
      addAlert({
        title: "Smart Pharmacy System Active",
        description: "AI-powered inventory alerts and predictive analytics are now monitoring your stock",
        severity: "info",
      });
      localStorage.setItem(welcomeKey, "true");
    }
  }, [addAlert]);

  return (
    <PharmacyAlertContext.Provider
      value={{ 
        alerts, 
        unreadCount, 
        urgentCount,
        addAlert, 
        dismissAlert, 
        markAllRead,
        markAsRead,
        syncInventoryStats 
      }}
    >
      {children}
    </PharmacyAlertContext.Provider>
  );
}

export const usePharmacyAlerts = () => {
  const context = useContext(PharmacyAlertContext);
  if (!context) {
    throw new Error("usePharmacyAlerts must be used within PharmacyAlertProvider");
  }
  return context;
};
