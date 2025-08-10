"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, addDays, isPast, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Phone,
  Star,
  CheckCircle2,
  Filter,
  Sparkles,
  MessageSquare,
  Plus,
  Bookmark,
  AlertCircle,
  Info,
  FileText,
  UploadCloud,
  Shield,
  Heart,
  CalendarDays,
  User,
  ChevronDown,
  Building2,
  Award,
  Languages,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock3,
  Zap,
  Stethoscope,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";

// Contexts
import { useAppointments } from "@/contexts/AppointmentContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

// Booking process steps
enum BookingStep {
  FIND_DOCTOR = 0,
  SELECT_SLOT = 1,
  FINALIZE = 2,
  CONFIRMATION = 3,
}

// Types
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  rating: number;
  reviewCount: number;
  languages: string[];
  nextAvailable: string;
  education: string[];
  experience: number;
  consultationFee: number;
  bio: string;
  acceptingNew: boolean;
  videoConsultation: boolean;
  inPersonConsultation: boolean;
  location: string;
  distance: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  isEmergency?: boolean;
  isAIRecommended?: boolean;
}

interface DaySchedule {
  date: Date;
  slots: TimeSlot[];
}

// Mock data for the demo
const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Julia Smith",
    specialty: "Cardiology",
    photo: "/assets/doctors/julia-smith.jpg",
    rating: 4.9,
    reviewCount: 205,
    languages: ["English", "Spanish"],
    nextAvailable: "Today",
    education: ["Harvard Medical School", "Johns Hopkins Residency"],
    experience: 12,
    consultationFee: 250,
    bio: "Cardiologist specializing in preventive cardiology and heart disease management with compassionate, patient-centered care.",
    acceptingNew: true,
    videoConsultation: true,
    inPersonConsultation: true,
    location: "Heart Care Center",
    distance: "2.3 miles",
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    specialty: "Endocrinology",
    photo: "/assets/doctors/michael-chen.jpg",
    rating: 4.8,
    reviewCount: 189,
    languages: ["English", "Mandarin"],
    nextAvailable: "Tomorrow",
    education: ["Stanford Medical School", "UCSF Medical Center Residency"],
    experience: 9,
    consultationFee: 175,
    bio: "Specialist in diabetes management and thyroid disorders with a focus on lifestyle modifications and holistic wellness.",
    acceptingNew: true,
    videoConsultation: true,
    inPersonConsultation: true,
    location: "Westside Health Pavilion",
    distance: "3.7 miles",
  },
  {
    id: "d3",
    name: "Dr. Sarah Johnson",
    specialty: "Psychiatry",
    photo: "/assets/doctors/sarah-johnson.jpg",
    rating: 4.7,
    reviewCount: 156,
    languages: ["English", "French"],
    nextAvailable: "Today",
    education: ["Yale School of Medicine", "UCLA Medical Center Residency"],
    experience: 15,
    consultationFee: 200,
    bio: "Experienced psychiatrist specializing in anxiety, depression, and stress management with a holistic, empathetic approach.",
    acceptingNew: true,
    videoConsultation: true,
    inPersonConsultation: false,
    location: "Virtual Practice Only",
    distance: "Virtual",
  },
  {
    id: "d4",
    name: "Dr. Robert Williams",
    specialty: "Family Medicine",
    photo: "/assets/doctors/robert-williams.jpg",
    rating: 4.6,
    reviewCount: 208,
    languages: ["English"],
    nextAvailable: "Apr 19, 2025",
    education: ["University of Pennsylvania", "Mayo Clinic Residency"],
    experience: 20,
    consultationFee: 125,
    bio: "Dedicated family physician providing comprehensive care for patients of all ages with warmth and expertise.",
    acceptingNew: true,
    videoConsultation: true,
    inPersonConsultation: true,
    location: "Community Health Partners",
    distance: "1.5 miles",
  },
  {
    id: "d5",
    name: "Dr. Emily Davis",
    specialty: "Neurology",
    photo: "/assets/doctors/emily-davis.jpg",
    rating: 4.9,
    reviewCount: 89,
    languages: ["English", "German"],
    nextAvailable: "Apr 20, 2025",
    education: [
      "Johns Hopkins Medical School",
      "Mass General Hospital Residency",
    ],
    experience: 11,
    consultationFee: 225,
    bio: "Neurologist specializing in headache disorders, epilepsy, and neurodegenerative conditions with cutting-edge treatments.",
    acceptingNew: false,
    videoConsultation: true,
    inPersonConsultation: true,
    location: "Neurological Institute",
    distance: "4.2 miles",
  },
];

