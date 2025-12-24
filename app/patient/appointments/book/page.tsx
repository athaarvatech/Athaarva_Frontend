/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { API_CONFIG } from "@/lib/api-config";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export default function AppointmentBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctor");
  const hospitalId =
    searchParams.get("hospital") || localStorage.getItem("hospital_id");
  const patientId = localStorage.getItem("user_id");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [visitType, setVisitType] = useState("in-person");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate && doctorId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, doctorId]);

  // Fetch doctor info
  useEffect(() => {
    if (doctorId && hospitalId) {
      fetchDoctorInfo();
    }
  }, [doctorId, hospitalId]);

  const fetchDoctorInfo = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/appointments/hospital/${hospitalId}/doctors`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const doctor = result.data?.find(
          (d: any) => d.doctor_id === parseInt(doctorId || "0")
        );
        setDoctorInfo(doctor);
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !doctorId) return;

    setLoadingSlots(true);
    setError(null);

    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/appointments/doctor/${doctorId}/available-slots?appointment_date=${dateStr}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAvailableSlots(result.data || []);
      } else {
        setError("Failed to load available slots");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setError("An error occurred while loading slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookAppointment = async () => {
    if (
      !selectedSlot ||
      !selectedDate ||
      !doctorId ||
      !hospitalId ||
      !patientId
    ) {
      setError("Please select a time slot");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/appointments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            hospital_id: parseInt(hospitalId),
            patient_id: parseInt(patientId),
            doctor_id: parseInt(doctorId),
            appointment_date: selectedDate.toISOString().split("T")[0],
            start_time: selectedSlot.start_time,
            end_time: selectedSlot.end_time,
            visit_type: visitType,
            reason_for_visit: reasonForVisit || null,
            appointment_type: "consultation",
          }),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/patient/dashboard");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError("An error occurred while booking the appointment");
    } finally {
      setLoading(false);
    }
  };

  if (!doctorId || !hospitalId || !patientId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Missing required information. Please try again from the dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Appointment Booked!
            </h2>
            <p className="text-gray-600 mb-4">
              Your appointment has been successfully scheduled.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          {doctorInfo && (
            <p className="text-gray-600 mt-2">
              with {doctorInfo.full_name} -{" "}
              {doctorInfo.professional_details?.specialization ||
                "General Practice"}
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const maxDate = new Date();
                  maxDate.setDate(maxDate.getDate() + 30);
                  return date < today || date > maxDate;
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Right Column - Time & Details */}
          <div className="space-y-6">
            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Available Time Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading slots...</span>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots
                      .filter((slot) => slot.available)
                      .map((slot, index) => (
                        <Button
                          key={index}
                          variant={
                            selectedSlot === slot ? "default" : "outline"
                          }
                          onClick={() => setSelectedSlot(slot)}
                          className="w-full text-sm"
                          disabled={!slot.available}
                        >
                          {slot.start_time.substring(0, 5)}
                        </Button>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    No available slots for this date
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Visit Type & Details */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="visitType">Visit Type</Label>
                    <Select value={visitType} onValueChange={setVisitType}>
                      <SelectTrigger id="visitType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">
                          In-Person Visit
                        </SelectItem>
                        <SelectItem value="video">
                          Video Consultation
                        </SelectItem>
                        <SelectItem value="phone">
                          Phone Consultation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                    <Textarea
                      id="reason"
                      rows={3}
                      value={reasonForVisit}
                      onChange={(e) => setReasonForVisit(e.target.value)}
                      placeholder="Describe your symptoms or reason for visit..."
                      className="resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleBookAppointment}
                    disabled={!selectedSlot || loading}
                    className="w-full bg-[#006D77] hover:bg-[#005963]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirm Appointment
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
