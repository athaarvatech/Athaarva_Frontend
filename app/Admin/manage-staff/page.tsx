"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  RotateCcw,
  UserPlus,
  Users,
  Eye,
  MoreHorizontal,
  Shield,
  ShieldOff,
} from "lucide-react";
import Link from "next/link";

interface Staff {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  loginId: string;
  employeeId: string;
  shift: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  joinDate: string;
}

const ManageStaffPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Mock data
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: "1",
      fullName: "Mary Williams",
      email: "mary.williams@hospital.com",
      phone: "(555) 111-2222",
      role: "Registered Nurse",
      department: "Intensive Care Unit",
      loginId: "mary.williams",
      employeeId: "EMP10001",
      shift: "Day Shift (6 AM - 6 PM)",
      status: "active",
      lastLogin: "2024-01-15",
      joinDate: "2023-05-01",
    },
    {
      id: "2",
      fullName: "John Davis",
      email: "john.davis@hospital.com",
      phone: "(555) 222-3333",
      role: "Lab Technician",
      department: "Laboratory",
      loginId: "john.davis",
      employeeId: "EMP10002",
      shift: "Morning Shift (8 AM - 4 PM)",
      status: "active",
      lastLogin: "2024-01-14",
      joinDate: "2023-02-15",
    },
    {
      id: "3",
      fullName: "Lisa Thompson",
      email: "lisa.thompson@hospital.com",
      phone: "(555) 333-4444",
      role: "Receptionist",
      department: "Outpatient Department",
      loginId: "lisa.thompson",
      employeeId: "EMP10003",
      shift: "Full-Time Regular",
      status: "inactive",
      lastLogin: "2024-01-08",
      joinDate: "2023-08-20",
    },
    {
      id: "4",
      fullName: "James Brown",
      email: "james.brown@hospital.com",
      phone: "(555) 444-5555",
      role: "Pharmacist",
      department: "Pharmacy",
      loginId: "james.brown",
      employeeId: "EMP10004",
      shift: "Evening Shift (4 PM - 12 AM)",
      status: "pending",
      lastLogin: "Never",
      joinDate: "2024-01-10",
    },
    {
      id: "5",
      fullName: "Sarah Lee",
      email: "sarah.lee@hospital.com",
      phone: "(555) 555-6666",
      role: "Physical Therapist",
      department: "Physical Therapy",
      loginId: "sarah.lee",
      employeeId: "EMP10005",
      shift: "Day Shift (6 AM - 6 PM)",
      status: "active",
      lastLogin: "2024-01-15",
      joinDate: "2023-11-01",
    },
  ]);

  const roles = [
    "all",
    "Registered Nurse",
    "Lab Technician",
    "Receptionist",
    "Pharmacist",
    "Physical Therapist",
    "Medical Assistant",
  ];
  const departments = [
    "all",
    "Intensive Care Unit",
    "Laboratory",
    "Outpatient Department",
    "Pharmacy",
    "Physical Therapy",
    "Emergency Department",
  ];
  const statuses = ["all", "active", "inactive", "pending"];

  // Filter staff
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesDepartment =
      departmentFilter === "all" || member.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusToggle = (staffMember: Staff) => {
    const newStatus = staffMember.status === "active" ? "inactive" : "active";
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffMember.id ? { ...s, status: newStatus } : s
      )
    );
    toast.success(
      `Staff member ${
        newStatus === "active" ? "activated" : "deactivated"
      } successfully`
    );
  };

  const handleDeleteStaff = () => {
    if (selectedStaff) {
      setStaff((prev) => prev.filter((s) => s.id !== selectedStaff.id));
      toast.success("Staff member removed successfully");
      setDeleteDialogOpen(false);
      setSelectedStaff(null);
    }
  };

  const handleResetPassword = () => {
    if (selectedStaff) {
      toast.success(`Password reset email sent to ${selectedStaff.email}`);
      setResetPasswordDialogOpen(false);
      setSelectedStaff(null);
    }
  };

  const openDeleteDialog = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setDeleteDialogOpen(true);
  };

  const openResetPasswordDialog = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setResetPasswordDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#20B2AA] text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Staff</h1>
            <p className="text-gray-600">View and manage all staff accounts</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button asChild className="bg-[#20B2AA] hover:bg-[#1a9a91]">
            <Link href="/Admin/add-staff">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Staff
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#20B2AA]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#20B2AA]" />
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-xl font-bold text-[#20B2AA]">
                  {staff.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-green-600">
                  {staff.filter((s) => s.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShieldOff className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-xl font-bold text-gray-600">
                  {staff.filter((s) => s.status === "inactive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MoreHorizontal className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">
                  {staff.filter((s) => s.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#20B2AA]" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all"
                      ? "All Statuses"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role === "all" ? "All Roles" : role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setRoleFilter("all");
                setDepartmentFilter("all");
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Staff List ({filteredStaff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.fullName}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <p className="text-sm text-gray-500">{member.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.employeeId}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{member.shift}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          member.lastLogin === "Never" ? "text-red-500" : ""
                        }
                      >
                        {member.lastLogin}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast.info("Edit functionality coming soon")
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openResetPasswordDialog(member)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(member)}
                          className={
                            member.status === "active"
                              ? "text-red-600 hover:text-red-700"
                              : "text-green-600 hover:text-green-700"
                          }
                        >
                          {member.status === "active" ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(member)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredStaff.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No staff members found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedStaff?.fullName}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff}>
              Delete Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset email to {selectedStaff?.fullName} at{" "}
              {selectedStaff?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              className="bg-[#20B2AA] hover:bg-[#1a9a91]"
            >
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageStaffPage;
