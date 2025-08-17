/**
 * Service for handling hospital landing page data
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface HospitalProfile {
  id: number;
  hospital_name: string;
  license_number: string;
  bed_capacity: number;
  primary_contact: string;
  official_email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  logo_url?: string;
  background_image_url?: string;
  primary_color: string;
  secondary_color: string;
  subdomain: string;
  admin_full_name: string;
  admin_work_email: string;
  admin_phone: string;
  created_at: string;
  updated_at: string;
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
      return data;
    } catch (error) {
      console.error("Error fetching hospital profile:", error);
      return null;
    }
  }

  /**
   * Generate hospital landing page theme
   */
  static generateHospitalTheme(hospital: HospitalProfile) {
    return {
      primaryColor: hospital.primary_color || "#007C7C",
      secondaryColor: hospital.secondary_color || "#20B2AA",
      logoUrl: hospital.logo_url,
      backgroundImageUrl: hospital.background_image_url,
      hospitalName: hospital.hospital_name,
      hospitalDetails: {
        address: `${hospital.address}, ${hospital.city}, ${hospital.state} ${hospital.pincode}`,
        phone: hospital.phone,
        email: hospital.official_email,
        bedCapacity: hospital.bed_capacity,
        licenseNumber: hospital.license_number,
      },
      adminContact: {
        name: hospital.admin_full_name,
        email: hospital.admin_work_email,
        phone: hospital.admin_phone,
      },
    };
  }
}
