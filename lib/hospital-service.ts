/**
 * Service for handling hospital landing page data
 */

// Import TemplateBlueprint type for proper typing
import type { TemplateBlueprint } from "@/app/onboarding/hospital/widgets/templateBlueprints";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface LoginPageConfig {
  logo_url?: string;
  background_type?: 'image' | 'gradient' | 'solid';
  background_image?: string;
  background_gradient?: string;
  background_color?: string;
  primary_color?: string;
  secondary_color?: string;
  welcome_text?: string;
  tagline?: string;
}

export interface HospitalBranding {
  logo_url?: string;
  background_image?: string;
  primary_color?: string;
  secondary_color?: string;
  // New template fields - persisted to database
  template_id?: string;
  template_content?: TemplateBlueprint;
  login_page_config?: LoginPageConfig;
  copy?: {
    welcome_title?: string;
    welcome_subtitle?: string;
    login_title?: string;
    signup_title?: string;
  };
}

export interface HospitalProfile {
  id?: string; // UUID from tenant_mgmt.tenants
  hospital_id?: string; // Legacy field alias
  hospital_name: string;
  hospital_code?: string;
  license_number?: string;
  bed_capacity?: number;
  primary_contact?: string;
  official_email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  logo_url?: string;
  background_image_url?: string;
  primary_color?: string;
  secondary_color?: string;
  subdomain: string;
  status?: string;
  is_verified?: boolean;
  branding?: HospitalBranding;
  custom_branding?: HospitalBranding;
  admin_full_name?: string;
  admin_work_email?: string;
  admin_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export class HospitalService {
  /**
   * Get hospital profile by subdomain
   */
  static async getHospitalBySubdomain(
    subdomain: string
  ): Promise<HospitalProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/${subdomain}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch hospital profile");
      }

      const data = await response.json();
      
      // Normalize the response to handle both old and new schema
      const branding = data.branding || data.custom_branding || {};

      const normalizeAddress = (address: unknown): string | undefined => {
        if (!address) return undefined;
        if (typeof address === "string") return address;
        if (typeof address === "object") {
          const a = address as Record<string, unknown>;
          const parts = [
            a.line1,
            a.line2,
            a.area,
            a.landmark,
            a.city,
            a.state,
            a.pincode,
            a.raw,
          ]
            .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
            .map((v) => v.trim());
          return parts.length ? parts.join(", ") : undefined;
        }
        return undefined;
      };

      const normalizedSubdomain = (data.subdomain || data.code || data.hospital_code || subdomain) as string;
      const normalizedHospitalName =
        (data.hospital_name || data.display_name || data.legal_name || "") as string;
      
      return {
        ...data,
        id: data.id || data.tenant_id,
        hospital_id: data.hospital_id || data.tenant_id || data.id,
        hospital_name: normalizedHospitalName,
        hospital_code: data.hospital_code || data.code || normalizedSubdomain,
        subdomain: normalizedSubdomain,
        address: normalizeAddress(data.address),
        primary_color: branding.primary_color || data.primary_color || "#007C7C",
        secondary_color: branding.secondary_color || data.secondary_color || "#20B2AA",
        logo_url: branding.logo_url || data.logo_url,
        background_image_url: branding.background_image || data.background_image_url,
        branding: branding,
      };
    } catch (error) {
      console.error("Error fetching hospital profile:", error);
      return null;
    }
  }

  /**
   * Generate hospital landing page theme
   */
  static generateHospitalTheme(hospital: HospitalProfile) {
    const branding = hospital.branding || hospital.custom_branding || {};
    
    return {
      primaryColor: branding.primary_color || hospital.primary_color || "#007C7C",
      secondaryColor: branding.secondary_color || hospital.secondary_color || "#20B2AA",
      logoUrl: branding.logo_url || hospital.logo_url,
      backgroundImageUrl: branding.background_image || hospital.background_image_url,
      hospitalName: hospital.hospital_name,
      hospitalDetails: {
        address: [hospital.address, hospital.city, hospital.state, hospital.pincode]
          .filter(Boolean)
          .join(", "),
        phone: hospital.phone,
        email: hospital.official_email,
        bedCapacity: hospital.bed_capacity,
        licenseNumber: hospital.license_number,
      },
      adminContact: {
        name: hospital.admin_full_name || hospital.primary_contact,
        email: hospital.admin_work_email || hospital.official_email,
        phone: hospital.admin_phone || hospital.phone,
      },
      copy: branding.copy || {},
    };
  }
}
