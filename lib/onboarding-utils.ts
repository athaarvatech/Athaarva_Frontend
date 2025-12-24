import { API_CONFIG } from "./api-config";

// ============================================================================
// COLOR & ACCESSIBILITY UTILITIES
// ============================================================================

/**
 * Calculate relative luminance of a color (WCAG formula)
 */
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const srgb = val / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color contrast meets WCAG AA standards (4.5:1 for normal text)
 */
export function meetsWCAGAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

/**
 * Check if color contrast meets WCAG AAA standards (7:1 for normal text)
 */
export function meetsWCAGAAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 7;
}

/**
 * Convert hex color to RGB object
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Calculate overall accessibility score based on primary colors
 */
export function calculateAccessibilityScore(
  primaryColor: string,
  secondaryColor: string,
  accentColor: string
): number {
  const white = "#FFFFFF";
  const black = "#000000";

  // Check contrast ratios
  const primaryOnWhite = getContrastRatio(primaryColor, white);
  const secondaryOnWhite = getContrastRatio(secondaryColor, white);
  const accentOnWhite = getContrastRatio(accentColor, white);
  const primaryOnBlack = getContrastRatio(primaryColor, black);

  // Calculate average (higher is better)
  const avgContrast =
    (primaryOnWhite + secondaryOnWhite + accentOnWhite + primaryOnBlack) / 4;

  return Math.round(avgContrast * 10) / 10;
}

// ============================================================================
// FILE UPLOAD UTILITIES
// ============================================================================

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

/**
 * Upload a branding asset (logo, background, favicon)
 */
export async function uploadBrandingAsset(
  file: File,
  type: "logo" | "background" | "favicon",
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("asset_type", type);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          });
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (!response?.url) {
            reject(new Error("Upload response missing image URL"));
            return;
          }

          resolve({
            url: new URL(response.url, API_CONFIG.BASE_URL).toString(),
            filename: file.name,
            size: file.size,
            type: file.type,
          });
        } catch {
          reject(new Error("Failed to parse upload response"));
        }
      } else {
        try {
          const errorPayload = JSON.parse(xhr.responseText);
          reject(new Error(errorPayload?.detail ?? "Failed to upload file"));
        } catch {
          reject(new Error("Failed to upload file"));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during file upload"));
    });

    xhr.open(
      "POST",
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOADS.BRANDING}?asset_type=${type}`
    );
    xhr.send(formData);
  });
}

/**
 * Upload a document (accreditation, consent, etc.)
 */
export async function uploadDocument(
  file: File,
  documentType: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  // For now, use the same branding endpoint
  // In production, this should use a dedicated document upload endpoint
  return uploadBrandingAsset(file, "background", onProgress);
}

/**
 * Validate file size and type
 */
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSizeMB = 5, allowedTypes = [] } = options;

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// ============================================================================
// SUBDOMAIN UTILITIES
// ============================================================================

/**
 * Normalize subdomain (lowercase, alphanumeric + hyphens only)
 */
export function normalizeSubdomain(subdomain: string): string {
  return subdomain
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 63);
}

/**
 * Check if subdomain is available
 */
export async function checkSubdomainAvailability(subdomain: string): Promise<{
  available: boolean;
  message?: string;
}> {
  try {
    // TODO: Implement actual API call when backend is ready
    // For now, simulate with local validation
    const normalized = normalizeSubdomain(subdomain);

    if (normalized.length < 3) {
      return {
        available: false,
        message: "Subdomain must be at least 3 characters",
      };
    }

    if (normalized.length > 63) {
      return {
        available: false,
        message: "Subdomain must be less than 63 characters",
      };
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check against reserved subdomains
    const reserved = ["www", "api", "admin", "app", "mail", "ftp", "localhost"];
    if (reserved.includes(normalized)) {
      return {
        available: false,
        message: "This subdomain is reserved",
      };
    }

    return { available: true };
  } catch {
    return {
      available: false,
      message: "Failed to check subdomain availability",
    };
  }
}

// ============================================================================
// GEOCODING UTILITIES
// ============================================================================

export interface GeoLocation {
  lat: number;
  lng: number;
  formatted_address?: string;
}

/**
 * Geocode an address to get lat/lng coordinates
 */
export async function geocodeAddress(
  address: string
): Promise<GeoLocation | null> {
  try {
    // TODO: Implement actual geocoding API when ready
    // For now, return mock data
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock geocoding based on city name in address
    const mockLocations: { [key: string]: GeoLocation } = {
      mumbai: { lat: 19.076, lng: 72.8777 },
      delhi: { lat: 28.7041, lng: 77.1025 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      bengaluru: { lat: 12.9716, lng: 77.5946 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      hyderabad: { lat: 17.385, lng: 78.4867 },
      pune: { lat: 18.5204, lng: 73.8567 },
      ahmedabad: { lat: 23.0225, lng: 72.5714 },
    };

    const lowerAddress = address.toLowerCase();
    for (const [city, location] of Object.entries(mockLocations)) {
      if (lowerAddress.includes(city)) {
        return { ...location, formatted_address: address };
      }
    }

    // Default fallback
    return { lat: 20.5937, lng: 78.9629, formatted_address: address };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s-()]{10,}$/.test(phone);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidGSTNumber(gst: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
}

export function isValidPANNumber(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}

export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isDateExpired(date: string | Date): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d < new Date();
}

// ============================================================================
// TEXT UTILITIES
// ============================================================================

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// ============================================================================
// TEMPLATE UTILITIES
// ============================================================================

export interface TemplatePreview {
  desktop_url: string;
  tablet_url: string;
  mobile_url: string;
}

/**
 * Generate template preview with custom data
 */
export async function generateTemplatePreview(
  templateId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _customData: Record<string, unknown>
): Promise<TemplatePreview> {
  try {
    // TODO: Implement actual API call when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock preview URLs
    return {
      desktop_url: `/api/templates/${templateId}/preview/desktop`,
      tablet_url: `/api/templates/${templateId}/preview/tablet`,
      mobile_url: `/api/templates/${templateId}/preview/mobile`,
    };
  } catch {
    throw new Error("Failed to generate template preview");
  }
}

// ============================================================================
// DRAFT AUTOSAVE UTILITIES
// ============================================================================

interface DraftData {
  metadata?: {
    autosave_version?: number;
  };
  [key: string]: unknown;
}

/**
 * Save draft to backend
 */
export async function saveDraftToBackend(
  token: string,
  draftData: DraftData
): Promise<void> {
  try {
    // TODO: Implement actual API call when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Draft saved to backend:", {
      token: token.slice(0, 10) + "...",
      version: draftData.metadata?.autosave_version,
    });
  } catch (err) {
    console.error("Failed to save draft to backend:", err);
    throw err;
  }
}

type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Throttle function calls
 */
export function throttle<T extends AnyFunction>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastRan = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (!lastRan) {
      func(...args);
      lastRan = now;
    } else {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (now - lastRan >= wait) {
          func(...args);
          lastRan = now;
        }
      }, wait - (now - lastRan));
    }
  };
}

/**
 * Debounce function calls
 */
export function debounce<T extends AnyFunction>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
