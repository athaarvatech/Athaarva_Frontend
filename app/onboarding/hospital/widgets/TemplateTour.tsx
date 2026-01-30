"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowLeft,
  Sparkles,
  Eye,
  Palette,
  Type,
  Maximize2,
  CheckCircle,
  MousePointer2,
  Play,
  Pause,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: "top" | "bottom" | "left" | "right" | "auto";
  arrowDirection: "down" | "up" | "left" | "right";
  icon: React.ElementType;
  highlightArea?: boolean;
  delay?: number;
  autoPlayDuration?: number; // How long to show this step in auto-play mode
  demoAction?: () => void; // Optional action to perform during this step
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "🤖 AI Guide: Welcome!",
    description:
      "Hi! I'm your AI guide. I'll automatically show you how to customize your hospital's website template. Just sit back and watch - or take control anytime!",
    targetSelector: '[data-tour="template-card"]',
    position: "auto",
    arrowDirection: "down",
    icon: Sparkles,
    highlightArea: false,
    delay: 500,
    autoPlayDuration: 4000,
  },
  {
    id: "select-template",
    title: "🤖 Browsing Templates",
    description:
      "Watch as I show you our beautiful templates. Each one is professionally designed for hospitals. I'll highlight them for you...",
    targetSelector: '[data-tour="template-card"]',
    position: "auto",
    arrowDirection: "down",
    icon: MousePointer2,
    highlightArea: true,
    autoPlayDuration: 5000,
  },
  {
    id: "preview-template",
    title: "🤖 Opening Preview",
    description:
      "Now I'm clicking the Preview button to show you the full template. This is where all the magic happens!",
    targetSelector: '[data-tour="preview-button"]',
    position: "auto",
    arrowDirection: "right",
    icon: Eye,
    highlightArea: true,
    autoPlayDuration: 4000,
  },
  {
    id: "edit-mode",
    title: "🤖 Activating Canvas Mode",
    description:
      "Let me switch to Canvas Mode for you. This allows direct editing - click on any text or image to customize it instantly!",
    targetSelector: '[data-tour="edit-toggle"]',
    position: "auto",
    arrowDirection: "up",
    icon: Sparkles,
    highlightArea: true,
    autoPlayDuration: 5000,
  },
  {
    id: "change-colors",
    title: "🤖 Customizing Colors",
    description:
      "Watch how easy it is to change colors! I'm showing you the color palette. Pick any scheme to match your brand instantly.",
    targetSelector: '[data-tour="color-picker"]',
    position: "auto",
    arrowDirection: "up",
    icon: Palette,
    highlightArea: true,
    autoPlayDuration: 5000,
  },
  {
    id: "change-fonts",
    title: "🤖 Selecting Fonts",
    description:
      "Typography matters! I'm demonstrating the font selector. Each combination is crafted by design experts for readability and style.",
    targetSelector: '[data-tour="font-picker"]',
    position: "auto",
    arrowDirection: "up",
    icon: Type,
    highlightArea: true,
    autoPlayDuration: 5000,
  },
  {
    id: "fullscreen-view",
    title: "🤖 Full Screen Preview",
    description:
      "Let me show you the full screen view. This is exactly how your patients will see your website. Press ESC to exit anytime!",
    targetSelector: '[data-tour="fullscreen-button"]',
    position: "auto",
    arrowDirection: "up",
    icon: Maximize2,
    highlightArea: true,
    autoPlayDuration: 4000,
  },
  {
    id: "complete",
    title: "🤖 Tour Complete! 🎉",
    description:
      "That&apos;s it! You&apos;ve seen everything. When you&apos;re ready, click &apos;Select & Continue&apos; to save your customizations. You can replay this demo anytime!",
    targetSelector: '[data-tour="select-button"]',
    position: "auto",
    arrowDirection: "down",
    icon: CheckCircle,
    highlightArea: true,
    autoPlayDuration: 6000,
  },
];

interface TemplateGuidedTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
  enableAutoPlay?: boolean; // Enable auto-play mode
  demoActions?: {
    openPreview?: (templateId: string) => void;
    toggleEditMode?: (enabled: boolean) => void;
    openColorPicker?: () => void;
    changeColor?: (colorIndex: number) => void;
    openFontPicker?: () => void;
    changeFont?: (fontIndex: number) => void;
    toggleFullscreen?: (enabled: boolean) => void;
  };
}

