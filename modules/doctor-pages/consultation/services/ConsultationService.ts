/**
 * ConsultationService.ts
 * Service for interacting with the Consultations API
 * Connects to /api/v1/consultations endpoints
 */

import apiService from '@/lib/api-service';

// ============ Types ============

export interface ConsultationCreate {
  appointment_id?: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  type: 'in_person' | 'video' | 'audio' | 'chat';
  chief_complaint: string;
  notes?: string;
}

export interface ConsultationUpdate {
  chief_complaint?: string;
  history_present_illness?: string;
  examination_findings?: string;
  diagnosis?: string;
  diagnosis_codes?: DiagnosisCode[];
  treatment_plan?: string;
  notes?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
}

export interface DiagnosisCode {
  code: string;
  description: string;
  type: 'ICD-10' | 'ICD-11' | 'SNOMED';
  is_primary: boolean;
}

export interface Vital {
  type: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface VitalsData {
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  weight?: number;
  weight_unit?: 'kg' | 'lbs';
  height?: number;
  height_unit?: 'cm' | 'ft';
  oxygen_saturation?: number;
  blood_glucose?: number;
  pain_level?: number;
  notes?: string;
  additional_vitals?: Vital[];
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface Consultation {
  id: string;
  appointment_id?: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  type: string;
  status: string;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  chief_complaint: string;
  history_present_illness?: string;
  examination_findings?: string;
  diagnosis?: string;
  diagnosis_codes: DiagnosisCode[];
  treatment_plan?: string;
  notes?: string;
  follow_up_recommended: boolean;
  follow_up_date?: string;
  vitals?: VitalsData;
  soap_note?: SOAPNote;
  created_at: string;
  updated_at: string;
}

export interface ConsultationSummary {
  consultation: Consultation;
  prescriptions: any[];
  lab_orders: any[];
  follow_up_appointment?: any;
  total_duration_minutes: number;
}

// ============ Service Methods ============

const API_BASE = '/api/v1/consultations';

/**
 * Start a new consultation
 */
export async function startConsultation(data: ConsultationCreate): Promise<Consultation> {
  const response = await apiService.post<{ data: Consultation }>(API_BASE, data);
  return response.data;
}

/**
 * Get consultation by ID
 */
export async function getConsultation(consultationId: string): Promise<Consultation> {
  const response = await apiService.get<{ data: Consultation }>(`${API_BASE}/${consultationId}`);
  return response.data;
}

/**
 * Update consultation
 */
export async function updateConsultation(
  consultationId: string, 
  data: ConsultationUpdate
): Promise<Consultation> {
  const response = await apiService.put<{ data: Consultation }>(`${API_BASE}/${consultationId}`, data);
  return response.data;
}

/**
 * Record vitals for a consultation
 */
export async function recordVitals(
  consultationId: string, 
  vitals: VitalsData
): Promise<Consultation> {
  const response = await apiService.post<{ data: Consultation }>(`${API_BASE}/${consultationId}/vitals`, vitals);
  return response.data;
}

/**
 * Save SOAP note
 */
export async function saveSOAPNote(
  consultationId: string, 
  soapNote: SOAPNote
): Promise<Consultation> {
  const response = await apiService.post<{ data: Consultation }>(`${API_BASE}/${consultationId}/soap`, soapNote);
  return response.data;
}

/**
 * Add diagnosis codes
 */
export async function addDiagnosis(
  consultationId: string, 
  codes: DiagnosisCode[]
): Promise<Consultation> {
  const response = await apiService.post<{ data: Consultation }>(`${API_BASE}/${consultationId}/diagnosis`, { codes });
  return response.data;
}

/**
 * Complete consultation
 */
export async function completeConsultation(
  consultationId: string,
  summary?: {
    final_notes?: string;
    follow_up_recommended?: boolean;
    follow_up_days?: number;
  }
): Promise<ConsultationSummary> {
  const response = await apiService.post<{ data: ConsultationSummary }>(`${API_BASE}/${consultationId}/complete`, summary || {});
  return response.data;
}

/**
 * Get consultations for a patient
 */
export async function getPatientConsultations(
  patientId: string,
  params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Consultation[]> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const response = await apiService.get<{ data: Consultation[] }>(`${API_BASE}/patient/${patientId}${queryString}`);
  return response.data;
}

/**
 * Get consultations for a doctor
 */
export async function getDoctorConsultations(
  doctorId: string,
  params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Consultation[]> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const response = await apiService.get<{ data: Consultation[] }>(`${API_BASE}/doctor/${doctorId}${queryString}`);
  return response.data;
}

/**
 * Get today's consultations for a doctor
 */
export async function getTodayConsultations(doctorId: string): Promise<Consultation[]> {
  const today = new Date().toISOString().split('T')[0];
  return getDoctorConsultations(doctorId, {
    from_date: today,
    to_date: today,
  });
}

/**
 * Cancel a consultation
 */
export async function cancelConsultation(
  consultationId: string,
  reason?: string
): Promise<Consultation> {
  const response = await apiService.post<{ data: Consultation }>(`${API_BASE}/${consultationId}/cancel`, { reason });
  return response.data;
}

/**
 * Get consultation summary
 */
export async function getConsultationSummary(consultationId: string): Promise<ConsultationSummary> {
  const response = await apiService.get<{ data: ConsultationSummary }>(`${API_BASE}/${consultationId}/summary`);
  return response.data;
}

// ============ Export as default object ============

const consultationService = {
  startConsultation,
  getConsultation,
  updateConsultation,
  recordVitals,
  saveSOAPNote,
  addDiagnosis,
  completeConsultation,
  getPatientConsultations,
  getDoctorConsultations,
  getTodayConsultations,
  cancelConsultation,
  getConsultationSummary,
};

export default consultationService;
