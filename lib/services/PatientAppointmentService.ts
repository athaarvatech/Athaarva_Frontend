/**
 * Patient Appointment Service
 * Handles appointment management for patients including booking, reschedule, and cancellation
 */

import apiService from '../api-service';

// ==================== TYPES ====================

export interface Doctor {
  id: string;
  name: string;
  profile_image?: string;
  specialty: string;
  qualification?: string;
  experience_years?: number;
  consultation_fee: number;
  rating?: number;
  review_count?: number;
  hospital_id: string;
  hospital_name?: string;
  available_days?: string[];
  is_available: boolean;
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  slot_type: 'regular' | 'emergency' | 'follow_up';
}

export interface Appointment {
  id: string;
  appointment_number: string;
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  appointment_type: 'consultation' | 'follow_up' | 'checkup' | 'procedure' | 'emergency' | 'telemedicine';
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  reason?: string;
  symptoms?: string[];
  notes?: string;
  cancellation_reason?: string;
  rescheduled_from?: string;
  doctor?: Doctor;
  hospital?: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
  };
  consultation_fee?: number;
  payment_status?: 'pending' | 'paid' | 'refunded';
  queue_position?: number;
  estimated_wait_time?: number;
  check_in_time?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentBookingRequest {
  doctor_id: string;
  hospital_id: string;
  appointment_date: string;
  start_time: string;
  appointment_type: Appointment['appointment_type'];
  reason?: string;
  symptoms?: string[];
  notes?: string;
}

export interface RescheduleRequest {
  new_date: string;
  new_time: string;
  reason?: string;
}