// Helper functions
const generateTimeSlots = (date: Date): DaySchedule => {
  const slots: TimeSlot[] = [];
  const isToday = new Date().toDateString() === date.toDateString();

  // Start from the next hour if today, otherwise start from 8 AM
  const startHour = isToday ? new Date().getHours() + 1 : 8;

  // Generate slots from startHour to 7 PM
  for (let hour = startHour; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip past times for today
      if (isToday && hour === startHour && minute < new Date().getMinutes()) {
        continue;
      }

      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      // Randomly determine availability (80% chance of being available)
      const available = Math.random() > 0.2;

      // Mark some slots as emergency or AI recommended
      const isEmergency = hour >= 8 && hour <= 9 && minute === 0 && available;
      const isAIRecommended =
        (hour === 14 || hour === 15) && minute === 30 && available;

      slots.push({
        id: `${date.toISOString()}-${time}`,
        time: format(new Date().setHours(hour, minute), "h:mm a"),
        available,
        isEmergency,
        isAIRecommended,
      });
    }
  }

  return { date, slots };
};

// Main component
export default function AppointmentSchedulePage() {
  // State management
  const [currentStep, setCurrentStep] = useState<BookingStep>(
    BookingStep.FIND_DOCTOR
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [appointmentType, setAppointmentType] = useState<"video" | "in-person">(
    "in-person"
  );
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("any");
  const [showFilters, setShowFilters] = useState(false);

  // Hooks for global state
  const { addAppointment } = useAppointments();
  const { addNotification } = useNotifications();

  // Generate the available time slots for the selected date
  const daySchedule = generateTimeSlots(selectedDate);

  // Filter doctors based on search and filters
  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      specialtyFilter === "all" ||
      doctor.specialty.toLowerCase() === specialtyFilter.toLowerCase();

    const matchesAvailability =
      availabilityFilter === "any" ||
      (availabilityFilter === "today" && doctor.nextAvailable === "Today") ||
      (availabilityFilter === "week" &&
        ["Today", "Tomorrow"].includes(doctor.nextAvailable));

    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  // Morning, afternoon, and evening slots
  const morningSlots = daySchedule.slots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour >= 8 && hour < 12;
  });

  const afternoonSlots = daySchedule.slots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = daySchedule.slots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour >= 17 && hour <= 20;
  });

  // Navigation between dates
  const goToNextDate = () => {
    setSelectedDate(addDays(selectedDate, 1));
    setSelectedTimeSlot(null);
  };

  const goToPreviousDate = () => {
    const prevDate = addDays(selectedDate, -1);
    if (isPast(prevDate) && !isToday(prevDate)) return;
    setSelectedDate(prevDate);
    setSelectedTimeSlot(null);
  };

  // Handler for selecting a doctor
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(BookingStep.SELECT_SLOT);
  };

  // Handler for selecting a time slot
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
      setCurrentStep(BookingStep.FINALIZE);
    }
  };

  // Handle booking submission with context integration
  const handleBookingSubmit = () => {
    if (!selectedDoctor || !selectedTimeSlot) return;

    // Create the new appointment
    const newAppointment = {
      id: Date.now(),
      title: reasonForVisit || `Appointment with Dr. ${selectedDoctor.name}`,
      doctor: selectedDoctor.name,
      doctorPhoto: selectedDoctor.photo,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedTimeSlot.time,
      type: appointmentType,
      status: "confirmed" as const,
      location:
        appointmentType === "in-person" ? selectedDoctor.location : null,
      notes: reasonForVisit,
    };

    // Add to global state
    addAppointment(newAppointment);

    // Add a notification
    addNotification({
      id: Date.now().toString(),
      title: "Appointment Confirmed",
      message: `Your appointment with Dr. ${selectedDoctor.name} on ${format(
        selectedDate,
        "MMM d, yyyy"
      )} at ${selectedTimeSlot.time} has been confirmed.`,
      timestamp: new Date(),
      read: false,
      priority: "normal",
      type: "appointment",
      relatedItemId: newAppointment.id,
      actionUrl: `/patient/appointments/details/${newAppointment.id}`,
    });

    // Move to confirmation step
    setCurrentStep(BookingStep.CONFIRMATION);

    // Store the appointment ID for navigation after confirmation
    sessionStorage.setItem(
      "lastBookedAppointmentId",
      newAppointment.id.toString()
    );
  };

  // Navigate to appointment details after booking
  const handleViewAppointmentDetails = () => {
    const appointmentId = sessionStorage.getItem("lastBookedAppointmentId");
    if (appointmentId) {
      window.location.href = `/patient/appointments/details/${appointmentId}`;
    } else {
      window.location.href = "/patient/appointments";
    }
  };

  // Render functions for each step

  // Step 1: Find Doctor - Completely Redesigned
  const renderFindDoctor = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Find Your Healthcare Provider
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Choose from our network of experienced, compassionate healthcare
          professionals. We'll help you find the right doctor for your needs.
        </p>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by doctor name, specialty, or condition..."
                className="pl-12 h-12 text-base border-slate-200 focus:border-blue-500 bg-white/70 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              <Select
                value={specialtyFilter}
                onValueChange={setSpecialtyFilter}
              >
                <SelectTrigger className="w-48 h-10 bg-white/70 border-slate-200">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="psychiatry">Psychiatry</SelectItem>
                  <SelectItem value="family medicine">
                    Family Medicine
                  </SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={availabilityFilter}
                onValueChange={setAvailabilityFilter}
              >
                <SelectTrigger className="w-40 h-10 bg-white/70 border-slate-200">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10 border-slate-200 hover:bg-slate-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                More Filters
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-slate-600 pt-2 border-t border-slate-200">
              <span>
                <span className="font-medium text-slate-900">
                  {filteredDoctors.length}
                </span>{" "}
                healthcare providers found
              </span>
              <Select defaultValue="rating">
                <SelectTrigger className="w-40 h-8 bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="availability">
                    Earliest Available
                  </SelectItem>
                  <SelectItem value="distance">Closest</SelectItem>
                  <SelectItem value="price">Lowest Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid - Redesigned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onSelect={handleDoctorSelect}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No doctors found
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Try adjusting your search criteria or filters to find more
            healthcare providers.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSpecialtyFilter("all");
              setAvailabilityFilter("any");
            }}
            className="border-slate-200 text-slate-600"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );

  // Enhanced Doctor Card Component
  const DoctorCard = ({
    doctor,
    onSelect,
  }: {
    doctor: Doctor;
    onSelect: (doctor: Doctor) => void;
  }) => {
    return (
      <Card className="group bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm hover:shadow-md rounded-2xl transition-all duration-300 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            <Avatar className="h-16 w-16 ring-4 ring-slate-100 group-hover:ring-blue-200 transition-all">
              <AvatarImage src={doctor.photo} alt={doctor.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg">
                {doctor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {doctor.specialty}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-medium text-slate-900">
                    {doctor.rating}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({doctor.reviewCount})
                  </span>
                </div>
              </div>

              {/* Availability Badge */}
              <div className="mb-3">
                {doctor.nextAvailable === "Today" ? (
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    <Clock3 className="h-3 w-3 mr-1" />
                    Available Today
                  </Badge>
                ) : doctor.nextAvailable === "Tomorrow" ? (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock3 className="h-3 w-3 mr-1" />
                    Available Tomorrow
                  </Badge>
                ) : (
                  <Badge className="bg-slate-50 text-slate-700 border-slate-200">
                    <Clock3 className="h-3 w-3 mr-1" />
                    Next: {doctor.nextAvailable}
                  </Badge>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div className="text-center">
                  <Award className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <div className="font-medium text-slate-900">
                    {doctor.experience}y
                  </div>
                  <div className="text-slate-500 text-xs">Experience</div>
                </div>
                <div className="text-center">
                  <CreditCard className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <div className="font-medium text-slate-900">
                    ${doctor.consultationFee}
                  </div>
                  <div className="text-slate-500 text-xs">Consultation</div>
                </div>
                <div className="text-center">
                  <Languages className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                  <div className="font-medium text-slate-900">
                    {doctor.languages.length}
                  </div>
                  <div className="text-slate-500 text-xs">Languages</div>
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-wrap gap-2 mb-4">
                {doctor.videoConsultation && (
                  <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                    <Video className="h-3 w-3 mr-1" />
                    Video Visits
                  </div>
                )}
                {doctor.inPersonConsultation && (
                  <div className="flex items-center bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs">
                    <Building2 className="h-3 w-3 mr-1" />
                    In-Person
                  </div>
                )}
                {doctor.acceptingNew && (
                  <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium">
                    Accepting New Patients
                  </div>
                )}
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                {doctor.bio}
              </p>

              {/* Location */}
              <div className="flex items-center text-sm text-slate-500 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{doctor.location}</span>
                {doctor.distance !== "Virtual" && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{doctor.distance}</span>
                  </>
                )}
              </div>

              {/* Book Button */}
              <Button
                onClick={() => onSelect(doctor)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all"
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 2: Select time slot - Enhanced
  const renderSelectTimeSlot = () => {
    if (!selectedDoctor) return null;

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(BookingStep.FIND_DOCTOR)}
          className="mb-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Doctor Selection
        </Button>

        {/* Doctor Summary Card */}
        <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-4 ring-white shadow-sm">
                <AvatarImage
                  src={selectedDoctor.photo}
                  alt={selectedDoctor.name}
                />
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                  {selectedDoctor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {selectedDoctor.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {selectedDoctor.specialty}
                </p>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                    <span>
                      {selectedDoctor.rating} ({selectedDoctor.reviewCount}{" "}
                      reviews)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{selectedDoctor.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-900">
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousDate}
                disabled={
                  isPast(addDays(selectedDate, -1)) &&
                  !isToday(addDays(selectedDate, -1))
                }
                className="h-9 w-9 p-0 border-slate-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center">
                <h4 className="font-semibold text-slate-900">
                  {format(selectedDate, "EEEE")}
                </h4>
                <p className="text-sm text-slate-600">
                  {format(selectedDate, "MMMM d, yyyy")}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextDate}
                className="h-9 w-9 p-0 border-slate-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Weekly Calendar */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, i) => {
                const date = addDays(new Date(), i);
                const isSelected =
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth();

                return (
                  <Button
                    key={i}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedDate(date)}
                    className={`h-auto py-3 flex flex-col items-center border-slate-200 ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {format(date, "EEE")}
                    </span>
                    <span className="text-base font-semibold">
                      {format(date, "d")}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Available Times
            </CardTitle>
            <p className="text-sm text-slate-600">
              Choose your preferred appointment time
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {morningSlots.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
                  Morning (8:00 AM - 12:00 PM)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {morningSlots.map((slot) => (
                    <TimeSlotButton
                      key={slot.id}
                      slot={slot}
                      onSelect={handleTimeSlotSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {afternoonSlots.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Afternoon (12:00 PM - 5:00 PM)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {afternoonSlots.map((slot) => (
                    <TimeSlotButton
                      key={slot.id}
                      slot={slot}
                      onSelect={handleTimeSlotSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {eveningSlots.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                  Evening (5:00 PM - 8:00 PM)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {eveningSlots.map((slot) => (
                    <TimeSlotButton
                      key={slot.id}
                      slot={slot}
                      onSelect={handleTimeSlotSelect}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointment Type Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-900 flex items-center">
              <Video className="h-5 w-5 mr-2 text-blue-600" />
              Appointment Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant={appointmentType === "video" ? "default" : "outline"}
                onClick={() => setAppointmentType("video")}
                className={`h-auto p-4 flex flex-col items-center justify-center space-y-2 ${
                  appointmentType === "video"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
                disabled={!selectedDoctor?.videoConsultation}
              >
                <Video className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Video Visit</div>
                  <div className="text-xs opacity-80">Meet from anywhere</div>
                </div>
              </Button>

              <Button
                variant={
                  appointmentType === "in-person" ? "default" : "outline"
                }
                onClick={() => setAppointmentType("in-person")}
                className={`h-auto p-4 flex flex-col items-center justify-center space-y-2 ${
                  appointmentType === "in-person"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
                disabled={!selectedDoctor?.inPersonConsultation}
              >
                <Building2 className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">In-Person Visit</div>
                  <div className="text-xs opacity-80">Visit the clinic</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        {selectedTimeSlot && (
          <div className="flex justify-end">
            <Button
              onClick={() => setCurrentStep(BookingStep.FINALIZE)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Continue to Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Time Slot Button Component
  const TimeSlotButton = ({
    slot,
    onSelect,
  }: {
    slot: TimeSlot;
    onSelect: (slot: TimeSlot) => void;
  }) => {
    const getSlotStyles = () => {
      if (!slot.available) {
        return "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed";
      }
      if (slot.isEmergency) {
        return "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100";
      }
      if (slot.isAIRecommended) {
        return "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100";
      }
      return "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-300";
    };

    return (
      <Button
        onClick={() => onSelect(slot)}
        disabled={!slot.available}
        variant="outline"
        className={`h-auto py-3 px-4 flex flex-col items-center justify-center transition-all ${getSlotStyles()}`}
      >
        <div className="font-medium text-sm">{slot.time}</div>
        {slot.isAIRecommended && (
          <div className="flex items-center text-xs mt-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Recommended
          </div>
        )}
        {slot.isEmergency && (
          <div className="flex items-center text-xs mt-1">
            <Zap className="h-3 w-3 mr-1" />
            Same-day
          </div>
        )}
      </Button>
    );
  };

  // Step 3: Finalize Appointment - Enhanced
  const renderFinalizeAppointment = () => (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => setCurrentStep(BookingStep.SELECT_SLOT)}
        className="mb-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Time Selection
      </Button>

      {/* Appointment Summary */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-blue-200/50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Appointment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16 ring-4 ring-white shadow-sm">
                  <AvatarImage
                    src={selectedDoctor?.photo}
                    alt={selectedDoctor?.name}
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {selectedDoctor?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-1">
                    {selectedDoctor?.name}
                  </h4>
                  <p className="text-blue-600 font-medium mb-3">
                    {selectedDoctor?.specialty}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Date:</span>
                      <div className="font-medium text-slate-900">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Time:</span>
                      <div className="font-medium text-slate-900">
                        {selectedTimeSlot?.time}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <div className="font-medium text-slate-900 flex items-center">
                        {appointmentType === "video" ? (
                          <>
                            <Video className="h-4 w-4 mr-1.5 text-blue-500" />
                            Video Visit
                          </>
                        ) : (
                          <>
                            <Building2 className="h-4 w-4 mr-1.5 text-emerald-500" />
                            In-Person Visit
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Location:</span>
                      <div className="font-medium text-slate-900">
                        {appointmentType === "video"
                          ? "Online"
                          : selectedDoctor?.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-sm text-slate-500 mb-1">
                Consultation Fee
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                ${selectedDoctor?.consultationFee}
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Insurance may apply
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Form */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">
            Appointment Details
          </CardTitle>
          <p className="text-sm text-slate-600">
            Help us prepare for your visit by providing some additional
            information.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label
              htmlFor="reason"
              className="text-sm font-medium text-slate-700 mb-2 block"
            >
              Reason for Visit <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please describe your symptoms, concerns, or the reason for your visit..."
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              className="resize-none focus:ring-blue-500 focus:border-blue-500 border-slate-200"
              rows={4}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 block flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              Medical Documents (Optional)
            </Label>
            <div
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setHasUploaded(true)}
            >
              {hasUploaded ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="font-medium text-emerald-600 mb-1">
                    Documents uploaded successfully
                  </p>
                  <p className="text-sm text-slate-500">
                    Your medical records are ready for review
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <UploadCloud className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="font-medium text-slate-700 mb-1">
                    Upload medical documents
                  </p>
                  <p className="text-sm text-slate-500 mb-2">
                    Share relevant medical records, test results, or images
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports PDF, JPG, PNG files up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={isPrivacyAccepted}
                onCheckedChange={(checked) =>
                  setIsPrivacyAccepted(checked as boolean)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="terms"
                  className="text-sm text-slate-700 leading-relaxed"
                >
                  I agree to WellSphere's{" "}
                  <Link
                    href="#"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                  . I understand the cancellation policy and consent to receive
                  appointment reminders.
                </Label>
                <p className="text-xs text-slate-500 mt-2">
                  Cancellations must be made at least 24 hours in advance to
                  avoid fees.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleBookingSubmit}
          disabled={!isPrivacyAccepted || !reasonForVisit.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Confirm Appointment
        </Button>
      </div>
    </div>
  );

  // Enhanced Confirmation Step
  const renderConfirmation = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-12">
      {/* Success Animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25"></div>
        <div className="relative bg-gradient-to-r from-emerald-50 to-green-50 rounded-full p-6 shadow-lg">
          <CheckCircle2 className="h-16 w-16 text-emerald-600" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 mb-3">
        Appointment Confirmed!
      </h2>
      <p className="text-slate-600 mb-8 max-w-lg leading-relaxed">
        Your appointment with {selectedDoctor?.name} on{" "}
        {format(selectedDate, "EEEE, MMMM d")} at {selectedTimeSlot?.time} has
        been successfully scheduled.
      </p>

      {/* Next Steps Card */}
      <Card className="max-w-md w-full mb-8 bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-slate-900 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            What's Next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 mb-1">
                Calendar Reminder
              </p>
              <p className="text-sm text-slate-600">
                Check your email for calendar details
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 mb-1">Pre-visit Forms</p>
              <p className="text-sm text-slate-600">
                Complete your medical history
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Video className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 mb-1">
                Prepare for Your Visit
              </p>
              <p className="text-sm text-slate-600">
                {appointmentType === "video"
                  ? "Test your camera and microphone"
                  : "Arrive 15 minutes early with insurance"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(BookingStep.FIND_DOCTOR)}
          className="border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Book Another Appointment
        </Button>
        <Button
          onClick={handleViewAppointmentDetails}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          View Appointment Details
        </Button>
      </div>
    </div>
  );

  // Main render based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case BookingStep.FIND_DOCTOR:
        return renderFindDoctor();
      case BookingStep.SELECT_SLOT:
        return renderSelectTimeSlot();
      case BookingStep.FINALIZE:
        return renderFinalizeAppointment();
      case BookingStep.CONFIRMATION:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-blue-50/20 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-slate-500 mb-2">
                <Link
                  href="/patient/appointments"
                  className="hover:text-slate-700 transition-colors"
                >
                  Appointments
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span>Schedule New</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Schedule Your Appointment
              </h1>
              <p className="text-slate-600">
                Book your next healthcare visit in just a few simple steps
              </p>
            </div>

            <Link href="/patient/appointments">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Appointments
              </Button>
            </Link>
          </div>

          {/* Progress Steps */}
          {currentStep !== BookingStep.CONFIRMATION && (
            <div className="mt-6">
              <div className="flex items-center justify-center max-w-md mx-auto">
                {[0, 1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        currentStep >= step
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {currentStep > step ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        step + 1
                      )}
                    </div>
                    {step < 2 && (
                      <div
                        className={`w-16 h-1 transition-all ${
                          currentStep > step ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-slate-600">
                <span>Find Doctor</span>
                <span>Select Time</span>
                <span>Confirm</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
