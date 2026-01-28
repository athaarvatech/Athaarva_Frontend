"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DocumentTemplateStyle,
  HospitalBranding,
  PrescriptionData,
  InvoiceData,
  MedicalCertificateData,
  SAMPLE_HOSPITAL_BRANDING,
  SAMPLE_PRESCRIPTION_DATA,
  SAMPLE_INVOICE_DATA,
  SAMPLE_CERTIFICATE_DATA,
} from "@/lib/document-templates";
import { cn } from "@/lib/utils";

interface DocumentPreviewProps {
  style: DocumentTemplateStyle;
  branding: Partial<HospitalBranding>;
  documentType: "prescription" | "invoice" | "medical_certificate";
  data?: PrescriptionData | InvoiceData | MedicalCertificateData;
  scale?: number;
  showWatermark?: boolean;
}

// Decorative elements for each template style
const ClassicDecorations = ({ primaryColor }: { primaryColor: string }) => (
  <>
    {/* Vertical green bar on right */}
    <div
      className="absolute right-0 top-0 bottom-0 w-2"
      style={{ backgroundColor: primaryColor }}
    />
    {/* Dotted pattern */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
      {[...Array(20)].map((_, row) => (
        <div key={row} className="flex gap-1.5">
          {[...Array(3)].map((_, col) => (
            <div
              key={col}
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: primaryColor }}
            />
          ))}
        </div>
      ))}
    </div>
  </>
);

const ModernDecorations = ({ 
  primaryColor, 
  logoUrl 
}: { 
  primaryColor: string;
  logoUrl?: string;
}) => (
  <>
    {/* Large watermark in center */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt="" 
          className="w-64 h-64 object-contain opacity-5"
        />
      ) : (
        <div 
          className="text-[200px] font-bold opacity-[0.03]"
          style={{ color: primaryColor }}
        >
          ⚕
        </div>
      )}
    </div>
    {/* Curved corner at bottom-left */}
    <div 
      className="absolute bottom-0 left-0 w-32 h-16"
      style={{
        backgroundColor: primaryColor,
        borderTopRightRadius: "100%",
      }}
    />
  </>
);

const MinimalDecorations = ({ primaryColor }: { primaryColor: string }) => (
  <>
    {/* Diagonal shape top-right */}
    <div
      className="absolute top-0 right-0"
      style={{
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: "0 80px 80px 0",
        borderColor: `transparent ${primaryColor} transparent transparent`,
      }}
    />
    {/* Diagonal shape bottom-left */}
    <div
      className="absolute bottom-0 left-0"
      style={{
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: "80px 0 0 80px",
        borderColor: `transparent transparent transparent ${primaryColor}`,
      }}
    />
  </>
);

