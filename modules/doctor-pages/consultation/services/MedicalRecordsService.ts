/**
 * MedicalRecordsService.ts
 * Service for interacting with the Medical Records API
 * Connects to /api/v1/records endpoints
 */

import apiService from '@/lib/api-service';

// ============ Types ============

export type RecordType = 
  | 'lab_result'
  | 'imaging'
  | 'consultation_note'
  | 'discharge_summary'
  | 'vaccination'
  | 'allergy'
  | 'procedure'
  | 'vital_signs'
  | 'prescription'
  | 'referral'
  | 'other';

export interface RecordMetadata {
  [key: string]: string | number | boolean | null;
}

export interface MedicalRecordCreate {
  patient_id: string;
  hospital_id: string;
  consultation_id?: string;
  record_type: RecordType;
  title: string;
  description?: string;
  content?: string;
  metadata?: RecordMetadata;
  is_confidential?: boolean;
  recorded_at?: string;
}

export interface MedicalRecordUpdate {
  title?: string;
  description?: string;
  content?: string;
  metadata?: RecordMetadata;
  is_confidential?: boolean;
  status?: 'active' | 'archived' | 'deleted';
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  hospital_id: string;
  doctor_id?: string;
  consultation_id?: string;
  record_type: RecordType;
  title: string;
  description?: string;
  content?: string;
  metadata: RecordMetadata;
  is_confidential: boolean;
  status: 'active' | 'archived' | 'deleted';
  recorded_at: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  doctor_name?: string;
  hospital_name?: string;
}

export interface FileAttachment {
  id: string;
  record_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_at: string;
}

export interface LabResult {
  id: string;
  record_id: string;
  test_name: string;
  test_code?: string;
  value: string;
  unit?: string;
  reference_range?: string;
  is_abnormal: boolean;
  notes?: string;
  performed_at: string;
}

export interface VitalSign {
  id: string;
  record_id: string;
  type: string;
  value: number;
  unit: string;
  recorded_at: string;
  notes?: string;
}

export interface Allergy {
  id: string;
  patient_id: string;
  allergen: string;
  allergen_type: 'medication' | 'food' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  onset_date?: string;
  status: 'active' | 'inactive' | 'resolved';
  notes?: string;
}

export interface Immunization {
  id: string;
  patient_id: string;
  vaccine_name: string;
  vaccine_code?: string;
  dose_number?: number;
  administered_at: string;
  administered_by?: string;
  site?: string;
  lot_number?: string;
  expiration_date?: string;
  notes?: string;
}

export interface PatientTimeline {
  records: MedicalRecord[];
  consultations: any[];
  prescriptions: any[];
  lab_results: LabResult[];
  immunizations: Immunization[];
}

// ============ Service Methods ============

const API_BASE = '/api/v1/records';

/**
 * Create a new medical record
 */
export async function createRecord(data: MedicalRecordCreate): Promise<MedicalRecord> {
  const response = await apiService.post<{ data: MedicalRecord }>(API_BASE, data);
  return response.data;
}

/**
 * Get record by ID
 */
export async function getRecord(recordId: string): Promise<MedicalRecord> {
  const response = await apiService.get<{ data: MedicalRecord }>(`${API_BASE}/${recordId}`);
  return response.data;
}

/**
 * Update record
 */
export async function updateRecord(
  recordId: string,
  data: MedicalRecordUpdate
): Promise<MedicalRecord> {
  const response = await apiService.put<{ data: MedicalRecord }>(`${API_BASE}/${recordId}`, data);
  return response.data;
}

/**
 * Delete record (soft delete)
 */
export async function deleteRecord(recordId: string): Promise<void> {
  await apiService.delete(`${API_BASE}/${recordId}`);
}

/**
 * Get records for a patient
 */
export async function getPatientRecords(
  patientId: string,
  params?: {
    record_type?: RecordType;
    from_date?: string;
    to_date?: string;
    include_confidential?: boolean;
    limit?: number;
    offset?: number;
  }
): Promise<MedicalRecord[]> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const response = await apiService.get<{ data: MedicalRecord[] }>(
    `${API_BASE}/patient/${patientId}${queryString}`
  );
  return response.data;
}

/**
 * Get patient timeline (comprehensive view)
 */
export async function getPatientTimeline(
  patientId: string,
  params?: {
    from_date?: string;
    to_date?: string;
  }
): Promise<PatientTimeline> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const response = await apiService.get<{ data: PatientTimeline }>(
    `${API_BASE}/patient/${patientId}/timeline${queryString}`
  );
  return response.data;
}

