"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  FlaskConical,
  Wrench,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  DepartmentData,
  CostCenterData,
  DepartmentType,
} from "@/contexts/HospitalOnboardingContextV2";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const DEPARTMENT_TYPES: {
  value: DepartmentType;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    value: "clinical",
    label: "Clinical",
    icon: Stethoscope,
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "diagnostic",
    label: "Diagnostic",
    icon: FlaskConical,
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "support",
    label: "Support",
    icon: Wrench,
    color: "bg-amber-100 text-amber-700",
  },
  {
    value: "administrative",
    label: "Administrative",
    icon: Briefcase,
    color: "bg-gray-100 text-gray-700",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COST_CENTER_TYPES = [
  { value: "revenue", label: "Revenue Center" },
  { value: "cost", label: "Cost Center" },
  { value: "overhead", label: "Overhead Center" },
];

const COMMON_SPECIALIZATIONS = [
  "General Medicine",
  "General Surgery",
  "Orthopedics",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Gynecology",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Urology",
  "Nephrology",
  "Oncology",
  "Gastroenterology",
  "Pulmonology",
  "Psychiatry",
  "Radiology",
  "Pathology",
  "Anesthesiology",
  "Emergency Medicine",
];

export default function DepartmentsStaffStep() {
  const { data, updateData } = useHospitalOnboarding();
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [expandedCostCenters, setExpandedCostCenters] = useState<Set<string>>(
    new Set()
  );
  const [newSpec, setNewSpec] = useState<{ [key: string]: string }>({});

  const departments = Array.isArray(data.departments) ? data.departments : [];
  const costCenters = Array.isArray(data.costCenters) ? data.costCenters : [];

  // Toggle expansion
  const toggleDeptExpansion = (deptId: string) => {
    const newSet = new Set(expandedDepts);
    if (newSet.has(deptId)) {
      newSet.delete(deptId);
    } else {
      newSet.add(deptId);
    }
    setExpandedDepts(newSet);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleCostCenterExpansion = (ccId: string) => {
    const newSet = new Set(expandedCostCenters);
    if (newSet.has(ccId)) {
      newSet.delete(ccId);
    } else {
      newSet.add(ccId);
    }
    setExpandedCostCenters(newSet);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Department CRUD
  // ─────────────────────────────────────────────────────────────────────────────

  const addDepartment = () => {
    const newDept: DepartmentData = {
      id: `dept_${Date.now()}`,
      name: "",
      code: "",
      type: "clinical",
      cost_center_code: "",
      location_ids: [],
      is_revenue_generating: true,
      is_opd_enabled: true,
      is_ipd_enabled: false,
      default_consultation_duration: 15,
      specializations: [],
    };
    updateData("departments", [...departments, newDept]);
    setExpandedDepts(new Set([...expandedDepts, newDept.id]));
  };

  const updateDepartment = (
    deptId: string,
    updates: Partial<DepartmentData>
  ) => {
    updateData(
      "departments",
      departments.map((dept: DepartmentData) =>
        dept.id === deptId ? { ...dept, ...updates } : dept
      )
    );
  };

  const removeDepartment = (deptId: string) => {
    updateData(
      "departments",
      departments.filter((dept: DepartmentData) => dept.id !== deptId)
    );
    const newSet = new Set(expandedDepts);
    newSet.delete(deptId);
    setExpandedDepts(newSet);
  };

  const addSpecialization = (deptId: string, spec: string) => {
    const dept = departments.find((d: DepartmentData) => d.id === deptId);
    if (dept && spec.trim() && !dept.specializations.includes(spec.trim())) {
      updateDepartment(deptId, {
        specializations: [...dept.specializations, spec.trim()],
      });
    }
    setNewSpec({ ...newSpec, [deptId]: "" });
  };

  const removeSpecialization = (deptId: string, spec: string) => {
    const dept = departments.find((d: DepartmentData) => d.id === deptId);
    if (dept) {
      updateDepartment(deptId, {
        specializations: dept.specializations.filter((s: string) => s !== spec),
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Cost Center CRUD
  // ─────────────────────────────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addCostCenter = () => {
    const newCC: CostCenterData = {
      id: `cc_${Date.now()}`,
      code: "",
      name: "",
      type: "revenue",
      gl_account_prefix: "",
    };
    updateData("costCenters", [...costCenters, newCC]);
    setExpandedCostCenters(new Set([...expandedCostCenters, newCC.id]));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateCostCenter = (ccId: string, updates: Partial<CostCenterData>) => {
    updateData(
      "costCenters",
      costCenters.map((cc: CostCenterData) =>
        cc.id === ccId ? { ...cc, ...updates } : cc
      )
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeCostCenter = (ccId: string) => {
    updateData(
      "costCenters",
      costCenters.filter((cc: CostCenterData) => cc.id !== ccId)
    );
    const newSet = new Set(expandedCostCenters);
    newSet.delete(ccId);
    setExpandedCostCenters(newSet);
  };

  // Get department type info
  const getDeptTypeInfo = (type: DepartmentType) => {
    return (
      DEPARTMENT_TYPES.find((t) => t.value === type) || DEPARTMENT_TYPES[0]
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
          <Building2 className="h-6 w-6 text-teal-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Departments
          </h2>
          <p className="text-gray-600">
            Configure clinical departments and specializations
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SECTION 1: Clinical Departments
      ═══════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Clinical Departments
            </h3>
          </div>
          <Button
            onClick={addDepartment}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>

        <div className="mb-4 flex items-start gap-2 rounded-lg bg-blue-50 p-4">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              Define your hospital departments for OPD/IPD scheduling and
              revenue tracking.
            </p>
          </div>
        </div>

        {departments.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              No departments configured yet.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Add departments to enable OPD scheduling and billing.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {departments.map((dept: DepartmentData, index: number) => {
              const isExpanded = expandedDepts.has(dept.id);
              const typeInfo = getDeptTypeInfo(dept.type);
              const TypeIcon = typeInfo.icon;

              return (
                <div
                  key={dept.id}
                  className="rounded-lg border border-gray-200 bg-gray-50"
                >
                  {/* Department Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleDeptExpansion(dept.id)}
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                      <div className={`p-2 rounded ${typeInfo.color}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          {dept.name || `Department ${index + 1}`}
                        </span>
                        {dept.code && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({dept.code})
                          </span>
                        )}
                        <div className="flex gap-2 mt-1">
                          {dept.is_opd_enabled && (
                            <Badge variant="outline" className="text-xs">
                              OPD
                            </Badge>
                          )}
                          {dept.is_ipd_enabled && (
                            <Badge variant="outline" className="text-xs">
                              IPD
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDepartment(dept.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Department Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-200 p-4 space-y-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Department Name */}
                            <div className="space-y-2">
                              <Label>Department Name *</Label>
                              <Input
                                value={dept.name}
                                onChange={(e) =>
                                  updateDepartment(dept.id, {
                                    name: e.target.value,
                                  })
                                }
                                placeholder="e.g., General Medicine"
                              />
                            </div>

                            {/* Department Code */}
                            <div className="space-y-2">
                              <Label>Department Code *</Label>
                              <Input
                                value={dept.code}
                                onChange={(e) =>
                                  updateDepartment(dept.id, {
                                    code: e.target.value.toUpperCase(),
                                  })
                                }
                                placeholder="e.g., GENMED"
                                maxLength={10}
                              />
                            </div>

                            {/* Department Type */}
                            <div className="space-y-2">
                              <Label>Department Type</Label>
                              <Select
                                value={dept.type}
                                onValueChange={(value: DepartmentType) =>
                                  updateDepartment(dept.id, { type: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {DEPARTMENT_TYPES.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                      {t.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* HOD Designation */}
                            <div className="space-y-2">
                              <Label>HOD Designation</Label>
                              <Input
                                value={dept.hod_designation || ""}
                                onChange={(e) =>
                                  updateDepartment(dept.id, {
                                    hod_designation: e.target.value,
                                  })
                                }
                                placeholder="e.g., Chief Medical Officer"
                              />
                            </div>

                            {/* Default Consultation Duration */}
                            <div className="space-y-2">
                              <Label>Consultation Duration (mins)</Label>
                              <Input
                                type="number"
                                min={5}
                                max={120}
                                value={dept.default_consultation_duration}
                                onChange={(e) =>
                                  updateDepartment(dept.id, {
                                    default_consultation_duration:
                                      parseInt(e.target.value) || 15,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Toggles */}
                          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={dept.is_opd_enabled}
                                onCheckedChange={(checked) =>
                                  updateDepartment(dept.id, {
                                    is_opd_enabled: checked,
                                  })
                                }
                              />
                              <Label className="text-sm">OPD Enabled</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={dept.is_ipd_enabled}
                                onCheckedChange={(checked) =>
                                  updateDepartment(dept.id, {
                                    is_ipd_enabled: checked,
                                  })
                                }
                              />
                              <Label className="text-sm">IPD Enabled</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={dept.is_revenue_generating}
                                onCheckedChange={(checked) =>
                                  updateDepartment(dept.id, {
                                    is_revenue_generating: checked,
                                  })
                                }
                              />
                              <Label className="text-sm">
                                Revenue Generating
                              </Label>
                            </div>
                          </div>

                          {/* Specializations */}
                          <div className="pt-4 border-t border-gray-200">
                            <Label className="mb-2 block">
                              Specializations
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {dept.specializations.map((spec: string) => (
                                <Badge
                                  key={spec}
                                  variant="secondary"
                                  className="gap-1"
                                >
                                  {spec}
                                  <button
                                    onClick={() =>
                                      removeSpecialization(dept.id, spec)
                                    }
                                    className="ml-1 hover:text-red-500"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Select
                                value={newSpec[dept.id] || ""}
                                onValueChange={(value) => {
                                  if (value) {
                                    addSpecialization(dept.id, value);
                                  }
                                }}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Add specialization..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {COMMON_SPECIALIZATIONS.filter(
                                    (s) => !dept.specializations.includes(s)
                                  ).map((spec) => (
                                    <SelectItem key={spec} value={spec}>
                                      {spec}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>


    </motion.div>
  );
}
