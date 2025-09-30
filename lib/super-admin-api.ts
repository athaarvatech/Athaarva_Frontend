import { API_CONFIG } from './api-config';

// Super Admin API Service
export class SuperAdminAPIService {
  private static baseURL = API_CONFIG.BASE_URL;

  // Helper method to get auth headers
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('super_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Login
  static async login(email: string, password: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.SUPER_ADMIN.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Store token
    localStorage.setItem('super_admin_token', data.access_token);
    
    return data;
  }

  // Logout
  static logout(): void {
    localStorage.removeItem('super_admin_token');
  }

  // Get current super admin profile
  static async getProfile(): Promise<{
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    last_login: string | null;
  }> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.SUPER_ADMIN.ME}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
      }
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get profile');
    }

    return response.json();
  }

  // Create invitation
  static async createInvitation(data: {
    email: string;
    hospital_draft?: any;
    expires_in_days?: number;
  }): Promise<{
    success: boolean;
    message: string;
    data: { invitation_id: number };
  }> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.SUPER_ADMIN.INVITATIONS}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
      }
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create invitation');
    }

    return response.json();
  }

  // Get invitations list
  static async getInvitations(params: {
    page?: number;
    per_page?: number;
    status?: 'PENDING' | 'USED' | 'REVOKED' | 'EXPIRED';
  } = {}): Promise<{
    invitations: Array<{
      id: number;
      email: string;
      status: string;
      hospital_draft: any;
      expires_at: string;
      invited_by: number;
      used_at: string | null;
      created_at: string;
      updated_at: string;
    }>;
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.per_page) searchParams.set('per_page', params.per_page.toString());
    if (params.status) searchParams.set('status', params.status);

    const response = await fetch(
      `${this.baseURL}${API_CONFIG.ENDPOINTS.SUPER_ADMIN.INVITATIONS}?${searchParams}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
      }
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get invitations');
    }

    return response.json();
  }

  // Revoke invitation
  static async revokeInvitation(invitationId: number): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await fetch(
      `${this.baseURL}${API_CONFIG.ENDPOINTS.SUPER_ADMIN.INVITATIONS}/${invitationId}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
      }
      const error = await response.json();
      throw new Error(error.detail || 'Failed to revoke invitation');
    }

    return response.json();
  }

  // Validate invitation token (public endpoint)
  static async validateToken(token: string): Promise<{
    valid: boolean;
    invitation_id?: number;
    email?: string;
    expires_at?: string;
    hospital_draft?: any;
    message: string;
  }> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.SUPER_ADMIN.VALIDATE_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to validate token');
    }

    return response.json();
  }

  // Cleanup expired invitations
  static async cleanupExpiredInvitations(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.SUPER_ADMIN.CLEANUP_EXPIRED}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
      }
      const error = await response.json();
      throw new Error(error.detail || 'Failed to cleanup expired invitations');
    }

    return response.json();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('super_admin_token');
  }
}

// Hospital Onboarding API Service
export class HospitalOnboardingAPIService {
  private static baseURL = API_CONFIG.BASE_URL;

  // Complete hospital onboarding with token
  static async completeOnboarding(
    onboardingData: any,
    token: string
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      hospital_id: number;
      subdomain: string;
      profile: any;
    };
  }> {
    const response = await fetch(
      `${this.baseURL}${API_CONFIG.ENDPOINTS.HOSPITALS.ONBOARDING}?token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to complete onboarding');
    }

    return response.json();
  }

  // Get hospital profile by subdomain
  static async getHospitalProfile(subdomain: string): Promise<any> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.HOSPITALS.PROFILE}/${subdomain}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Hospital not found');
    }

    return response.json();
  }
}
