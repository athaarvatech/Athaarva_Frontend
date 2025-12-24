"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  CheckCircle,
  Building2,
  CreditCard,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HospitalHeader from "../components/HospitalHeader";
import HospitalFooter from "../components/HospitalFooter";
import { HospitalService, HospitalProfile } from "@/lib/hospital-service";
import { Skeleton } from "@/components/ui/skeleton";

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  qualification: string;
  consultation_fee: number;
  avatar_url?: string;
  available_today: boolean;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface BookingData {
  specialization: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reason: string;
}

const specializations = [
  { id: "general", name: "General Medicine", icon: Stethoscope },
  { id: "cardiology", name: "Cardiology", icon: Stethoscope },
  { id: "orthopedics", name: "Orthopedics", icon: Stethoscope },
  { id: "pediatrics", name: "Pediatrics", icon: Stethoscope },
  { id: "dermatology", name: "Dermatology", icon: Stethoscope },
  { id: "neurology", name: "Neurology", icon: Stethoscope },
  { id: "ent", name: "ENT", icon: Stethoscope },
  { id: "ophthalmology", name: "Ophthalmology", icon: Stethoscope },
];

const STEPS = [
  { id: 1, title: "Specialization", icon: Building2 },
  { id: 2, title: "Doctor", icon: User },
  { id: 3, title: "Date & Time", icon: Calendar },
  { id: 4, title: "Details", icon: User },
  { id: 5, title: "Confirm", icon: CheckCircle },
];

