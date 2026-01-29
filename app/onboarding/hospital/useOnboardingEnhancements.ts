"use client";

/**
 * Onboarding Enhancements - Phase 3 Integration
 * 
 * This file provides hooks and utilities for integrating Phase 3 
 * onboarding UX features into the hospital onboarding wizard.
 */

import { useState, useEffect, useCallback } from "react";
import { WalkthroughStep } from "@/hooks/useWalkthrough";

// Local storage keys
const WELCOME_SHOWN_KEY = "hospital_onboarding_welcome_shown";
const WALKTHROUGH_COMPLETED_KEY = "hospital_onboarding_walkthrough_completed";
const FIRST_VISIT_KEY = "hospital_onboarding_first_visit";

/**
 * Hook to manage welcome modal state for hospital onboarding
 */
export function useOnboardingWelcome(hospitalName?: string) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasShownWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);
    const firstVisit = !localStorage.getItem(FIRST_VISIT_KEY);

    if (firstVisit) {
      localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
    }

    setIsFirstVisit(firstVisit || !hasShownWelcome);
    
    // Show welcome on first visit with a slight delay for smooth animation
    if (!hasShownWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissWelcome = useCallback(() => {
    localStorage.setItem(WELCOME_SHOWN_KEY, new Date().toISOString());
    setShowWelcome(false);
  }, []);

  const resetWelcome = useCallback(() => {
    localStorage.removeItem(WELCOME_SHOWN_KEY);
    setShowWelcome(true);
  }, []);

  return {
    showWelcome,
    isFirstVisit,
    dismissWelcome,
    resetWelcome,
    hospitalName,
  };
}

/**
 * Walkthrough steps for hospital onboarding wizard
 */
export const ONBOARDING_WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: "progress-sidebar",
    title: "Track Your Progress",
    description: "This sidebar shows all the steps in your onboarding journey. Completed steps are marked with a green checkmark. Click any step to jump directly to it.",
    targetSelector: "[data-walkthrough='progress-sidebar']",
    position: "right",
  },
  {
    id: "step-content",
    title: "Step Content Area",
    description: "This is where you'll fill in your hospital's information. Each step focuses on a specific aspect of your hospital setup. All fields are auto-saved as you type.",
    targetSelector: "[data-walkthrough='step-content']",
    position: "top",
  },
  {
    id: "autosave-indicator",
    title: "Auto-Save Feature",
    description: "Your progress is automatically saved every few seconds. Look for the 'Saved' indicator to confirm your data is secure. You can safely close and resume later.",
    targetSelector: "[data-walkthrough='autosave-indicator']",
    position: "bottom",
  },
  {
    id: "help-button",
    title: "Need Help?",
    description: "Click the info icon for context-specific help about each step. We've included detailed guidance to make the process smooth.",
    targetSelector: "[data-walkthrough='help-button']",
    position: "left",
  },
  {
    id: "navigation",
    title: "Navigate Between Steps",
    description: "Use the Previous and Next buttons to move between steps. You can also click directly on a completed step in the sidebar to jump back to it.",
    targetSelector: "[data-walkthrough='navigation']",
    position: "top",
  },
];

/**
 * Hook to manage walkthrough state for hospital onboarding
 */
export function useOnboardingWalkthrough() {
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const [hasCompletedWalkthrough, setHasCompletedWalkthrough] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const completed = localStorage.getItem(WALKTHROUGH_COMPLETED_KEY);
    setHasCompletedWalkthrough(!!completed);
  }, []);

  const startWalkthrough = useCallback(() => {
    setIsWalkthroughActive(true);
  }, []);

  const completeWalkthrough = useCallback(() => {
    localStorage.setItem(WALKTHROUGH_COMPLETED_KEY, new Date().toISOString());
    setHasCompletedWalkthrough(true);
    setIsWalkthroughActive(false);
  }, []);

  const skipWalkthrough = useCallback(() => {
    localStorage.setItem(WALKTHROUGH_COMPLETED_KEY, "skipped");
    setHasCompletedWalkthrough(true);
    setIsWalkthroughActive(false);
  }, []);

  const resetWalkthrough = useCallback(() => {
    localStorage.removeItem(WALKTHROUGH_COMPLETED_KEY);
    setHasCompletedWalkthrough(false);
  }, []);

  return {
    isWalkthroughActive,
    hasCompletedWalkthrough,
    steps: ONBOARDING_WALKTHROUGH_STEPS,
    startWalkthrough,
    completeWalkthrough,
    skipWalkthrough,
    resetWalkthrough,
  };
}

/**
 * Combine welcome and walkthrough hooks for full onboarding experience
 */
export function useOnboardingExperience(hospitalName?: string) {
  const welcome = useOnboardingWelcome(hospitalName);
  const walkthrough = useOnboardingWalkthrough();

  const handleWelcomeDismiss = useCallback(() => {
    welcome.dismissWelcome();
    // Optionally start walkthrough after welcome
    if (!walkthrough.hasCompletedWalkthrough) {
      // Short delay for smooth transition
      setTimeout(() => {
        walkthrough.startWalkthrough();
      }, 300);
    }
  }, [welcome, walkthrough]);

  return {
    // Welcome modal state
    showWelcome: welcome.showWelcome,
    isFirstVisit: welcome.isFirstVisit,
    dismissWelcome: handleWelcomeDismiss,
    resetWelcome: welcome.resetWelcome,
    
    // Walkthrough state
    isWalkthroughActive: walkthrough.isWalkthroughActive,
    hasCompletedWalkthrough: walkthrough.hasCompletedWalkthrough,
    walkthroughSteps: walkthrough.steps,
    startWalkthrough: walkthrough.startWalkthrough,
    completeWalkthrough: walkthrough.completeWalkthrough,
    skipWalkthrough: walkthrough.skipWalkthrough,
    resetWalkthrough: walkthrough.resetWalkthrough,
    
    // Hospital name for personalization
    hospitalName,
  };
}

/**
 * Features list for welcome modal
 */
export const ONBOARDING_FEATURES = [
  {
    icon: "Building2",
    title: "Complete Hospital Setup",
    description: "Configure your organization profile, locations, departments, and services",
  },
  {
    icon: "Palette",
    title: "Brand Customization",
    description: "Customize colors, upload your logo, and design your login page",
  },
  {
    icon: "Shield",
    title: "Compliance & Security",
    description: "Upload licenses, set up billing, and ensure regulatory compliance",
  },
  {
    icon: "Sparkles",
    title: "AI-Powered Assistance",
    description: "Get smart suggestions for content, images, and configurations",
  },
];

export default useOnboardingExperience;
