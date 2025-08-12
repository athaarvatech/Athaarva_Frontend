"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, Eye, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContext";
import MedicalLogo from "@/components/ui/MedicalLogo";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const { data } = useHospitalOnboarding();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute -top-32 -right-32 w-64 h-64 bg-healthcare-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 90, 180]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute -bottom-32 -left-32 w-64 h-64 bg-healthcare-emerald/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [180, 270, 360]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl mx-auto bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50/40 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-healthcare-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Live Preview</h2>
                <p className="text-sm text-gray-600">See how your branding looks</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Preview Content */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
              {/* Left Side - Hero Background with Branding */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-full rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${data.branding.primaryColor || '#007C7C'}15, ${data.branding.secondaryColor || '#20B2AA'}10)`
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${(data.branding.primaryColor || '#007C7C').substring(1)}' fill-opacity='0.2'%3E%3Ccircle cx='9' cy='9' r='9'/%3E%3Ccircle cx='51' cy='9' r='9'/%3E%3Ccircle cx='9' cy='51' r='9'/%3E%3Ccircle cx='51' cy='51' r='9'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '60px 60px'
                    }}
                  />
                </div>

                {/* Medical Background Images */}
                <div className="absolute top-4 right-4 opacity-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-300 to-cyan-300 flex items-center justify-center"
                  >
                    <motion.div 
                      className="text-6xl"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      🏥
                    </motion.div>
                  </motion.div>
                </div>

                <div className="absolute bottom-4 left-4 opacity-10">
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 to-indigo-300 flex items-center justify-center"
                  >
                    <span className="text-4xl">⚕️</span>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-center space-y-6">
                  {/* Hospital Branding */}
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div 
                        className="w-16 h-16 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center p-1"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          backgroundColor: data.branding.primaryColor || '#007C7C'
                        }}
                      >
                        {data.branding.logoUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={data.branding.logoUrl} 
                              alt="Hospital Logo" 
                              className="w-10 h-10 object-contain"
                            />
                          </>
                        ) : (
                          <MedicalLogo width={32} height={32} className="text-white" />
                        )}
                      </motion.div>
                      <h1 
                        className="text-2xl font-bold"
                        style={{ color: data.branding.primaryColor || '#007C7C' }}
                      >
                        {data.hospitalBasics.hospitalName || 'Atharva'}
                      </h1>
                    </motion.div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold text-gray-900 leading-tight"
                    >
                      Your Health,
                      <br />
                      <span 
                        className="text-transparent bg-clip-text bg-gradient-to-r"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${data.branding.primaryColor || '#007C7C'}, ${data.branding.secondaryColor || '#20B2AA'})`
                        }}
                      >
                        Simplified & Secure
                      </span>
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-base text-gray-600 leading-relaxed"
                    >
                      {data.loginPage.welcomeText || 'Join thousands of healthcare providers and patients who trust us for comprehensive healthcare management.'}
                    </motion.p>
                  </div>

                  {/* Trust Features */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    {[
                      { icon: "🛡️", text: "HIPAA Compliant" },
                      { icon: "✅", text: "End-to-End Encryption" },
                      { icon: "🔒", text: "Secure Authentication" }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center space-x-3 group cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <motion.div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-sm">{feature.icon}</span>
                        </motion.div>
                        <span 
                          className="text-sm font-medium group-hover:text-opacity-80 transition-colors duration-200"
                          style={{ color: data.branding.primaryColor || '#007C7C' }}
                        >
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Stats */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20"
                  >
                    {[
                      { value: "10K+", label: "Doctors" },
                      { value: "50K+", label: "Patients" },
                      { value: "99.9%", label: "Uptime" }
                    ].map((stat, index) => (
                      <motion.div 
                        key={index} 
                        className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div 
                          className="text-xl font-bold text-transparent bg-clip-text"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${data.branding.primaryColor || '#007C7C'}, ${data.branding.secondaryColor || '#20B2AA'})`
                          }}
                        >
                          {stat.value}
                        </motion.div>
                        <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div> 
              {/* Right Side - Enhanced Auth Form Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 text-center border-b border-gray-100">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
                      <p className="text-gray-600 mt-1">
                        {data.loginPage.welcomeText || 'Sign in to your account'}
                      </p>
                    </motion.div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-5">
                    {/* User Type Selection Preview */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Select your role:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { 
                            id: "patient", 
                            title: "Patient", 
                            icon: "👤",
                            color: data.branding.primaryColor || '#007C7C',
                            selected: true
                          },
                          { 
                            id: "doctor", 
                            title: "Doctor", 
                            icon: "👨‍⚕️",
                            color: '#059669',
                            selected: false
                          },
                          { 
                            id: "staff", 
                            title: "Staff", 
                            icon: "👥",
                            color: '#7C3AED',
                            selected: false
                          }
                        ].map((userType) => (
                          <motion.div
                            key={userType.id}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              userType.selected 
                                ? 'border-current bg-current/5' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                            style={{
                              borderColor: userType.selected ? userType.color : undefined,
                              backgroundColor: userType.selected ? `${userType.color}10` : undefined
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="text-center">
                              <div className="text-lg mb-1">{userType.icon}</div>
                              <p className="text-xs font-medium text-gray-700">
                                {userType.title}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Form Fields Preview */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="mt-1 p-3 border border-gray-200 rounded-lg bg-gray-50 focus-within:border-current transition-colors duration-200"
                             style={{ '--focus-color': data.branding.primaryColor || '#007C7C' } as React.CSSProperties}>
                          <span className="text-gray-400 text-sm">patient@example.com</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <span className="text-gray-400 text-sm">••••••••</span>
                        </div>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div 
                          className="w-4 h-4 rounded border-2 flex items-center justify-center"
                          style={{ borderColor: data.branding.primaryColor || '#007C7C' }}
                        >
                          <div 
                            className="w-2 h-2 rounded-sm"
                            style={{ backgroundColor: data.branding.primaryColor || '#007C7C' }}
                          />
                        </div>
                        <span className="text-gray-700">Remember me</span>
                      </label>
                      <span 
                        className="font-medium cursor-pointer hover:underline"
                        style={{ color: data.branding.primaryColor || '#007C7C' }}
                      >
                        Forgot password?
                      </span>
                    </div>

                    {/* Sign In Button Preview */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <div 
                        className="w-full text-white font-medium py-3 px-4 rounded-lg text-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl"
                        style={{
                          background: `linear-gradient(to right, ${data.branding.primaryColor || '#007C7C'}, ${data.branding.secondaryColor || '#20B2AA'})`
                        }}
                      >
                        Sign In as Patient
                      </div>
                    </motion.div>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">New to {data.hospitalBasics.hospitalName || 'Atharva'}?</span>
                      </div>
                    </div>

                    {/* Sign Up Button (Patient Only) */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <div 
                        className="w-full font-medium py-3 px-4 rounded-lg text-center cursor-pointer transition-all duration-300 border-2"
                        style={{
                          borderColor: data.branding.primaryColor || '#007C7C',
                          color: data.branding.primaryColor || '#007C7C'
                        }}
                      >
                        Sign Up as Patient
                      </div>
                    </motion.div>

                    {/* Note for Doctors/Staff */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        <span 
                          className="font-medium"
                          style={{ color: data.branding.primaryColor || '#007C7C' }}
                        >
                          Doctors & Staff:
                        </span>
                        {" "}Contact your administrator for account access
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Subdomain Preview */}
                {data.loginPage.subdomain && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-4 text-center"
                  >
                    <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                      <Globe className="w-4 h-4" style={{ color: data.branding.primaryColor || '#007C7C' }} />
                      <span className="text-sm font-medium text-gray-700">
                        {data.loginPage.subdomain}.atharva.com
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Monitor className="w-4 h-4" />
                <span>Desktop Preview</span>
              </div>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-healthcare-primary to-healthcare-emerald hover:shadow-lg text-white"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewModal;
