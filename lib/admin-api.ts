import apiService from './api-service';

// Admin Dashboard Types
export interface DashboardStats {
  totalDoctors: number;
  totalStaff: number;
  activeDoctors: number;
  activeStaff: number;
  pendingApprovals: number;
  systemAlerts: number;
  monthlyGrowth: {
    doctors: number;
    staff: number;
    activeUsers: number;
    efficiency: number;
  };
}

export interface RecentActivity {
  id: number;
  type: string;
  user: {
    name: string;
    avatar: string | null;
    department: string;
  };
  message: string;
  time: string;
  status: string;
}

export interface PendingAction {
  id: number;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  count: number;
  dueDate: string;
}

export interface Doctor {
  doctor_id: number;
  full_name: string;
  email: string;
  phone?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  onboarding_completed: boolean;
  specialization?: string;
  license_number?: string;
}

export interface Staff {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  user_type: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Admin API Service
 * Handles all admin-related API calls
 */
class AdminApiService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiService.get<DashboardStats>('/api/v1/admin/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    try {
      const response = await apiService.get<RecentActivity[]>(
        `/api/v1/admin/dashboard/recent-activity?limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      throw error;
    }
  }

  /**
   * Get pending actions
   */
  async getPendingActions(): Promise<PendingAction[]> {
    try {
      const response = await apiService.get<PendingAction[]>('/api/v1/admin/dashboard/pending-actions');
      return response;
    } catch (error) {
      console.error('Failed to fetch pending actions:', error);
      throw error;
    }
  }

  /**
   * Get all doctors with pagination
   */
  async getAllDoctors(page: number = 1, perPage: number = 50): Promise<{
    doctors: Doctor[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  }> {
    try {
      const response = await apiService.get<{
        doctors: Doctor[];
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
      }>(`/api/v1/admin/doctors?page=${page}&per_page=${perPage}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw error;
    }
  }

  /**
   * Get all staff with pagination
   */
  async getAllStaff(page: number = 1, perPage: number = 50): Promise<{
    staff: Staff[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  }> {
    try {
      const response = await apiService.get<{
        staff: Staff[];
        total: number;
        page: number;
        per_page: number;
        total_pages: number;
      }>(`/api/v1/admin/staff?page=${page}&per_page=${perPage}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      throw error;
    }
  }

  /**
   * Update doctor status (verify/activate)
   */
  async updateDoctorStatus(
    doctorId: number,
    updates: { is_verified?: boolean; is_active?: boolean }
  ): Promise<{ message: string }> {
    try {
      const response = await apiService.put<{ message: string }>(
        `/api/v1/admin/doctors/${doctorId}/status`,
        updates
      );
      return response;
    } catch (error) {
      console.error('Failed to update doctor status:', error);
      throw error;
    }
  }

  /**
   * Update staff status (verify/activate)
   */
  async updateStaffStatus(
    staffId: number,
    updates: { is_verified?: boolean; is_active?: boolean }
  ): Promise<{ message: string }> {
    try {
      const response = await apiService.put<{ message: string }>(
        `/api/v1/admin/staff/${staffId}/status`,
        updates
      );
      return response;
    } catch (error) {
      console.error('Failed to update staff status:', error);
      throw error;
    }
  }

  /**
   * Delete doctor
   */
  async deleteDoctor(doctorId: number): Promise<{ message: string }> {
    try {
      const response = await apiService.delete<{ message: string }>(
        `/api/v1/admin/doctors/${doctorId}`
      );
      return response;
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      throw error;
    }
  }

  /**
   * Delete staff
   */
  async deleteStaff(staffId: number): Promise<{ message: string }> {
    try {
      const response = await apiService.delete<{ message: string }>(
        `/api/v1/admin/staff/${staffId}`
      );
      return response;
    } catch (error) {
      console.error('Failed to delete staff:', error);
      throw error;
    }
  }

  /**
   * Get dashboard overview (all data in one call)
   */
  async getDashboardOverview(): Promise<{
    stats: DashboardStats;
    recentActivity: RecentActivity[];
    pendingActions: PendingAction[];
  }> {
    try {
      // Fetch all data in parallel
      const [stats, recentActivity, pendingActions] = await Promise.all([
        this.getDashboardStats(),
        this.getRecentActivity(5),
        this.getPendingActions(),
      ]);

      return {
        stats,
        recentActivity,
        pendingActions,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error);
      throw error;
    }
  }
}

// Export singleton instance
const adminApiService = new AdminApiService();
export default adminApiService;
