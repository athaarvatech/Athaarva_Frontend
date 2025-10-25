"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Bell, RefreshCw, ChevronRight, Stethoscope, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_CONFIG } from "@/lib/api-config";

// Import widgets
import HealthSummaryWidget from "./HealthSummaryWidget";
import HealthRiskAssessment from "./HealthRiskAssessment";
import MedicationTracker from "./MedicationTracker";
import FamilyHealthOverview from "./FamilyHealthOverview";
import AppointmentsWidget from "./AppointmentsWidget";
import MessageNotificationsWidget from "./MessageNotificationsWidget";
import MedicalRecordsWidget from "./MedicalRecordsWidget";

export default function PatientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const [doctors, setDoctors] = useState([]);
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [hospitalName, setHospitalName] = useState<string | null>(null);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [patientName, setPatientName] = useState("Patient");

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Fetch hospital context and doctors
  useEffect(() => {
    const storedHospitalId = localStorage.getItem('hospital_id');
    const storedHospitalName = localStorage.getItem('hospital_name') || 'Your Hospital';
    const userName = localStorage.getItem('user_name') || 'Patient';
    
    setHospitalName(storedHospitalName);
    setPatientName(userName);
    
    if (storedHospitalId) {
      setHospitalId(storedHospitalId);
      fetchDoctors(storedHospitalId);
    } else {
      // No hospital context, redirect to auth
      router.push('/auth');
    }
  }, [router]);

  const fetchDoctors = async (hospital_id: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/appointments/hospital/${hospital_id}/doctors`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        setDoctors(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Refresh dashboard data
  const refreshDashboard = () => {
    setIsRefreshing(true);
    if (hospitalId) {
      fetchDoctors(hospitalId);
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleBookAppointment = (doctorId: number) => {
    router.push(`/patient/appointments/book?doctor=${doctorId}&hospital=${hospitalId}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#006D77] to-[#2A9D8F] rounded-xl p-6 mb-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-serif">{greeting}, {patientName}</h1>
            <p className="text-white/80 mt-1">Here's your health summary at {hospitalName}</p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Link href="/patient/appointments/book">
              <Button className="bg-white/90 hover:bg-white text-[#006D77]">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </Link>
            <Button
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
              onClick={refreshDashboard}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Available Doctors Section */}
      <Card className="border-[#E8F3F4] hover:shadow-md transition-shadow mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-[#006D77]">
            <Stethoscope className="h-5 w-5 mr-2" />
            Available Doctors at {hospitalName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingDoctors ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#006D77] mb-2" />
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor: any) => (
                <Card key={doctor.doctor_id} className="hover:shadow-lg transition-shadow border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={doctor.professional_details?.profile_image} />
                        <AvatarFallback className="bg-[#E8F3F4] text-[#006D77]">
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {doctor.full_name || 'Dr. Name'}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {doctor.professional_details?.specialization || 'General Practice'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doctor.professional_details?.years_of_experience || doctor.years_of_experience || 0} years exp.
                        </p>
                        {doctor.is_verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-2">
                            Verified
                          </span>
                        )}
                        <Button
                          size="sm"
                          className="mt-3 w-full bg-[#006D77] hover:bg-[#005963]"
                          onClick={() => handleBookAppointment(doctor.doctor_id)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No doctors available at this time.</p>
              <p className="text-sm text-gray-500 mt-1">Please check back later or contact the hospital.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Primary Health Information */}
        <div className="lg:col-span-2 space-y-6">
          <HealthSummaryWidget />
          <MedicationTracker />
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Appointments</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <AppointmentsWidget />
            </TabsContent>
            <TabsContent value="messages">
              <MessageNotificationsWidget />
            </TabsContent>
            <TabsContent value="records">
              <MedicalRecordsWidget />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Secondary Information and Alerts */}
        <div className="space-y-6">
          <HealthRiskAssessment />
          <FamilyHealthOverview />
          <Card className="border-[#E8F3F4] hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h3 className="font-medium text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-[#006D77]" />
                  Notifications
                </h3>
                <PatientNotificationsList />
                <Link
                  href="/patient/notifications"
                  className="text-sm text-[#006D77] hover:underline flex items-center justify-end mt-2"
                >
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Patient Notifications List Component
function PatientNotificationsList() {
  const notifications = [
    {
      id: 1,
      title: "Prescription Refill Ready",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Appointment Reminder: Dr. Johnson",
      time: "Yesterday",
      read: true,
    },
    {
      id: 3,
      title: "Insurance Claim Processed",
      time: "2 days ago",
      read: true,
    },
  ];

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 rounded-md border text-sm ${
            notification.read ? "bg-white" : "bg-[#F0F9FA] border-[#006D77]/20"
          }`}
        >
          <div className="flex justify-between">
            <span className="font-medium">{notification.title}</span>
            <span className="text-xs text-gray-500">{notification.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
