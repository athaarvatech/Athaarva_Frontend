/**
 * Clinical Document Types - Phase 5: Clinical Document Branding
 * 
 * TypeScript interfaces for all clinical document types including
 * prescriptions, certificates, invoices, discharge summaries, etc.
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface HospitalBranding {
  logoUrl?: string;
  hospitalName: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  registrationNumber?: string;
  gstNumber?: string;
}

export interface DoctorInfo {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  registrationNumber: string;
  signature?: string; // Base64 or URL
  designation?: string;
  department?: string;
  phone?: string;
  email?: string;
}

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup?: string;
  phone?: string;
  email?: string;
  address?: string;
  patientId: string; // Hospital-assigned ID (e.g., PID-2024-0001)
}

export interface DocumentMetadata {
  documentId: string;
  documentType: DocumentType;
  createdAt: Date;
  createdBy: string;
  hospitalId: string;
  qrCodeData?: string;
  version?: number;
}

export type DocumentType = 
  | "prescription"
  | "medical_certificate"
  | "fitness_certificate"
  | "invoice"
  | "discharge_summary"
  | "lab_report"
  | "appointment_card"
  | "referral_letter";

// ============================================================================
// PRESCRIPTION TYPES
// ============================================================================

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  dosage: string; // e.g., "500mg"
  frequency: string; // e.g., "1-0-1" or "Twice daily"
  duration: string; // e.g., "5 days"
  quantity?: number;
  instructions?: string; // e.g., "After food", "Before sleep"
  route?: "Oral" | "IV" | "IM" | "Topical" | "Inhaler" | "Other";
}

export interface PrescriptionData {
  metadata: DocumentMetadata;
  hospital: HospitalBranding;
  doctor: DoctorInfo;
  patient: PatientInfo;
  visitDate: Date;
  visitType: "OPD" | "IPD" | "Emergency" | "Follow-up";
  chiefComplaints: string[];
  diagnosis: string[];
  medicines: Medicine[];
  investigations?: string[]; // Lab tests advised
  advice?: string[];
  followUpDate?: Date;
  vitalSigns?: {
    bloodPressure?: string;
    pulse?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    spo2?: number;
  };
  allergies?: string[];
  notes?: string;
}

// ============================================================================
// MEDICAL CERTIFICATE TYPES
// ============================================================================

export type CertificateType = 
  | "medical_leave"
  | "fitness"
  | "disability"
  | "birth"
  | "death"
  | "vaccination"
  | "custom";

export interface MedicalCertificateData {
  metadata: DocumentMetadata;
  hospital: HospitalBranding;
  doctor: DoctorInfo;
  patient: PatientInfo;
  certificateType: CertificateType;
  issueDate: Date;
  // For medical leave certificates
  leaveFrom?: Date;
  leaveTo?: Date;
  totalDays?: number;
  diagnosis?: string;
  // For fitness certificates
  fitFor?: string; // "duty", "travel", "sports", etc.
  validUntil?: Date;
  restrictions?: string[];
  // Common fields
  purpose: string;
  remarks?: string;
  customContent?: string; // For custom certificates
}

// ============================================================================
// INVOICE / BILLING TYPES
// ============================================================================

export interface InvoiceItem {
  id: string;
  description: string;
  category: "consultation" | "procedure" | "medicine" | "lab" | "room" | "other";
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountType?: "percentage" | "fixed";
  tax?: number;
  taxType?: "GST" | "CGST_SGST" | "IGST";
  total: number;
  hsnCode?: string;
  sacCode?: string;
}

export interface PaymentInfo {
  method: "cash" | "card" | "upi" | "netbanking" | "insurance" | "cheque";
  transactionId?: string;
  paidAmount: number;
  paidAt?: Date;
  receivedBy?: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  claimNumber?: string;
  approvedAmount?: number;
  tpaName?: string;
}

export interface InvoiceData {
  metadata: DocumentMetadata;
  hospital: HospitalBranding;
  patient: PatientInfo;
  doctor?: DoctorInfo;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  admissionDate?: Date;
  dischargeDate?: Date;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  amountPaid: number;
  amountDue: number;
  payments: PaymentInfo[];
  insurance?: InsuranceInfo;
  notes?: string;
  termsAndConditions?: string[];
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolder: string;
    upiId?: string;
  };
}

// ============================================================================
// DISCHARGE SUMMARY TYPES
// ============================================================================

export interface DischargeSummaryData {
  metadata: DocumentMetadata;
  hospital: HospitalBranding;
  patient: PatientInfo;
  admittingDoctor: DoctorInfo;
  consultingDoctors?: DoctorInfo[];
  admissionDate: Date;
  dischargeDate: Date;
  ward?: string;
  roomNumber?: string;
  admissionType: "Emergency" | "Elective" | "Transfer";
  dischargeType: "Normal" | "LAMA" | "Absconded" | "Transfer" | "Expired";
  chiefComplaints: string[];
  historyOfPresentIllness: string;
  pastMedicalHistory?: string;
  familyHistory?: string;
  clinicalFindings: string;
  investigations: {
    name: string;
    date: Date;
    result: string;
  }[];
  diagnosis: {
    primary: string;
    secondary?: string[];
    icdCodes?: string[];
  };
  treatmentGiven: string;
  proceduresPerformed?: {
    name: string;
    date: Date;
    surgeon?: string;
    notes?: string;
  }[];
  conditionAtDischarge: string;
  dischargeMedications: Medicine[];
  dietAdvice?: string;
  activityRestrictions?: string[];
  followUpInstructions: string;
  followUpDate?: Date;
  emergencyInstructions?: string;
  referrals?: {
    department: string;
    doctor?: string;
    reason: string;
  }[];
}

// ============================================================================
// LAB REPORT TYPES
// ============================================================================

export interface LabTestResult {
  testName: string;
  testCode?: string;
  result: string;
  unit?: string;
  normalRange?: string;
  status?: "normal" | "high" | "low" | "critical";
  method?: string;
}

export interface LabReportData {
  metadata: DocumentMetadata;
  hospital: HospitalBranding;
  patient: PatientInfo;
  referringDoctor?: DoctorInfo;
  labTechnician?: string;
  pathologist?: DoctorInfo;
  sampleCollectedAt: Date;
  sampleReceivedAt?: Date;
  reportGeneratedAt: Date;
  sampleType: string; // Blood, Urine, etc.
  labNumber: string;
  tests: LabTestResult[];
  interpretation?: string;
  notes?: string;
}

// ============================================================================
// APPOINTMENT CARD TYPES
// ============================================================================

export interface AppointmentCardData {
  metadata: DocumentMetadata;
  hospital: HospitalBranding;
  patient: PatientInfo;
  doctor: DoctorInfo;
  appointmentDate: Date;
  appointmentTime: string;
  appointmentType: "Consultation" | "Follow-up" | "Procedure" | "Test";
  department?: string;
  location?: string; // Room/floor info
  tokenNumber?: string;
  instructions?: string[];
  estimatedDuration?: number; // in minutes
}

// ============================================================================
// DOCUMENT TEMPLATE CONFIG
// ============================================================================

export interface DocumentHeaderConfig {
  showLogo: boolean;
  logoPosition: "left" | "center" | "right";
  logoSize: "small" | "medium" | "large";
  showHospitalName: boolean;
  showAddress: boolean;
  showContact: boolean;
  showRegistration: boolean;
  headerBackground?: string;
  headerHeight?: number;
  customHeader?: string; // HTML/Rich text
}

export interface DocumentFooterConfig {
  showPageNumber: boolean;
  showGeneratedDate: boolean;
  showQRCode: boolean;
  showDisclaimer: boolean;
  disclaimerText?: string;
  showSignatureLine: boolean;
  footerBackground?: string;
  footerHeight?: number;
  customFooter?: string; // HTML/Rich text
}

export interface DocumentStyleConfig {
  fontFamily: string;
  fontSize: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  paperSize: "A4" | "A5" | "Letter" | "Legal";
  orientation: "portrait" | "landscape";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  lineHeight?: number;
}

export interface DocumentTemplateConfig {
  id: string;
  name: string;
  documentType: DocumentType;
  isDefault: boolean;
  header: DocumentHeaderConfig;
  footer: DocumentFooterConfig;
  style: DocumentStyleConfig;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export const DEFAULT_DOCUMENT_STYLE: DocumentStyleConfig = {
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  primaryColor: "#007C7C",
  secondaryColor: "#20B2AA",
  paperSize: "A4",
  orientation: "portrait",
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  lineHeight: 1.5,
};

export const DEFAULT_HEADER_CONFIG: DocumentHeaderConfig = {
  showLogo: true,
  logoPosition: "left",
  logoSize: "medium",
  showHospitalName: true,
  showAddress: true,
  showContact: true,
  showRegistration: true,
  headerHeight: 100,
};

export const DEFAULT_FOOTER_CONFIG: DocumentFooterConfig = {
  showPageNumber: true,
  showGeneratedDate: true,
  showQRCode: true,
  showDisclaimer: true,
  disclaimerText: "This is a computer-generated document and does not require a physical signature.",
  showSignatureLine: true,
  footerHeight: 60,
};
