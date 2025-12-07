/**
 * Hospital Onboarding API Service
 * 
 * This service connects to the /api/v1/onboarding/ endpoints.
 * Used by hospital admins during the onboarding wizard.
 */

// Types matching backend responses
export interface ValidateTokenResponse {
  valid: boolean;
  email: string | null;
  hospital_name: string | null;
  expires_at: string | null;
  message: string;
}

export interface AcceptInvitationRequest {
  token: string;
  full_name: string;
  phone?: string;
  password: string;
  confirm_password: string;
  hospital_code: string;
  hospital_name: string;
}

export interface AcceptInvitationResponse {
  success: boolean;
  message: string;
  tenant_id: string | null;
  user_id: string | null;
  session_id: string | null;
  access_token: string | null;
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

export interface OnboardingChecklist {
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
}

export interface OnboardingWizardState {
  session: OnboardingSessionResponse;
  step_data: {
    organization_profile?: OrganizationProfileData;
    locations_contacts?: LocationsContactsData;
    branding?: BrandingData;
    site_content?: SiteContentData;
    services?: ServicesData;
    leadership?: LeadershipData;
    operational_policies?: OperationalPoliciesData;
    compliance?: ComplianceData;
    integrations?: IntegrationsData;
  };
  checklist: OnboardingChecklist;
  can_submit: boolean;
  validation_errors: Record<string, string[]>;
}

// Step Data Types
export interface OrganizationProfileData {
  hospital_name: string;
  legal_name?: string;
  license_number: string;
  accreditation_number?: string;
  year_established?: number;
  bed_capacity?: number;
  official_email: string;
  phone?: string;
  website?: string;
  description?: string;
}

export interface AddressData {
  street?: string;
  area?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface ContactData {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
}

export interface LocationData {
  code: string;
  name: string;
  address: AddressData;
  phone?: string;
  email?: string;
  is_primary?: boolean;
}

export interface LocationsContactsData {
  primary_address: AddressData;
  locations: LocationData[];
  contacts: ContactData[];
}

export interface BrandingData {
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  typography?: {
    heading_font?: string;
    body_font?: string;
  };
  logo_url?: string;
  favicon_url?: string;
}

export interface SiteContentData {
  welcome_title?: string;
  welcome_subtitle?: string;
  about_us?: string;
  mission_statement?: string;
  vision_statement?: string;
}

export interface ServiceData {
  name: string;
  category?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  is_active?: boolean;
}

export interface DepartmentData {
  code: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface ServicesData {
  departments: DepartmentData[];
  services: ServiceData[];
  specializations: string[];
}

export interface LeaderPersonData {
  name: string;
  role: string;
  qualification?: string;
  bio?: string;
  photo_url?: string;
}

export interface LeadershipData {
  leaders: LeaderPersonData[];
  medical_director?: LeaderPersonData;
}

export interface OperationalPoliciesData {
  visiting_hours?: string;
  payment_methods?: string[];
  insurance_accepted?: string[];
  cancellation_policy?: string;
  emergency_services?: boolean;
}

export interface ComplianceData {
  data_protection_officer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  hipaa_compliant?: boolean;
  telehealth_consent_template?: string;
  terms_accepted?: boolean;
  privacy_policy_accepted?: boolean;
}

export interface IntegrationsData {
  enable_telehealth?: boolean;
  enable_ai_features?: boolean;
  enable_patient_portal?: boolean;
  enable_appointment_reminders?: boolean;
  notification_preferences?: {
    email?: boolean;
    sms?: boolean;
    whatsapp?: boolean;
  };
}

export interface SaveStepRequest {
  data: Record<string, unknown>;
  mark_complete?: boolean;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class OnboardingAPI {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1/onboarding`;
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('onboarding_token') 
      : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      
      // Provide clearer error messages
      if (response.status === 401) {
        throw new Error('Session expired or invalid. Please restart the onboarding process.');
      }
      if (response.status === 403) {
        throw new Error('Access denied. You may not have permission for this action.');
      }
      
      throw new Error(error.detail || error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // =========================================================================
  // Public Endpoints (No Auth Required)
  // =========================================================================
  
  /**
   * Validate an invitation token.
   * Called when user clicks the invitation link.
   */
  async validateToken(token: string): Promise<ValidateTokenResponse> {
    const response = await fetch(`${this.baseUrl}/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return this.handleResponse<ValidateTokenResponse>(response);
  }

