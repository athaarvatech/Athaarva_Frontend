/**
 * Document Template System
 * 
 * Based on the Dr. Prashant Multispeciality Hospital designs:
 * - Classic: Dotted pattern on right, green vertical bar, bottom-left footer
 * - Modern: Large watermark logo, curved bottom-left corner, centered footer
 * - Minimal: Diagonal green shapes in corners, right-aligned footer
 */

export type DocumentTemplateStyle = "classic" | "modern" | "minimal";

export type DocumentType = 
  | "prescription"
  | "invoice"
  | "medical_certificate"
  | "lab_report"
  | "discharge_summary"
  | "referral_letter"
  | "appointment_card";

export interface DocumentTemplateConfig {
  id: DocumentTemplateStyle;
  name: string;
  description: string;
  previewColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: string[];
  headerStyle: "left-logo" | "center-logo" | "split-header";
  footerStyle: "left" | "center" | "right";
  decorativeElements: {
    type: "dotted-bar" | "watermark" | "diagonal-corners" | "curved-corner" | "none";
    position: string;
  }[];
}

export interface HospitalBranding {
  logo_url?: string;
  hospital_name: string;
  tagline?: string;
  primary_color: string;
  secondary_color?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    district?: string;
    state: string;
    pincode: string;
    country?: string;
  };
  contact: {
    phone?: string;
    mobile?: string;
    email?: string;
    website?: string;
  };
  registration_number?: string;
}

export interface DoctorInfo {
  name: string;
  qualifications: string;
  registration_number?: string;
  mobile?: string;
  specialization?: string;
}

export interface PatientInfo {
  id: string;
  name: string;
  gender: "M" | "F" | "O";
  age?: number;
  address?: string;
  phone?: string;
}

export interface VitalsInfo {
  temperature?: number;
  blood_pressure?: string;
  pulse?: number;
  weight?: number;
  height?: number;
  spo2?: number;
}

export interface MedicineEntry {
  type: "TAB" | "CAP" | "SYP" | "INJ" | "CREAM" | "DROPS" | "OTHER";
  name: string;
  dosage: string;
  timing: string;
  duration: string;
  quantity?: string;
  instructions?: string;
}

export interface PrescriptionData {
  doctor: DoctorInfo;
  patient: PatientInfo;
  vitals?: VitalsInfo;
  date: string;
  time?: string;
  medicines: MedicineEntry[];
  advice?: string[];
  follow_up_date?: string;
  diagnosis?: string;
  charts?: {
    temperature?: { date: string; value: number }[];
    blood_pressure?: { date: string; systolic: number; diastolic: number }[];
  };
}

export interface InvoiceData {
  invoice_number: string;
  date: string;
  patient: PatientInfo;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    hsn_code?: string;
  }[];
  subtotal: number;
  tax_details?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
  };
  discount?: number;
  total: number;
  amount_in_words?: string;
  payment_mode?: string;
  payment_status?: "paid" | "pending" | "partial";
}

export interface MedicalCertificateData {
  certificate_number?: string;
  date: string;
  patient: PatientInfo;
  doctor: DoctorInfo;
  purpose: "fitness" | "sick_leave" | "medical_examination" | "custom";
  custom_purpose?: string;
  diagnosis?: string;
  from_date?: string;
  to_date?: string;
  rest_days?: number;
  remarks?: string;
  is_fit?: boolean;
}

