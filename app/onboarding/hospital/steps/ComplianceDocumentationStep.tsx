/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Shield,
  User,
  Phone,
  Mail,
  AlertCircle,
  X,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { HelpPopover } from "../widgets/HelpPopover";
import { DocumentChecklist } from "../widgets/DocumentChecklist";
import { FileUploadZone } from "../widgets/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ConsentTemplate {
  id: string;
  type: string;
  url: string;
  file?: File;
}

export default function ComplianceDocumentationStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [showTemplateUpload, setShowTemplateUpload] = useState(false);
  const [newTemplateType, setNewTemplateType] = useState("");

  // Safety checks
  const compliance = data.compliance || {
    documents: [],
    dpo_contact: {
      name: "",
      email: "",
      phone: "",
    },
    consent_templates: [],
  };

  const documents = Array.isArray(compliance.documents)
    ? compliance.documents
    : [];
  const dpoContact = compliance.dpo_contact || {
    name: "",
    email: "",
    phone: "",
  };
  const consentTemplates = Array.isArray(compliance.consent_templates)
    ? compliance.consent_templates
    : [];

  // DPO Contact update
  const updateDPOContact = (field: string, value: string) => {
    updateData("compliance", {
      ...compliance,
      dpo_contact: {
        ...dpoContact,
        [field]: value,
      },
    } as any);
  };

  // Consent template management
  const addConsentTemplate = (type: string, fileUrl: string) => {
    const newTemplate: ConsentTemplate = {
      id: `template_${Date.now()}`,
      type,
      url: fileUrl,
    };

    updateData("compliance", {
      ...compliance,
      consent_templates: [...consentTemplates, newTemplate],
    } as any);

    setShowTemplateUpload(false);
    setNewTemplateType("");
  };

  const removeConsentTemplate = (id: string) => {
    updateData("compliance", {
      ...compliance,
      consent_templates: consentTemplates.filter(
        (t: ConsentTemplate) => t.id !== id
      ),
    } as any);
  };

  const consentTypeOptions = [
    "General Treatment Consent",
    "Surgical Procedure Consent",
    "Anesthesia Consent",
    "Data Privacy Consent",
    "Telehealth Consent",
    "Research Participation",
    "Photography/Recording",
    "Financial Responsibility",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Compliance & Documentation
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Upload compliance documents, assign Data Protection Officer, and
          provide consent templates
        </p>
      </div>

      {/* Document Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Compliance Documents</Label>
          <HelpPopover
            title="Required Documents"
            content="Upload all required compliance documents including accreditation, licenses, and insurance certificates"
          />
        </div>

        <DocumentChecklist
          documents={documents}
          requiredTypes={[
            "Hospital Accreditation",
            "Medical License",
            "Insurance Certificate",
            "Fire Safety Certificate",
            "Biomedical Waste Authorization",
          ]}
          onUpload={(type: string) => console.log("Upload document:", type)}
          onRemove={(id: string) => {
            updateData("compliance", {
              ...compliance,
              documents: documents.filter((d: any) => d.id !== id),
            } as any);
          }}
        />
      </div>

      {/* Data Protection Officer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            Data Protection Officer (DPO)
          </Label>
          <HelpPopover
            title="Data Protection Officer"
            content="Designate a person responsible for data protection compliance and patient privacy"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-healthcare-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                DPO Contact Information
              </h4>
              <p className="text-sm text-gray-600">
                Required for GDPR/data privacy compliance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={dpoContact.name}
                  onChange={(e) => updateDPOContact("name", e.target.value)}
                  placeholder="John Doe"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  value={dpoContact.email}
                  onChange={(e) => updateDPOContact("email", e.target.value)}
                  placeholder="dpo@hospital.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="tel"
                  value={dpoContact.phone}
                  onChange={(e) => updateDPOContact("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            Consent Form Templates
          </Label>
          <Button
            onClick={() => setShowTemplateUpload(true)}
            size="sm"
            className="bg-healthcare-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>

        {/* Upload New Template */}
        {showTemplateUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                Upload Consent Template
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTemplateUpload(false);
                  setNewTemplateType("");
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Consent Type *</Label>
              <select
                value={newTemplateType}
                onChange={(e) => setNewTemplateType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-healthcare-primary focus:border-transparent"
              >
                <option value="">Select consent type</option>
                {consentTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {newTemplateType && (
              <FileUploadZone
                onFileSelect={(file) => console.log("File selected:", file)}
                onUploadComplete={(url) => {
                  addConsentTemplate(newTemplateType, url);
                }}
                accept=".pdf,.doc,.docx"
                maxSizeMB={10}
                label="Upload consent form (PDF or Word, max 10MB)"
              />
            )}
          </motion.div>
        )}

        {/* Template List */}
        <AnimatePresence>
          {consentTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{template.type}</h5>
                  <p className="text-sm text-gray-500">Document uploaded</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(template.url, "_blank")}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeConsentTemplate(template.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {consentTemplates.length === 0 && !showTemplateUpload && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              No consent templates uploaded yet
            </p>
            <Button
              onClick={() => setShowTemplateUpload(true)}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload First Template
            </Button>
          </div>
        )}
      </div>

      {/* Compliance Status Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">
              Compliance Checklist
            </h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    documents.length > 0 ? "bg-green-500" : "bg-gray-300"
                  )}
                />
                Compliance documents uploaded ({documents.length})
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    dpoContact.name && dpoContact.email && dpoContact.phone
                      ? "bg-green-500"
                      : "bg-gray-300"
                  )}
                />
                DPO contact information complete
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    consentTemplates.length > 0 ? "bg-green-500" : "bg-gray-300"
                  )}
                />
                Consent templates uploaded ({consentTemplates.length})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
