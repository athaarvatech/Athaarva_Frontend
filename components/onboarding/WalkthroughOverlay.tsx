"use client";

/**
 * WalkthroughOverlay - Phase 3: Onboarding UX Redesign
 * 
 * A guided walkthrough overlay system that highlights elements and provides
 * step-by-step instructions during the onboarding process.
 * 
 * Features:
 * - Spotlight effect on target elements
 * - Animated tooltip with step information
 * - Progress indicator
 * - Skip option
 * - Responsive positioning
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  SkipForward,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WalkthroughStep } from "@/hooks/useWalkthrough";

interface WalkthroughOverlayProps {
  isActive: boolean;
  currentStep: WalkthroughStep | null;
  currentStepIndex: number;
  totalSteps: number;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onClose: () => void;
}

interface TargetPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: "top" | "bottom" | "left" | "right";
}

const TOOLTIP_OFFSET = 16;
const SPOTLIGHT_PADDING = 12;

export function WalkthroughOverlay({
  isActive,
  currentStep,
  currentStepIndex,
  totalSteps,
  progress,
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
  onSkip,
  onClose,
}: WalkthroughOverlayProps) {
  const [targetPosition, setTargetPosition] = useState<TargetPosition | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Find and position the spotlight on the target element
  useEffect(() => {
    if (!isActive || !currentStep?.targetSelector) {
      setTargetPosition(null);
      setTooltipPosition(null);
      return;
    }

    const targetElement = document.querySelector(currentStep.targetSelector);
    if (!targetElement) {
      // If no target found, center the tooltip
      setTargetPosition(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 175,
        arrowPosition: "top",
      });
      return;
    }

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const padding = currentStep.spotlightPadding ?? SPOTLIGHT_PADDING;

      setTargetPosition({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Calculate tooltip position based on step.position or auto
      const position = currentStep.position || "bottom";
      const tooltipWidth = 350;
      const tooltipHeight = 200;

      let newTooltipPosition: TooltipPosition;

      switch (position) {
        case "top":
          newTooltipPosition = {
            top: rect.top - tooltipHeight - TOOLTIP_OFFSET - padding,
            left: Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16)),
            arrowPosition: "bottom",
          };
          break;
        case "bottom":
          newTooltipPosition = {
            top: rect.bottom + TOOLTIP_OFFSET + padding,
            left: Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16)),
            arrowPosition: "top",
          };
          break;
        case "left":
          newTooltipPosition = {
            top: Math.max(16, rect.top + rect.height / 2 - tooltipHeight / 2),
            left: rect.left - tooltipWidth - TOOLTIP_OFFSET - padding,
            arrowPosition: "right",
          };
          break;
        case "right":
          newTooltipPosition = {
            top: Math.max(16, rect.top + rect.height / 2 - tooltipHeight / 2),
            left: rect.right + TOOLTIP_OFFSET + padding,
            arrowPosition: "left",
          };
          break;
        default:
          newTooltipPosition = {
            top: window.innerHeight / 2 - tooltipHeight / 2,
            left: window.innerWidth / 2 - tooltipWidth / 2,
            arrowPosition: "top",
          };
      }

      setTooltipPosition(newTooltipPosition);

      // Scroll element into view if needed
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isActive, currentStep]);

  // Center tooltip when no target
  useEffect(() => {
    if (!isActive) return;
    
    if (!currentStep?.targetSelector && !targetPosition) {
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 175,
        arrowPosition: "top",
      });
    }
  }, [isActive, currentStep, targetPosition]);

  if (!isActive || !currentStep) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Overlay with spotlight cutout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-auto"
        >
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <mask id="spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                {targetPosition && (
                  <rect
                    x={targetPosition.left}
                    y={targetPosition.top}
                    width={targetPosition.width}
                    height={targetPosition.height}
                    rx={12}
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.75)"
              mask="url(#spotlight-mask)"
              style={{ pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}
            />
          </svg>

          {/* Spotlight border glow */}
          {targetPosition && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute rounded-xl border-2 border-healthcare-primary shadow-lg shadow-healthcare-primary/30"
              style={{
                top: targetPosition.top,
                left: targetPosition.left,
                width: targetPosition.width,
                height: targetPosition.height,
                pointerEvents: "none",
              }}
            />
          )}
        </motion.div>

        {/* Tooltip */}
        {tooltipPosition && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bg-white rounded-xl shadow-2xl border border-gray-100 w-[350px] pointer-events-auto"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
          >
            {/* Progress bar */}
            <div className="h-1 rounded-t-xl overflow-hidden bg-gray-100">
              <Progress value={progress} className="h-1 rounded-none" />
            </div>

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-healthcare-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-healthcare-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-healthcare-primary">
                      Step {currentStepIndex + 1} of {totalSteps}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-5">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {currentStep.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onSkip}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                >
                  <SkipForward className="w-3 h-3" />
                  Skip tour
                </button>

                <div className="flex items-center gap-2">
                  {!isFirstStep && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPrevious}
                      className="h-8"
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      Back
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={onNext}
                    className="h-8 bg-healthcare-primary hover:bg-healthcare-primary/90"
                  >
                    {isLastStep ? (
                      <>
                        Finish
                        <CheckCircle className="w-3 h-3 ml-1" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Arrow indicator */}
            <div
              className={cn(
                "absolute w-3 h-3 bg-white border-gray-100 transform rotate-45",
                tooltipPosition.arrowPosition === "top" && "top-[-6px] left-1/2 -translate-x-1/2 border-t border-l",
                tooltipPosition.arrowPosition === "bottom" && "bottom-[-6px] left-1/2 -translate-x-1/2 border-b border-r",
                tooltipPosition.arrowPosition === "left" && "left-[-6px] top-1/2 -translate-y-1/2 border-l border-b",
                tooltipPosition.arrowPosition === "right" && "right-[-6px] top-1/2 -translate-y-1/2 border-r border-t"
              )}
            />
          </motion.div>
        )}

        {/* Step indicators (dots) */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentStepIndex
                  ? "w-6 bg-healthcare-primary"
                  : index < currentStepIndex
                  ? "bg-healthcare-emerald"
                  : "bg-gray-300"
              )}
              onClick={() => {
                // Could add goToStep functionality here
              }}
            />
          ))}
        </div>
      </div>
    </AnimatePresence>
  );
}

export default WalkthroughOverlay;