/**
 * Get records for a consultation
 */
export async function getConsultationRecords(consultationId: string): Promise<MedicalRecord[]> {
  const response = await apiService.get<{ data: MedicalRecord[] }>(
    `${API_BASE}/consultation/${consultationId}`
  );
  return response.data;
}

/**
 * Upload file attachment to a record
 */
export async function uploadAttachment(
  recordId: string,
  file: File
): Promise<FileAttachment> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiService.post<{ data: FileAttachment }>(
    `${API_BASE}/${recordId}/attachments`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

/**
 * Get attachments for a record
 */
export async function getRecordAttachments(recordId: string): Promise<FileAttachment[]> {
  const response = await apiService.get<{ data: FileAttachment[] }>(
    `${API_BASE}/${recordId}/attachments`
  );
  return response.data;
}

/**
 * Delete attachment
 */
export async function deleteAttachment(recordId: string, attachmentId: string): Promise<void> {
  await apiService.delete(`${API_BASE}/${recordId}/attachments/${attachmentId}`);
}

// ============ Lab Results ============

/**
 * Add lab results to a record
 */
export async function addLabResults(
  recordId: string,
  results: Omit<LabResult, 'id' | 'record_id'>[]
): Promise<LabResult[]> {
  const response = await apiService.post<{ data: LabResult[] }>(
    `${API_BASE}/${recordId}/lab-results`,
    { results }
  );
  return response.data;
}

/**
 * Get lab results for a patient
 */
export async function getPatientLabResults(
  patientId: string,
  params?: {
    test_name?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
  }
): Promise<LabResult[]> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const response = await apiService.get<{ data: LabResult[] }>(
    `${API_BASE}/patient/${patientId}/lab-results${queryString}`
  );
  return response.data;
}

// ============ Allergies ============

/**
 * Get patient allergies
 */
export async function getPatientAllergies(patientId: string): Promise<Allergy[]> {
  const response = await apiService.get<{ data: Allergy[] }>(
    `${API_BASE}/patient/${patientId}/allergies`
  );
  return response.data;
}

/**
 * Add allergy
 */
export async function addAllergy(
  patientId: string,
  allergy: Omit<Allergy, 'id' | 'patient_id'>
): Promise<Allergy> {
  const response = await apiService.post<{ data: Allergy }>(
    `${API_BASE}/patient/${patientId}/allergies`,
    allergy
  );
  return response.data;
}

/**
 * Update allergy
 */
export async function updateAllergy(
  patientId: string,
  allergyId: string,
  data: Partial<Allergy>
): Promise<Allergy> {
  const response = await apiService.put<{ data: Allergy }>(
    `${API_BASE}/patient/${patientId}/allergies/${allergyId}`,
    data
  );
  return response.data;
}

// ============ Immunizations ============

/**
 * Get patient immunizations
 */
export async function getPatientImmunizations(patientId: string): Promise<Immunization[]> {
  const response = await apiService.get<{ data: Immunization[] }>(
    `${API_BASE}/patient/${patientId}/immunizations`
  );
  return response.data;
}

/**
 * Add immunization record
 */
export async function addImmunization(
  patientId: string,
  immunization: Omit<Immunization, 'id' | 'patient_id'>
): Promise<Immunization> {
  const response = await apiService.post<{ data: Immunization }>(
    `${API_BASE}/patient/${patientId}/immunizations`,
    immunization
  );
  return response.data;
}

// ============ Search ============

/**
 * Search medical records
 */
export async function searchRecords(
  query: string,
  params?: {
    patient_id?: string;
    hospital_id?: string;
    record_type?: RecordType;
    from_date?: string;
    to_date?: string;
    limit?: number;
  }
): Promise<MedicalRecord[]> {
  const searchParams = new URLSearchParams({ q: query, ...params as Record<string, string> });
  const response = await apiService.get<{ data: MedicalRecord[] }>(
    `${API_BASE}/search?${searchParams.toString()}`
  );
  return response.data;
}

// ============ Export as default object ============

const medicalRecordsService = {
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
  getPatientRecords,
  getPatientTimeline,
  getConsultationRecords,
  uploadAttachment,
  getRecordAttachments,
  deleteAttachment,
  addLabResults,
  getPatientLabResults,
  getPatientAllergies,
  addAllergy,
  updateAllergy,
  getPatientImmunizations,
  addImmunization,
  searchRecords,
};

export default medicalRecordsService;
