/**
 * Super Admin Security Configuration
 * 
 * This file contains configuration for the secure super-admin access system
 * including the obfuscated route path and security settings.
 */

// Obfuscated route path for super-admin (not easily guessable)
export const SUPER_ADMIN_CONFIG = {
  // Hidden route path - change this to any random string for your deployment
  OBFUSCATED_PATH: '/platform-ctrl-9x7k2m',
  
  // Old path for migration (redirects to new path)
  LEGACY_PATH: '/super-admin',
  
  // Session configuration
  SESSION_EXPIRY_HOURS: 4,
  OTP_EXPIRY_MINUTES: 15,
  MAX_OTP_ATTEMPTS: 3,
  
  // Local storage keys
  STORAGE_KEYS: {
    SESSION_TOKEN: 'sa_session_token',
    ACCESS_TOKEN: 'super_admin_token',
    ADMIN_PROFILE: 'super_admin_profile',
    OTP_PENDING: 'sa_otp_pending',
  },
  
  // API endpoints
  API_ENDPOINTS: {
    CHECK_IP: '/api/v1/super-admin/secure/check-ip',
    INITIATE_LOGIN: '/api/v1/super-admin/secure/initiate-login',
    VERIFY_OTP: '/api/v1/super-admin/secure/verify-otp',
    RESEND_OTP: '/api/v1/super-admin/secure/resend-otp',
    VALIDATE_SESSION: '/api/v1/super-admin/secure/validate-session',
    LOGOUT: '/api/v1/super-admin/secure/logout',
    ACCESS_LOGS: '/api/v1/super-admin/secure/access-logs',
  },
  
  // Routes within the super-admin section
  ROUTES: {
    LOGIN: '/login',
    VERIFY: '/verify',
    DASHBOARD: '/dashboard',
    INVITES: '/invites',
    TENANTS: '/tenants',
    TEMPLATES: '/templates',
    SETTINGS: '/settings',
    AUDIT_LOGS: '/audit-logs',
  },
} as const;

// Helper function to get full path
export function getSuperAdminPath(route: keyof typeof SUPER_ADMIN_CONFIG.ROUTES): string {
  return `${SUPER_ADMIN_CONFIG.OBFUSCATED_PATH}${SUPER_ADMIN_CONFIG.ROUTES[route]}`;
}

// Helper function to check if a path is a super-admin path
export function isSuperAdminPath(pathname: string): boolean {
  return pathname.startsWith(SUPER_ADMIN_CONFIG.OBFUSCATED_PATH) ||
         pathname.startsWith(SUPER_ADMIN_CONFIG.LEGACY_PATH);
}

// Types for security API responses
export interface IPCheckResponse {
  ip_address: string;
  is_whitelisted: boolean;
  message: string;
}

export interface InitiateLoginResponse {
  success: boolean;
  message: string;
  admin_id: string;
  email: string;
  otp_sent: boolean;
  expires_in_minutes: number;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  access_token?: string;
  session_token?: string;
  token_type: string;
  expires_in: number;
  remaining_attempts: number;
}

export interface SessionValidationResponse {
  valid: boolean;
  admin_id?: string;
  email?: string;
  expires_at?: string;
}

export interface AccessLogEntry {
  id: string;
  admin_id?: string;
  admin_email?: string;
  action: string;
  ip_address: string;
  success: boolean;
  details: Record<string, unknown>;
  created_at: string;
}

// Security API service
export class SuperAdminSecurityAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (typeof window !== 'undefined') {
      const sessionToken = localStorage.getItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.SESSION_TOKEN);
      if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
      }
    }
    
    return headers;
  }

  /**
   * Check if current IP is whitelisted
   */
  async checkIP(): Promise<IPCheckResponse> {
    const response = await fetch(
      `${this.baseUrl}${SUPER_ADMIN_CONFIG.API_ENDPOINTS.CHECK_IP}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return this.handleResponse<IPCheckResponse>(response);
  }

  /**
   * Step 1: Initiate login with email and password
   */
  async initiateLogin(email: string, password: string): Promise<InitiateLoginResponse> {
    const response = await fetch(
      `${this.baseUrl}${SUPER_ADMIN_CONFIG.API_ENDPOINTS.INITIATE_LOGIN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );
    
    const data = await this.handleResponse<InitiateLoginResponse>(response);
    
    if (data.success && typeof window !== 'undefined') {
      // Store pending OTP state
      localStorage.setItem(
        SUPER_ADMIN_CONFIG.STORAGE_KEYS.OTP_PENDING,
        JSON.stringify({
          admin_id: data.admin_id,
          email: data.email,
          expires_at: Date.now() + data.expires_in_minutes * 60 * 1000,
        })
      );
    }
    
    return data;
  }

  /**
   * Step 2: Verify OTP and get session
   */
  async verifyOTP(adminId: string, otpCode: string): Promise<VerifyOTPResponse> {
    const response = await fetch(
      `${this.baseUrl}${SUPER_ADMIN_CONFIG.API_ENDPOINTS.VERIFY_OTP}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminId, otp_code: otpCode }),
      }
    );
    
    const data = await this.handleResponse<VerifyOTPResponse>(response);
    
    if (data.success && typeof window !== 'undefined') {
      // Store tokens
      if (data.access_token) {
        localStorage.setItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
      }
      if (data.session_token) {
        localStorage.setItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.SESSION_TOKEN, data.session_token);
      }
      // Clear pending OTP state
      localStorage.removeItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.OTP_PENDING);
    }
    
    return data;
  }

  /**
   * Resend OTP
   */
  async resendOTP(adminId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${this.baseUrl}${SUPER_ADMIN_CONFIG.API_ENDPOINTS.RESEND_OTP}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminId }),
      }
    );
    return this.handleResponse(response);
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<SessionValidationResponse> {
    const response = await fetch(
      `${this.baseUrl}${SUPER_ADMIN_CONFIG.API_ENDPOINTS.VALIDATE_SESSION}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse<SessionValidationResponse>(response);
  }

  /**
   * Logout and revoke session
   */
  async logout(): Promise<void> {
    try {
      await fetch(
        `${this.baseUrl}${SUPER_ADMIN_CONFIG.API_ENDPOINTS.LOGOUT}`,
        {
          method: 'POST',
          headers: this.getHeaders(),
        }
      );
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API response
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.SESSION_TOKEN);
        localStorage.removeItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.ADMIN_PROFILE);
        localStorage.removeItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.OTP_PENDING);
      }
    }
  }

  /**
   * Get access logs
   */
  async getAccessLogs(limit: number = 100, offset: number = 0): Promise<AccessLogEntry[]> {
    const response = await fetch(
      `${this.baseUrl}${SUPER_ADMIN_CONFIG.API_ENDPOINTS.ACCESS_LOGS}?limit=${limit}&offset=${offset}`,
      { headers: this.getHeaders() }
    );
    const data = await this.handleResponse<{ logs: AccessLogEntry[] }>(response);
    return data.logs;
  }

  /**
   * Check if user has a valid session
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.SESSION_TOKEN);
  }

  /**
   * Get pending OTP state
   */
  getPendingOTP(): { admin_id: string; email: string; expires_at: number } | null {
    if (typeof window === 'undefined') return null;
    
    const pending = localStorage.getItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.OTP_PENDING);
    if (!pending) return null;
    
    try {
      const data = JSON.parse(pending);
      if (data.expires_at < Date.now()) {
        localStorage.removeItem(SUPER_ADMIN_CONFIG.STORAGE_KEYS.OTP_PENDING);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const superAdminSecurityAPI = new SuperAdminSecurityAPI();
