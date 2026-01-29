"use client";

import { useEffect, useState, ReactNode } from "react";
import { HospitalService, HospitalProfile } from "@/lib/hospital-service";
import type { TemplateBlueprint } from "@/app/onboarding/hospital/widgets/templateBlueprints";
import { Loader2, Building2 } from "lucide-react";
import { HospitalContext } from "./HospitalContext";

// Get subdomain from cookie or header (set by middleware)
function getSubdomainFromClient(): string | null {
  if (typeof window === "undefined") return null;
  
  // Try to get from cookie first
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "hospital_code") {
      return value;
    }
  }
  
  // Fallback: extract from hostname
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  
  // Handle localhost subdomains: t.localhost, demo.localhost
  if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
    return parts[0];
  }
  
  // Handle athaarva.com subdomains: hospital.athaarva.com
  if (parts.length === 3 && parts[1] === "athaarva" && parts[2] === "com") {
    return parts[0];
  }
  
  return null;
}

// Create a dev fallback hospital profile from localStorage or defaults
function getDevFallbackHospital(subdomain: string): HospitalProfile {
  // Try to get hospital info from localStorage (stored during onboarding)
  const pendingName = typeof window !== "undefined" 
    ? localStorage.getItem("pending_hospital_name") 
    : null;
  const storedSubdomain = typeof window !== "undefined"
    ? localStorage.getItem("hospital_subdomain")
    : null;

  // Try to get selected template + branding from localStorage.
  // This lets the subdomain render the chosen template even if the backend isn't running.
  let storedTemplateId: string | undefined;
  let storedTemplateContent: TemplateBlueprint | undefined;
  let storedPrimaryColor: string | undefined;
  let storedSecondaryColor: string | undefined;
  let storedLogoUrl: string | undefined;

  if (typeof window !== "undefined") {
    try {
      const pendingTemplateRaw = localStorage.getItem("pending_hospital_template");
      const pendingBrandingRaw = localStorage.getItem("pending_hospital_branding");
      const pendingSubdomain =
        localStorage.getItem("pending_hospital_subdomain") ||
        localStorage.getItem("hospital_subdomain");

      if (pendingSubdomain === subdomain && pendingTemplateRaw) {
        const parsed = JSON.parse(pendingTemplateRaw) as {
          id?: string;
          customizedBlueprint?: TemplateBlueprint;
        };
        storedTemplateId = parsed?.id;
        storedTemplateContent = parsed?.customizedBlueprint;
      }

      if (pendingSubdomain === subdomain && pendingBrandingRaw) {
        const parsed = JSON.parse(pendingBrandingRaw) as {
          colors?: { primary?: string; secondary?: string };
          logo_url?: string;
        };
        storedPrimaryColor = parsed?.colors?.primary;
        storedSecondaryColor = parsed?.colors?.secondary;
        storedLogoUrl = parsed?.logo_url;
      }
    } catch {
      // Ignore storage parse errors in dev fallback.
    }
  }
  
  // Use stored info if subdomain matches
  const hospitalName = (storedSubdomain === subdomain && pendingName) 
    ? pendingName 
    : subdomain.charAt(0).toUpperCase() + subdomain.slice(1) + " Hospital";

  return {
    id: "dev-" + subdomain,
    hospital_name: hospitalName,
    license_number: "DEV-LICENSE-001",
    bed_capacity: 100,
    primary_contact: "Admin",
    official_email: `admin@${subdomain}.athaarva.com`,
    phone: "+91 98765 43210",
    address: "123 Healthcare Avenue",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    primary_color: storedPrimaryColor || "#007C7C",
    secondary_color: storedSecondaryColor || "#20B2AA",
    subdomain: subdomain,
    // Provide branding payload so (hospital)/page.tsx can render the chosen template in dev fallback.
    branding: {
      primary_color: storedPrimaryColor,
      secondary_color: storedSecondaryColor,
      logo_url: storedLogoUrl,
      template_id: storedTemplateId,
      template_content: storedTemplateContent,
    },
    admin_full_name: "Hospital Admin",
    admin_work_email: `admin@${subdomain}.athaarva.com`,
    admin_phone: "+91 98765 43210",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export default function HospitalLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    const fetchHospital = async () => {
      const code = getSubdomainFromClient();
      setSubdomain(code);
      
      if (!code) {
        // No subdomain means this is main domain - redirect to main site
        setLoading(false);
        return;
      }

      try {
        const hospitalData = await HospitalService.getHospitalBySubdomain(code);
        
        if (!hospitalData) {
          // In development, use fallback data instead of showing error
          const isDev = window.location.hostname.includes("localhost");
          if (isDev) {
            console.warn(`[HospitalLayout] Using dev fallback for subdomain: ${code}`);
            setHospital(getDevFallbackHospital(code));
            setIsDevMode(true);
          } else {
            setError("Hospital not found");
          }
        } else {
          setHospital(hospitalData);
        }
      } catch (err) {
        console.error("Error fetching hospital:", err);
        // In development, use fallback data instead of showing error
        const isDev = window.location.hostname.includes("localhost");
        if (isDev) {
          console.warn(`[HospitalLayout] Backend unavailable, using dev fallback for: ${code}`);
          setHospital(getDevFallbackHospital(code));
          setIsDevMode(true);
        } else {
          setError("Failed to load hospital information");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, []);

  const theme = {
    primaryColor: hospital?.primary_color || "#007C7C",
    secondaryColor: hospital?.secondary_color || "#20B2AA",
    accentColor: "#0ea5e9", // Default accent color
  };

  // If no subdomain detected, this layout shouldn't render
  // The middleware handles redirection for main domain
  if (!loading && !subdomain) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-healthcare-primary/10 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-healthcare-primary animate-spin" />
          </div>
          <p className="text-gray-600">Loading hospital portal...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hospital Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "The hospital you're looking for doesn't exist or has been removed."}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Subdomain: <code className="bg-gray-100 px-2 py-1 rounded">{subdomain}</code>
          </p>
          <button
            onClick={() => window.location.href = "https://athaarva.com"}
            className="bg-healthcare-primary text-white px-6 py-2 rounded-lg hover:bg-healthcare-primary/90 transition-colors"
          >
            Visit Athaarva
          </button>
        </div>
      </div>
    );
  }

  return (
    <HospitalContext.Provider value={{ hospital, subdomain, loading, error, theme }}>
      <div 
        style={{
          "--hospital-primary": theme.primaryColor,
          "--hospital-secondary": theme.secondaryColor,
          "--hospital-accent": theme.accentColor,
        } as React.CSSProperties}
      >
        {/* Dev mode banner */}
        {isDevMode && (
          <div className="bg-yellow-500 text-yellow-900 text-center text-sm py-1 px-4">
            🚧 Development Mode - Using mock hospital data (backend unavailable)
          </div>
        )}
        {children}
      </div>
    </HospitalContext.Provider>
  );
}
