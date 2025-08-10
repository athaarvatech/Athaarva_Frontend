"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pill,
  Plus,
  Trash2,
  AlertTriangle,
  Check,
  Search,
  Printer,
  Save,
  FileText,
  Clock,
  User,
  Calendar,
  Shield,
  Zap,
  X,
  Copy,
  Edit3,
} from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";
import { checkMedicationInteractions } from "@/lib/medication-services";

// Types for prescription data
interface Medication {
  id: string;
  name: string;
  genericName?: string;
  strength: string;
  dosageForm: string;
  frequency: string;
  duration: string;
  quantity: number;
  refills: number;
  instructions: string;
  indication: string;
  isGeneric: boolean;
  ndc?: string;
  cost?: number;
}

interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  medications: Medication[];
  diagnosis: string;
  notes: string;
  status: "draft" | "sent" | "dispensed";
  pharmacyId?: string;
  signature?: string;
}

interface DrugInteraction {
  severity: "high" | "moderate" | "low";
  description: string;
  medications: string[];
  recommendation: string;
}

// Mock medication database
const MEDICATION_DATABASE = [
  {
    name: "Lisinopril",
    genericName: "Lisinopril",
    strengths: ["5mg", "10mg", "20mg"],
    forms: ["Tablet"],
  },
  {
    name: "Metformin",
    genericName: "Metformin HCl",
    strengths: ["500mg", "850mg", "1000mg"],
    forms: ["Tablet", "Extended Release"],
  },
  {
    name: "Sumatriptan",
    genericName: "Sumatriptan Succinate",
    strengths: ["25mg", "50mg", "100mg"],
    forms: ["Tablet", "Injection", "Nasal Spray"],
  },
  {
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    strengths: ["10mg", "20mg", "40mg", "80mg"],
    forms: ["Tablet"],
  },
  {
    name: "Omeprazole",
    genericName: "Omeprazole",
    strengths: ["20mg", "40mg"],
    forms: ["Capsule", "Tablet"],
  },
  {
    name: "Levothyroxine",
    genericName: "Levothyroxine Sodium",
    strengths: ["25mcg", "50mcg", "75mcg", "100mcg"],
    forms: ["Tablet"],
  },
  {
    name: "Amlodipine",
    genericName: "Amlodipine Besylate",
    strengths: ["2.5mg", "5mg", "10mg"],
    forms: ["Tablet"],
  },
  {
    name: "Metoprolol",
    genericName: "Metoprolol Tartrate",
    strengths: ["25mg", "50mg", "100mg"],
    forms: ["Tablet", "Extended Release"],
  },
  {
    name: "Hydrochlorothiazide",
    genericName: "Hydrochlorothiazide",
    strengths: ["12.5mg", "25mg", "50mg"],
    forms: ["Tablet"],
  },
  {
    name: "Sertraline",
    genericName: "Sertraline HCl",
    strengths: ["25mg", "50mg", "100mg"],
    forms: ["Tablet"],
  },
];

const FREQUENCY_OPTIONS = [
  "Once daily (OD)",
  "Twice daily (BID)",
  "Three times daily (TID)",
  "Four times daily (QID)",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "As needed (PRN)",
  "At bedtime (HS)",
  "Before meals (AC)",
  "After meals (PC)",
  "With meals",
];

const DURATION_OPTIONS = [
  "3 days",
  "5 days",
  "7 days",
  "10 days",
  "14 days",
  "30 days",
  "60 days",
  "90 days",
  "Ongoing",
  "Until follow-up",
];

