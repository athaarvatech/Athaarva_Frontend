import { useState, useEffect, useCallback } from 'react';
import { hospitalAdminAPI, StaffMember, HospitalProfile, TenantBranding, DashboardStats, BrandingUpdate } from '@/lib/api/hospital-admin';

/**
 * Hook for hospital admin dashboard data
 */
export function useHospitalDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await hospitalAdminAPI.getDashboardStats();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      console.error('Dashboard fetch error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}

/**
 * Hook for hospital profile management
 */
export function useHospitalProfile() {
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await hospitalAdminAPI.getProfile();
      setProfile(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      console.error('Profile fetch error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: Partial<HospitalProfile>) => {
    try {
      setIsSaving(true);
      const updated = await hospitalAdminAPI.updateProfile(data);
      setProfile(updated);
      return { success: true, data: updated };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    isSaving,
    refetch: fetchProfile,
    updateProfile,
  };
}

/**
 * Hook for hospital branding management
 */
export function useHospitalBranding() {
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBranding = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await hospitalAdminAPI.getBranding();
      setBranding(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load branding';
      console.error('Branding fetch error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  const updateBranding = async (data: BrandingUpdate) => {
    try {
      setIsSaving(true);
      const updated = await hospitalAdminAPI.updateBranding(data);
      setBranding(updated);
      return { success: true, data: updated };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update branding';
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  };

  const uploadLogo = async (file: File, type: 'light' | 'dark' | 'favicon' | 'hero') => {
    try {
      setIsSaving(true);
      const { url } = await hospitalAdminAPI.uploadLogo(file, type);
      // Refetch branding to get updated data
      await fetchBranding();
      return { success: true, url };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload logo';
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    branding,
    isLoading,
    error,
    isSaving,
    refetch: fetchBranding,
    updateBranding,
    uploadLogo,
  };
}

/**
 * Hook for staff management
 */
export function useHospitalStaff(filters?: {
  role?: string;
  status?: string;
  department?: string;
}) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await hospitalAdminAPI.listStaff({
        role: filters?.role,
        status: filters?.status,
        department: filters?.department,
      });
      setStaff(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load staff';
      console.error('Staff fetch error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.role, filters?.status, filters?.department]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const inviteStaff = async (data: {
    email: string;
    full_name: string;
    role: string;
    department?: string;
  }) => {
    try {
      const newStaff = await hospitalAdminAPI.inviteStaff(data);
      // Refetch to get updated list
      await fetchStaff();
      return { success: true, data: newStaff };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to invite staff';
      return { success: false, error: errorMessage };
    }
  };

  const updateStaff = async (staffId: string, data: Partial<StaffMember>) => {
    try {
      const updated = await hospitalAdminAPI.updateStaffMember(staffId, data);
      await fetchStaff();
      return { success: true, data: updated };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update staff';
      return { success: false, error: errorMessage };
    }
  };

  const removeStaff = async (staffId: string) => {
    try {
      await hospitalAdminAPI.removeStaffMember(staffId);
      await fetchStaff();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove staff';
      return { success: false, error: errorMessage };
    }
  };

  return {
    staff,
    isLoading,
    error,
    refetch: fetchStaff,
    inviteStaff,
    updateStaff,
    removeStaff,
  };
}
