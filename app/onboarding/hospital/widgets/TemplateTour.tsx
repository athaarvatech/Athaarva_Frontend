"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Eye,
  Palette,
  Type,
  Maximize2,
  CheckCircle,
  MousePointer2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: "top" | "bottom" | "left" | "right";
  arrowDirection: "down" | "up" | "left" | "right";
  icon: React.ElementType;
  highlightArea?: boolean;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "select-template",
    title: "Choose Your Template",
    description: "Start by selecting a template that matches your hospital's style. Click on any template card to preview it.",
    targetSelector: '[data-tour="template-card"]',
    position: "top",
    arrowDirection: "down",
    icon: MousePointer2,
    highlightArea: true,
  },
  {
    id: "preview-template",
    title: "Preview Your Template",
    description: "Click the Preview button to see the full template and customize it to your needs.",
    targetSelector: '[data-tour="preview-button"]',
    position: "left",
    arrowDirection: "right",
    icon: Eye,
    highlightArea: true,
  },
  {
    id: "edit-mode",
    title: "Canvas Mode",
    description: "Switch to Canvas Mode to edit text, images, and content directly on the template. Click to start customizing!",
    targetSelector: '[data-tour="edit-toggle"]',
    position: "bottom",
    arrowDirection: "up",
    icon: Sparkles,
    highlightArea: true,
  },
  {
    id: "change-colors",
    title: "Customize Colors",
    description: "Choose from beautiful pre-designed color schemes or create your own to match your hospital's brand.",
    targetSelector: '[data-tour="color-picker"]',
    position: "bottom",
    arrowDirection: "up",
    icon: Palette,
    highlightArea: true,
  },
  {
    id: "change-fonts",
    title: "Select Typography",
    description: "Pick the perfect font combination that reflects your hospital's personality and professionalism.",
    targetSelector: '[data-tour="font-picker"]',
    position: "bottom",
    arrowDirection: "up",
    icon: Type,
    highlightArea: true,
  },
  {
    id: "fullscreen-view",
    title: "Full Screen Preview",
    description: "View your template in full screen to see exactly how it will look to your patients. Press ESC to exit anytime.",
    targetSelector: '[data-tour="fullscreen-button"]',
    position: "bottom",
    arrowDirection: "up",
    icon: Maximize2,
    highlightArea: true,
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "Once you're happy with your template, click 'Select & Continue' to save your customizations and move forward.",
    targetSelector: '[data-tour="select-button"]',
    position: "top",
    arrowDirection: "down",
    icon: CheckCircle,
    highlightArea: true,
  },
];

interface TemplateGuidedTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
}

export function TemplateGuidedTour({
  onComplete,
  onSkip,
  autoStart = true,
}: TemplateGuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("template-tour-completed");
    if (!tourCompleted && autoStart) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  useEffect(() => {
    if (!isActive) return;

    const updateTargetPosition = () => {
      const step = TOUR_STEPS[currentStep];
      const element = document.querySelector(step.targetSelector) as HTMLElement;

      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        setTimeout(updateTargetPosition, 100);
      }
    };

    updateTargetPosition();
    window.addEventListener("scroll", updateTargetPosition, true);
    window.addEventListener("resize", updateTargetPosition);

    return () => {
      window.removeEventListener("scroll", updateTargetPosition, true);
      window.removeEventListener("resize", updateTargetPosition);
    };
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem("template-tour-completed", "true");
    setIsActive(false);
    onSkip?.();
  };

  const handleComplete = () => {
    localStorage.setItem("template-tour-completed", "true");
    setIsActive(false);
    onComplete?.();
  };

  if (!isActive || !targetRect) return null;

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      {isActive && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
          />

          {step.highlightArea && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[10000] pointer-events-none"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                border: "3px solid rgb(14, 159, 159)",
                borderRadius: "12px",
                boxShadow: "0 0 0 4px rgba(14, 159, 159, 0.2), 0 0 20px rgba(14, 159, 159, 0.4)",
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 border-2 border-teal-400 rounded-xl"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed z-[10002] pointer-events-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{
              top: Math.max(20, targetRect.bottom + 20),
              left: Math.max(20, Math.min(window.innerWidth - 340, targetRect.left)),
              width: "320px",
            }}
          >
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{step.title}</h3>
                    <p className="text-teal-50 text-xs">
                      Step {currentStep + 1} of {TOUR_STEPS.length}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {step.description}
              </p>

              <div className="mb-4">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Skip Tour
                </Button>

                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="text-gray-700"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg"
                  >
                    {currentStep === TOUR_STEPS.length - 1 ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Finish
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function useRestartTour() {
  return () => {
    localStorage.removeItem("template-tour-completed");
    window.location.reload();
  };
}
