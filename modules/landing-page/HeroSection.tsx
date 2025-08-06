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

          {/* Animated 3D Illustration Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="mt-20"
          >
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 rounded-2xl flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-center"
                  >
                    <TrendingUp className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">
                      3D Hospital Dashboard Animation
                      <br />
                      <span className="text-sm">(Spline/Lottie Integration)</span>
                    </p>
                  </motion.div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-2xl"
              >
                <div className="text-healthcare-primary text-sm font-semibold">
                  Live Analytics
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-2xl"
              >
                <div className="text-healthcare-primary text-sm font-semibold">
                  AI Insights
                </div>
              </motion.div>
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
