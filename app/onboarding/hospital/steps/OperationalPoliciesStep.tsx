"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, FileText, MapPin, Video } from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { HelpPopover } from "../widgets/HelpPopover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface OperatingDay {
  id: string;
  day: string;
  open: string;
  close: string;
  is_closed?: boolean;
}

interface OperatingHours {
  location_id: string;
  hours: OperatingDay[];
}

interface OperationalPolicies {
  operating_hours: OperatingHours[];
  appointment_lead_time_hours: number;
  cancellation_policy: string;
  no_show_policy: string;
  telehealth_sop: string;
  patient_onboarding_steps: string[];
}

export default function OperationalPoliciesStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const operationalPolicies: OperationalPolicies = useMemo(() => {
    const policies = data?.operationalPolicies || {};
    return {
      operating_hours: Array.isArray(policies.operating_hours)
        ? policies.operating_hours
        : [],
      appointment_lead_time_hours: policies.appointment_lead_time_hours ?? 24,
      cancellation_policy: policies.cancellation_policy || "",
      no_show_policy: policies.no_show_policy || "",
      telehealth_sop: policies.telehealth_sop || "",
      patient_onboarding_steps: Array.isArray(policies.patient_onboarding_steps)
        ? policies.patient_onboarding_steps
        : [],
    };
  }, [data?.operationalPolicies]);

  const locations = useMemo(
    () => (Array.isArray(data?.locations) ? data.locations : []),
    [data?.locations]
  );

  const daysOfWeek = useMemo(
    () => [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    []
  );

  const operatingHours: OperatingHours[] = useMemo(() => {
    const hoursArray = operationalPolicies.operating_hours;
    if (!Array.isArray(hoursArray)) return [];

    return hoursArray.map((h) => ({
      location_id: h.location_id,
      hours: (Array.isArray(h.hours) ? h.hours : []).map((dh, idx) => ({
        id:
          dh.id ||
          `${h.location_id || "loc"}-${(
            dh.day ||
            daysOfWeek[idx] ||
            "day"
          ).toLowerCase()}-${idx}`,
        day: dh.day || daysOfWeek[idx % daysOfWeek.length] || "",
        open: dh.open || "09:00",
        close: dh.close || "18:00",
        is_closed: dh.is_closed ?? false,
      })),
    }));
  }, [daysOfWeek, operationalPolicies.operating_hours]);

  const patientOnboardingSteps = useMemo(
    () =>
      Array.isArray(operationalPolicies.patient_onboarding_steps)
        ? operationalPolicies.patient_onboarding_steps
        : [],
    [operationalPolicies.patient_onboarding_steps]
  );

  const initializeHoursForLocation = useCallback(
    (locationId: string) => {
      const existingHours = operatingHours.find(
        (h) => h.location_id === locationId
      );
      if (existingHours) return;

      const defaultHours: OperatingDay[] = daysOfWeek.map((day, idx) => ({
        id: `${locationId}-${day.toLowerCase()}-${idx}`,
        day,
        open: "09:00",
        close: "18:00",
        is_closed: day === "Sunday",
      }));

      const updatedPolicies: OperationalPolicies = {
        ...operationalPolicies,
        operating_hours: [
          ...operatingHours,
          { location_id: locationId, hours: defaultHours },
        ],
      };

      updateData("operationalPolicies", updatedPolicies);
    },
    [daysOfWeek, operatingHours, operationalPolicies, updateData]
  );

  const updateLocationHours = (
    locationId: string,
    dayIndex: number,
    updates: Partial<{ open: string; close: string; is_closed: boolean }>
  ) => {
    const updatedHours = operatingHours.map((h) => {
      if (h.location_id === locationId) {
        return {
          ...h,
          hours: h.hours.map((dayHours, idx) =>
            idx === dayIndex ? { ...dayHours, ...updates } : dayHours
          ),
        };
      }
      return h;
    });

    const updatedPolicies: OperationalPolicies = {
      ...operationalPolicies,
      operating_hours: updatedHours,
    };

    updateData("operationalPolicies", updatedPolicies);
  };

  const copyHoursToAllLocations = () => {
    if (!selectedLocation) return;

    const sourceHours = operatingHours.find(
      (h) => h.location_id === selectedLocation
    );
    if (!sourceHours) return;

    const updatedHours = locations.map((loc) => ({
      location_id: loc.id,
      hours: sourceHours.hours.map((dh, idx) => ({
        ...dh,
        id:
          dh.id ||
          `${loc.id || "loc"}-${(
            dh.day ||
            daysOfWeek[idx] ||
            "day"
          ).toLowerCase()}-${idx}`,
      })),
    }));

    const updatedPolicies: OperationalPolicies = {
      ...operationalPolicies,
      operating_hours: updatedHours,
    };

    updateData("operationalPolicies", updatedPolicies);
  };

  const addOnboardingStep = () => {
    const updatedPolicies: OperationalPolicies = {
      ...operationalPolicies,
      patient_onboarding_steps: [...patientOnboardingSteps, ""],
    };

    updateData("operationalPolicies", updatedPolicies);
  };

  const updateOnboardingStep = (index: number, value: string) => {
    const updated = [...patientOnboardingSteps];
    updated[index] = value;

    const updatedPolicies: OperationalPolicies = {
      ...operationalPolicies,
      patient_onboarding_steps: updated,
    };

    updateData("operationalPolicies", updatedPolicies);
  };

  const removeOnboardingStep = (index: number) => {
    const updatedPolicies: OperationalPolicies = {
      ...operationalPolicies,
      patient_onboarding_steps: patientOnboardingSteps.filter(
        (_, idx) => idx !== index
      ),
    };

    updateData("operationalPolicies", updatedPolicies);
  };

  useEffect(() => {
    if (locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0].id);
      initializeHoursForLocation(locations[0].id);
    }
  }, [initializeHoursForLocation, locations, selectedLocation]);

  const currentLocationHours = operatingHours.find(
    (h) => h.location_id === selectedLocation
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Operational Policies
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Define operating hours, policies, and patient onboarding procedures
        </p>
      </div>

      {/* Operating Hours */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Operating Hours</Label>
          <HelpPopover
            title="Operating Hours"
            content="Set operating hours for each location. You can copy hours to all locations for consistency."
          />
        </div>

        {locations.length > 0 ? (
          <>
            {/* Location Selector */}
            <div className="flex items-center gap-3">
              <Label className="text-sm">Location:</Label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  initializeHoursForLocation(e.target.value);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-healthcare-primary focus:border-transparent"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name || `Location ${loc.id}`}
                  </option>
                ))}
              </select>

              {locations.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyHoursToAllLocations}
                  className="whitespace-nowrap"
                >
                  Copy to All
                </Button>
              )}
            </div>

            {/* Hours Grid */}
            {currentLocationHours && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 gap-0 divide-y divide-gray-200">
                  {/* Header */}
                  <div className="col-span-4 bg-gray-50 px-4 py-3 grid grid-cols-4 gap-4 font-medium text-sm text-gray-700">
                    <div>Day</div>
                    <div>Opening Time</div>
                    <div>Closing Time</div>
                    <div>Closed</div>
                  </div>

                  {/* Days */}
                  {currentLocationHours.hours.map((dayHours, index) => (
                    <div
                      key={dayHours.day}
                      className="col-span-4 px-4 py-3 grid grid-cols-4 gap-4 items-center"
                    >
                      <div className="font-medium text-gray-900">
                        {dayHours.day}
                      </div>

                      <Input
                        type="time"
                        value={dayHours.open}
                        onChange={(e) =>
                          updateLocationHours(selectedLocation, index, {
                            open: e.target.value,
                          })
                        }
                        disabled={dayHours.is_closed}
                        className={cn(dayHours.is_closed && "opacity-50")}
                      />

                      <Input
                        type="time"
                        value={dayHours.close}
                        onChange={(e) =>
                          updateLocationHours(selectedLocation, index, {
                            close: e.target.value,
                          })
                        }
                        disabled={dayHours.is_closed}
                        className={cn(dayHours.is_closed && "opacity-50")}
                      />

                      <div className="flex items-center">
                        <Checkbox
                          checked={dayHours.is_closed}
                          onCheckedChange={(checked) =>
                            updateLocationHours(selectedLocation, index, {
                              is_closed: Boolean(checked),
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">
              Add locations in Step 2 to set operating hours
            </p>
          </div>
        )}
      </div>

      {/* Appointment Lead Time */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Appointment Lead Time</Label>
          <HelpPopover
            title="Lead Time"
            content="Minimum hours in advance patients must book appointments"
          />
        </div>

        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={operationalPolicies.appointment_lead_time_hours}
            onChange={(e) =>
              updateData("operationalPolicies", {
                ...operationalPolicies,
                appointment_lead_time_hours: parseInt(e.target.value, 10) || 0,
              })
            }
            min="0"
            className="w-32"
          />
          <span className="text-sm text-gray-600">hours in advance</span>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Cancellation Policy</Label>
          <HelpPopover
            title="Cancellation Policy"
            content="Explain your appointment cancellation rules, fees, and notice requirements"
          />
        </div>

        <Textarea
          value={operationalPolicies.cancellation_policy}
          onChange={(e) =>
            updateData("operationalPolicies", {
              ...operationalPolicies,
              cancellation_policy: e.target.value,
            })
          }
          placeholder="e.g., Patients may cancel appointments up to 24 hours in advance without penalty..."
          rows={4}
        />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FileText className="w-4 h-4" />
          {operationalPolicies.cancellation_policy.length} characters
        </div>
      </div>

      {/* No-Show Policy */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">No-Show Policy</Label>
          <HelpPopover
            title="No-Show Policy"
            content="Describe consequences and fees for missed appointments without notice"
          />
        </div>

        <Textarea
          value={operationalPolicies.no_show_policy}
          onChange={(e) =>
            updateData("operationalPolicies", {
              ...operationalPolicies,
              no_show_policy: e.target.value,
            })
          }
          placeholder="e.g., Patients who miss appointments without prior notice may be charged a no-show fee..."
          rows={4}
        />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FileText className="w-4 h-4" />
          {operationalPolicies.no_show_policy.length} characters
        </div>
      </div>

      {/* Telehealth SOP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            Telehealth Standard Operating Procedure
          </Label>
          <HelpPopover
            title="Telehealth SOP"
            content="Outline procedures for virtual consultations, technical requirements, and patient guidelines"
          />
        </div>

        <Textarea
          value={operationalPolicies.telehealth_sop}
          onChange={(e) =>
            updateData("operationalPolicies", {
              ...operationalPolicies,
              telehealth_sop: e.target.value,
            })
          }
          placeholder="e.g., Patients must have stable internet connection, camera, and microphone. Platform: [Name]. Appointment reminders sent 1 hour before..."
          rows={5}
        />
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Video className="w-4 h-4" />
          {operationalPolicies.telehealth_sop.length} characters
        </div>
      </div>

      {/* Patient Onboarding Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">
            Patient Onboarding Steps
          </Label>
          <Button onClick={addOnboardingStep} size="sm" variant="outline">
            Add Step
          </Button>
        </div>

        <div className="space-y-2">
          {patientOnboardingSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-healthcare-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-healthcare-primary">
                {index + 1}
              </div>
              <Input
                value={step}
                onChange={(e) => updateOnboardingStep(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeOnboardingStep(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}

          {patientOnboardingSteps.length === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm mb-3">
                No onboarding steps defined
              </p>
              <Button onClick={addOnboardingStep} variant="outline" size="sm">
                Add First Step
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
