"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  User,
  Calendar,
  Activity,
  MessageSquare
} from "lucide-react";

interface ProductDemoSectionProps {
  onDemoClick: () => void;
}

const demoScreenshots = [
  {
    title: "Doctor Dashboard",
    description: "Comprehensive overview of daily schedules, patient notifications, and performance metrics",
    image: "/demo/doctor-dashboard.jpg",
    icon: User,
  },
  {
    title: "Appointment Calendar",
    description: "Intelligent scheduling system with drag-and-drop functionality and automated reminders",
    image: "/demo/calendar-view.jpg",
    icon: Calendar,
  },
  {
    title: "Patient Portal",
    description: "User-friendly interface for appointment booking, medical records, and communication",
    image: "/demo/patient-portal.jpg",
    icon: Smartphone,
  },
  {
    title: "AI Analytics",
    description: "Advanced insights dashboard with predictive analytics and trend analysis",
    image: "/demo/analytics-dashboard.jpg",
    icon: Activity,
  },
];

function ProductDemoSection({ onDemoClick }: ProductDemoSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % demoScreenshots.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + demoScreenshots.length) % demoScreenshots.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-healthcare-cool-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Your Entire Hospital,
            <span className="bg-gradient-to-r from-healthcare-primary to-healthcare-teal bg-clip-text text-transparent">
              {" "}One Dashboard Away
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of hospital management with our intuitive interface 
            designed for healthcare professionals by healthcare professionals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Demo Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              {/* Video Demo */}
              <div className="bg-gradient-to-br from-healthcare-primary to-healthcare-teal rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                      <Play className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Interactive Product Demo</h3>
                      <p className="text-white/80">Watch Healthcare in action</p>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 cursor-pointer group" onClick={onDemoClick}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-colors duration-300"
                    >
                      <Play className="w-12 h-12 text-white" />
                    </motion.div>
                  </div>
                  
                  <button
                    onClick={onDemoClick}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-4 font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    Watch Full Demo (3 mins)
                  </button>
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900">What you&apos;ll see in the demo:</h4>
                <div className="space-y-3">
                  {[
                    "Doctor onboarding and profile setup",
                    "Patient appointment scheduling flow",
                    "Real-time dashboard updates",
                    "Telehealth consultation setup",
                    "AI-powered insights generation"
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-6 h-6 bg-healthcare-primary/10 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-healthcare-primary rounded-full" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Screenshots Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Device Selection */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200 flex space-x-2">
                {[
                  { key: 'desktop' as const, icon: Monitor, label: 'Desktop' },
                  { key: 'tablet' as const, icon: Tablet, label: 'Tablet' },
                  { key: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
                ].map((device) => (
                  <button
                    key={device.key}
                    onClick={() => setActiveDevice(device.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      activeDevice === device.key
                        ? 'bg-healthcare-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <device.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{device.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Screenshot Carousel */}
            <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
              <div className="relative overflow-hidden rounded-2xl">
                {/* Screenshot Display */}
                <div className={`aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center relative ${
                  activeDevice === 'mobile' ? 'aspect-[9/16] max-w-sm mx-auto' :
                  activeDevice === 'tablet' ? 'aspect-[4/3]' : 'aspect-video'
                }`}>
                  {/* Placeholder for actual screenshots */}
                  <div className="text-center">
                    {React.createElement(demoScreenshots[activeSlide].icon, {
                      className: "w-16 h-16 text-healthcare-primary mx-auto mb-4"
                    })}
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {demoScreenshots[activeSlide].title}
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      {demoScreenshots[activeSlide].description}
                    </p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-300 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-300 shadow-lg"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {demoScreenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeSlide
                        ? 'bg-healthcare-primary scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Feature Tags */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['AI-Powered', 'Real-time', 'Mobile-First', 'Cloud-Based'].map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-healthcare-primary/10 text-healthcare-primary rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 text-center"
            >
              <button
                onClick={onDemoClick}
                className="px-8 py-4 bg-gradient-to-r from-healthcare-primary to-healthcare-teal text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-healthcare-primary/25 transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Schedule Personal Demo</span>
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Get a customized walkthrough for your hospital
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProductDemoSection;
