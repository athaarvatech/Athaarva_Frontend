/**
 * PrescriptionService.ts
 * Service for interacting with the Prescriptions API
 * Connects to /api/v1/prescriptions endpoints
 */

import apiService from '@/lib/api-service';

// ============ Types ============

export interface MedicationItem {
  name: string;
  generic_name?: string;
  dosage: string;
  dosage_form: string;
  frequency: string;
  duration: string;
  quantity: number;
  refills: number;
  instructions: string;
  indication?: string;
  is_generic: boolean;
  ndc_code?: string;
  start_date?: string;
  end_date?: string;
}

export interface PrescriptionCreate {
  consultation_id?: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  medications: MedicationItem[];
  diagnosis?: string;
  diagnosis_codes?: string[];
  notes?: string;
  pharmacy_id?: string;
  pharmacy_name?: string;
  pharmacy_address?: string;
  is_urgent: boolean;
}

export interface PrescriptionUpdate {
  medications?: MedicationItem[];
  diagnosis?: string;
  diagnosis_codes?: string[];
  notes?: string;
  pharmacy_id?: string;
  pharmacy_name?: string;
  pharmacy_address?: string;
  status?: 'draft' | 'active' | 'completed' | 'cancelled' | 'expired';
}

export interface Prescription {
  id: string;
  consultation_id?: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  prescription_number: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'expired';
  medications: MedicationItem[];
  diagnosis?: string;
  diagnosis_codes: string[];
  notes?: string;
  pharmacy_id?: string;
  pharmacy_name?: string;
  pharmacy_address?: string;
  is_urgent: boolean;
  valid_from: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export interface DrugInteraction {
  severity: 'high' | 'moderate' | 'low';
  description: string;
  medications: string[];
  recommendation: string;
}

export interface InteractionCheckResult {
  has_interactions: boolean;
  interactions: DrugInteraction[];
}

export interface RefillRequest {
  id: string;
  prescription_id: string;
  patient_id: string;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
  processed_at?: string;
  notes?: string;
}

// ============ Service Methods ============

const API_BASE = '/api/v1/prescriptions';

/**
 * Create a new prescription
 */
export async function createPrescription(data: PrescriptionCreate): Promise<Prescription> {
  const response = await apiService.post<{ data: Prescription }>(API_BASE, data);
  return response.data;
}

/**
 * Get prescription by ID
 */
export async function getPrescription(prescriptionId: string): Promise<Prescription> {
  const response = await apiService.get<{ data: Prescription }>(`${API_BASE}/${prescriptionId}`);
  return response.data;
}

/**
 * Update prescription
 */
export async function updatePrescription(
  prescriptionId: string,
  data: PrescriptionUpdate
): Promise<Prescription> {
  const response = await apiService.put<{ data: Prescription }>(`${API_BASE}/${prescriptionId}`, data);
  return response.data;
}

/**
 * Delete prescription
 */
export async function deletePrescription(prescriptionId: string): Promise<void> {
  await apiService.delete(`${API_BASE}/${prescriptionId}`);
}

/**
 * Get prescriptions for a patient
 */
export async function getPatientPrescriptions(
  patientId: string,
  params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Prescription[]> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const response = await apiService.get<{ data: Prescription[] }>(`${API_BASE}/patient/${patientId}${queryString}`);
  return response.data;
}

/**
 * Get prescriptions by doctor
 */
export async function getDoctorPrescriptions(
  doctorId: string,
  params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Prescription[]> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const response = await apiService.get<{ data: Prescription[] }>(`${API_BASE}/doctor/${doctorId}${queryString}`);
  return response.data;
}

/**
 * Get prescriptions for a consultation
 */
export async function getConsultationPrescriptions(consultationId: string): Promise<Prescription[]> {
  const response = await apiService.get<{ data: Prescription[] }>(`${API_BASE}/consultation/${consultationId}`);
  return response.data;
}

/**
 * Check for drug interactions
 */
export async function checkDrugInteractions(
  patientId: string,
  medications: string[]
): Promise<InteractionCheckResult> {
  const response = await apiService.post<{ data: InteractionCheckResult }>(
    `${API_BASE}/check-interactions`,
    { patient_id: patientId, medications }
  );
  return response.data;
}

/**
 * Send prescription to pharmacy
 */
export async function sendToPharmacy(
  prescriptionId: string,
  pharmacyId: string
): Promise<Prescription> {
  const response = await apiService.post<{ data: Prescription }>(
    `${API_BASE}/${prescriptionId}/send-pharmacy`,
    { pharmacy_id: pharmacyId }
  );
  return response.data;
}

/**
 * Mark prescription as dispensed
 */
export async function markDispensed(
  prescriptionId: string,
  dispensedBy?: string
): Promise<Prescription> {
  const response = await apiService.post<{ data: Prescription }>(
    `${API_BASE}/${prescriptionId}/dispense`,
    { dispensed_by: dispensedBy }
  );
  return response.data;
}

/**
 * Request refill
 */
export async function requestRefill(
  prescriptionId: string,
  notes?: string
): Promise<RefillRequest> {
  const response = await apiService.post<{ data: RefillRequest }>(
    `${API_BASE}/${prescriptionId}/refill`,
    { notes }
  );
  return response.data;
}

/**
 * Process refill request (for doctors)
 */
export async function processRefillRequest(
  requestId: string,
  approved: boolean,
  notes?: string
): Promise<RefillRequest> {
  const response = await apiService.post<{ data: RefillRequest }>(
    `${API_BASE}/refill-requests/${requestId}/process`,
    { approved, notes }
  );
  return response.data;
}

/**
 * Get pending refill requests for a doctor
 */
export async function getPendingRefillRequests(doctorId: string): Promise<RefillRequest[]> {
  const response = await apiService.get<{ data: RefillRequest[] }>(
    `${API_BASE}/refill-requests/doctor/${doctorId}?status=pending`
  );
  return response.data;
}

/**
 * Download prescription as PDF
 */
export async function downloadPrescriptionPDF(prescriptionId: string): Promise<Blob> {
  const response = await apiService.get<Blob>(
    `${API_BASE}/${prescriptionId}/pdf`,
    { headers: { 'Accept': 'application/pdf' } }
  );
  return response as unknown as Blob;
}

/**
 * Print prescription
 */
export async function printPrescription(prescriptionId: string): Promise<void> {
  const blob = await downloadPrescriptionPDF(prescriptionId);
  const url = window.URL.createObjectURL(blob);
  const printWindow = window.open(url);
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

// ============ Export as default object ============

const prescriptionService = {
  createPrescription,
  getPrescription,
  updatePrescription,
  deletePrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getConsultationPrescriptions,
  checkDrugInteractions,
  sendToPharmacy,
  markDispensed,
  requestRefill,
  processRefillRequest,
  getPendingRefillRequests,
  downloadPrescriptionPDF,
  printPrescription,
};

export default prescriptionService;
