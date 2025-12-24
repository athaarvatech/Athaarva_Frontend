"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, Navigation, Phone, Mail } from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { geocodeAddress } from "@/lib/onboarding-utils";
import type { LocationData } from "@/contexts/HospitalOnboardingContextV2";

export default function LocationsContactsStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [geocoding, setGeocoding] = useState<string | null>(null);

  // 🔒 Safety check: Ensure locations is always an array
  const locations = Array.isArray(data.locations) ? data.locations : [];

  const addLocation = () => {
    const newLocation: LocationData = {
      id: `loc_${Date.now()}`,
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      geo: null,
      contact_phone: "",
      contact_email: "",
      services: [],
      is_headquarters: locations.length === 0,
    };

    updateData("locations", [...locations, newLocation]);
  };

  const updateLocation = (id: string, updates: Partial<LocationData>) => {
    const updatedLocations = locations.map((loc) =>
      loc.id === id ? { ...loc, ...updates } : loc
    );
    updateData("locations", updatedLocations);
  };

  const removeLocation = (id: string) => {
    updateData(
      "locations",
      locations.filter((loc) => loc.id !== id)
    );
  };

  const handleGeocode = async (id: string, address: string) => {
    setGeocoding(id);
    try {
      const result = await geocodeAddress(address);
      if (result) {
        updateLocation(id, { geo: { lat: result.lat, lng: result.lng } });
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setGeocoding(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Hospital Locations
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Add all your hospital locations and contact information
          </p>
        </div>
        <Button
          onClick={addLocation}
          className="bg-healthcare-primary hover:bg-healthcare-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Location Cards */}
      <AnimatePresence>
        {locations.map((location, index) => (
          <LocationCard
            key={location.id}
            location={location}
            index={index}
            onUpdate={(updates) => updateLocation(location.id, updates)}
            onRemove={() => removeLocation(location.id)}
            onGeocode={() =>
              handleGeocode(
                location.id,
                `${location.address}, ${location.city}, ${location.state} ${location.pincode}`
              )
            }
            isGeocoding={geocoding === location.id}
          />
        ))}
      </AnimatePresence>

      {/* Empty State */}
      {data.locations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
        >
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Locations Added
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Add your hospital&apos;s headquarters and any satellite locations
          </p>
          <Button
            onClick={addLocation}
            className="bg-healthcare-primary hover:bg-healthcare-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Location
          </Button>
        </motion.div>
      )}
    </div>
  );
}

interface LocationCardProps {
  location: LocationData;
  index: number;
  onUpdate: (updates: Partial<LocationData>) => void;
  onRemove: () => void;
  onGeocode: () => void;
  isGeocoding: boolean;
}

function LocationCard({
  location,
  index,
  onUpdate,
  onRemove,
  onGeocode,
  isGeocoding,
}: LocationCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showServices, setShowServices] = useState(false);

  const hasValidation =
    location.name &&
    location.address &&
    location.city &&
    location.state &&
    location.pincode;
  const hasGeocode = location.geo !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-gray-200 rounded-lg p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-healthcare-primary" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-semibold text-gray-900">
                Location #{index + 1}
              </h4>
              {location.is_headquarters && (
                <Badge className="bg-healthcare-primary">Headquarters</Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {location.name || "Unnamed Location"}
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

      {/* Form Grid */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Location Name" required>
            <Input
              value={location.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="e.g., Main Hospital, North Branch"
            />
          </FormField>

          <FormField label="Is Headquarters">
            <div className="flex items-center space-x-2 h-10">
              <Checkbox
                checked={location.is_headquarters}
                onCheckedChange={(checked) =>
                  onUpdate({ is_headquarters: checked as boolean })
                }
                id={`hq-${location.id}`}
              />
              <label
                htmlFor={`hq-${location.id}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                Mark as headquarters
              </label>
            </div>
          </FormField>
        </div>

        {/* Address */}
        <FormField label="Street Address" required>
          <Textarea
            value={location.address}
            onChange={(e) => onUpdate({ address: e.target.value })}
            placeholder="e.g., 123 Healthcare Street, Medical Complex"
            rows={2}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="City" required>
            <Input
              value={location.city}
              onChange={(e) => onUpdate({ city: e.target.value })}
              placeholder="e.g., Mumbai"
            />
          </FormField>

          <FormField label="State" required>
            <Input
              value={location.state}
              onChange={(e) => onUpdate({ state: e.target.value })}
              placeholder="e.g., Maharashtra"
            />
          </FormField>

          <FormField label="Pincode" required>
            <Input
              value={location.pincode}
              onChange={(e) => onUpdate({ pincode: e.target.value })}
              placeholder="e.g., 400001"
              maxLength={6}
            />
          </FormField>
        </div>

        {/* Geocoding */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Navigation
              className={cn(
                "w-4 h-4",
                hasGeocode ? "text-healthcare-emerald" : "text-gray-400"
              )}
            />
            <span className="text-sm text-gray-700">
              {hasGeocode
                ? `Geocoded: ${location.geo?.lat.toFixed(
                    4
                  )}, ${location.geo?.lng.toFixed(4)}`
                : "Not geocoded yet"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onGeocode}
            disabled={!hasValidation || isGeocoding}
          >
            {isGeocoding
              ? "Geocoding..."
              : hasGeocode
              ? "Update"
              : "Get Coordinates"}
          </Button>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Contact Phone" required>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={location.contact_phone}
                onChange={(e) => onUpdate({ contact_phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="pl-10"
              />
            </div>
          </FormField>

          <FormField label="Contact Email" required>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                value={location.contact_email}
                onChange={(e) => onUpdate({ contact_email: e.target.value })}
                placeholder="contact@hospital.com"
                className="pl-10"
              />
            </div>
          </FormField>
        </div>

        {/* Emergency Hotline */}
        <FormField label="Emergency Hotline (Optional)">
          <Input
            value={location.emergency_hotline || ""}
            onChange={(e) => onUpdate({ emergency_hotline: e.target.value })}
            placeholder="+91 99999 99999"
          />
        </FormField>
      </div>
    </motion.div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}
