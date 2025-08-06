"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Tablet, 
  Monitor,
  Download,
  Wifi,
  Zap,
  User,
  Calendar,
  MessageSquare,
  Activity,
  Bell,
  Search,
  Users
} from "lucide-react";

const deviceFeatures = {
  mobile: [
    {
      title: "Quick Appointments",
      description: "Book and manage appointments on the go",
      icon: Calendar
    },
    {
      title: "Instant Notifications",
      description: "Real-time alerts for appointments and updates",
      icon: Bell
    },
    {
      title: "Patient Chat",
      description: "Secure messaging with healthcare providers",
      icon: MessageSquare
    },
    {
      title: "Health Records",
      description: "Access complete medical history anytime",
      icon: User
    }
  ],
  tablet: [
    {
      title: "Doctor Dashboard",
      description: "Comprehensive patient management interface",
      icon: Monitor
    },
    {
      title: "Digital Prescriptions",
      description: "Create and send prescriptions digitally",
      icon: Activity
    },
    {
      title: "Patient Search",
      description: "Quickly find and access patient records",
      icon: Search
    },
    {
      title: "Appointment Flow",
      description: "Streamlined consultation workflow",
      icon: Zap
    }
  ]
};

function MobileShowcaseSection() {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet'>('mobile');

  return (
    <section className="py-24 bg-gradient-to-br from-healthcare-primary via-healthcare-teal to-healthcare-secondary overflow-hidden">
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
            <Smartphone className="w-6 h-6 text-white/80 mr-2" />
            <p className="text-white/80 font-semibold text-sm uppercase tracking-wider">
              Mobile-First Design
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Built for Any Device
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Desktop, Tablet, Mobile
            </span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Healthcare adapts beautifully to any screen size. Whether you&apos;re on your phone, 
            tablet, or desktop, enjoy the same powerful features with an optimized experience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Device Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Device Selection */}
            <div className="flex justify-center mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20 flex space-x-2">
                <button
                  onClick={() => setActiveDevice('mobile')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeDevice === 'mobile'
                      ? 'bg-white text-healthcare-primary'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="font-medium">Mobile</span>
                </button>
                <button
                  onClick={() => setActiveDevice('tablet')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeDevice === 'tablet'
                      ? 'bg-white text-healthcare-primary'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Tablet className="w-5 h-5" />
                  <span className="font-medium">Tablet</span>
                </button>
              </div>
            </div>

            {/* Device Mockups */}
            <div className="relative flex justify-center">
              {/* Mobile Device */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: activeDevice === 'mobile' ? 1 : 0.3,
                  scale: activeDevice === 'mobile' ? 1 : 0.8,
                  x: activeDevice === 'mobile' ? 0 : -50
                }}
                transition={{ duration: 0.5 }}
                className={`relative ${activeDevice === 'mobile' ? 'z-20' : 'z-10'}`}
              >
                <div className="w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="bg-healthcare-primary h-8 flex items-center justify-between px-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                      <span className="text-white text-xs font-medium">9:41 AM</span>
                      <div className="flex items-center space-x-1">
                        <Wifi className="w-3 h-3 text-white" />
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-4 h-full bg-gradient-to-b from-healthcare-primary/5 to-healthcare-teal/5">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-healthcare-primary rounded-full flex items-center justify-center mb-2 mx-auto">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">Patient Portal</h3>
                        <p className="text-xs text-gray-600">Welcome back, John!</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-healthcare-primary" />
                            <div>
                              <p className="text-sm font-semibold">Next Appointment</p>
                              <p className="text-xs text-gray-600">Today, 2:30 PM</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <Bell className="w-5 h-5 text-orange-500" />
                            <div>
                              <p className="text-sm font-semibold">Medication Reminder</p>
                              <p className="text-xs text-gray-600">Take your medicine</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <Activity className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm font-semibold">Health Report</p>
                              <p className="text-xs text-gray-600">View latest results</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tablet Device */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: activeDevice === 'tablet' ? 1 : 0.3,
                  scale: activeDevice === 'tablet' ? 1 : 0.8,
                  x: activeDevice === 'tablet' ? 0 : 50
                }}
                transition={{ duration: 0.5 }}
                className={`absolute top-0 ${activeDevice === 'tablet' ? 'z-20' : 'z-10'}`}
              >
                <div className="w-80 h-96 bg-gray-900 rounded-3xl p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                    {/* Tablet Header */}
                    <div className="bg-healthcare-primary h-12 flex items-center justify-between px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Monitor className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">Healthcare</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                        <span className="text-white text-sm">Dr. Smith</span>
                      </div>
                    </div>
                    
                    {/* Dashboard Content */}
                    <div className="p-4 h-full bg-gray-50">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-600">Today&apos;s Patients</span>
                            <Users className="w-4 h-4 text-healthcare-primary" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">24</div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-600">Appointments</span>
                            <Calendar className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">18</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-white rounded-xl p-3 shadow-sm">
                        <h4 className="text-sm font-semibold mb-3">Recent Activity</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-gray-600">Patient checked in</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-xs text-gray-600">Lab report received</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span className="text-xs text-gray-600">Prescription sent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                {activeDevice === 'mobile' ? 'Patient Mobile Experience' : 'Doctor Tablet Interface'}
              </h3>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {activeDevice === 'mobile' 
                  ? 'Patients can manage their healthcare journey from anywhere with our intuitive mobile app.'
                  : 'Doctors get a powerful tablet interface for efficient patient management and clinical workflows.'
                }
              </p>
            </div>

            <div className="grid gap-6">
              {deviceFeatures[activeDevice].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 rounded-xl p-3">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                      <p className="text-white/80 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="text-center">
                <Download className="w-12 h-12 text-white mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-white mb-4">Available as PWA & Native App</h4>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Install Healthcare as a Progressive Web App or download our native mobile apps 
                  for the best experience on any device.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-healthcare-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300">
                    📱 Download for iOS
                  </button>
                  <button className="bg-white text-healthcare-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300">
                    🤖 Download for Android
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Cross-Platform Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Seamless Sync Across All Devices</h3>
            <p className="text-white/80 max-w-2xl mx-auto">
              Your data stays in perfect sync whether you&apos;re switching between your phone, 
              tablet, or desktop. Real-time updates ensure everyone stays informed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Monitor className="w-12 h-12 text-white mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Desktop Dashboard</h4>
              <p className="text-white/80 text-sm">Full-featured admin interface</p>
            </div>
            <div className="text-center">
              <Tablet className="w-12 h-12 text-white mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Tablet Optimized</h4>
              <p className="text-white/80 text-sm">Perfect for clinical rounds</p>
            </div>
            <div className="text-center">
              <Smartphone className="w-12 h-12 text-white mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Mobile Ready</h4>
              <p className="text-white/80 text-sm">On-the-go patient care</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default MobileShowcaseSection;
