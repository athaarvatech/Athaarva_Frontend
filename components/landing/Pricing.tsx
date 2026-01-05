"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: number;
  yearlyPrice: number;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  isPopular: boolean;
}

const plans: Plan[] = [
  {
    name: "STANDARD",
    price: 29,
    yearlyPrice: 23,
    period: "per month",
    features: [
      "Patient Data Management",
      "Appointment Scheduling",
      "Basic Billing & Claims",
      "Email Support",
      "2 Staff Accounts",
      "Mobile App Access",
    ],
    description: "Perfect for small healthcare practices",
    buttonText: "Start Free Trial",
    isPopular: false,
  },
  {
    name: "ENTERPRISE",
    price: 199,
    yearlyPrice: 159,
    period: "per month",
    features: [
      "Everything in Standard, plus:",
      "Custom Integrations (EHR, Labs)",
      "AI Analytics & Insights",
      "Auto Website Builder",
      "Telehealth & Video Consultations",
      "Priority Support & SLAs",
      "Unlimited Staff Accounts",
      "Digital Hospital Twin",
      "Advanced Security & Compliance",
    ],
    description: "Best for large hospital networks",
    buttonText: "Request Demo",
    isPopular: true,
  },
];

interface AnimatedPriceProps {
  value: number;
}

function AnimatedPrice({ value }: AnimatedPriceProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(
        startValue + (endValue - startValue) * easeOut
      );
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>${displayValue}</span>;
}

interface PricingProps {
  className?: string;
}

export function Pricing({ className }: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = async (checked: boolean) => {
    setIsMonthly(!checked);

    if (checked && switchRef.current) {
      try {
        const confetti = (await import("canvas-confetti")).default;
        const rect = switchRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
          colors: ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981"],
          ticks: 200,
          gravity: 1.2,
          decay: 0.94,
          startVelocity: 30,
          shapes: ["circle"],
        });
      } catch {
        // Confetti not loaded, fail silently
      }
    }
  };

  return (
    <section
      id="pricing"
      className={cn("relative py-24 lg:py-32 overflow-hidden", className)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-slate-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-100 mb-6">
            <Zap className="h-4 w-4 text-blue-500" />
            <span>Simple pricing, no hidden fees</span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Choose Your <span className="text-blue-600">Plan</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
            Start small. Scale as you grow. All plans include 14-day free trial,
            no credit card required.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          className="flex justify-center items-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span
            className={cn(
              "text-sm font-medium",
              isMonthly ? "text-slate-900" : "text-slate-400"
            )}
          >
            Monthly
          </span>
          <button
            ref={switchRef}
            onClick={() => handleToggle(!isMonthly)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              !isMonthly ? "bg-blue-600" : "bg-slate-200"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                !isMonthly ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium",
              !isMonthly ? "text-slate-900" : "text-slate-400"
            )}
          >
            Annual
          </span>
          <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            Save 20%
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={cn(
                "relative rounded-2xl p-6 lg:p-8",
                plan.isPopular
                  ? "bg-white border-2 border-blue-200 shadow-xl"
                  : "bg-white border border-slate-200 shadow-sm"
              )}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <p
                className={cn(
                  "text-sm font-semibold uppercase tracking-wide",
                  plan.isPopular ? "text-blue-600" : "text-slate-500"
                )}
              >
                {plan.name}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight text-slate-900">
                  <AnimatedPrice
                    value={isMonthly ? plan.price : plan.yearlyPrice}
                  />
                </span>
                <span className="text-sm text-slate-500">/ {plan.period}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {isMonthly ? "billed monthly" : "billed annually"}
              </p>

              {/* Features */}
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-emerald-500" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <hr className="my-6 border-slate-200" />

              {/* CTA Button */}
              <button
                className={cn(
                  "w-full py-3 px-4 rounded-lg font-semibold transition-colors",
                  plan.isPopular
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                )}
              >
                {plan.buttonText}
              </button>

              {/* Description */}
              <p className="mt-4 text-xs text-center text-slate-400">
                {plan.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-slate-500">
            Need a custom solution?{" "}
            <a
              href="#contact"
              className="text-blue-600 font-medium hover:text-blue-700 underline underline-offset-4"
            >
              Contact our sales team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Pricing;
