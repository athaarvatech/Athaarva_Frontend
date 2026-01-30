"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  format,
  isPast,
  isToday,
  isTomorrow,
  addDays,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  Calendar,
  Video,
  MapPin,
  Phone,
  Plus,
  Clock,
  Search,
  Filter,
  ChevronRight,
  Heart,
  Star,
  Users,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  MoreHorizontal,
  Play,
  ArrowRight,
  CalendarDays,
  Timer,
  Activity,
  Shield,
  Zap,
  CheckCircle,
  Info,
  ChevronDown,
  Eye,
  Edit3,
  X,
  AlertTriangle,
  Headphones,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import our contexts
import { useAppointments, Appointment } from "@/contexts/AppointmentContext";
import { useMedicalRecords } from "@/contexts/MedicalRecordsContext";
import { useNotifications } from "@/contexts/NotificationsContext";

// Types - Extended interface for UI with optional fields
interface AppointmentType extends Appointment {
  preparation?: string[];
  urgent?: boolean;
  canJoinEarly?: boolean;
  estimatedWaitTime?: number;
  reminderSent?: boolean;
}

// Enhanced helper functions
const getAppointmentTypeIcon = (type?: string) => {
  switch (type) {
    case "in-person":
      return <MapPin className="h-4 w-4 text-emerald-600" />;
    case "video":
      return <Video className="h-4 w-4 text-blue-600" />;
    case "phone":
      return <Phone className="h-4 w-4 text-purple-600" />;
    default:
      return <Calendar className="h-4 w-4 text-gray-600" />;
  }
};

const formatAppointmentDate = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  const daysDiff = Math.ceil(
    (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff <= 7) return format(date, "EEEE"); // Show day name for this week
  return format(date, "MMM d, yyyy");
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "pending":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "cancelled":
      return "text-red-700 bg-red-50 border-red-200";
    case "completed":
      return "text-slate-700 bg-slate-50 border-slate-200";
    default:
      return "text-blue-700 bg-blue-50 border-blue-200";
  }
};

const getUrgencyIndicator = (appointment: AppointmentType) => {
  if (appointment.urgent) {
    return (
      <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
        <AlertTriangle className="h-3 w-3" />
        <span>Urgent</span>
      </div>
    );
  }

  if (isToday(appointment.date)) {
    return (
      <div className="flex items-center space-x-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium">
        <Clock className="h-3 w-3" />
        <span>Today</span>
      </div>
    );
  }

  return null;
};

