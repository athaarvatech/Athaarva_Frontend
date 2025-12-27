"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  FileText,
  Clock,
  AlertTriangle,
  Pill,
  Calendar,
  Settings,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClinicalConfigStep() {
  const { data, updateData } = useHospitalOnboarding();

  const clinical = data.clinical;

  // Update clinical config sections
  const updateClinical = (
    section: keyof typeof clinical,
    updates: Record<string, unknown>
  ) => {
    const currentSection = clinical?.[section];
    updateData("clinical", {
      ...clinical,
      [section]: {
        ...(typeof currentSection === "object" && currentSection !== null
          ? currentSection
          : {}),
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/10 to-cyan-100 border border-blue-200 rounded-lg p-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Clinical Configuration
            </h3>
            <p className="text-sm text-gray-600">
              Configure prescription formats, medical coding, consultation
              parameters, and clinical alerts
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="prescription" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prescription">Prescription</TabsTrigger>
          <TabsTrigger value="coding">Medical Coding</TabsTrigger>
          <TabsTrigger value="consultation">Consultation</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Prescription Configuration Tab */}
        <TabsContent value="prescription" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Pill className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">
                Prescription Settings
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Default Prescription Language</Label>
                <Select
                  value={
                    clinical?.prescription_config
                      ?.default_prescription_language || "english"
                  }
                  onValueChange={(v) =>
                    updateClinical("prescription_config", {
                      default_prescription_language: v,
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="regional">Regional Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Prescription Format</Label>
                <Select
                  value={
                    clinical?.prescription_config?.prescription_format ||
                    "standard"
                  }
                  onValueChange={(v) =>
                    updateClinical("prescription_config", {
                      prescription_format: v,
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="branded">Branded Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Dosage Instructions Language</Label>
                <Select
                  value={
                    clinical?.prescription_config?.default_dosage_language ||
                    "english"
                  }
                  onValueChange={(v) =>
                    updateClinical("prescription_config", {
                      default_dosage_language: v,
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="bilingual">Bilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Default Validity (Days)</Label>
                <Input
                  type="number"
                  value={
                    clinical?.prescription_config?.default_validity_days || 30
                  }
                  onChange={(e) =>
                    updateClinical("prescription_config", {
                      default_validity_days: parseInt(e.target.value),
                    })
                  }
                  className="mt-1"
                  min={1}
                  max={365}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">
                    Show Generic Name
                  </Label>
                  <p className="text-xs text-gray-500">
                    Display generic drug names
                  </p>
                </div>
                <Switch
                  checked={
                    clinical?.prescription_config?.show_generic_name ?? true
                  }
                  onCheckedChange={(v) =>
                    updateClinical("prescription_config", {
                      show_generic_name: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">
                    Show Brand Suggestion
                  </Label>
                  <p className="text-xs text-gray-500">
                    Suggest brand alternatives
                  </p>
                </div>
                <Switch
                  checked={
                    clinical?.prescription_config?.show_brand_suggestion ?? true
                  }
                  onCheckedChange={(v) =>
                    updateClinical("prescription_config", {
                      show_brand_suggestion: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">
                    Include Diagnosis
                  </Label>
                  <p className="text-xs text-gray-500">Show diagnosis on Rx</p>
                </div>
                <Switch
                  checked={
                    clinical?.prescription_config?.include_diagnosis_on_rx ??
                    true
                  }
                  onCheckedChange={(v) =>
                    updateClinical("prescription_config", {
                      include_diagnosis_on_rx: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">Include Vitals</Label>
                  <p className="text-xs text-gray-500">Show vitals on Rx</p>
                </div>
                <Switch
                  checked={
                    clinical?.prescription_config?.include_vitals_on_rx ?? false
                  }
                  onCheckedChange={(v) =>
                    updateClinical("prescription_config", {
                      include_vitals_on_rx: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">
                    Controlled Drug Warning
                  </Label>
                  <p className="text-xs text-gray-500">
                    Alert for Schedule H drugs
                  </p>
                </div>
                <Switch
                  checked={
                    clinical?.prescription_config?.controlled_drug_warning ??
                    true
                  }
                  onCheckedChange={(v) =>
                    updateClinical("prescription_config", {
                      controlled_drug_warning: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">Digital Rx</Label>
                  <p className="text-xs text-gray-500">
                    Enable e-prescriptions
                  </p>
                </div>
                <Switch
                  checked={
                    clinical?.prescription_config?.digital_rx_enabled ?? false
                  }
                  onCheckedChange={(v) =>
                    updateClinical("prescription_config", {
                      digital_rx_enabled: v,
                    })
                  }
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Medical Coding Tab */}
        <TabsContent value="coding" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">
                Medical Coding Preferences
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">ICD Version *</Label>
                <Select
                  value={clinical?.coding_preferences?.icd_version || "icd_10"}
                  onValueChange={(v) =>
                    updateClinical("coding_preferences", { icd_version: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="icd_10">ICD-10</SelectItem>
                    <SelectItem value="icd_11">ICD-11</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">ICD Default Language</Label>
                <Select
                  value={
                    clinical?.coding_preferences?.icd_default_language ||
                    "english"
                  }
                  onValueChange={(v) =>
                    updateClinical("coding_preferences", {
                      icd_default_language: v,
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Procedure Coding System</Label>
                <Select
                  value={
                    clinical?.coding_preferences?.procedure_coding_system ||
                    "icd_10_pcs"
                  }
                  onValueChange={(v) =>
                    updateClinical("coding_preferences", {
                      procedure_coding_system: v,
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="icd_10_pcs">ICD-10-PCS</SelectItem>
                    <SelectItem value="cpt">
                      CPT (Current Procedural Terminology)
                    </SelectItem>
                    <SelectItem value="custom">Custom Codes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">
                    Mandatory Diagnosis Coding
                  </Label>
                </div>
                <Switch
                  checked={
                    clinical?.coding_preferences?.mandatory_diagnosis_coding ??
                    true
                  }
                  onCheckedChange={(v) =>
                    updateClinical("coding_preferences", {
                      mandatory_diagnosis_coding: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">SNOMED-CT</Label>
                </div>
                <Switch
                  checked={
                    clinical?.coding_preferences?.snomed_ct_enabled ?? false
                  }
                  onCheckedChange={(v) =>
                    updateClinical("coding_preferences", {
                      snomed_ct_enabled: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">LOINC</Label>
                </div>
                <Switch
                  checked={clinical?.coding_preferences?.loinc_enabled ?? false}
                  onCheckedChange={(v) =>
                    updateClinical("coding_preferences", { loinc_enabled: v })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-xs font-medium">DRG Grouping</Label>
                </div>
                <Switch
                  checked={
                    clinical?.coding_preferences?.drg_grouping_enabled ?? false
                  }
                  onCheckedChange={(v) =>
                    updateClinical("coding_preferences", {
                      drg_grouping_enabled: v,
                    })
                  }
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Consultation Parameters Tab */}
        <TabsContent value="consultation" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">
                Appointment Slot Configuration
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm">Default OPD Slot (minutes)</Label>
                <Input
                  type="number"
                  value={
                    clinical?.consultation_params?.default_opd_slot_duration ||
                    15
                  }
                  onChange={(e) =>
                    updateClinical("consultation_params", {
                      default_opd_slot_duration: parseInt(e.target.value),
                    })
                  }
                  className="mt-1"
                  min={5}
                  max={120}
                  step={5}
                />
              </div>

              <div>
                <Label className="text-sm">Follow-up Slot (minutes)</Label>
                <Input
                  type="number"
                  value={
                    clinical?.consultation_params?.follow_up_slot_duration || 10
                  }
                  onChange={(e) =>
                    updateClinical("consultation_params", {
                      follow_up_slot_duration: parseInt(e.target.value),
                    })
                  }
                  className="mt-1"
                  min={5}
                  max={60}
                  step={5}
                />
              </div>

              <div>
                <Label className="text-sm">New Patient Slot (minutes)</Label>
                <Input
                  type="number"
                  value={
                    clinical?.consultation_params?.new_patient_slot_duration ||
                    20
                  }
                  onChange={(e) =>
                    updateClinical("consultation_params", {
                      new_patient_slot_duration: parseInt(e.target.value),
                    })
                  }
                  className="mt-1"
                  min={5}
                  max={120}
                  step={5}
                />
              </div>

              <div>
                <Label className="text-sm">Procedure Slot (minutes)</Label>
                <Input
                  type="number"
                  value={
                    clinical?.consultation_params?.procedure_slot_duration || 30
                  }
                  onChange={(e) =>
                    updateClinical("consultation_params", {
                      procedure_slot_duration: parseInt(e.target.value),
                    })
                  }
                  className="mt-1"
                  min={10}
                  max={240}
                  step={5}
                />
              </div>

              <div>
                <Label className="text-sm">
                  Buffer Between Slots (minutes)
                </Label>
                <Input
                  type="number"
                  value={
                    clinical?.consultation_params?.buffer_between_slots || 5
                  }
                  onChange={(e) =>
                    updateClinical("consultation_params", {
                      buffer_between_slots: parseInt(e.target.value),
                    })
                  }
                  className="mt-1"
                  min={0}
                  max={30}
                  step={5}
                />
              </div>

              <div>
                <Label className="text-sm">Max Overbooking Allowed</Label>
                <Input
                  type="number"
                  value={
                    clinical?.consultation_params?.max_overbooking_allowed || 2
                  }
                  onChange={(e) =>
                    updateClinical("consultation_params", {
                      max_overbooking_allowed: parseInt(e.target.value),
                    })
                  }
                  className="mt-1"
                  min={0}
                  max={10}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-orange-600" />
                <h4 className="font-medium text-gray-900">
                  Walk-in & Queue Settings
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Walk-in Priority</Label>
                  <Select
                    value={
                      clinical?.consultation_params?.walk_in_priority ||
                      "after_scheduled"
                    }
                    onValueChange={(v) =>
                      updateClinical("consultation_params", {
                        walk_in_priority: v,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fifo">First In First Out</SelectItem>
                      <SelectItem value="after_scheduled">
                        After Scheduled Patients
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="text-xs font-medium">
                      Walk-in Allowed
                    </Label>
                    <p className="text-xs text-gray-500">
                      Accept walk-in patients
                    </p>
                  </div>
                  <Switch
                    checked={
                      clinical?.consultation_params?.walk_in_allowed ?? true
                    }
                    onCheckedChange={(v) =>
                      updateClinical("consultation_params", {
                        walk_in_allowed: v,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="text-xs font-medium">Token System</Label>
                    <p className="text-xs text-gray-500">
                      Enable token-based queue
                    </p>
                  </div>
                  <Switch
                    checked={
                      clinical?.consultation_params?.token_system_enabled ??
                      true
                    }
                    onCheckedChange={(v) =>
                      updateClinical("consultation_params", {
                        token_system_enabled: v,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <Label className="text-xs font-medium">
                      Show Wait Time
                    </Label>
                    <p className="text-xs text-gray-500">
                      Display estimated wait
                    </p>
                  </div>
                  <Switch
                    checked={
                      clinical?.consultation_params?.estimated_wait_display ??
                      true
                    }
                    onCheckedChange={(v) =>
                      updateClinical("consultation_params", {
                        estimated_wait_display: v,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Clinical Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-gray-900">
                Clinical Decision Support Alerts
              </h4>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Configure alerts and warnings that help clinicians make safer
              decisions during patient care.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
                <div>
                  <Label className="text-sm font-medium">
                    Drug Allergy Check
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Alert when prescribing drugs the patient is allergic to
                  </p>
                </div>
                <Switch
                  checked={
                    clinical?.alerts_config?.drug_allergy_check_enabled ?? true
                  }
                  onCheckedChange={(v) =>
                    updateClinical("alerts_config", {
                      drug_allergy_check_enabled: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-200 transition-colors">
                <div>
                  <Label className="text-sm font-medium">
                    Drug Interaction Check
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Warn about potential drug-drug interactions
                  </p>
                </div>
                <Switch
                  checked={
                    clinical?.alerts_config?.drug_interaction_check_enabled ??
                    true
                  }
                  onCheckedChange={(v) =>
                    updateClinical("alerts_config", {
                      drug_interaction_check_enabled: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors">
                <div>
                  <Label className="text-sm font-medium">
                    Duplicate Order Warning
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Alert when ordering same medication twice
                  </p>
                </div>
                <Switch
                  checked={
                    clinical?.alerts_config?.duplicate_order_warning ?? true
                  }
                  onCheckedChange={(v) =>
                    updateClinical("alerts_config", {
                      duplicate_order_warning: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors">
                <div>
                  <Label className="text-sm font-medium">
                    Critical Value Alerts
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Notify for critical lab values immediately
                  </p>
                </div>
                <Switch
                  checked={
                    clinical?.alerts_config?.critical_value_alerts ?? true
                  }
                  onCheckedChange={(v) =>
                    updateClinical("alerts_config", {
                      critical_value_alerts: v,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors md:col-span-2">
                <div>
                  <Label className="text-sm font-medium">
                    Dose Range Checking
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Alert when prescribed dose is outside recommended range
                    based on age/weight
                  </p>
                </div>
                <Switch
                  checked={clinical?.alerts_config?.dose_range_checking ?? true}
                  onCheckedChange={(v) =>
                    updateClinical("alerts_config", { dose_range_checking: v })
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Clinical Decision Support (CDS)
                </h4>
                <p className="text-xs text-blue-700 mt-1">
                  These alerts help reduce medication errors and improve patient
                  safety. They integrate with your drug database to provide
                  real-time checks during order entry. We recommend keeping all
                  alerts enabled for optimal patient safety.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
