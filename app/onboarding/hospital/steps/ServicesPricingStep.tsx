/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  DollarSign,
  Stethoscope,
  MapPin,
  AlertCircle,
  X,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { HelpPopover } from "../widgets/HelpPopover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { ServiceData } from "@/contexts/HospitalOnboardingContextV2";

export default function ServicesPricingStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [newDepartment, setNewDepartment] = useState("");
  const [newProcedure, setNewProcedure] = useState("");
  const [newInsurance, setNewInsurance] = useState("");

  // Safety checks
  const servicesPricing = data.servicesPricing || {
    departments: [],
    procedures: [],
    consultation_types: [],
    services: [],
    insurance_partnerships: [],
  };

  const departments = Array.isArray(servicesPricing.departments)
    ? servicesPricing.departments
    : [];
  const procedures = Array.isArray(servicesPricing.procedures)
    ? servicesPricing.procedures
    : [];
  const consultationTypes = Array.isArray(servicesPricing.consultation_types)
    ? servicesPricing.consultation_types
    : [];
  const services = Array.isArray(servicesPricing.services)
    ? servicesPricing.services
    : [];
  const insurancePartnerships = Array.isArray(
    servicesPricing.insurance_partnerships
  )
    ? servicesPricing.insurance_partnerships
    : [];
  const locations = Array.isArray(data.locations) ? data.locations : [];

  // Department management
  const addDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      updateData("servicesPricing", {
        departments: [...departments, newDepartment.trim()],
      });
      setNewDepartment("");
    }
  };

  const removeDepartment = (dept: string) => {
    updateData("servicesPricing", {
      departments: departments.filter((d) => d !== dept),
    });
  };

  // Procedure management
  const addProcedure = () => {
    if (newProcedure.trim() && !procedures.includes(newProcedure.trim())) {
      updateData("servicesPricing", {
        procedures: [...procedures, newProcedure.trim()],
      });
      setNewProcedure("");
    }
  };

  const removeProcedure = (proc: string) => {
    updateData("servicesPricing", {
      procedures: procedures.filter((p) => p !== proc),
    });
  };

  // Consultation type toggle
  const toggleConsultationType = (type: string) => {
    const updated = consultationTypes.includes(type as any)
      ? consultationTypes.filter((t) => t !== type)
      : [...consultationTypes, type as "in-person" | "telehealth" | "home"];

    updateData("servicesPricing", {
      consultation_types: updated,
    });
  };

  // Service management
  const addService = () => {
    const newService: ServiceData = {
      id: `service_${Date.now()}`,
      name: "",
      department: "",
      description: "",
      consultation_types: [],
      fee_range: {
        min: 0,
        max: 0,
        currency: "INR",
      },
      location_ids: [],
      specialty_ids: [],
    };

    updateData("servicesPricing", {
      services: [...services, newService],
    });
  };

  const updateService = (id: string, updates: Partial<ServiceData>) => {
    const updatedServices = services.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    updateData("servicesPricing", {
      services: updatedServices,
    });
  };

  const removeService = (id: string) => {
    updateData("servicesPricing", {
      services: services.filter((s) => s.id !== id),
    });
  };

  // Insurance management
  const addInsurance = () => {
    if (
      newInsurance.trim() &&
      !insurancePartnerships.includes(newInsurance.trim())
    ) {
      updateData("servicesPricing", {
        insurance_partnerships: [...insurancePartnerships, newInsurance.trim()],
      });
      setNewInsurance("");
    }
  };

  const removeInsurance = (insurance: string) => {
    updateData("servicesPricing", {
      insurance_partnerships: insurancePartnerships.filter(
        (i) => i !== insurance
      ),
    });
  };

  type ConsultationType = "in-person" | "telehealth" | "home";
  const consultationTypeOptions: {
    value: ConsultationType;
    label: string;
    icon: typeof Stethoscope;
  }[] = [
    { value: "in-person", label: "In-Person", icon: Stethoscope },
    { value: "telehealth", label: "Telehealth", icon: MapPin },
    { value: "home", label: "Home Visit", icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Clinical Services & Pricing
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Define your departments, procedures, services, and pricing structure
        </p>
      </div>

      {/* Departments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Departments</Label>
          <HelpPopover
            title="Departments"
            content="List all clinical departments in your hospital (e.g., Cardiology, Orthopedics, Pediatrics)"
          />
        </div>

        <div className="flex gap-2">
          <Input
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addDepartment()}
            placeholder="e.g., Cardiology"
            className="flex-1"
          />
          <Button onClick={addDepartment} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <Badge key={dept} variant="secondary" className="text-sm py-1 px-3">
              {dept}
              <button
                onClick={() => removeDepartment(dept)}
                className="ml-2 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Procedures */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Common Procedures</Label>
          <HelpPopover
            title="Procedures"
            content="List common procedures offered (e.g., MRI Scan, Blood Test, ECG)"
          />
        </div>

        <div className="flex gap-2">
          <Input
            value={newProcedure}
            onChange={(e) => setNewProcedure(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addProcedure()}
            placeholder="e.g., MRI Scan"
            className="flex-1"
          />
          <Button onClick={addProcedure} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {procedures.map((proc) => (
            <Badge key={proc} variant="secondary" className="text-sm py-1 px-3">
              {proc}
              <button
                onClick={() => removeProcedure(proc)}
                className="ml-2 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Consultation Types */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Consultation Types</Label>
          <HelpPopover
            title="Consultation Types"
            content="Select all consultation modes your hospital offers"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {consultationTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleConsultationType(option.value)}
              className={cn(
                "flex items-center gap-3 p-4 border-2 rounded-lg transition-all",
                (consultationTypes as string[]).includes(option.value)
                  ? "border-healthcare-primary bg-healthcare-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <option.icon
                className={cn(
                  "w-5 h-5",
                  (consultationTypes as string[]).includes(option.value)
                    ? "text-healthcare-primary"
                    : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  (consultationTypes as string[]).includes(option.value)
                    ? "text-healthcare-primary"
                    : "text-gray-700"
                )}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Services & Pricing</Label>
          <Button
            onClick={addService}
            size="sm"
            className="bg-healthcare-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        <AnimatePresence>
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              departments={departments}
              locations={locations}
              consultationTypeOptions={consultationTypeOptions}
              onUpdate={(updates) => updateService(service.id, updates)}
              onRemove={() => removeService(service.id)}
            />
          ))}
        </AnimatePresence>

        {services.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No services added yet</p>
            <Button onClick={addService} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Service
            </Button>
          </div>
        )}
      </div>

      {/* Insurance Partnerships */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            Insurance Partnerships
          </Label>
          <HelpPopover
            title="Insurance Partnerships"
            content="List insurance providers you have partnerships with"
          />
        </div>

        <div className="flex gap-2">
          <Input
            value={newInsurance}
            onChange={(e) => setNewInsurance(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addInsurance()}
            placeholder="e.g., Star Health Insurance"
            className="flex-1"
          />
          <Button onClick={addInsurance} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {insurancePartnerships.map((insurance) => (
            <Badge
              key={insurance}
              variant="secondary"
              className="text-sm py-1 px-3"
            >
              {insurance}
              <button
                onClick={() => removeInsurance(insurance)}
                className="ml-2 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

// Service Card Component
type ConsultationTypeOption = {
  value: "in-person" | "telehealth" | "home";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface ServiceCardProps {
  service: ServiceData;
  index: number;
  departments: string[];
  locations: { id: string; name: string }[];
  consultationTypeOptions: ConsultationTypeOption[];
  onUpdate: (updates: Partial<ServiceData>) => void;
  onRemove: () => void;
}

function ServiceCard({
  service,
  index,
  departments,
  locations,
  consultationTypeOptions,
  onUpdate,
  onRemove,
}: ServiceCardProps) {
  type ConsultationType = "in-person" | "telehealth" | "home";

  const toggleServiceConsultationType = (type: ConsultationType) => {
    const updated = service.consultation_types.includes(type)
      ? service.consultation_types.filter((t) => t !== type)
      : [...service.consultation_types, type];

    onUpdate({ consultation_types: updated });
  };

  const toggleLocation = (locationId: string) => {
    const updated = service.location_ids.includes(locationId)
      ? service.location_ids.filter((id) => id !== locationId)
      : [...service.location_ids, locationId];

    onUpdate({ location_ids: updated });
  };

  const feeRangeValid = service.fee_range.min <= service.fee_range.max;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-healthcare-primary" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900">
              Service #{index + 1}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {service.name || "Unnamed Service"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Service Name *</Label>
          <Input
            value={service.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., Cardiac Consultation"
          />
        </div>

        <div className="space-y-2">
          <Label>Department *</Label>
          <select
            value={service.department}
            onChange={(e) => onUpdate({ department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-healthcare-primary focus:border-transparent"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={service.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Brief description of the service..."
          rows={3}
        />
      </div>

      {/* Consultation Types */}
      <div className="space-y-2">
        <Label>Available Consultation Types</Label>
        <div className="flex flex-wrap gap-2">
          {consultationTypeOptions.map((option) => (
            <Badge
              key={option.value}
              variant={
                service.consultation_types.includes(option.value)
                  ? "default"
                  : "outline"
              }
              className="cursor-pointer"
              onClick={() => toggleServiceConsultationType(option.value)}
            >
              <option.icon className="w-3 h-3 mr-1" />
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Fee Range */}
      <div className="space-y-2">
        <Label>Fee Range (INR) *</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Minimum</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                value={service.fee_range.min}
                onChange={(e) =>
                  onUpdate({
                    fee_range: {
                      ...service.fee_range,
                      min: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Maximum</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                value={service.fee_range.max}
                onChange={(e) =>
                  onUpdate({
                    fee_range: {
                      ...service.fee_range,
                      max: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="pl-10"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {!feeRangeValid && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            Minimum fee must be less than or equal to maximum fee
          </div>
        )}
      </div>

      {/* Locations */}
      {locations.length > 0 && (
        <div className="space-y-2">
          <Label>Available at Locations</Label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Badge
                key={location.id}
                variant={
                  service.location_ids.includes(location.id)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleLocation(location.id)}
              >
                <MapPin className="w-3 h-3 mr-1" />
                {location.name || `Location ${location.id}`}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
