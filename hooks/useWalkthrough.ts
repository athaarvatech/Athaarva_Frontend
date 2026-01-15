"use client";

/**
 * useWalkthrough Hook - Phase 3: Onboarding UX Redesign
 * 
 * A custom hook for managing the guided walkthrough state.
 * Features:
 * - Step navigation
 * - Persistence (remembers if user completed walkthrough)
 * - Callbacks for step completion
 * - Auto-advance option
 */

import { useState, useCallback, useEffect } from "react";

export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string; // CSS selector for the element to highlight
  position?: "top" | "bottom" | "left" | "right" | "center";
  spotlightPadding?: number;
  action?: "click" | "input" | "select" | "none";
  onEnter?: () => void;
  onExit?: () => void;
}

interface UseWalkthroughOptions {
  steps: WalkthroughStep[];
  storageKey?: string;
  autoStart?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  onStepChange?: (stepIndex: number, step: WalkthroughStep) => void;
}

interface UseWalkthroughReturn {
  // State
  isActive: boolean;
  currentStepIndex: number;
  currentStep: WalkthroughStep | null;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  hasCompleted: boolean;
  progress: number;

  // Actions
  start: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;
  skip: () => void;
  reset: () => void;
}

export function useWalkthrough({
  steps,
  storageKey = "athaarva-onboarding-walkthrough",
  autoStart = false,
  onComplete,
  onSkip,
  onStepChange,
}: UseWalkthroughOptions): UseWalkthroughReturn {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Check if walkthrough was already completed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem(`${storageKey}-completed`);
      if (completed === "true") {
        setHasCompleted(true);
      } else if (autoStart && !hasCompleted) {
        setIsActive(true);
      }
    }
  }, [storageKey, autoStart, hasCompleted]);

  // Call onStepChange when step changes
  useEffect(() => {
    if (isActive && steps[currentStepIndex]) {
      onStepChange?.(currentStepIndex, steps[currentStepIndex]);
      steps[currentStepIndex].onEnter?.();
    }
  }, [currentStepIndex, isActive, steps, onStepChange]);

  const currentStep = steps[currentStepIndex] || null;
  const totalSteps = steps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const start = useCallback(() => {
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    if (currentStep?.onExit) {
      currentStep.onExit();
    }
    setIsActive(false);
  }, [currentStep]);

  const next = useCallback(() => {
    if (currentStep?.onExit) {
      currentStep.onExit();
    }

    if (isLastStep) {
      // Complete the walkthrough
      setIsActive(false);
      setHasCompleted(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(`${storageKey}-completed`, "true");
      }
      onComplete?.();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [isLastStep, currentStep, storageKey, onComplete]);

  const previous = useCallback(() => {
    if (currentStep?.onExit) {
      currentStep.onExit();
    }

    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [isFirstStep, currentStep]);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps) {
        if (currentStep?.onExit) {
          currentStep.onExit();
        }
        setCurrentStepIndex(index);
      }
    },
    [totalSteps, currentStep]
  );

  const skip = useCallback(() => {
    if (currentStep?.onExit) {
      currentStep.onExit();
    }
    setIsActive(false);
    onSkip?.();
  }, [currentStep, onSkip]);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setHasCompleted(false);
    setIsActive(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${storageKey}-completed`);
    }
  }, [storageKey]);

  return {
    // State
    isActive,
    currentStepIndex,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    hasCompleted,
    progress,

    // Actions
    start,
    stop,
    next,
    previous,
    goToStep,
    skip,
    reset,
  };
}

export default useWalkthrough;
