import { useState, useEffect, useCallback } from 'react';
import adminApiService, {
  DashboardStats,
  RecentActivity,
  PendingAction,
  Doctor,
  Staff,
} from '@/lib/admin-api';

/**
 * Hook for managing admin dashboard data
 */
export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await adminApiService.getDashboardOverview();
      
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
      setPendingActions(data.pendingActions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    recentActivity,
    pendingActions,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}

/**
 * Hook for managing doctors list
 */
export function useAdminDoctors(page: number = 1, perPage: number = 50) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await adminApiService.getAllDoctors(page, perPage);
      
      setDoctors(data.doctors);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load doctors';
      setError(errorMessage);
      console.error('Error fetching doctors:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const updateDoctorStatus = async (
    doctorId: number,
    updates: { is_verified?: boolean; is_active?: boolean }
  ) => {
    try {
      await adminApiService.updateDoctorStatus(doctorId, updates);
      // Refetch doctors after update
      await fetchDoctors();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update doctor';
      return { success: false, error: errorMessage };
    }
  };

  const deleteDoctor = async (doctorId: number) => {
    try {
      await adminApiService.deleteDoctor(doctorId);
      // Refetch doctors after deletion
      await fetchDoctors();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete doctor';
      return { success: false, error: errorMessage };
    }
  };

  return {
    doctors,
    total,
    totalPages,
    isLoading,
    error,
    refetch: fetchDoctors,
    updateDoctorStatus,
    deleteDoctor,
  };
}

/**
 * Hook for managing staff list
 */
export function useAdminStaff(page: number = 1, perPage: number = 50) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await adminApiService.getAllStaff(page, perPage);
      
      setStaff(data.staff);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load staff';
      setError(errorMessage);
      console.error('Error fetching staff:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const updateStaffStatus = async (
    staffId: number,
    updates: { is_verified?: boolean; is_active?: boolean }
  ) => {
    try {
      await adminApiService.updateStaffStatus(staffId, updates);
      // Refetch staff after update
      await fetchStaff();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update staff';
      return { success: false, error: errorMessage };
    }
  };

  const deleteStaff = async (staffId: number) => {
    try {
      await adminApiService.deleteStaff(staffId);
      // Refetch staff after deletion
      await fetchStaff();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete staff';
      return { success: false, error: errorMessage };
    }
  };

  return {
    staff,
    total,
    totalPages,
    isLoading,
    error,
    refetch: fetchStaff,
    updateStaffStatus,
    deleteStaff,
  };
}

/**
 * Hook for refreshing all admin data
 */
export function useAdminRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAll = useCallback(async (callbacks: (() => Promise<void>)[]) => {
    setIsRefreshing(true);
    try {
      await Promise.all(callbacks.map(cb => cb()));
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    isRefreshing,
    refreshAll,
  };
}
