"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  User,
  Phone,
  Plus,
  X,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info,
  Stethoscope,
  Users,
  ClipboardList,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useHospitalAdmin } from "../../layout";

// =============================================================================
// Types
// =============================================================================

interface InviteFormData {
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  department?: string;
  send_welcome_email: boolean;
  personal_message?: string;
}

interface BulkInvite {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "pending" | "sending" | "sent" | "error";
  error?: string;
}

// =============================================================================
// Role Selection Cards
// =============================================================================

interface RoleCardProps {
  role: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  primaryColor: string;
}

function RoleCard({
  title,
  description,
  icon,
  selected,
  onSelect,
  primaryColor,
}: RoleCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? "border-transparent shadow-lg"
          : "border-gray-200 hover:border-gray-300"
      }`}
      style={
        selected
          ? {
              borderColor: primaryColor,
              backgroundColor: `${primaryColor}08`,
            }
          : {}
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            selected ? "text-white" : "text-gray-400 bg-gray-100"
          }`}
          style={selected ? { backgroundColor: primaryColor } : {}}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        {selected && (
          <CheckCircle className="w-5 h-5" style={{ color: primaryColor }} />
        )}
      </div>
    </motion.button>
  );
}

// =============================================================================
// Single Invite Form
// =============================================================================

interface SingleInviteFormProps {
  primaryColor: string;
  onSubmit: (data: InviteFormData) => Promise<void>;
  loading: boolean;
}

