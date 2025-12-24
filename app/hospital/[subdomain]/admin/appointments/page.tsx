"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  MapPin,
  Phone,
  User,
  MoreVertical,
  Eye,
  Edit2,
  X,
  CheckCircle,
  CalendarDays,
  List,
  Grid3X3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Appointment {
  id: string;
  patientName: string;
  patientPhoto?: string;
  doctorName: string;
  doctorPhoto?: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  status: "scheduled" | "completed" | "cancelled" | "no-show" | "in-progress";
  reason: string;
}

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: "apt-1",
    patientName: "John Smith",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: "2025-12-04",
    time: "09:00",
    duration: 30,
    type: "in-person",
    status: "scheduled",
    reason: "Annual checkup",
  },
  {
    id: "apt-2",
    patientName: "Emily Davis",
    doctorName: "Dr. Michael Chen",
    department: "Dermatology",
    date: "2025-12-04",
    time: "10:30",
    duration: 45,
    type: "video",
    status: "in-progress",
    reason: "Skin rash consultation",
  },
  {
    id: "apt-3",
    patientName: "Robert Wilson",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: "2025-12-04",
    time: "11:00",
    duration: 30,
    type: "in-person",
    status: "completed",
    reason: "Follow-up visit",
  },
  {
    id: "apt-4",
    patientName: "Maria Garcia",
    doctorName: "Dr. Lisa Wang",
    department: "Pediatrics",
    date: "2025-12-04",
    time: "14:00",
    duration: 30,
    type: "phone",
    status: "scheduled",
    reason: "Child vaccination",
  },
  {
    id: "apt-5",
    patientName: "James Brown",
    doctorName: "Dr. Michael Chen",
    department: "Dermatology",
    date: "2025-12-04",
    time: "15:30",
    duration: 30,
    type: "video",
    status: "cancelled",
    reason: "Acne treatment",
  },
  {
    id: "apt-6",
    patientName: "Sarah Miller",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: "2025-12-05",
    time: "09:30",
    duration: 60,
    type: "in-person",
    status: "scheduled",
    reason: "Cardiac evaluation",
  },
];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  "in-progress": "bg-amber-100 text-amber-800 border-amber-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  "no-show": "bg-gray-100 text-gray-800 border-gray-200",
};

const typeIcons = {
  video: Video,
  "in-person": MapPin,
  phone: Phone,
};

export default function AppointmentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = useParams();
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "grid">(
    "list"
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Get week dates for calendar view
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Filter appointments
  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || apt.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return filteredAppointments.filter((apt) => apt.date === dateStr);
  };

  // Stats
  const todayAppointments = mockAppointments.filter(
    (apt) => apt.date === format(new Date(), "yyyy-MM-dd")
  );
  const stats = {
    total: todayAppointments.length,
    scheduled: todayAppointments.filter((apt) => apt.status === "scheduled")
      .length,
    completed: todayAppointments.filter((apt) => apt.status === "completed")
      .length,
    cancelled: todayAppointments.filter((apt) => apt.status === "cancelled")
      .length,
  };

  const TypeIcon = ({ type }: { type: keyof typeof typeIcons }) => {
    const Icon = typeIcons[type];
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">
            Manage and schedule patient appointments
          </p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.scheduled}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </p>
              </div>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <Tabs
                value={viewMode}
                onValueChange={(v) => setViewMode(v as typeof viewMode)}
              >
                <TabsList>
                  <TabsTrigger value="list" className="px-3">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="px-3">
                    <CalendarDays className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="px-3">
                    <Grid3X3 className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Navigation */}
      {viewMode === "calendar" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold">
                {format(weekStart, "MMMM d")} -{" "}
                {format(addDays(weekStart, 6), "MMMM d, yyyy")}
              </h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Week Calendar */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`border rounded-lg p-2 min-h-[200px] ${
                    isSameDay(day, new Date())
                      ? "bg-teal-50 border-teal-200"
                      : ""
                  }`}
                >
                  <div className="text-center mb-2">
                    <p className="text-xs text-gray-500">
                      {format(day, "EEE")}
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        isSameDay(day, new Date()) ? "text-teal-600" : ""
                      }`}
                    >
                      {format(day, "d")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {getAppointmentsForDay(day)
                      .slice(0, 3)
                      .map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowDetails(true);
                          }}
                          className="text-xs p-1.5 rounded bg-blue-50 border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                          <p className="font-medium truncate">{apt.time}</p>
                          <p className="text-gray-600 truncate">
                            {apt.patientName}
                          </p>
                        </div>
                      ))}
                    {getAppointmentsForDay(day).length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{getAppointmentsForDay(day).length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={appointment.patientPhoto} />
                        <AvatarFallback className="bg-teal-100 text-teal-700">
                          {appointment.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {appointment.patientName}
                          </p>
                          <Badge
                            variant="outline"
                            className={statusColors[appointment.status]}
                          >
                            {appointment.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">
                          {format(parseISO(appointment.date), "MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.time}
                        </p>
                      </div>

                      <div className="hidden md:flex items-center gap-2 text-gray-500">
                        <TypeIcon type={appointment.type} />
                        <span className="text-sm capitalize">
                          {appointment.type}
                        </span>
                      </div>

                      <div className="hidden lg:block text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.doctorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.department}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAppointments.length === 0 && (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No appointments found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="outline"
                    className={statusColors[appointment.status]}
                  >
                    {appointment.status.replace("-", " ")}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Reschedule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarFallback className="bg-teal-100 text-teal-700">
                      {appointment.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.patientName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.reason}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(parseISO(appointment.date), "MMM d, yyyy")} at{" "}
                    {appointment.time}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {appointment.doctorName}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <TypeIcon type={appointment.type} />
                    <span className="ml-2 capitalize">{appointment.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Appointment Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                      {selectedAppointment.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedAppointment.patientName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedAppointment.reason}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={statusColors[selectedAppointment.status]}
                >
                  {selectedAppointment.status.replace("-", " ")}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {format(parseISO(selectedAppointment.date), "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAppointment.time} ({selectedAppointment.duration}{" "}
                    min)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <div className="flex items-center gap-2">
                    <TypeIcon type={selectedAppointment.type} />
                    <span className="font-medium capitalize">
                      {selectedAppointment.type}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">
                    {selectedAppointment.doctorName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">
                    {selectedAppointment.department}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Edit Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
