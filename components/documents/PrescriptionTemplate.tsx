"use client";

/**
 * PrescriptionTemplate - Phase 5: Clinical Document Branding
 * 
 * A comprehensive prescription template component with:
 * - Hospital header with branding
 * - Patient information section
 * - Rx symbol with medicine list
 * - Diagnosis and complaints
 * - Doctor signature section
 * - QR code for verification
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
  PrescriptionData,
  DocumentHeaderConfig,
  DocumentFooterConfig,
  DocumentStyleConfig,
} from "./types";
import { Pill, Stethoscope, FileText, Calendar, AlertTriangle } from "lucide-react";

interface PrescriptionTemplateProps {
  data: PrescriptionData;
  headerConfig?: Partial<DocumentHeaderConfig>;
  footerConfig?: Partial<DocumentFooterConfig>;
  styleConfig?: Partial<DocumentStyleConfig>;
  className?: string;
  printMode?: boolean;
}

export const PrescriptionTemplate = forwardRef<HTMLDivElement, PrescriptionTemplateProps>(
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
    const { hospital, doctor, patient, medicines, metadata } = data;
    const primaryColor = styleConfig?.primaryColor || hospital.primaryColor || "#007C7C";

    return (
      <BaseDocumentTemplate
        ref={ref}
        hospital={hospital}
        headerConfig={headerConfig}
        footerConfig={footerConfig}
        styleConfig={styleConfig}
        documentId={metadata.documentId}
        documentType="prescription"
        className={className}
        printMode={printMode}
      >
        {/* Document Title */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold" style={{ color: primaryColor }}>
            PRESCRIPTION
          </h2>
        </div>

        {/* Patient Information */}
        <PatientInfoSection
          patient={patient}
          visitDate={data.visitDate}
          visitType={data.visitType}
          className="mb-4"
        />

        {/* Vital Signs (if available) */}
        {data.vitalSigns && Object.keys(data.vitalSigns).length > 0 && (
          <div className="grid grid-cols-6 gap-2 text-xs mb-4 p-2 bg-blue-50 rounded">
            {data.vitalSigns.bloodPressure && (
              <div className="text-center">
                <span className="text-gray-500 block">BP</span>
                <span className="font-medium">{data.vitalSigns.bloodPressure}</span>
              </div>
            )}
            {data.vitalSigns.pulse && (
              <div className="text-center">
                <span className="text-gray-500 block">Pulse</span>
                <span className="font-medium">{data.vitalSigns.pulse}/min</span>
              </div>
            )}
            {data.vitalSigns.temperature && (
              <div className="text-center">
                <span className="text-gray-500 block">Temp</span>
                <span className="font-medium">{data.vitalSigns.temperature}°F</span>
              </div>
            )}
            {data.vitalSigns.weight && (
              <div className="text-center">
                <span className="text-gray-500 block">Weight</span>
                <span className="font-medium">{data.vitalSigns.weight} kg</span>
              </div>
            )}
            {data.vitalSigns.height && (
              <div className="text-center">
                <span className="text-gray-500 block">Height</span>
                <span className="font-medium">{data.vitalSigns.height} cm</span>
              </div>
            )}
            {data.vitalSigns.spo2 && (
              <div className="text-center">
                <span className="text-gray-500 block">SpO2</span>
                <span className="font-medium">{data.vitalSigns.spo2}%</span>
              </div>
            )}
          </div>
        )}

        {/* Allergies Warning */}
        {data.allergies && data.allergies.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm mb-4">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-red-700">
              <strong>Known Allergies:</strong> {data.allergies.join(", ")}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Chief Complaints */}
          {data.chiefComplaints && data.chiefComplaints.length > 0 && (
            <div>
              <SectionTitle icon={<FileText className="w-4 h-4" />} primaryColor={primaryColor}>
                Chief Complaints
              </SectionTitle>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                {data.chiefComplaints.map((complaint, index) => (
                  <li key={index}>{complaint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Diagnosis */}
          {data.diagnosis && data.diagnosis.length > 0 && (
            <div>
              <SectionTitle icon={<Stethoscope className="w-4 h-4" />} primaryColor={primaryColor}>
                Diagnosis
              </SectionTitle>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                {data.diagnosis.map((dx, index) => (
                  <li key={index}>{dx}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Rx Section - Medicines */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <RxSymbol className="w-8 h-8" color={primaryColor} />
            <SectionTitle icon={<Pill className="w-4 h-4" />} primaryColor={primaryColor}>
              Medications
            </SectionTitle>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left text-xs uppercase"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                <th className="py-2 px-3 rounded-tl">#</th>
                <th className="py-2 px-3">Medicine Name</th>
                <th className="py-2 px-3">Dosage</th>
                <th className="py-2 px-3">Frequency</th>
                <th className="py-2 px-3">Duration</th>
                <th className="py-2 px-3 rounded-tr">Instructions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine, index) => (
                <tr
                  key={medicine.id || index}
                  className={cn(
                    "border-b border-gray-100",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  )}
                >
                  <td className="py-2 px-3 text-gray-500">{index + 1}</td>
                  <td className="py-2 px-3">
                    <div className="font-medium text-gray-900">{medicine.name}</div>
                    {medicine.genericName && (
                      <div className="text-xs text-gray-500">({medicine.genericName})</div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-gray-700">{medicine.dosage}</td>
                  <td className="py-2 px-3 text-gray-700">{medicine.frequency}</td>
                  <td className="py-2 px-3 text-gray-700">{medicine.duration}</td>
                  <td className="py-2 px-3 text-gray-600 text-xs">
                    {medicine.instructions || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Investigations Advised */}
        {data.investigations && data.investigations.length > 0 && (
          <div className="mb-4">
            <SectionTitle primaryColor={primaryColor}>
              Investigations Advised
            </SectionTitle>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              {data.investigations.map((investigation, index) => (
                <li key={index}>{investigation}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Advice */}
        {data.advice && data.advice.length > 0 && (
          <div className="mb-4">
            <SectionTitle primaryColor={primaryColor}>
              Advice
            </SectionTitle>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              {data.advice.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong className="text-yellow-800">Note:</strong>{" "}
            <span className="text-yellow-700">{data.notes}</span>
          </div>
        )}

        {/* Follow-up */}
        {data.followUpDate && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm mb-4">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700">
              <strong>Follow-up Date:</strong>{" "}
              {data.followUpDate.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Doctor Signature */}
        <div className="mt-6 pt-4 border-t border-gray-200">
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

PrescriptionTemplate.displayName = "PrescriptionTemplate";

// Rx Symbol SVG Component
function RxSymbol({ className, color = "#007C7C" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4h6c2.21 0 4 1.79 4 4s-1.79 4-4 4H4V4z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12h6l6 8M16 12l-4 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PrescriptionTemplate;
