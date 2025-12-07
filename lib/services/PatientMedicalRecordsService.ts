/**
 * Patient Medical Records Service
 * Handles medical records, documents, and health information management for patients
 */

import apiService from '../api-service';

// ==================== TYPES ====================

export interface MedicalRecord {
  id: string;
  patient_id: string;
  tenant_id: string;
  record_type: 'lab_result' | 'imaging' | 'report' | 'prescription' | 'discharge_summary' | 'consultation_note' | 'vaccination' | 'other';
  title: string;
  description?: string;
  provider_name: string;
  provider_id?: string;
  hospital_name?: string;
  record_date: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  content?: string;
  status: 'active' | 'archived';
  is_sensitive: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
  shared_with?: ShareRecord[];
  created_at: string;
  updated_at: string;
}

export interface ShareRecord {
  id: string;
  shared_with_id: string;
  shared_with_name: string;
  shared_with_type: 'doctor' | 'hospital' | 'family' | 'other';
  access_type: 'view' | 'download';
  expires_at?: string;
  created_at: string;
}

export interface UploadRecordRequest {
  record_type: MedicalRecord['record_type'];
  title: string;
  description?: string;
  provider_name: string;
  record_date: string;
  file?: File;
  content?: string;
  is_sensitive?: boolean;
  tags?: string[];
}

export interface ShareRequest {
  share_with_id: string;
  share_with_type: 'doctor' | 'hospital' | 'family' | 'other';
  access_type: 'view' | 'download';
  duration_hours?: number;
  message?: string;
}

export interface HealthVital {
  id: string;
  patient_id: string;
  vital_type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'weight' | 'height' | 'bmi' | 'blood_sugar' | 'oxygen_saturation' | 'respiratory_rate';
  value: string;
  unit: string;
  recorded_at: string;
  notes?: string;
  source: 'manual' | 'device' | 'clinic';
  device_id?: string;
  created_at: string;
}

