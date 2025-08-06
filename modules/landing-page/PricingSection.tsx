"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  Star,
  Zap,
  Crown,
  Building,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface PricingSectionProps {
  onDemoClick: () => void;
}

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small clinics and single-doctor practices",
    monthlyPrice: 999,
    annualPrice: 8490, // 15% discount
    beds: "Up to 4 beds",
    popular: false,
    icon: Zap,
    color: "from-blue-500 to-indigo-600",
    features: [
      "Basic HMS Dashboard",
      "Appointment Scheduling",
      "Patient Records",
      "Basic Reporting",
      "Email Support",
      "2 Doctor Accounts",
      "Mobile App Access",
      "Data Backup",
    ],
    limitations: [
      "No AI Analytics",
      "No Telehealth",
      "Limited Integrations",
    ]
  },
  {
    name: "Professional",
    description: "Most popular for growing hospitals and multi-doctor practices",
    monthlyPrice: 1999,
    annualPrice: 16992, // 15% discount
    beds: "Up to 8 beds",
    popular: true,
    icon: Star,
    color: "from-healthcare-primary to-healthcare-teal",
    features: [
      "Complete HMS Suite",
      "Advanced Scheduling",
      "Comprehensive EHR",
      "AI-Powered Insights",
      "Telehealth Integration",
      "Priority Support",
      "5 Doctor Accounts",
      "Advanced Analytics",
      "API Access",
      "Custom Reports",
      "Mobile & Web Apps",
      "Daily Data Backup",
    ],
    limitations: [
      "Limited mentorship tools",
    ]
  },
  {
    name: "Enterprise",
    description: "Full-featured solution for larger hospitals with advanced needs",
    monthlyPrice: null,
    annualPrice: null,
    beds: "12+ beds",
    popular: false,
    icon: Crown,
    color: "from-purple-600 to-pink-600",
    features: [
      "Complete HMS + AI Suite",
      "Advanced Telehealth Platform",
      "Mentorship Programs",
      "Custom Integrations",
      "Dedicated Support",
      "Unlimited Doctor Accounts",
      "Advanced AI Analytics",
      "Custom Workflows",
      "White-label Options",
      "SLA Guarantee",
      "Compliance Tools",
      "24/7 Phone Support",
      "Training & Onboarding",
      "Data Migration",
    ],
    limitations: []
  }
];

const comparisonFeatures = [
  { name: "Hospital Beds Supported", starter: "4", professional: "8", enterprise: "12+" },
  { name: "Doctor Accounts", starter: "2", professional: "5", enterprise: "Unlimited" },
  { name: "Patient Records", starter: "✓", professional: "✓", enterprise: "✓" },
  { name: "Appointment Scheduling", starter: "Basic", professional: "Advanced", enterprise: "AI-Powered" },
  { name: "Telehealth Integration", starter: "✗", professional: "✓", enterprise: "✓" },
  { name: "AI Analytics", starter: "✗", professional: "✓", enterprise: "Advanced" },
  { name: "Mobile Apps", starter: "✓", professional: "✓", enterprise: "White-label" },
  { name: "Support", starter: "Email", professional: "Priority", enterprise: "24/7 Dedicated" },
  { name: "API Access", starter: "✗", professional: "✓", enterprise: "Full Access" },
  { name: "Custom Integrations", starter: "✗", professional: "Limited", enterprise: "Unlimited" },
];

function PricingSection({ onDemoClick }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-healthcare-cool-white">
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
            <Building className="w-6 h-6 text-healthcare-primary mr-2" />
            <p className="text-healthcare-primary font-semibold text-sm uppercase tracking-wider">
              Transparent Pricing
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect
            <span className="bg-gradient-to-r from-healthcare-primary to-healthcare-teal bg-clip-text text-transparent">
              {" "}Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Simple, transparent pricing that scales with your hospital. 
            All plans include free migration, training, and 14-day trial.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-healthcare-primary text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingPeriod === 'annual'
                  ? 'bg-healthcare-primary text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                Save 15%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'border-healthcare-primary shadow-lg shadow-healthcare-primary/10 transform scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-healthcare-primary to-healthcare-teal text-white px-6 py-2 rounded-full text-sm font-bold">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                {/* Pricing */}
                <div className="mb-6">
                  {plan.monthlyPrice ? (
                    <>
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        ₹{billingPeriod === 'monthly' ? plan.monthlyPrice.toLocaleString() : Math.round((plan.annualPrice || 0) / 12).toLocaleString()}
                        <span className="text-lg text-gray-500 font-normal">/month</span>
                      </div>
                      {billingPeriod === 'annual' && plan.annualPrice && (
                        <div className="text-sm text-gray-500">
                          Billed annually: ₹{plan.annualPrice.toLocaleString()}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-3xl font-bold text-gray-900 mb-2">Custom Pricing</div>
                  )}
                  <div className="text-healthcare-primary font-semibold">{plan.beds}</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, lIndex) => (
                  <div key={lIndex} className="flex items-center opacity-50">
                    <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="space-y-3">
                {plan.monthlyPrice ? (
                  <button
                    onClick={onDemoClick}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-healthcare-primary to-healthcare-teal text-white hover:shadow-lg hover:shadow-healthcare-primary/25'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Start Free Trial
                  </button>
                ) : (
                  <button
                    onClick={onDemoClick}
                    className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-600/25 transition-all duration-300"
                  >
                    Get Custom Quote
                  </button>
                )}
                <p className="text-xs text-gray-500 text-center">
                  {plan.monthlyPrice ? '14-day free trial • No credit card required' : 'Custom pricing • Dedicated support'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300"
          >
            <span>Compare Plans in Detail</span>
            <ArrowRight className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${showComparison ? 'rotate-90' : ''}`} />
          </button>
        </motion.div>

        {/* Detailed Comparison Table */}
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 overflow-hidden"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Detailed Feature Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Starter</th>
                    <th className="text-center py-4 px-6 font-semibold text-healthcare-primary bg-healthcare-primary/5 rounded-t-xl">Professional</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-900">{feature.name}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{feature.starter}</td>
                      <td className="py-4 px-6 text-center text-healthcare-primary bg-healthcare-primary/5 font-semibold">{feature.professional}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{feature.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* FAQ Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-healthcare-primary/5 to-healthcare-teal/5 rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions about pricing?</h3>
            <p className="text-gray-600">We&apos;re here to help you choose the right plan for your hospital.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="font-semibold text-gray-900 mb-2">Need a custom plan?</h4>
                <p className="text-sm text-gray-600 mb-4">For hospitals with specific requirements</p>
                <button 
                  onClick={onDemoClick}
                  className="text-healthcare-primary font-semibold hover:underline"
                >
                  Contact Sales →
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="font-semibold text-gray-900 mb-2">Want to see it first?</h4>
                <p className="text-sm text-gray-600 mb-4">Book a personalized demo</p>
                <button 
                  onClick={onDemoClick}
                  className="text-healthcare-primary font-semibold hover:underline"
                >
                  Schedule Demo →
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="font-semibold text-gray-900 mb-2">Have questions?</h4>
                <p className="text-sm text-gray-600 mb-4">Get answers from our experts</p>
                <button className="text-healthcare-primary font-semibold hover:underline">
                  View FAQ →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;
