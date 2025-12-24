"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  Search,
  MoreVertical,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Activity,
  Eye,
  Edit2,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodGroup: string;
  address: string;
  insuranceProvider?: string;
  insuranceId?: string;
  status: "active" | "inactive";
  lastVisit?: string;
  totalVisits: number;
  registeredAt: string;
  conditions: string[];
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: "pat-1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-03-15",
    gender: "male",
    bloodGroup: "O+",
    address: "123 Main St, New York, NY 10001",
    insuranceProvider: "Blue Cross",
    insuranceId: "BC-12345",
    status: "active",
    lastVisit: "2025-12-01",
    totalVisits: 8,
    registeredAt: "2024-06-15",
    conditions: ["Hypertension", "Type 2 Diabetes"],
  },
  {
    id: "pat-2",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: "1992-07-22",
    gender: "female",
    bloodGroup: "A+",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    insuranceProvider: "Aetna",
    insuranceId: "AE-67890",
    status: "active",
    lastVisit: "2025-11-28",
    totalVisits: 5,
    registeredAt: "2024-09-10",
    conditions: ["Asthma"],
  },
  {
    id: "pat-3",
    name: "Robert Wilson",
    email: "robert.wilson@email.com",
    phone: "+1 (555) 345-6789",
    dateOfBirth: "1978-11-08",
    gender: "male",
    bloodGroup: "B-",
    address: "789 Pine Rd, Chicago, IL 60601",
    status: "active",
    lastVisit: "2025-11-15",
    totalVisits: 12,
    registeredAt: "2023-03-20",
    conditions: ["Arthritis", "High Cholesterol"],
  },
  {
    id: "pat-4",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: "2018-05-30",
    gender: "female",
    bloodGroup: "AB+",
    address: "321 Elm St, Houston, TX 77001",
    insuranceProvider: "United Health",
    insuranceId: "UH-11111",
    status: "active",
    lastVisit: "2025-12-02",
    totalVisits: 15,
    registeredAt: "2023-01-05",
    conditions: [],
  },
  {
    id: "pat-5",
    name: "James Brown",
    email: "james.brown@email.com",
    phone: "+1 (555) 567-8901",
    dateOfBirth: "1965-09-12",
    gender: "male",
    bloodGroup: "O-",
    address: "654 Cedar Ln, Phoenix, AZ 85001",
    status: "inactive",
    lastVisit: "2025-08-20",
    totalVisits: 3,
    registeredAt: "2024-05-25",
    conditions: ["Heart Disease"],
  },
];

export default function PatientsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pageSize = 10;

  // Filter patients
  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;
    const matchesGender =
      genderFilter === "all" || patient.gender === genderFilter;
    return matchesSearch && matchesStatus && matchesGender;
  });

  // Stats
  const stats = {
    total: mockPatients.length,
    active: mockPatients.filter((p) => p.status === "active").length,
    newThisMonth: mockPatients.filter(
      (p) =>
        new Date(p.registeredAt) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    visitedThisWeek: mockPatients.filter(
      (p) =>
        p.lastVisit &&
        new Date(p.lastVisit) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">
            Manage patient records and information
          </p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New This Month</p>
                <p className="text-2xl font-bold text-teal-600">
                  {stats.newThisMonth}
                </p>
              </div>
              <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Visited This Week</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.visitedThisWeek}
                </p>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Gender</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-teal-100 text-teal-700">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {patient.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {patient.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3.5 w-3.5 mr-1.5" />
                        {patient.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3.5 w-3.5 mr-1.5" />
                        {patient.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {getAge(patient.dateOfBirth)} years
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {patient.gender}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      {patient.bloodGroup}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {patient.lastVisit ? (
                      <div>
                        <p className="text-sm">
                          {format(new Date(patient.lastVisit), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {patient.totalVisits} total visits
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No visits</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        patient.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Medical Records
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPatients.length === 0 && (
            <div className="p-8 text-center">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No patients found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredPatients.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">
                Showing {filteredPatients.length} of {mockPatients.length}{" "}
                patients
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage}
                </span>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medical">Medical Info</TabsTrigger>
                <TabsTrigger value="insurance">Insurance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-teal-100 text-teal-700 text-xl">
                      {selectedPatient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedPatient.name}
                    </h3>
                    <p className="text-gray-500">
                      Patient ID: {selectedPatient.id}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        selectedPatient.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200 mt-1"
                          : "bg-gray-50 text-gray-700 border-gray-200 mt-1"
                      }
                    >
                      {selectedPatient.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {format(
                        new Date(selectedPatient.dateOfBirth),
                        "MMMM d, yyyy"
                      )}{" "}
                      ({getAge(selectedPatient.dateOfBirth)} years)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">
                      {selectedPatient.gender}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{selectedPatient.address}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-teal-600">
                        {selectedPatient.totalVisits}
                      </p>
                      <p className="text-sm text-gray-500">Total Visits</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedPatient.lastVisit
                          ? format(new Date(selectedPatient.lastVisit), "MMM d")
                          : "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">Last Visit</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {format(
                          new Date(selectedPatient.registeredAt),
                          "MMM yyyy"
                        )}
                      </p>
                      <p className="text-sm text-gray-500">Registered</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200 mt-1"
                    >
                      {selectedPatient.bloodGroup}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Medical Conditions
                  </p>
                  {selectedPatient.conditions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.conditions.map((condition, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No recorded conditions</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="insurance" className="space-y-4">
                {selectedPatient.insuranceProvider ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Provider</p>
                      <p className="font-medium">
                        {selectedPatient.insuranceProvider}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Policy ID</p>
                      <p className="font-medium">
                        {selectedPatient.insuranceId}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No insurance information on file
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Edit Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