export interface Allergy {
  id: string;
  patient_id: string;
  allergen: string;
  allergen_type: 'medication' | 'food' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  reaction?: string;
  onset_date?: string;
  diagnosed_by?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalCondition {
  id: string;
  patient_id: string;
  condition_name: string;
  icd_code?: string;
  diagnosis_date?: string;
  diagnosed_by?: string;
  status: 'active' | 'resolved' | 'chronic' | 'in_remission';
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
  treatment_plan?: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyHistory {
  id: string;
  patient_id: string;
  relation: 'mother' | 'father' | 'sibling' | 'grandparent' | 'aunt_uncle' | 'other';
  condition: string;
  age_of_onset?: number;
  is_deceased?: boolean;
  notes?: string;
  created_at: string;
}

// Helper to build query strings
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `?${query}` : '';
}

// ==================== MEDICAL RECORDS ====================

/**
 * Get all medical records
 */
export async function getMedicalRecords(
  patientId: string,
  params?: {
    record_type?: string;
    from_date?: string;
    to_date?: string;
    status?: 'active' | 'archived';
    search?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ records: MedicalRecord[]; total: number }> {
  const query = buildQueryString(params);
  return apiService.get<{ records: MedicalRecord[]; total: number }>(
    `/patients/${patientId}/medical-records${query}`
  );
}

/**
 * Get a single medical record
 */
export async function getMedicalRecord(recordId: string): Promise<MedicalRecord> {
  return apiService.get<MedicalRecord>(`/medical-records/${recordId}`);
}

/**
 * Upload a new medical record
 */
export async function uploadMedicalRecord(
  patientId: string,
  data: UploadRecordRequest
): Promise<MedicalRecord> {
  // Handle file upload if file is included
  if (data.file) {
    const formData = new FormData();
    formData.append('file', data.file);
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'file' && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    return apiService.post<MedicalRecord>(
      `/patients/${patientId}/medical-records/upload`,
      formData
    );
  }
  return apiService.post<MedicalRecord>(
    `/patients/${patientId}/medical-records`,
    data
  );
}

/**
 * Update a medical record
 */
export async function updateMedicalRecord(
  recordId: string,
  data: Partial<UploadRecordRequest>
): Promise<MedicalRecord> {
  return apiService.put<MedicalRecord>(`/medical-records/${recordId}`, data);
}

/**
 * Delete (archive) a medical record
 */
export async function archiveMedicalRecord(recordId: string): Promise<{ success: boolean }> {
  return apiService.put(`/medical-records/${recordId}/archive`);
}

/**
 * Download a medical record file
 */
export async function downloadMedicalRecord(recordId: string): Promise<Blob> {
  return apiService.get<Blob>(`/medical-records/${recordId}/download`);
}

// ==================== SHARING ====================

/**
 * Share a medical record
 */
export async function shareRecord(
  recordId: string,
  data: ShareRequest
): Promise<ShareRecord> {
  return apiService.post<ShareRecord>(`/medical-records/${recordId}/share`, data);
}

/**
 * Revoke a share
 */
export async function revokeShare(recordId: string, shareId: string): Promise<{ success: boolean }> {
  return apiService.delete(`/medical-records/${recordId}/share/${shareId}`);
}

/**
 * Generate a QR code for sharing medical records
 */
export async function generateShareQR(
  patientId: string,
  params: {
    record_ids?: string[];
    share_all?: boolean;
    duration_hours: number;
    access_type: 'view' | 'download';
  }
): Promise<{
  qr_code_url: string;
  access_token: string;
  expires_at: string;
  share_url: string;
}> {
  return apiService.post(
    `/patients/${patientId}/medical-records/share-qr`,
    params
  );
}

/**
 * Get records shared with me
 */
export async function getSharedWithMe(
  patientId: string
): Promise<{ records: MedicalRecord[]; total: number }> {
  return apiService.get(
    `/patients/${patientId}/medical-records/shared-with-me`
  );
}

// ==================== HEALTH VITALS ====================

/**
 * Get health vitals
 */
export async function getHealthVitals(
  patientId: string,
  params?: {
    vital_type?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
  }
): Promise<HealthVital[]> {
  const query = buildQueryString(params);
  return apiService.get<HealthVital[]>(
    `/patients/${patientId}/health-vitals${query}`
  );
}

/**
 * Record a health vital
 */
export async function recordHealthVital(
  patientId: string,
  data: {
    vital_type: HealthVital['vital_type'];
    value: string;
    unit: string;
    recorded_at?: string;
    notes?: string;
    source?: HealthVital['source'];
    device_id?: string;
  }
): Promise<HealthVital> {
  return apiService.post<HealthVital>(
    `/patients/${patientId}/health-vitals`,
    data
  );
}

/**
 * Get vital trends (aggregated data for charts)
 */
export async function getVitalTrends(
  patientId: string,
  vitalType: string,
  days: number = 30
): Promise<{
  data: { date: string; value: number; }[];
  average: number;
  min: number;
  max: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}> {
  return apiService.get(
    `/patients/${patientId}/health-vitals/${vitalType}/trends?days=${days}`
  );
}

// ==================== ALLERGIES ====================

/**
 * Get allergies
 */
export async function getAllergies(patientId: string): Promise<Allergy[]> {
  return apiService.get<Allergy[]>(`/patients/${patientId}/allergies`);
}

/**
 * Add an allergy
 */
export async function addAllergy(
  patientId: string,
  data: Omit<Allergy, 'id' | 'patient_id' | 'created_at' | 'updated_at'>
): Promise<Allergy> {
  return apiService.post<Allergy>(`/patients/${patientId}/allergies`, data);
}

/**
 * Update an allergy
 */
export async function updateAllergy(
  allergyId: string,
  data: Partial<Allergy>
): Promise<Allergy> {
  return apiService.put<Allergy>(`/allergies/${allergyId}`, data);
}

/**
 * Delete an allergy
 */
export async function deleteAllergy(allergyId: string): Promise<{ success: boolean }> {
  return apiService.delete(`/allergies/${allergyId}`);
}

// ==================== MEDICAL CONDITIONS ====================

/**
 * Get medical conditions
 */
export async function getMedicalConditions(patientId: string): Promise<MedicalCondition[]> {
  return apiService.get<MedicalCondition[]>(`/patients/${patientId}/conditions`);
}

/**
 * Add a medical condition
 */
export async function addMedicalCondition(
  patientId: string,
  data: Omit<MedicalCondition, 'id' | 'patient_id' | 'created_at' | 'updated_at'>
): Promise<MedicalCondition> {
  return apiService.post<MedicalCondition>(`/patients/${patientId}/conditions`, data);
}

/**
 * Update a medical condition
 */
export async function updateMedicalCondition(
  conditionId: string,
  data: Partial<MedicalCondition>
): Promise<MedicalCondition> {
  return apiService.put<MedicalCondition>(`/conditions/${conditionId}`, data);
}

// ==================== FAMILY HISTORY ====================

/**
 * Get family medical history
 */
export async function getFamilyHistory(patientId: string): Promise<FamilyHistory[]> {
  return apiService.get<FamilyHistory[]>(`/patients/${patientId}/family-history`);
}

/**
 * Add family history entry
 */
export async function addFamilyHistory(
  patientId: string,
  data: Omit<FamilyHistory, 'id' | 'patient_id' | 'created_at'>
): Promise<FamilyHistory> {
  return apiService.post<FamilyHistory>(`/patients/${patientId}/family-history`, data);
}

/**
 * Update family history entry
 */
export async function updateFamilyHistory(
  historyId: string,
  data: Partial<FamilyHistory>
): Promise<FamilyHistory> {
  return apiService.put<FamilyHistory>(`/family-history/${historyId}`, data);
}

/**
 * Delete family history entry
 */
export async function deleteFamilyHistory(historyId: string): Promise<{ success: boolean }> {
  return apiService.delete(`/family-history/${historyId}`);
}

// ==================== HEALTH SUMMARY ====================

/**
 * Get comprehensive health summary
 */
export async function getHealthSummary(patientId: string): Promise<{
  allergies: Allergy[];
  conditions: MedicalCondition[];
  recent_vitals: HealthVital[];
  medications_count: number;
  recent_records_count: number;
  upcoming_appointments: number;
  immunizations_due: number;
}> {
  return apiService.get(`/patients/${patientId}/health-summary`);
}

/**
 * Export health data
 */
export async function exportHealthData(
  patientId: string,
  params: {
    format: 'pdf' | 'json' | 'fhir';
    include_records?: boolean;
    include_vitals?: boolean;
    include_medications?: boolean;
    from_date?: string;
    to_date?: string;
  }
): Promise<Blob> {
  const query = buildQueryString(params);
  return apiService.get<Blob>(
    `/patients/${patientId}/export-health-data${query}`
  );
}

// ==================== RECORD TYPE UTILITIES ====================

/**
 * Get record type label
 */
export function getRecordTypeLabel(type: MedicalRecord['record_type']): string {
  const labels: Record<MedicalRecord['record_type'], string> = {
    lab_result: 'Lab Result',
    imaging: 'Imaging',
    report: 'Medical Report',
    prescription: 'Prescription',
    discharge_summary: 'Discharge Summary',
    consultation_note: 'Consultation Note',
    vaccination: 'Vaccination',
    other: 'Other'
  };
  return labels[type] || type;
}

/**
 * Get record type icon name (for use with lucide-react)
 */
export function getRecordTypeIcon(type: MedicalRecord['record_type']): string {
  const icons: Record<MedicalRecord['record_type'], string> = {
    lab_result: 'TestTube',
    imaging: 'Image',
    report: 'FileText',
    prescription: 'Pill',
    discharge_summary: 'ClipboardList',
    consultation_note: 'Stethoscope',
    vaccination: 'Syringe',
    other: 'File'
  };
  return icons[type] || 'File';
}

const PatientMedicalRecordsService = {
  // Medical Records
  getMedicalRecords,
  getMedicalRecord,
  uploadMedicalRecord,
  updateMedicalRecord,
  archiveMedicalRecord,
  downloadMedicalRecord,
  
  // Sharing
  shareRecord,
  revokeShare,
  generateShareQR,
  getSharedWithMe,
  
  // Health Vitals
  getHealthVitals,
  recordHealthVital,
  getVitalTrends,
  
  // Allergies
  getAllergies,
  addAllergy,
  updateAllergy,
  deleteAllergy,
  
  // Medical Conditions
  getMedicalConditions,
  addMedicalCondition,
  updateMedicalCondition,
  
  // Family History
  getFamilyHistory,
  addFamilyHistory,
  updateFamilyHistory,
  deleteFamilyHistory,
  
  // Health Summary
  getHealthSummary,
  exportHealthData,
  
  // Utilities
  getRecordTypeLabel,
  getRecordTypeIcon
};

export default PatientMedicalRecordsService;
