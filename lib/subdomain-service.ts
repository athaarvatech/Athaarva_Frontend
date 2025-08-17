/**
 * Service for handling subdomain validation and management
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface SubdomainValidationResponse {
  available: boolean;
  message: string;
}

export class SubdomainService {
  /**
   * Check if a subdomain is available
   */
  static async checkSubdomainAvailability(
    subdomain: string
  ): Promise<SubdomainValidationResponse> {
    try {
      // Clean the subdomain
      const cleanSubdomain = subdomain
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (!cleanSubdomain) {
        return {
          available: false,
          message: "Subdomain cannot be empty",
        };
      }

      if (cleanSubdomain.length < 3) {
        return {
          available: false,
          message: "Subdomain must be at least 3 characters long",
        };
      }

      if (cleanSubdomain.length > 30) {
        return {
          available: false,
          message: "Subdomain must be less than 30 characters",
        };
      }

      // Check reserved subdomains
      const reservedSubdomains = [
        "www",
        "api",
        "admin",
        "app",
        "apps",
        "mail",
        "email",
        "ftp",
        "ssh",
        "test",
        "staging",
        "dev",
        "development",
        "prod",
        "production",
        "demo",
        "blog",
        "help",
        "support",
        "docs",
        "status",
        "portal",
      ];

      if (reservedSubdomains.includes(cleanSubdomain)) {
        return {
          available: false,
          message: "This subdomain is reserved and cannot be used",
        };
      }

      // Check with backend API
      const response = await fetch(
        `${API_BASE_URL}/hospitals/${cleanSubdomain}`,
        {
          method: "GET",
        }
      );

      if (response.status === 404) {
        // Hospital not found, subdomain is available
        return {
          available: true,
          message: "Subdomain is available",
        };
      } else if (response.status === 200) {
        // Hospital found, subdomain is taken
        return {
          available: false,
          message: "This subdomain is already taken",
        };
      } else {
        // Other error
        return {
          available: false,
          message: "Unable to check subdomain availability",
        };
      }
    } catch (error) {
      console.error("Error checking subdomain availability:", error);
      return {
        available: false,
        message: "Unable to check subdomain availability",
      };
    }
  }

  /**
   * Generate subdomain suggestions based on hospital name
   */
  static generateSubdomainSuggestions(hospitalName: string): string[] {
    const base = hospitalName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 20);

    const suggestions = [
      base,
      `${base}hospital`,
      `${base}health`,
      `${base}care`,
      `${base}med`,
      `${base}clinic`,
    ];

    // Add numbered variations
    for (let i = 1; i <= 5; i++) {
      suggestions.push(`${base}${i}`);
    }

    return suggestions.filter((s) => s.length >= 3);
  }

  /**
   * Format subdomain for display
   */
  static formatSubdomain(subdomain: string): string {
    return subdomain
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  /**
   * Get the full subdomain URL
   */
  static getSubdomainUrl(subdomain: string): string {
    return `https://${subdomain}.athaarva.com`;
  }
}
