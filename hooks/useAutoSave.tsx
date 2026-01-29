"use client";

/**
 * useAutoSave Hook - Phase 3: Onboarding UX Redesign
 * 
 * A custom hook for automatically saving data with debouncing.
 * Features:
 * - Debounced save (configurable delay)
 * - Save status tracking
 * - Error handling
 * - Last saved timestamp
 * - Manual save trigger
 */

import React, { useState, useEffect, useCallback, useRef } from "react";

export interface UseAutoSaveOptions<T> {
  /** Data to be saved */
  data: T;
  /** Function to save the data */
  saveFn: (data: T) => Promise<void>;
  /** Debounce delay in milliseconds (default: 1000) */
  debounceMs?: number;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
  /** Callback when save succeeds */
  onSaveSuccess?: () => void;
  /** Callback when save fails */
  onSaveError?: (error: Error) => void;
  /** Key to use for comparing data changes */
  getKey?: (data: T) => string;
}

export interface UseAutoSaveReturn {
  /** Whether currently saving */
  isSaving: boolean;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Timestamp of last successful save */
  lastSaved: Date | null;
  /** Last error that occurred during save */
  error: Error | null;
  /** Manually trigger a save */
  saveNow: () => Promise<void>;
  /** Reset the save state */
  reset: () => void;
  /** Save status for UI display */
  saveStatus: "idle" | "saving" | "saved" | "error";
}

export function useAutoSave<T>({
  data,
  saveFn,
  debounceMs = 1000,
  enabled = true,
  onSaveSuccess,
  onSaveError,
  getKey,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Refs for tracking
  const lastSavedDataRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Get string key for comparison
  const getDataKey = useCallback(
    (d: T): string => {
      if (getKey) return getKey(d);
      try {
        return JSON.stringify(d);
      } catch {
        return String(d);
      }
    },
    [getKey]
  );

  // Perform the save operation
  const performSave = useCallback(
    async (dataToSave: T) => {
      if (!isMountedRef.current) return;

      setIsSaving(true);
      setSaveStatus("saving");
      setError(null);

      try {
        await saveFn(dataToSave);

        if (isMountedRef.current) {
          const now = new Date();
          setLastSaved(now);
          setHasUnsavedChanges(false);
          setSaveStatus("saved");
          lastSavedDataRef.current = getDataKey(dataToSave);
          onSaveSuccess?.();

          // Reset status to idle after a delay
          setTimeout(() => {
            if (isMountedRef.current) {
              setSaveStatus("idle");
            }
          }, 2000);
        }
      } catch (err) {
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setSaveStatus("error");
          onSaveError?.(error);
        }
      } finally {
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    [saveFn, getDataKey, onSaveSuccess, onSaveError]
  );

  // Manual save trigger
  const saveNow = useCallback(async () => {
    // Clear any pending debounced save
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    await performSave(data);
  }, [data, performSave]);

  // Reset state
  const reset = useCallback(() => {
    setIsSaving(false);
    setLastSaved(null);
    setError(null);
    setHasUnsavedChanges(false);
    setSaveStatus("idle");
    lastSavedDataRef.current = null;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Watch for data changes and trigger debounced save
  useEffect(() => {
    if (!enabled) return;

    const currentKey = getDataKey(data);

    // Check if data has changed
    if (lastSavedDataRef.current !== null && currentKey !== lastSavedDataRef.current) {
      setHasUnsavedChanges(true);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced save
      debounceTimerRef.current = setTimeout(() => {
        performSave(data);
      }, debounceMs);
    } else if (lastSavedDataRef.current === null) {
      // First render - store initial data
      lastSavedDataRef.current = currentKey;
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data, enabled, debounceMs, getDataKey, performSave]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    hasUnsavedChanges,
    lastSaved,
    error,
    saveNow,
    reset,
    saveStatus,
  };
}

/**
 * Format the time elapsed since last save in a human-readable format
 */
export function formatTimeSince(date: Date | null): string {
  if (!date) return "";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * AutoSaveIndicator component for displaying save status
 */
export function AutoSaveIndicator({
  status,
  lastSaved,
  className,
}: {
  status: "idle" | "saving" | "saved" | "error";
  lastSaved: Date | null;
  className?: string;
}) {
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    if (!lastSaved) return;

    const updateTime = () => {
      setFormattedTime(formatTimeSince(lastSaved));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [lastSaved]);

  return (
    <div className={className}>
      {status === "saving" && (
        <span className="text-healthcare-primary text-sm flex items-center gap-1">
          <svg
            className="animate-spin h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Saving...
        </span>
      )}
      {status === "saved" && (
        <span className="text-emerald-600 text-sm flex items-center gap-1">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Saved
        </span>
      )}
      {status === "error" && (
        <span className="text-red-600 text-sm flex items-center gap-1">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Error saving
        </span>
      )}
      {status === "idle" && lastSaved && (
        <span className="text-gray-500 text-sm flex items-center gap-1">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Saved {formattedTime}
        </span>
      )}
    </div>
  );
}

export default useAutoSave;
