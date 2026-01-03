"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { 
  Database, 
  Brain, 
  Lightbulb, 
  HeartHandshake,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    number: "1",
    icon: Database,
    title: "Data Unification",
    description: "Effortlessly integrate existing patient records and systems.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    link: "Learn More"
  },
  {
    number: "2",
    icon: Brain,
    title: "Intelligent Analysis",
    description: "AI algorithms identify workflow bottlenecks and opportunities.",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
    link: "Learn More"
  },
  {
    number: "3",
    icon: Lightbulb,
    title: "Automated Insights",
    description: "Receive actionable recommendations for staff and resource allocation.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    link: "Learn More"
  },
  {
    number: "4",
    icon: HeartHandshake,
    title: "Enhanced Care",
    description: "Focus on patient outcomes with streamlined administrative tasks.",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50",
    link: "Learn More"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

function AIDifferenceSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700">THE ATHAARVA AI DIFFERENCE</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How We Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Healthcare Operations
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform works seamlessly to optimize every aspect of your hospital management
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/50 relative overflow-hidden">
                {/* Number Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`text-5xl font-bold bg-gradient-to-br ${feature.color} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-300`}>
                    {feature.number}
                  </span>
                </div>
                
                {/* Icon */}
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : '#f43f5e' }} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Link */}
                <a href="#" className="inline-flex items-center text-emerald-600 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                  {feature.link}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "30%", label: "Increase in Efficiency" },
              { value: "50%", label: "Reduction in Wait Times" },
              { value: "99.9%", label: "System Uptime" },
              { value: "24/7", label: "AI-Powered Support" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AIDifferenceSection;
