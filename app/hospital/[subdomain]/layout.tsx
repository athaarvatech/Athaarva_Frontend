"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HospitalService, HospitalProfile } from "@/lib/hospital-service";
import { HospitalContext } from "./HospitalContext";

export default function HospitalSubdomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHospital() {
      if (!subdomain) {
        setError("Invalid subdomain");
        setLoading(false);
        return;
      }

      try {
        const hospitalData = await HospitalService.getHospitalBySubdomain(
          subdomain
        );

        if (!hospitalData) {
          setError("Hospital not found");
        } else {
          setHospital(hospitalData);
        }
      } catch (err) {
        console.error("Error fetching hospital:", err);
        setError("Failed to load hospital information");
      } finally {
        setLoading(false);
      }
    }

    fetchHospital();
  }, [subdomain]);

  const theme = {
    primaryColor: hospital?.primary_color || "#007C7C",
    secondaryColor: hospital?.secondary_color || "#20B2AA",
  };

  return (
    <HospitalContext.Provider value={{ hospital, loading, error, theme }}>
      {children}
    </HospitalContext.Provider>
  );
}
