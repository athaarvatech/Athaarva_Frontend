"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Layers,
  BedDouble,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Home,
  LayoutGrid,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  WingData,
  FloorData,
  WardData,
  BedData,
  WardType,
} from "@/contexts/HospitalOnboardingContextV2";

const WARD_TYPES: { value: WardType; label: string }[] = [
  { value: "general", label: "General Ward" },
  { value: "semi_private", label: "Semi-Private" },
  { value: "private_ac", label: "Private AC" },
  { value: "private_non_ac", label: "Private Non-AC" },
  { value: "deluxe", label: "Deluxe Suite" },
  { value: "vvip", label: "VVIP Suite" },
  { value: "economy", label: "Economy" },
  { value: "icu", label: "ICU" },
  { value: "iccu", label: "ICCU" },
  { value: "nicu", label: "NICU" },
  { value: "picu", label: "PICU" },
  { value: "hdu", label: "HDU" },
  { value: "isolation", label: "Isolation" },
  { value: "emergency", label: "Emergency" },
  { value: "labor", label: "Labor Room" },
  { value: "nursery", label: "Nursery" },
  { value: "recovery", label: "Recovery" },
  { value: "daycare", label: "Day Care" },
  { value: "dialysis", label: "Dialysis" },
];

// BedType options available: "standard", "electric", "bariatric", "pediatric", "maternity"
// Can be used for bed type selection UI when needed

