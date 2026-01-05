"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Activity, Users } from "lucide-react";

const Hero = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const dashboardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        delay: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const avatarGradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-pink-400 to-rose-500",
    "bg-gradient-to-br from-amber-400 to-orange-500",
    "bg-gradient-to-br from-emerald-400 to-green-600",
  ];

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Sky blue gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-sky-100/80 via-sky-50/50 to-white"
        aria-hidden="true"
      />

      {/* Cloud-like decorative elements */}
      <div
        className="absolute top-20 left-10 w-64 h-32 bg-white/60 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-40 right-20 w-96 h-48 bg-white/50 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-40 left-1/4 w-80 h-40 bg-sky-100/40 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Text & CTAs */}
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Avatar Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 shadow-sm border border-slate-200/50">
              <div className="flex -space-x-2">
                {avatarGradients.map((bg, i) => (
                  <div
                    key={i}
                    className={`h-7 w-7 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-slate-600 ml-1">
                Trusted by 50+ hospitals
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight"
          >
            The Intelligent Hospital
            <br />
            <span className="text-slate-900">Management Platform</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg"
          >
            Bring every department, clinician and patient onto a single,
            AI-driven platform. Faster care. Fewer errors. Better outcomes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5">
              Request a Demo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

            <button className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5">
              Start a 6-Week Pilot
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          className="relative mt-16 lg:mt-20"
          variants={dashboardVariants}
          initial="hidden"
          animate="visible"
        >
          <div
            className="absolute -inset-x-10 top-10 h-full bg-gradient-to-b from-sky-200/30 to-transparent blur-3xl rounded-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/50">
              {/* Browser Chrome */}
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                {/* Navigation Tabs */}
                <div className="flex-1 flex items-center justify-center gap-1">
                  <div className="flex items-center bg-white rounded-lg px-1 py-1 shadow-sm border border-slate-100">
                    {[
                      "Dashboard",
                      "My Health",
                      "Appointments",
                      "Reports",
                      "Messages",
                    ].map((tab, i) => (
                      <button
                        key={tab}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          i === 0
                            ? "bg-medical text-white"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* User Avatar */}
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-medical to-medical-dark flex items-center justify-center text-white text-xs font-bold">
                    S
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-medium text-slate-700">
                      Dr. Sharma
                    </div>
                    <div className="text-[10px] text-slate-400">
                      General Physician
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-slate-50/30">
                {/* Welcome Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Welcome back, Dr. Sharma
                    </h2>
                    <p className="text-sm text-slate-500">
                      Today&apos;s patient queue, appointments, and AI insights
                      at a glance.
                    </p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-medical text-white text-sm font-medium hover:bg-medical-dark transition-colors flex items-center gap-2">
                    <span className="text-lg">+</span> New Appointment
                  </button>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>⚡ Filter</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    Monthly
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>📥</span> Download Summary
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-slate-500">
                    <span>🔍</span>
                    <span>⚙️ Customize View</span>
                  </div>
                </div>

                {/* Bento Grid - Top Row */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {/* Patient Queue */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Patient Queue
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Today&apos;s patients waiting. AI has flagged critical
                      cases for priority.
                    </p>
                    <a
                      href="#"
                      className="text-xs font-medium text-medical flex items-center gap-1 hover:underline"
                    >
                      View All Patients <ArrowRight className="h-3 w-3" />
                    </a>
                    <div className="mt-4 flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-slate-500">Seen Today: 18</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-slate-500">Waiting: 7</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Health Trend */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Health Trend
                    </h3>
                    <div className="flex items-end justify-center gap-2 h-20 mt-2">
                      {[40, 55, 35, 70, 50, 65, 80].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 1 + i * 0.08, duration: 0.5 }}
                          className={`w-4 rounded-t ${
                            i === 6 ? "bg-medical" : "bg-medical/30"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                      <span>Mon</span>
                      <span>Thu</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-2xl font-bold text-medical">
                        72%
                      </span>
                    </div>
                  </motion.div>

                  {/* AI Insights */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-medical rounded-xl p-4 shadow-sm text-white"
                  >
                    <h3 className="font-semibold mb-2">AI Insights</h3>
                    <p className="text-xs text-white/80 leading-relaxed">
                      3 patients show signs requiring follow-up. AI suggests
                      scheduling checkups for Mr. Patel (diabetes), Mrs. Gupta
                      (BP), and reviewing lab results for Room 204.
                    </p>
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Recent Activity
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Latest updates from your practice.
                    </p>
                    <div className="space-y-2">
                      {[
                        {
                          text: "Lab results uploaded - Room 108",
                          action: "View",
                          color: "text-medical",
                        },
                        {
                          text: "E-prescription sent to pharmacy",
                          action: "Track",
                          color: "text-emerald-600",
                        },
                        {
                          text: "Insurance claim auto-filed",
                          action: "Details",
                          color: "text-slate-500",
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-medical" />
                            <span className="text-slate-600">{item.text}</span>
                          </div>
                          <span className={`font-medium ${item.color}`}>
                            {item.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Bento Grid - Bottom Row */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Today's Appointments */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Today&apos;s Appointments
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-900">
                            Mrs. Priya Sharma
                          </div>
                          <div className="text-xs text-slate-500">
                            10:30 AM - Cardiology Follow-up
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                          Next
                        </span>
                      </div>
                      <div className="flex items-center gap-3 opacity-60">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-900">
                            Mr. Rajesh Kumar
                          </div>
                          <div className="text-xs text-slate-500">
                            11:15 AM - New Consult
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Revenue & Billing */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Revenue & Billing
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Auto-generated bills and claim status for today.
                    </p>
                    <div className="flex items-center gap-4 text-xs mb-2">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-medical" />
                        <span className="text-slate-500">Collected</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-mint" />
                        <span className="text-slate-500">Pending Claims</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ delay: 1.5, duration: 0.8 }}
                          className="h-full bg-medical rounded-full"
                        />
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "45%" }}
                          transition={{ delay: 1.6, duration: 0.8 }}
                          className="h-full bg-mint rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Staff on Duty */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Staff on Duty
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Your team members currently available.
                    </p>
                    <div className="space-y-3">
                      {[
                        {
                          name: "Nurse Anita",
                          role: "Ward A - General",
                          color: "from-blue-400 to-blue-600",
                        },
                        {
                          name: "Dr. Mehta",
                          role: "Radiology",
                          color: "from-pink-400 to-rose-500",
                        },
                      ].map((doc, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-full bg-gradient-to-br ${doc.color} flex items-center justify-center text-white text-xs font-bold`}
                          >
                            {doc.name.split(" ")[1]?.charAt(0) ||
                              doc.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-slate-900">
                              {doc.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {doc.role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
