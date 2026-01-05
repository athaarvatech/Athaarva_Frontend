"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import {
  Brain,
  Stethoscope,
  FlaskConical,
  Receipt,
  Pill,
  Tablet,
  Globe,
  Code2,
  Monitor,
  UserPlus,
  Bot,
  UserCheck,
  CreditCard,
  ArrowRight,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface Satellite {
  id: string;
  label: string;
  icon: LucideIcon;
  angle: number;
  color: string;
  energy: number;
}

const IntelligenceHub = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  const satellites: Satellite[] = [
    {
      id: "triage",
      label: "Triage",
      icon: Stethoscope,
      angle: -45,
      color: "#3FA2F6",
      energy: 95,
    },
    {
      id: "labs",
      label: "Labs",
      icon: FlaskConical,
      angle: 45,
      color: "#6EE7B7",
      energy: 88,
    },
    {
      id: "billing",
      label: "Billing",
      icon: Receipt,
      angle: 135,
      color: "#FBBF24",
      energy: 92,
    },
    {
      id: "pharmacy",
      label: "Pharmacy",
      icon: Pill,
      angle: 225,
      color: "#F472B6",
      energy: 85,
    },
  ];

  const generatePath = (angle: number, radius: number = 120) => {
    const centerX = 200;
    const centerY = 150;
    const radians = (angle * Math.PI) / 180;
    const endX = centerX + radius * Math.cos(radians);
    const endY = centerY + radius * Math.sin(radians);

    const cp1X = centerX + radius * 0.4 * Math.cos(radians - 0.3);
    const cp1Y = centerY + radius * 0.4 * Math.sin(radians - 0.3);
    const cp2X = centerX + radius * 0.7 * Math.cos(radians + 0.2);
    const cp2Y = centerY + radius * 0.7 * Math.sin(radians + 0.2);

    return {
      path: `M ${centerX} ${centerY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`,
      endX,
      endY,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[400px] lg:min-h-[450px] p-6 lg:p-8 flex flex-col"
    >
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 mb-3">
          <Brain className="h-3.5 w-3.5" />
          <span>AI-Powered Core</span>
        </div>
        <h3 className="font-display text-xl lg:text-2xl font-bold text-slate-900">
          Athaarva Intelligence Engine
        </h3>
        <p className="mt-2 text-sm text-slate-500 max-w-sm">
          Real-time data synchronization across every department.
        </p>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full max-w-[400px] max-h-[300px]"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0F67B1" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#3FA2F6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0F67B1" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="particleGradient">
              <stop offset="0%" stopColor="#3FA2F6" />
              <stop offset="100%" stopColor="#0F67B1" />
            </radialGradient>
            <radialGradient id="coreGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#3FA2F6" />
              <stop offset="100%" stopColor="#0F67B1" />
            </radialGradient>
          </defs>

          {satellites.map((sat, index) => {
            const { path } = generatePath(sat.angle);
            return (
              <g key={sat.id}>
                <motion.path
                  d={path}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5 + index * 0.15 }}
                />
                <motion.circle
                  r="4"
                  fill="url(#particleGradient)"
                  filter="url(#glow)"
                  initial={{ opacity: 0 }}
                  animate={
                    isInView ? { opacity: [0, 1, 1, 0.7, 0], r: [4, 5, 4] } : {}
                  }
                  transition={{
                    duration: 2,
                    delay: 1.5 + index * 0.3,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${1.5 + index * 0.3}s`}
                    path={path}
                  />
                </motion.circle>
              </g>
            );
          })}

          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.circle
              cx="200"
              cy="150"
              r="45"
              fill="none"
              stroke="#0F67B1"
              strokeWidth="1"
              opacity="0.3"
              animate={{
                r: [45, 60, 45],
                opacity: [0.4, 0.1, 0.4],
                strokeWidth: [1, 0.5, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx="200"
              cy="150"
              r="38"
              fill="none"
              stroke="#3FA2F6"
              strokeWidth="2"
              strokeDasharray="10 5"
              opacity="0.4"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "200px 150px" }}
            />
            <circle
              cx="200"
              cy="150"
              r="30"
              fill="url(#coreGradient)"
              filter="url(#glow)"
            />
            <text
              x="200"
              y="156"
              textAnchor="middle"
              fill="white"
              fontSize="20"
              fontWeight="bold"
            >
              AI
            </text>
          </motion.g>

          {satellites.map((sat, index) => {
            const { endX, endY } = generatePath(sat.angle);
            const isHovered = hoveredNode === sat.id;
            return (
              <motion.g
                key={sat.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                onMouseEnter={() => setHoveredNode(sat.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: "pointer" }}
              >
                <motion.circle
                  cx={endX}
                  cy={endY}
                  r="28"
                  fill="white"
                  stroke={sat.color}
                  strokeWidth={isHovered ? 3 : 2}
                  filter="url(#glow)"
                />
                <text
                  x={endX}
                  y={endY + 45}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="11"
                  fontWeight="500"
                >
                  {sat.label}
                </text>
              </motion.g>
            );
          })}
        </svg>

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-full max-w-[400px] h-full max-h-[300px]">
            {satellites.map((sat) => {
              const radians = (sat.angle * Math.PI) / 180;
              const x = 50 + 30 * Math.cos(radians);
              const y = 50 + 40 * Math.sin(radians);
              const IconComponent = sat.icon;
              return (
                <div
                  key={sat.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onMouseEnter={() => setHoveredNode(sat.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <IconComponent
                    className="h-5 w-5"
                    style={{ color: sat.color }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorWorkspace = () => {
  return (
    <div className="relative h-full min-h-[400px] p-6 lg:p-8 flex flex-col">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 mb-3">
          <Tablet className="h-3.5 w-3.5" />
          <span>UI/UX Focus</span>
        </div>
        <h3 className="font-display text-xl lg:text-2xl font-bold text-slate-900">
          Clinician-First Interface
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Designed with doctors, for doctors. Zero learning curve.
        </p>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        <div className="relative w-full max-w-[280px]">
          <div className="relative bg-slate-900 rounded-[24px] p-2 shadow-2xl">
            <div className="relative bg-white rounded-[16px] overflow-hidden aspect-[3/4]">
              <div className="absolute inset-0 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="h-2.5 w-20 rounded bg-slate-200" />
                      <div className="h-2 w-14 rounded bg-slate-100 mt-1" />
                    </div>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-emerald-100" />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["♥️ 72", "98%", "120/80"].map((val, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 rounded-lg p-2 text-center"
                    >
                      <div className="text-xs font-semibold text-slate-700">
                        {val}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-xl p-3 mb-4">
                  <div className="h-2 w-16 rounded bg-slate-200 mb-2" />
                  <div className="flex items-end gap-1 h-16">
                    {[30, 45, 35, 60, 50, 70, 55, 65, 45, 75].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-blue-400 to-blue-200"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-12 rounded bg-slate-200" />
                  <div className="h-2 w-full rounded bg-slate-100" />
                  <div className="h-2 w-4/5 rounded bg-slate-100" />
                  <div className="h-2 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, transparent 100%)",
                }}
              />
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-slate-900/20 blur-xl rounded-full" />
        </div>
      </div>
    </div>
  );
};

const WebsiteBuilder = () => {
  return (
    <div className="relative h-full min-h-[320px] p-6 flex flex-col">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600 mb-3">
          <Globe className="h-3.5 w-3.5" />
          <span>New Feature</span>
        </div>
        <h3 className="font-display text-lg lg:text-xl font-bold text-slate-900">
          Instant Hospital Website
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Launch your clinic&apos;s digital front door in minutes, not months.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-4 w-full max-w-xs">
          <motion.div
            className="flex-1 bg-slate-50 rounded-xl p-4 text-center border-2 border-dashed border-slate-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-10 w-10 rounded-lg bg-slate-200 mx-auto mb-3 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-slate-400" />
            </div>
            <span className="text-xs font-medium text-slate-400 line-through">
              No Code
            </span>
          </motion.div>

          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="h-5 w-5 text-blue-600" />
          </motion.div>

          <motion.div
            className="flex-1 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <div className="bg-slate-100 px-2 py-1.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            </div>
            <div className="p-3">
              <div className="h-2 w-12 rounded bg-blue-200 mb-2" />
              <div className="h-1.5 w-full rounded bg-slate-100 mb-1" />
              <div className="h-1.5 w-3/4 rounded bg-slate-100 mb-2" />
              <div className="h-6 w-14 rounded-full bg-blue-100 mx-auto" />
            </div>
            <div className="px-2 pb-2">
              <Monitor className="h-4 w-4 text-emerald-500 mx-auto" />
            </div>
          </motion.div>
        </div>
      </div>

      <Sparkles className="absolute top-4 right-4 h-5 w-5 text-purple-300" />
    </div>
  );
};

interface WorkflowStep {
  icon: LucideIcon;
  label: string;
  color: string;
}

const WorkflowPipeline = () => {
  const steps: WorkflowStep[] = [
    {
      icon: UserPlus,
      label: "Patient Intake",
      color: "bg-blue-100 text-blue-600",
    },
    { icon: Bot, label: "AI Triage", color: "bg-purple-100 text-purple-600" },
    {
      icon: Stethoscope,
      label: "Doctor Consult",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: CreditCard,
      label: "Auto-Billing",
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="relative h-full min-h-[280px] p-6 lg:p-8 flex flex-col bg-slate-50 rounded-3xl">
      <div className="mb-6">
        <h3 className="font-display text-lg lg:text-xl font-bold text-slate-900">
          From Diagnosis to Discharge
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Seamless patient journey, automated at every step.
        </p>
      </div>

      <div className="flex-1 flex items-center">
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[500px] gap-2">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <React.Fragment key={step.label}>
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className={`h-14 w-14 rounded-2xl ${step.color} flex items-center justify-center shadow-sm`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 text-center whitespace-nowrap">
                      {step.label}
                    </span>
                  </motion.div>

                  {index < steps.length - 1 && (
                    <motion.div
                      className="flex-1 flex items-center justify-center px-2"
                      initial={{ opacity: 0, scaleX: 0 }}
                      whileInView={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 0.3 + index * 0.15 }}
                      viewport={{ once: true }}
                    >
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 relative">
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-medical"
                          animate={{ left: ["0%", "100%"] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 2,
                            delay: index * 0.5,
                          }}
                        />
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 ml-1" />
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const cardBaseClass =
    "bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]";

  return (
    <section
      id="features"
      className="relative py-24 lg:py-32 bg-slate-50 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15,103,177) 1px, transparent 0)`,
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Built for the{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Future of Healthcare
            </span>
          </h2>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            Athaarva combines clinical precision with operational simplicity.
            All in one OS.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className={`col-span-12 md:col-span-7 ${cardBaseClass}`}
            variants={itemVariants}
          >
            <IntelligenceHub />
          </motion.div>

          <motion.div
            className={`col-span-12 md:col-span-5 ${cardBaseClass}`}
            variants={itemVariants}
          >
            <DoctorWorkspace />
          </motion.div>

          <motion.div
            className={`col-span-12 md:col-span-4 ${cardBaseClass}`}
            variants={itemVariants}
          >
            <WebsiteBuilder />
          </motion.div>

          <motion.div
            className={`col-span-12 md:col-span-8 ${cardBaseClass} !bg-transparent !shadow-none !border-0`}
            variants={itemVariants}
          >
            <WorkflowPipeline />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