// Main component
export function AppointmentsPageClient() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeView, setActiveView] = useState<"upcoming" | "past">("upcoming");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  // Use our contexts
  const { upcomingAppointments, pastAppointments } = useAppointments();

  // Enhanced filtering and sorting
  const processedAppointments = useMemo(() => {
    const appointments =
      activeView === "upcoming" ? upcomingAppointments : pastAppointments;

    let filtered = appointments.filter((appointment) => {
      const matchesSearch =
        (appointment.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false) ||
        (appointment.specialty
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false) ||
        (appointment.notes &&
          appointment.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSpecialty =
        filterSpecialty === "all" || appointment.specialty === filterSpecialty;
      const matchesType =
        filterType === "all" || appointment.type === filterType;

      return matchesSearch && matchesSpecialty && matchesType;
    });

    // Sort appointments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return a.date.getTime() - b.date.getTime();
        case "doctor":
          return (a.doctor ?? "").localeCompare(b.doctor ?? "");
        case "specialty":
          return (a.specialty ?? "").localeCompare(b.specialty ?? "");
        case "urgency":
          // urgent field is on local AppointmentType but not on context Appointment
          return a.date.getTime() - b.date.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    upcomingAppointments,
    pastAppointments,
    activeView,
    searchTerm,
    filterSpecialty,
    filterType,
    sortBy,
  ]);

  const nextAppointment: AppointmentType | null =
    upcomingAppointments.length > 0
      ? (upcomingAppointments[0] as AppointmentType)
      : null;
  const todayAppointments = upcomingAppointments.filter((apt) =>
    isToday(apt.date)
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const thisWeekAppointments = upcomingAppointments.filter((apt) =>
    isWithinInterval(apt.date, {
      start: startOfDay(new Date()),
      end: endOfDay(addDays(new Date(), 7)),
    })
  );

  // Get unique specialties for filter
  const specialties = useMemo(() => {
    const allSpecs = [...upcomingAppointments, ...pastAppointments]
      .map((apt) => apt.specialty)
      .filter((spec): spec is string => Boolean(spec));
    return [...new Set(allSpecs)];
  }, [upcomingAppointments, pastAppointments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-blue-50/20 to-indigo-50/30">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-white border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with breadcrumb-style navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-slate-500 mb-2">
                <Link
                  href="/patient/dashboard"
                  className="hover:text-slate-700 transition-colors"
                >
                  Dashboard
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span>Appointments</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Your Healthcare Appointments
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl">
                Manage your upcoming visits, view appointment history, and stay
                connected with your healthcare team.
              </p>
            </div>

            <Link href="/patient/appointments/schedule">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 px-4 sm:px-6 py-2.5 text-sm sm:text-base">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline">Schedule New</span>
                <span className="sm:hidden">Book</span>
              </Button>
            </Link>
          </div>

          {/* Next Appointment Hero Card - Redesigned */}
          {nextAppointment && (
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-lg rounded-2xl overflow-hidden text-white mb-8">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-blue-100 text-sm font-medium">
                        Next Appointment
                      </span>
                      {nextAppointment.urgent && (
                        <Badge className="bg-red-500 border-red-400 text-white text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Dr. {nextAppointment.doctor}
                        </h3>
                        <p className="text-blue-100 mb-4">
                          {nextAppointment.specialty}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 text-blue-100">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">
                              {formatAppointmentDate(nextAppointment.date)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-blue-100">
                            <Clock className="h-4 w-4" />
                            <span>{nextAppointment.time}</span>
                            {nextAppointment.duration && (
                              <span className="text-xs">
                                ({nextAppointment.duration})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 text-blue-100">
                            {getAppointmentTypeIcon(nextAppointment.type)}
                            <span className="capitalize">
                              {nextAppointment.type === "in-person"
                                ? "In-Person Visit"
                                : nextAppointment.type === "video"
                                ? "Video Visit"
                                : "Phone Call"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center space-y-3">
                        {nextAppointment.type === "video" &&
                          nextAppointment.canJoinEarly && (
                            <Button className="bg-green-600 hover:bg-green-700 text-white border-0 w-full">
                              <Video className="h-4 w-4 mr-2" />
                              Join Video Call
                            </Button>
                          )}

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>

                        {nextAppointment.preparation &&
                          nextAppointment.preparation.length > 0 && (
                            <div className="bg-amber-500/20 border border-amber-400/30 rounded-lg p-3 mt-4">
                              <div className="flex items-center space-x-2 mb-1">
                                <AlertCircle className="h-4 w-4 text-amber-200" />
                                <span className="text-sm font-medium text-amber-100">
                                  Preparation Needed
                                </span>
                              </div>
                              <p className="text-xs text-amber-100 leading-relaxed">
                                {nextAppointment.preparation[0]}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <Avatar className="h-16 w-16 ring-4 ring-white/20 ml-6">
                    <AvatarImage src={nextAppointment.doctorPhoto} />
                    <AvatarFallback className="bg-blue-800 text-white text-lg">
                      {nextAppointment.doctor?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">
                      {upcomingAppointments.length}
                    </p>
                    <p className="text-slate-600 text-sm">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Timer className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">
                      {todayAppointments.length}
                    </p>
                    <p className="text-slate-600 text-sm">Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">
                      {
                        pastAppointments.filter((a) => a.status === "completed")
                          .length
                      }
                    </p>
                    <p className="text-slate-600 text-sm">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">
                      {
                        new Set(
                          [...upcomingAppointments, ...pastAppointments].map(
                            (a) => a.doctor
                          )
                        ).size
                      }
                    </p>
                    <p className="text-slate-600 text-sm">Providers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search and Filter Bar */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search by doctor, specialty, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 text-base border-slate-200 focus:border-blue-500 bg-white/70 rounded-xl"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select
                  value={filterSpecialty}
                  onValueChange={setFilterSpecialty}
                >
                  <SelectTrigger className="w-40 h-11 bg-white/70 border-slate-200">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32 h-11 bg-white/70 border-slate-200">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 h-11 bg-white/70 border-slate-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="specialty">Specialty</SelectItem>
                    <SelectItem value="urgency">Urgency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center mt-4">
              <div className="bg-slate-100 rounded-xl p-1 flex">
                <Button
                  variant={activeView === "upcoming" ? "default" : "ghost"}
                  onClick={() => setActiveView("upcoming")}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === "upcoming"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Upcoming ({upcomingAppointments.length})
                </Button>
                <Button
                  variant={activeView === "past" ? "default" : "ghost"}
                  onClick={() => setActiveView("past")}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeView === "past"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Past ({pastAppointments.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        {processedAppointments.length > 0 ? (
          <div className="space-y-4">
            {processedAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md rounded-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-14 w-14 ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all">
                        <AvatarImage src={appointment.doctorPhoto} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                          {appointment.doctor?.charAt(0) ?? "?"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            Dr. {appointment.doctor ?? "Unknown"}
                          </h3>
                          <Badge
                            className={`${getStatusColor(
                              appointment.status
                            )} text-xs font-medium`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </Badge>
                          {getUrgencyIndicator(appointment)}
                        </div>

                        <p className="text-blue-600 font-medium mb-3 text-sm">
                          {appointment.specialty}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">
                              {formatAppointmentDate(appointment.date)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                            {appointment.duration && (
                              <span className="text-slate-400">
                                ({appointment.duration})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            {getAppointmentTypeIcon(appointment.type)}
                            <span className="capitalize">
                              {appointment.type === "in-person"
                                ? "In-Person"
                                : appointment.type === "video"
                                ? "Video Call"
                                : "Phone Call"}
                            </span>
                          </div>
                        </div>

                        {appointment.location &&
                          appointment.type === "in-person" && (
                            <div className="flex items-center space-x-2 text-slate-500 text-sm mt-2">
                              <MapPin className="h-3 w-3" />
                              <span>{appointment.location}</span>
                            </div>
                          )}

                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <Info className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-slate-700 leading-relaxed">
                                {appointment.notes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      {/* Primary Action Button */}
                      {appointment.type === "video" &&
                        activeView === "upcoming" &&
                        (appointment as AppointmentType).canJoinEarly && (
                          <Button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2">
                            <Video className="h-4 w-4 mr-2" />
                            Join Now
                          </Button>
                        )}

                      {/* Quick Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 hover:bg-slate-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>

                        {activeView === "upcoming" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200 hover:bg-slate-50"
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-slate-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View Full Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message Doctor
                            </DropdownMenuItem>
                            {activeView === "upcoming" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Appointment
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Enhanced Empty State
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-blue-500" />
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {activeView === "upcoming"
                  ? "No upcoming appointments"
                  : "No appointment history"}
              </h3>

              <p className="text-slate-600 mb-8 leading-relaxed">
                {activeView === "upcoming"
                  ? searchTerm ||
                    filterSpecialty !== "all" ||
                    filterType !== "all"
                    ? "No appointments match your current filters. Try adjusting your search criteria."
                    : "You&apos;re all set! Ready to schedule your next healthcare visit?"
                  : "Your completed appointment history will appear here as you visit your healthcare providers."}
              </p>

              {activeView === "upcoming" && (
                <div className="space-y-4">
                  <Link href="/patient/appointments/schedule">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base shadow-sm hover:shadow-md transition-all">
                      <Plus className="h-5 w-5 mr-2" />
                      Schedule Your First Appointment
                    </Button>
                  </Link>

                  {(searchTerm ||
                    filterSpecialty !== "all" ||
                    filterType !== "all") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterSpecialty("all");
                        setFilterType("all");
                      }}
                      className="border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