interface TooltipPosition {
  top: number;
  left: number;
  transformOrigin: string;
}

const getArrowIcon = (direction: string) => {
  switch (direction) {
    case "up":
      return ArrowUp;
    case "down":
      return ArrowDown;
    case "left":
      return ArrowLeft;
    case "right":
      return ArrowRight;
    default:
      return ArrowDown;
  }
};

const calculateTooltipPosition = (
  targetRect: DOMRect,
  position: string,
  tooltipWidth: number = 320,
  tooltipHeight: number = 200
): TooltipPosition => {
  const padding = 16;
  let top = 0;
  let left = 0;
  let transformOrigin = "top left";

  // Auto positioning logic
  if (position === "auto") {
    const spaceAbove = targetRect.top;
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = window.innerWidth - targetRect.right;

    // Determine best position based on available space
    if (spaceBelow > tooltipHeight + padding) {
      position = "bottom";
    } else if (spaceAbove > tooltipHeight + padding) {
      position = "top";
    } else if (spaceRight > tooltipWidth + padding) {
      position = "right";
    } else if (spaceLeft > tooltipWidth + padding) {
      position = "left";
    } else {
      position = "bottom"; // Default fallback
    }
  }

  switch (position) {
    case "bottom":
      top = targetRect.bottom + padding;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      transformOrigin = "top center";
      break;
    case "top":
      top = targetRect.top - tooltipHeight - padding;
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
      transformOrigin = "bottom center";
      break;
    case "right":
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.right + padding;
      transformOrigin = "left center";
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      left = targetRect.left - tooltipWidth - padding;
      transformOrigin = "right center";
      break;
  }

  // Keep tooltip within viewport bounds
  top = Math.max(
    padding,
    Math.min(top, window.innerHeight - tooltipHeight - padding)
  );
  left = Math.max(
    padding,
    Math.min(left, window.innerWidth - tooltipWidth - padding)
  );

  return { top, left, transformOrigin };
};

