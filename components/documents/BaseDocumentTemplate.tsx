"use client";

/**
 * BaseDocumentTemplate - Phase 5: Clinical Document Branding
 * 
 * A reusable base template component for all clinical documents.
 * Provides consistent header, body, and footer sections with
 * hospital branding applied throughout.
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import {
  HospitalBranding,
  DocumentHeaderConfig,
  DocumentFooterConfig,
  DocumentStyleConfig,
  DEFAULT_HEADER_CONFIG,
  DEFAULT_FOOTER_CONFIG,
  DEFAULT_DOCUMENT_STYLE,
} from "./types";

interface BaseDocumentTemplateProps {
  hospital: HospitalBranding;
  headerConfig?: Partial<DocumentHeaderConfig>;
  footerConfig?: Partial<DocumentFooterConfig>;
  styleConfig?: Partial<DocumentStyleConfig>;
  documentId?: string;
  documentType?: string;
  pageNumber?: number;
  totalPages?: number;
  children: React.ReactNode;
  className?: string;
  printMode?: boolean;
}

export const BaseDocumentTemplate = forwardRef<HTMLDivElement, BaseDocumentTemplateProps>(
  (
    {
      hospital,
      headerConfig: headerConfigOverride,
      footerConfig: footerConfigOverride,
      styleConfig: styleConfigOverride,
      documentId,
      documentType,
      pageNumber = 1,
      totalPages = 1,
      children,
      className,
      printMode = false,
    },
    ref
  ) => {
    const header = { ...DEFAULT_HEADER_CONFIG, ...headerConfigOverride };
    const footer = { ...DEFAULT_FOOTER_CONFIG, ...footerConfigOverride };
    const style = { ...DEFAULT_DOCUMENT_STYLE, ...styleConfigOverride };

    // Generate QR code data
    const qrData = documentId
      ? JSON.stringify({
          id: documentId,
          type: documentType,
          hospital: hospital.hospitalName,
          generated: new Date().toISOString(),
        })
      : "";

    // Calculate dimensions based on paper size
    const paperDimensions = {
      A4: { width: 210, height: 297 },
      A5: { width: 148, height: 210 },
      Letter: { width: 216, height: 279 },
      Legal: { width: 216, height: 356 },
    };

    const dimensions = paperDimensions[style.paperSize];
    const isLandscape = style.orientation === "landscape";
    const width = isLandscape ? dimensions.height : dimensions.width;
    const height = isLandscape ? dimensions.width : dimensions.height;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white shadow-lg mx-auto",
          printMode && "shadow-none",
          className
        )}
        style={{
          width: `${width}mm`,
          minHeight: `${height}mm`,
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}pt`,
          lineHeight: style.lineHeight,
          padding: `${style.margins.top}mm ${style.margins.right}mm ${style.margins.bottom}mm ${style.margins.left}mm`,
          color: "#1f2937",
        }}
      >
        {/* Document Header */}
        <DocumentHeader
          hospital={hospital}
          config={header}
          primaryColor={style.primaryColor}
        />

        {/* Document Body */}
        <div
          className="flex-1"
          style={{
            minHeight: `calc(${height}mm - ${style.margins.top}mm - ${style.margins.bottom}mm - ${header.headerHeight || 100}px - ${footer.footerHeight || 60}px)`,
          }}
        >
          {children}
        </div>

        {/* Document Footer */}
        <DocumentFooter
          config={footer}
          qrData={qrData}
          pageNumber={pageNumber}
          totalPages={totalPages}
          primaryColor={style.primaryColor}
        />
      </div>
    );
  }
);

BaseDocumentTemplate.displayName = "BaseDocumentTemplate";

// ============================================================================
// DOCUMENT HEADER COMPONENT
// ============================================================================

interface DocumentHeaderProps {
  hospital: HospitalBranding;
  config: DocumentHeaderConfig;
  primaryColor: string;
}

