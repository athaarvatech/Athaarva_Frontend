"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  MonitorSpeaker, 
  Calendar, 
  Brain, 
  Video,
  ChevronRight,
  Sparkles,
  Users,
  BarChart3,
  Stethoscope
} from "lucide-react";

const features = [
  {
    icon: MonitorSpeaker,
    title: "Smart Doctor & Patient Dashboards",
    description: "Intuitive, role-based dashboards with real-time insights and seamless navigation for doctors and patients alike.",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
  },
  {
    icon: Calendar,
    title: "End-to-End Appointment & Scheduling",
    description: "Complete appointment management system with automated reminders, waitlist handling, and calendar integration.",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    hoverColor: "hover:bg-emerald-100",
  },
  {
    icon: Brain,
    title: "AI-Powered Analytics & Insights",
    description: "Advanced analytics engine providing predictive insights, patient trends, and operational efficiency metrics.",
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
  },
  {
    icon: Video,
    title: "Built-in Telehealth & Mentorship Tools",
    description: "Integrated video consultation platform with mentorship programs and remote patient monitoring capabilities.",
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
  },
];

function FeatureHighlights() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-healthcare-cool-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-healthcare-primary mr-2" />
            <p className="text-healthcare-primary font-semibold text-sm uppercase tracking-wider">
              Core Features
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Everything Your Hospital Needs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From patient onboarding to discharge, Healthcare streamlines every aspect 
            of hospital operations with cutting-edge technology.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className={`${feature.bgColor} ${feature.hoverColor} rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 border border-gray-100 relative overflow-hidden`}>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className={`w-full h-full rounded-full bg-gradient-to-r ${feature.color} transform translate-x-8 -translate-y-8`} />
                </div>
                
                {/* Feature Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transform transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-healthcare-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  {/* Learn More Link */}
                  <div className="flex items-center text-healthcare-primary font-semibold group-hover:translate-x-2 transform transition-transform duration-300 cursor-pointer">
                    <span>Learn More</span>
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <div className="text-center group">
              <div className="bg-healthcare-primary/10 rounded-2xl p-6 mb-4 group-hover:bg-healthcare-primary/20 transition-colors duration-300">
                <Users className="w-10 h-10 text-healthcare-primary mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Multi-User Access</h4>
              <p className="text-gray-600">Role-based permissions for doctors, nurses, admin staff, and patients</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-healthcare-primary/10 rounded-2xl p-6 mb-4 group-hover:bg-healthcare-primary/20 transition-colors duration-300">
                <BarChart3 className="w-10 h-10 text-healthcare-primary mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Real-time Analytics</h4>
              <p className="text-gray-600">Live operational metrics and performance dashboards</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-healthcare-primary/10 rounded-2xl p-6 mb-4 group-hover:bg-healthcare-primary/20 transition-colors duration-300">
                <Stethoscope className="w-10 h-10 text-healthcare-primary mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Clinical Workflows</h4>
              <p className="text-gray-600">Streamlined processes from admission to discharge</p>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mt-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="px-8 py-4 bg-gradient-to-r from-healthcare-primary to-healthcare-teal text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-healthcare-primary/25 transition-all duration-300">
                Explore All Features
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeatureHighlights;
