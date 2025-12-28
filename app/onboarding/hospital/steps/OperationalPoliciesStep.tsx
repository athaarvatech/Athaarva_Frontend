"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, MapPin, Building2 } from "lucide-react";
import {
  useHospitalOnboarding,
  OperatingHoursData,
  OPDHours,
  PharmacyHours,
  AppointmentPolicies,
  IPDPolicies,
} from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function OperationalPoliciesStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  // Safely access data with useMemo
  const locations = useMemo(
    () => (Array.isArray(data.locations) ? data.locations : []),
    [data.locations]
  );

  const operationalPolicies = useMemo(
    () =>
      data.operationalPolicies || {
        operating_hours: [],
        appointment_policies: {
          min_booking_advance_hours: 2,
          max_booking_advance_days: 30,
          cancellation_cutoff_hours: 24,
          cancellation_charge_percentage: 0,
          no_show_charge_percentage: 50,
          reschedule_allowed: true,
          reschedule_limit: 2,
          reminder_sms_enabled: true,
          reminder_hours_before: [24, 2],
          confirmation_required: false,
          auto_cancel_unconfirmed: false,
        },
        ipd_policies: {
          checkout_time: "11:00",
          late_checkout_charge: 500,
          admission_deposit_required: true,
          deposit_amount_icu: 50000,
          deposit_amount_general: 20000,
          interim_bill_frequency_days: 3,
          discharge_clearance_departments: ["billing", "pharmacy", "nursing"],
        },
        consent_languages: ["english", "hindi"],
      },
    [data.operationalPolicies]
  );

  const operatingHours = useMemo(
    () =>
      Array.isArray(operationalPolicies.operating_hours)
        ? operationalPolicies.operating_hours
        : [],
    [operationalPolicies.operating_hours]
  );

  const appointmentPolicies: AppointmentPolicies = useMemo(
    () =>
      operationalPolicies.appointment_policies || {
        min_booking_advance_hours: 2,
        max_booking_advance_days: 30,
        cancellation_cutoff_hours: 24,
        cancellation_charge_percentage: 0,
        no_show_charge_percentage: 50,
        reschedule_allowed: true,
        reschedule_limit: 2,
        reminder_sms_enabled: true,
        reminder_hours_before: [24, 2],
        confirmation_required: false,
        auto_cancel_unconfirmed: false,
      },
    [operationalPolicies.appointment_policies]
  );

  const ipdPolicies: IPDPolicies = useMemo(
    () =>
      operationalPolicies.ipd_policies || {
        checkout_time: "11:00",
        late_checkout_charge: 500,
        admission_deposit_required: true,
        deposit_amount_icu: 50000,
        deposit_amount_general: 20000,
        interim_bill_frequency_days: 3,
        discharge_clearance_departments: ["billing", "pharmacy", "nursing"],
      },
    [operationalPolicies.ipd_policies]
  );

  // Initialize selected location
  useEffect(() => {
    if (locations.length > 0 && !selectedLocationId) {
      setSelectedLocationId(locations[0].id);
    }
  }, [locations, selectedLocationId]);

  // Create default OPD hours for a day
  const createDefaultOPDHours = (day: string): OPDHours => ({
    day,
    morning_start: "09:00",
    morning_end: "13:00",
    evening_start: "16:00",
    evening_end: "20:00",
    is_closed: day === "Sunday",
  });

  // Create default Pharmacy hours for a day
  const createDefaultPharmacyHours = (day: string): PharmacyHours => ({
    day,
    open: "08:00",
    close: "22:00",
    is_24x7: false,
  });

  // Get or create operating hours for a location
  const getLocationHours = useCallback(
    (locationId: string): OperatingHoursData => {
      const existing = operatingHours.find((h) => h.location_id === locationId);
      if (existing) return existing;

      return {
        location_id: locationId,
        opd_hours: DAYS_OF_WEEK.map(createDefaultOPDHours),
        emergency_24x7: false,
        pharmacy_hours: DAYS_OF_WEEK.map(createDefaultPharmacyHours),
      };
    },
    [operatingHours]
  );

  // Initialize hours for location if not exists
  const initializeLocationHours = useCallback(
    (locationId: string) => {
      const existing = operatingHours.find((h) => h.location_id === locationId);
      if (!existing) {
        const newHours = getLocationHours(locationId);
        updateData("operationalPolicies", {
          ...operationalPolicies,
          operating_hours: [...operatingHours, newHours],
        });
      }
    },
    [operatingHours, getLocationHours, updateData, operationalPolicies]
  );

  useEffect(() => {
    if (selectedLocationId) {
      initializeLocationHours(selectedLocationId);
    }
  }, [selectedLocationId, initializeLocationHours]);

  const currentLocationHours = getLocationHours(selectedLocationId);

  // Update OPD hours
  const updateOPDHours = (dayIndex: number, updates: Partial<OPDHours>) => {
    const updatedHours = operatingHours.map((h) => {
      if (h.location_id === selectedLocationId) {
        return {
          ...h,
          opd_hours: h.opd_hours.map((dh, idx) =>
            idx === dayIndex ? { ...dh, ...updates } : dh
          ),
        };
      }
      return h;
    });

    // If location doesn't exist in array, add it
    if (!operatingHours.find((h) => h.location_id === selectedLocationId)) {
      const newHours = {
        ...getLocationHours(selectedLocationId),
        opd_hours: getLocationHours(selectedLocationId).opd_hours.map(
          (dh, idx) => (idx === dayIndex ? { ...dh, ...updates } : dh)
        ),
      };
      updatedHours.push(newHours);
    }

    updateData("operationalPolicies", {
      ...operationalPolicies,
      operating_hours: updatedHours,
    });
  };

  // Update Pharmacy hours
  const updatePharmacyHours = (
    dayIndex: number,
    updates: Partial<PharmacyHours>
  ) => {
    const updatedHours = operatingHours.map((h) => {
      if (h.location_id === selectedLocationId) {
        return {
          ...h,
          pharmacy_hours: h.pharmacy_hours.map((ph, idx) =>
            idx === dayIndex ? { ...ph, ...updates } : ph
          ),
        };
      }
      return h;
    });

    if (!operatingHours.find((h) => h.location_id === selectedLocationId)) {
      const newHours = {
        ...getLocationHours(selectedLocationId),
        pharmacy_hours: getLocationHours(selectedLocationId).pharmacy_hours.map(
          (ph, idx) => (idx === dayIndex ? { ...ph, ...updates } : ph)
        ),
      };
      updatedHours.push(newHours);
    }

    updateData("operationalPolicies", {
      ...operationalPolicies,
      operating_hours: updatedHours,
    });
  };

  // Toggle 24x7 emergency
  const toggleEmergency24x7 = (enabled: boolean) => {
    const updatedHours = operatingHours.map((h) => {
      if (h.location_id === selectedLocationId) {
        return { ...h, emergency_24x7: enabled };
      }
      return h;
    });

    if (!operatingHours.find((h) => h.location_id === selectedLocationId)) {
      updatedHours.push({
        ...getLocationHours(selectedLocationId),
        emergency_24x7: enabled,
      });
    }

    updateData("operationalPolicies", {
      ...operationalPolicies,
      operating_hours: updatedHours,
    });
  };

  // Update Appointment Policies
  const updateAppointmentPolicy = (updates: Partial<AppointmentPolicies>) => {
    updateData("operationalPolicies", {
      ...operationalPolicies,
      appointment_policies: { ...appointmentPolicies, ...updates },
    });
  };

  // Update IPD Policies
  const updateIPDPolicy = (updates: Partial<IPDPolicies>) => {
    updateData("operationalPolicies", {
      ...operationalPolicies,
      ipd_policies: { ...ipdPolicies, ...updates },
    });
  };

  // Copy hours to all locations
  const copyHoursToAllLocations = () => {
    if (!selectedLocationId) return;

    const sourceHours = currentLocationHours;
    const updatedHours = locations.map((loc) => ({
      ...sourceHours,
      location_id: loc.id,
    }));

    updateData("operationalPolicies", {
      ...operationalPolicies,
      operating_hours: updatedHours,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Operational Policies
        </h2>
        <p className="text-gray-600 mt-1">
          Configure operating hours, appointment policies, and IPD guidelines
        </p>
      </div>

      <Tabs defaultValue="hours" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hours" className="gap-2">
            <Clock className="h-4 w-4" />
            Operating Hours
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <Calendar className="h-4 w-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="ipd" className="gap-2">
            <Building2 className="h-4 w-4" />
            IPD Policies
          </TabsTrigger>
        </TabsList>

        {/* Operating Hours Tab */}
        <TabsContent value="hours" className="space-y-6 mt-6">
          {locations.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No locations configured
                </h3>
                <p className="text-gray-500 text-center">
                  Add locations in Step 2 to configure operating hours
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Location Selector */}
              <div className="flex items-center gap-4">
                <Label>Select Location:</Label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name || `Location ${loc.id.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
                {locations.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyHoursToAllLocations}
                  >
                    Copy to All Locations
                  </Button>
                )}
              </div>

              {/* Emergency 24x7 Toggle */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        24x7 Emergency Services
                      </CardTitle>
                      <CardDescription>
                        Enable if this location has round-the-clock emergency
                        services
                      </CardDescription>
                    </div>
                    <Switch
                      checked={currentLocationHours.emergency_24x7}
                      onCheckedChange={toggleEmergency24x7}
                    />
                  </div>
                </CardHeader>
              </Card>

              {/* OPD Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">OPD Hours</CardTitle>
                  <CardDescription>
                    Set outpatient department timings (morning and evening
                    sessions)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-500 pb-2 border-b">
                      <div>Day</div>
                      <div>Morning Start</div>
                      <div>Morning End</div>
                      <div>Evening Start</div>
                      <div>Evening End</div>
                      <div>Closed</div>
                    </div>
                    {currentLocationHours.opd_hours.map((dh, index) => (
                      <div
                        key={dh.day}
                        className="grid grid-cols-6 gap-2 items-center"
                      >
                        <div className="font-medium text-sm">{dh.day}</div>
                        <Input
                          type="time"
                          value={dh.morning_start}
                          onChange={(e) =>
                            updateOPDHours(index, {
                              morning_start: e.target.value,
                            })
                          }
                          disabled={dh.is_closed}
                          className={cn(
                            "text-sm",
                            dh.is_closed && "opacity-50"
                          )}
                        />
                        <Input
                          type="time"
                          value={dh.morning_end}
                          onChange={(e) =>
                            updateOPDHours(index, {
                              morning_end: e.target.value,
                            })
                          }
                          disabled={dh.is_closed}
                          className={cn(
                            "text-sm",
                            dh.is_closed && "opacity-50"
                          )}
                        />
                        <Input
                          type="time"
                          value={dh.evening_start}
                          onChange={(e) =>
                            updateOPDHours(index, {
                              evening_start: e.target.value,
                            })
                          }
                          disabled={dh.is_closed}
                          className={cn(
                            "text-sm",
                            dh.is_closed && "opacity-50"
                          )}
                        />
                        <Input
                          type="time"
                          value={dh.evening_end}
                          onChange={(e) =>
                            updateOPDHours(index, {
                              evening_end: e.target.value,
                            })
                          }
                          disabled={dh.is_closed}
                          className={cn(
                            "text-sm",
                            dh.is_closed && "opacity-50"
                          )}
                        />
                        <Checkbox
                          checked={dh.is_closed}
                          onCheckedChange={(checked) =>
                            updateOPDHours(index, { is_closed: !!checked })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pharmacy Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pharmacy Hours</CardTitle>
                  <CardDescription>
                    Set pharmacy operating hours for each day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
                      <div>Day</div>
                      <div>Opening</div>
                      <div>Closing</div>
                      <div>24x7</div>
                    </div>
                    {currentLocationHours.pharmacy_hours.map((ph, index) => (
                      <div
                        key={ph.day}
                        className="grid grid-cols-4 gap-4 items-center"
                      >
                        <div className="font-medium">{ph.day}</div>
                        <Input
                          type="time"
                          value={ph.open}
                          onChange={(e) =>
                            updatePharmacyHours(index, { open: e.target.value })
                          }
                          disabled={ph.is_24x7}
                          className={cn(ph.is_24x7 && "opacity-50")}
                        />
                        <Input
                          type="time"
                          value={ph.close}
                          onChange={(e) =>
                            updatePharmacyHours(index, {
                              close: e.target.value,
                            })
                          }
                          disabled={ph.is_24x7}
                          className={cn(ph.is_24x7 && "opacity-50")}
                        />
                        <Checkbox
                          checked={ph.is_24x7}
                          onCheckedChange={(checked) =>
                            updatePharmacyHours(index, { is_24x7: !!checked })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Appointment Policies Tab */}
        <TabsContent value="appointments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Rules</CardTitle>
              <CardDescription>
                Configure advance booking and scheduling rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Minimum Booking Advance (Hours)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={appointmentPolicies.min_booking_advance_hours}
                    onChange={(e) =>
                      updateAppointmentPolicy({
                        min_booking_advance_hours:
                          parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    How early must patients book?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Advance Booking (Days)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={appointmentPolicies.max_booking_advance_days}
                    onChange={(e) =>
                      updateAppointmentPolicy({
                        max_booking_advance_days: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    How far in advance can patients book?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cancellation & No-Show</CardTitle>
              <CardDescription>
                Configure cancellation rules and fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Cancellation Cutoff (Hours)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={appointmentPolicies.cancellation_cutoff_hours}
                    onChange={(e) =>
                      updateAppointmentPolicy({
                        cancellation_cutoff_hours:
                          parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Free cancellation deadline before appointment
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Cancellation Charge (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={appointmentPolicies.cancellation_charge_percentage}
                    onChange={(e) =>
                      updateAppointmentPolicy({
                        cancellation_charge_percentage:
                          parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Fee if cancelled after cutoff
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>No-Show Charge (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={appointmentPolicies.no_show_charge_percentage}
                    onChange={(e) =>
                      updateAppointmentPolicy({
                        no_show_charge_percentage:
                          parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Fee for missed appointments
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Rescheduling</Label>
                    <p className="text-xs text-gray-500">
                      Patients can reschedule appointments
                    </p>
                  </div>
                  <Switch
                    checked={appointmentPolicies.reschedule_allowed}
                    onCheckedChange={(checked) =>
                      updateAppointmentPolicy({ reschedule_allowed: checked })
                    }
                  />
                </div>

                {appointmentPolicies.reschedule_allowed && (
                  <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                    <Label>Reschedule Limit</Label>
                    <Input
                      type="number"
                      min={1}
                      className="w-32"
                      value={appointmentPolicies.reschedule_limit || 2}
                      onChange={(e) =>
                        updateAppointmentPolicy({
                          reschedule_limit: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reminders & Confirmation</CardTitle>
              <CardDescription>
                Configure appointment reminders and confirmation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Reminders</Label>
                  <p className="text-xs text-gray-500">
                    Send reminder SMS to patients
                  </p>
                </div>
                <Switch
                  checked={appointmentPolicies.reminder_sms_enabled}
                  onCheckedChange={(checked) =>
                    updateAppointmentPolicy({ reminder_sms_enabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Confirmation</Label>
                  <p className="text-xs text-gray-500">
                    Patients must confirm appointments
                  </p>
                </div>
                <Switch
                  checked={appointmentPolicies.confirmation_required}
                  onCheckedChange={(checked) =>
                    updateAppointmentPolicy({ confirmation_required: checked })
                  }
                />
              </div>

              {appointmentPolicies.confirmation_required && (
                <div className="flex items-center justify-between pl-4 border-l-2 border-gray-200">
                  <div>
                    <Label>Auto-Cancel Unconfirmed</Label>
                    <p className="text-xs text-gray-500">
                      Cancel if not confirmed before cutoff
                    </p>
                  </div>
                  <Switch
                    checked={appointmentPolicies.auto_cancel_unconfirmed}
                    onCheckedChange={(checked) =>
                      updateAppointmentPolicy({
                        auto_cancel_unconfirmed: checked,
                      })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* IPD Policies Tab */}
        <TabsContent value="ipd" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Checkout & Timing</CardTitle>
              <CardDescription>
                Configure IPD checkout times and late fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Standard Checkout Time</Label>
                  <Input
                    type="time"
                    value={ipdPolicies.checkout_time}
                    onChange={(e) =>
                      updateIPDPolicy({ checkout_time: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Late Checkout Charge (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={ipdPolicies.late_checkout_charge || 0}
                    onChange={(e) =>
                      updateIPDPolicy({
                        late_checkout_charge: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admission Deposits</CardTitle>
              <CardDescription>
                Configure deposit requirements for admissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Admission Deposit</Label>
                  <p className="text-xs text-gray-500">
                    Collect deposit at the time of admission
                  </p>
                </div>
                <Switch
                  checked={ipdPolicies.admission_deposit_required}
                  onCheckedChange={(checked) =>
                    updateIPDPolicy({ admission_deposit_required: checked })
                  }
                />
              </div>

              {ipdPolicies.admission_deposit_required && (
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>ICU Deposit Amount (₹)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={ipdPolicies.deposit_amount_icu || 0}
                      onChange={(e) =>
                        updateIPDPolicy({
                          deposit_amount_icu: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>General Ward Deposit (₹)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={ipdPolicies.deposit_amount_general || 0}
                      onChange={(e) =>
                        updateIPDPolicy({
                          deposit_amount_general: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing & Discharge</CardTitle>
              <CardDescription>
                Configure billing frequency and discharge clearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Interim Bill Frequency (Days)</Label>
                <Input
                  type="number"
                  min={1}
                  className="w-32"
                  value={ipdPolicies.interim_bill_frequency_days}
                  onChange={(e) =>
                    updateIPDPolicy({
                      interim_bill_frequency_days:
                        parseInt(e.target.value) || 1,
                    })
                  }
                />
                <p className="text-xs text-gray-500">
                  How often to generate interim bills during stay
                </p>
              </div>

              <div className="space-y-3">
                <Label>Discharge Clearance Departments</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Departments that must clear before discharge
                </p>
                <div className="flex flex-wrap gap-2">
                  {(ipdPolicies.discharge_clearance_departments || []).map(
                    (dept) => (
                      <Badge
                        key={dept}
                        variant="secondary"
                        className="capitalize"
                      >
                        {dept}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
