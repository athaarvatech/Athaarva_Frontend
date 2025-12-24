"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Edit,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHospitalAdmin } from "../layout";
import Link from "next/link";
import { useParams } from "next/navigation";

// =============================================================================
// Types
// =============================================================================

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  status: "active" | "pending" | "suspended";
  avatar_url?: string;
  joined_at?: string;
  invited_at?: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  invited_at: string;
  expires_at: string;
  status: "pending" | "expired" | "accepted";
  invited_by: string;
}

// =============================================================================
// Status Badge Component
// =============================================================================

function StatusBadge({ status }: { status: string }) {
  const styles: Record<
    string,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    active: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <Clock className="w-3 h-3" />,
    },
    suspended: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <XCircle className="w-3 h-3" />,
    },
    expired: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <XCircle className="w-3 h-3" />,
    },
    accepted: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: <CheckCircle className="w-3 h-3" />,
    },
  };

  const style = styles[status] || styles.pending;

  return (
    <Badge className={`${style.bg} ${style.text} flex items-center gap-1`}>
      {style.icon}
      <span className="capitalize">{status}</span>
    </Badge>
  );
}

// =============================================================================
// Team Members Table
// =============================================================================

interface TeamMembersTableProps {
  members: TeamMember[];
  primaryColor: string;
  onAction: (action: string, member: TeamMember) => void;
}