export function EPrescriptionPanel() {
  const { consultation } = useConsultation();
  const [currentPrescription, setCurrentPrescription] = useState<Prescription>({
    id: `rx-${Date.now()}`,
    patientId: "patient-123",
    doctorId: "doctor-123",
    date: new Date(),
    medications: [],
    diagnosis: "",
    notes: "",
    status: "draft",
  });

  const [currentMedication, setCurrentMedication] = useState<
    Partial<Medication>
  >({
    name: "",
    strength: "",
    dosageForm: "Tablet",
    frequency: "",
    duration: "",
    quantity: 30,
    refills: 0,
    instructions: "",
    indication: "",
    isGeneric: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeds, setFilteredMeds] = useState(MEDICATION_DATABASE);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [showInteractions, setShowInteractions] = useState(false);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);

  // Filter medications based on search
  useEffect(() => {
    const filtered = MEDICATION_DATABASE.filter(
      (med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMeds(filtered);
  }, [searchTerm]);

  // Check for drug interactions when medications change
  useEffect(() => {
    if (currentPrescription.medications.length > 1) {
      checkInteractions();
    }
  }, [currentPrescription.medications]);

  const checkInteractions = async () => {
    try {
      const medicationNames = currentPrescription.medications.map(
        (med) => med.name
      );
      const interactionResults = await checkMedicationInteractions(
        medicationNames
      );
      setInteractions(interactionResults);
    } catch (error) {
      console.error("Error checking interactions:", error);
    }
  };

  const handleMedicationSelect = (medData: any) => {
    setCurrentMedication({
      ...currentMedication,
      name: medData.name,
      genericName: medData.genericName,
    });
    setSearchTerm(medData.name);
  };

  const addMedication = () => {
    if (
      !currentMedication.name ||
      !currentMedication.strength ||
      !currentMedication.frequency
    ) {
      return;
    }

    const newMedication: Medication = {
      id: `med-${Date.now()}`,
      name: currentMedication.name!,
      genericName: currentMedication.genericName,
      strength: currentMedication.strength!,
      dosageForm: currentMedication.dosageForm!,
      frequency: currentMedication.frequency!,
      duration: currentMedication.duration!,
      quantity: currentMedication.quantity!,
      refills: currentMedication.refills!,
      instructions: currentMedication.instructions!,
      indication: currentMedication.indication!,
      isGeneric: currentMedication.isGeneric!,
    };

    setCurrentPrescription((prev) => ({
      ...prev,
      medications: [...prev.medications, newMedication],
    }));

    // Reset form
    setCurrentMedication({
      name: "",
      strength: "",
      dosageForm: "Tablet",
      frequency: "",
      duration: "",
      quantity: 30,
      refills: 0,
      instructions: "",
      indication: "",
      isGeneric: true,
    });
    setSearchTerm("");
    setIsAddingMed(false);
  };

  const removeMedication = (medId: string) => {
    setCurrentPrescription((prev) => ({
      ...prev,
      medications: prev.medications.filter((med) => med.id !== medId),
    }));
  };

  const editMedication = (medId: string) => {
    const medication = currentPrescription.medications.find(
      (med) => med.id === medId
    );
    if (medication) {
      setCurrentMedication(medication);
      setEditingMedId(medId);
      setIsAddingMed(true);
    }
  };

  const updateMedication = () => {
    if (!editingMedId || !currentMedication.name) return;

    setCurrentPrescription((prev) => ({
      ...prev,
      medications: prev.medications.map((med) =>
        med.id === editingMedId
          ? ({ ...med, ...currentMedication } as Medication)
          : med
      ),
    }));

    setEditingMedId(null);
    setCurrentMedication({
      name: "",
      strength: "",
      dosageForm: "Tablet",
      frequency: "",
      duration: "",
      quantity: 30,
      refills: 0,
      instructions: "",
      indication: "",
      isGeneric: true,
    });
    setSearchTerm("");
    setIsAddingMed(false);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(generatePrintableRx());
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generatePrintableRx = () => {
    const patientInfo = {
      name: "Sarah Johnson",
      age: 42,
      dob: "05/15/1981",
      address: "123 Main St, Anytown, ST 12345",
    };

    const doctorInfo = {
      name: "Dr. Emily Chen",
      license: "MD123456",
      npi: "1234567890",
      address: "456 Medical Center Dr, Anytown, ST 12345",
      phone: "(555) 123-4567",
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prescription</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 0.5in;
            background: white;
          }
          .rx-header { 
            border-bottom: 2px solid #006D77; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
          }
          .doctor-info { text-align: left; }
          .rx-symbol { 
            font-size: 72px; 
            color: #006D77; 
            font-weight: bold;
            text-align: right;
            line-height: 1;
          }
          .patient-info { 
            background: #f8f9fa; 
            padding: 15px; 
            margin-bottom: 30px;
            border: 1px solid #dee2e6;
          }
          .medication { 
            margin-bottom: 25px; 
            padding: 15px;
            border-left: 4px solid #006D77;
            background: #f8f9fa;
          }
          .med-name { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 8px;
          }
          .med-details { 
            margin-left: 20px; 
            line-height: 1.6;
          }
          .signature-section { 
            margin-top: 40px; 
            border-top: 1px solid #ccc; 
            padding-top: 20px;
          }
          .signature-line { 
            border-bottom: 1px solid #000; 
            width: 300px; 
            margin: 20px 0 5px 0;
          }
          .no-substitution { 
            margin-top: 20px; 
            font-weight: bold;
          }
          .rx-footer {
            margin-top: 30px;
            font-size: 12px;
            text-align: center;
            color: #666;
          }
          @media print {
            body { margin: 0; padding: 0.5in; }
          }
        </style>
      </head>
      <body>
        <div class="rx-header">
          <div class="doctor-info">
            <h2>${doctorInfo.name}</h2>
            <p>License: ${doctorInfo.license} | NPI: ${doctorInfo.npi}</p>
            <p>${doctorInfo.address}</p>
            <p>Phone: ${doctorInfo.phone}</p>
          </div>
          <div class="rx-symbol">℞</div>
        </div>

        <div class="patient-info">
          <strong>Patient:</strong> ${patientInfo.name} | 
          <strong>Age:</strong> ${patientInfo.age} | 
          <strong>DOB:</strong> ${patientInfo.dob}<br>
          <strong>Address:</strong> ${patientInfo.address}<br>
          <strong>Date:</strong> ${new Date().toLocaleDateString()}
        </div>

        ${currentPrescription.medications
          .map(
            (med) => `
          <div class="medication">
            <div class="med-name">${med.name} ${med.strength}</div>
            <div class="med-details">
              <strong>Form:</strong> ${med.dosageForm}<br>
              <strong>Instructions:</strong> ${med.frequency} ${
              med.instructions ? "- " + med.instructions : ""
            }<br>
              <strong>Duration:</strong> ${med.duration}<br>
              <strong>Quantity:</strong> ${med.quantity} (${
              med.refills
            } refills)<br>
              ${
                med.indication
                  ? `<strong>For:</strong> ${med.indication}<br>`
                  : ""
              }
              ${
                !med.isGeneric
                  ? "<strong>Brand Name Medically Necessary</strong>"
                  : ""
              }
            </div>
          </div>
        `
          )
          .join("")}

        ${
          currentPrescription.diagnosis
            ? `
          <div style="margin: 30px 0;">
            <strong>Diagnosis:</strong> ${currentPrescription.diagnosis}
          </div>
        `
            : ""
        }

        ${
          currentPrescription.notes
            ? `
          <div style="margin: 30px 0;">
            <strong>Additional Notes:</strong> ${currentPrescription.notes}
          </div>
        `
            : ""
        }

        <div class="signature-section">
          <p><strong>Prescriber Signature:</strong></p>
          <div class="signature-line"></div>
          <p style="font-size: 12px; margin-top: 5px;">Electronic signature on file</p>
          
          <div class="no-substitution">
            <input type="checkbox" id="no-sub"> 
            <label for="no-sub">Dispense as Written - No Substitution</label>
          </div>
        </div>

        <div class="rx-footer">
          <p>Prescription generated electronically on ${new Date().toLocaleString()}</p>
          <p>This prescription was generated using HealthCare 2.0 EHR System</p>
        </div>
      </body>
      </html>
    `;
  };

  const savePrescription = () => {
    // In a real app, this would save to the backend
    console.log("Saving prescription:", currentPrescription);
    // Update consultation with prescription data
    // updateConsultation({ ...consultation, prescription: currentPrescription });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#006D77] flex items-center justify-center">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#006D77]">
              E-Prescription
            </h2>
            <p className="text-sm text-gray-600">
              Write and manage patient prescriptions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {currentPrescription.status.toUpperCase()}
          </Badge>
          <Button variant="outline" size="sm" onClick={savePrescription}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            className="bg-[#006D77] hover:bg-[#00585F]"
            size="sm"
            onClick={handlePrint}
            disabled={currentPrescription.medications.length === 0}
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card className="border-[#E8F3F4]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center text-[#006D77]">
            <User className="h-4 w-4 mr-2" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">Sarah Johnson</span>
            </div>
            <div>
              <span className="text-gray-600">Age:</span>
              <span className="ml-2 font-medium">42 years</span>
            </div>
            <div>
              <span className="text-gray-600">DOB:</span>
              <span className="ml-2 font-medium">05/15/1981</span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2 font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drug Interactions Alert */}
      {interactions.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center text-red-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Drug Interaction Alert ({interactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {interactions.map((interaction, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-md border border-red-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={`${
                        interaction.severity === "high"
                          ? "border-red-500 text-red-700"
                          : interaction.severity === "moderate"
                          ? "border-yellow-500 text-yellow-700"
                          : "border-blue-500 text-blue-700"
                      }`}
                    >
                      {interaction.severity.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {interaction.description}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Recommendation:</strong>{" "}
                    {interaction.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Medication Form */}
      {isAddingMed && (
        <Card className="border-[#E8F3F4] bg-[#F0F9FA]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between text-[#006D77]">
              <div className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                {editingMedId ? "Edit Medication" : "Add New Medication"}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingMed(false);
                  setEditingMedId(null);
                  setCurrentMedication({
                    name: "",
                    strength: "",
                    dosageForm: "Tablet",
                    frequency: "",
                    duration: "",
                    quantity: 30,
                    refills: 0,
                    instructions: "",
                    indication: "",
                    isGeneric: true,
                  });
                  setSearchTerm("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Medication Search */}
            <div>
              <Label htmlFor="med-search">Search Medication</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="med-search"
                  placeholder="Type medication name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchTerm && filteredMeds.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border rounded-md bg-white">
                  {filteredMeds.slice(0, 5).map((med, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleMedicationSelect(med)}
                    >
                      <div className="font-medium">{med.name}</div>
                      <div className="text-xs text-gray-600">
                        {med.genericName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strength */}
              <div>
                <Label htmlFor="strength">Strength *</Label>
                <Select
                  value={currentMedication.strength}
                  onValueChange={(value) =>
                    setCurrentMedication({
                      ...currentMedication,
                      strength: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select strength" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMeds
                      .find((m) => m.name === currentMedication.name)
                      ?.strengths.map((strength) => (
                        <SelectItem key={strength} value={strength}>
                          {strength}
                        </SelectItem>
                      )) || (
                      <>
                        <SelectItem value="5mg">5mg</SelectItem>
                        <SelectItem value="10mg">10mg</SelectItem>
                        <SelectItem value="25mg">25mg</SelectItem>
                        <SelectItem value="50mg">50mg</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Dosage Form */}
              <div>
                <Label htmlFor="form">Dosage Form</Label>
                <Select
                  value={currentMedication.dosageForm}
                  onValueChange={(value) =>
                    setCurrentMedication({
                      ...currentMedication,
                      dosageForm: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tablet">Tablet</SelectItem>
                    <SelectItem value="Capsule">Capsule</SelectItem>
                    <SelectItem value="Liquid">Liquid</SelectItem>
                    <SelectItem value="Injection">Injection</SelectItem>
                    <SelectItem value="Cream">Cream</SelectItem>
                    <SelectItem value="Ointment">Ointment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency */}
              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={currentMedication.frequency}
                  onValueChange={(value) =>
                    setCurrentMedication({
                      ...currentMedication,
                      frequency: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCY_OPTIONS.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Select
                  value={currentMedication.duration}
                  onValueChange={(value) =>
                    setCurrentMedication({
                      ...currentMedication,
                      duration: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={currentMedication.quantity}
                  onChange={(e) =>
                    setCurrentMedication({
                      ...currentMedication,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  min="1"
                />
              </div>

              {/* Refills */}
              <div>
                <Label htmlFor="refills">Refills</Label>
                <Select
                  value={currentMedication.refills?.toString()}
                  onValueChange={(value) =>
                    setCurrentMedication({
                      ...currentMedication,
                      refills: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="e.g., Take with food, Do not crush..."
                value={currentMedication.instructions}
                onChange={(e) =>
                  setCurrentMedication({
                    ...currentMedication,
                    instructions: e.target.value,
                  })
                }
                rows={2}
              />
            </div>

            {/* Indication */}
            <div>
              <Label htmlFor="indication">Indication/Purpose</Label>
              <Input
                id="indication"
                placeholder="e.g., Hypertension, Migraine prophylaxis..."
                value={currentMedication.indication}
                onChange={(e) =>
                  setCurrentMedication({
                    ...currentMedication,
                    indication: e.target.value,
                  })
                }
              />
            </div>

            {/* Generic Substitution */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="generic"
                checked={currentMedication.isGeneric}
                onCheckedChange={(checked) =>
                  setCurrentMedication({
                    ...currentMedication,
                    isGeneric: checked as boolean,
                  })
                }
              />
              <Label htmlFor="generic" className="text-sm">
                Allow generic substitution
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingMed(false);
                  setEditingMedId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#006D77] hover:bg-[#00585F]"
                onClick={editingMedId ? updateMedication : addMedication}
                disabled={
                  !currentMedication.name ||
                  !currentMedication.strength ||
                  !currentMedication.frequency
                }
              >
                {editingMedId ? "Update" : "Add"} Medication
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Prescription */}
      <Card className="border-[#E8F3F4]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center justify-between text-[#006D77]">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Current Prescription ({currentPrescription.medications.length})
            </div>
            {!isAddingMed && (
              <Button
                size="sm"
                className="bg-[#006D77] hover:bg-[#00585F]"
                onClick={() => setIsAddingMed(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Medication
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPrescription.medications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Pill className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No medications added yet</p>
              <p className="text-sm">
                Click "Add Medication" to start writing prescription
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentPrescription.medications.map((medication, index) => (
                <div
                  key={medication.id}
                  className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-[#006D77]">
                            {medication.name} {medication.strength}
                          </h4>
                          {medication.genericName && (
                            <p className="text-sm text-gray-600 mb-2">
                              Generic: {medication.genericName}
                            </p>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Form:</span>
                              <span className="ml-2">
                                {medication.dosageForm}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Frequency:</span>
                              <span className="ml-2">
                                {medication.frequency}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <span className="ml-2">
                                {medication.duration}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Quantity:</span>
                              <span className="ml-2">
                                {medication.quantity} ({medication.refills}{" "}
                                refills)
                              </span>
                            </div>
                          </div>

                          {medication.instructions && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                              <strong>Instructions:</strong>{" "}
                              {medication.instructions}
                            </div>
                          )}

                          {medication.indication && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                For: {medication.indication}
                              </Badge>
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-2">
                            {medication.isGeneric ? (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Generic OK
                              </Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Brand Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editMedication(medication.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedication(medication.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prescription Details */}
      <Card className="border-[#E8F3F4]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[#006D77]">
            Prescription Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="diagnosis">Primary Diagnosis</Label>
            <Input
              id="diagnosis"
              placeholder="e.g., Essential Hypertension (I10)"
              value={currentPrescription.diagnosis}
              onChange={(e) =>
                setCurrentPrescription({
                  ...currentPrescription,
                  diagnosis: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional instructions or notes for pharmacy..."
              value={currentPrescription.notes}
              onChange={(e) =>
                setCurrentPrescription({
                  ...currentPrescription,
                  notes: e.target.value,
                })
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Footer */}
      {currentPrescription.medications.length > 0 && (
        <Card className="border-[#E8F3F4] bg-[#F0F9FA]">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last saved: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={savePrescription}>
                  <Save className="h-4 w-4 mr-1" />
                  Save Draft
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setCurrentPrescription({
                      ...currentPrescription,
                      status: "sent",
                    });
                    // Here you would integrate with pharmacy systems
                    alert("Prescription sent to pharmacy successfully!");
                  }}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Send to Pharmacy
                </Button>
                <Button
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Print Prescription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