function SingleInviteForm({
  primaryColor,
  onSubmit,
  loading,
}: SingleInviteFormProps) {
  const [formData, setFormData] = useState<InviteFormData>({
    email: "",
    full_name: "",
    phone: "",
    role: "",
    department: "",
    send_welcome_email: true,
    personal_message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    {
      value: "doctor",
      title: "Doctor",
      description: "Medical practitioners with full clinical access",
      icon: <Stethoscope className="w-5 h-5" />,
    },
    {
      value: "nurse",
      title: "Nurse",
      description: "Nursing staff with patient care access",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "staff",
      title: "Administrative Staff",
      description: "Front desk, billing, and administrative roles",
      icon: <ClipboardList className="w-5 h-5" />,
    },
  ];

  const departments = [
    "Cardiology",
    "Pediatrics",
    "Emergency",
    "General Medicine",
    "Surgery",
    "Orthopedics",
    "Neurology",
    "Oncology",
    "Dermatology",
    "Other",
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.full_name) {
      newErrors.full_name = "Name is required";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Select Role *</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {roles.map((role) => (
            <RoleCard
              key={role.value}
              role={role.value}
              title={role.title}
              description={role.description}
              icon={role.icon}
              selected={formData.role === role.value}
              onSelect={() => setFormData({ ...formData, role: role.value })}
              primaryColor={primaryColor}
            />
          ))}
        </div>
        {errors.role && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.role}
          </p>
        )}
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="full_name"
              placeholder="Dr. John Smith"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className={`pl-10 ${errors.full_name ? "border-red-500" : ""}`}
            />
          </div>
          {errors.full_name && (
            <p className="text-sm text-red-500">{errors.full_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="doctor@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department (Optional)</Label>
          <Select
            value={formData.department}
            onValueChange={(value) =>
              setFormData({ ...formData, department: value })
            }
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept.toLowerCase()}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Personal Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Personal Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Add a personal welcome message that will be included in the invitation email..."
          value={formData.personal_message}
          onChange={(e) =>
            setFormData({ ...formData, personal_message: e.target.value })
          }
          rows={3}
        />
      </div>

      {/* Options */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="send_welcome"
          checked={formData.send_welcome_email}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, send_welcome_email: checked as boolean })
          }
        />
        <Label
          htmlFor="send_welcome"
          className="text-sm font-normal cursor-pointer"
        >
          Send welcome email with onboarding instructions
        </Label>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">What happens next?</p>
          <p className="mt-1">
            The invitee will receive an email with a unique link to complete
            their profile setup. For doctors, this includes verification of
            their medical license. Staff members will be guided through a
            simplified onboarding process.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Link
          href={`/hospital/${
            window.location.pathname.split("/")[2]
          }/admin/team`}
        >
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={loading}
          className="text-white"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Invitation...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Invitation
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// =============================================================================
// Bulk Invite Section
// =============================================================================

interface BulkInviteSectionProps {
  primaryColor: string;
  onBulkInvite: (invites: BulkInvite[]) => Promise<void>;
}

function BulkInviteSection({
  primaryColor,
  onBulkInvite,
}: BulkInviteSectionProps) {
  const [invites, setInvites] = useState<BulkInvite[]>([]);
  const [newInvite, setNewInvite] = useState({
    email: "",
    name: "",
    role: "staff",
  });

  const addInvite = () => {
    if (newInvite.email && newInvite.name) {
      setInvites([
        ...invites,
        {
          id: `invite-${Date.now()}`,
          ...newInvite,
          status: "pending",
        },
      ]);
      setNewInvite({ email: "", name: "", role: "staff" });
    }
  };

  const removeInvite = (id: string) => {
    setInvites(invites.filter((inv) => inv.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Add New Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          placeholder="Email"
          value={newInvite.email}
          onChange={(e) =>
            setNewInvite({ ...newInvite, email: e.target.value })
          }
        />
        <Input
          placeholder="Full Name"
          value={newInvite.name}
          onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
        />
        <Select
          value={newInvite.role}
          onValueChange={(value) => setNewInvite({ ...newInvite, role: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="nurse">Nurse</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={addInvite}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Invites List */}
      <AnimatePresence>
        {invites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {invites.map((invite) => (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{invite.name}</span>
                    <span className="text-xs text-gray-500">
                      {invite.email}
                    </span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {invite.role}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInvite(invite.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {invites.length > 0 && (
        <Button
          onClick={() => onBulkInvite(invites)}
          className="w-full text-white"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
          }}
        >
          <Send className="w-4 h-4 mr-2" />
          Send {invites.length} Invitation{invites.length > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
}

// =============================================================================
// Main Invite Page
// =============================================================================

export default function InviteTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const subdomain = params.subdomain as string;
  const { hospital } = useHospitalAdmin();

  const [inviteMode, setInviteMode] = useState<"single" | "bulk">("single");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const primaryColor = hospital?.primary_color || "#007C7C";

  const handleSingleInvite = async (data: InviteFormData) => {
    setLoading(true);
    try {
      // API call to send invitation
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("hospital_admin_token");

      const response = await fetch(`${API_BASE}/api/v1/team/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          role: data.role,
          department: data.department,
          send_welcome_email: data.send_welcome_email,
          personal_message: data.personal_message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send invitation");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/hospital/${subdomain}/admin/team`);
      }, 2000);
    } catch (error) {
      console.error("Error sending invitation:", error);
      // Show error toast
    } finally {
      setLoading(false);
    }
  };

  const handleBulkInvite = async (invites: BulkInvite[]) => {
    setLoading(true);
    try {
      // API call to send bulk invitations
      console.log("Sending bulk invites:", invites);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/hospital/${subdomain}/admin/team`);
      }, 2000);
    } catch (error) {
      console.error("Error sending bulk invitations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-16"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <CheckCircle
              className="w-10 h-10"
              style={{ color: primaryColor }}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invitation Sent!
          </h2>
          <p className="text-gray-600">
            The invitation email has been sent successfully. Redirecting...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/hospital/${subdomain}/admin/team`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invite Team Member
          </h1>
          <p className="text-gray-500 mt-1">
            Send invitations to doctors and staff to join your hospital
          </p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={inviteMode === "single" ? "default" : "outline"}
          onClick={() => setInviteMode("single")}
          className={inviteMode === "single" ? "text-white" : ""}
          style={
            inviteMode === "single"
              ? {
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                }
              : {}
          }
        >
          <User className="w-4 h-4 mr-2" />
          Single Invite
        </Button>
        <Button
          variant={inviteMode === "bulk" ? "default" : "outline"}
          onClick={() => setInviteMode("bulk")}
          className={inviteMode === "bulk" ? "text-white" : ""}
          style={
            inviteMode === "bulk"
              ? {
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                }
              : {}
          }
        >
          <Users className="w-4 h-4 mr-2" />
          Bulk Invite
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {inviteMode === "single"
              ? "Invite Team Member"
              : "Bulk Invitations"}
          </CardTitle>
          <CardDescription>
            {inviteMode === "single"
              ? "Fill in the details below to send an invitation"
              : "Add multiple team members to invite at once"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inviteMode === "single" ? (
            <SingleInviteForm
              primaryColor={primaryColor}
              onSubmit={handleSingleInvite}
              loading={loading}
            />
          ) : (
            <BulkInviteSection
              primaryColor={primaryColor}
              onBulkInvite={handleBulkInvite}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
