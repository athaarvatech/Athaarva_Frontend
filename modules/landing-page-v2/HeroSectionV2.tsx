"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Play, 
  ArrowRight, 
  Activity, 
  HeartPulse, 
  Stethoscope,
  ChevronDown,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";
import MedicalLogo from "@/components/ui/MedicalLogo";

interface HeroSectionProps {
  onDemoClick: () => void;
}

const FloatingElement = ({ children, delay = 0, duration = 6, x = 0, y = 15 }: { 
  children: React.ReactNode; 
  delay?: number; 
  duration?: number; 
  x?: number; 
  y?: number; 
}) => (
  <motion.div
    animate={{ 
      y: [0, y, 0],
      x: [0, x, 0],
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
  >
    {children}
  </motion.div>
);

function HeroSectionV2({ onDemoClick }: HeroSectionProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "AI Solutions", href: "#ai-solutions" },
    { name: "Pricing", href: "#pricing" },
    { name: "Case Studies", href: "#case-studies" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Gradient Orbs */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-100/40 via-teal-50/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
      />
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-100/30 via-emerald-50/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"
      />

      {/* Navigation */}
      <nav className="relative z-50 px-4 sm:px-6 lg:px-12 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <MedicalLogo width={32} height={32} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Athaarva</span>
            </motion.div>
            
            {/* Nav Links */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden md:flex items-center space-x-8"
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  className="text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200"
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.div>
            
            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={onDemoClick}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center space-x-2"
            >
              <span>Request Demo</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 lg:pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column - Text Content */}
          <motion.div 
            style={{ opacity }}
            className="max-w-xl lg:max-w-none"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Intelligent Automation</span>
              <span className="text-emerald-300">•</span>
              <span className="text-sm text-emerald-600">Seamless Integration</span>
              <span className="text-emerald-300">•</span>
              <span className="text-sm text-emerald-600">User-Friendly Design</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Athaarva: Your Hospital, 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Streamlined by AI
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              Unlock unparalleled efficiency and patient care with our intelligent, 
              seamlessly integrated HMS platform. The future of healthcare management is here.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={onDemoClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-base hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-500/25 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-base hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-5 h-5 text-emerald-600" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 pt-8 border-t border-gray-100"
            >
              <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider font-medium">
                Trusted by Leading Healthcare Institutions
              </p>
              <div className="flex items-center space-x-8">
                {[
                  { icon: HeartPulse, name: "Global Health Network" },
                  { icon: Stethoscope, name: "Apex Clinics" },
                  { icon: Activity, name: "City Medical Center" },
                ].map((partner, index) => (
                  <motion.div
                    key={partner.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-2 text-gray-400 hover:text-emerald-600 transition-colors duration-300"
                  >
                    <partner.icon className="w-5 h-5" />
                    <span className="text-sm font-medium whitespace-nowrap">{partner.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Product Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative lg:pl-8"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          >
            {/* Main Dashboard Card */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-green-500/20 rounded-3xl blur-2xl opacity-60" />
              
              {/* Dashboard Preview */}
              <motion.div 
                className="relative bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
                animate={{ 
                  boxShadow: [
                    "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                    "0 35px 60px -12px rgba(16, 185, 129, 0.15)",
                    "0 25px 50px -12px rgba(0, 0, 0, 0.1)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">Athaarva Dashboard</h4>
                        <p className="text-white/70 text-xs">Hospital Management</p>
                      </div>
                    </div>
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-5 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Patients", value: "1,234", change: "+12%" },
                      { label: "Appointments", value: "89", change: "+8%" },
                      { label: "Revenue", value: "₹2.4M", change: "+23%" },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-3"
                      >
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-emerald-600 font-medium">{stat.change}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chart Placeholder */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-xl p-4 h-32"
                  >
                    <div className="flex items-end justify-between h-full">
                      {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                          className="w-6 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-md"
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Recent Activity */}
                  <div className="space-y-2">
                    {[
                      { text: "New appointment scheduled", time: "2 min ago" },
                      { text: "Patient record updated", time: "5 min ago" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                        className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <span className="text-gray-700">{item.text}</span>
                        <span className="text-gray-400 text-xs">{item.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <FloatingElement delay={0} duration={5} y={-12}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute -top-6 -right-6 bg-white rounded-xl p-3 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">HIPAA Compliant</p>
                      <p className="text-[10px] text-gray-500">Secure & Protected</p>
                    </div>
                  </div>
                </motion.div>
              </FloatingElement>

              <FloatingElement delay={1} duration={6} y={15}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">AI-Powered</p>
                      <p className="text-[10px] text-gray-500">Smart Automation</p>
                    </div>
                  </div>
                </motion.div>
              </FloatingElement>

              <FloatingElement delay={2} duration={7} x={-5} y={10}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  className="absolute top-1/2 -right-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full p-3 shadow-lg"
                >
                  <Activity className="w-5 h-5 text-white" />
                </motion.div>
              </FloatingElement>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center cursor-pointer"
        >
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-emerald-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSectionV2;
