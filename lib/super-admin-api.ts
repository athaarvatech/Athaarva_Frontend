import { SuperAdminMockRepo, MockInvitation, MockInviteStatus, SuperAdminDashboardMetrics } from './mock/super-admin-db';

export const SUPER_ADMIN_DEFAULT_CREDENTIALS = {
  email: 'super.admin@athaarva.com',
  password: 'supersecure',
} as const;

export interface InvitationListResponse {
  invitations: MockInvitation[];
  total: number;
  per_page: number;
  page: number;
  total_pages: number;
  summary: {
    expiringSoon: number;
    pending: number;
    used: number;
    revoked: number;
  };
}

// Super Admin API Service
export class SuperAdminAPIService {
  // Helper method to get auth headers (kept for API parity, though we operate locally)
  private static getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : null;
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
    const data = await SuperAdminMockRepo.authenticate(email, password);

    if (typeof window !== 'undefined') {
      localStorage.setItem('super_admin_token', data.access_token);
      localStorage.setItem('super_admin_profile', JSON.stringify(data.profile));
    }

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
    return SuperAdminMockRepo.getProfile();
  }

  // Create invitation
  static async createInvitation(data: {
    email: string;
    contactName: string;
    hospitalName: string;
    planTier: MockInvitation['planTier'];
    templateSlug: MockInvitation['templateSlug'];
    internalOwner: string;
    region: string;
    expiresInDays: number;
    notes?: string;
  }) {
    return SuperAdminMockRepo.createInvitation(data);
  }

  // Get invitations list
  static async getInvitations(params: {
    page?: number;
    per_page?: number;
    status?: MockInviteStatus;
    search?: string;
    plan?: MockInvitation['planTier'];
  } = {}): Promise<InvitationListResponse> {
    return SuperAdminMockRepo.listInvitations(params);
  }

  // Revoke invitation
  static async revokeInvitation(invitationId: number) {
    return SuperAdminMockRepo.revokeInvitation(invitationId);
  }

  // Validate invitation token (public endpoint)
  static async validateToken(token: string): Promise<{
    valid: boolean;
    invitation_id?: number;
    email?: string;
    expires_at?: string;
    hospital_draft?: Record<string, unknown> | null;
    message: string;
  }> {
    // Stubbed validation for now.
    const dbResponse = await SuperAdminMockRepo.listInvitations();
    const invite = dbResponse.invitations.find((item) => item.inviteToken === token);
    if (!invite) {
      return { valid: false, message: 'Token not found' };
    }
    const expired = new Date(invite.expiresAt).getTime() < Date.now();
    return expired
      ? { valid: false, message: 'Token expired', invitation_id: invite.id }
      : {
          valid: true,
          invitation_id: invite.id,
          email: invite.email,
          expires_at: invite.expiresAt,
          hospital_draft: invite.hospitalDraft,
          message: 'Token valid',
        };
  }

  // Cleanup expired invitations
  static async cleanupExpiredInvitations() {
    return SuperAdminMockRepo.cleanupExpiredInvitations();
  }

  static async getDashboardSnapshot(): Promise<SuperAdminDashboardMetrics> {
    return SuperAdminMockRepo.getDashboardSnapshot();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('super_admin_token');
  }
}