// Template configurations
export const DOCUMENT_TEMPLATES: Record<DocumentTemplateStyle, DocumentTemplateConfig> = {
  classic: {
    id: "classic",
    name: "Classic Clinical",
    description: "Professional design with dotted pattern accent and green sidebar. Traditional healthcare aesthetic.",
    previewColors: {
      primary: "#00A651",
      secondary: "#008C45",
      accent: "#E8F5E9",
    },
    features: [
      "Dotted pattern decoration",
      "Green vertical sidebar",
      "Footer at bottom-left",
      "Clean professional look",
    ],
    headerStyle: "left-logo",
    footerStyle: "left",
    decorativeElements: [
      { type: "dotted-bar", position: "right" },
      { type: "none", position: "bottom" },
    ],
  },
  modern: {
    id: "modern",
    name: "Modern Watermark",
    description: "Contemporary design with subtle logo watermark and curved accents. Elegant and memorable.",
    previewColors: {
      primary: "#00A651",
      secondary: "#008C45",
      accent: "#F0FFF4",
    },
    features: [
      "Large watermark logo",
      "Curved corner accent",
      "Centered footer",
      "Elegant modern feel",
    ],
    headerStyle: "left-logo",
    footerStyle: "center",
    decorativeElements: [
      { type: "watermark", position: "center" },
      { type: "curved-corner", position: "bottom-left" },
    ],
  },
  minimal: {
    id: "minimal",
    name: "Minimal Geometric",
    description: "Clean minimalist design with diagonal corner accents. Modern corporate healthcare style.",
    previewColors: {
      primary: "#00A651",
      secondary: "#008C45",
      accent: "#FFFFFF",
    },
    features: [
      "Diagonal corner shapes",
      "Ultra-clean layout",
      "Right-aligned footer",
      "Corporate modern style",
    ],
    headerStyle: "left-logo",
    footerStyle: "right",
    decorativeElements: [
      { type: "diagonal-corners", position: "top-right" },
      { type: "diagonal-corners", position: "bottom-left" },
    ],
  },
};

// Document type configurations
export const DOCUMENT_TYPES: Record<DocumentType, {
  name: string;
  description: string;
  icon: string;
  fields: string[];
}> = {
  prescription: {
    name: "Prescription",
    description: "Medicine prescriptions with dosage and instructions",
    icon: "pill",
    fields: ["doctor", "patient", "vitals", "medicines", "advice", "follow_up"],
  },
  invoice: {
    name: "Invoice / Bill",
    description: "Patient billing with itemized charges",
    icon: "receipt",
    fields: ["invoice_number", "patient", "items", "tax", "total"],
  },
  medical_certificate: {
    name: "Medical Certificate",
    description: "Fitness and sick leave certificates",
    icon: "file-badge",
    fields: ["patient", "doctor", "purpose", "dates", "remarks"],
  },
  lab_report: {
    name: "Lab Report",
    description: "Laboratory test results and reports",
    icon: "flask",
    fields: ["patient", "tests", "results", "reference_ranges"],
  },
  discharge_summary: {
    name: "Discharge Summary",
    description: "Patient discharge documentation",
    icon: "clipboard-check",
    fields: ["patient", "admission", "discharge", "diagnosis", "treatment"],
  },
  referral_letter: {
    name: "Referral Letter",
    description: "Patient referral to specialists",
    icon: "send",
    fields: ["patient", "referring_doctor", "referred_to", "reason"],
  },
  appointment_card: {
    name: "Appointment Card",
    description: "Appointment reminder cards",
    icon: "calendar",
    fields: ["patient", "doctor", "date", "time", "department"],
  },
};

// Sample data for previews
export const SAMPLE_HOSPITAL_BRANDING: HospitalBranding = {
  hospital_name: "City General Hospital",
  tagline: "Caring for Your Health",
  primary_color: "#007C7C",
  secondary_color: "#20B2AA",
  address: {
    line1: "123 Healthcare Avenue",
    line2: "Near Central Park",
    city: "Mumbai",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    pincode: "400001",
    country: "India",
  },
  contact: {
    phone: "+91 22 1234 5678",
    mobile: "+91 98765 43210",
    email: "info@cityhospital.com",
    website: "www.cityhospital.com",
  },
  registration_number: "MH/2024/12345",
};

export const SAMPLE_PRESCRIPTION_DATA: PrescriptionData = {
  doctor: {
    name: "Dr. Name Surname",
    qualifications: "M.B.B.S, M.D, M.S",
    registration_number: "MCI-12345",
    mobile: "+91 98765 43210",
    specialization: "General Medicine",
  },
  patient: {
    id: "209",
    name: "DEMO PATIENT",
    gender: "F",
    age: 35,
    address: "Rampur",
  },
  vitals: {
    temperature: 36,
    blood_pressure: "120/80",
  },
  date: "16-Nov-2025",
  time: "5:00 PM",
  medicines: [
    {
      type: "TAB",
      name: "DEMO MEDICINE 1",
      dosage: "1 Morning, 1 Night",
      timing: "Before Food",
      duration: "10 Days",
      quantity: "20 Tab",
    },
    {
      type: "CAP",
      name: "DEMO MEDICINE 2",
      dosage: "1 Morning, 1 Night",
      timing: "Before Food",
      duration: "10 Days",
      quantity: "20 Cap",
    },
    {
      type: "TAB",
      name: "DEMO MEDICINE 3",
      dosage: "1 Morning, 1 Aft, 1 Eve",
      timing: "Before Food",
      duration: "10 Days",
      quantity: "30 Tab",
    },
    {
      type: "TAB",
      name: "DEMO MEDICINE 4",
      dosage: "1 Morning, 1 Aft, 1 Eve, 1 Night",
      timing: "Before Food",
      duration: "10 Days",
      quantity: "40 Tab",
    },
  ],
  advice: ["AVOID OILY AND SPICY FOOD"],
  follow_up_date: "12-12-2025",
};

