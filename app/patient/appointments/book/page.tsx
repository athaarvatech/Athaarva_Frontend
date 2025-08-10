"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, addDays, isPast, isToday, isTomorrow } from "date-fns";
import {
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle,
  Star,
  MapPin,
  Video,
  Phone,
  Heart,
  Award,
  Users,
  MessageCircle,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Shield,
  Zap,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  experience: number;
  consultationFee: number;
  languages: string[];
  availableToday: boolean;
  nextAvailable: string;
  isVerified: boolean;
  responseTime: string;
  patientsSeen: number;
  specializations: string[];
  about: string;
  education: string[];
  achievements: string[];
}

interface TimeSlot {
  time: string;
  available: boolean;
  type: "routine" | "emergency";
  discounted?: boolean;
  recommended?: boolean;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    reason: "",
    symptoms: "",
    notes: "",
    insuranceProvider: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - AI-powered recommendations
  const aiRecommendations = {
    primaryDoctor: {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Internal Medicine",
      avatar: "/api/placeholder/150/150",
      rating: 4.9,
      reviewCount: 847,
      experience: 12,
      consultationFee: 150,
      languages: ["English", "Spanish"],
      availableToday: true,
      nextAvailable: "Today",
      isVerified: true,
      responseTime: "within 2 hours",
      patientsSeen: 2500,
      specializations: [
        "Preventive Care",
        "Chronic Disease",
        "Health Screenings",
      ],
      about:
        "Board-certified internist with expertise in preventive care and chronic disease management.",
      education: ["Harvard Medical School", "Johns Hopkins Residency"],
      achievements: ["Top Doctor 2023", "Patient Choice Award"],
      matchReason: "Perfect match based on your health profile and preferences",
    },
    timeSlots: [
      { time: "10:00 AM", available: true, type: "routine", recommended: true },
      { time: "2:30 PM", available: true, type: "routine", recommended: true },
      { time: "4:00 PM", available: true, type: "routine" },
    ],
  };

  const doctors: Doctor[] = [
    aiRecommendations.primaryDoctor,
    // ...existing code for other doctors...
  ];