function TeamMembersTable({
  members,
  primaryColor,
  onAction,
}: TeamMembersTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No team members yet</p>
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback
                        className="text-white text-xs"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {member.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.full_name}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{member.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {member.department || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={member.status} />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {member.joined_at
                      ? new Date(member.joined_at).toLocaleDateString()
                      : "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onAction("view", member)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onAction("edit", member)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {member.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() => onAction("suspend", member)}
                          className="text-amber-600"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                      ) : member.status === "suspended" ? (
                        <DropdownMenuItem
                          onClick={() => onAction("activate", member)}
                          className="text-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem
                        onClick={() => onAction("remove", member)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// =============================================================================
// Pending Invitations Table
// =============================================================================

interface PendingInvitationsTableProps {
  invitations: PendingInvitation[];
  onResend: (invitation: PendingInvitation) => void;
  onCancel: (invitation: PendingInvitation) => void;
}

function PendingInvitationsTable({
  invitations,
  onResend,
  onCancel,
}: PendingInvitationsTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Invited</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No pending invitations</p>
              </TableCell>
            </TableRow>
          ) : (
            invitations.map((invitation) => (
              <TableRow key={invitation.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{invitation.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{invitation.role}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {new Date(invitation.invited_at).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {new Date(invitation.expires_at).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={invitation.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onResend(invitation)}
                      disabled={invitation.status === "accepted"}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCancel(invitation)}
                      disabled={invitation.status === "accepted"}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// =============================================================================
// Stats Cards
// =============================================================================

interface TeamStatsProps {
  totalMembers: number;
  activeDoctors: number;
  activeStaff: number;
  pendingInvites: number;
  primaryColor: string;
}

function TeamStats({
  totalMembers,
  activeDoctors,
  activeStaff,
  pendingInvites,
  primaryColor,
}: TeamStatsProps) {
  const stats = [
    { label: "Total Members", value: totalMembers, color: primaryColor },
    { label: "Active Doctors", value: activeDoctors, color: "#10B981" },
    { label: "Active Staff", value: activeStaff, color: "#8B5CF6" },
    { label: "Pending Invites", value: pendingInvites, color: "#F59E0B" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// Main Team Page
// =============================================================================

export default function TeamManagementPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  const { hospital } = useHospitalAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<
    PendingInvitation[]
  >([]);
  const [loading, setLoading] = useState(true);

  const primaryColor = hospital?.primary_color || "#007C7C";

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTeamMembers([
      {
        id: "1",
        full_name: "Dr. John Smith",
        email: "john.smith@hospital.com",
        phone: "+91 9876543210",
        role: "Doctor",
        department: "Cardiology",
        status: "active",
        joined_at: "2024-01-15",
      },
      {
        id: "2",
        full_name: "Dr. Sarah Johnson",
        email: "sarah.johnson@hospital.com",
        role: "Doctor",
        department: "Pediatrics",
        status: "active",
        joined_at: "2024-02-01",
      },
      {
        id: "3",
        full_name: "Jane Doe",
        email: "jane.doe@hospital.com",
        role: "Nurse",
        department: "Emergency",
        status: "active",
        joined_at: "2024-01-20",
      },
      {
        id: "4",
        full_name: "Mike Wilson",
        email: "mike.wilson@hospital.com",
        role: "Receptionist",
        status: "pending",
        invited_at: "2024-03-01",
      },
    ]);

    setPendingInvitations([
      {
        id: "inv1",
        email: "new.doctor@email.com",
        role: "Doctor",
        invited_at: "2024-03-10T10:00:00Z",
        expires_at: "2024-03-17T10:00:00Z",
        status: "pending",
        invited_by: "Admin",
      },
      {
        id: "inv2",
        email: "nurse.new@email.com",
        role: "Nurse",
        invited_at: "2024-03-08T14:00:00Z",
        expires_at: "2024-03-15T14:00:00Z",
        status: "pending",
        invited_by: "Admin",
      },
      {
        id: "inv3",
        email: "receptionist@email.com",
        role: "Staff",
        invited_at: "2024-03-05T09:00:00Z",
        expires_at: "2024-03-12T09:00:00Z",
        status: "expired",
        invited_by: "Admin",
      },
    ]);

    setLoading(false);
  }, []);

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "doctors")
      return matchesSearch && member.role === "Doctor";
    if (activeTab === "staff") return matchesSearch && member.role !== "Doctor";
    return matchesSearch;
  });

  const handleMemberAction = (action: string, member: TeamMember) => {
    console.log(`Action: ${action}`, member);
    // Implement action handlers
  };

  const handleResendInvitation = (invitation: PendingInvitation) => {
    console.log("Resending invitation:", invitation);
    // Implement resend logic
  };

  const handleCancelInvitation = (invitation: PendingInvitation) => {
    console.log("Cancelling invitation:", invitation);
    // Implement cancel logic
  };

  const stats = {
    totalMembers: teamMembers.length,
    activeDoctors: teamMembers.filter(
      (m) => m.role === "Doctor" && m.status === "active"
    ).length,
    activeStaff: teamMembers.filter(
      (m) => m.role !== "Doctor" && m.status === "active"
    ).length,
    pendingInvites: pendingInvitations.filter((i) => i.status === "pending")
      .length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500 mt-1">
            Manage your hospital staff and invitations
          </p>
        </div>
        <Link href={`/hospital/${subdomain}/admin/team/invite`}>
          <Button
            className="text-white"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Team Member
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <TeamStats {...stats} primaryColor={primaryColor} />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Members ({teamMembers.length})
          </TabsTrigger>
          <TabsTrigger value="doctors">
            Doctors ({teamMembers.filter((m) => m.role === "Doctor").length})
          </TabsTrigger>
          <TabsTrigger value="staff">
            Staff ({teamMembers.filter((m) => m.role !== "Doctor").length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending (
            {pendingInvitations.filter((i) => i.status === "pending").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <TeamMembersTable
            members={filteredMembers}
            primaryColor={primaryColor}
            onAction={handleMemberAction}
          />
        </TabsContent>

        <TabsContent value="doctors" className="mt-4">
          <TeamMembersTable
            members={filteredMembers}
            primaryColor={primaryColor}
            onAction={handleMemberAction}
          />
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <TeamMembersTable
            members={filteredMembers}
            primaryColor={primaryColor}
            onAction={handleMemberAction}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <PendingInvitationsTable
            invitations={pendingInvitations}
            onResend={handleResendInvitation}
            onCancel={handleCancelInvitation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