export const SAMPLE_INVOICE_DATA: InvoiceData = {
  invoice_number: "INV-2025-001234",
  date: "16-Nov-2025",
  patient: {
    id: "209",
    name: "Demo Patient",
    gender: "F",
    address: "123 Main Street, City",
  },
  items: [
    { description: "Consultation Fee", quantity: 1, rate: 500, amount: 500 },
    { description: "Blood Test - CBC", quantity: 1, rate: 350, amount: 350 },
    { description: "X-Ray Chest", quantity: 1, rate: 800, amount: 800 },
    { description: "Medicines", quantity: 1, rate: 450, amount: 450 },
  ],
  subtotal: 2100,
  tax_details: {
    cgst: 0,
    sgst: 0,
  },
  discount: 0,
  total: 2100,
  amount_in_words: "Two Thousand One Hundred Rupees Only",
  payment_mode: "Cash",
  payment_status: "paid",
};

export const SAMPLE_CERTIFICATE_DATA: MedicalCertificateData = {
  certificate_number: "MC-2025-0567",
  date: "16-Nov-2025",
  patient: {
    id: "209",
    name: "Demo Patient",
    gender: "F",
    age: 35,
    address: "123 Main Street, City",
  },
  doctor: {
    name: "Dr. Name Surname",
    qualifications: "M.B.B.S, M.D",
    registration_number: "MCI-12345",
  },
  purpose: "sick_leave",
  diagnosis: "Acute Viral Fever",
  from_date: "14-Nov-2025",
  to_date: "18-Nov-2025",
  rest_days: 5,
  remarks: "Patient is advised complete bed rest and to avoid strenuous activities.",
  is_fit: false,
};

// Utility functions
export function getTemplateConfig(style: DocumentTemplateStyle): DocumentTemplateConfig {
  return DOCUMENT_TEMPLATES[style];
}

export function getDocumentTypeConfig(type: DocumentType) {
  return DOCUMENT_TYPES[type];
}

export function applyBrandingToTemplate(
  template: DocumentTemplateConfig,
  branding: Partial<HospitalBranding>
): DocumentTemplateConfig {
  return {
    ...template,
    previewColors: {
      primary: branding.primary_color || template.previewColors.primary,
      secondary: branding.secondary_color || template.previewColors.secondary,
      accent: template.previewColors.accent,
    },
  };
}

// CSS generation for templates
export function generateTemplateCSS(
  style: DocumentTemplateStyle,
  primaryColor: string
): string {
  const template = DOCUMENT_TEMPLATES[style];
  
  const baseCSS = `
    .document-${style} {
      --primary-color: ${primaryColor};
      --secondary-color: ${primaryColor}dd;
      position: relative;
      background: white;
      min-height: 100%;
    }
  `;
  
  switch (style) {
    case "classic":
      return `${baseCSS}
        .document-classic .decorative-bar {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 8px;
          background: var(--primary-color);
        }
        .document-classic .dotted-pattern {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          display: grid;
          grid-template-columns: repeat(3, 8px);
          gap: 6px;
        }
        .document-classic .dotted-pattern .dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          background: var(--primary-color);
        }
      `;
    case "modern":
      return `${baseCSS}
        .document-modern .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.05;
          font-size: 300px;
          pointer-events: none;
        }
        .document-modern .curved-corner {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200px;
          height: 100px;
          background: var(--primary-color);
          border-top-right-radius: 100%;
        }
      `;
    case "minimal":
      return `${baseCSS}
        .document-minimal .diagonal-top {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 120px 120px 0;
          border-color: transparent var(--primary-color) transparent transparent;
        }
        .document-minimal .diagonal-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 120px 0 0 120px;
          border-color: transparent transparent transparent var(--primary-color);
        }
      `;
    default:
      return baseCSS;
  }
}
