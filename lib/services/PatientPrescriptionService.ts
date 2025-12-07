/**
 * Patient Prescription Service
 * Handles prescription viewing, download, and medication management for patients
 */

import apiService from '../api-service';

// ==================== TYPES ====================

export interface Prescription {
  id: string;
  prescription_number: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  consultation_id?: string;
  prescription_date: string;
  valid_until?: string;
  diagnosis?: string;
  chief_complaint?: string;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  notes?: string;
  items: PrescriptionItem[];
  doctor?: {
    id: string;
    name: string;
    specialty: string;
    registration_number?: string;
    signature_url?: string;
  };
  hospital?: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
  };
  refills_remaining?: number;
  refill_count?: number;
  last_refill_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  medication_name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unit: string;
  route: 'oral' | 'topical' | 'injection' | 'inhalation' | 'sublingual' | 'rectal' | 'ophthalmic' | 'otic' | 'nasal' | 'other';
  instructions?: string;
  timing?: string[];
  with_food?: boolean;
  as_needed?: boolean;
  start_date?: string;
  end_date?: string;
  is_dispensed: boolean;
  dispensed_date?: string;
  dispensed_by?: string;
}

export interface Medication {
  id: string;
  patient_id: string;
  prescription_item_id?: string;
  medication_name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  route: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  prescribing_doctor?: string;
  pharmacy?: string;
  refills_remaining?: number;
  last_filled_date?: string;
  next_refill_date?: string;
  instructions?: string;
  side_effects?: string[];
  interactions?: string[];
  notes?: string;
  adherence_rate?: number;
  reminder_enabled: boolean;
  reminder_times?: string[];
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  taken_time?: string;
  status: 'pending' | 'taken' | 'missed' | 'skipped';
  dosage?: string;
  notes?: string;
  side_effects?: string[];
  created_at: string;
}

