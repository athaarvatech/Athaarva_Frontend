"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

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
  cancelAppointment: (id: string) => void; // UUID only
  deleteAppointment: (id: string) => void; // UUID only
  getAppointmentById: (id: string) => Appointment | undefined; // UUID only
  navigateToAppointmentDetails: (id: string) => void; // UUID only
  navigateToBooking: () => void;
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  loadingAppointments: boolean;
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
        // In a real app, this would be an API call
        // For now, we'll use mock data or localStorage
        const storedAppointments = localStorage.getItem("appointments");
        if (storedAppointments) {
          // Parse dates from string to Date objects
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
        } else {
          // Use mock data initially
          // This would be your API call in a real application
          const mockAppointments: Appointment[] = [];
          setAppointments(mockAppointments);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
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
  const cancelAppointment = (id: string) => {
    // UUID only
    updateAppointment(id, { status: "cancelled" });
  };

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
    getAppointmentById,
    navigateToAppointmentDetails,
    navigateToBooking,
    upcomingAppointments,
    pastAppointments,
    loadingAppointments,
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
