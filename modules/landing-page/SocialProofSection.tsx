"use client";

import React from "react";
import { motion } from "framer-motion";

const partners = [
  { name: "City General Hospital", logo: "🏥" },
  { name: "MedCare Clinic", logo: "🩺" },
  { name: "Wellness Center", logo: "💊" },
  { name: "HealthFirst", logo: "❤️" },
  { name: "CarePlus", logo: "🏥" },
  { name: "MediCore", logo: "🩺" },
];

const testimonialQuotes = [
  {
    quote: "Healthcare transformed our appointment chaos into streamlined workflow",
    author: "Dr. Priya Sharma",
    role: "Administrator, Sunrise Clinic",
  },
  {
    quote: "40% increase in patient satisfaction since switching to Healthcare",
    author: "Dr. Rajesh Kumar",
    role: "CMO, City Hospital",
  },
  {
    quote: "The AI insights help us make better decisions every day",
    author: "Dr. Anjali Patel",
    role: "Director, MedCare Plus",
  },
];

function SocialProofSection() {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-healthcare-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Trusted by 50+ Healthcare Institutions
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join India&apos;s Leading Hospitals
          </h2>
        </motion.div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="bg-gray-50 rounded-2xl p-6 hover:bg-healthcare-primary/5 transition-all duration-300 border border-gray-100 hover:border-healthcare-primary/20">
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transform transition-transform duration-300">
                      {partner.logo}
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-healthcare-primary transition-colors">
                      {partner.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonialQuotes.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gradient-to-br from-healthcare-primary/5 to-healthcare-teal/5 rounded-2xl p-8 border border-healthcare-primary/10 hover:shadow-lg hover:shadow-healthcare-primary/10 transition-all duration-300"
            >
              <div className="mb-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 text-lg font-medium leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-healthcare-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-healthcare-primary font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 bg-gradient-to-r from-healthcare-primary to-healthcare-teal rounded-3xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-white/80">Hospitals Onboarded</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-white/80">Patients Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-white/80">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Expert Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SocialProofSection;
