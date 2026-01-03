"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Play, Shield, Users, TrendingUp, ShoppingCart } from "lucide-react";
import MedicalLogo from "@/components/ui/MedicalLogo";

interface HeroSectionProps {
  onDemoClick: () => void;
}

function HeroSection({ onDemoClick }: HeroSectionProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Animated background particles
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 124, 124, 0.1)";

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-healthcare-primary via-healthcare-teal to-healthcare-secondary overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-healthcare-primary/90 via-healthcare-teal/80 to-healthcare-secondary/90 z-10" />

      {/* Navigation */}
      <nav className="relative z-50 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-white backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg overflow-hidden">
              <MedicalLogo width={48} height={48} className="p-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Atharva</h1>
              <p className="text-xs text-white/80">Holistic Healthcare, Delivered.</p>
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              onClick={() => router.push('/ecommerce')}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 border border-white/20"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Store</span>
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={() => router.push('/auth')}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 border border-white/20"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          {/* Main Headlines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
              Revolutionize Your Hospital with
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent block">
                AI-Driven Health Intelligence
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl sm:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Healthcare is a modern, cloud-based HMS for small hospitals, combining telehealth, 
            smart dashboards, and streamlined patient care in one intuitive platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button
              onClick={onDemoClick}
              className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-healthcare-dark rounded-2xl font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-yellow-400/25 flex items-center space-x-3 min-w-64"
            >
              <Play className="w-6 h-6" />
              <span>Book a Demo</span>
            </button>
            
            <button 
              onClick={() => router.push('/ecommerce')}
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold text-lg hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-emerald-400/25 flex items-center space-x-3 min-w-64"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>Visit Store</span>
            </button>
            
            <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105 transform min-w-64">
              Get Started Free
            </button>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-3xl font-bold text-white">50+</span>
              </div>
              <p className="text-white/70 text-sm">Hospitals Onboarded</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-3xl font-bold text-white">99.9%</span>
              </div>
              <p className="text-white/70 text-sm">Uptime Guarantee</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-3xl font-bold text-white">40%</span>
              </div>
              <p className="text-white/70 text-sm">Efficiency Increase</p>
            </div>
          </motion.div>

          {/* Animated 3D Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
            className="mt-20"
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Main Container with Enhanced Glass Effect */}
              <motion.div 
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl relative overflow-hidden"
                animate={{ 
                  boxShadow: [
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    "0 35px 60px -12px rgba(34, 197, 195, 0.3)",
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Animated Background Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-teal-400/10 via-transparent to-yellow-400/10 rounded-3xl"
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Image Container */}
                <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 rounded-2xl overflow-hidden relative">
                  {/* Animated Border Gradient */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "linear-gradient(45deg, transparent, rgba(34, 197, 195, 0.3), transparent, rgba(251, 191, 36, 0.3), transparent)"
                    }}
                    animate={{ 
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Main Image with Enhanced Animations */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.03, 1],
                      rotateY: [0, 2, 0, -2, 0]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-full h-full relative z-10"
                  >
                    <img
                      src="/render.png"
                      alt="Hospital Management System 3D Render"
                      className="w-full h-full object-cover object-center rounded-2xl filter brightness-110 contrast-105"
                    />
                    
                    {/* Multi-layered Overlay Effects */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-healthcare-primary/30 via-transparent to-teal-400/20 rounded-2xl"
                      animate={{ 
                        opacity: [0.6, 0.8, 0.6]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                      animate={{ 
                        x: [-100, 400],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                      }}
                      style={{ transform: "skewX(-20deg)" }}
                    />
                  </motion.div>
                  
                  {/* Floating Healthcare Icons */}
                  <motion.div
                    className="absolute top-4 left-4 w-8 h-8 bg-teal-400/80 rounded-full flex items-center justify-center"
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-1/2 right-6 w-6 h-6 bg-yellow-400/80 rounded-lg flex items-center justify-center"
                    animate={{ 
                      y: [0, 12, 0],
                      rotate: [0, -360]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    <div className="w-3 h-3 bg-white rounded-sm" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-6 left-1/3 w-5 h-5 bg-emerald-400/80 rounded-full"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                </div>
              </motion.div>
              
              {/* Enhanced Floating Cards with Healthcare Theme */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 3, 0, -3, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-teal-100 z-20"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"
                  />
                  <div className="text-healthcare-primary text-sm font-semibold">
                    Live Analytics
                  </div>
                </div>
                <motion.div 
                  className="text-xs text-gray-600 mt-1"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Real-time monitoring
                </motion.div>
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -3, 0, 3, 0]
                }}
                transition={{ 
                  duration: 7, 
                  repeat: Infinity, 
                  ease: "easeInOut", 
                  delay: 2 
                }}
                className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-yellow-100 z-20"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ["#f59e0b", "#10b981", "#06b6d4", "#f59e0b"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-3 h-3 rounded-full"
                  />
                  <div className="text-healthcare-primary text-sm font-semibold">
                    AI Insights
                  </div>
                </div>
                <motion.div 
                  className="text-xs text-gray-600 mt-1"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  Smart predictions
                </motion.div>
              </motion.div>
              
              {/* Additional Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  x: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-1/2 -left-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full p-3 shadow-xl z-10"
              >
                <Users className="w-5 h-5 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, 12, 0],
                  x: [0, -8, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 3
                }}
                className="absolute top-1/3 -right-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3 shadow-xl z-10"
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </motion.div>
              
              {/* Pulsing Background Rings */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-yellow-400/20 rounded-3xl -z-10"
              />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.05, 0.2, 0.05]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-orange-400/20 rounded-3xl -z-20"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
