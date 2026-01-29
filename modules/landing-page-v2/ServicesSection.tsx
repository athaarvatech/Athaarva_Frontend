"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  Calendar, 
  BarChart3, 
  MessageSquare,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Users
} from "lucide-react";

const services = [
  {
    icon: Calendar,
    title: "AI-Powered Scheduling",
    description: "Effortlessly integrate existing patient records and systems.",
    color: "emerald",
    features: ["Smart slot optimization", "Automated reminders", "Conflict detection"],
    link: "Learn More"
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "AI algorithms identify workflow bottlenecks and opportunities.",
    color: "blue",
    features: ["Patient flow prediction", "Resource allocation", "Trend analysis"],
    link: "Learn More"
  },
  {
    icon: MessageSquare,
    title: "Smart Patient Engagement",
    description: "Focus on patient outcomes with straight-to administrative.",
    color: "purple",
    features: ["Automated follow-ups", "Feedback collection", "Care coordination"],
    link: "Learn More"
  },
];

const detailedFeatures = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Effortlessly integrate existing patient records and systems.",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50"
  },
  {
    icon: Zap,
    title: "Automated Insights",
    description: "AI algorithms identify workflow bottlenecks and opportunities.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50"
  },
  {
    icon: TrendingUp,
    title: "Smart",
    description: "Focus on patient outcomes with streamlined administrative.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50"
  },
];

function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8f8f8_1px,transparent_1px),linear-gradient(to_bottom,#f8f8f8_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        {/* Main Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-100/50 relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${service.color}-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-${service.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-7 h-7 text-${service.color}-600`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 bg-${service.color}-500 rounded-full mr-2`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Link */}
                  <a href="#" className={`inline-flex items-center text-${service.color}-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300`}>
                    {service.link}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-50 rounded-3xl p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {detailedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
                className="flex items-start space-x-4 group cursor-pointer"
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text`} 
                    style={{ color: index === 0 ? '#8b5cf6' : index === 1 ? '#f59e0b' : '#10b981' }}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <a href="#" className="inline-flex items-center text-emerald-600 font-medium text-sm mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Learn More
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesSection;
