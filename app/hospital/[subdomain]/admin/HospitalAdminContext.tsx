"use client";

import { createContext, useContext } from "react";

interface HospitalProfile {
  id: string;
  hospital_name: string;
  subdomain: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  status: "pending" | "active" | "suspended";
}

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

export interface HospitalAdminContextType {
  hospital: HospitalProfile | null;
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  refreshHospital: () => Promise<void>;
}

export const HospitalAdminContext = createContext<
  HospitalAdminContextType | undefined
>(undefined);

export const useHospitalAdmin = () => {
  const context = useContext(HospitalAdminContext);
  if (!context) {
    throw new Error("useHospitalAdmin must be used within HospitalAdminLayout");
  }
  return context;
};
