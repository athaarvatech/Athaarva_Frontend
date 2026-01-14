"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PharmacyService, type PharmacyReportsData, type DateRangeFilter } from "@/lib/services/PharmacyService";
import type { StockEntryItem } from "@/app/pharmacy/types";
import { usePharmacyStats } from "./usePharmacyStats";

export type RefreshInterval = 30000 | 60000 | 300000 | null; // 30s, 1min, 5min, manual

export interface UsePharmacyReportsOptions {
  autoRefresh?: boolean;
  refreshInterval?: RefreshInterval;
  dateRange?: DateRangeFilter;
}

export interface UsePharmacyReportsReturn {
  // Data
  data: PharmacyReportsData | null;
  inventoryItems: StockEntryItem[];
  liveStats: ReturnType<typeof usePharmacyStats>;
  
  // State
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  
  // Actions
  refresh: () => Promise<void>;
  setDateRange: (range: DateRangeFilter | undefined) => void;
  setRefreshInterval: (interval: RefreshInterval) => void;
  
  // Config
  refreshInterval: RefreshInterval;
  autoRefresh: boolean;
  toggleAutoRefresh: () => void;
}

/**
 * Hook for managing dynamic pharmacy reports data with auto-refresh
 */
export function usePharmacyReports(options: UsePharmacyReportsOptions = {}): UsePharmacyReportsReturn {
  const {
    autoRefresh: initialAutoRefresh = true,
    refreshInterval: initialRefreshInterval = 60000, // Default: 1 minute
    dateRange: initialDateRange,
  } = options;

  // State
  const [data, setData] = useState<PharmacyReportsData | null>(null);
  const [inventoryItems, setInventoryItems] = useState<StockEntryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeFilter | undefined>(initialDateRange);
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>(initialRefreshInterval);
  const [autoRefresh, setAutoRefresh] = useState(initialAutoRefresh);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Calculate live stats from inventory items
  const liveStats = usePharmacyStats(inventoryItems);

  /**
   * Fetch all reports data
   */
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      setError(null);

      // Fetch comprehensive reports data
      const [reportsData, items] = await Promise.all([
        PharmacyService.getReportsData(dateRange),
        PharmacyService.getInventoryItems(),
      ]);

      if (!mountedRef.current) return;

      setData(reportsData);
      setInventoryItems(items);
      setLastUpdated(new Date());
    } catch (err) {
      if (!mountedRef.current) return;
      
      const error = err instanceof Error ? err : new Error("Failed to fetch pharmacy reports");
      setError(error);
      console.error("Error fetching pharmacy reports:", error);
    } finally {
      if (!mountedRef.current) return;
      
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [dateRange]);

  /**
   * Refresh data manually
   */
  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  /**
   * Toggle auto-refresh on/off
   */
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  /**
   * Update date range and refetch data
   */
  const handleSetDateRange = useCallback((range: DateRangeFilter | undefined) => {
    setDateRange(range);
  }, []);

  /**
   * Update refresh interval
   */
  const handleSetRefreshInterval = useCallback((interval: RefreshInterval) => {
    setRefreshInterval(interval);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup auto-refresh interval
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Setup new interval if auto-refresh is enabled and interval is set
    if (autoRefresh && refreshInterval !== null) {
      intervalRef.current = setInterval(() => {
        fetchData(true);
      }, refreshInterval);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    // Data
    data,
    inventoryItems,
    liveStats,
    
    // State
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    
    // Actions
    refresh,
    setDateRange: handleSetDateRange,
    setRefreshInterval: handleSetRefreshInterval,
    
    // Config
    refreshInterval,
    autoRefresh,
    toggleAutoRefresh,
  };
}

/**
 * Hook for individual report sections (for granular control)
 */
export function useStockSummary() {
  const [data, setData] = useState<PharmacyReportsData["stockSummary"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    PharmacyService.getStockSummary()
      .then(summary => {
        if (mounted) {
          setData(summary);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch stock summary"));
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading, error };
}

/**
 * Hook for expiry alerts only
 */
export function useExpiryAlerts(daysThreshold: number = 90) {
  const [data, setData] = useState<PharmacyReportsData["expiryAlerts"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    PharmacyService.getExpiryAlerts(daysThreshold)
      .then(alerts => {
        if (mounted) {
          setData(alerts);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch expiry alerts"));
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [daysThreshold]);

  return { data, isLoading, error };
}

/**
 * Hook for low stock alerts only
 */
export function useLowStockAlerts() {
  const [data, setData] = useState<PharmacyReportsData["lowStockAlerts"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    PharmacyService.getLowStockAlerts()
      .then(alerts => {
        if (mounted) {
          setData(alerts);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch low stock alerts"));
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
