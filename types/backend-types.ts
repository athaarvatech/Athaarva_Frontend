/**
 * Backend Type Definitions
 *
 * These types match the UUID-based backend architecture.
 * All IDs are UUIDs (strings), and status fields use ENUMs instead of booleans.
 */

import { UserStatus, VerificationStatus, AppointmentStatus } from "@/lib/utils";

// ===========================
// Core Entity Types
// ===========================

/**
 * Tenant (Hospital) Entity
 */
export interface Tenant {
  id: string; // UUID
  name: string;
  subdomain: string; // Unique subdomain identifier
  status: UserStatus; // 'active' | 'suspended' | 'deactivated'
  contact_email: string;
  contact_phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Patient Entity
 */
export interface Patient {
  id: string; // UUID
  user_id: string; // UUID - references users table
  tenant_id: string; // UUID - references tenants table
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  blood_group?: string;
  address?: string;
  emergency_contact?: string;
  emergency_contact_name?: string;
  medical_history?: string;
  current_medications?: string;
  allergies?: string;
  status: UserStatus; // 'active' | 'suspended' | 'deactivated'
  created_at: string;
  updated_at: string;
}

/**
 * Doctor Entity
 */
export interface Doctor {
  id: string; // UUID
  user_id: string; // UUID - references users table
  tenant_id: string; // UUID - references tenants table
  full_name: string;
  email: string;
  phone?: string;
  specialization: string;
  qualification?: string;
  experience_years?: number;
  license_number: string;
  clinic_address?: string;
  contact_hours?: string;
  consultation_fee?: number;
  status: UserStatus; // 'active' | 'suspended' | 'deactivated'
  verification_status: VerificationStatus; // 'pending' | 'approved' | 'rejected'
  created_at: string;
  updated_at: string;
}

/**
 * Appointment Entity
 */
export interface Appointment {
  id: string; // UUID
  patient_id: string; // UUID
  doctor_id: string; // UUID
  tenant_id: string; // UUID
  appointment_date: string; // ISO date
  appointment_time: string; // Time string
  duration_minutes: number;
  status: AppointmentStatus; // 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  reason?: string;
  notes?: string;
  prescription?: string;
  created_at: string;
  updated_at: string;

  // Populated fields (from joins)
  patient?: Patient;
  doctor?: Doctor;
}

/**
 * Medical Record Entity
 */
export interface MedicalRecord {
  id: string; // UUID
  patient_id: string; // UUID
  doctor_id?: string; // UUID (optional)
  tenant_id: string; // UUID
  record_type:
    | "diagnosis"
    | "prescription"
    | "lab_report"
    | "imaging"
    | "vitals"
    | "other";
  title: string;
  description: string;
  record_date: string; // ISO date
  attachments?: string; // JSON string of attachment URLs
  metadata?: Record<string, unknown>; // Additional structured data
  created_at: string;
  updated_at: string;

  // Populated fields
  patient?: Patient;
  doctor?: Doctor;
}

/**
 * User Entity (Core authentication)
 */
export interface UserEntity {
  id: string; // UUID
  email: string;
  password_hash: string;
  user_type: "patient" | "doctor" | "admin" | "super_admin";
  tenant_id?: string; // UUID (null for super_admin)
  status: UserStatus; // 'active' | 'suspended' | 'deactivated'
  verification_status: VerificationStatus; // 'pending' | 'approved' | 'rejected'
  last_login?: string;
  created_at: string;
  updated_at: string;
}

// ===========================
// API Request/Response Types
// ===========================

/**
 * Patient Registration Request
 */
export interface PatientRegistrationRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  tenant_id?: string; // UUID - optional if registering via subdomain
  subdomain?: string; // Alternative to tenant_id
}

/**
 * Doctor Registration Request
 */
export interface DoctorRegistrationRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  specialization: string;
  license_number: string;
  qualification?: string;
  experience_years?: number;
  tenant_id?: string; // UUID - optional if registering via subdomain
  subdomain?: string; // Alternative to tenant_id
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
  subdomain?: string; // For multi-tenant login
}

/**
 * Login Response
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string; // UUID
    email: string;
    user_type: "patient" | "doctor" | "admin" | "super_admin";
    tenant_id?: string; // UUID
    subdomain?: string;
    full_name?: string;
  };
}

/**
 * JWT Token Payload (decoded)
 */
export interface JWTPayload {
  id: string; // UUID - user_id
  email: string;
  user_type: "patient" | "doctor" | "admin" | "super_admin";
  tenant_id?: string; // UUID
  subdomain?: string;
  full_name?: string;
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}

/**
 * Appointment Creation Request
 */
export interface AppointmentCreateRequest {
  patient_id: string; // UUID
  doctor_id: string; // UUID
  appointment_date: string; // ISO date
  appointment_time: string;
  duration_minutes?: number;
  reason?: string;
  notes?: string;
}

/**
 * Appointment Update Request
 */
export interface AppointmentUpdateRequest {
  appointment_date?: string;
  appointment_time?: string;
  duration_minutes?: number;
  status?: AppointmentStatus;
  reason?: string;
  notes?: string;
  prescription?: string;
}

/**
 * Medical Record Creation Request
 */
export interface MedicalRecordCreateRequest {
  patient_id: string; // UUID
  doctor_id?: string; // UUID
  record_type:
    | "diagnosis"
    | "prescription"
    | "lab_report"
    | "imaging"
    | "vitals"
    | "other";
  title: string;
  description: string;
  record_date: string; // ISO date
  attachments?: string;
  metadata?: Record<string, unknown>;
}

// ===========================
// API Response Wrappers
// ===========================

/**
 * Standard API Success Response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  detail?: string;
  status_code: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ===========================
// Utility Types
// ===========================

/**
 * Create type - Omit system-generated fields
 */
export type CreateType<T> = Omit<T, "id" | "created_at" | "updated_at">;

/**
 * Update type - Partial with optional ID
 */
export type UpdateType<T> = Partial<
  Omit<T, "id" | "created_at" | "updated_at">
>;

/**
 * Filter query parameters
 */
export interface FilterParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  search?: string;
  status?: UserStatus | AppointmentStatus;
  tenant_id?: string; // UUID
}
