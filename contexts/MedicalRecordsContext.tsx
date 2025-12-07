"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import PatientMedicalRecordsService, {
  MedicalRecord as ApiMedicalRecord,
} from "@/lib/services/PatientMedicalRecordsService";
import PatientPrescriptionService from "@/lib/services/PatientPrescriptionService";

// Define types for medical records
export interface MedicalRecord {
  id: string | number;
  title: string;
  date: Date;
  type: string;
  provider: string;
  content: string;
  attachments?: string[];
  status: "active" | "archived";
  sharedWith?: string[];
  expiresAt?: Date;
}

export interface Medication {
  id: string | number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  instructions: string;
  status: "active" | "completed" | "discontinued";
  refillsRemaining?: number;
}

interface MedicalRecordsContextType {
  records: MedicalRecord[];
  medications: Medication[];
  addRecord: (record: MedicalRecord) => void;
  updateRecord: (
    id: string | number,
    updatedData: Partial<MedicalRecord>
  ) => void;
  deleteRecord: (id: string | number) => Promise<void>;
  addMedication: (medication: Medication) => void;
  updateMedication: (
    id: string | number,
    updatedData: Partial<Medication>
  ) => void;
  deleteMedication: (id: string | number) => void;
  generateRecordsQR: (duration: string) => Promise<string>;
  navigateToRecordDetails: (id: string | number) => void;
  loadingRecords: boolean;
  refreshRecords: () => Promise<void>;
}

// Create the context
const MedicalRecordsContext = createContext<
  MedicalRecordsContextType | undefined
>(undefined);

