"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ChevronRight,
  FileText,
  CalendarPlus,
  CheckCircle,
  ArrowLeft,
  Phone,
  Clock,
  Calendar,
  MapPin,
  Shield,
  AlertCircle,
  Download,
  Share2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AppointmentConfirmationPage() {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  // In a real app, this would come from URL params or context
  const mockAppointment = {
    id: "12345",
    doctor: "Dr. Sarah Johnson",
    specialty: "Psychiatry",
    doctorPhoto: "/assets/doctors/sarah-johnson.jpg",
    date: new Date("2025-08-15T14:30:00"),
    time: "2:30 PM",
    endTime: "3:15 PM",
    type: "video",
    location: "Virtual Visit",
    notes: "Initial consultation for anxiety management",
  };

  const handleCopyDetails = () => {
    const details = `Appointment with ${mockAppointment.doctor}
Date: ${mockAppointment.date.toLocaleDateString()}
Time: ${mockAppointment.time}
Type: ${mockAppointment.type === "video" ? "Video Visit" : "In-person Visit"}
${mockAppointment.location ? `Location: ${mockAppointment.location}` : ""}`;

    navigator.clipboard.writeText(details).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="container max-w-3xl mx-auto p-4 sm:p-6 py-8">
      {/* Back navigation */}
      <Link
        href="/patient/appointments"
        className="inline-flex items-center text-sm text-[#006D77] hover:text-[#004A52] mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Appointments
      </Link>

      {/* Success header */}
      <div className="mb-8 text-center">
        <div className="relative inline-flex mb-4">
          <div className="absolute inset-0 rounded-full bg-[#E8F3F4] animate-ping opacity-30"></div>
          <div className="relative rounded-full bg-[#E8F3F4] p-4">
            <CheckCircle className="h-10 w-10 text-[#006D77]" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Appointment Confirmed
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Your appointment has been successfully scheduled and confirmation
          details have been sent to your email.
        </p>
      </div>

      {/* Appointment details card */}
      <Card className="mb-8 shadow-md border-[#E8F3F4] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F0F9FA] to-white border-b pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-[#006D77]" />
              Appointment Details
            </h2>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
              Confirmed
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <Avatar className="h-20 w-20 rounded-lg ring-4 ring-[#E8F3F4] hidden sm:block">
              <AvatarImage
                src={mockAppointment.doctorPhoto}
                alt={mockAppointment.doctor}
              />
              <AvatarFallback className="bg-gradient-to-br from-[#006D77] to-[#20B2AA] text-white text-xl">
                {mockAppointment.doctor.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mockAppointment.doctor}
                  </h3>
                  <p className="text-[#006D77] font-medium">
                    {mockAppointment.specialty}
                  </p>
                </div>
                <Avatar className="h-16 w-16 rounded-lg ring-4 ring-[#E8F3F4] sm:hidden mt-2 mb-4">
                  <AvatarImage
                    src={mockAppointment.doctorPhoto}
                    alt={mockAppointment.doctor}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#006D77] to-[#20B2AA] text-white text-xl">
                    {mockAppointment.doctor.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-[#006D77]" />
                    {mockAppointment.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Time</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-[#006D77]" />
                    {mockAppointment.time} - {mockAppointment.endTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    {mockAppointment.type === "video" ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect
                            x="1"
                            y="5"
                            width="15"
                            height="14"
                            rx="2"
                            ry="2"
                          />
                        </svg>
                        Video Visit
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                        In-person Visit
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-[#006D77]" />
                    {mockAppointment.location}
                  </p>
                </div>
              </div>

              {mockAppointment.notes && (
                <div className="bg-gray-50 p-3 rounded-lg mb-6">
                  <p className="text-sm text-gray-500 mb-1">Reason for Visit</p>
                  <p className="text-sm text-gray-900">
                    {mockAppointment.notes}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#006D77] text-[#006D77] hover:bg-[#F0F9FA]"
                        onClick={handleCopyDetails}
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Share2 className="mr-2 h-4 w-4" />
                            Copy Details
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy appointment details to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {mockAppointment.type === "video" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    Test Video Connection
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next steps card */}
      <Card className="mb-8 border-[#E8F3F4] shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#F0F9FA] to-white border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-[#006D77]" />
            Next Steps
          </h2>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F3F4] mr-3">
                <FileText className="h-4 w-4 text-[#006D77]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Complete Pre-Visit Forms
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Please complete your medical history and insurance information
                  before your appointment.
                </p>
                <Link href="/patient/records/forms">
                  <Button
                    className="text-white bg-[#006D77] hover:bg-[#005A64] h-9"
                    size="sm"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Complete Forms
                  </Button>
                </Link>
              </div>
            </div>

            <Separator />

            <div className="flex">
              <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F3F4] mr-3">
                <CalendarPlus className="h-4 w-4 text-[#006D77]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Add to Calendar
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Add this appointment to your personal calendar so you don't
                  forget.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 h-9"
                  >
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Google Calendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 h-9"
                  >
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Apple Calendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 h-9"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    .ICS File
                  </Button>
                </div>
              </div>
            </div>

            {mockAppointment.type === "video" && (
              <>
                <Separator />

                <div className="flex">
                  <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Prepare for Video Visit
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Ensure your camera and microphone are working, and you
                      have a quiet space for your appointment.
                    </p>
                    <div className="flex items-center text-blue-600 text-sm">
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      <span>
                        You'll receive a link to join 15 minutes before your
                        appointment
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {mockAppointment.type === "in-person" && (
              <>
                <Separator />

                <div className="flex">
                  <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 mr-3">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Prepare for In-Person Visit
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Please arrive 15 minutes early to complete check-in. Bring
                      your insurance card and ID.
                    </p>
                    <div className="flex items-center text-emerald-600 text-sm">
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      <span>
                        Please wear a mask if you're experiencing any symptoms
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          className="border-[#006D77] text-[#006D77] hover:bg-[#F0F9FA]"
          onClick={() => router.push("/patient/appointments/schedule")}
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book Another Appointment
        </Button>

        <Button
          className="bg-[#006D77] hover:bg-[#005A64]"
          onClick={() => router.push("/patient/appointments")}
        >
          <ChevronRight className="mr-2 h-4 w-4" />
          View All Appointments
        </Button>
      </div>
    </div>
  );
}
