/**
 * Document Components - Phase 5: Clinical Document Branding
 * 
 * Barrel export file for all document-related components and utilities.
 */

// Types
export * from "./types";

// Base Template
export { default as BaseDocumentTemplate } from "./BaseDocumentTemplate";
export { PatientInfoSection, DoctorInfoSection, SectionTitle } from "./BaseDocumentTemplate";

// Document Templates
export { default as PrescriptionTemplate } from "./PrescriptionTemplate";
export { PrescriptionTemplate as Prescription } from "./PrescriptionTemplate";

export { default as MedicalCertificateTemplate } from "./MedicalCertificateTemplate";
export { MedicalCertificateTemplate as MedicalCertificate } from "./MedicalCertificateTemplate";

export { default as InvoiceTemplate } from "./InvoiceTemplate";
export { InvoiceTemplate as Invoice } from "./InvoiceTemplate";

export { default as DischargeTemplate } from "./DischargeTemplate";
export { DischargeTemplate as DischargeSummary } from "./DischargeTemplate";

export { default as LabReportTemplate } from "./LabReportTemplate";
export { LabReportTemplate as LabReport } from "./LabReportTemplate";

// Template Builder
export { default as DocumentTemplateBuilder } from "./DocumentTemplateBuilder";
export { DocumentTemplateBuilder as TemplateBuilder } from "./DocumentTemplateBuilder";
