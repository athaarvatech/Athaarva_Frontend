"use client";

import React, { ReactNode } from "react";
import { NotificationProvider } from "./NotificationsContext";
import { AuthProvider } from "./AuthContext";
import { AppointmentProvider } from "./AppointmentContext";
import { MedicalRecordsProvider } from "./MedicalRecordsContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
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