export default function BookAppointmentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subdomain = params.subdomain as string;
  const basePath = `/hospital/${subdomain}`;
  const preselectedDoctor = searchParams.get("doctor");

  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(preselectedDoctor ? 3 : 1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [bookingData, setBookingData] = useState<BookingData>({
    specialization: "",
    doctorId: preselectedDoctor || "",
    date: "",
    timeSlot: "",
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    reason: "",
  });

  const theme = {
    primaryColor: hospital?.primary_color || "#007C7C",
    secondaryColor: hospital?.secondary_color || "#20B2AA",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const hospitalData = await HospitalService.getHospitalBySubdomain(
          subdomain
        );
        setHospital(hospitalData);
        setDoctors(getMockDoctors());
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [subdomain]);

  useEffect(() => {
    // Generate time slots when date is selected
    if (bookingData.date) {
      setTimeSlots(generateTimeSlots());
    }
  }, [bookingData.date]);

  function getMockDoctors(): Doctor[] {
    return [
      {
        id: "1",
        full_name: "Dr. Priya Sharma",
        specialization: "Cardiology",
        qualification: "MBBS, MD, DM",
        consultation_fee: 800,
        available_today: true,
      },
      {
        id: "2",
        full_name: "Dr. Rajesh Kumar",
        specialization: "Orthopedics",
        qualification: "MBBS, MS",
        consultation_fee: 700,
        available_today: true,
      },
      {
        id: "3",
        full_name: "Dr. Anjali Patel",
        specialization: "Pediatrics",
        qualification: "MBBS, MD",
        consultation_fee: 600,
        available_today: false,
      },
      {
        id: "4",
        full_name: "Dr. Suresh Menon",
        specialization: "General Medicine",
        qualification: "MBBS, MD",
        consultation_fee: 500,
        available_today: true,
      },
    ];
  }

  function generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        id: `${hour}:00`,
        time: `${hour.toString().padStart(2, "0")}:00`,
        available: Math.random() > 0.3,
      });
      slots.push({
        id: `${hour}:30`,
        time: `${hour.toString().padStart(2, "0")}:30`,
        available: Math.random() > 0.3,
      });
    }

    return slots;
  }

  function getMinDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  function getMaxDate() {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  }

  const selectedDoctor = doctors.find((d) => d.id === bookingData.doctorId);
  const filteredDoctors = bookingData.specialization
    ? doctors.filter(
        (d) =>
          d.specialization.toLowerCase() ===
          bookingData.specialization.toLowerCase()
      )
    : doctors;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!bookingData.specialization;
      case 2:
        return !!bookingData.doctorId;
      case 3:
        return !!bookingData.date && !!bookingData.timeSlot;
      case 4:
        return (
          !!bookingData.patientName &&
          !!bookingData.patientPhone &&
          !!bookingData.patientEmail
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = async () => {
    // Submit booking
    console.log("Booking:", bookingData);
    // API call would go here
    alert("Booking confirmed! You will receive a confirmation email shortly.");
  };

  if (loading || !hospital) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HospitalHeader hospital={hospital} />

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep >= step.id
                        ? "text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    style={
                      currentStep >= step.id
                        ? { backgroundColor: theme.primaryColor }
                        : {}
                    }
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium hidden sm:block ${
                      currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${
                      currentStep > step.id ? "" : "bg-gray-200"
                    }`}
                    style={
                      currentStep > step.id
                        ? { backgroundColor: theme.primaryColor }
                        : {}
                    }
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Content */}
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Specialization */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Select Specialization</CardTitle>
                    <CardDescription>
                      Choose the type of consultation you need
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {specializations.map((spec) => (
                        <button
                          key={spec.id}
                          onClick={() =>
                            setBookingData({
                              ...bookingData,
                              specialization: spec.name,
                            })
                          }
                          className={`p-4 rounded-lg border-2 text-center transition-colors ${
                            bookingData.specialization === spec.name
                              ? "border-current"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={
                            bookingData.specialization === spec.name
                              ? {
                                  borderColor: theme.primaryColor,
                                  color: theme.primaryColor,
                                }
                              : {}
                          }
                        >
                          <spec.icon className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-sm font-medium">
                            {spec.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Select Doctor */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Select Doctor</CardTitle>
                    <CardDescription>
                      Choose from our available doctors for{" "}
                      {bookingData.specialization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredDoctors.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          No doctors available for this specialization
                        </p>
                      ) : (
                        filteredDoctors.map((doctor) => (
                          <button
                            key={doctor.id}
                            onClick={() =>
                              setBookingData({
                                ...bookingData,
                                doctorId: doctor.id,
                              })
                            }
                            className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                              bookingData.doctorId === doctor.id
                                ? "border-current"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            style={
                              bookingData.doctorId === doctor.id
                                ? { borderColor: theme.primaryColor }
                                : {}
                            }
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold"
                                style={{ backgroundColor: theme.primaryColor }}
                              >
                                {doctor.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">
                                  {doctor.full_name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {doctor.specialization} •{" "}
                                  {doctor.qualification}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className="font-semibold"
                                  style={{ color: theme.primaryColor }}
                                >
                                  ₹{doctor.consultation_fee}
                                </p>
                                {doctor.available_today && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Available Today
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Select Date & Time */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date & Time</CardTitle>
                    <CardDescription>
                      Choose your preferred appointment slot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <Label className="mb-2 block">Select Date</Label>
                      <Input
                        type="date"
                        min={getMinDate()}
                        max={getMaxDate()}
                        value={bookingData.date}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            date: e.target.value,
                            timeSlot: "",
                          })
                        }
                        className="max-w-xs"
                      />
                    </div>

                    {/* Time Slots */}
                    {bookingData.date && (
                      <div>
                        <Label className="mb-3 block">
                          Available Time Slots
                        </Label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.id}
                              disabled={!slot.available}
                              onClick={() =>
                                setBookingData({
                                  ...bookingData,
                                  timeSlot: slot.time,
                                })
                              }
                              className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                                !slot.available
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : bookingData.timeSlot === slot.time
                                  ? "text-white"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                              style={
                                slot.available &&
                                bookingData.timeSlot === slot.time
                                  ? { backgroundColor: theme.primaryColor }
                                  : {}
                              }
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Patient Details */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Details</CardTitle>
                    <CardDescription>
                      Enter patient information for the appointment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientName">Full Name *</Label>
                        <Input
                          id="patientName"
                          value={bookingData.patientName}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              patientName: e.target.value,
                            })
                          }
                          placeholder="Enter patient name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patientPhone">Phone Number *</Label>
                        <Input
                          id="patientPhone"
                          type="tel"
                          value={bookingData.patientPhone}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              patientPhone: e.target.value,
                            })
                          }
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="patientEmail">Email Address *</Label>
                      <Input
                        id="patientEmail"
                        type="email"
                        value={bookingData.patientEmail}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            patientEmail: e.target.value,
                          })
                        }
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">
                        Reason for Visit (Optional)
                      </Label>
                      <Input
                        id="reason"
                        value={bookingData.reason}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            reason: e.target.value,
                          })
                        }
                        placeholder="Brief description of your concern"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && selectedDoctor && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Confirm Your Appointment</CardTitle>
                    <CardDescription>
                      Please review your booking details before confirming
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Appointment Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                          style={{ backgroundColor: theme.primaryColor }}
                        >
                          {selectedDoctor.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {selectedDoctor.full_name}
                          </h3>
                          <p className="text-gray-600">
                            {selectedDoctor.specialization}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-medium">
                              {new Date(bookingData.date).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-medium">
                              {bookingData.timeSlot}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Patient Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="text-gray-600">Name:</p>
                          <p>{bookingData.patientName}</p>
                          <p className="text-gray-600">Phone:</p>
                          <p>{bookingData.patientPhone}</p>
                          <p className="text-gray-600">Email:</p>
                          <p>{bookingData.patientEmail}</p>
                          {bookingData.reason && (
                            <>
                              <p className="text-gray-600">Reason:</p>
                              <p>{bookingData.reason}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Consultation Fee</span>
                        <span className="font-semibold">
                          ₹{selectedDoctor.consultation_fee}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t">
                        <span className="font-semibold">Total Amount</span>
                        <span
                          className="text-xl font-bold"
                          style={{ color: theme.primaryColor }}
                        >
                          ₹{selectedDoctor.consultation_fee}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 text-center">
                      By confirming, you agree to our{" "}
                      <Link href={`${basePath}/terms`} className="underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href={`${basePath}/privacy`} className="underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                style={{ backgroundColor: theme.primaryColor }}
                className="text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleConfirm}
                style={{ backgroundColor: theme.primaryColor }}
                className="text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Confirm & Pay
              </Button>
            )}
          </div>
        </div>
      </main>

      <HospitalFooter hospital={hospital} />
    </div>
  );
}
