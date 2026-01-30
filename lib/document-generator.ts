/**
 * Document Generator - Phase 5: Clinical Document Branding
 * 
 * PDF generation utilities for clinical documents using browser print API
 * and html2canvas for cross-browser compatibility.
 */

import { 
  PrescriptionData,
  MedicalCertificateData,
  InvoiceData,
  DocumentTemplateConfig,
  DocumentType,
  HospitalBranding,
} from "@/components/documents/types";

// ============================================================================
// TYPES
// ============================================================================

export interface GenerateDocumentOptions {
  filename?: string;
  openInNewTab?: boolean;
  returnBlob?: boolean;
}

export interface DocumentGenerationResult {
  success: boolean;
  blob?: Blob;
  url?: string;
  error?: string;
}

// ============================================================================
// PRINT STYLES
// ============================================================================

const PRINT_STYLES = `
@media print {
  @page {
    size: A4;
    margin: 0;
  }
  
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  
  .no-print {
    display: none !important;
  }
  
  .print-break-before {
    page-break-before: always;
  }
  
  .print-break-after {
    page-break-after: always;
  }
  
  .print-avoid-break {
    page-break-inside: avoid;
  }
}
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a unique document ID
 */
export function generateDocumentId(prefix: string = "DOC"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Format date for display in documents
 */
export function formatDocumentDate(date: Date, format: "short" | "long" | "full" = "short"): string {
  const optionsMap: Record<"short" | "long" | "full", Intl.DateTimeFormatOptions> = {
    short: { day: "2-digit", month: "short", year: "numeric" },
    long: { day: "2-digit", month: "long", year: "numeric" },
    full: { weekday: "long", day: "2-digit", month: "long", year: "numeric" },
  };
  
  return date.toLocaleDateString("en-IN", optionsMap[format]);
}

/**
 * Format currency for display in documents
 */
export function formatDocumentCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate QR code data string for document verification
 */
export function generateQRCodeData(
  documentId: string,
  documentType: DocumentType,
  hospitalName: string,
  additionalData?: Record<string, string>
): string {
  const data = {
    id: documentId,
    type: documentType,
    hospital: hospitalName,
    generated: new Date().toISOString(),
    ...additionalData,
  };
  return JSON.stringify(data);
}

// ============================================================================
// PRINT FUNCTIONS
// ============================================================================

/**
 * Print a document element using the browser's print API
 */
export function printDocument(
  elementRef: HTMLElement | null,
  options: {
    title?: string;
    pageSize?: "A4" | "A5" | "Letter" | "Legal";
    orientation?: "portrait" | "landscape";
  } = {}
): void {
  if (!elementRef) {
    console.error("No element provided for printing");
    return;
  }

  const { title = "Document", pageSize = "A4", orientation = "portrait" } = options;

  // Create a new window for printing
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) {
    console.error("Failed to open print window");
    return;
  }

  // Get the computed styles from the parent document
  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");

  // Create print-specific page rules
  const pageSizeCSS = {
    A4: "210mm 297mm",
    A5: "148mm 210mm",
    Letter: "8.5in 11in",
    Legal: "8.5in 14in",
  }[pageSize];

  // Build the print document
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          ${styles}
          ${PRINT_STYLES}
          @page {
            size: ${orientation === "landscape" ? pageSizeCSS.split(" ").reverse().join(" ") : pageSizeCSS};
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        ${elementRef.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for styles to load before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // Close the window after printing (or canceling)
    setTimeout(() => {
      printWindow.close();
    }, 100);
  };
}

/**
 * Download document as PDF using the browser's print-to-PDF functionality
 */
export async function downloadDocumentAsPDF(
  elementRef: HTMLElement | null,
  filename: string = "document.pdf",
  options: {
    pageSize?: "A4" | "A5" | "Letter";
    orientation?: "portrait" | "landscape";
  } = {}
): Promise<void> {
  if (!elementRef) {
    console.error("No element provided for PDF download");
    return;
  }

  // For now, use print dialog with PDF option
  // In production, you would use a library like html2pdf.js or puppeteer on the server
  printDocument(elementRef, {
    title: filename.replace(".pdf", ""),
    ...options,
  });
}

// ============================================================================
// DOCUMENT DATA HELPERS
// ============================================================================

/**
 * Create sample prescription data for preview/testing
 */
export function createSamplePrescriptionData(
  hospital: HospitalBranding
): PrescriptionData {
  return {
    metadata: {
      documentId: generateDocumentId("RX"),
      documentType: "prescription",
      createdAt: new Date(),
      createdBy: "Dr. Sample Doctor",
      hospitalId: "hospital-123",
    },
    hospital,
    doctor: {
      id: "doc-1",
      name: "Dr. Sample Doctor",
      qualification: "MBBS, MD",
      specialization: "General Medicine",
      registrationNumber: "MCI-12345",
      designation: "Senior Consultant",
      department: "General Medicine",
    },
    patient: {
      id: "pat-1",
      name: "Sample Patient",
      age: 35,
      gender: "Male",
      patientId: "PID-2024-0001",
      phone: "+91 98765 43210",
    },
    visitDate: new Date(),
    visitType: "OPD",
    chiefComplaints: ["Fever for 3 days", "Body ache"],
    diagnosis: ["Viral fever", "Upper respiratory tract infection"],
    medicines: [
      {
        id: "med-1",
        name: "Paracetamol",
        genericName: "Acetaminophen",
        dosage: "500mg",
        frequency: "1-0-1",
        duration: "5 days",
        instructions: "After food",
      },
      {
        id: "med-2",
        name: "Cetirizine",
        dosage: "10mg",
        frequency: "0-0-1",
        duration: "5 days",
        instructions: "At bedtime",
      },
    ],
    advice: ["Drink plenty of fluids", "Rest for 2-3 days"],
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
    vitalSigns: {
      bloodPressure: "120/80",
      pulse: 78,
      temperature: 100.4,
    },
  };
}

/**
 * Create sample medical certificate data for preview/testing
 */
export function createSampleMedicalCertificateData(
  hospital: HospitalBranding
): MedicalCertificateData {
  return {
    metadata: {
      documentId: generateDocumentId("CERT"),
      documentType: "medical_certificate",
      createdAt: new Date(),
      createdBy: "Dr. Sample Doctor",
      hospitalId: "hospital-123",
    },
    hospital,
    doctor: {
      id: "doc-1",
      name: "Dr. Sample Doctor",
      qualification: "MBBS, MD",
      specialization: "General Medicine",
      registrationNumber: "MCI-12345",
    },
    patient: {
      id: "pat-1",
      name: "Sample Patient",
      age: 35,
      gender: "Male",
      patientId: "PID-2024-0001",
      address: "123 Sample Street, City",
    },
    certificateType: "medical_leave",
    issueDate: new Date(),
    leaveFrom: new Date(),
    leaveTo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    totalDays: 5,
    diagnosis: "Viral fever with respiratory infection",
    purpose: "Medical leave for office",
    remarks: "Patient requires complete bed rest",
  };
}

/**
 * Create sample invoice data for preview/testing
 */
export function createSampleInvoiceData(
  hospital: HospitalBranding
): Partial<InvoiceData> {
  return {
    metadata: {
      documentId: generateDocumentId("INV"),
      documentType: "invoice",
      createdAt: new Date(),
      createdBy: "System",
      hospitalId: "hospital-123",
    },
    hospital,
    patient: {
      id: "pat-1",
      name: "Sample Patient",
      age: 35,
      gender: "Male",
      patientId: "PID-2024-0001",
      phone: "+91 98765 43210",
    },
    invoiceNumber: "INV-2024-0001",
    invoiceDate: new Date(),
    items: [
      {
        id: "item-1",
        description: "Consultation Fee",
        category: "consultation",
        quantity: 1,
        unitPrice: 500,
        total: 500,
      },
      {
        id: "item-2",
        description: "Blood Test - CBC",
        category: "lab",
        quantity: 1,
        unitPrice: 350,
        total: 350,
      },
    ],
    subtotal: 850,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 850,
    amountPaid: 850,
    amountDue: 0,
    payments: [],
  };
}

// ============================================================================
// TEMPLATE UTILS
// ============================================================================

/**
 * Get default template config for a document type
 */
export function getDefaultTemplateConfig(
  documentType: DocumentType,
  hospitalBranding: HospitalBranding
): Partial<DocumentTemplateConfig> {
  const baseConfig = {
    documentType,
    isDefault: true,
    header: {
      showLogo: true,
      logoPosition: "left" as const,
      logoSize: "medium" as const,
      showHospitalName: true,
      showAddress: true,
      showContact: true,
      showRegistration: true,
      headerHeight: 100,
    },
    footer: {
      showPageNumber: true,
      showGeneratedDate: true,
      showQRCode: true,
      showDisclaimer: true,
      disclaimerText: "This is a computer-generated document and does not require a physical signature.",
      showSignatureLine: true,
      footerHeight: 60,
    },
    style: {
      fontFamily: "Inter, sans-serif",
      fontSize: 12,
      primaryColor: hospitalBranding.primaryColor,
      secondaryColor: hospitalBranding.secondaryColor,
      paperSize: "A4" as const,
      orientation: "portrait" as const,
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      lineHeight: 1.5,
    },
  };

  // Customize based on document type
  switch (documentType) {
    case "prescription":
      return {
        ...baseConfig,
        name: "Prescription Template",
      };
    case "medical_certificate":
    case "fitness_certificate":
      return {
        ...baseConfig,
        name: `${documentType === "fitness_certificate" ? "Fitness" : "Medical"} Certificate Template`,
        header: {
          ...baseConfig.header,
          logoPosition: "center" as const,
          logoSize: "large" as const,
        },
      };
    case "invoice":
      return {
        ...baseConfig,
        name: "Invoice Template",
        header: {
          ...baseConfig.header,
          showRegistration: true,
        },
        footer: {
          ...baseConfig.footer,
          showSignatureLine: false,
        },
      };
    case "discharge_summary":
      return {
        ...baseConfig,
        name: "Discharge Summary Template",
        header: {
          ...baseConfig.header,
          logoSize: "small" as const,
        },
      };
    case "lab_report":
      return {
        ...baseConfig,
        name: "Lab Report Template",
        header: {
          ...baseConfig.header,
          headerHeight: 80,
        },
      };
    case "appointment_card":
      return {
        ...baseConfig,
        name: "Appointment Card Template",
        header: {
          ...baseConfig.header,
          logoPosition: "center" as const,
          logoSize: "small" as const,
        },
        footer: {
          ...baseConfig.footer,
          showSignatureLine: false,
        },
        style: {
          ...baseConfig.style,
          paperSize: "A5" as const,
        },
      };
    default:
      return baseConfig;
  }
}

/**
 * Merge template config with defaults
 */
export function mergeTemplateConfig(
  config: Partial<DocumentTemplateConfig>,
  hospitalBranding: HospitalBranding
): DocumentTemplateConfig {
  const defaults = getDefaultTemplateConfig(
    config.documentType || "prescription",
    hospitalBranding
  );

  return {
    id: config.id || `template-${Date.now()}`,
    name: config.name || defaults.name || "Custom Template",
    documentType: config.documentType || "prescription",
    isDefault: config.isDefault ?? defaults.isDefault ?? false,
    header: { ...defaults.header, ...config.header } as DocumentTemplateConfig["header"],
    footer: { ...defaults.footer, ...config.footer } as DocumentTemplateConfig["footer"],
    style: { ...defaults.style, ...config.style } as DocumentTemplateConfig["style"],
    createdAt: config.createdAt || new Date(),
    updatedAt: new Date(),
    createdBy: config.createdBy,
  };
}
