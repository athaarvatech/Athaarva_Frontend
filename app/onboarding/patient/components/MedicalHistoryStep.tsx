"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Heart, 
  AlertTriangle,
  Pill,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Shield
} from "lucide-react";
import { PatientOnboardingData } from "../page";

interface MedicalHistoryStepProps {
  data: PatientOnboardingData;
  updateData: <T extends keyof PatientOnboardingData>(
    section: T,
    data: Partial<PatientOnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
}

const commonAllergies = [
  "Penicillin",
  "Aspirin", 
  "Peanuts",
  "Shellfish",
  "Eggs",
  "Milk",
  "Soy",
  "Wheat",
  "Dust",
  "Pollen",
  "Pet Dander",
  "Latex"
];

const commonConditions = [
  "Diabetes",
  "Hypertension",
  "Heart Disease", 
  "Asthma",
  "Arthritis",
  "High Cholesterol",
  "Thyroid Disorders",
  "Depression",
  "Anxiety",
  "Migraine",
  "GERD",
  "Kidney Disease"
];

const commonVaccines = [
  "COVID-19",
  "Influenza (Flu)",
  "Hepatitis B",
  "Tetanus",
  "MMR (Measles, Mumps, Rubella)",
  "Pneumonia",
  "HPV",
  "Hepatitis A",
  "Varicella (Chickenpox)",
  "Meningitis"
];

const MedicalHistoryStep: React.FC<MedicalHistoryStepProps> = ({
  data,
  updateData,
  onStepComplete,
}) => {
  const [isValid, setIsValid] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newVaccine, setNewVaccine] = useState({ vaccine: "", date: "" });

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const { medicalHistory } = data;

    // If "No medical history" is checked, form is valid
    if (medicalHistory.noMedicalHistory) {
      setIsValid(true);
      onStepComplete();
      return true;
    }

    // Optional validations - medical history can be empty
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    
    if (valid) {
      onStepComplete();
    }
    
