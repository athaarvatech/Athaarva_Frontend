"use client";

import React, { useState, useMemo } from "react";
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
  Trash2,
  RotateCcw,
  UserPlus,
  Stethoscope,
  Users,
  Eye,
  Shield,
  ShieldOff,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useAdminDoctors } from "@/hooks/useAdminDashboard";
import type { Doctor } from "@/lib/admin-api";

const ManageDoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 50;

  // Fetch doctors from API
  const {
    doctors,
    total,
    totalPages,
    isLoading,
    error,
    refetch,
    updateDoctorStatus,
    deleteDoctor,
  } = useAdminDoctors(currentPage, perPage);

  const statuses = ["all", "active", "inactive"];
  const verificationStatuses = ["all", "verified", "unverified"];

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.specialization
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && doctor.is_active) ||
        (statusFilter === "inactive" && !doctor.is_active);

      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" && doctor.is_verified) ||
        (verificationFilter === "unverified" && !doctor.is_verified);

      return matchesSearch && matchesStatus && matchesVerification;
    });
  }, [doctors, searchTerm, statusFilter, verificationFilter]);

  // Calculate stats from real data
  const stats = useMemo(() => {
    return {
      total: total,
      active: doctors.filter((d) => d.is_active).length,
      inactive: doctors.filter((d) => !d.is_active).length,
      unverified: doctors.filter((d) => !d.is_verified).length,
      onboardingComplete: doctors.filter((d) => d.onboarding_completed).length,
    };
  }, [doctors, total]);

  const getStatusBadge = (doctor: Doctor) => {
    if (!doctor.is_verified) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Unverified
        </Badge>
      );
    }
    if (doctor.is_active) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Active
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
        Inactive
      </Badge>
    );
  };

  const handleStatusToggle = async (doctor: Doctor) => {
    const isActive = doctor.is_active;
    const newStatus = isActive ? "deactivated" : "active";
    const result = await updateDoctorStatus(doctor.doctor_id, {
      status: newStatus as "active" | "deactivated",
    });

    if (result.success) {
      toast.success(
        `Doctor ${!isActive ? "activated" : "deactivated"} successfully`
      );
    } else {
      toast.error(result.error || "Failed to update doctor status");
    }
  };

  const handleVerificationToggle = async (doctor: Doctor) => {
    const isVerified = doctor.is_verified;
    const newStatus = isVerified ? "pending" : "approved";
    const result = await updateDoctorStatus(doctor.doctor_id, {
      verification_status: newStatus as "pending" | "approved",
    });

    if (result.success) {
      toast.success(
        `Doctor ${!isVerified ? "verified" : "unverified"} successfully`
      );
    } else {
      toast.error(result.error || "Failed to update verification status");
    }
  };

  const handleDeleteDoctor = async () => {
    if (selectedDoctor) {
      const result = await deleteDoctor(selectedDoctor.doctor_id);

      if (result.success) {
        toast.success("Doctor removed successfully");
        setDeleteDialogOpen(false);
        setSelectedDoctor(null);
      } else {
        toast.error(result.error || "Failed to delete doctor");
      }
    }
  };

  const openDeleteDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Doctors
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => refetch()}
            className="bg-[#007C7C] hover:bg-[#006666]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#007C7C] text-white">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
            <p className="text-gray-600">View and manage all doctor accounts</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button asChild className="bg-[#007C7C] hover:bg-[#006666]">
            <Link href="/Admin/add-doctor">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Doctor
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-[#007C7C]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#007C7C]" />
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-xl font-bold text-[#007C7C]">
                  {isLoading ? "..." : stats.total}
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
                  {isLoading ? "..." : stats.active}
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
                  {isLoading ? "..." : stats.inactive}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Unverified</p>
                <p className="text-xl font-bold text-yellow-600">
                  {isLoading ? "..." : stats.unverified}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Onboarded</p>
                <p className="text-xl font-bold text-blue-600">
                  {isLoading ? "..." : stats.onboardingComplete}
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
            <Filter className="h-5 w-5 text-[#007C7C]" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search doctors..."
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

            <Select
              value={verificationFilter}
              onValueChange={setVerificationFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by verification" />
              </SelectTrigger>
              <SelectContent>
                {verificationStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all"
                      ? "All Verifications"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setVerificationFilter("all");
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>
            Doctors List ({isLoading ? "..." : filteredDoctors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#007C7C]" />
              <span className="ml-3 text-gray-600">Loading doctors...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Onboarding</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow
                      key={doctor.doctor_id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{doctor.full_name}</p>
                          <p className="text-sm text-gray-500">
                            {doctor.email}
                          </p>
                          {doctor.phone && (
                            <p className="text-sm text-gray-500">
                              {doctor.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {doctor.specialization || (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {doctor.license_number || (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(doctor)}</TableCell>
                      <TableCell>
                        {doctor.onboarding_completed ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(doctor.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerificationToggle(doctor)}
                            title={doctor.is_verified ? "Unverify" : "Verify"}
                            className={
                              doctor.is_verified
                                ? "text-yellow-600 hover:text-yellow-700"
                                : "text-green-600 hover:text-green-700"
                            }
                          >
                            {doctor.is_verified ? (
                              <ShieldOff className="h-4 w-4" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusToggle(doctor)}
                            title={doctor.is_active ? "Deactivate" : "Activate"}
                            className={
                              doctor.is_active
                                ? "text-gray-600 hover:text-gray-700"
                                : "text-green-600 hover:text-green-700"
                            }
                          >
                            {doctor.is_active ? (
                              <ShieldOff className="h-4 w-4" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(doctor)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredDoctors.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No doctors found</p>
                  <p className="text-sm">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    verificationFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Add your first doctor to get started"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({total} total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedDoctor?.full_name}? This
              action cannot be undone and will permanently delete all associated
              data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDoctor}>
              Delete Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageDoctorsPage;
