"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  PauseCircle,
  StopCircle,
  FlaskConical,
  Wifi,
  WifiOff,
  User,
  Calendar,
  FileText,
  Heart,
  Pill,
  Activity,
  Sync,
  Play,
} from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";
import { cn } from "@/lib/utils";

type ConsultationStatus = "Waiting" | "In Progress" | "Completed";

type PatientInfo = {
  name: string;
  age: number;
  gender: string;
  profileImage: string;
  visitReason: string;
  appointmentType: string;
  alerts: Array<{ type: string; message: string }>;
  medicalHistory: Array<{ condition: string; year: string }>;
  currentMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
};

// Enhanced mock patient data with more comprehensive information
const patientInfo: PatientInfo = {
  name: "Sarah Johnson",
  age: 42,
  gender: "Female",
  profileImage: "/patient-avatar.jpg",
  visitReason: "Persistent headaches and fatigue",
  appointmentType: "Follow-up",
  alerts: [
    { type: "allergy", message: "Penicillin allergy" },
    {
      type: "hospitalization",
      message: "Recent hospitalization (3 months ago)",
    },
  ],
  medicalHistory: [
    { condition: "Hypertension", year: "2018" },
    { condition: "Migraine with aura", year: "2020" },
    { condition: "Appendectomy", year: "2010" },
  ],
  currentMedications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "daily" },
    { name: "Sumatriptan", dosage: "50mg", frequency: "as needed" },
    { name: "Multivitamin", dosage: "1 tablet", frequency: "daily" },
  ],
};

export function EncounterHeader() {
  const [historyExpanded, setHistoryExpanded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    consultation,
    updateConsultation,
    isOnline,
    connectionStatus,
    pendingSyncs,
    syncData,
  } = useConsultation();

  // Format the consultation duration with better formatting
  const formatDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle consultation status changes with loading states
  const handleEndVisit = async () => {
    setIsLoading(true);
    try {
      await updateConsultation({ status: "Completed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseVisit = async () => {
    setIsLoading(true);
    try {
      const newStatus =
        consultation.status === "In Progress" ? "Waiting" : "In Progress";
      await updateConsultation({ status: newStatus });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual sync with better UX
  const handleSync = async () => {
    if (isOnline && pendingSyncs) {
      setIsLoading(true);
      try {
        await syncData();
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Enhanced status styling with gradients and better colors
  const getStatusConfig = (status: ConsultationStatus) => {
    switch (status) {
      case "Waiting":
        return {
          className:
            "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200",
          icon: <PauseCircle size={14} className="text-amber-600" />,
        };
      case "In Progress":
        return {
          className:
            "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200",
          icon: <Activity size={14} className="text-blue-600" />,
        };
      case "Completed":
        return {
          className:
            "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200",
          icon: <StopCircle size={14} className="text-green-600" />,
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800",
          icon: null,
        };
    }
  };

  const statusConfig = getStatusConfig(consultation.status);

  // Get patient initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Main Header Card */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Patient Information Section */}
            <div className="flex-1 space-y-4">
              {/* Patient Header */}
              <div className="flex items-start gap-4">
                {/* Enhanced Avatar */}
                <div className="relative">
                  <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg">
                    <User size={24} className="lg:hidden" />
                    <User size={32} className="hidden lg:block" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-xs font-bold text-blue-600">
                      {getInitials(patientInfo.name)}
                    </span>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      {patientInfo.name}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span className="font-medium">
                          {patientInfo.age} years
                        </span>
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-gray-600 font-medium">
                        {patientInfo.gender}
                      </span>
                    </div>
                  </div>

                  {/* Visit Information */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-white/80 border-gray-200 text-gray-700 font-medium px-3 py-1"
                    >
                      <FileText size={14} className="mr-1" />
                      {patientInfo.appointmentType}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium px-3 py-1 shadow-sm">
                      <Heart size={14} className="mr-1" />
                      {patientInfo.visitReason}
                    </Badge>
                  </div>

                  {/* Critical Alerts */}
                  {patientInfo.alerts.length > 0 && (
                    <div className="space-y-2">
                      {patientInfo.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg"
                        >
                          <AlertTriangle
                            size={16}
                            className="text-amber-600 flex-shrink-0"
                          />
                          <span className="text-sm font-medium text-amber-800">
                            {alert.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Medical History */}
              <div className="pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setHistoryExpanded(!historyExpanded)}
                  className="p-2 h-auto text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  {historyExpanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                  <span className="ml-2 font-medium">
                    {historyExpanded ? "Hide" : "View"} Medical History &
                    Medications
                  </span>
                </Button>

                {historyExpanded && (
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    {/* Medical History Card */}
                    <Card className="p-4 bg-white/60 border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText size={18} className="text-blue-600" />
                        <h3 className="font-semibold text-gray-900">
                          Medical History
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {patientInfo.medicalHistory.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-1"
                          >
                            <span className="text-sm text-gray-700">
                              {item.condition}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {item.year}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Current Medications Card */}
                    <Card className="p-4 bg-white/60 border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Pill size={18} className="text-green-600" />
                        <h3 className="font-semibold text-gray-900">
                          Current Medications
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {patientInfo.currentMedications.map((med, index) => (
                          <div key={index} className="py-1">
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-medium text-gray-900">
                                {med.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {med.frequency}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600">
                              {med.dosage}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Consultation Control Panel */}
            <div className="lg:w-80">
              <Card className="p-4 bg-white/80 border-gray-200 shadow-sm">
                <div className="space-y-4">
                  {/* Session Timer */}
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Clock size={20} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Session Duration
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 font-mono">
                      {formatDuration(consultation.duration)}
                    </div>
                  </div>

                  {/* Status and Connection */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Status Badge */}
                    <div className="text-center">
                      <Badge
                        className={cn(
                          "w-full justify-center gap-2 py-2",
                          statusConfig.className
                        )}
                      >
                        {statusConfig.icon}
                        <span className="font-medium">
                          {consultation.status}
                        </span>
                      </Badge>
                    </div>

                    {/* Connection Status */}
                    <div className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          "w-full justify-center gap-2 py-2",
                          isOnline
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        )}
                      >
                        {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                        <span className="font-medium">
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  {/* Sync Status */}
                  {pendingSyncs && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sync size={16} className="text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">
                            Changes pending sync
                          </span>
                        </div>
                        {isOnline && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSync}
                            disabled={isLoading}
                            className="h-7 px-3 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                          >
                            {isLoading ? (
                              <Sync size={12} className="animate-spin" />
                            ) : (
                              "Sync"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 h-10 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                      onClick={handlePauseVisit}
                      disabled={isLoading}
                    >
                      {consultation.status === "In Progress" ? (
                        <PauseCircle size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                      <span className="font-medium">
                        {consultation.status === "In Progress"
                          ? "Pause Visit"
                          : "Resume Visit"}
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 h-10 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-200"
                    >
                      <FlaskConical size={16} />
                      <span className="font-medium">Request Labs</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 h-10 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                      onClick={handleEndVisit}
                      disabled={isLoading}
                    >
                      <StopCircle size={16} />
                      <span className="font-medium">End Visit</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