export interface AdherenceReport {
  medication_id: string;
  medication_name: string;
  period_start: string;
  period_end: string;
  total_doses: number;
  doses_taken: number;
  doses_missed: number;
  doses_skipped: number;
  adherence_rate: number;
  daily_adherence: {
    date: string;
    scheduled: number;
    taken: number;
    missed: number;
  }[];
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  recommendation: string;
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

// ==================== PRESCRIPTION FUNCTIONS ====================

/**
 * Get patient's prescriptions
 */
export async function getPrescriptions(
  patientId: string,
  params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    doctor_id?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ prescriptions: Prescription[]; total: number }> {
  const query = buildQueryString(params);
  return apiService.get<{ prescriptions: Prescription[]; total: number }>(
    `/patients/${patientId}/prescriptions${query}`
  );
}

/**
 * Get active prescriptions
 */
export async function getActivePrescriptions(
  patientId: string
): Promise<Prescription[]> {
  return apiService.get<Prescription[]>(
    `/patients/${patientId}/prescriptions/active`
  );
}

/**
 * Get prescription details
 */
export async function getPrescription(prescriptionId: string): Promise<Prescription> {
  return apiService.get<Prescription>(
    `/prescriptions/${prescriptionId}`
  );
}

/**
 * Download prescription PDF
 */
export async function downloadPrescriptionPDF(prescriptionId: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const url = `/api/v1/prescriptions/${prescriptionId}/pdf`;
  window.open(`${url}?token=${token}`, '_blank');
}

/**
 * Request prescription refill
 */
export async function requestRefill(
  prescriptionId: string,
  data?: {
    pharmacy_id?: string;
    notes?: string;
    preferred_pickup_date?: string;
  }
): Promise<{ success: boolean; message: string; refill_request_id: string }> {
  return apiService.post(
    `/prescriptions/${prescriptionId}/refill`,
    data || {}
  );
}

/**
 * Get refill history
 */
export async function getRefillHistory(
  prescriptionId: string
): Promise<{
  refills: {
    id: string;
    refill_date: string;
    pharmacy: string;
    quantity: number;
    status: string;
  }[];
}> {
  return apiService.get(
    `/prescriptions/${prescriptionId}/refill-history`
  );
}

// ==================== MEDICATION MANAGEMENT ====================

/**
 * Get patient's current medications
 */
export async function getMedications(
  patientId: string,
  params?: {
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }
): Promise<{ medications: Medication[]; total: number }> {
  const query = buildQueryString(params);
  return apiService.get<{ medications: Medication[]; total: number }>(
    `/patients/${patientId}/medications${query}`
  );
}

/**
 * Get active medications
 */
export async function getActiveMedications(
  patientId: string
): Promise<Medication[]> {
  return apiService.get<Medication[]>(
    `/patients/${patientId}/medications/active`
  );
}

/**
 * Get medication details
 */
export async function getMedication(medicationId: string): Promise<Medication> {
  return apiService.get<Medication>(
    `/medications/${medicationId}`
  );
}

/**
 * Add medication (self-reported)
 */
export async function addMedication(
  patientId: string,
  data: Partial<Medication>
): Promise<Medication> {
  return apiService.post<Medication>(
    `/patients/${patientId}/medications`,
    data
  );
}

/**
 * Update medication
 */
export async function updateMedication(
  medicationId: string,
  data: Partial<Medication>
): Promise<Medication> {
  return apiService.put<Medication>(
    `/medications/${medicationId}`,
    data
  );
}

/**
 * Stop/discontinue medication
 */
export async function stopMedication(
  medicationId: string,
  reason?: string
): Promise<Medication> {
  return apiService.post<Medication>(
    `/medications/${medicationId}/stop`,
    { reason }
  );
}

// ==================== MEDICATION TRACKING ====================

/**
 * Log medication taken
 */
export async function logMedicationTaken(
  medicationId: string,
  data: {
    scheduled_time?: string;
    taken_time: string;
    dosage?: string;
    notes?: string;
    side_effects?: string[];
  }
): Promise<MedicationLog> {
  return apiService.post<MedicationLog>(
    `/medications/${medicationId}/log`,
    { ...data, status: 'taken' }
  );
}

/**
 * Mark medication as missed
 */
export async function logMedicationMissed(
  medicationId: string,
  scheduledTime: string,
  reason?: string
): Promise<MedicationLog> {
  return apiService.post<MedicationLog>(
    `/medications/${medicationId}/log`,
    { scheduled_time: scheduledTime, status: 'missed', notes: reason }
  );
}

/**
 * Mark medication as skipped
 */
export async function logMedicationSkipped(
  medicationId: string,
  scheduledTime: string,
  reason?: string
): Promise<MedicationLog> {
  return apiService.post<MedicationLog>(
    `/medications/${medicationId}/log`,
    { scheduled_time: scheduledTime, status: 'skipped', notes: reason }
  );
}

/**
 * Get medication logs
 */
export async function getMedicationLogs(
  medicationId: string,
  params?: {
    from_date?: string;
    to_date?: string;
    status?: string;
    limit?: number;
  }
): Promise<MedicationLog[]> {
  const query = buildQueryString(params);
  return apiService.get<MedicationLog[]>(
    `/medications/${medicationId}/logs${query}`
  );
}

/**
 * Get today's medication schedule
 */
export async function getTodaySchedule(
  patientId: string
): Promise<{
  medication_id: string;
  medication_name: string;
  dosage: string;
  scheduled_time: string;
  status: 'pending' | 'taken' | 'missed' | 'upcoming';
}[]> {
  return apiService.get(
    `/patients/${patientId}/medications/today-schedule`
  );
}

// ==================== ADHERENCE REPORTING ====================

/**
 * Get adherence report for a medication
 */
export async function getAdherenceReport(
  medicationId: string,
  fromDate: string,
  toDate: string
): Promise<AdherenceReport> {
  const query = buildQueryString({ from_date: fromDate, to_date: toDate });
  return apiService.get<AdherenceReport>(
    `/medications/${medicationId}/adherence${query}`
  );
}

/**
 * Get overall adherence for patient
 */
export async function getOverallAdherence(
  patientId: string,
  fromDate: string,
  toDate: string
): Promise<{
  overall_rate: number;
  by_medication: AdherenceReport[];
  weekly_trend: { week: string; rate: number }[];
}> {
  const query = buildQueryString({ from_date: fromDate, to_date: toDate });
  return apiService.get(
    `/patients/${patientId}/medications/adherence${query}`
  );
}

// ==================== DRUG INTERACTIONS ====================

/**
 * Check drug interactions
 */
export async function checkDrugInteractions(
  medications: string[]
): Promise<DrugInteraction[]> {
  return apiService.post<DrugInteraction[]>(
    '/medications/check-interactions',
    { medications }
  );
}

/**
 * Get interactions for patient's current medications
 */
export async function getPatientInteractions(
  patientId: string
): Promise<DrugInteraction[]> {
  return apiService.get<DrugInteraction[]>(
    `/patients/${patientId}/medications/interactions`
  );
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format medication frequency for display
 */
export function formatFrequency(frequency: string): string {
  const frequencyMap: Record<string, string> = {
    'once_daily': 'Once daily',
    'twice_daily': 'Twice daily',
    'three_times_daily': 'Three times daily',
    'four_times_daily': 'Four times daily',
    'every_4_hours': 'Every 4 hours',
    'every_6_hours': 'Every 6 hours',
    'every_8_hours': 'Every 8 hours',
    'every_12_hours': 'Every 12 hours',
    'once_weekly': 'Once weekly',
    'twice_weekly': 'Twice weekly',
    'as_needed': 'As needed',
    'at_bedtime': 'At bedtime',
    'before_meals': 'Before meals',
    'after_meals': 'After meals',
    'with_meals': 'With meals'
  };
  return frequencyMap[frequency] || frequency;
}

/**
 * Format route for display
 */
export function formatRoute(route: PrescriptionItem['route']): string {
  const routeMap: Record<string, string> = {
    oral: 'By mouth',
    topical: 'Apply to skin',
    injection: 'Injection',
    inhalation: 'Inhale',
    sublingual: 'Under tongue',
    rectal: 'Rectally',
    ophthalmic: 'Eye drops',
    otic: 'Ear drops',
    nasal: 'Nasal spray',
    other: 'As directed'
  };
  return routeMap[route] || route;
}

/**
 * Get adherence color based on rate
 */
export function getAdherenceColor(rate: number): string {
  if (rate >= 90) return 'green';
  if (rate >= 75) return 'yellow';
  if (rate >= 50) return 'orange';
  return 'red';
}

/**
 * Get interaction severity color
 */
export function getInteractionColor(severity: DrugInteraction['severity']): string {
  const colors = {
    minor: 'yellow',
    moderate: 'orange',
    major: 'red',
    contraindicated: 'red'
  };
  return colors[severity];
}

/**
 * Calculate days remaining for medication
 */
export function getDaysRemaining(endDate?: string): number | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Check if prescription is expired
 */
export function isPrescriptionExpired(prescription: Prescription): boolean {
  if (!prescription.valid_until) return false;
  return new Date(prescription.valid_until) < new Date();
}

const PatientPrescriptionService = {
  // Prescriptions
  getPrescriptions,
  getActivePrescriptions,
  getPrescription,
  downloadPrescriptionPDF,
  requestRefill,
  getRefillHistory,
  
  // Medications
  getMedications,
  getActiveMedications,
  getMedication,
  addMedication,
  updateMedication,
  stopMedication,
  
  // Tracking
  logMedicationTaken,
  logMedicationMissed,
  logMedicationSkipped,
  getMedicationLogs,
  getTodaySchedule,
  
  // Adherence
  getAdherenceReport,
  getOverallAdherence,
  
  // Interactions
  checkDrugInteractions,
  getPatientInteractions,
  
  // Utilities
  formatFrequency,
  formatRoute,
  getAdherenceColor,
  getInteractionColor,
  getDaysRemaining,
  isPrescriptionExpired
};

export default PatientPrescriptionService;