    return valid;
  }, [data, onStepComplete]);

  // Auto-validate on data change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleToggleAllergy = (allergy: string) => {
    const currentAllergies = data.medicalHistory.allergies;
    const updatedAllergies = currentAllergies.includes(allergy)
      ? currentAllergies.filter(a => a !== allergy)
      : [...currentAllergies, allergy];
    
    updateData("medicalHistory", { allergies: updatedAllergies });
  };

  const handleAddCustomAllergy = () => {
    if (newAllergy.trim() && !data.medicalHistory.allergies.includes(newAllergy.trim())) {
      updateData("medicalHistory", { 
        allergies: [...data.medicalHistory.allergies, newAllergy.trim()] 
      });
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    updateData("medicalHistory", { 
      allergies: data.medicalHistory.allergies.filter(a => a !== allergy) 
    });
  };

  const handleToggleCondition = (condition: string) => {
    const currentConditions = data.medicalHistory.chronicIllnesses;
    const updatedConditions = currentConditions.includes(condition)
      ? currentConditions.filter(c => c !== condition)
      : [...currentConditions, condition];
    
    updateData("medicalHistory", { chronicIllnesses: updatedConditions });
  };

  const handleAddMedication = () => {
    if (newMedication.trim() && !data.medicalHistory.currentMedications.includes(newMedication.trim())) {
      updateData("medicalHistory", { 
        currentMedications: [...data.medicalHistory.currentMedications, newMedication.trim()] 
      });
      setNewMedication("");
    }
  };

  const handleRemoveMedication = (medication: string) => {
    updateData("medicalHistory", { 
      currentMedications: data.medicalHistory.currentMedications.filter(m => m !== medication) 
    });
  };

  const handleAddVaccination = () => {
    if (newVaccine.vaccine.trim() && newVaccine.date) {
      const existingIndex = data.medicalHistory.vaccinations.findIndex(
        v => v.vaccine === newVaccine.vaccine.trim()
      );
      
      const updatedVaccinations = [...data.medicalHistory.vaccinations];
      if (existingIndex >= 0) {
        updatedVaccinations[existingIndex] = { 
          vaccine: newVaccine.vaccine.trim(), 
          date: newVaccine.date 
        };
      } else {
        updatedVaccinations.push({ 
          vaccine: newVaccine.vaccine.trim(), 
          date: newVaccine.date 
        });
      }
      
      updateData("medicalHistory", { vaccinations: updatedVaccinations });
      setNewVaccine({ vaccine: "", date: "" });
    }
  };

  const handleRemoveVaccination = (vaccine: string) => {
    updateData("medicalHistory", { 
      vaccinations: data.medicalHistory.vaccinations.filter(v => v.vaccine !== vaccine) 
    });
  };

  const handleNoMedicalHistoryToggle = (checked: boolean) => {
    if (checked) {
      // Clear all medical history data when "No medical history" is selected
      updateData("medicalHistory", {
        noMedicalHistory: true,
        allergies: [],
        chronicIllnesses: [],
        pastSurgeries: "",
        currentMedications: [],
        vaccinations: []
      });
    } else {
      updateData("medicalHistory", { noMedicalHistory: false });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* No Medical History Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Switch
                id="noMedicalHistory"
                checked={data.medicalHistory.noMedicalHistory}
                onCheckedChange={handleNoMedicalHistoryToggle}
              />
              <Label htmlFor="noMedicalHistory" className="text-sm font-medium">
                I have no significant medical history
              </Label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Check this if you don&apos;t have any allergies, chronic conditions, or ongoing treatments
            </p>
          </CardContent>
        </Card>

        {/* Medical History Sections - Hidden when "No Medical History" is checked */}
        {!data.medicalHistory.noMedicalHistory && (
          <>
            {/* Allergies Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-healthcare-primary" />
                  Allergies & Sensitivities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select all allergies that apply to you
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonAllergies.map((allergy) => (
                    <label
                      key={allergy}
                      className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={data.medicalHistory.allergies.includes(allergy)}
                        onChange={() => handleToggleAllergy(allergy)}
                        className="w-4 h-4 text-healthcare-primary border-gray-300 rounded focus:ring-healthcare-primary"
                      />
                      <span className="text-sm text-gray-700">{allergy}</span>
                    </label>
                  ))}
                </div>

                {/* Add Custom Allergy */}
                <div className="flex gap-2 mt-4">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add other allergy..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomAllergy()}
                  />
                  <Button type="button" onClick={handleAddCustomAllergy} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Selected Allergies */}
                {data.medicalHistory.allergies.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Allergies:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.medicalHistory.allergies.map((allergy) => (
                        <Badge
                          key={allergy}
                          variant="secondary"
                          className="bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          {allergy}
                          <button
                            onClick={() => handleRemoveAllergy(allergy)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chronic Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-healthcare-primary" />
                  Chronic Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select any ongoing health conditions
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonConditions.map((condition) => (
                    <label
                      key={condition}
                      className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={data.medicalHistory.chronicIllnesses.includes(condition)}
                        onChange={() => handleToggleCondition(condition)}
                        className="w-4 h-4 text-healthcare-primary border-gray-300 rounded focus:ring-healthcare-primary"
                      />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>

                {/* Selected Conditions */}
                {data.medicalHistory.chronicIllnesses.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Conditions:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.medicalHistory.chronicIllnesses.map((condition) => (
                        <Badge
                          key={condition}
                          variant="secondary"
                          className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                        >
                          {condition}
                          <button
                            onClick={() => handleToggleCondition(condition)}
                            className="ml-2 text-orange-600 hover:text-orange-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Surgeries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-healthcare-primary" />
                  Past Surgeries & Procedures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="pastSurgeries" className="text-sm font-medium">
                    Describe any past surgeries or major medical procedures
                  </Label>
                  <Textarea
                    id="pastSurgeries"
                    value={data.medicalHistory.pastSurgeries}
                    onChange={(e) => updateData("medicalHistory", { pastSurgeries: e.target.value })}
                    placeholder="e.g., Appendectomy (2020), Knee surgery (2019)..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Include surgery type and approximate year if you remember
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="w-5 h-5 text-healthcare-primary" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Add medication name..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
                  />
                  <Button type="button" onClick={handleAddMedication} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Current Medications List */}
                {data.medicalHistory.currentMedications.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Medications:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.medicalHistory.currentMedications.map((medication) => (
                        <Badge
                          key={medication}
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          {medication}
                          <button
                            onClick={() => handleRemoveMedication(medication)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Include prescription medications, supplements, and over-the-counter drugs you take regularly
                </p>
              </CardContent>
            </Card>

            {/* Vaccination Records */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-healthcare-primary" />
                  Vaccination Records
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <select
                    value={newVaccine.vaccine}
                    onChange={(e) => setNewVaccine(prev => ({ ...prev, vaccine: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-healthcare-primary focus:border-healthcare-primary"
                  >
                    <option value="">Select vaccine...</option>
                    {commonVaccines.map((vaccine) => (
                      <option key={vaccine} value={vaccine}>{vaccine}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={newVaccine.date}
                      onChange={(e) => setNewVaccine(prev => ({ ...prev, date: e.target.value }))}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddVaccination} 
                      size="sm"
                      disabled={!newVaccine.vaccine || !newVaccine.date}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Vaccination Records List */}
                {data.medicalHistory.vaccinations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Vaccination Records:</p>
                    <div className="space-y-2">
                      {data.medicalHistory.vaccinations.map((vaccination, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                        >
                          <div>
                            <span className="text-sm font-medium text-green-800">{vaccination.vaccine}</span>
                            <span className="text-sm text-green-600 ml-2">
                              ({new Date(vaccination.date).toLocaleDateString()})
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveVaccination(vaccination.vaccine)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Validation Summary */}
        {isValid ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Medical history section completed!
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800">
              Medical history is optional but recommended for better care
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MedicalHistoryStep;
