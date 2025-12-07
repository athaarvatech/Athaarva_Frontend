"use client";

import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  Activity, 
  Calendar, 
  Users, 
  FileText,
  Bell,
  TrendingUp,
  Shield,
  CheckCircle2
} from "lucide-react";

function ProductShowcase() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, -5]);

  const features = [
    { icon: Calendar, label: "Appointments", color: "text-emerald-600", bgColor: "bg-emerald-100" },
    { icon: Users, label: "Patients", color: "text-blue-600", bgColor: "bg-blue-100" },
    { icon: FileText, label: "Records", color: "text-purple-600", bgColor: "bg-purple-100" },
    { icon: Bell, label: "Alerts", color: "text-amber-600", bgColor: "bg-amber-100" },
  ];

  return (
    <section ref={containerRef} className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Product Preview */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <motion.div 
              style={{ y, rotate }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-blue-500/20 rounded-3xl blur-2xl opacity-60" />
              
              {/* Dashboard Preview */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
                {/* Browser Header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <div className="flex-1 bg-white rounded-lg px-4 py-1.5 text-xs text-gray-500 ml-4">
                    dashboard.athaarva.com
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Athaarva</h4>
                        <p className="text-xs text-gray-500">Hospital Dashboard</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-3 text-center hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className={`w-8 h-8 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <feature.icon className={`w-4 h-4 ${feature.color}`} />
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{feature.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-2xl p-4 mb-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900 text-sm">Patient Analytics</h5>
                      <span className="text-xs text-emerald-600 font-medium flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +23% this week
                      </span>
                    </div>
                    <div className="flex items-end justify-between h-24 space-x-2">
                      {[35, 55, 40, 70, 50, 85, 60, 75, 45, 90, 65, 80].map((height, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={isInView ? { height: `${height}%` } : {}}
                          transition={{ duration: 0.6, delay: 0.6 + index * 0.05 }}
                          className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Recent Activity */}
                  <div className="space-y-2">
                    {[
                      { text: "Dr. Sharma completed 5 consultations", time: "Just now", status: "success" },
                      { text: "New appointment request from patient", time: "2 min ago", status: "pending" },
                      { text: "Lab results uploaded for Patient #1234", time: "5 min ago", status: "info" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'success' ? 'bg-green-500' : 
                            item.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <span className="text-sm text-gray-700">{item.text}</span>
                        </div>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">HIPAA Compliant</p>
                  <p className="text-xs text-gray-500">Enterprise Security</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-700">PRODUCT SHOWCASE</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Powerful Dashboard for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Complete Control
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our intuitive dashboard gives you real-time insights into your hospital operations, 
              patient flow, and staff performance—all in one place.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {[
                "Real-time patient analytics and trends",
                "Automated appointment scheduling",
                "Integrated billing and payments",
                "Staff performance monitoring",
                "Custom reports and insights"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-500/25"
            >
              Start Free Trial
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProductShowcase;