function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function FacilityManagementStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [expandedWings, setExpandedWings] = useState<Set<string>>(new Set());
  const [expandedFloors, setExpandedFloors] = useState<Set<string>>(new Set());
  const [expandedWards, setExpandedWards] = useState<Set<string>>(new Set());

  const wings = data.facility?.wings || [];

  // Toggle functions
  const toggleWing = (wingId: string) => {
    setExpandedWings((prev) => {
      const next = new Set(prev);
      if (next.has(wingId)) {
        next.delete(wingId);
      } else {
        next.add(wingId);
      }
      return next;
    });
  };

  const toggleFloor = (floorId: string) => {
    setExpandedFloors((prev) => {
      const next = new Set(prev);
      if (next.has(floorId)) {
        next.delete(floorId);
      } else {
        next.add(floorId);
      }
      return next;
    });
  };

  const toggleWard = (wardId: string) => {
    setExpandedWards((prev) => {
      const next = new Set(prev);
      if (next.has(wardId)) {
        next.delete(wardId);
      } else {
        next.add(wardId);
      }
      return next;
    });
  };

  // WING operations
  const addWing = () => {
    const newWing: WingData = {
      id: generateId(),
      name: "",
      code: "",
      location_id: data.locations[0]?.id || "",
      type: "main_building",
      floors: [],
    };
    updateData("facility", { wings: [...wings, newWing] });
    setExpandedWings((prev) => new Set(prev).add(newWing.id));
  };

  const updateWing = (wingId: string, updates: Partial<WingData>) => {
    updateData("facility", {
      wings: wings.map((w) => (w.id === wingId ? { ...w, ...updates } : w)),
    });
  };

  const removeWing = (wingId: string) => {
    updateData("facility", {
      wings: wings.filter((w) => w.id !== wingId),
    });
  };

  // FLOOR operations
  const addFloor = (wingId: string) => {
    const wing = wings.find((w) => w.id === wingId);
    const floorCount = wing?.floors.length || 0;
    const newFloor: FloorData = {
      id: generateId(),
      name: `Floor ${floorCount + 1}`,
      code: `F${floorCount + 1}`,
      wards: [],
    };
    updateData("facility", {
      wings: wings.map((w) =>
        w.id === wingId ? { ...w, floors: [...w.floors, newFloor] } : w
      ),
    });
    setExpandedFloors((prev) => new Set(prev).add(newFloor.id));
  };

  const updateFloor = (
    wingId: string,
    floorId: string,
    updates: Partial<FloorData>
  ) => {
    updateData("facility", {
      wings: wings.map((w) =>
        w.id === wingId
          ? {
              ...w,
              floors: w.floors.map((f) =>
                f.id === floorId ? { ...f, ...updates } : f
              ),
            }
          : w
      ),
    });
  };

  const removeFloor = (wingId: string, floorId: string) => {
    updateData("facility", {
      wings: wings.map((w) =>
        w.id === wingId
          ? { ...w, floors: w.floors.filter((f) => f.id !== floorId) }
          : w
      ),
    });
  };

  // WARD operations
  const addWard = (wingId: string, floorId: string) => {
    const newWard: WardData = {
      id: generateId(),
      name: "",
      code: "",
      type: "general",
      gender_restriction: "any",
      nurse_station_id: "",
      beds: [],
    };
    updateData("facility", {
      wings: wings.map((w) =>
        w.id === wingId
          ? {
              ...w,
              floors: w.floors.map((f) =>
                f.id === floorId ? { ...f, wards: [...f.wards, newWard] } : f
              ),
            }
          : w
      ),
    });
    setExpandedWards((prev) => new Set(prev).add(newWard.id));
  };

  const updateWard = (
    wingId: string,
    floorId: string,
    wardId: string,
    updates: Partial<WardData>
  ) => {
    updateData("facility", {
      wings: wings.map((w) =>
        w.id === wingId
          ? {
              ...w,
              floors: w.floors.map((f) =>
                f.id === floorId
                  ? {
                      ...f,
                      wards: f.wards.map((ward) =>
                        ward.id === wardId ? { ...ward, ...updates } : ward
                      ),
                    }
                  : f
              ),
            }
          : w
      ),
    });
  };

  const removeWard = (wingId: string, floorId: string, wardId: string) => {
    updateData("facility", {
      wings: wings.map((w) =>
        w.id === wingId
          ? {
              ...w,
              floors: w.floors.map((f) =>
                f.id === floorId
                  ? {
                      ...f,
                      wards: f.wards.filter((ward) => ward.id !== wardId),
                    }
                  : f
              ),
            }
          : w
      ),
    });
  };

  // BED operations
  const addBed = (wingId: string, floorId: string, wardId: string) => {
    const ward = wings
      .find((w) => w.id === wingId)
      ?.floors.find((f) => f.id === floorId)
      ?.wards.find((w) => w.id === wardId);

    const newBed: BedData = {
      id: generateId(),
      bed_number: `BED-${(ward?.beds.length || 0) + 1}`,
      bed_type: "standard",
      status: "available",
      amenities: [],
      rent_per_day: 0,
      nursing_charge_per_day: 0,
      is_ventilator_equipped: false,
      is_monitored: false,
    };

    updateData("facility", {
      wings: wings.map((w) =>
        w.id === wingId
          ? {
              ...w,
              floors: w.floors.map((f) =>
                f.id === floorId
                  ? {
                      ...f,
                      wards: f.wards.map((ward) =>
                        ward.id === wardId
                          ? {
                              ...ward,
                              beds: [...ward.beds, newBed],
                            }
                          : ward
                      ),
                    }
                  : f
              ),
            }
          : w
      ),
    });
  };

  const removeBed = (
    wingId: string,
    floorId: string,
    wardId: string,
    bedId: string
  ) => {
    updateData("facility", {
      wings: wings.map((w) =>
        w.id === wingId
          ? {
              ...w,
              floors: w.floors.map((f) =>
                f.id === floorId
                  ? {
                      ...f,
                      wards: f.wards.map((ward) =>
                        ward.id === wardId
                          ? {
                              ...ward,
                              beds: ward.beds.filter((b) => b.id !== bedId),
                            }
                          : ward
                      ),
                    }
                  : f
              ),
            }
          : w
      ),
    });
  };

  // Bulk bed generation
  const generateBeds = (
    wingId: string,
    floorId: string,
    wardId: string,
    count: number
  ) => {
    const ward = wings
      .find((w) => w.id === wingId)
      ?.floors.find((f) => f.id === floorId)
      ?.wards.find((w) => w.id === wardId);

    if (!ward) return;

    const existingCount = ward.beds.length;
    const newBeds: BedData[] = [];

    for (let i = 0; i < count; i++) {
      newBeds.push({
        id: generateId(),
        bed_number: `${ward.code || "BED"}-${existingCount + i + 1}`,
        bed_type: "standard",
        status: "available",
        amenities: [],
        rent_per_day: 0,
        nursing_charge_per_day: 0,
        is_ventilator_equipped: false,
        is_monitored: false,
      });
    }

    updateData("facility", {
      wings: wings.map((w) =>
        w.id === wingId
          ? {
              ...w,
              floors: w.floors.map((f) =>
                f.id === floorId
                  ? {
                      ...f,
                      wards: f.wards.map((ward) =>
                        ward.id === wardId
                          ? {
                              ...ward,
                              beds: [...ward.beds, ...newBeds],
                            }
                          : ward
                      ),
                    }
                  : f
              ),
            }
          : w
      ),
    });
  };

  // Calculate totals
  const totalBeds = wings.reduce(
    (acc, wing) =>
      acc +
      wing.floors.reduce(
        (fAcc, floor) =>
          fAcc + floor.wards.reduce((wAcc, ward) => wAcc + ward.beds.length, 0),
        0
      ),
    0
  );

  const totalWards = wings.reduce(
    (acc, wing) =>
      acc + wing.floors.reduce((fAcc, floor) => fAcc + floor.wards.length, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-healthcare-primary/10 to-teal-100 border border-healthcare-primary/20 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Facility Infrastructure
            </h3>
            <p className="text-sm text-gray-600">
              Configure your hospital&apos;s physical layout: Wings → Floors →
              Wards → Beds
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-healthcare-primary">
                {wings.length}
              </div>
              <div className="text-xs text-gray-500">Wings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">
                {totalWards}
              </div>
              <div className="text-xs text-gray-500">Wards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {totalBeds}
              </div>
              <div className="text-xs text-gray-500">Beds</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Licensed Bed Count Warning */}
      {data.organizationProfile.bed_count_licensed > 0 &&
        totalBeds > data.organizationProfile.bed_count_licensed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Bed count exceeds licensed capacity
              </p>
              <p className="text-xs text-yellow-600">
                You have configured {totalBeds} beds, but your licensed capacity
                is {data.organizationProfile.bed_count_licensed} beds.
              </p>
            </div>
          </div>
        )}

      {/* Wings List */}
      <div className="space-y-4">
        <AnimatePresence>
          {wings.map((wing, wingIndex) => (
            <motion.div
              key={wing.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Wing Header */}
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleWing(wing.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedWings.has(wing.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <Building2 className="w-5 h-5 text-healthcare-primary" />
                  <div>
                    <span className="font-medium text-gray-900">
                      {wing.name || `Wing ${wingIndex + 1}`}
                    </span>
                    {wing.code && (
                      <Badge variant="outline" className="ml-2">
                        {wing.code}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{wing.floors.length} floors</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWing(wing.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* Wing Content */}
              <AnimatePresence>
                {expandedWings.has(wing.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200"
                  >
                    {/* Wing Details */}
                    <div className="p-4 bg-white border-b border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs">Wing Name *</Label>
                          <Input
                            value={wing.name}
                            onChange={(e) =>
                              updateWing(wing.id, { name: e.target.value })
                            }
                            placeholder="e.g., Main Building"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Wing Code *</Label>
                          <Input
                            value={wing.code}
                            onChange={(e) =>
                              updateWing(wing.id, {
                                code: e.target.value.toUpperCase(),
                              })
                            }
                            placeholder="e.g., MAIN"
                            className="mt-1"
                            maxLength={10}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Location</Label>
                          <Select
                            value={wing.location_id}
                            onValueChange={(v) =>
                              updateWing(wing.id, { location_id: v })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {data.locations.map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                  {loc.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Floors */}
                    <div className="p-4 space-y-3">
                      {wing.floors.map((floor) => (
                        <div
                          key={floor.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          {/* Floor Header */}
                          <div
                            className="flex items-center justify-between p-3 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                            onClick={() => toggleFloor(floor.id)}
                          >
                            <div className="flex items-center gap-3">
                              {expandedFloors.has(floor.id) ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                              <Layers className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">
                                {floor.name || "Unnamed Floor"}
                              </span>
                              {floor.code && (
                                <Badge variant="outline" className="text-xs">
                                  {floor.code}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {floor.wards.length} wards
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFloor(wing.id, floor.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>

                          {/* Floor Content */}
                          <AnimatePresence>
                            {expandedFloors.has(floor.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-gray-200"
                              >
                                {/* Floor Details */}
                                <div className="p-3 bg-white border-b border-gray-100">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label className="text-xs">
                                        Floor Name *
                                      </Label>
                                      <Input
                                        value={floor.name}
                                        onChange={(e) =>
                                          updateFloor(wing.id, floor.id, {
                                            name: e.target.value,
                                          })
                                        }
                                        placeholder="e.g., Ground Floor"
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">
                                        Floor Code *
                                      </Label>
                                      <Input
                                        value={floor.code}
                                        onChange={(e) =>
                                          updateFloor(wing.id, floor.id, {
                                            code: e.target.value.toUpperCase(),
                                          })
                                        }
                                        placeholder="e.g., GF, F1, B1"
                                        className="mt-1"
                                        maxLength={5}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Wards */}
                                <div className="p-3 space-y-2">
                                  {floor.wards.map((ward, wardIndex) => (
                                    <div
                                      key={ward.id}
                                      className="border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                      {/* Ward Header */}
                                      <div
                                        className="flex items-center justify-between p-2 bg-teal-50 cursor-pointer hover:bg-teal-100 transition-colors"
                                        onClick={() => toggleWard(ward.id)}
                                      >
                                        <div className="flex items-center gap-2">
                                          {expandedWards.has(ward.id) ? (
                                            <ChevronDown className="w-3 h-3 text-gray-500" />
                                          ) : (
                                            <ChevronRight className="w-3 h-3 text-gray-500" />
                                          )}
                                          <Home className="w-4 h-4 text-teal-600" />
                                          <span className="text-sm">
                                            {ward.name ||
                                              `Ward ${wardIndex + 1}`}
                                          </span>
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {
                                              WARD_TYPES.find(
                                                (t) => t.value === ward.type
                                              )?.label
                                            }
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {ward.beds.length} beds
                                          </Badge>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeWard(
                                                wing.id,
                                                floor.id,
                                                ward.id
                                              );
                                            }}
                                          >
                                            <Trash2 className="w-3 h-3 text-red-500" />
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Ward Content */}
                                      <AnimatePresence>
                                        {expandedWards.has(ward.id) && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                              opacity: 1,
                                              height: "auto",
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-gray-200 p-3 bg-white"
                                          >
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                              <div>
                                                <Label className="text-xs">
                                                  Ward Name *
                                                </Label>
                                                <Input
                                                  value={ward.name}
                                                  onChange={(e) =>
                                                    updateWard(
                                                      wing.id,
                                                      floor.id,
                                                      ward.id,
                                                      { name: e.target.value }
                                                    )
                                                  }
                                                  placeholder="e.g., General Ward A"
                                                  className="mt-1"
                                                />
                                              </div>
                                              <div>
                                                <Label className="text-xs">
                                                  Ward Code *
                                                </Label>
                                                <Input
                                                  value={ward.code}
                                                  onChange={(e) =>
                                                    updateWard(
                                                      wing.id,
                                                      floor.id,
                                                      ward.id,
                                                      {
                                                        code: e.target.value.toUpperCase(),
                                                      }
                                                    )
                                                  }
                                                  placeholder="e.g., GWA"
                                                  className="mt-1"
                                                  maxLength={10}
                                                />
                                              </div>
                                              <div>
                                                <Label className="text-xs">
                                                  Ward Type *
                                                </Label>
                                                <Select
                                                  value={ward.type}
                                                  onValueChange={(v) =>
                                                    updateWard(
                                                      wing.id,
                                                      floor.id,
                                                      ward.id,
                                                      { type: v as WardType }
                                                    )
                                                  }
                                                >
                                                  <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {WARD_TYPES.map((type) => (
                                                      <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                      >
                                                        {type.label}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div>
                                                <Label className="text-xs">
                                                  Gender Restriction
                                                </Label>
                                                <Select
                                                  value={
                                                    ward.gender_restriction ||
                                                    "any"
                                                  }
                                                  onValueChange={(v) =>
                                                    updateWard(
                                                      wing.id,
                                                      floor.id,
                                                      ward.id,
                                                      {
                                                        gender_restriction:
                                                          v as
                                                            | "any"
                                                            | "male"
                                                            | "female",
                                                      }
                                                    )
                                                  }
                                                >
                                                  <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="any">
                                                      Any (No Restriction)
                                                    </SelectItem>
                                                    <SelectItem value="male">
                                                      Male Only
                                                    </SelectItem>
                                                    <SelectItem value="female">
                                                      Female Only
                                                    </SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </div>

                                            {/* Beds Grid */}
                                            <div className="border-t border-gray-100 pt-3">
                                              <div className="flex items-center justify-between mb-2">
                                                <Label className="text-xs font-medium">
                                                  Beds ({ward.beds.length})
                                                </Label>
                                                <div className="flex gap-2">
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      generateBeds(
                                                        wing.id,
                                                        floor.id,
                                                        ward.id,
                                                        5
                                                      )
                                                    }
                                                  >
                                                    <LayoutGrid className="w-3 h-3 mr-1" />
                                                    +5 Beds
                                                  </Button>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      addBed(
                                                        wing.id,
                                                        floor.id,
                                                        ward.id
                                                      )
                                                    }
                                                  >
                                                    <Plus className="w-3 h-3 mr-1" />
                                                    Add Bed
                                                  </Button>
                                                </div>
                                              </div>
                                              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                                {ward.beds.map((bed) => (
                                                  <div
                                                    key={bed.id}
                                                    className={cn(
                                                      "relative group p-2 border rounded-md text-center text-xs cursor-pointer hover:border-healthcare-primary transition-colors",
                                                      bed.status ===
                                                        "available" &&
                                                        "bg-green-50 border-green-200",
                                                      bed.status ===
                                                        "maintenance" &&
                                                        "bg-gray-50 border-gray-200"
                                                    )}
                                                  >
                                                    <BedDouble className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                                                    <div className="truncate">
                                                      {bed.bed_number}
                                                    </div>
                                                    <button
                                                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                      onClick={() =>
                                                        removeBed(
                                                          wing.id,
                                                          floor.id,
                                                          ward.id,
                                                          bed.id
                                                        )
                                                      }
                                                    >
                                                      ×
                                                    </button>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  ))}

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => addWard(wing.id, floor.id)}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Ward
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => addFloor(wing.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Floor
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Wing Button */}
        <Button
          variant="outline"
          className="w-full border-dashed border-2 py-8"
          onClick={addWing}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Wing / Building
        </Button>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          💡 Facility Setup Tips
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>
            • <strong>Wings:</strong> Separate buildings or major sections of
            your facility
          </li>
          <li>
            • <strong>Floors:</strong> Physical levels within each wing (can be
            negative for basements)
          </li>
          <li>
            • <strong>Wards:</strong> Patient care areas with specific bed types
            (ICU, General, Private, etc.)
          </li>
          <li>
            • <strong>Beds:</strong> Individual patient beds - use bulk add for
            efficiency
          </li>
        </ul>
      </div>
    </div>
  );
}
