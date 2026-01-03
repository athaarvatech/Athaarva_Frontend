/**
 * Team & Staff Invitation API Service
 * 
 * This service handles team management operations including:
 * - Sending invitations to doctors and staff
 * - Managing pending invitations
 * - Team member CRUD operations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============================================================================
// Types
// =============================================================================

export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'doctor' | 'nurse' | 'staff' | 'admin';
  department?: string;
  designation?: string;
  status: 'active' | 'pending' | 'suspended';
  avatar_url?: string;
  joined_at?: string;
  invited_at?: string;
  tenant_id: string;
}

export interface InvitationRequest {
  email: string;
  full_name: string;
  phone?: string;
  role: 'doctor' | 'nurse' | 'staff';
  department?: string;
  send_welcome_email?: boolean;
  personal_message?: string;
}

export interface BulkInvitationRequest {
  invitations: InvitationRequest[];
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  invited_at: string;
  expires_at: string;
  status: 'pending' | 'expired' | 'accepted';
  invited_by: string;
  tenant_id: string;
}

export interface InvitationValidationResponse {
  valid: boolean;
  email: string;
  role: string;
  hospital_name: string;
  hospital_logo?: string;
  primary_color?: string;
  secondary_color?: string;
  invited_by: string;
  department?: string;
  message?: string;
}

export interface TeamStats {
  total_members: number;
  active_doctors: number;
  active_staff: number;
  pending_invitations: number;
}

// =============================================================================
// API Service Class
// =============================================================================

class TeamAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1/team`;
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('hospital_admin_token') || localStorage.getItem('access_token')
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
  // Team Members
  // =========================================================================

  /**
   * Get all team members for the current tenant
   */
  async getTeamMembers(filters?: {
    role?: string;
    status?: string;
    department?: string;
  }): Promise<TeamMember[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.department) params.append('department', filters.department);

    const response = await fetch(
      `${this.baseUrl}/members?${params.toString()}`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse<TeamMember[]>(response);
  }

  /**
   * Get team member by ID
   */
  async getTeamMember(memberId: string): Promise<TeamMember> {
    const response = await fetch(
      `${this.baseUrl}/members/${memberId}`,
      { headers: this.getAuthHeaders() }
    );
    return this.handleResponse<TeamMember>(response);
  }

  /**
   * Update team member
   */
  async updateTeamMember(
    memberId: string,
    updates: Partial<TeamMember>
  ): Promise<TeamMember> {
    const response = await fetch(`${this.baseUrl}/members/${memberId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return this.handleResponse<TeamMember>(response);
  }

  /**
   * Suspend team member
   */
  async suspendTeamMember(memberId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/members/${memberId}/suspend`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ success: boolean }>(response);
  }

  /**
   * Activate team member
   */
  async activateTeamMember(memberId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/members/${memberId}/activate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ success: boolean }>(response);
  }

  /**
   * Remove team member
   */
  async removeTeamMember(memberId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/members/${memberId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ success: boolean }>(response);
  }

  // =========================================================================
  // Invitations
  // =========================================================================

  /**
   * Send single invitation
   */
  async sendInvitation(invitation: InvitationRequest): Promise<PendingInvitation> {
    const response = await fetch(`${this.baseUrl}/invitations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(invitation),
    });
    return this.handleResponse<PendingInvitation>(response);
  }

  /**
   * Send bulk invitations
   */
  async sendBulkInvitations(
    invitations: InvitationRequest[]
  ): Promise<{ sent: number; failed: number; results: PendingInvitation[] }> {
    const response = await fetch(`${this.baseUrl}/invitations/bulk`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ invitations }),
    });
    return this.handleResponse<{ sent: number; failed: number; results: PendingInvitation[] }>(
      response
    );
  }

  /**
   * Get pending invitations
   */
  async getPendingInvitations(): Promise<PendingInvitation[]> {
    const response = await fetch(`${this.baseUrl}/invitations`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PendingInvitation[]>(response);
  }

  /**
   * Resend invitation
   */
  async resendInvitation(invitationId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/invitations/${invitationId}/resend`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ success: boolean }>(response);
  }

  /**
   * Cancel invitation
   */
  async cancelInvitation(invitationId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/invitations/${invitationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ success: boolean }>(response);
  }

  /**
   * Validate invitation token (public endpoint)
   */
  async validateInvitation(token: string): Promise<InvitationValidationResponse> {
    const response = await fetch(`${this.baseUrl}/invitations/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return this.handleResponse<InvitationValidationResponse>(response);
  }

  // =========================================================================
  // Staff/Doctor Onboarding
  // =========================================================================

  /**
   * Complete staff onboarding
   */
  async completeStaffOnboarding(token: string, data: {
    full_name: string;
    phone: string;
    password: string;
    department: string;
    designation: string;
    employee_id?: string;
    date_of_joining: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
  }): Promise<{ success: boolean; user_id: string; access_token: string }> {
    const response = await fetch(`${this.baseUrl}/staff/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...data }),
    });
    return this.handleResponse<{ success: boolean; user_id: string; access_token: string }>(
      response
    );
  }

  /**
   * Complete doctor onboarding
   */
  async completeDoctorOnboarding(token: string, data: {
    full_name: string;
    phone: string;
    password: string;
    specialization: string[];
    license_number: string;
    license_expiry: string;
    qualifications: { degree: string; institution: string; year: number }[];
    experience_years: number;
    consultation_fee: number;
    available_days: string[];
    address: string;
    city: string;
    state: string;
    pincode: string;
  }): Promise<{ success: boolean; user_id: string; access_token: string }> {
    const response = await fetch(`${this.baseUrl}/doctor/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...data }),
    });
    return this.handleResponse<{ success: boolean; user_id: string; access_token: string }>(
      response
    );
  }

  // =========================================================================
  // Stats
  // =========================================================================

  /**
   * Get team statistics
   */
  async getTeamStats(): Promise<TeamStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<TeamStats>(response);
  }
}

// Export singleton instance
export const teamAPI = new TeamAPI();
export default teamAPI;
