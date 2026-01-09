"use client";

import { useState } from "react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, X, FileText, Award, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/lib/toast";

interface License {
  id: string;
  name: string;
  certificate_file?: File | string;
  certificate_file_name?: string;
}

const COMMON_LICENSES = [
  "HID (Healthcare Information Directory)",
  "ISO 9001:2015 (Quality Management)",
  "NABH (National Accreditation Board)",
  "JCI (Joint Commission International)",
  "NABL (Laboratory Accreditation)",
  "AERB (Atomic Energy Regulatory Board)",
  "PCPNDT Registration",
  "Biomedical Waste Authorization",
  "Fire Safety Certificate",
  "Building Plan Approval",
];

export default function LicensingCertificationStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [licenses, setLicenses] = useState<License[]>(
    data.licenses && data.licenses.length > 0
      ? data.licenses.map((l: any) => ({
          id: l.id,
          name: l.name,
          certificate_file: l.certificate_file,
          certificate_file_name: l.certificate_file_name,
        }))
      : [
          {
            id: crypto.randomUUID(),
            name: "",
          },
        ]
  );

  const addLicense = () => {
    const newLicense: License = {
      id: crypto.randomUUID(),
      name: "",
    };
    const updated = [...licenses, newLicense];
    setLicenses(updated);
    updateData("licenses", updated);
  };

  const removeLicense = (id: string) => {
    const updated = licenses.filter((l) => l.id !== id);
    setLicenses(updated);
    updateData("licenses", updated);
  };

  const updateLicense = (id: string, field: keyof License, value: any) => {
    const updated = licenses.map((l) =>
      l.id === id ? { ...l, [field]: value } : l
    );
    setLicenses(updated);
    updateData("licenses", updated);
  };

  const handleFileUpload = async (id: string, file: File) => {
    if (!file) {
      toast.error({ title: "No file selected", description: "Please select a file to upload" });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error({ 
        title: "File too large", 
        description: "Maximum file size is 10MB. Please compress or select a smaller file." 
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error({ 
        title: "Invalid file type", 
        description: "Please upload a PDF, JPEG, or PNG file" 
      });
      return;
    }

    try {
      const updated = licenses.map((l) =>
        l.id === id
          ? { ...l, certificate_file: file, certificate_file_name: file.name }
          : l
      );
      setLicenses(updated);
      updateData("licenses", updated);
      toast.uploaded(file.name);
    } catch (error) {
      console.error("File upload error:", error);
      toast.error({ 
        title: "Upload failed", 
        description: "Failed to upload file. Please try again." 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4"
      >
        <div className="bg-teal-100 p-3 rounded-lg">
          <Award className="w-6 h-6 text-teal-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Licensing & Certification
          </h2>
          <p className="text-slate-600 mt-1">
            Add your hospital&apos;s licenses and certifications. These will be
            displayed in the &quot;License&quot; dropdown on your website navbar.
          </p>
        </div>
      </motion.div>

      {/* Licenses List */}
      <div className="space-y-4">
        {licenses.map((license, index) => (
          <motion.div
            key={license.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-5 border-2 hover:border-teal-200 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900">
                  Certificate #{index + 1}
                </h3>
                {licenses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLicense(license.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* License Name */}
                <div>
                  <Label htmlFor={`name-${license.id}`}>
                    Certificate Name <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={license.name}
                    onValueChange={(value) =>
                      updateLicense(license.id, "name", value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select certificate" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_LICENSES.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Certificate Upload with Enhanced Preview */}
                <div>
                  <Label>Upload PDF <span className="text-red-500">*</span></Label>
                  <div className="mt-1.5">
                    <AnimatePresence mode="wait">
                      {license.certificate_file ? (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          className="border-2 border-emerald-300 bg-emerald-50/50 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                              <FileText className="w-6 h-6 text-emerald-600" />
                              <motion.div
                                className="absolute inset-0 bg-emerald-200/50"
                                animate={{ y: ['100%', '-100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <p className="text-sm font-medium text-slate-700 truncate">
                                  {license.certificate_file_name || "Certificate uploaded"}
                                </p>
                              </div>
                              <p className="text-xs text-slate-500">PDF document ready</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                updateLicense(license.id, "certificate_file", undefined);
                                updateLicense(license.id, "certificate_file_name", undefined);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          className="border-2 border-dashed border-slate-300 rounded-lg hover:border-teal-400 transition-colors"
                        >
                          <label className="cursor-pointer block p-6 text-center">
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(license.id, file);
                              }}
                            />
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm font-medium text-slate-700">Click to upload</p>
                              <p className="text-xs text-slate-400 mt-1">PDF only, max 10MB</p>
                            </motion.div>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add License Button */}
      <Button
        variant="outline"
        onClick={addLicense}
        className="w-full border-dashed border-2 hover:border-teal-400 hover:bg-teal-50"
      >
        + Add Another Certificate
      </Button>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> Certificates will appear in a &quot;License&quot;
            dropdown next to &quot;Contact&quot; in your website navbar. Patients can
            click to view the full certificate PDF.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