function DocumentHeader({ hospital, config, primaryColor }: DocumentHeaderProps) {
  const logoSizes = {
    small: { width: 40, height: 40 },
    medium: { width: 60, height: 60 },
    large: { width: 80, height: 80 },
  };
  const logoSize = logoSizes[config.logoSize];

  return (
    <div
      className="border-b-2 pb-4 mb-4"
      style={{
        borderColor: primaryColor,
        height: config.headerHeight ? `${config.headerHeight}px` : "auto",
        backgroundColor: config.headerBackground,
      }}
    >
      <div
        className={cn(
          "flex items-start gap-4",
          config.logoPosition === "center" && "flex-col items-center text-center",
          config.logoPosition === "right" && "flex-row-reverse"
        )}
      >
        {/* Logo */}
        {config.showLogo && hospital.logoUrl && (
          <img
            src={hospital.logoUrl}
            alt={hospital.hospitalName}
            style={{
              width: `${logoSize.width}px`,
              height: `${logoSize.height}px`,
              objectFit: "contain",
            }}
          />
        )}

        {/* Hospital Info */}
        <div className={cn("flex-1", config.logoPosition === "center" && "text-center")}>
          {config.showHospitalName && (
            <h1
              className="text-xl font-bold"
              style={{ color: primaryColor }}
            >
              {hospital.hospitalName}
            </h1>
          )}
          {hospital.tagline && (
            <p className="text-sm text-gray-600 italic">{hospital.tagline}</p>
          )}
          {config.showAddress && (
            <p className="text-sm text-gray-700 mt-1">
              {hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}
            </p>
          )}
          {config.showContact && (
            <p className="text-sm text-gray-600">
              Phone: {hospital.phone} | Email: {hospital.email}
              {hospital.website && ` | Web: ${hospital.website}`}
            </p>
          )}
          {config.showRegistration && hospital.registrationNumber && (
            <p className="text-xs text-gray-500 mt-1">
              Reg. No: {hospital.registrationNumber}
              {hospital.gstNumber && ` | GST: ${hospital.gstNumber}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DOCUMENT FOOTER COMPONENT
// ============================================================================

interface DocumentFooterProps {
  config: DocumentFooterConfig;
  qrData: string;
  pageNumber: number;
  totalPages: number;
  primaryColor: string;
}

function DocumentFooter({
  config,
  qrData,
  pageNumber,
  totalPages,
  primaryColor,
}: DocumentFooterProps) {
  return (
    <div
      className="border-t pt-3 mt-4"
      style={{
        borderColor: primaryColor,
        height: config.footerHeight ? `${config.footerHeight}px` : "auto",
        backgroundColor: config.footerBackground,
      }}
    >
      <div className="flex items-end justify-between">
        {/* Left side - QR Code */}
        {config.showQRCode && qrData && (
          <div className="flex-shrink-0">
            <QRCode value={qrData} size={48} level="M" />
            <p className="text-[8px] text-gray-400 mt-1 text-center">Scan to verify</p>
          </div>
        )}

        {/* Center - Disclaimer */}
        <div className="flex-1 text-center px-4">
          {config.showDisclaimer && config.disclaimerText && (
            <p className="text-[9px] text-gray-500 italic">
              {config.disclaimerText}
            </p>
          )}
          {config.showGeneratedDate && (
            <p className="text-[8px] text-gray-400 mt-1">
              Generated on: {new Date().toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {/* Right side - Page number & Signature */}
        <div className="flex-shrink-0 text-right">
          {config.showSignatureLine && (
            <div className="mb-2">
              <div className="w-24 border-b border-gray-400 mb-1"></div>
              <p className="text-[9px] text-gray-600">Authorized Signature</p>
            </div>
          )}
          {config.showPageNumber && totalPages > 1 && (
            <p className="text-[9px] text-gray-500">
              Page {pageNumber} of {totalPages}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// REUSABLE DOCUMENT SECTIONS
// ============================================================================

interface PatientInfoSectionProps {
  patient: {
    name: string;
    age: number;
    gender: string;
    patientId: string;
    bloodGroup?: string;
    phone?: string;
    address?: string;
  };
  visitDate?: Date;
  visitType?: string;
  className?: string;
}

export function PatientInfoSection({
  patient,
  visitDate,
  visitType,
  className,
}: PatientInfoSectionProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-8 gap-y-1 py-3 px-4 bg-gray-50 rounded-lg text-sm", className)}>
      <div className="flex">
        <span className="text-gray-600 w-24">Patient Name:</span>
        <span className="font-medium">{patient.name}</span>
      </div>
      <div className="flex">
        <span className="text-gray-600 w-24">Patient ID:</span>
        <span className="font-medium">{patient.patientId}</span>
      </div>
      <div className="flex">
        <span className="text-gray-600 w-24">Age / Gender:</span>
        <span className="font-medium">
          {patient.age} years / {patient.gender}
        </span>
      </div>
      {patient.bloodGroup && (
        <div className="flex">
          <span className="text-gray-600 w-24">Blood Group:</span>
          <span className="font-medium">{patient.bloodGroup}</span>
        </div>
      )}
      {patient.phone && (
        <div className="flex">
          <span className="text-gray-600 w-24">Phone:</span>
          <span className="font-medium">{patient.phone}</span>
        </div>
      )}
      {visitDate && (
        <div className="flex">
          <span className="text-gray-600 w-24">Visit Date:</span>
          <span className="font-medium">
            {visitDate.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      )}
      {visitType && (
        <div className="flex">
          <span className="text-gray-600 w-24">Visit Type:</span>
          <span className="font-medium">{visitType}</span>
        </div>
      )}
    </div>
  );
}

interface DoctorInfoSectionProps {
  doctor: {
    name: string;
    qualification: string;
    specialization: string;
    registrationNumber: string;
    department?: string;
  };
  showSignature?: boolean;
  signatureUrl?: string;
  className?: string;
}

export function DoctorInfoSection({
  doctor,
  showSignature = false,
  signatureUrl,
  className,
}: DoctorInfoSectionProps) {
  return (
    <div className={cn("text-right", className)}>
      {showSignature && signatureUrl && (
        <img
          src={signatureUrl}
          alt="Doctor's Signature"
          className="h-12 ml-auto mb-1"
        />
      )}
      <p className="font-semibold text-gray-900">{doctor.name}</p>
      <p className="text-sm text-gray-600">{doctor.qualification}</p>
      <p className="text-sm text-gray-600">{doctor.specialization}</p>
      {doctor.department && (
        <p className="text-sm text-gray-500">{doctor.department}</p>
      )}
      <p className="text-xs text-gray-500">Reg. No: {doctor.registrationNumber}</p>
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  primaryColor?: string;
}

export function SectionTitle({ children, icon, primaryColor = "#007C7C" }: SectionTitleProps) {
  return (
    <h2
      className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide mb-2 pb-1 border-b"
      style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
    >
      {icon}
      {children}
    </h2>
  );
}

export default BaseDocumentTemplate;