// Create a provider component
export const MedicalRecordsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const router = useRouter();

  // Fetch medical records and medications on component mount
  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        // Get patient ID from session/auth
        const patientId = sessionStorage.getItem("patientId") || localStorage.getItem("patientId");
        
        if (patientId) {
          // Fetch from API
          const [recordsResult, medicationsResult] = await Promise.all([
            PatientMedicalRecordsService.getMedicalRecords(patientId, { limit: 100 }).catch(() => null),
            PatientPrescriptionService.getMedications(patientId).catch(() => null),
          ]);

          // Transform API records to context format
          if (recordsResult?.records) {
            const transformedRecords: MedicalRecord[] = recordsResult.records.map((record: ApiMedicalRecord) => ({
              id: record.id,
              title: record.title,
              date: new Date(record.record_date),
              type: record.record_type,
              provider: record.provider_name,
              content: record.content || record.description || '',
              attachments: record.file_url ? [record.file_url] : [],
              status: record.status,
              sharedWith: record.shared_with?.map(s => s.shared_with_name) || [],
            }));
            setRecords(transformedRecords);
            localStorage.setItem("medicalRecords", JSON.stringify(transformedRecords));
          }

          // Transform medications
          if (medicationsResult) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const medicationsList: any[] = Array.isArray(medicationsResult) 
              ? medicationsResult 
              : (medicationsResult?.medications || []);
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const transformedMedications: Medication[] = medicationsList.map((med: any) => ({
              id: med.id,
              name: med.medication_name || med.name,
              dosage: med.dosage,
              frequency: med.frequency,
              startDate: new Date(med.start_date || med.created_at),
              endDate: med.end_date ? new Date(med.end_date) : undefined,
              prescribedBy: med.prescribed_by || med.doctor_name || '',
              instructions: med.instructions || '',
              status: med.status || 'active',
              refillsRemaining: med.refills_remaining,
            }));
            setMedications(transformedMedications);
            localStorage.setItem("medications", JSON.stringify(transformedMedications));
          }
        } else {
          // Fallback to localStorage
          const storedRecords = localStorage.getItem("medicalRecords");
          const storedMedications = localStorage.getItem("medications");

          if (storedRecords) {
            const parsedRecords = JSON.parse(storedRecords, (key, value) => {
              if (key === "date" || key === "expiresAt") {
                return new Date(value);
              }
              return value;
            });
            setRecords(parsedRecords);
          }

          if (storedMedications) {
            const parsedMedications = JSON.parse(
              storedMedications,
              (key, value) => {
                if (key === "startDate" || key === "endDate") {
                  return new Date(value);
                }
                return value;
              }
            );
            setMedications(parsedMedications);
          }
        }
      } catch (error) {
        console.error("Failed to fetch medical data from API:", error);
        // Fallback to localStorage
        const storedRecords = localStorage.getItem("medicalRecords");
        const storedMedications = localStorage.getItem("medications");

        if (storedRecords) {
          const parsedRecords = JSON.parse(storedRecords, (key, value) => {
            if (key === "date" || key === "expiresAt") {
              return new Date(value);
            }
            return value;
          });
          setRecords(parsedRecords);
        }

        if (storedMedications) {
          const parsedMedications = JSON.parse(
            storedMedications,
            (key, value) => {
              if (key === "startDate" || key === "endDate") {
                return new Date(value);
              }
              return value;
            }
          );
          setMedications(parsedMedications);
        }
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchMedicalData();

    // Setup event listeners for real-time updates
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "medical_records_updated",
      handleMedicalRecordsEvent as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "medical_records_updated",
        handleMedicalRecordsEvent as EventListener
      );
    };
  }, []);

  // Handle storage change for cross-tab synchronization
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "medicalRecords" && event.newValue) {
      const updatedRecords = JSON.parse(event.newValue, (key, value) => {
        if (key === "date" || key === "expiresAt") {
          return new Date(value);
        }
        return value;
      });
      setRecords(updatedRecords);
    }

    if (event.key === "medications" && event.newValue) {
      const updatedMedications = JSON.parse(event.newValue, (key, value) => {
        if (key === "startDate" || key === "endDate") {
          return new Date(value);
        }
        return value;
      });
      setMedications(updatedMedications);
    }
  };

  // Handle custom medical records events
  const handleMedicalRecordsEvent = (event: CustomEvent) => {
    if (event.detail) {
      if (event.detail.records) {
        setRecords(event.detail.records);
      }
      if (event.detail.medications) {
        setMedications(event.detail.medications);
      }
    }
  };

  // Persist data to localStorage
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem("medicalRecords", JSON.stringify(records));

      // Dispatch a custom event
      const event = new CustomEvent("medical_records_updated", {
        detail: { records },
      });
      window.dispatchEvent(event);
    }
  }, [records]);

  useEffect(() => {
    if (medications.length > 0) {
      localStorage.setItem("medications", JSON.stringify(medications));

      // Dispatch a custom event
      const event = new CustomEvent("medical_records_updated", {
        detail: { medications },
      });
      window.dispatchEvent(event);
    }
  }, [medications]);

  // Records CRUD operations
  const addRecord = (record: MedicalRecord) => {
    const newRecord = {
      ...record,
      id: typeof record.id !== "undefined" ? record.id : Date.now().toString(),
    };
    setRecords((prev) => [...prev, newRecord]);
  };

  const updateRecord = (
    id: string | number,
    updatedData: Partial<MedicalRecord>
  ) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, ...updatedData } : record
      )
    );
  };

  const deleteRecord = useCallback(async (id: string | number) => {
    try {
      // Call API to archive the record
      await PatientMedicalRecordsService.archiveMedicalRecord(String(id));
      setRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Failed to delete record via API:", error);
      // Still update local state for offline support
      setRecords((prev) => prev.filter((record) => record.id !== id));
    }
  }, []);

  // Medications CRUD operations
  const addMedication = (medication: Medication) => {
    const newMedication = {
      ...medication,
      id:
        typeof medication.id !== "undefined"
          ? medication.id
          : Date.now().toString(),
    };
    setMedications((prev) => [...prev, newMedication]);
  };

  const updateMedication = (
    id: string | number,
    updatedData: Partial<Medication>
  ) => {
    setMedications((prev) =>
      prev.map((medication) =>
        medication.id === id ? { ...medication, ...updatedData } : medication
      )
    );
  };

  const deleteMedication = (id: string | number) => {
    setMedications((prev) => prev.filter((medication) => medication.id !== id));
  };

  // QR code generation for medical records sharing
  const generateRecordsQR = useCallback(async (duration: string): Promise<string> => {
    const patientId = sessionStorage.getItem("patientId") || localStorage.getItem("patientId");
    
    if (!patientId) {
      // Fallback for offline/demo mode
      const expiration = new Date();
      switch (duration) {
        case "24hr":
          expiration.setHours(expiration.getHours() + 24);
          break;
        case "7days":
          expiration.setDate(expiration.getDate() + 7);
          break;
        case "30days":
          expiration.setDate(expiration.getDate() + 30);
          break;
        default:
          expiration.setHours(expiration.getHours() + 24);
      }
      return `medical-records-access-token-expires-${expiration.toISOString()}`;
    }

    try {
      // Convert duration string to hours
      let durationHours = 24;
      switch (duration) {
        case "24hr":
          durationHours = 24;
          break;
        case "7days":
          durationHours = 7 * 24;
          break;
        case "30days":
          durationHours = 30 * 24;
          break;
      }

      const result = await PatientMedicalRecordsService.generateShareQR(patientId, {
        share_all: true,
        duration_hours: durationHours,
        access_type: 'view',
      });
      
      return result.share_url || result.qr_code_url || result.access_token;
    } catch (error) {
      console.error("Failed to generate QR code via API:", error);
      // Fallback
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24);
      return `medical-records-access-token-expires-${expiration.toISOString()}`;
    }
  }, []);

  // Refresh records from API
  const refreshRecords = useCallback(async () => {
    setLoadingRecords(true);
    try {
      const patientId = sessionStorage.getItem("patientId") || localStorage.getItem("patientId");
      
      if (patientId) {
        const [recordsResult, medicationsResult] = await Promise.all([
          PatientMedicalRecordsService.getMedicalRecords(patientId, { limit: 100 }).catch(() => null),
          PatientPrescriptionService.getMedications(patientId).catch(() => null),
        ]);

        if (recordsResult?.records) {
          const transformedRecords: MedicalRecord[] = recordsResult.records.map((record: ApiMedicalRecord) => ({
            id: record.id,
            title: record.title,
            date: new Date(record.record_date),
            type: record.record_type,
            provider: record.provider_name,
            content: record.content || record.description || '',
            attachments: record.file_url ? [record.file_url] : [],
            status: record.status,
            sharedWith: record.shared_with?.map(s => s.shared_with_name) || [],
          }));
          setRecords(transformedRecords);
          localStorage.setItem("medicalRecords", JSON.stringify(transformedRecords));
        }

        if (medicationsResult) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const medicationsList: any[] = Array.isArray(medicationsResult) 
            ? medicationsResult 
            : (medicationsResult?.medications || []);
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const transformedMedications: Medication[] = medicationsList.map((med: any) => ({
            id: med.id,
            name: med.medication_name || med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            startDate: new Date(med.start_date || med.created_at),
            endDate: med.end_date ? new Date(med.end_date) : undefined,
            prescribedBy: med.prescribed_by || med.doctor_name || '',
            instructions: med.instructions || '',
            status: med.status || 'active',
            refillsRemaining: med.refills_remaining,
          }));
          setMedications(transformedMedications);
          localStorage.setItem("medications", JSON.stringify(transformedMedications));
        }
      }
    } catch (error) {
      console.error("Failed to refresh medical records:", error);
    } finally {
      setLoadingRecords(false);
    }
  }, []);

  // Navigation helper
  const navigateToRecordDetails = (id: string | number) => {
    sessionStorage.setItem("selectedRecordId", id.toString());
    router.push(`/patient/medical-records/${id}`);
  };

  // Context value
  const value = {
    records,
    medications,
    addRecord,
    updateRecord,
    deleteRecord,
    addMedication,
    updateMedication,
    deleteMedication,
    generateRecordsQR,
    navigateToRecordDetails,
    loadingRecords,
    refreshRecords,
  };

  return (
    <MedicalRecordsContext.Provider value={value}>
      {children}
    </MedicalRecordsContext.Provider>
  );
};

// Custom hook to use the medical records context
export const useMedicalRecords = () => {
  const context = useContext(MedicalRecordsContext);
  if (context === undefined) {
    // Add more debugging information
    console.error(
      "useMedicalRecords must be used within a MedicalRecordsProvider. Make sure your component is wrapped with MedicalRecordsProvider."
    );
    throw new Error(
      "useMedicalRecords must be used within a MedicalRecordsProvider. Check that MedicalRecordsProvider is properly set up in your component tree."
    );
  }
  return context;
};

// Helper component to check if provider is available
export const MedicalRecordsProviderChecker: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const context = useContext(MedicalRecordsContext);

  if (context === undefined) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium">
          MedicalRecordsProvider Missing
        </h3>
        <p className="text-red-600 text-sm mt-1">
          This component requires MedicalRecordsProvider. Please wrap your app
          or page with MedicalRecordsProvider.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
