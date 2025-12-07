"use client";

/**
 * =============================================================================
 * EDITABLE COMPLIANCE & DOCUMENTATION SECTION
 * =============================================================================
 * 
 * On-canvas editable component for Compliance & Documentation.
 * Features certifications, legal documents, and data protection badges.
 * 
 * =============================================================================
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Award,
  FileCheck,
  Shield,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EditableText } from "./EditableText";
import { EditableSection } from "./OnCanvasToolbar";
import type {
  ComplianceAndDocs,
  Certification,
  LegalDocument,
} from "./templateBlueprints";
import { DEFAULT_COMPLIANCE } from "./templateBlueprints";

// ============================================================================
// TYPES
// ============================================================================

export interface EditableComplianceSectionProps {
  compliance: ComplianceAndDocs | undefined;
  onUpdate: (data: ComplianceAndDocs) => void;
  isEditMode?: boolean;
  accentColor?: string;
  typography?: {
    heading: string;
    body: string;
  };
}

// ============================================================================
// CERTIFICATION BADGE COMPONENT
// ============================================================================

interface CertificationBadgeProps {
  cert: Certification;
  index: number;
  onUpdate: (updates: Partial<Certification>) => void;
  onDelete: () => void;
  isEditMode: boolean;
  accentColor: string;
}

function CertificationBadge({
  cert,
  index,
  onUpdate,
  onDelete,
  isEditMode,
  accentColor,
}: CertificationBadgeProps) {
  const isExpired = cert.validUntil
    ? new Date(cert.validUntil) < new Date()
    : false;
  const isExpiringSoon = cert.validUntil
    ? new Date(cert.validUntil) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    : false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "relative rounded-2xl border bg-white p-6 shadow-sm transition-all",
        isExpired
          ? "border-red-200 bg-red-50"
          : isExpiringSoon
          ? "border-amber-200 bg-amber-50"
          : "border-gray-200 hover:border-gray-300",
        isEditMode && "group"
      )}
    >
      {/* Status Badge */}
      {cert.validUntil && (
        <div
          className={cn(
            "absolute -top-2 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold",
            isExpired
              ? "bg-red-500 text-white"
              : isExpiringSoon
              ? "bg-amber-500 text-white"
              : "bg-green-500 text-white"
          )}
        >
          {isExpired ? "Expired" : isExpiringSoon ? "Renew Soon" : "Valid"}
        </div>
      )}

      {/* Delete Button */}
      {isEditMode && (
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
          title="Remove certification"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Award className="w-6 h-6" style={{ color: accentColor }} />
        </div>

        <div className="flex-1 space-y-2">
          {/* Certification Name */}
          {isEditMode ? (
            <EditableText
              value={cert.name}
              onChange={(val) => onUpdate({ name: val })}
              as="h4"
              className="font-semibold text-gray-900"
              placeholder="Certification Name"
              editIndicator="border"
            />
          ) : (
            <h4 className="font-semibold text-gray-900">{cert.name}</h4>
          )}

          {/* Issuing Body */}
          {isEditMode ? (
            <EditableText
              value={cert.issuingBody}
              onChange={(val) => onUpdate({ issuingBody: val })}
              as="p"
              className="text-sm text-gray-600"
              placeholder="Issuing Authority"
              editIndicator="none"
            />
          ) : (
            <p className="text-sm text-gray-600">{cert.issuingBody}</p>
          )}

          {/* Validity Dates */}
          {(cert.validFrom || cert.validUntil) && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>
                {cert.validFrom && `From ${cert.validFrom}`}
                {cert.validFrom && cert.validUntil && " · "}
                {cert.validUntil && `Until ${cert.validUntil}`}
              </span>
            </div>
          )}

          {/* Verification Link */}
          {cert.verificationUrl && (
            <a
              href={cert.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: accentColor }}
            >
              Verify Certificate
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// LEGAL DOCUMENT CARD
// ============================================================================

interface LegalDocumentCardProps {
  doc: LegalDocument;
  index: number;
  onUpdate: (updates: Partial<LegalDocument>) => void;
  onDelete: () => void;
  isEditMode: boolean;
  accentColor: string;
}

function LegalDocumentCard({
  doc,
  index,
  onUpdate,
  onDelete,
  isEditMode,
  accentColor,
}: LegalDocumentCardProps) {
  const getDocIcon = (type: LegalDocument["type"]) => {
    switch (type) {
      case "privacy-policy":
        return <Lock className="w-5 h-5" />;
      case "terms-of-service":
        return <FileCheck className="w-5 h-5" />;
      case "consent-form":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <FileCheck className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={cn(
        "relative flex items-center gap-4 p-4 rounded-xl border bg-white transition-all",
        doc.required
          ? "border-l-4"
          : "border-gray-200 hover:border-gray-300",
        isEditMode && "group"
      )}
      style={{
        borderLeftColor: doc.required ? accentColor : undefined,
      }}
    >
      {/* Delete Button */}
      {isEditMode && (
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
          title="Remove document"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* Icon */}
      <div
        className="p-2 rounded-lg flex-shrink-0"
        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
      >
        {getDocIcon(doc.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditMode ? (
          <EditableText
            value={doc.title}
            onChange={(val) => onUpdate({ title: val })}
            as="h4"
            className="font-medium text-gray-900 truncate"
            placeholder="Document Title"
            editIndicator="border"
          />
        ) : (
          <h4 className="font-medium text-gray-900 truncate">{doc.title}</h4>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="capitalize">{doc.type.replace("-", " ")}</span>
          <span>·</span>
          <span>Updated {doc.lastUpdated}</span>
          {doc.required && (
            <>
              <span>·</span>
              <span className="text-amber-600 font-medium">Required</span>
            </>
          )}
        </div>
      </div>

      {/* View Link */}
      {doc.url && (
        <a
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          View
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </motion.div>
  );
}

// ============================================================================
// DATA PROTECTION BADGES
// ============================================================================

interface DataProtectionBadgesProps {
  dataProtection: ComplianceAndDocs["dataProtection"];
  onUpdate: (updates: Partial<ComplianceAndDocs["dataProtection"]>) => void;
  isEditMode: boolean;
  accentColor: string;
}

function DataProtectionBadges({
  dataProtection,
  onUpdate,
  isEditMode,
  accentColor,
}: DataProtectionBadgesProps) {
  const badges = [
    {
      key: "gdprCompliant" as const,
      label: "GDPR Compliant",
      description: "EU Data Protection Regulation",
      enabled: dataProtection.gdprCompliant,
    },
    {
      key: "hipaaCompliant" as const,
      label: "HIPAA Compliant",
      description: "US Healthcare Data Protection",
      enabled: dataProtection.hipaaCompliant,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {badges.map((badge) => (
        <div
          key={badge.key}
          className={cn(
            "relative p-4 rounded-xl border-2 transition-all",
            badge.enabled
              ? "border-green-500 bg-green-50"
              : "border-gray-200 bg-gray-50"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                badge.enabled ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
              )}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{badge.label}</h4>
              <p className="text-xs text-gray-500">{badge.description}</p>
            </div>
            {badge.enabled && (
              <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />
            )}
          </div>

          {/* Toggle (Edit Mode) */}
          {isEditMode && (
            <button
              onClick={() => onUpdate({ [badge.key]: !badge.enabled })}
              className={cn(
                "absolute top-2 right-2 text-xs px-2 py-1 rounded-full",
                badge.enabled
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {badge.enabled ? "Enabled" : "Enable"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EditableComplianceSection({
  compliance,
  onUpdate,
  isEditMode = true,
  accentColor = "#0E9F9F",
  typography,
}: EditableComplianceSectionProps) {
  const data = compliance || DEFAULT_COMPLIANCE;

  // Update helpers
  const updateData = useCallback(
    (updates: Partial<ComplianceAndDocs>) => {
      onUpdate({ ...data, ...updates });
    },
    [data, onUpdate]
  );

  const updateCertification = useCallback(
    (index: number, updates: Partial<Certification>) => {
      const newCerts = [...data.certifications];
      newCerts[index] = { ...newCerts[index], ...updates };
      updateData({ certifications: newCerts });
    },
    [data.certifications, updateData]
  );

  const addCertification = useCallback(() => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: "New Certification",
      issuingBody: "Issuing Authority",
    };
    updateData({ certifications: [...data.certifications, newCert] });
  }, [data.certifications, updateData]);

  const removeCertification = useCallback(
    (index: number) => {
      const newCerts = data.certifications.filter((_, i) => i !== index);
      updateData({ certifications: newCerts });
    },
    [data.certifications, updateData]
  );

  const updateDocument = useCallback(
    (index: number, updates: Partial<LegalDocument>) => {
      const newDocs = [...data.legalDocuments];
      newDocs[index] = { ...newDocs[index], ...updates };
      updateData({ legalDocuments: newDocs });
    },
    [data.legalDocuments, updateData]
  );

  const addDocument = useCallback(() => {
    const newDoc: LegalDocument = {
      id: `doc-${Date.now()}`,
      title: "New Document",
      type: "other",
      lastUpdated: new Date().toISOString().split("T")[0],
      required: false,
    };
    updateData({ legalDocuments: [...data.legalDocuments, newDoc] });
  }, [data.legalDocuments, updateData]);

  const removeDocument = useCallback(
    (index: number) => {
      const newDocs = data.legalDocuments.filter((_, i) => i !== index);
      updateData({ legalDocuments: newDocs });
    },
    [data.legalDocuments, updateData]
  );

  const handleReset = useCallback(() => {
    onUpdate(DEFAULT_COMPLIANCE);
  }, [onUpdate]);

  return (
    <EditableSection
      sectionId="compliance"
      sectionTitle="Compliance & Documentation"
      onReset={handleReset}
      isEditMode={isEditMode}
      accentColor={accentColor}
      description="Display your accreditations, certifications, and legal documents"
    >
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Shield className="w-5 h-5" style={{ color: accentColor }} />
              <span
                className="text-sm font-semibold"
                style={{ color: accentColor }}
              >
                Trust & Compliance
              </span>
            </div>
            <h2
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: typography?.heading }}
            >
              Accreditations & Certifications
            </h2>
            <p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              style={{ fontFamily: typography?.body }}
            >
              Our commitment to quality and patient safety
            </p>
          </div>

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: accentColor }} />
                  Certifications
                </h3>
                {isEditMode && (
                  <Button variant="outline" size="sm" onClick={addCertification}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certification
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {data.certifications.map((cert, index) => (
                    <CertificationBadge
                      key={cert.id}
                      cert={cert}
                      index={index}
                      onUpdate={(updates) => updateCertification(index, updates)}
                      onDelete={() => removeCertification(index)}
                      isEditMode={isEditMode}
                      accentColor={accentColor}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Data Protection */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5" style={{ color: accentColor }} />
              Data Protection
            </h3>
            <DataProtectionBadges
              dataProtection={data.dataProtection}
              onUpdate={(updates) =>
                updateData({
                  dataProtection: { ...data.dataProtection, ...updates },
                })
              }
              isEditMode={isEditMode}
              accentColor={accentColor}
            />
          </div>

          {/* Legal Documents */}
          {data.legalDocuments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FileCheck className="w-5 h-5" style={{ color: accentColor }} />
                  Legal Documents
                </h3>
                {isEditMode && (
                  <Button variant="outline" size="sm" onClick={addDocument}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Document
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {data.legalDocuments.map((doc, index) => (
                    <LegalDocumentCard
                      key={doc.id}
                      doc={doc}
                      index={index}
                      onUpdate={(updates) => updateDocument(index, updates)}
                      onDelete={() => removeDocument(index)}
                      isEditMode={isEditMode}
                      accentColor={accentColor}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Empty State */}
          {data.certifications.length === 0 &&
            data.legalDocuments.length === 0 &&
            isEditMode && (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
                <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No compliance information yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Add your certifications and legal documents
                </p>
                <div className="flex justify-center gap-3">
                  <Button onClick={addCertification}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certification
                  </Button>
                  <Button variant="outline" onClick={addDocument}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Document
                  </Button>
                </div>
              </div>
            )}
        </div>
      </section>
    </EditableSection>
  );
}

export default EditableComplianceSection;
