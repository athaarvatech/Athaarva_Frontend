/**
 * Patient Services Index
 * Exports all patient-related API services
 */

export { default as PatientAppointmentService } from './PatientAppointmentService';
export { default as PatientBillingService } from './PatientBillingService';
export { default as PatientPrescriptionService } from './PatientPrescriptionService';
export { default as PatientMedicalRecordsService } from './PatientMedicalRecordsService';

// Re-export types
export type {
  Appointment,
  AppointmentBookingRequest,
  RescheduleRequest,
  CancellationRequest,
  Doctor,
  TimeSlot,
} from './PatientAppointmentService';

export type {
  Invoice,
  InvoiceItem,
  Payment,
  InsuranceClaim,
  ClaimDocument,
  InsurancePolicy,
  BillingSummary,
  PaymentIntent,
} from './PatientBillingService';

export type {
  Prescription,
  PrescriptionItem,
  Medication,
  MedicationLog,
  AdherenceReport,
  DrugInteraction,
} from './PatientPrescriptionService';

export type {
  MedicalRecord,
  ShareRecord,
  UploadRecordRequest,
  ShareRequest,
  HealthVital,
  Allergy,
  MedicalCondition,
  FamilyHistory,
} from './PatientMedicalRecordsService';
