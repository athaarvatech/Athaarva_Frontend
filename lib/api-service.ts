import axios from 'axios';
import { AxiosRequestHeaders } from 'axios';
// Removed AxiosInstance import as it's not explicitly exported by 'axios'
import { API_CONFIG, DEFAULT_HEADERS, REQUEST_TIMEOUT } from './api-config';

// Types
export interface ApiResponse<T = any> {
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
  email: string;
  full_name: string;
  phone?: string;
  user_type: 'patient' | 'doctor' | 'hospital';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

// Create axios instance
class ApiService {
  private api: axios.AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: DEFAULT_HEADERS,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          // Redirect to login if needed
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && !this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  // Generic API methods
  async get<T>(url: string, config?: AxiosRequestHeaders): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestHeaders): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestHeaders): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestHeaders): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  // Authentication methods
  async signup(userData: {
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    phone: string;
    user_type: 'patient' | 'doctor' | 'hospital';
  }): Promise<AuthTokens> {
    const response = await this.post<AuthTokens>(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, userData);
    this.setToken(response.access_token);
    return response;
  }

  async signin(credentials: {
    email: string;
    password: string;
  }): Promise<AuthTokens> {
    const response = await this.post<AuthTokens>(API_CONFIG.ENDPOINTS.AUTH.SIGNIN, credentials);
    this.setToken(response.access_token);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>(API_CONFIG.ENDPOINTS.AUTH.ME);
  }

  async verifyToken(): Promise<{ valid: boolean; user_id: number; user_type: string }> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_TOKEN);
  }

  // OTP verification methods
  async verifyOtp(otpData: {
    email: string;
    otp_code: string;
  }): Promise<AuthTokens> {
    const response = await this.post<AuthTokens>(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP, otpData);
    this.setToken(response.access_token);
    return response;
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.RESEND_OTP, { email });
  }

  // Password reset methods
  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(resetData: {
    reset_token: string;
    email: string;
    new_password: string;
    confirm_password: string;
  }): Promise<{ message: string }> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
  }

  // Doctor methods
  async getDoctorSpecializations(): Promise<Array<{ id: number; name: string; description?: string }>> {
    return this.get(API_CONFIG.ENDPOINTS.DOCTORS.SPECIALIZATIONS);
  }

  async completeDoctorOnboarding(onboardingData: any): Promise<any> {
    return this.post(API_CONFIG.ENDPOINTS.DOCTORS.ONBOARDING, onboardingData);
  }

  async getDoctorProfile(): Promise<any> {
    return this.get(API_CONFIG.ENDPOINTS.DOCTORS.PROFILE);
  }

  async updateDoctorProfile(profileData: any): Promise<{ message: string }> {
    return this.put(API_CONFIG.ENDPOINTS.DOCTORS.PROFILE, profileData);
  }

  async getDoctorSchedule(): Promise<any> {
    return this.get(API_CONFIG.ENDPOINTS.DOCTORS.SCHEDULE);
  }

  // Patient methods
  async completePatientOnboarding(onboardingData: any): Promise<any> {
    return this.post(API_CONFIG.ENDPOINTS.PATIENTS.ONBOARDING, onboardingData);
  }

  async getPatientProfile(): Promise<any> {
    return this.get(API_CONFIG.ENDPOINTS.PATIENTS.PROFILE);
  }

  async updatePatientProfile(profileData: any): Promise<{ message: string }> {
    return this.put(API_CONFIG.ENDPOINTS.PATIENTS.PROFILE, profileData);
  }

  async getPatientMedicalHistory(): Promise<any> {
    return this.get(API_CONFIG.ENDPOINTS.PATIENTS.MEDICAL_HISTORY);
  }

  // Onboarding methods
  async getOnboardingStatus(): Promise<{
    user_type: string;
    profile_exists: boolean;
    onboarding_completed: boolean;
    needs_onboarding: boolean;
  }> {
    return this.get(API_CONFIG.ENDPOINTS.ONBOARDING.STATUS);
  }

  async getNextOnboardingStep(): Promise<{
    next_step: string;
    step_number: number;
  }> {
    return this.get(API_CONFIG.ENDPOINTS.ONBOARDING.NEXT_STEP);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    this.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
