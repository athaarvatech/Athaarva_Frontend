"use client";

/**
 * LabReportTemplate - Phase 5: Clinical Document Branding
 * 
 * A comprehensive lab report template including:
 * - Hospital header with branding
 * - Patient and sample information
 * - Test results with normal ranges
 * - Pathologist signature
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  BaseDocumentTemplate,
  DoctorInfoSection,
  SectionTitle,
} from "./BaseDocumentTemplate";
import {
  LabReportData,
  LabTestResult,
  DocumentHeaderConfig,
  DocumentFooterConfig,
  DocumentStyleConfig,
} from "./types";
import { TestTube, User, FlaskConical, AlertTriangle } from "lucide-react";

interface LabReportTemplateProps {
  data: LabReportData;
  headerConfig?: Partial<DocumentHeaderConfig>;
  footerConfig?: Partial<DocumentFooterConfig>;
  styleConfig?: Partial<DocumentStyleConfig>;
  className?: string;
  printMode?: boolean;
}

export const LabReportTemplate = forwardRef<HTMLDivElement, LabReportTemplateProps>(
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
    const { hospital, patient, metadata, tests } = data;
    const primaryColor = styleConfig?.primaryColor || hospital.primaryColor || "#007C7C";

    const formatDateTime = (date: Date) => {
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const getStatusColor = (status?: LabTestResult["status"]) => {
      switch (status) {
        case "high":
          return "text-red-600 bg-red-50";
        case "low":
          return "text-blue-600 bg-blue-50";
        case "critical":
          return "text-red-700 bg-red-100 font-bold";
        default:
          return "text-gray-900";
      }
    };

    const getStatusIndicator = (status?: LabTestResult["status"]) => {
      switch (status) {
        case "high":
          return "↑ H";
        case "low":
          return "↓ L";
        case "critical":
          return "!! C";
        default:
          return "";
      }
    };

    // Check if any tests are critical
    const hasCriticalResults = tests.some((test) => test.status === "critical");

    return (
      <BaseDocumentTemplate
        ref={ref}
        hospital={hospital}
        headerConfig={{
          ...headerConfig,
          headerHeight: 80,
        }}
        footerConfig={{
          ...footerConfig,
          disclaimerText: "This report is computer-generated. Values marked as critical require immediate medical attention.",
        }}
        styleConfig={styleConfig}
        documentId={metadata.documentId}
        documentType="lab_report"
        className={className}
        printMode={printMode}
      >
        {/* Document Title */}
        <div className="text-center mb-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <TestTube className="w-5 h-5" style={{ color: primaryColor }} />
            <h2 className="text-lg font-bold" style={{ color: primaryColor }}>
              LABORATORY REPORT
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Lab No: {data.labNumber}
          </p>
        </div>

        {/* Critical Alert */}
        {hasCriticalResults && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 font-medium">
              CRITICAL VALUES DETECTED - Please contact physician immediately
            </span>
          </div>
        )}

        {/* Patient & Sample Info */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Patient Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient Information
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-900">{patient.name}</span></p>
              <p>Age/Gender: {patient.age} years / {patient.gender}</p>
              <p>Patient ID: {patient.patientId}</p>
              {patient.phone && <p>Phone: {patient.phone}</p>}
            </div>
          </div>

          {/* Sample Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              Sample Information
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Sample Type:</span> {data.sampleType}</p>
              <p><span className="font-medium">Collected:</span> {formatDateTime(data.sampleCollectedAt)}</p>
              {data.sampleReceivedAt && (
                <p><span className="font-medium">Received:</span> {formatDateTime(data.sampleReceivedAt)}</p>
              )}
              <p><span className="font-medium">Reported:</span> {formatDateTime(data.reportGeneratedAt)}</p>
            </div>
          </div>
        </div>

        {/* Referring Doctor */}
        {data.referringDoctor && (
          <div className="text-sm text-gray-600 mb-4 p-2 bg-blue-50 rounded">
            <span className="font-medium">Referred by:</span> Dr. {data.referringDoctor.name} ({data.referringDoctor.specialization})
          </div>
        )}

        {/* Test Results Table */}
        <div className="mb-4">
          <SectionTitle icon={<TestTube className="w-4 h-4" />} primaryColor={primaryColor}>
            Test Results
          </SectionTitle>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr
                className="text-left text-xs uppercase"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                <th className="py-2 px-3 rounded-tl">Test Name</th>
                <th className="py-2 px-3">Result</th>
                <th className="py-2 px-3">Unit</th>
                <th className="py-2 px-3">Normal Range</th>
                <th className="py-2 px-3 rounded-tr text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-b border-gray-100",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  )}
                >
                  <td className="py-2 px-3">
                    <div className="font-medium text-gray-900">{test.testName}</div>
                    {test.testCode && (
                      <div className="text-xs text-gray-500">Code: {test.testCode}</div>
                    )}
                  </td>
                  <td className={cn("py-2 px-3 font-medium", getStatusColor(test.status))}>
                    {test.result}
                  </td>
                  <td className="py-2 px-3 text-gray-600">{test.unit || "-"}</td>
                  <td className="py-2 px-3 text-gray-600">{test.normalRange || "-"}</td>
                  <td className="py-2 px-3 text-center">
                    {test.status && test.status !== "normal" && (
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded text-xs font-medium",
                          getStatusColor(test.status)
                        )}
                      >
                        {getStatusIndicator(test.status)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Method Information */}
        {tests.some((test) => test.method) && (
          <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
            <strong>Methods:</strong>{" "}
            {tests
              .filter((test) => test.method)
              .map((test) => `${test.testName}: ${test.method}`)
              .join("; ")}
          </div>
        )}

        {/* Interpretation */}
        {data.interpretation && (
          <div className="mb-4">
            <SectionTitle primaryColor={primaryColor}>
              Interpretation
            </SectionTitle>
            <p className="text-sm text-gray-700 p-3 bg-yellow-50 border border-yellow-200 rounded">
              {data.interpretation}
            </p>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
            <strong className="text-gray-700">Notes:</strong>{" "}
            <span className="text-gray-600">{data.notes}</span>
          </div>
        )}

        {/* Legend */}
        <div className="text-xs text-gray-500 mb-4 flex gap-4">
          <span><span className="text-red-600 font-medium">↑ H</span> = High</span>
          <span><span className="text-blue-600 font-medium">↓ L</span> = Low</span>
          <span><span className="text-red-700 font-bold">!! C</span> = Critical</span>
        </div>

        {/* Signatures */}
        <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
          {/* Lab Technician */}
          {data.labTechnician && (
            <div className="text-left">
              <div className="w-32 border-b border-gray-400 mb-1"></div>
              <p className="text-sm font-medium text-gray-700">{data.labTechnician}</p>
              <p className="text-xs text-gray-500">Lab Technician</p>
            </div>
          )}

          {/* Pathologist */}
          {data.pathologist && (
            <div className="text-right">
              {data.pathologist.signature && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.pathologist.signature}
                  alt="Pathologist Signature"
                  className="h-10 ml-auto mb-1"
                />
              )}
              <DoctorInfoSection
                doctor={data.pathologist}
                showSignature={false}
              />
            </div>
          )}
        </div>
      </BaseDocumentTemplate>
    );
  }
);

LabReportTemplate.displayName = "LabReportTemplate";

export default LabReportTemplate;
