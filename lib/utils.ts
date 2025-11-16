import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Validate UUID format (v4)
 * UUIDs are 36 characters: 8-4-4-4-12 format
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== "string") {
    return false;
  }
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate multiple UUIDs
 */
export function areValidUUIDs(...uuids: string[]): boolean {
  return uuids.every((uuid) => isValidUUID(uuid));
}

/**
 * Format UUID for display (shorten for UI)
 */
export function formatUUIDForDisplay(uuid: string): string {
  if (!isValidUUID(uuid)) {
    return uuid;
  }
  // Show first 8 characters + last 4
  return `${uuid.slice(0, 8)}...${uuid.slice(-4)}`;
}

/**
 * Generate a client-side UUID (v4)
 * Note: Use server-generated UUIDs for actual data
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Migrate old numeric ID to UUID format detection
 */
export function isNumericId(id: string | number): boolean {
  if (typeof id === "number") return true;
  return !isNaN(Number(id)) && !isValidUUID(id);
}

/**
 * Clean localStorage of old numeric IDs
 */
export function migrateLocalStorage(): void {
  const keysToCheck = [
    "user_id",
    "patient_id",
    "doctor_id",
    "hospital_id",
    "tenant_id",
  ];

  keysToCheck.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value && isNumericId(value)) {
      console.warn(`Removing old numeric ${key}:`, value);
      localStorage.removeItem(key);
    }
  });

  // Rename hospital_code to subdomain
  const hospitalCode = localStorage.getItem("hospital_code");
  if (hospitalCode && !localStorage.getItem("subdomain")) {
    localStorage.setItem("subdomain", hospitalCode);
    localStorage.removeItem("hospital_code");
  }
}

/**
 * Status type converters (backend uses ENUMs instead of booleans)
 */
export type UserStatus = "active" | "suspended" | "deactivated";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export function isActiveStatus(status: UserStatus): boolean {
  return status === "active";
}

export function isVerified(verificationStatus: VerificationStatus): boolean {
  return verificationStatus === "approved";
}

/**
 * Convert old boolean status to new ENUM
 */
export function booleanToStatus(isActive: boolean): UserStatus {
  return isActive ? "active" : "suspended";
}

export function booleanToVerification(isVerified: boolean): VerificationStatus {
  return isVerified ? "approved" : "pending";
}
