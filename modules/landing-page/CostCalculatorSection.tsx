"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  Users, 
  Calendar,
  Bed,
  Zap,
  Video,
  Brain,
  Shield,
  CheckCircle
} from "lucide-react";

interface CostCalculatorSectionProps {
  onDemoClick: () => void;
}

const pricingModules = [
  { id: 'ai', name: 'AI Analytics Module', price: 500, icon: Brain },
  { id: 'telehealth', name: 'Video Consultations', price: 300, icon: Video },
  { id: 'security', name: 'Advanced Security', price: 200, icon: Shield },
];

function CostCalculatorSection({ onDemoClick }: CostCalculatorSectionProps) {
  const [beds, setBeds] = useState(8);
  const [doctors, setDoctors] = useState(3);
  const [dailyAppointments, setDailyAppointments] = useState(25);
  const [selectedModules, setSelectedModules] = useState<string[]>(['ai']);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const calculateBaseCost = () => {
    if (beds <= 4) return 999;
    if (beds <= 8) return 1999;
    if (beds <= 12) return 2999;
    return 3999; // 16+ beds
  };

  const calculateModuleCost = () => {
    return selectedModules.reduce((total, moduleId) => {
      const module = pricingModules.find(m => m.id === moduleId);
      return total + (module?.price || 0);
    }, 0);
  };

  const baseCost = calculateBaseCost();
  const moduleCost = calculateModuleCost();
  const doctorCost = Math.max(0, (doctors - 2)) * 100; // First 2 doctors free
  const totalMonthlyCost = baseCost + moduleCost + doctorCost;
  const totalAnnualCost = totalMonthlyCost * 12 * 0.85; // 15% annual discount

  const finalCost = billingPeriod === 'monthly' ? totalMonthlyCost : totalAnnualCost;
  const displayCost = billingPeriod === 'monthly' ? finalCost : Math.round(finalCost / 12);
  const savings = billingPeriod === 'annual' ? totalMonthlyCost * 12 - totalAnnualCost : 0;

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <section className="py-24 bg-gradient-to-br from-healthcare-soft-grey to-white">
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
            <Calculator className="w-6 h-6 text-healthcare-primary mr-2" />
            <p className="text-healthcare-primary font-semibold text-sm uppercase tracking-wider">
              Cost Calculator
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Calculate Your Hospital's
            <span className="bg-gradient-to-r from-healthcare-primary to-healthcare-teal bg-clip-text text-transparent">
              {" "}Investment
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get an instant estimate tailored to your hospital size and requirements. 
            Transparent pricing with no hidden fees.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Configure Your Setup</h3>
            
            <div className="space-y-8">
              {/* Number of Beds */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <Bed className="w-5 h-5 text-healthcare-primary mr-2" />
                  Number of Beds: {beds}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[4, 8, 12, 16].map((bedCount) => (
                    <button
                      key={bedCount}
                      onClick={() => setBeds(bedCount)}
                      className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                        beds === bedCount
                          ? 'bg-healthcare-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {bedCount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Doctors */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <Users className="w-5 h-5 text-healthcare-primary mr-2" />
                  Doctors Using System: {doctors}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={doctors}
                  onChange={(e) => setDoctors(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1</span>
                  <span>20+</span>
                </div>
              </div>

              {/* Daily Appointments */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <Calendar className="w-5 h-5 text-healthcare-primary mr-2" />
                  Daily Appointments: {dailyAppointments}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={dailyAppointments}
                  onChange={(e) => setDailyAppointments(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>10</span>
                  <span>100+</span>
                </div>
              </div>

              {/* Add-on Modules */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Optional Modules</h4>
                <div className="space-y-3">
                  {pricingModules.map((module) => (
                    <div
                      key={module.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        selectedModules.includes(module.id)
                          ? 'border-healthcare-primary bg-healthcare-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center">
                        <module.icon className={`w-5 h-5 mr-3 ${
                          selectedModules.includes(module.id) ? 'text-healthcare-primary' : 'text-gray-500'
                        }`} />
                        <span className="font-medium">{module.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-900 mr-3">
                          ₹{module.price}/mo
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                          selectedModules.includes(module.id)
                            ? 'bg-healthcare-primary border-healthcare-primary'
                            : 'border-gray-300'
                        }`}>
                          {selectedModules.includes(module.id) && (
                            <CheckCircle className="w-5 h-5 text-white -m-0.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Period Toggle */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Billing Period</h4>
                <div className="bg-gray-100 p-1 rounded-2xl flex">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      billingPeriod === 'monthly'
                        ? 'bg-white text-healthcare-primary shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('annual')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 relative ${
                      billingPeriod === 'annual'
                        ? 'bg-white text-healthcare-primary shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    Annual
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      Save 15%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cost Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Cost Summary Card */}
            <div className="bg-gradient-to-br from-healthcare-primary to-healthcare-teal rounded-3xl p-8 text-white">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Your Estimated Cost</h3>
                <p className="text-white/80">For {beds} beds · {doctors} doctors · {dailyAppointments} daily appointments</p>
              </div>
              
              <div className="text-center mb-8">
                <div className="text-6xl font-bold mb-2">
                  ₹{displayCost.toLocaleString()}
                </div>
                <div className="text-xl text-white/80">
                  per {billingPeriod === 'monthly' ? 'month' : 'month (billed annually)'}
                </div>
                {billingPeriod === 'annual' && savings > 0 && (
                  <div className="mt-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 inline-block">
                    <span className="text-sm font-semibold">
                      You save ₹{Math.round(savings).toLocaleString()} per year!
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center text-white/90">
                  <span>Base Plan ({beds} beds)</span>
                  <span className="font-semibold">₹{baseCost.toLocaleString()}</span>
                </div>
                
                {doctorCost > 0 && (
                  <div className="flex justify-between items-center text-white/90">
                    <span>Additional Doctors ({doctors - 2})</span>
                    <span className="font-semibold">₹{doctorCost.toLocaleString()}</span>
                  </div>
                )}
                
                {selectedModules.length > 0 && (
                  <div className="flex justify-between items-center text-white/90">
                    <span>Add-on Modules ({selectedModules.length})</span>
                    <span className="font-semibold">₹{moduleCost.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Monthly</span>
                    <span>₹{totalMonthlyCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onDemoClick}
                  className="w-full bg-white text-healthcare-primary py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Try It Free for 14 Days
                </button>
                <button className="w-full bg-white/10 backdrop-blur-sm text-white py-4 rounded-2xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
                  Schedule a Demo
                </button>
              </div>
            </div>

            {/* Features Included */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h4 className="text-xl font-bold text-gray-900 mb-6">What's Included:</h4>
              <div className="space-y-3">
                {[
                  'Complete Hospital Management System',
                  'Doctor & Patient Dashboards',
                  'Appointment Scheduling & Reminders',
                  'Medical Records Management',
                  'Basic Analytics & Reporting',
                  '24/7 Technical Support',
                  'Regular Updates & Maintenance',
                  'HIPAA Compliant Security',
                  'Mobile & Web Access',
                  'Data Export & Backup'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
              <div className="text-center">
                <div className="flex justify-center items-center space-x-8 mb-4">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700">No Setup Fees</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700">HIPAA Compliant</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700">Cancel Anytime</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  * All prices in INR. Custom enterprise pricing available for 20+ bed hospitals.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CostCalculatorSection;