  const availableDates = Array.from({ length: 14 }, (_, i) =>
    addDays(new Date(), i)
  );

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/patient/appointments/confirmation");
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {step === 1
                    ? "Find Your Doctor"
                    : step === 2
                    ? "Choose Your Time"
                    : "Confirm Booking"}
                </h1>
                <p className="text-gray-600">
                  {step === 1
                    ? "Discover the perfect healthcare provider for you"
                    : step === 2
                    ? "Select a convenient time for your appointment"
                    : "Review and confirm your appointment details"}
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step >= stepNumber
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > stepNumber ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-all ${
                        step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Doctor Selection */}
        {step === 1 && (
          <div className="space-y-8">
            {/* AI Recommendation Hero */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <Sparkles className="h-6 w-6" />
                      <span className="text-lg font-semibold">
                        AI-Powered Recommendation
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                      We found your perfect match
                    </h2>
                    <p className="text-blue-100 mb-6">
                      Based on your health profile, preferences, and past
                      appointments
                    </p>

                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 ring-4 ring-white/20">
                        <AvatarImage
                          src={aiRecommendations.primaryDoctor.avatar}
                        />
                        <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                          {aiRecommendations.primaryDoctor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">
                          {aiRecommendations.primaryDoctor.name}
                        </h3>
                        <p className="text-blue-100 mb-2">
                          {aiRecommendations.primaryDoctor.specialty}
                        </p>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>
                              {aiRecommendations.primaryDoctor.rating}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {aiRecommendations.primaryDoctor.patientsSeen}+
                              patients
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span>
                              {aiRecommendations.primaryDoctor.experience} years
                              exp.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      handleDoctorSelect(aiRecommendations.primaryDoctor)
                    }
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
                  >
                    Book with Dr.{" "}
                    {aiRecommendations.primaryDoctor.name.split(" ")[1]}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search by name, specialty, or condition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-lg border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="h-12 px-6 border-gray-200"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Doctors Grid */}
            <div className="grid gap-6">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="relative">
                          <Avatar className="h-20 w-20 ring-4 ring-gray-100 group-hover:ring-blue-200 transition-all">
                            <AvatarImage src={doctor.avatar} />
                            <AvatarFallback className="bg-blue-600 text-white text-xl">
                              {doctor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {doctor.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                              <Shield className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {doctor.name}
                              </h3>
                              <p className="text-blue-600 font-medium mb-2">
                                {doctor.specialty}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">
                                ${doctor.consultationFee}
                              </p>
                              <p className="text-sm text-gray-500">per visit</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {doctor.rating}
                              </span>
                              <span className="text-gray-500">
                                ({doctor.reviewCount} reviews)
                              </span>
                            </div>

                            <div className="flex items-center space-x-1 text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>{doctor.patientsSeen}+ patients</span>
                            </div>

                            <div className="flex items-center space-x-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>Responds {doctor.responseTime}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {doctor.availableToday && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <Zap className="h-3 w-3 mr-1" />
                                Available Today
                              </Badge>
                            )}

                            {doctor.specializations.slice(0, 2).map((spec) => (
                              <Badge
                                key={spec}
                                variant="outline"
                                className="text-xs"
                              >
                                {spec}
                              </Badge>
                            ))}
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2">
                            {doctor.about}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors ml-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {step === 2 && selectedDoctor && (
          <div className="space-y-8">
            {/* Doctor Summary */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedDoctor.avatar} />
                    <AvatarFallback className="bg-blue-600 text-white text-lg">
                      {selectedDoctor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedDoctor.name}
                    </h2>
                    <p className="text-blue-600 font-medium">
                      {selectedDoctor.specialty}
                    </p>

                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedDoctor.rating}</span>
                      </div>
                      <span>
                        ${selectedDoctor.consultationFee} consultation
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar and Time Slots */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Date Selection */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Choose Date</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {availableDates.slice(0, 8).map((date, idx) => {
                      const isSelected =
                        selectedDate &&
                        date.toDateString() === selectedDate.toDateString();
                      const dateLabel = isToday(date)
                        ? "Today"
                        : isTomorrow(date)
                        ? "Tomorrow"
                        : format(date, "EEE");

                      return (
                        <Button
                          key={idx}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => setSelectedDate(date)}
                          className={`h-16 flex flex-col ${
                            isSelected
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "hover:border-blue-300"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {dateLabel}
                          </span>
                          <span className="text-lg font-bold">
                            {format(date, "d")}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Available Times</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-3">
                      {aiRecommendations.timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={
                            selectedTime === slot.time ? "default" : "outline"
                          }
                          onClick={() => setSelectedTime(slot.time)}
                          className={`h-12 relative ${
                            selectedTime === slot.time
                              ? "bg-blue-600 hover:bg-blue-700"
                              : slot.recommended
                              ? "border-green-300 hover:border-green-400"
                              : "hover:border-blue-300"
                          }`}
                        >
                          {slot.time}
                          {slot.recommended && (
                            <div className="absolute -top-1 -right-1">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                          )}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Please select a date to see available times</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {selectedDate && selectedTime && (
              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                >
                  Continue to Details
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && selectedDoctor && selectedDate && selectedTime && (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Appointment Summary */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedDoctor.avatar} />
                    <AvatarFallback className="bg-blue-600 text-white text-lg">
                      {selectedDoctor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedDoctor.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-3">
                      {selectedDoctor.specialty}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Date
                        </div>
                        <p className="font-medium">
                          {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          Time
                        </div>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${selectedDoctor.consultationFee}
                    </p>
                    <p className="text-sm text-gray-500">Consultation fee</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Details Form */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Tell us about your visit</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="reason" className="text-sm font-medium">
                    Reason for visit *
                  </Label>
                  <Select
                    value={appointmentDetails.reason}
                    onValueChange={(value) =>
                      setAppointmentDetails((prev) => ({
                        ...prev,
                        reason: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1 h-12">
                      <SelectValue placeholder="Select the main reason for your visit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine Check-up</SelectItem>
                      <SelectItem value="symptoms">
                        Specific Symptoms
                      </SelectItem>
                      <SelectItem value="followup">Follow-up Visit</SelectItem>
                      <SelectItem value="preventive">
                        Preventive Care
                      </SelectItem>
                      <SelectItem value="consultation">
                        Second Opinion
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="symptoms" className="text-sm font-medium">
                    Current symptoms or concerns
                  </Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe any symptoms or health concerns you'd like to discuss..."
                    className="mt-1 resize-none"
                    rows={3}
                    value={appointmentDetails.symptoms}
                    onChange={(e) =>
                      setAppointmentDetails((prev) => ({
                        ...prev,
                        symptoms: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Additional notes (optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any other information you'd like your doctor to know..."
                    className="mt-1 resize-none"
                    rows={2}
                    value={appointmentDetails.notes}
                    onChange={(e) =>
                      setAppointmentDetails((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="px-6 py-3"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Time Selection
              </Button>

              <Button
                onClick={handleBookingSubmit}
                disabled={isSubmitting || !appointmentDetails.reason}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    Confirm Appointment
                    <CheckCircle className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