  /**
   * Accept invitation and create account.
   * This is Step 0 of the onboarding wizard.
   */
  async acceptInvitation(data: AcceptInvitationRequest): Promise<AcceptInvitationResponse> {
    const response = await fetch(`${this.baseUrl}/accept-invitation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await this.handleResponse<AcceptInvitationResponse>(response);
    
    // Store the token for subsequent requests
    if (result.access_token && typeof window !== 'undefined') {
      localStorage.setItem('onboarding_token', result.access_token);
      localStorage.setItem('onboarding_session_id', result.session_id || '');
      localStorage.setItem('onboarding_tenant_id', result.tenant_id || '');
    }
    
    return result;
  }

  // =========================================================================
  // Authenticated Endpoints
  // =========================================================================
  
  /**
   * Get current onboarding wizard state.
   */
  async getSession(): Promise<OnboardingWizardState> {
    const response = await fetch(`${this.baseUrl}/session`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<OnboardingWizardState>(response);
  }

  /**
   * Save data for a specific step.
   * @param stepNumber - Step number (1-10)
   * @param data - Step data
   * @param markComplete - Whether to mark the step as complete
   */
  async saveStep(
    stepNumber: number,
    data: Record<string, unknown>,
    markComplete: boolean = false
  ): Promise<OnboardingSessionResponse> {
    const response = await fetch(`${this.baseUrl}/session/step/${stepNumber}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ data, mark_complete: markComplete }),
    });
    return this.handleResponse<OnboardingSessionResponse>(response);
  }

  /**
   * Submit onboarding for super admin review.
   */
  async submitForReview(): Promise<OnboardingSessionResponse> {
    const response = await fetch(`${this.baseUrl}/session/submit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<OnboardingSessionResponse>(response);
  }

  // =========================================================================
  // Helper Methods
  // =========================================================================
  
  /**
   * Check if user has an active onboarding session.
   */
  hasActiveSession(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('onboarding_token');
  }

  /**
   * Get stored session info.
   */
  getStoredSessionInfo(): { sessionId: string | null; tenantId: string | null } {
    if (typeof window === 'undefined') {
      return { sessionId: null, tenantId: null };
    }
    return {
      sessionId: localStorage.getItem('onboarding_session_id'),
      tenantId: localStorage.getItem('onboarding_tenant_id'),
    };
  }

  /**
   * Clear stored onboarding session.
   */
  clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding_token');
      localStorage.removeItem('onboarding_session_id');
      localStorage.removeItem('onboarding_tenant_id');
    }
  }

  /**
   * Get step name from number.
   */
  getStepName(stepNumber: number): string {
    const names: Record<number, string> = {
      0: 'Accept Invitation',
      1: 'Organization Profile',
      2: 'Locations & Contacts',
      3: 'Branding & Visual Identity',
      4: 'Site Content',
      5: 'Clinical Services & Pricing',
      6: 'Leadership & Team',
      7: 'Operational Policies',
      8: 'Compliance & Documentation',
      9: 'Integrations & Preferences',
      10: 'Review & Submit',
    };
    return names[stepNumber] || `Step ${stepNumber}`;
  }

  /**
   * Calculate onboarding progress percentage.
   */
  calculateProgress(checklist: OnboardingChecklist): number {
    const steps = [
      checklist.step_0_accepted,
      checklist.step_1_complete,
      checklist.step_2_complete,
      checklist.step_3_complete,
      checklist.step_4_complete,
      checklist.step_5_complete,
      checklist.step_6_complete,
      checklist.step_7_complete,
      checklist.step_8_complete,
      checklist.step_9_complete,
      checklist.step_10_submitted,
    ];
    const completed = steps.filter(Boolean).length;
    return Math.round((completed / steps.length) * 100);
  }
}

// Export singleton instance
export const onboardingAPI = new OnboardingAPI();

// Export default for convenience
export default onboardingAPI;
