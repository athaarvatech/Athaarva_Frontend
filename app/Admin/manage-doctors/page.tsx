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
  Stethoscope,
  Users,
  Eye,
  MoreHorizontal,
  Shield,
  ShieldOff,
} from "lucide-react";
import Link from "next/link";

interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  loginId: string;
  licenseNumber: string;
  experience: number;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  joinDate: string;
}

const ManageDoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Mock data
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      fullName: "Dr. Sarah Johnson",
      email: "sarah.johnson@hospital.com",
      phone: "(555) 123-4567",
      specialization: "Cardiology",
      department: "Cardiology Department",
      loginId: "sarah.johnson",
      licenseNumber: "MD123456",
      experience: 8,
      status: "active",
      lastLogin: "2024-01-15",
      joinDate: "2023-06-01",
    },
    {
      id: "2",
      fullName: "Dr. Michael Chen",
      email: "michael.chen@hospital.com",
      phone: "(555) 234-5678",
      specialization: "Emergency Medicine",
      department: "Emergency Department",
      loginId: "michael.chen",
      licenseNumber: "MD234567",
      experience: 12,
      status: "active",
      lastLogin: "2024-01-14",
      joinDate: "2022-03-15",
    },
    {
      id: "3",
      fullName: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@hospital.com",
      phone: "(555) 345-6789",
      specialization: "Pediatrics",
      department: "Pediatric Ward",
      loginId: "emily.rodriguez",
      licenseNumber: "MD345678",
      experience: 6,
      status: "inactive",
      lastLogin: "2024-01-10",
      joinDate: "2023-09-01",
    },
    {
      id: "4",
      fullName: "Dr. Robert Wilson",
      email: "robert.wilson@hospital.com",
      phone: "(555) 456-7890",
      specialization: "Surgery",
      department: "Operating Theater",
      loginId: "robert.wilson",
      licenseNumber: "MD456789",
      experience: 15,
      status: "pending",
      lastLogin: "Never",
      joinDate: "2024-01-12",
    },
  ]);

  const departments = ["all", "Cardiology Department", "Emergency Department", "Pediatric Ward", "Operating Theater"];
  const statuses = ["all", "active", "inactive", "pending"];

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = 
      doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || doctor.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || doctor.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusToggle = (doctor: Doctor) => {
    const newStatus = doctor.status === "active" ? "inactive" : "active";
    setDoctors(prev => 
      prev.map(d => 
        d.id === doctor.id ? { ...d, status: newStatus } : d
      )
    );
    toast.success(`Doctor ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
  };

  const handleDeleteDoctor = () => {
    if (selectedDoctor) {
      setDoctors(prev => prev.filter(d => d.id !== selectedDoctor.id));
      toast.success("Doctor removed successfully");
      setDeleteDialogOpen(false);
      setSelectedDoctor(null);
    }
  };

  const handleResetPassword = () => {
    if (selectedDoctor) {
      toast.success(`Password reset email sent to ${selectedDoctor.email}`);
      setResetPasswordDialogOpen(false);
      setSelectedDoctor(null);
    }
  };

  const openDeleteDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  const openResetPasswordDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setResetPasswordDialogOpen(true);
  };

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
          <Button asChild className="bg-[#007C7C] hover:bg-[#006666]">
            <Link href="/Admin/add-doctor">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Doctor
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#007C7C]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#007C7C]" />
              <div>
                <p className="text-sm text-gray-600">Total Doctors</p>
                <p className="text-xl font-bold text-[#007C7C]">{doctors.length}</p>
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
                  {doctors.filter(d => d.status === "active").length}
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
                  {doctors.filter(d => d.status === "inactive").length}
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
                  {doctors.filter(d => d.status === "pending").length}
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
                    {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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
                setDepartmentFilter("all");
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
          <CardTitle>Doctors List ({filteredDoctors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{doctor.fullName}</p>
                        <p className="text-sm text-gray-500">{doctor.email}</p>
                        <p className="text-sm text-gray-500">{doctor.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.department}</TableCell>
                    <TableCell>{doctor.experience} years</TableCell>
                    <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                    <TableCell>
                      <span className={doctor.lastLogin === "Never" ? "text-red-500" : ""}>
                        {doctor.lastLogin}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info("Edit functionality coming soon")}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openResetPasswordDialog(doctor)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(doctor)}
                          className={doctor.status === "active" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                        >
                          {doctor.status === "active" ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(doctor)}
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
            
            {filteredDoctors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No doctors found matching your criteria</p>
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
              Are you sure you want to remove {selectedDoctor?.fullName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDoctor}
            >
              Delete Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset email to {selectedDoctor?.fullName} at {selectedDoctor?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword} className="bg-[#007C7C] hover:bg-[#006666]">
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageDoctorsPage;
