"use client";

/**
 * MedicalCertificateTemplate - Phase 5: Clinical Document Branding
 * 
 * A template for medical/fitness certificates including:
 * - Medical leave certificates
 * - Fitness certificates
 * - Custom certificates
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  BaseDocumentTemplate,
  PatientInfoSection,
  DoctorInfoSection,
  SectionTitle,
} from "./BaseDocumentTemplate";
import {
  MedicalCertificateData,
  DocumentHeaderConfig,
  DocumentFooterConfig,
  DocumentStyleConfig,
} from "./types";
import { FileCheck, Calendar, Clock } from "lucide-react";

interface MedicalCertificateTemplateProps {
  data: MedicalCertificateData;
  headerConfig?: Partial<DocumentHeaderConfig>;
  footerConfig?: Partial<DocumentFooterConfig>;
  styleConfig?: Partial<DocumentStyleConfig>;
  className?: string;
  printMode?: boolean;
}

export const MedicalCertificateTemplate = forwardRef<HTMLDivElement, MedicalCertificateTemplateProps>(
  (
    {
      data,
      headerConfig,
      footerConfig,
      styleConfig,
      className,
      printMode = false,
    },
    ref
  ) => {
    const { hospital, doctor, patient, metadata } = data;
    const primaryColor = styleConfig?.primaryColor || hospital.primaryColor || "#007C7C";

    const getCertificateTitle = () => {
      switch (data.certificateType) {
        case "medical_leave":
          return "MEDICAL LEAVE CERTIFICATE";
        case "fitness":
          return "FITNESS CERTIFICATE";
        case "disability":
          return "DISABILITY CERTIFICATE";
        case "vaccination":
          return "VACCINATION CERTIFICATE";
        default:
          return "MEDICAL CERTIFICATE";
      }
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    return (
      <BaseDocumentTemplate
        ref={ref}
        hospital={hospital}
        headerConfig={headerConfig}
        footerConfig={{
          ...footerConfig,
          disclaimerText: "This certificate is issued based on the clinical examination conducted by the undersigned physician.",
        }}
        styleConfig={styleConfig}
        documentId={metadata.documentId}
        documentType="medical_certificate"
        className={className}
        printMode={printMode}
      >
        {/* Certificate Title */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <FileCheck className="w-5 h-5" style={{ color: primaryColor }} />
            <h2 className="text-lg font-bold" style={{ color: primaryColor }}>
              {getCertificateTitle()}
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Certificate No: {metadata.documentId}
          </p>
        </div>

        {/* Issue Date */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Date: {formatDate(data.issueDate)}</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-sm leading-relaxed text-gray-800 mb-4">
            <span className="font-medium">To Whom It May Concern,</span>
          </p>

          <p className="text-sm leading-relaxed text-gray-800 mb-4">
            This is to certify that{" "}
            <span className="font-semibold">{patient.name}</span>,{" "}
            aged <span className="font-semibold">{patient.age} years</span>,{" "}
            <span className="font-semibold">{patient.gender}</span>,{" "}
            {patient.address && (
              <>
                residing at <span className="font-semibold">{patient.address}</span>,{" "}
              </>
            )}
            Patient ID: <span className="font-semibold">{patient.patientId}</span>,{" "}
            was examined by me on{" "}
            <span className="font-semibold">{formatDate(data.issueDate)}</span>.
          </p>

          {/* Medical Leave Certificate Content */}
          {data.certificateType === "medical_leave" && data.leaveFrom && data.leaveTo && (
            <>
              <p className="text-sm leading-relaxed text-gray-800 mb-4">
                Based on my examination, the patient is suffering from{" "}
                <span className="font-semibold">{data.diagnosis || "the mentioned condition"}</span>{" "}
                and requires medical rest.
              </p>
              <div
                className="p-4 rounded-lg mb-4"
                style={{ backgroundColor: `${primaryColor}10`, borderLeft: `4px solid ${primaryColor}` }}
              >
                <p className="text-sm text-gray-800">
                  <strong>Period of Leave:</strong> From{" "}
                  <span className="font-semibold">{formatDate(data.leaveFrom)}</span> to{" "}
                  <span className="font-semibold">{formatDate(data.leaveTo)}</span>
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  <strong>Total Days:</strong>{" "}
                  <span className="font-semibold">{data.totalDays} day(s)</span>
                </p>
              </div>
            </>
          )}

          {/* Fitness Certificate Content */}
          {data.certificateType === "fitness" && (
            <>
              <p className="text-sm leading-relaxed text-gray-800 mb-4">
                After thorough examination, I certify that the patient is{" "}
                <span className="font-bold text-green-700">FIT</span> for{" "}
                <span className="font-semibold">{data.fitFor || "duty"}</span>.
              </p>
              {data.validUntil && (
                <div
                  className="p-4 rounded-lg mb-4"
                  style={{ backgroundColor: `${primaryColor}10`, borderLeft: `4px solid ${primaryColor}` }}
                >
                  <p className="text-sm text-gray-800">
                    <strong>Valid Until:</strong>{" "}
                    <span className="font-semibold">{formatDate(data.validUntil)}</span>
                  </p>
                </div>
              )}
              {data.restrictions && data.restrictions.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Restrictions (if any):</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {data.restrictions.map((restriction, index) => (
                      <li key={index}>{restriction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Custom Certificate Content */}
          {data.certificateType === "custom" && data.customContent && (
            <div
              className="text-sm leading-relaxed text-gray-800 mb-4"
              dangerouslySetInnerHTML={{ __html: data.customContent }}
            />
          )}

          {/* Purpose */}
          <p className="text-sm leading-relaxed text-gray-800 mb-4">
            <strong>Purpose:</strong> {data.purpose}
          </p>

          {/* Remarks */}
          {data.remarks && (
            <p className="text-sm leading-relaxed text-gray-800 mb-4">
              <strong>Remarks:</strong> {data.remarks}
            </p>
          )}

          <p className="text-sm leading-relaxed text-gray-800">
            This certificate is issued upon the request of the patient/guardian for the above-mentioned purpose.
          </p>
        </div>

        {/* Doctor Signature */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <DoctorInfoSection
            doctor={doctor}
            showSignature={true}
            signatureUrl={doctor.signature}
          />
        </div>
      </BaseDocumentTemplate>
    );
  }
);

MedicalCertificateTemplate.displayName = "MedicalCertificateTemplate";

export default MedicalCertificateTemplate;
