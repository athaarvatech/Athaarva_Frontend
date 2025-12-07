"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import PatientAppointmentService, { Appointment as ApiAppointment } from "@/lib/services/PatientAppointmentService";

// Define types for our context - aligned with backend UUID architecture
export interface Appointment {
  // Core fields (UUID-based) - match backend
  id: string; // UUID
  patient_id: string; // UUID
  doctor_id: string; // UUID
  tenant_id: string; // UUID

  // UI-friendly fields
  title?: string;
  date: Date; // Converted from appointment_date string
  time: string; // From appointment_time
  type?: "in-person" | "video" | "phone";
  status:
    | "confirmed"
    | "pending"
    | "completed"
    | "cancelled"
    | "scheduled"
    | "no_show";
  location?: string | null;
  notes?: string;
  reason?: string;
  prescription?: string;

  // Doctor info (populated) - simplified for UI
  doctor?: string; // Doctor name
  doctorPhoto?: string;
  specialty?: string;

  // Patient info (populated) - simplified for UI
  patientName?: string;
  patientPhoto?: string;
  patientAge?: number;
  patientGender?: string;

  // Scheduling
  startTime?: Date;
  endTime?: Date;
  duration?: number; // In minutes (duration_minutes from backend)

  // Additional
  purpose?: string;
  preparationStatus?: string;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (
    id: string, // UUID only
    updatedData: Partial<Appointment>
  ) => void;
  cancelAppointment: (id: string, reason?: string) => Promise<void>; // UUID only
  deleteAppointment: (id: string) => void; // UUID only
  rescheduleAppointment: (id: string, newDate: string, newTime: string, reason?: string) => Promise<void>; // UUID only
  getAppointmentById: (id: string) => Appointment | undefined; // UUID only
  navigateToAppointmentDetails: (id: string) => void; // UUID only
  navigateToBooking: () => void;
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  loadingAppointments: boolean;
  refreshAppointments: () => Promise<void>;
}

// Create the context
const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

