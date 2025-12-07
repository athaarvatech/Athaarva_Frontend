"use client";

/**
 * =============================================================================
 * GLOBAL CONTACT SYNC
 * =============================================================================
 * 
 * A utility component/hook that provides one-way binding from Wizard location
 * data to the Canvas footer contact section.
 * 
 * HOW IT WORKS:
 * - Watches `data.locations` from the onboarding context
 * - When locations change, syncs the primary location's contact info
 * - Automatically updates the blueprint footer contact section
 * - One-way binding only (Wizard → Canvas)
 * 
 * USAGE:
 * 1. As a hook: `useGlobalContactSync(locations, onSyncFooter)`
 * 2. As a utility: `syncContactToBlueprint(locations, blueprint)`
 * 
 * =============================================================================
 */

import { useEffect, useCallback } from "react";
import type { LocationData } from "@/contexts/HospitalOnboardingContextV2";
import type { TemplateBlueprint } from "./templateBlueprints";

// ============================================================================
// TYPES
// ============================================================================

export interface ContactSyncResult {
  phone: string;
  email: string;
  location: string;
  synced: boolean;
}

export interface GlobalContactSyncOptions {
  /** Only sync if the canvas contact is still at default/empty values */
  preserveCustomized?: boolean;
  /** Format the address string */
  addressFormatter?: (location: LocationData) => string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the primary location from a list of locations.
 * Priority: headquarters > first location
 */
export function getPrimaryLocation(locations: LocationData[]): LocationData | null {
  if (!locations || locations.length === 0) return null;
  
  const headquarters = locations.find((loc) => loc.is_headquarters);
  return headquarters || locations[0];
}

/**
 * Format a location into a display address string.
 */
export function formatLocationAddress(location: LocationData): string {
  const parts = [
    location.address,
    location.city,
    location.state,
    location.pincode,
  ].filter(Boolean);
  
  return parts.join(", ");
}

/**
 * Check if the footer contact has been customized from defaults.
 */
export function isFooterCustomized(
  footerContact: TemplateBlueprint["footer"]["contact"],
  defaultContact?: TemplateBlueprint["footer"]["contact"]
): boolean {
  if (!defaultContact) return false;
  
  return (
    footerContact.phone !== defaultContact.phone ||
    footerContact.email !== defaultContact.email ||
    footerContact.location !== defaultContact.location
  );
}

/**
 * Sync location data to a blueprint's footer contact section.
 * Returns a new blueprint with the synced footer.
 */
export function syncContactToBlueprint(
  locations: LocationData[],
  blueprint: TemplateBlueprint,
  options: GlobalContactSyncOptions = {}
): TemplateBlueprint {
  const primaryLocation = getPrimaryLocation(locations);
  
  if (!primaryLocation) {
    return blueprint; // No location to sync
  }
  
  const formatter = options.addressFormatter || formatLocationAddress;
  
  const newFooterContact = {
    phone: primaryLocation.contact_phone || blueprint.footer.contact.phone,
    email: primaryLocation.contact_email || blueprint.footer.contact.email,
    location: formatter(primaryLocation) || blueprint.footer.contact.location,
  };
  
  return {
    ...blueprint,
    footer: {
      ...blueprint.footer,
      contact: newFooterContact,
    },
  };
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to automatically sync location data to the blueprint footer.
 * 
 * @param locations - Array of location data from the wizard
 * @param blueprint - Current blueprint being edited
 * @param onUpdate - Callback to update the blueprint
 * @param options - Sync options
 */
export function useGlobalContactSync(
  locations: LocationData[],
  blueprint: TemplateBlueprint | null,
  onUpdate: (updates: Partial<TemplateBlueprint>) => void,
  options: GlobalContactSyncOptions = {}
) {
  const { preserveCustomized = false } = options;
  
  const syncContact = useCallback(() => {
    if (!blueprint) return;
    
    const primaryLocation = getPrimaryLocation(locations);
    if (!primaryLocation) return;
    
    // Skip if preserving customized and footer has been modified
    if (preserveCustomized && blueprint.footer.contact.phone !== "(123) 456-7890") {
      return;
    }
    
    const formatter = options.addressFormatter || formatLocationAddress;
    
    onUpdate({
      footer: {
        ...blueprint.footer,
        contact: {
          phone: primaryLocation.contact_phone || blueprint.footer.contact.phone,
          email: primaryLocation.contact_email || blueprint.footer.contact.email,
          location: formatter(primaryLocation) || blueprint.footer.contact.location,
        },
      },
    });
  }, [locations, blueprint, onUpdate, preserveCustomized, options.addressFormatter]);
  
  // Sync when locations change
  useEffect(() => {
    syncContact();
  }, [syncContact]);
  
  return {
    syncContact,
    primaryLocation: getPrimaryLocation(locations),
  };
}

// ============================================================================
// COMPONENT VERSION (optional - for use in JSX)
// ============================================================================

interface GlobalContactSyncProps {
  locations: LocationData[];
  blueprint: TemplateBlueprint | null;
  onUpdate: (updates: Partial<TemplateBlueprint>) => void;
  options?: GlobalContactSyncOptions;
  children?: React.ReactNode;
}

/**
 * Component wrapper that syncs contact data.
 * Use this to wrap a template editor with automatic sync.
 */
export function GlobalContactSyncProvider({
  locations,
  blueprint,
  onUpdate,
  options,
  children,
}: GlobalContactSyncProps) {
  useGlobalContactSync(locations, blueprint, onUpdate, options);
  
  return <>{children}</>;
}

export default GlobalContactSyncProvider;
