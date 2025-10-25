import axios from 'axios';
import { API_CONFIG, DEFAULT_HEADERS, REQUEST_TIMEOUT, LONG_REQUEST_TIMEOUT } from './api-config';

// API types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

export interface AuthTokens {
  access_token: string;
  token_type?: string;
  user_id?: number;
  user_type?: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  user_type: 'doctor' | 'patient' | 'hospital_admin';
  is_verified: boolean;
}

export interface ConfigHeaders {
  [key: string]: string;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  user_type: 'patient' | 'doctor' | 'hospital_admin' | 'hospital';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface OnboardingStatus {
  user_type: 'patient' | 'doctor' | 'hospital_admin' | 'hospital';
  profile_exists: boolean;
  onboarding_completed: boolean;
  needs_onboarding: boolean;
}

export interface DoctorOnboardingData {
  specialization: string;
  license_number: string;
  clinic_address: string;
  contact_hours: string;
}

export interface PatientOnboardingData {
  date_of_birth: string;
  emergency_contact: string;
  medical_history?: string;
  current_medications?: string;
}

export interface DoctorProfile {
  id: number;
  full_name: string;
  email: string;
  specialization: string;
  license_number: string;
  clinic_address: string;
  contact_hours: string;
}

export interface PatientProfile {
  id: number;
  full_name: string;
  email: string;
  date_of_birth: string;
  emergency_contact: string;
  medical_history?: string;
  current_medications?: string;
}

export interface MedicalHistory {
  id: number;
  patient_id: number;
  record_type: string;
  date: string;
  description: string;
}

export interface RequestConfig {
  headers?: ConfigHeaders;
}

export type RequestData = unknown;

// Create axios instance
class ApiService {
  private api: ReturnType<typeof axios.create>;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: DEFAULT_HEADERS,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (config: any) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any) => response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  clearAuth(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_id');
      localStorage.removeItem('hospital_id');
      localStorage.removeItem('hospital_code');
    }
  }

  // HTTP methods with enhanced error handling
  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.api.get(url, config);
      return response.data as T;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.code === 'ECONNABORTED') {
        console.error(`Request timeout for GET ${url}`);
        throw new Error('Request timed out. The server is taking too long to respond.');
      }
      throw error;
    }
  }

  async post<T>(url: string, data?: RequestData, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.api.post(url, data, config);
      return response.data as T;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.code === 'ECONNABORTED') {
        console.error(`Request timeout for POST ${url}`);
        throw new Error('Request timed out. The server is taking too long to respond.');
      }
      throw error;
    }
  }

  async put<T>(url: string, data?: RequestData, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.api.put(url, data, config);
      return response.data as T;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.code === 'ECONNABORTED') {
        console.error(`Request timeout for PUT ${url}`);
        throw new Error('Request timed out. The server is taking too long to respond.');
      }
      throw error;
    }
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.api.delete(url, config);
      return response.data as T;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.code === 'ECONNABORTED') {
        console.error(`Request timeout for DELETE ${url}`);
        throw new Error('Request timed out. The server is taking too long to respond.');
      }
      throw error;
    }
  }

  // Special method for long-running requests
  async getLongRunning<T>(url: string, config?: RequestConfig): Promise<T> {
    const extendedConfig = {
      ...config,
      timeout: LONG_REQUEST_TIMEOUT,
    };
    try {
      const response = await this.api.get(url, extendedConfig);
      return response.data as T;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.code === 'ECONNABORTED') {
        console.error(`Long request timeout for GET ${url}`);
        throw new Error('Request timed out even with extended timeout. Please check the server.');
      }
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<ApiResponse<AuthTokens>> {
    const response = await this.post<ApiResponse<AuthTokens>>('/auth/login/', {
      email,
      password
    });
    
    if (response.data?.access_token) {
      this.setToken(response.data.access_token);
    }
    
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    full_name: string;
    user_type: 'doctor' | 'patient';
  }): Promise<ApiResponse<User>> {
    return this.post<ApiResponse<User>>('/auth/register/', userData);
  }

  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout/');
    } finally {
      this.clearAuth();
    }
  }

  async refreshToken(): Promise<ApiResponse<AuthTokens>> {
    const response = await this.post<ApiResponse<AuthTokens>>('/auth/refresh/');
    
    if (response.data?.access_token) {
      this.setToken(response.data.access_token);
    }
    
    return response;
  }

  async resetPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/auth/password-reset/', {
      email
    });
  }

  async confirmPasswordReset(
    token: string,
    password: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/auth/password-reset-confirm/', {
      token,
      password
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/auth/verify-email/', {
      token
    });
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<ApiResponse<{ message: string }>>('/auth/resend-verification/', {
      email
    });
  }

  // Profile endpoints
  async getCurrentUser(): Promise<UserProfile> {
    return this.get<UserProfile>(API_CONFIG.ENDPOINTS.AUTH.ME);
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.put<ApiResponse<UserProfile>>('/auth/user/', profileData);
  }

  // Doctor specific endpoints
  async completeDoctorOnboarding(onboardingData: DoctorOnboardingData): Promise<ApiResponse<DoctorProfile>> {
    return this.post<ApiResponse<DoctorProfile>>('/doctors/onboarding/', onboardingData);
  }

  async getDoctorProfile(): Promise<ApiResponse<DoctorProfile>> {
    return this.get<ApiResponse<DoctorProfile>>('/doctors/profile/');
  }

  async updateDoctorProfile(profileData: Partial<DoctorProfile>): Promise<{ message: string }> {
    return this.put<{ message: string }>('/doctors/profile/', profileData);
  }

  async getDoctorSchedule(): Promise<ApiResponse<unknown>> {
    return this.get<ApiResponse<unknown>>('/doctors/schedule/');
  }

  async getOnboardingStatus(): Promise<OnboardingStatus> {
    return this.get<OnboardingStatus>(API_CONFIG.ENDPOINTS.ONBOARDING.STATUS);
  }

  // Patient specific endpoints
  async completePatientOnboarding(onboardingData: PatientOnboardingData): Promise<ApiResponse<PatientProfile>> {
    return this.post<ApiResponse<PatientProfile>>('/patients/onboarding/', onboardingData);
  }

  async getPatientProfile(): Promise<ApiResponse<PatientProfile>> {
    return this.get<ApiResponse<PatientProfile>>('/patients/profile/');
  }

  async updatePatientProfile(profileData: Partial<PatientProfile>): Promise<{ message: string }> {
    return this.put<{ message: string }>('/patients/profile/', profileData);
  }

  async getPatientMedicalHistory(): Promise<ApiResponse<MedicalHistory[]>> {
    return this.get<ApiResponse<MedicalHistory[]>>('/patients/medical-history/');
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