// Header component based on style
const DocumentHeader = ({
  style,
  branding,
}: {
  style: DocumentTemplateStyle;
  branding: Partial<HospitalBranding>;
}) => {
  const hospitalName = branding.hospital_name || SAMPLE_HOSPITAL_BRANDING.hospital_name;
  const tagline = branding.tagline || SAMPLE_HOSPITAL_BRANDING.tagline;
  const primaryColor = branding.primary_color || "#007C7C";
  const address = branding.address || SAMPLE_HOSPITAL_BRANDING.address;
  const contact = branding.contact || SAMPLE_HOSPITAL_BRANDING.contact;

  return (
    <div className={cn(
      "border-b-2 pb-3 mb-4",
      style === "modern" && "border-b-0 pb-4"
    )} style={{ borderColor: primaryColor }}>
      <div className="flex items-start justify-between">
        {/* Logo and hospital name */}
        <div className="flex items-center gap-3">
          {branding.logo_url ? (
            <img src={branding.logo_url} alt="" className="w-16 h-16 object-contain" />
          ) : (
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              {hospitalName.charAt(0)}
            </div>
          )}
          <div>
            <h1 
              className="text-xl font-bold"
              style={{ color: primaryColor }}
            >
              {hospitalName}
            </h1>
            {tagline && (
              <p className="text-xs text-gray-500 italic">{tagline}</p>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="text-right text-xs text-gray-600">
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>{address.city}, {address.state} - {address.pincode}</p>
          {contact.phone && <p>Tel: {contact.phone}</p>}
          {contact.mobile && <p>Mob: {contact.mobile}</p>}
          {contact.email && <p>{contact.email}</p>}
        </div>
      </div>
    </div>
  );
};

// Footer component based on style
const DocumentFooter = ({
  style,
  branding,
}: {
  style: DocumentTemplateStyle;
  branding: Partial<HospitalBranding>;
}) => {
  const hospitalName = branding.hospital_name || SAMPLE_HOSPITAL_BRANDING.hospital_name;
  const address = branding.address || SAMPLE_HOSPITAL_BRANDING.address;
  const primaryColor = branding.primary_color || "#007C7C";

  const footerAlignment = {
    classic: "text-left",
    modern: "text-center",
    minimal: "text-right",
  };

  return (
    <div className={cn(
      "absolute bottom-4 left-4 right-4 pt-2 text-xs text-gray-500",
      footerAlignment[style],
      style === "classic" && "pr-16", // Space for dotted pattern
      style === "modern" && "bottom-20", // Above curved corner
      style === "minimal" && "pl-16", // Space for diagonal
    )}>
      <div className="border-t pt-2" style={{ borderColor: `${primaryColor}33` }}>
        <p className="font-medium" style={{ color: primaryColor }}>
          {hospitalName}
        </p>
        <p>{address.line1}, {address.city}, {address.state} - {address.pincode}</p>
      </div>
    </div>
  );
};

// Prescription content
const PrescriptionContent = ({
  data,
  branding,
}: {
  data: PrescriptionData;
  branding: Partial<HospitalBranding>;
}) => {
  const primaryColor = branding.primary_color || "#007C7C";

  return (
    <div className="space-y-4 pr-8">
      {/* Doctor Info */}
      <div className="flex justify-between items-start pb-2 border-b border-gray-200">
        <div>
          <p className="font-semibold" style={{ color: primaryColor }}>
            {data.doctor.name}
          </p>
          <p className="text-xs text-gray-600">{data.doctor.qualifications}</p>
          {data.doctor.registration_number && (
            <p className="text-xs text-gray-500">Reg No: {data.doctor.registration_number}</p>
          )}
        </div>
        <div className="text-right text-xs">
          <p>Date: {data.date}</p>
          {data.time && <p>Time: {data.time}</p>}
        </div>
      </div>

      {/* Patient Info */}
      <div 
        className="p-2 rounded text-sm"
        style={{ backgroundColor: `${primaryColor}10` }}
      >
        <div className="flex gap-4 flex-wrap">
          <span><strong>ID:</strong> {data.patient.id}</span>
          <span><strong>Name:</strong> {data.patient.name}</span>
          <span><strong>Gender:</strong> {data.patient.gender}</span>
          {data.patient.age && <span><strong>Age:</strong> {data.patient.age} yrs</span>}
        </div>
        {data.patient.address && (
          <p className="mt-1"><strong>Address:</strong> {data.patient.address}</p>
        )}
      </div>

      {/* Vitals */}
      {data.vitals && (
        <div className="flex gap-4 text-xs">
          {data.vitals.temperature && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              Temp: {data.vitals.temperature}°C
            </span>
          )}
          {data.vitals.blood_pressure && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              BP: {data.vitals.blood_pressure}
            </span>
          )}
          {data.vitals.pulse && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              Pulse: {data.vitals.pulse}
            </span>
          )}
        </div>
      )}

      {/* Rx Symbol */}
      <div 
        className="text-2xl font-bold"
        style={{ color: primaryColor }}
      >
        ℞
      </div>

      {/* Medicines Table */}
      <table className="w-full text-xs">
        <thead>
          <tr 
            className="text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <th className="py-1 px-2 text-left">Medicine Name</th>
            <th className="py-1 px-2 text-left">Dosage</th>
            <th className="py-1 px-2 text-left">Duration</th>
          </tr>
        </thead>
        <tbody>
          {data.medicines.map((med, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="py-1 px-2">
                <span 
                  className="text-xs px-1 rounded mr-1 text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {med.type}
                </span>
                {med.name}
              </td>
              <td className="py-1 px-2">{med.dosage}<br/><span className="text-gray-500">{med.timing}</span></td>
              <td className="py-1 px-2">{med.duration}<br/><span className="text-gray-500">{med.quantity}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Advice */}
      {data.advice && data.advice.length > 0 && (
        <div className="text-xs">
          <p className="font-semibold" style={{ color: primaryColor }}>Advice:</p>
          <ul className="list-disc list-inside">
            {data.advice.map((adv, i) => (
              <li key={i}>{adv}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Follow-up */}
      {data.follow_up_date && (
        <p className="text-xs">
          <strong style={{ color: primaryColor }}>Follow-up Date:</strong> {data.follow_up_date}
        </p>
      )}

      {/* Signature */}
      <div className="text-right pt-8">
        <div className="inline-block border-t border-gray-300 pt-1 text-xs">
          <p className="font-semibold">{data.doctor.name}</p>
          <p className="text-gray-500">Signature</p>
        </div>
      </div>
    </div>
  );
};

// Invoice content
const InvoiceContent = ({
  data,
  branding,
}: {
  data: InvoiceData;
  branding: Partial<HospitalBranding>;
}) => {
  const primaryColor = branding.primary_color || "#007C7C";

  return (
    <div className="space-y-4 pr-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold" style={{ color: primaryColor }}>
          INVOICE
        </h2>
        <div className="text-right text-xs">
          <p><strong>Invoice No:</strong> {data.invoice_number}</p>
          <p><strong>Date:</strong> {data.date}</p>
        </div>
      </div>

      {/* Patient Info */}
      <div 
        className="p-2 rounded text-sm"
        style={{ backgroundColor: `${primaryColor}10` }}
      >
        <p><strong>Bill To:</strong></p>
        <p>{data.patient.name}</p>
        <p className="text-xs text-gray-600">{data.patient.address}</p>
      </div>

      {/* Items Table */}
      <table className="w-full text-xs">
        <thead>
          <tr 
            className="text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <th className="py-1 px-2 text-left">Description</th>
            <th className="py-1 px-2 text-center">Qty</th>
            <th className="py-1 px-2 text-right">Rate</th>
            <th className="py-1 px-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="py-1 px-2">{item.description}</td>
              <td className="py-1 px-2 text-center">{item.quantity}</td>
              <td className="py-1 px-2 text-right">₹{item.rate.toFixed(2)}</td>
              <td className="py-1 px-2 text-right">₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2" style={{ borderColor: primaryColor }}>
          <tr>
            <td colSpan={3} className="py-1 px-2 text-right font-semibold">Subtotal:</td>
            <td className="py-1 px-2 text-right">₹{data.subtotal.toFixed(2)}</td>
          </tr>
          {data.discount !== undefined && data.discount > 0 && (
            <tr>
              <td colSpan={3} className="py-1 px-2 text-right">Discount:</td>
              <td className="py-1 px-2 text-right">-₹{data.discount.toFixed(2)}</td>
            </tr>
          )}
          <tr 
            className="text-white font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            <td colSpan={3} className="py-1 px-2 text-right">Total:</td>
            <td className="py-1 px-2 text-right">₹{data.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      {data.amount_in_words && (
        <p className="text-xs italic">
          <strong>Amount in words:</strong> {data.amount_in_words}
        </p>
      )}

      <div className="flex justify-between items-center text-xs pt-4">
        <div>
          <p><strong>Payment Mode:</strong> {data.payment_mode}</p>
          <span 
            className="inline-block px-2 py-0.5 rounded text-white mt-1"
            style={{ 
              backgroundColor: data.payment_status === "paid" ? "#22c55e" : 
                data.payment_status === "partial" ? "#f59e0b" : "#ef4444"
            }}
          >
            {data.payment_status?.toUpperCase()}
          </span>
        </div>
        <div className="text-right">
          <div className="border-t border-gray-300 pt-8 mt-4 inline-block px-8">
            <p className="text-gray-500">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Medical Certificate content
const CertificateContent = ({
  data,
  branding,
}: {
  data: MedicalCertificateData;
  branding: Partial<HospitalBranding>;
}) => {
  const primaryColor = branding.primary_color || "#007C7C";

  return (
    <div className="space-y-4 pr-8">
      <h2 
        className="text-lg font-bold text-center border-b-2 pb-2"
        style={{ color: primaryColor, borderColor: primaryColor }}
      >
        MEDICAL CERTIFICATE
      </h2>

      <div className="text-right text-xs">
        {data.certificate_number && <p><strong>Cert No:</strong> {data.certificate_number}</p>}
        <p><strong>Date:</strong> {data.date}</p>
      </div>

      <div className="text-sm space-y-3">
        <p>
          This is to certify that <strong>{data.patient.name}</strong>, 
          {data.patient.age && <> Age: <strong>{data.patient.age} years</strong>,</>}
          {" "}Gender: <strong>{data.patient.gender === "M" ? "Male" : data.patient.gender === "F" ? "Female" : "Other"}</strong>
          {data.patient.address && <>, residing at <strong>{data.patient.address}</strong></>}
          , was examined by me on <strong>{data.date}</strong>.
        </p>

        {data.diagnosis && (
          <p>
            <strong>Diagnosis:</strong> {data.diagnosis}
          </p>
        )}

        {data.purpose === "sick_leave" && (
          <p>
            The patient is advised rest from{" "}
            <strong>{data.from_date}</strong> to <strong>{data.to_date}</strong>
            {data.rest_days && <> ({data.rest_days} days)</>}.
          </p>
        )}

        {data.purpose === "fitness" && (
          <p>
            The patient is <strong>{data.is_fit ? "FIT" : "NOT FIT"}</strong> to resume 
            normal duties/work/activities.
          </p>
        )}

        {data.remarks && (
          <p>
            <strong>Remarks:</strong> {data.remarks}
          </p>
        )}
      </div>

      <div className="pt-12 flex justify-between items-end">
        <div className="text-xs">
          <p className="font-semibold" style={{ color: primaryColor }}>{data.doctor.name}</p>
          <p className="text-gray-600">{data.doctor.qualifications}</p>
          {data.doctor.registration_number && (
            <p className="text-gray-500">Reg No: {data.doctor.registration_number}</p>
          )}
        </div>
        <div className="text-right">
          <div className="border-t border-gray-300 pt-1 inline-block px-8">
            <p className="text-xs text-gray-500">Doctor's Signature & Seal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function DocumentPreview({
  style,
  branding,
  documentType,
  data,
  scale = 1,
  showWatermark = false,
}: DocumentPreviewProps) {
  const primaryColor = branding.primary_color || "#007C7C";
  
  // Use sample data if not provided
  const prescriptionData = documentType === "prescription" 
    ? (data as PrescriptionData) || SAMPLE_PRESCRIPTION_DATA 
    : null;
  const invoiceData = documentType === "invoice" 
    ? (data as InvoiceData) || SAMPLE_INVOICE_DATA 
    : null;
  const certificateData = documentType === "medical_certificate" 
    ? (data as MedicalCertificateData) || SAMPLE_CERTIFICATE_DATA 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white shadow-xl rounded-lg overflow-hidden"
      style={{
        width: 210 * scale * 2.5,
        height: 297 * scale * 2.5,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {/* Decorative elements based on style */}
      {style === "classic" && <ClassicDecorations primaryColor={primaryColor} />}
      {style === "modern" && <ModernDecorations primaryColor={primaryColor} logoUrl={branding.logo_url} />}
      {style === "minimal" && <MinimalDecorations primaryColor={primaryColor} />}

      {/* Content area */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header */}
        <DocumentHeader style={style} branding={branding} />

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {documentType === "prescription" && prescriptionData && (
            <PrescriptionContent data={prescriptionData} branding={branding} />
          )}
          {documentType === "invoice" && invoiceData && (
            <InvoiceContent data={invoiceData} branding={branding} />
          )}
          {documentType === "medical_certificate" && certificateData && (
            <CertificateContent data={certificateData} branding={branding} />
          )}
        </div>

        {/* Footer */}
        <DocumentFooter style={style} branding={branding} />
      </div>

      {/* Draft watermark */}
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-6xl font-bold text-gray-200 rotate-[-30deg]">
            PREVIEW
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default DocumentPreview;
