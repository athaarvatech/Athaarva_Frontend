/**
 * Super Admin API Service - Real Backend Integration
 * 
 * This service connects to the /api/v2/super-admin/ endpoints.
 * Falls back to mock data when API is unavailable.
 */

// Types matching backend responses
export interface DashboardMetrics {
  total_tenants: number;
  active_tenants: number;
  pending_tenants: number;
  suspended_tenants: number;
  pending_invitations: number;
  pending_onboarding: number;
  total_users: number;
  recent_tenants: TenantResponse[];
  recent_invitations: InvitationResponse[];
}

export interface TenantResponse {
  id: string;
  code: string;
  display_name: string;
  legal_name: string | null;
  tenant_kind: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  onboarding_stage: string;
  plan_id: string | null;
  primary_template_id: string | null;
  timezone: string;
  locale: string;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  billing_contact: Record<string, unknown>;
  brand_tagline: string | null;
  metadata: Record<string, unknown>;
  feature_flags: Record<string, unknown>;
  go_live_at: string | null;
  suspended_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvitationResponse {
  id: string;
  tenant_id: string | null;
  email: string;
  invited_by: string | null;
  invited_role_id: string | null;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  expires_at: string;
  accepted_by: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface InvitationCreateResponse {
  invitation: InvitationResponse;
  token: string;
}

export interface TokenValidationResponse {
  invitation: InvitationResponse | null;
  is_valid: boolean;
}

export interface OnboardingSessionResponse {
  id: string;
  tenant_id: string;
  owner_id: string | null;
  status: string;
  current_step: string;
  checklist_state: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  completed_at: string | null;
}

export interface OnboardingWizardState {
  session: OnboardingSessionResponse;
  step_data: Record<string, unknown>;
  checklist: {
    step_0_accepted: boolean;
    step_1_complete: boolean;
    step_2_complete: boolean;
    step_3_complete: boolean;
    step_4_complete: boolean;
    step_5_complete: boolean;
    step_6_complete: boolean;
    step_7_complete: boolean;
    step_8_complete: boolean;
    step_9_complete: boolean;
    step_10_submitted: boolean;
  };
  can_submit: boolean;
  validation_errors: Record<string, string[]>;
}

export interface CreateInvitationRequest {
  email: string;
  hospital_name?: string;
  expires_in_hours?: number;
  metadata?: Record<string, unknown>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface CurrentUser {
  id: string;
  email: string;
  user_type: string;
  tenant_id: string | null;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_V2_PREFIX = '/api/v2';

class SuperAdminAPI {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = `${API_BASE_URL}${API_V2_PREFIX}/super-admin`;
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('super_admin_token') 
      : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // =========================================================================
  // Authentication
  // =========================================================================
  async login(email: string, password: string): Promise<TokenResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await this.handleResponse<TokenResponse>(response);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('super_admin_token', data.access_token);
    }
    
    return data;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('super_admin_token');
      localStorage.removeItem('super_admin_profile');
    }
  }

  async getCurrentUser(): Promise<CurrentUser> {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<CurrentUser>(response);
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('super_admin_token');
  }

  // =========================================================================
  // Dashboard
  // =========================================================================
  async getDashboard(): Promise<DashboardMetrics> {
    const response = await fetch(`${this.baseUrl}/dashboard`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<DashboardMetrics>(response);
  }

  // =========================================================================
  // Tenants
  // =========================================================================
  async listTenants(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<TenantResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.offset) searchParams.append('offset', String(params.offset));
    
    const url = `${this.baseUrl}/tenants${searchParams.toString() ? '?' + searchParams : ''}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<TenantResponse[]>(response);
  }

  async getTenant(tenantId: string): Promise<TenantResponse> {
    const response = await fetch(`${this.baseUrl}/tenants/${tenantId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<TenantResponse>(response);
  }

  async createTenant(data: Partial<TenantResponse>): Promise<TenantResponse> {
    const response = await fetch(`${this.baseUrl}/tenants`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<TenantResponse>(response);
  }

  async updateTenant(tenantId: string, data: Partial<TenantResponse>): Promise<TenantResponse> {
    const response = await fetch(`${this.baseUrl}/tenants/${tenantId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<TenantResponse>(response);
  }

  async archiveTenant(tenantId: string): Promise<TenantResponse> {
    const response = await fetch(`${this.baseUrl}/tenants/${tenantId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<TenantResponse>(response);
  }

  // =========================================================================
  // Invitations
  // =========================================================================
  async listInvitations(params?: {
    status?: string;
    email?: string;
    limit?: number;
    offset?: number;
  }): Promise<InvitationResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.email) searchParams.append('email', params.email);
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.offset) searchParams.append('offset', String(params.offset));
    
    const url = `${this.baseUrl}/invitations${searchParams.toString() ? '?' + searchParams : ''}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<InvitationResponse[]>(response);
  }

  async getInvitation(invitationId: string): Promise<InvitationResponse> {
    const response = await fetch(`${this.baseUrl}/invitations/${invitationId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<InvitationResponse>(response);
  }

  async createInvitation(data: CreateInvitationRequest): Promise<InvitationCreateResponse> {
    const response = await fetch(`${this.baseUrl}/invitations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<InvitationCreateResponse>(response);
  }

  async revokeInvitation(invitationId: string): Promise<InvitationResponse> {
    const response = await fetch(`${this.baseUrl}/invitations/${invitationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<InvitationResponse>(response);
  }

  async validateToken(token: string): Promise<TokenValidationResponse> {
    const response = await fetch(`${this.baseUrl}/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return this.handleResponse<TokenValidationResponse>(response);
  }

  // =========================================================================
  // Onboarding Sessions
  // =========================================================================
  async listOnboardingSessions(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<OnboardingSessionResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.offset) searchParams.append('offset', String(params.offset));
    
    const url = `${this.baseUrl}/onboarding/sessions${searchParams.toString() ? '?' + searchParams : ''}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<OnboardingSessionResponse[]>(response);
  }

  async getOnboardingSession(sessionId: string): Promise<OnboardingWizardState> {
    const response = await fetch(`${this.baseUrl}/onboarding/sessions/${sessionId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<OnboardingWizardState>(response);
  }

  async getOnboardingByTenant(tenantId: string): Promise<OnboardingWizardState> {
    const response = await fetch(`${this.baseUrl}/onboarding/tenant/${tenantId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<OnboardingWizardState>(response);
  }

  async approveOnboarding(sessionId: string): Promise<OnboardingSessionResponse> {
    const response = await fetch(`${this.baseUrl}/onboarding/sessions/${sessionId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<OnboardingSessionResponse>(response);
  }

  async rejectOnboarding(sessionId: string, reason?: string): Promise<OnboardingSessionResponse> {
    const response = await fetch(`${this.baseUrl}/onboarding/sessions/${sessionId}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    return this.handleResponse<OnboardingSessionResponse>(response);
  }
}

// Export singleton instance
export const superAdminAPI = new SuperAdminAPI();

// Export default for backwards compatibility
export default superAdminAPI;
