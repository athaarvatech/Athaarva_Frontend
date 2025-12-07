/**
 * Hospital Admin API Service
 * 
 * This service connects to the hospital management APIs for:
 * - Hospital profile management
 * - Branding configuration
 * - Staff management
 * - Settings
 */

import { superAdminAPI } from './super-admin';

// Types for Hospital Admin operations
export interface HospitalProfile {
  id: string;
  tenant_id: string;
  display_name: string;
  legal_name: string;
  parent_entity: string | null;
  registration_number: string | null;
  gst_number: string | null;
  pan_number: string | null;
  established_date: string | null;
  ownership_model: string;
  timezone: string;
  locale: string;
  address: AddressData;
  contact: ContactData;
  data_protection_officer: DataProtectionOfficerData | null;
  telehealth_policy: TelehealthPolicyData | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ContactData {
  phone: string;
  email: string;
  website: string | null;
  emergency_phone: string | null;
}

export interface DataProtectionOfficerData {
  name: string;
  email: string;
  phone: string;
}

export interface TelehealthPolicyData {
  enabled: boolean;
  platforms: string[];
  consent_required: boolean;
  recording_policy: string;
}

export interface TenantBranding {
  id: string;
  tenant_id: string;
  logo_light_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  hero_image_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  font_heading: string;
  font_body: string;
  button_radius: string;
  custom_css: string | null;
  welcome_title: string;
  welcome_subtitle: string;
  welcome_cta: string;
  login_title: string;
  login_subtitle: string;
  footer_text: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface BrandingUpdate {
  logo_light_url?: string;
  logo_dark_url?: string;
  favicon_url?: string;
  hero_image_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  text_color?: string;
  background_color?: string;
  font_heading?: string;
  font_body?: string;
  button_radius?: string;
  custom_css?: string;
  welcome_title?: string;
  welcome_subtitle?: string;
  welcome_cta?: string;
  login_title?: string;
  login_subtitle?: string;
  footer_text?: string;
}

export interface StaffMember {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  role: string;
  department: string | null;
  phone: string | null;
  status: 'invited' | 'active' | 'suspended' | 'inactive';
  invited_at: string;
  joined_at: string | null;
  last_active_at: string | null;
}

export interface StaffInviteRequest {
  email: string;
  full_name: string;
  role: string;
  department?: string;
}

export interface DashboardStats {
  total_staff: number;
  active_staff: number;
  pending_invites: number;
  total_patients: number;
  total_appointments: number;
  appointments_today: number;
  revenue_this_month: number;
  upcoming_appointments: Array<{
    id: string;
    patient_name: string;
    doctor_name: string;
    time: string;
    type: string;
  }>;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_V1_PREFIX = '/api/v1';

class HospitalAdminAPI {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = `${API_BASE_URL}${API_V1_PREFIX}`;
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // =========================================================================
  // Hospital Profile
  // =========================================================================
  async getProfile(): Promise<HospitalProfile> {
    const response = await fetch(`${this.baseUrl}/hospital/profile`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<HospitalProfile>(response);
  }

  async updateProfile(data: Partial<HospitalProfile>): Promise<HospitalProfile> {
    const response = await fetch(`${this.baseUrl}/hospital/profile`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<HospitalProfile>(response);
  }

  // =========================================================================
  // Branding
  // =========================================================================
  async getBranding(): Promise<TenantBranding> {
    const response = await fetch(`${this.baseUrl}/hospital/branding`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<TenantBranding>(response);
  }

  async updateBranding(data: BrandingUpdate): Promise<TenantBranding> {
    const response = await fetch(`${this.baseUrl}/hospital/branding`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<TenantBranding>(response);
  }

  async uploadLogo(file: File, type: 'light' | 'dark' | 'favicon' | 'hero'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null;

    const response = await fetch(`${this.baseUrl}/hospital/branding/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return this.handleResponse<{ url: string }>(response);
  }

  // =========================================================================
  // Staff Management
  // =========================================================================
  async listStaff(params?: {
    role?: string;
    status?: string;
    department?: string;
    limit?: number;
    offset?: number;
  }): Promise<StaffMember[]> {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.append('role', params.role);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.department) searchParams.append('department', params.department);
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.offset) searchParams.append('offset', String(params.offset));

    const url = `${this.baseUrl}/hospital/staff${searchParams.toString() ? '?' + searchParams : ''}`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<StaffMember[]>(response);
  }

  async inviteStaff(data: StaffInviteRequest): Promise<StaffMember> {
    const response = await fetch(`${this.baseUrl}/hospital/staff/invite`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<StaffMember>(response);
  }

  async updateStaffMember(staffId: string, data: Partial<StaffMember>): Promise<StaffMember> {
    const response = await fetch(`${this.baseUrl}/hospital/staff/${staffId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<StaffMember>(response);
  }

  async removeStaffMember(staffId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/hospital/staff/${staffId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to remove staff member' }));
      throw new Error(error.detail);
    }
  }

  // =========================================================================
  // Dashboard
  // =========================================================================
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${this.baseUrl}/hospital/dashboard`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<DashboardStats>(response);
  }

  // =========================================================================
  // Settings
  // =========================================================================
  async getSettings(): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/hospital/settings`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Record<string, unknown>>(response);
  }

  async updateSettings(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.baseUrl}/hospital/settings`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Record<string, unknown>>(response);
  }
}

// Export singleton instance
export const hospitalAdminAPI = new HospitalAdminAPI();

// Export default for convenience
export default hospitalAdminAPI;
