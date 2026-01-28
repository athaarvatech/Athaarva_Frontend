"use client";

/**
 * DischargeTemplate - Phase 5: Clinical Document Branding
 * 
 * A comprehensive discharge summary template including:
 * - Admission and discharge details
 * - Diagnosis and treatment summary
 * - Medications and follow-up instructions
 * - Investigation results
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
  DischargeSummaryData,
  DocumentHeaderConfig,
  DocumentFooterConfig,
  DocumentStyleConfig,
} from "./types";
import {
  FileText,
  Calendar,
  Clock,
  Stethoscope,
  Pill,
  AlertTriangle,
  Activity,
  Building2,
} from "lucide-react";

interface DischargeTemplateProps {
  data: DischargeSummaryData;
  headerConfig?: Partial<DocumentHeaderConfig>;
  footerConfig?: Partial<DocumentFooterConfig>;
  styleConfig?: Partial<DocumentStyleConfig>;
  className?: string;
  printMode?: boolean;
}

export const DischargeTemplate = forwardRef<HTMLDivElement, DischargeTemplateProps>(
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
    const { hospital, patient, metadata } = data;
    const primaryColor = styleConfig?.primaryColor || hospital.primaryColor || "#007C7C";

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    const formatDateTime = (date: Date) => {
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Calculate length of stay
    const lengthOfStay = Math.ceil(
      (data.dischargeDate.getTime() - data.admissionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Discharge type badge colors
    const dischargeTypeBadge = {
      Normal: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
      LAMA: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
      Absconded: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
      Transfer: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
      Expired: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
    };

    const badge = dischargeTypeBadge[data.dischargeType] || dischargeTypeBadge.Normal;

    return (
      <BaseDocumentTemplate
        ref={ref}
        hospital={hospital}
        headerConfig={headerConfig}
        footerConfig={{
          ...footerConfig,
          showPageNumber: true,
        }}
        styleConfig={styleConfig}
        documentId={metadata.documentId}
        documentType="discharge_summary"
        className={className}
        printMode={printMode}
      >
        {/* Document Title */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold" style={{ color: primaryColor }}>
            DISCHARGE SUMMARY
          </h2>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-600">
            <span>Document ID: {metadata.documentId}</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium border",
                badge.bg,
                badge.text,
                badge.border
              )}
            >
              {data.dischargeType}
            </span>
          </div>
        </div>

        {/* Admission Details */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Admission Details
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Date:</span> {formatDateTime(data.admissionDate)}</p>
              <p><span className="font-medium">Type:</span> {data.admissionType}</p>
              {data.ward && <p><span className="font-medium">Ward:</span> {data.ward}</p>}
              {data.roomNumber && <p><span className="font-medium">Room:</span> {data.roomNumber}</p>}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Discharge Details
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Date:</span> {formatDateTime(data.dischargeDate)}</p>
              <p><span className="font-medium">Type:</span> {data.dischargeType}</p>
              <p><span className="font-medium">Length of Stay:</span> {lengthOfStay} day(s)</p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <PatientInfoSection patient={patient} className="mb-4" />

        {/* Attending Doctors */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Attending Physicians</span>
          </div>
          <p className="text-gray-700">
            <span className="font-medium">Admitting Doctor:</span> Dr. {data.admittingDoctor.name} ({data.admittingDoctor.specialization})
          </p>
          {data.consultingDoctors && data.consultingDoctors.length > 0 && (
            <p className="text-gray-600 mt-1">
              <span className="font-medium">Consulting:</span>{" "}
              {data.consultingDoctors.map((d) => `Dr. ${d.name}`).join(", ")}
            </p>
          )}
        </div>

        {/* Chief Complaints */}
        <div className="mb-4">
          <SectionTitle icon={<AlertTriangle className="w-4 h-4" />} primaryColor={primaryColor}>
            Chief Complaints
          </SectionTitle>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {data.chiefComplaints.map((complaint, index) => (
              <li key={index}>{complaint}</li>
            ))}
          </ul>
        </div>

        {/* History of Present Illness */}
        <div className="mb-4">
          <SectionTitle icon={<FileText className="w-4 h-4" />} primaryColor={primaryColor}>
            History of Present Illness
          </SectionTitle>
          <p className="text-sm text-gray-700">{data.historyOfPresentIllness}</p>
        </div>

        {/* Past Medical History */}
        {data.pastMedicalHistory && (
          <div className="mb-4">
            <SectionTitle primaryColor={primaryColor}>Past Medical History</SectionTitle>
            <p className="text-sm text-gray-700">{data.pastMedicalHistory}</p>
          </div>
        )}

        {/* Clinical Findings */}
        <div className="mb-4">
          <SectionTitle icon={<Activity className="w-4 h-4" />} primaryColor={primaryColor}>
            Clinical Findings
          </SectionTitle>
          <p className="text-sm text-gray-700">{data.clinicalFindings}</p>
        </div>

        {/* Diagnosis */}
        <div className="mb-4">
          <SectionTitle icon={<Stethoscope className="w-4 h-4" />} primaryColor={primaryColor}>
            Diagnosis
          </SectionTitle>
          <div className="text-sm text-gray-700">
            <p className="font-medium">Primary: {data.diagnosis.primary}</p>
            {data.diagnosis.secondary && data.diagnosis.secondary.length > 0 && (
              <p className="mt-1">
                <span className="text-gray-500">Secondary:</span>{" "}
                {data.diagnosis.secondary.join(", ")}
              </p>
            )}
            {data.diagnosis.icdCodes && data.diagnosis.icdCodes.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                ICD Codes: {data.diagnosis.icdCodes.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Investigations */}
        {data.investigations && data.investigations.length > 0 && (
          <div className="mb-4">
            <SectionTitle primaryColor={primaryColor}>Investigations</SectionTitle>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 text-left text-gray-700 font-medium">Test</th>
                  <th className="py-2 px-3 text-left text-gray-700 font-medium">Date</th>
                  <th className="py-2 px-3 text-left text-gray-700 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {data.investigations.map((inv, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-gray-700">{inv.name}</td>
                    <td className="py-2 px-3 text-gray-600">{formatDate(inv.date)}</td>
                    <td className="py-2 px-3 text-gray-700">{inv.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Treatment Given */}
        <div className="mb-4">
          <SectionTitle primaryColor={primaryColor}>Treatment Given</SectionTitle>
          <p className="text-sm text-gray-700">{data.treatmentGiven}</p>
        </div>

        {/* Procedures Performed */}
        {data.proceduresPerformed && data.proceduresPerformed.length > 0 && (
          <div className="mb-4">
            <SectionTitle primaryColor={primaryColor}>Procedures Performed</SectionTitle>
            <div className="space-y-2">
              {data.proceduresPerformed.map((proc, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  <p className="font-medium text-gray-800">{proc.name}</p>
                  <p className="text-gray-600">
                    Date: {formatDate(proc.date)}
                    {proc.surgeon && ` | Surgeon: ${proc.surgeon}`}
                  </p>
                  {proc.notes && <p className="text-gray-500 text-xs mt-1">{proc.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Condition at Discharge */}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-semibold text-green-800 mb-1">Condition at Discharge</h4>
          <p className="text-sm text-green-700">{data.conditionAtDischarge}</p>
        </div>

        {/* Discharge Medications */}
        <div className="mb-4">
          <SectionTitle icon={<Pill className="w-4 h-4" />} primaryColor={primaryColor}>
            Discharge Medications
          </SectionTitle>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: `${primaryColor}15` }}>
                <th className="py-2 px-3 text-left text-gray-700 font-medium">#</th>
                <th className="py-2 px-3 text-left text-gray-700 font-medium">Medicine</th>
                <th className="py-2 px-3 text-left text-gray-700 font-medium">Dosage</th>
                <th className="py-2 px-3 text-left text-gray-700 font-medium">Frequency</th>
                <th className="py-2 px-3 text-left text-gray-700 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {data.dischargeMedications.map((med, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-3 text-gray-500">{index + 1}</td>
                  <td className="py-2 px-3 font-medium text-gray-800">{med.name}</td>
                  <td className="py-2 px-3 text-gray-700">{med.dosage}</td>
                  <td className="py-2 px-3 text-gray-700">{med.frequency}</td>
                  <td className="py-2 px-3 text-gray-700">{med.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Diet & Activity */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {data.dietAdvice && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="text-sm font-semibold text-yellow-800 mb-1">Diet Advice</h4>
              <p className="text-sm text-yellow-700">{data.dietAdvice}</p>
            </div>
          )}
          {data.activityRestrictions && data.activityRestrictions.length > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded">
              <h4 className="text-sm font-semibold text-orange-800 mb-1">Activity Restrictions</h4>
              <ul className="text-sm text-orange-700 list-disc list-inside">
                {data.activityRestrictions.map((restriction, index) => (
                  <li key={index}>{restriction}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Follow-up Instructions */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Follow-up Instructions
          </h4>
          <p className="text-sm text-blue-700 mb-2">{data.followUpInstructions}</p>
          {data.followUpDate && (
            <p className="text-sm font-medium text-blue-800">
              Next Follow-up: {formatDate(data.followUpDate)}
            </p>
          )}
        </div>

        {/* Emergency Instructions */}
        {data.emergencyInstructions && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-semibold text-red-800 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Emergency Instructions
            </h4>
            <p className="text-sm text-red-700">{data.emergencyInstructions}</p>
          </div>
        )}

        {/* Referrals */}
        {data.referrals && data.referrals.length > 0 && (
          <div className="mb-4">
            <SectionTitle icon={<Building2 className="w-4 h-4" />} primaryColor={primaryColor}>
              Referrals
            </SectionTitle>
            <div className="space-y-2">
              {data.referrals.map((referral, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  <p className="font-medium text-gray-800">{referral.department}</p>
                  {referral.doctor && <p className="text-gray-600">Doctor: {referral.doctor}</p>}
                  <p className="text-gray-500">{referral.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Signatures */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <DoctorInfoSection
            doctor={data.admittingDoctor}
            showSignature={true}
            signatureUrl={data.admittingDoctor.signature}
          />
        </div>
      </BaseDocumentTemplate>
    );
  }
);

DischargeTemplate.displayName = "DischargeTemplate";

export default DischargeTemplate;
