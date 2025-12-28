"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Shield,
  Send,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isValidEmail, isValidPhone } from "@/lib/onboarding-utils";

import type { TeamMemberData } from "@/contexts/HospitalOnboardingContextV2";

export default function AdminStaffInvitationsStep() {
  const { data, updateData } = useHospitalOnboarding();

  // Safety checks
  const adminTeam = Array.isArray(data.adminTeam) ? data.adminTeam : [];

  // Add team member
  const addTeamMember = () => {
    const newMember: TeamMemberData = {
      id: `member_${Date.now()}`,
      full_name: "",
      role: "",
      email: "",
      phone: "",
      access_scope: "organization",
      status: "pending",
      scope_hint: "",
      notes: "",
    };

    updateData("adminTeam", [...adminTeam, newMember]);
  };

  // Update team member
  const updateTeamMember = (id: string, updates: Partial<TeamMemberData>) => {
    const updatedTeam = adminTeam.map((member) =>
      member.id === id ? { ...member, ...updates } : member
    );
    updateData("adminTeam", updatedTeam);
  };

  // Remove team member
  const removeTeamMember = (id: string) => {
    updateData(
      "adminTeam",
      adminTeam.filter((m) => m.id !== id)
    );
  };

  // Apply role preset
  const applyRolePreset = (id: string, presetRole: string) => {
    const presets: { [key: string]: Partial<TeamMemberData> } = {
      "Hospital Admin": {
        role: "Hospital Admin",
        scope_hint: "Full platform access, user management, billing",
      },
      "HR Manager": {
        role: "HR Manager",
        scope_hint: "Staff management, scheduling, payroll",
      },
      "Doctor Lead": {
        role: "Doctor Lead",
        scope_hint: "Medical staff coordination, clinical oversight",
      },
      "Finance Manager": {
        role: "Finance Manager",
        scope_hint: "Financial operations, invoicing, reports",
      },
      "Reception Manager": {
        role: "Reception Manager",
        scope_hint: "Appointment management, patient check-in",
      },
      "IT Administrator": {
        role: "IT Administrator",
        scope_hint: "System configuration, integrations, security",
      },
    };

    if (presets[presetRole]) {
      updateTeamMember(id, presets[presetRole]);
    }
  };

  const rolePresets = [
    "Hospital Admin",
    "HR Manager",
    "Doctor Lead",
    "Finance Manager",
    "Reception Manager",
    "IT Administrator",
  ];

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-gray-100 text-gray-700",
      icon: Clock,
    },
    {
      value: "invited",
      label: "Invited",
      color: "bg-blue-100 text-blue-700",
      icon: Send,
    },
    {
      value: "active",
      label: "Active",
      color: "bg-green-100 text-green-700",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Admin & Staff Invitations
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Invite administrators and key staff members to access the platform
        </p>
      </div>

      {/* Add Team Member Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-base font-medium">Team Members</Label>
          <Badge variant="secondary">
            {adminTeam.length} member{adminTeam.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        <Button onClick={addTeamMember} className="bg-healthcare-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Team Members List */}
      <AnimatePresence>
        {adminTeam.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            index={index}
            rolePresets={rolePresets}
            statusOptions={statusOptions}
            onUpdate={(updates) => updateTeamMember(member.id, updates)}
            onApplyPreset={(role) => applyRolePreset(member.id, role)}
            onRemove={() => removeTeamMember(member.id)}
          />
        ))}
      </AnimatePresence>

      {/* Empty State */}
      {adminTeam.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No team members added yet</p>
          <Button onClick={addTeamMember} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Team Member
          </Button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">
              About Invitations
            </h4>
            <p className="text-sm text-blue-800">
              Team members will receive email invitations to create their
              accounts and access the platform. You can manage their roles and
              permissions later from the admin dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Team Member Card Component
interface TeamMemberCardProps {
  member: TeamMemberData;
  index: number;
  rolePresets: string[];
  statusOptions: {
    value: string;
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  onUpdate: (updates: Partial<TeamMemberData>) => void;
  onApplyPreset: (role: string) => void;
  onRemove: () => void;
}

function TeamMemberCard({
  member,
  index,
  rolePresets,
  statusOptions,
  onUpdate,
  onApplyPreset,
  onRemove,
}: TeamMemberCardProps) {
  const [showPresets, setShowPresets] = useState(false);

  const currentStatus =
    statusOptions.find((s) => s.value === member.status) || statusOptions[0];
  const StatusIcon = currentStatus.icon;

  const emailValid = !member.email || isValidEmail(member.email);
  const phoneValid = !member.phone || isValidPhone(member.phone);

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
            <UserPlus className="w-5 h-5 text-healthcare-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-gray-900">
                Team Member #{index + 1}
              </h4>
              <Badge className={cn("text-xs", currentStatus.color)}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {currentStatus.label}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {member.full_name || "Unnamed Member"}
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
          <Label>Full Name *</Label>
          <Input
            value={member.full_name}
            onChange={(e) => onUpdate({ full_name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Role *</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs"
            >
              Use Preset
            </Button>
          </div>
          <Input
            value={member.role}
            onChange={(e) => onUpdate({ role: e.target.value })}
            placeholder="e.g., Hospital Admin"
          />

          {/* Role Presets */}
          {showPresets && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {rolePresets.map((preset) => (
                <Badge
                  key={preset}
                  variant="outline"
                  className="cursor-pointer hover:bg-healthcare-primary/10"
                  onClick={() => {
                    onApplyPreset(preset);
                    setShowPresets(false);
                  }}
                >
                  {preset}
                </Badge>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              value={member.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              placeholder="admin@hospital.com"
              className={cn(
                "pl-10",
                member.email && !emailValid && "border-red-500"
              )}
            />
          </div>
          {member.email && !emailValid && (
            <p className="text-xs text-red-600">Invalid email format</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="tel"
              value={member.phone}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
              className={cn(
                "pl-10",
                member.phone && !phoneValid && "border-red-500"
              )}
            />
          </div>
          {member.phone && !phoneValid && (
            <p className="text-xs text-red-600">Invalid phone format</p>
          )}
        </div>
      </div>

      {/* Scope Hint */}
      <div className="space-y-2">
        <Label>Scope / Permissions Hint</Label>
        <Textarea
          value={member.scope_hint || ""}
          onChange={(e) => onUpdate({ scope_hint: e.target.value })}
          placeholder="e.g., Full platform access, user management..."
          rows={2}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>Internal Notes (Optional)</Label>
        <Textarea
          value={member.notes || ""}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Any additional notes about this team member..."
          rows={2}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Invitation Status</Label>
        <select
          value={member.status}
          onChange={(e) =>
            onUpdate({ status: e.target.value as TeamMemberData["status"] })
          }
          className={cn(
            "w-full px-3 py-2 rounded-md text-sm font-medium border-0",
            currentStatus.color
          )}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}
