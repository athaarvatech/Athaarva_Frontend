"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  HeartPulse, 
  Stethoscope, 
  Activity,
  Building2,
  Plus
} from "lucide-react";

const partners = [
  { 
    name: "Global Health Network", 
    icon: HeartPulse,
    color: "text-rose-500"
  },
  { 
    name: "Apex Clinics", 
    icon: Stethoscope,
    color: "text-blue-500"
  },
  { 
    name: "City Medical Center", 
    icon: Activity,
    color: "text-emerald-500"
  },
  { 
    name: "Metro Healthcare", 
    icon: Building2,
    color: "text-purple-500"
  },
  { 
    name: "Premier Hospital", 
    icon: Plus,
    color: "text-amber-500"
  },
  { 
    name: "CarePlus Network", 
    icon: HeartPulse,
    color: "text-teal-500"
  },
];

function TrustedPartnersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-16 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Trusted by Leading Healthcare Institutions
          </p>
        </motion.div>

        {/* Partners Logo Carousel */}
        <div className="relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          
          {/* Scrolling Container */}
          <motion.div
            animate={{
              x: [0, -1200],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
            className="flex space-x-12"
          >
            {/* Double the partners for seamless loop */}
            {[...partners, ...partners].map((partner, index) => (
              <motion.div
                key={`${partner.name}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + (index % partners.length) * 0.05 }}
                className="flex items-center space-x-3 bg-white rounded-xl px-6 py-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer flex-shrink-0"
              >
                <partner.icon className={`w-6 h-6 ${partner.color}`} />
                <span className="text-gray-700 font-medium whitespace-nowrap">{partner.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Static Grid (Alternative for smaller screens) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden sm:grid grid-cols-3 md:grid-cols-6 gap-6 mt-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <partner.icon className={`w-8 h-8 ${partner.color} mb-2`} />
              <span className="text-xs text-gray-600 font-medium text-center">{partner.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TrustedPartnersSection;