// Create a provider component
export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const router = useRouter();

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Get patient ID from session/auth - using placeholder for now
        // In production, this would come from AuthContext
        const patientId = sessionStorage.getItem("patientId") || localStorage.getItem("patientId");
        
        if (patientId) {
          // Fetch from API
          const [upcomingResult, pastResult] = await Promise.all([
            PatientAppointmentService.getUpcomingAppointments(patientId, 20).catch(() => null),
            PatientAppointmentService.getPastAppointments(patientId, { limit: 50 }).catch(() => null),
          ]);

          // Handle the different return types - using explicit any to handle API response shape
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const upcomingList: any[] = upcomingResult ? (Array.isArray(upcomingResult) ? upcomingResult : []) : [];
          const pastList: any[] = pastResult ? (Array.isArray(pastResult) ? pastResult : (pastResult?.appointments || [])) : [];
          /* eslint-enable @typescript-eslint/no-explicit-any */

          // Transform API response to Appointment format used by context
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const transformAppointment = (apt: any): Appointment => ({
            id: apt.id,
            patient_id: apt.patient_id,
            doctor_id: apt.doctor_id,
            tenant_id: apt.hospital_id,
            title: apt.reason || 'Appointment',
            date: new Date(apt.appointment_date),
            time: apt.start_time || '',
            type: apt.appointment_type === 'telemedicine' ? 'video' : 'in-person',
            status: apt.status as Appointment['status'],
            location: apt.hospital?.address || null,
            notes: apt.notes || '',
            reason: apt.reason || '',
            doctor: apt.doctor?.name || '',
            doctorPhoto: apt.doctor?.profile_image || '',
            specialty: apt.doctor?.specialty || '',
            duration: 30, // Default duration
            created_at: apt.created_at,
            updated_at: apt.updated_at,
          });

          const allAppointments = [
            ...upcomingList.map(transformAppointment),
            ...pastList.map(transformAppointment),
          ];

          setAppointments(allAppointments);

          // Also store in localStorage for offline access
          localStorage.setItem("appointments", JSON.stringify(allAppointments));
        } else {
          // No patient ID - fallback to localStorage
          const storedAppointments = localStorage.getItem("appointments");
          if (storedAppointments) {
            const parsedAppointments = JSON.parse(
              storedAppointments,
              (key, value) => {
                if (key === "date" || key === "startTime" || key === "endTime") {
                  return new Date(value);
                }
                return value;
              }
            );
            setAppointments(parsedAppointments);
          }
        }
      } catch (error) {
        console.error("Failed to fetch appointments from API:", error);
        // Fallback to localStorage if API fails
        const storedAppointments = localStorage.getItem("appointments");
        if (storedAppointments) {
          const parsedAppointments = JSON.parse(
            storedAppointments,
            (key, value) => {
              if (key === "date" || key === "startTime" || key === "endTime") {
                return new Date(value);
              }
              return value;
            }
          );
          setAppointments(parsedAppointments);
        }
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();

    // Setup event listeners for real-time updates
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "appointment_updated",
      handleAppointmentEvent as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "appointment_updated",
        handleAppointmentEvent as EventListener
      );
    };
  }, []);

  // Handle storage change for cross-tab synchronization
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "appointments" && event.newValue) {
      const updatedAppointments = JSON.parse(event.newValue, (key, value) => {
        if (key === "date" || key === "startTime" || key === "endTime") {
          return new Date(value);
        }
        return value;
      });
      setAppointments(updatedAppointments);
    }
  };

  // Handle custom appointment events
  const handleAppointmentEvent = (event: CustomEvent) => {
    if (event.detail && event.detail.appointments) {
      setAppointments(event.detail.appointments);
    }
  };

  // Persist appointments to localStorage
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem("appointments", JSON.stringify(appointments));

      // Dispatch a custom event to notify other components
      const event = new CustomEvent("appointment_updated", {
        detail: { appointments },
      });
      window.dispatchEvent(event);
    }
  }, [appointments]);

  // Filter appointments into upcoming and past
  const upcomingAppointments = appointments.filter(
    (app) => new Date(app.date) >= new Date() || app.status === "pending"
  );

  const pastAppointments = appointments.filter(
    (app) => new Date(app.date) < new Date() && app.status !== "pending"
  );

  // Add a new appointment
  const addAppointment = (appointment: Appointment) => {
    const newAppointment = {
      ...appointment,
      id: appointment.id || crypto.randomUUID(), // Generate UUID if not provided
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  // Update an existing appointment
  const updateAppointment = (
    id: string, // UUID only
    updatedData: Partial<Appointment>
  ) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updatedData } : app))
    );
  };

  // Cancel an appointment
  const cancelAppointment = useCallback(async (id: string, reason: string = "Cancelled by patient") => {
    try {
      // Call API to cancel
      await PatientAppointmentService.cancelAppointment(id, { reason });
      // Update local state
      updateAppointment(id, { status: "cancelled" });
    } catch (error) {
      console.error("Failed to cancel appointment via API:", error);
      // Still update local state for offline support
      updateAppointment(id, { status: "cancelled" });
    }
  }, []);

  // Reschedule an appointment
  const rescheduleAppointment = useCallback(async (id: string, newDate: string, newTime: string, reason?: string) => {
    try {
      // Call API to reschedule
      const result = await PatientAppointmentService.rescheduleAppointment(id, { 
        new_date: newDate, 
        new_time: newTime, 
        reason 
      });
      // Update local state with new date/time
      updateAppointment(id, { 
        date: new Date(result.appointment_date),
        time: result.start_time,
        status: 'scheduled'
      });
    } catch (error) {
      console.error("Failed to reschedule appointment via API:", error);
      throw error;
    }
  }, []);

  // Refresh appointments from API
  const refreshAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const patientId = sessionStorage.getItem("patientId") || localStorage.getItem("patientId");
      if (patientId) {
        const [upcomingResult, pastResult] = await Promise.all([
          PatientAppointmentService.getUpcomingAppointments(patientId, 20).catch(() => null),
          PatientAppointmentService.getPastAppointments(patientId, { limit: 50 }).catch(() => null),
        ]);

        /* eslint-disable @typescript-eslint/no-explicit-any */
        const upcomingList: any[] = upcomingResult ? (Array.isArray(upcomingResult) ? upcomingResult : []) : [];
        const pastList: any[] = pastResult ? (Array.isArray(pastResult) ? pastResult : (pastResult?.appointments || [])) : [];
        /* eslint-enable @typescript-eslint/no-explicit-any */

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformAppointment = (apt: any): Appointment => ({
          id: apt.id,
          patient_id: apt.patient_id,
          doctor_id: apt.doctor_id,
          tenant_id: apt.hospital_id,
          title: apt.reason || 'Appointment',
          date: new Date(apt.appointment_date),
          time: apt.start_time || '',
          type: apt.appointment_type === 'telemedicine' ? 'video' : 'in-person',
          status: apt.status as Appointment['status'],
          location: apt.hospital?.address || null,
          notes: apt.notes || '',
          reason: apt.reason || '',
          doctor: apt.doctor?.name || '',
          doctorPhoto: apt.doctor?.profile_image || '',
          specialty: apt.doctor?.specialty || '',
          duration: 30,
          created_at: apt.created_at,
          updated_at: apt.updated_at,
        });

        const allAppointments = [
          ...upcomingList.map(transformAppointment),
          ...pastList.map(transformAppointment),
        ];

        setAppointments(allAppointments);
        localStorage.setItem("appointments", JSON.stringify(allAppointments));
      }
    } catch (error) {
      console.error("Failed to refresh appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  // Delete an appointment
  const deleteAppointment = (id: string) => {
    // UUID only
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  // Get an appointment by ID
  const getAppointmentById = (id: string) => {
    // UUID only
    return appointments.find((app) => app.id === id);
  };

  // Navigation helpers
  const navigateToAppointmentDetails = (id: string) => {
    // UUID only
    // Store selected appointment ID in sessionStorage for cross-page persistence
    sessionStorage.setItem("selectedAppointmentId", id.toString());
    router.push(`/patient/appointments/details/${id}`);
  };

  const navigateToBooking = () => {
    router.push("/patient/appointments/schedule");
  };

  // Context value
  const value = {
    appointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    rescheduleAppointment,
    getAppointmentById,
    navigateToAppointmentDetails,
    navigateToBooking,
    upcomingAppointments,
    pastAppointments,
    loadingAppointments,
    refreshAppointments,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use the appointment context
export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    // Add more debugging information
    console.error(
      "useAppointments must be used within an AppointmentProvider. Make sure your component is wrapped with AppointmentProvider."
    );
    throw new Error(
      "useAppointments must be used within an AppointmentProvider. Check that AppointmentProvider is properly set up in your component tree."
    );
  }
  return context;
};

// Helper component to check if provider is available
export const AppointmentProviderChecker: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const context = useContext(AppointmentContext);

  if (context === undefined) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium">
          AppointmentProvider Missing
        </h3>
        <p className="text-red-600 text-sm mt-1">
          This component requires AppointmentProvider. Please wrap your app or
          page with AppointmentProvider.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
