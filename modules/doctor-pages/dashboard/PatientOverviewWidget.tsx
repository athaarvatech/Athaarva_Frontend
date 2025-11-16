import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ChevronRight,
  Search,
  Filter,
  Clock,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { API_CONFIG } from "@/lib/api-config";

interface Patient {
  id: string; // UUID (changed from number)
  name: string;
  status: string;
  summary: string;
  priority: string;
  age: number;
  gender: string;
  lastVisit: string | null;
  nextAppointment: string | null;
  appointmentId?: string; // UUID (changed from number)
}

const PatientOverviewWidget = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string | null>(null); // UUID (changed from number)

  // Get doctor ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setDoctorId(userId); // Already UUID string
    }
  }, []);

  // Fetch patients from appointments
  const fetchPatients = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/appointments/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const appointments = result.data || [];

        // Extract unique patients from appointments
        const uniquePatients = new Map();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        appointments.forEach((apt: any) => {
          if (!uniquePatients.has(apt.patient_id)) {
            const patientDetails = apt.patient_details || {};
            uniquePatients.set(apt.patient_id, {
              id: apt.patient_id || apt.id, // UUID
              name:
                apt.patient_name || apt.patient?.full_name || "Unknown Patient",
              status:
                apt.status === "confirmed" ? "Active Treatment" : "Follow-up",
              summary:
                apt.reason ||
                apt.reason_for_visit ||
                apt.appointment_type ||
                "Consultation",
              priority: apt.status === "pending" ? "high" : "medium",
              age: patientDetails.age || 0,
              gender: patientDetails.gender || "Unknown",
              lastVisit: null, // Would need separate query for this
              nextAppointment: apt.appointment_date,
              appointmentId: apt.id || apt.appointment_id, // UUID
            });
          }
        });

        setPatients(Array.from(uniquePatients.values()));
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    if (doctorId) {
      fetchPatients();
    }
  }, [doctorId, fetchPatients]);

  // Filter patients based on search and priority
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      filterPriority === "all" || patient.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#2D6A4F] text-white";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle patient selection for detailed view
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(selectedPatient?.id === patient.id ? null : patient);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#006D77] flex items-center">
          <Users className="mr-2" size={20} />
          Patient Overview
        </h2>
        <Link
          href="/Doctor/Patients"
          className="text-[#006D77] hover:underline flex items-center"
        >
          View Patient List <ChevronRight size={16} />
        </Link>
      </div>

      <div className="mb-4 relative">
        <div className="flex">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search patients"
              className="w-full p-2 pl-8 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#006D77]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-3 text-gray-400" size={16} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border-y border-r rounded-r-md ${
              showFilters
                ? "bg-[#E8F3F4] text-[#006D77]"
                : "bg-white text-gray-600"
            }`}
          >
            <Filter size={16} />
          </button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md p-3">
            <h3 className="text-sm font-medium mb-2">Filter by Priority</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterPriority("all")}
                className={`px-3 py-1 text-xs rounded-full ${
                  filterPriority === "all"
                    ? "bg-[#006D77] text-white"
                    : "bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterPriority("high")}
                className={`px-3 py-1 text-xs rounded-full ${
                  filterPriority === "high"
                    ? "bg-[#2D6A4F] text-white"
                    : "bg-red-50 text-red-800"
                }`}
              >
                High Priority
              </button>
              <button
                onClick={() => setFilterPriority("medium")}
                className={`px-3 py-1 text-xs rounded-full ${
                  filterPriority === "medium"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-800"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setFilterPriority("low")}
                className={`px-3 py-1 text-xs rounded-full ${
                  filterPriority === "low"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Low
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#006D77] mr-2" />
            <span className="text-gray-600">Loading patients...</span>
          </div>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <div key={patient.id}>
              <div
                onClick={() => handlePatientSelect(patient)}
                className={`flex items-center p-2 hover:bg-[#F0F9FA] rounded-md transition-colors cursor-pointer
                  ${
                    selectedPatient?.id === patient.id
                      ? "bg-[#F0F9FA] border border-[#006D77]/20"
                      : ""
                  }
                `}
              >
                <div className="w-10 h-10 rounded-full bg-[#E8F3F4] flex items-center justify-center mr-3 text-[#006D77] font-medium">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-gray-800">{patient.name}</p>
                  <p className="text-sm text-gray-500">{patient.summary}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                    patient.priority
                  )}`}
                >
                  {patient.status}
                </span>
              </div>

              {/* Expanded patient details */}
              {selectedPatient?.id === patient.id && (
                <div className="mt-2 ml-12 p-3 bg-gray-50 rounded-md text-sm">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-gray-500">Age:</span>{" "}
                      {patient.age || "N/A"}, {patient.gender}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400 mr-1" />
                      <span className="text-gray-500">Last Visit:</span>{" "}
                      {formatDate(patient.lastVisit)}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-1" />
                      <span className="text-gray-500">
                        Next Appointment:
                      </span>{" "}
                      {formatDate(patient.nextAppointment)}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Link
                      href={`/Doctor/Patients/${patient.id}`}
                      className="text-xs text-[#006D77] hover:underline flex items-center"
                    >
                      View Full Profile <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No patients found</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterPriority("all");
              }}
              className="mt-2 text-sm text-[#006D77] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientOverviewWidget;