export function TemplateGuidedTour({
  onComplete,
  onSkip,
  autoStart = true,
  enableAutoPlay = true,
  demoActions,
}: TemplateGuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(enableAutoPlay);
  const [progress, setProgress] = useState(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Execute demo actions automatically when step changes
  useEffect(() => {
    if (!isActive || !enableAutoPlay || !demoActions) return;

    const step = TOUR_STEPS[currentStep];
    const delay = 800; // Delay before executing action (allows user to see highlight first)

    const actionTimer = setTimeout(() => {
      switch (step.id) {
        case "preview-template":
          demoActions.openPreview?.("ahtarva-professional");
          break;
        case "edit-mode":
          demoActions.toggleEditMode?.(true);
          break;
        case "change-colors":
          demoActions.openColorPicker?.();
          // Change color after showing picker
          setTimeout(() => demoActions.changeColor?.(1), 1000);
          break;
        case "change-fonts":
          demoActions.openFontPicker?.();
          // Change font after showing picker
          setTimeout(() => demoActions.changeFont?.(1), 1000);
          break;
        case "fullscreen-view":
          demoActions.toggleFullscreen?.(true);
          // Exit fullscreen before moving to next step
          setTimeout(() => demoActions.toggleFullscreen?.(false), 3000);
          break;
      }
    }, delay);

    return () => clearTimeout(actionTimer);
  }, [currentStep, isActive, enableAutoPlay, demoActions]);

  // Check if tour should be shown
  useEffect(() => {
    const tourCompleted = localStorage.getItem("template-tour-completed");
    const tourSkipped = sessionStorage.getItem("template-tour-skipped");

    if (!tourCompleted && !tourSkipped && autoStart) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, TOUR_STEPS[0]?.delay || 800);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  useEffect(() => {
    if (!isActive) return;

    const updateTargetPosition = () => {
      const step = TOUR_STEPS[currentStep];
      const element = document.querySelector(
        step.targetSelector
      ) as HTMLElement;

      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);

        // Calculate tooltip position
        const position = calculateTooltipPosition(rect, step.position);
        setTooltipPosition(position);

        // Smooth scroll to element if it's not fully visible
        const isVisible =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth;

        if (!isVisible) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      } else {
        // Retry if element not found yet
        setTimeout(updateTargetPosition, 100);
      }
    };

    updateTargetPosition();

    const handleScroll = () => {
      requestAnimationFrame(updateTargetPosition);
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updateTargetPosition);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updateTargetPosition);
    };
  }, [currentStep, isActive]);

  const handleComplete = React.useCallback(() => {
    // Clean up timers
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    localStorage.setItem("template-tour-completed", "true");
    setIsActive(false);
    onComplete?.();
  }, [onComplete]);

  const handleNext = React.useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setProgress(0);

    if (currentStep < TOUR_STEPS.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      handleComplete();
    }
  }, [isTransitioning, currentStep, handleComplete]);

  const handlePrevious = () => {
    if (isTransitioning || currentStep === 0) return;

    // Pause auto-play when going back
    setIsPlaying(false);
    setIsTransitioning(true);
    setProgress(0);

    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSkip = () => {
    // Clean up timers
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    sessionStorage.setItem("template-tour-skipped", "true");
    setIsActive(false);
    onSkip?.();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setProgress(0);
  };

  const handleManualNext = () => {
    setIsPlaying(false);
    handleNext();
  };

  const handleManualPrevious = () => {
    setIsPlaying(false);
    handlePrevious();
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isActive || !enableAutoPlay || !isPlaying || isTransitioning) return;

    const step = TOUR_STEPS[currentStep];
    const duration = step.autoPlayDuration || 5000;

    // Clear existing timers
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    // Reset progress
    setProgress(0);

    // Progress animation
    const progressInterval = 50; // Update every 50ms
    const progressStep = (progressInterval / duration) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressStep;
        if (next >= 100) {
          if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
          }
          return 100;
        }
        return next;
      });
    }, progressInterval);

    // Auto-advance to next step
    autoPlayTimerRef.current = setTimeout(() => {
      if (currentStep < TOUR_STEPS.length - 1) {
        handleNext();
      } else {
        handleComplete();
      }
    }, duration);

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [
    isActive,
    enableAutoPlay,
    isPlaying,
    currentStep,
    isTransitioning,
    handleComplete,
    handleNext,
  ]);

  if (!isActive || !targetRect || !tooltipPosition) return null;

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;
  const ArrowIcon = getArrowIcon(step.arrowDirection);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <>
          {/* Minimal Overlay - No blur, very light for visibility */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-black/10"
            onClick={handleSkip}
          />

          {/* Arrow Pointer - Points directly to component */}
          {step.highlightArea && (
            <>
              {/* Animated Arrow Pointer */}
              <motion.div
                key={`arrow-${step.id}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed z-[10000] pointer-events-none"
                style={{
                  top:
                    step.arrowDirection === "down"
                      ? targetRect.top - 70
                      : step.arrowDirection === "up"
                      ? targetRect.bottom + 30
                      : step.arrowDirection === "right"
                      ? targetRect.top + targetRect.height / 2 - 30
                      : targetRect.top + targetRect.height / 2 - 30,
                  left:
                    step.arrowDirection === "right"
                      ? targetRect.left - 70
                      : step.arrowDirection === "left"
                      ? targetRect.right + 30
                      : targetRect.left + targetRect.width / 2 - 30,
                }}
              >
                {/* Glowing Circle Base */}
                <motion.div
                  className="absolute inset-0 w-16 h-16"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-full h-full rounded-full bg-teal-400/40 blur-xl" />
                </motion.div>

                {/* Animated Arrow with Bounce */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    y:
                      step.arrowDirection === "down"
                        ? [0, 15, 0]
                        : step.arrowDirection === "up"
                        ? [0, -15, 0]
                        : 0,
                    x:
                      step.arrowDirection === "right"
                        ? [0, 15, 0]
                        : step.arrowDirection === "left"
                        ? [0, -15, 0]
                        : 0,
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Arrow Shadow */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowIcon
                      className="w-16 h-16 text-teal-600 blur-sm"
                      strokeWidth={2.5}
                    />
                  </motion.div>

                  {/* Main Arrow */}
                  <ArrowIcon
                    className="w-16 h-16 text-teal-400 relative z-10 drop-shadow-[0_0_12px_rgba(14,159,159,0.9)]"
                    strokeWidth={3}
                  />

                  {/* Arrow Glow Ring */}
                  <motion.div
                    className="absolute inset-0 w-16 h-16"
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.8, 0.4, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-full h-full rounded-full border-4 border-teal-400/50" />
                  </motion.div>
                </motion.div>

                {/* Pulsing Dots Trail */}
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="absolute w-3 h-3 bg-teal-400 rounded-full"
                    style={{
                      top:
                        step.arrowDirection === "down"
                          ? -20 - index * 15
                          : step.arrowDirection === "up"
                          ? 80 + index * 15
                          : step.arrowDirection === "right"
                          ? 28
                          : 28,
                      left:
                        step.arrowDirection === "right"
                          ? -20 - index * 15
                          : step.arrowDirection === "left"
                          ? 80 + index * 15
                          : 28,
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </motion.div>

              {/* Subtle Target Indicator Dot */}
              <motion.div
                key={`target-${step.id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="fixed z-[9999] pointer-events-none"
                style={{
                  top: targetRect.top + targetRect.height / 2 - 8,
                  left: targetRect.left + targetRect.width / 2 - 8,
                }}
              >
                <motion.div
                  className="w-4 h-4 bg-teal-400 rounded-full shadow-lg"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0.4, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 w-4 h-4 border-2 border-teal-400 rounded-full"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              </motion.div>
            </>
          )}

          {/* Tooltip Card */}
          <motion.div
            key={`tooltip-${step.id}`}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.4,
            }}
            className="fixed z-[10001] pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-sm"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              transformOrigin: tooltipPosition.transformOrigin,
            }}
          >
            {/* Compact Header with Gradient */}
            <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 p-4 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />
              </div>

              <div className="relative flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Compact Icon with Progress Ring */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    {/* Circular Progress Ring */}
                    {enableAutoPlay && (
                      <svg className="absolute inset-0 w-10 h-10 -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="18"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="2.5"
                          fill="none"
                        />
                        <motion.circle
                          cx="20"
                          cy="20"
                          r="18"
                          stroke="white"
                          strokeWidth="2.5"
                          fill="none"
                          strokeDasharray={113.1} // 2 * π * 18
                          initial={{ strokeDashoffset: 113.1 }}
                          animate={{
                            strokeDashoffset: isPlaying
                              ? 113.1 - (113.1 * progress) / 100
                              : 113.1,
                          }}
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                        />
                      </svg>
                    )}

                    <motion.div
                      className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </motion.div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-base leading-tight">
                        {step.title}
                      </h3>
                      {enableAutoPlay && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1 text-white/90 text-xs bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded-full"
                        >
                          <Zap className="w-3 h-3" />
                          <span className="font-medium text-[10px]">Auto</span>
                        </motion.div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-50 text-xs font-medium">
                        Step {currentStep + 1} of {TOUR_STEPS.length}
                      </span>
                      <div className="flex gap-1">
                        {TOUR_STEPS.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1 h-1 rounded-full transition-all duration-300 ${
                              idx === currentStep
                                ? "bg-white w-3"
                                : idx < currentStep
                                ? "bg-white/60"
                                : "bg-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Play/Pause Toggle */}
                  {enableAutoPlay && (
                    <motion.button
                      onClick={togglePlayPause}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-white/90 hover:text-white transition-all duration-200 hover:bg-white/20 rounded-lg p-1 bg-white/10 backdrop-blur-sm"
                      aria-label={
                        isPlaying ? "Pause auto-play" : "Resume auto-play"
                      }
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </motion.button>
                  )}

                  {/* Close/Skip Button */}
                  <button
                    onClick={handleSkip}
                    className="text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-lg p-1"
                    aria-label="Skip tour"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Compact Content */}
            <div className="p-4">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((currentStep + 1) / TOUR_STEPS.length) * 100
                      }%`,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500 rounded-full relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-medium text-xs h-8 px-3"
                >
                  Skip Tour
                </Button>

                <div className="flex items-center gap-1.5">
                  {!isFirstStep && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={
                        enableAutoPlay ? handleManualPrevious : handlePrevious
                      }
                      disabled={isTransitioning}
                      className="text-gray-700 border-gray-300 hover:bg-gray-50 font-medium text-xs h-8 px-3"
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      Back
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={enableAutoPlay ? handleManualNext : handleNext}
                    disabled={isTransitioning}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-xs h-8 px-4"
                  >
                    {isLastStep ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Finish
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