export interface CancellationRequest {
  reason: string;
  request_refund?: boolean;
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

// ==================== APPOINTMENT MANAGEMENT ====================

/**
 * Get patient's appointments
 */
export async function getAppointments(
  patientId: string,
  params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    doctor_id?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ appointments: Appointment[]; total: number }> {
  const query = buildQueryString(params);
  return apiService.get<{ appointments: Appointment[]; total: number }>(
    `/patients/${patientId}/appointments${query}`
  );
}

/**
 * Get upcoming appointments
 */
export async function getUpcomingAppointments(
  patientId: string,
  limit: number = 5
): Promise<Appointment[]> {
  const query = buildQueryString({ limit });
  return apiService.get<Appointment[]>(
    `/patients/${patientId}/appointments/upcoming${query}`
  );
}

/**
 * Get appointment details
 */
export async function getAppointment(appointmentId: string): Promise<Appointment> {
  return apiService.get<Appointment>(`/appointments/${appointmentId}`);
}

/**
 * Book new appointment
 */
export async function bookAppointment(
  patientId: string,
  data: AppointmentBookingRequest
): Promise<Appointment> {
  return apiService.post<Appointment>(
    `/patients/${patientId}/appointments`,
    data
  );
}

/**
 * Reschedule appointment
 */
export async function rescheduleAppointment(
  appointmentId: string,
  data: RescheduleRequest
): Promise<Appointment> {
  return apiService.post<Appointment>(
    `/appointments/${appointmentId}/reschedule`,
    data
  );
}

/**
 * Cancel appointment
 */
export async function cancelAppointment(
  appointmentId: string,
  data: CancellationRequest
): Promise<Appointment> {
  return apiService.post<Appointment>(
    `/appointments/${appointmentId}/cancel`,
    data
  );
}

/**
 * Confirm appointment (patient confirmation)
 */
export async function confirmAppointment(appointmentId: string): Promise<Appointment> {
  return apiService.post<Appointment>(
    `/appointments/${appointmentId}/confirm`
  );
}

/**
 * Check in for appointment
 */
export async function checkIn(appointmentId: string): Promise<Appointment> {
  return apiService.post<Appointment>(
    `/appointments/${appointmentId}/check-in`
  );
}

/**
 * Get queue status for checked-in appointment
 */
export async function getQueueStatus(
  appointmentId: string
): Promise<{
  queue_position: number;
  estimated_wait_time: number;
  current_patient_number: number;
}> {
  return apiService.get(
    `/appointments/${appointmentId}/queue-status`
  );
}

// ==================== DOCTOR & SLOT SEARCH ====================

/**
 * Search for doctors
 */
export async function searchDoctors(params: {
  hospital_id?: string;
  specialty?: string;
  name?: string;
  available_date?: string;
  limit?: number;
  offset?: number;
}): Promise<{ doctors: Doctor[]; total: number }> {
  const query = buildQueryString(params);
  return apiService.get<{ doctors: Doctor[]; total: number }>(
    `/doctors/search${query}`
  );
}

/**
 * Get doctor details
 */
export async function getDoctor(doctorId: string): Promise<Doctor> {
  return apiService.get<Doctor>(`/doctors/${doctorId}`);
}

/**
 * Get available time slots for a doctor
 */
export async function getAvailableSlots(
  doctorId: string,
  date: string,
  appointmentType?: string
): Promise<TimeSlot[]> {
  const query = buildQueryString({ date, appointment_type: appointmentType });
  return apiService.get<TimeSlot[]>(
    `/doctors/${doctorId}/available-slots${query}`
  );
}

/**
 * Get doctor's availability for a date range
 */
export async function getDoctorAvailability(
  doctorId: string,
  fromDate: string,
  toDate: string
): Promise<{
  date: string;
  available_slots: number;
  is_available: boolean;
}[]> {
  const query = buildQueryString({ from_date: fromDate, to_date: toDate });
  return apiService.get(
    `/doctors/${doctorId}/availability${query}`
  );
}

// ==================== APPOINTMENT HISTORY ====================

/**
 * Get appointment history with a specific doctor
 */
export async function getDoctorHistory(
  patientId: string,
  doctorId: string
): Promise<Appointment[]> {
  const query = buildQueryString({ doctor_id: doctorId });
  return apiService.get<Appointment[]>(
    `/patients/${patientId}/appointments/history${query}`
  );
}

/**
 * Get past appointments
 */
export async function getPastAppointments(
  patientId: string,
  params?: {
    limit?: number;
    offset?: number;
  }
): Promise<{ appointments: Appointment[]; total: number }> {
  const query = buildQueryString(params);
  return apiService.get<{ appointments: Appointment[]; total: number }>(
    `/patients/${patientId}/appointments/past${query}`
  );
}

// ==================== TELEMEDICINE ====================

/**
 * Get telemedicine link for appointment
 */
export async function getTelemedicineLink(
  appointmentId: string
): Promise<{
  meeting_url: string;
  meeting_id: string;
  password?: string;
  valid_until: string;
}> {
  return apiService.get(
    `/appointments/${appointmentId}/telemedicine-link`
  );
}

/**
 * Join telemedicine appointment
 */
export async function joinTelemedicineSession(
  appointmentId: string
): Promise<{
  session_token: string;
  meeting_url: string;
}> {
  return apiService.post(
    `/appointments/${appointmentId}/join-telemedicine`
  );
}

// ==================== FEEDBACK ====================

/**
 * Submit appointment feedback
 */
export async function submitFeedback(
  appointmentId: string,
  data: {
    rating: number;
    review?: string;
    would_recommend: boolean;
    categories?: {
      doctor_knowledge?: number;
      doctor_communication?: number;
      wait_time?: number;
      staff_behavior?: number;
      cleanliness?: number;
    };
  }
): Promise<{ success: boolean; message: string }> {
  return apiService.post(
    `/appointments/${appointmentId}/feedback`,
    data
  );
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get status badge variant for appointment status
 */
export function getStatusVariant(status: Appointment['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<Appointment['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    scheduled: 'outline',
    confirmed: 'default',
    checked_in: 'secondary',
    in_progress: 'default',
    completed: 'secondary',
    cancelled: 'destructive',
    no_show: 'destructive',
    rescheduled: 'outline'
  };
  return variants[status] || 'default';
}

/**
 * Format appointment time
 */
export function formatAppointmentTime(startTime: string, endTime?: string): string {
  const start = new Date(`1970-01-01T${startTime}`);
  const startFormatted = start.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  if (endTime) {
    const end = new Date(`1970-01-01T${endTime}`);
    const endFormatted = end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `${startFormatted} - ${endFormatted}`;
  }
  
  return startFormatted;
}

/**
 * Check if appointment can be rescheduled
 */
export function canReschedule(appointment: Appointment): boolean {
  const rescheduleableStatuses: Appointment['status'][] = ['scheduled', 'confirmed'];
  if (!rescheduleableStatuses.includes(appointment.status)) {
    return false;
  }
  
  const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
  const now = new Date();
  const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return hoursUntilAppointment >= 24;
}

/**
 * Check if appointment can be cancelled
 */
export function canCancel(appointment: Appointment): boolean {
  const cancellableStatuses: Appointment['status'][] = ['scheduled', 'confirmed'];
  if (!cancellableStatuses.includes(appointment.status)) {
    return false;
  }
  
  const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
  const now = new Date();
  const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return hoursUntilAppointment >= 2;
}

/**
 * Check if patient can check in
 */
export function canCheckIn(appointment: Appointment): boolean {
  if (appointment.status !== 'confirmed') {
    return false;
  }
  
  const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
  const now = new Date();
  const minutesUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);
  
  return minutesUntilAppointment <= 30 && minutesUntilAppointment >= -15;
}

const PatientAppointmentService = {
  // Appointment Management
  getAppointments,
  getUpcomingAppointments,
  getAppointment,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  confirmAppointment,
  checkIn,
  getQueueStatus,
  
  // Doctor & Slot Search
  searchDoctors,
  getDoctor,
  getAvailableSlots,
  getDoctorAvailability,
  
  // History
  getDoctorHistory,
  getPastAppointments,
  
  // Telemedicine
  getTelemedicineLink,
  joinTelemedicineSession,
  
  // Feedback
  submitFeedback,
  
  // Utilities
  getStatusVariant,
  formatAppointmentTime,
  canReschedule,
  canCancel,
  canCheckIn
};

export default PatientAppointmentService;
