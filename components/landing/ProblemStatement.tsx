"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Clock,
  CalendarX,
  AlertCircle,
  Database,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

interface Problem {
  problem: string;
  stat: string;
  impact: string;
  category: string;
  Icon: LucideIcon;
}

const problems: Problem[] = [
  {
    problem: "Doctors waste 6 hours daily on fragmented systems.",
    stat: "73%",
    impact: "Clinical Burnout Rate",
    category: "Clinical Operations",
    Icon: Stethoscope,
  },
  {
    problem: "Insurance claims take 45+ days to process manually.",
    stat: "45+",
    impact: "Days Revenue Locked",
    category: "Revenue Cycle",
    Icon: Clock,
  },
  {
    problem: "30% of patients miss appointments due to poor communication.",
    stat: "30%",
    impact: "Lost Appointments",
    category: "Patient Engagement",
    Icon: CalendarX,
  },
  {
    problem: "Hospital staff juggle 8 different systems for basic tasks.",
    stat: "8+",
    impact: "Disconnected Tools",
    category: "Workflow Efficiency",
    Icon: AlertCircle,
  },
  {
    problem: "Data silos delay critical treatment decisions by hours.",
    stat: "6hrs",
    impact: "Treatment Delays",
    category: "Data Integration",
    Icon: Database,
  },
];

interface AnimatedBadgeProps {
  text?: string;
  color?: string;
}

function AnimatedBadge({
  text = "The Reality of Modern Healthcare",
  color = "#ef4444",
}: AnimatedBadgeProps) {
  const hexToRgba = (hexColor: string, alpha: number) => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
      viewport={{ once: true }}
      className="group relative inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700 shadow-sm"
    >
      <div
        className="relative flex h-1.5 w-1.5 items-center justify-center rounded-full"
        style={{ backgroundColor: hexToRgba(color, 0.4) }}
      >
        <div
          className="flex h-2 w-2 animate-ping items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute top-1/2 left-1/2 flex h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ backgroundColor: hexToRgba(color, 0.8) }}
        />
      </div>
      <div className="mx-2 h-4 w-px bg-slate-200" />
      <span className="text-xs font-medium">{text}</span>
      <ChevronRight className="ml-1 h-3.5 w-3.5 text-slate-400" />
    </motion.div>
  );
}

interface ProblemCardProps {
  problem: Problem;
  isActive: boolean;
}

function ProblemCard({ problem, isActive }: ProblemCardProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 40,
        scale: isActive ? 1 : 0.96,
        filter: isActive ? "blur(0px)" : "blur(10px)",
      }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="mb-6 md:mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <span className="inline-flex items-center gap-2 text-xs font-mono border border-red-200 bg-red-50 rounded-full px-3 py-1 text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {problem.category}
        </span>
      </motion.div>

      <motion.blockquote
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[1.2] text-slate-800 mb-8 md:mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {problem.problem.split(" ").map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.3em]"
            initial={{ opacity: 0, y: 20, rotateX: 90 }}
            animate={{
              opacity: isActive ? 1 : 0,
              y: isActive ? 0 : 20,
              rotateX: isActive ? 0 : 90,
            }}
            transition={{
              duration: 0.5,
              delay: isActive ? i * 0.04 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.blockquote>

      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <motion.div
          className="w-8 h-px bg-red-500 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        />
        <div>
          <p className="text-4xl md:text-5xl font-bold text-red-500">
            {problem.stat}
          </p>
          <p className="text-sm text-slate-500 mt-1">{problem.impact}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const ProblemStatement = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const scrollCooldownRef = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current || hasCompleted) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const isInView =
        rect.top <= viewportHeight * 0.2 && rect.bottom >= viewportHeight * 0.5;

      if (isInView) {
        const isScrollingDown = e.deltaY > 0;

        if (isScrollingDown && activeIndex < problems.length - 1) {
          e.preventDefault();
          e.stopPropagation();

          if (!scrollCooldownRef.current) {
            scrollCooldownRef.current = true;
            setActiveIndex((prev) => prev + 1);

            setTimeout(() => {
              scrollCooldownRef.current = false;
            }, 700);
          }
        } else if (isScrollingDown && activeIndex === problems.length - 1) {
          setHasCompleted(true);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    return () =>
      window.removeEventListener("wheel", handleWheel, { capture: true });
  }, [activeIndex, hasCompleted]);

  const goNext = () => {
    if (activeIndex < problems.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-slate-50 py-24 lg:py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(100,116,139) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <motion.div
          className="mx-auto max-w-4xl px-6 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <AnimatedBadge
            text="The Reality of Modern Healthcare"
            color="#ef4444"
          />

          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl mt-8">
            Broken Systems.{" "}
            <span className="text-red-500">Burnt Out Teams.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            These aren&apos;t edge cases—they&apos;re everyday realities in
            hospitals across India.
          </p>
        </motion.div>

        <div className="relative w-full max-w-5xl mx-auto px-6">
          <motion.div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 text-[12rem] md:text-[20rem] lg:text-[28rem] font-bold text-red-500/[0.04] select-none pointer-events-none leading-none tracking-tighter">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <div className="relative flex flex-col md:flex-row w-full">
            <div className="hidden md:flex flex-col items-center justify-center pr-12 lg:pr-16 border-r border-slate-200">
              <motion.span
                className="text-xs font-mono text-slate-400 tracking-widest uppercase"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
              >
                Problems
              </motion.span>
              <div className="relative h-32 w-px bg-slate-200 mt-8">
                <motion.div
                  className="absolute top-0 left-0 w-full bg-red-500 origin-top"
                  animate={{
                    height: `${((activeIndex + 1) / problems.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="text-xs font-mono text-slate-400 mt-4">
                {String(activeIndex + 1).padStart(2, "0")}/
                {String(problems.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex-1 md:pl-12 lg:pl-16 py-8 md:py-12 relative min-h-[400px]">
              {problems.map((problem, index) => (
                <ProblemCard
                  key={index}
                  problem={problem}
                  isActive={index === activeIndex}
                />
              ))}

              <div className="absolute bottom-0 right-0 flex items-center gap-4">
                <motion.button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={goNext}
                  disabled={activeIndex === problems.length - 1}
                  className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-20 overflow-hidden opacity-[0.06] pointer-events-none">
          <motion.div
            className="flex whitespace-nowrap text-4xl md:text-6xl font-bold text-slate-900"
            animate={{ x: [0, -1500] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(5)].map((_, i) => (
              <span key={i} className="mx-8">
                Burnout • Fragmented Data • Slow Claims • No-Shows •
                Disconnected Tools • Manual Processes •
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;
