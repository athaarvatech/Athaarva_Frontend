"use client";

import React, { ReactNode, useEffect } from "react";
import { NotificationProvider } from "./NotificationsContext";
import { AuthProvider } from "./AuthContext";
import { AppointmentProvider } from "./AppointmentContext";
import { MedicalRecordsProvider } from "./MedicalRecordsContext";
import { migrateLocalStorage } from "@/lib/utils";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  // Run localStorage migration once on app initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      migrateLocalStorage();
      console.log(
        "✅ localStorage migration complete - old numeric IDs removed, field names updated"
      );
    }
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <AppointmentProvider>
          <MedicalRecordsProvider>{children}</MedicalRecordsProvider>
        </AppointmentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default AppProviders;
