"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";

const testimonials = [
  {
    quote: "Athaarva's AI has transformed our operations. We see a 30% increase in efficiency, and our staff loves the simplicity.",
    author: "Dr. Anya Sharma",
    role: "Chief Medical Officer",
    company: "Apex Clinics",
    avatar: "AS",
    rating: 5,
    color: "from-emerald-500 to-teal-500"
  },
  {
    quote: "The predictive analytics have helped us reduce patient wait times by 40%. Our patient satisfaction scores have never been higher.",
    author: "Dr. Rajesh Kumar",
    role: "Hospital Director",
    company: "City Medical Center",
    avatar: "RK",
    rating: 5,
    color: "from-blue-500 to-indigo-500"
  },
  {
    quote: "Implementation was seamless. The Athaarva team understood our needs and delivered a solution that exceeded expectations.",
    author: "Dr. Priya Patel",
    role: "Administrator",
    company: "Global Health Network",
    avatar: "PP",
    rating: 5,
    color: "from-purple-500 to-pink-500"
  }
];

function TestimonialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        {/* Featured Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          {/* Quote Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <Quote className="w-8 h-8 text-emerald-600" />
          </motion.div>
          
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-900 leading-relaxed mb-8"
          >
            "Athaarva's AI has transformed our operations. We see a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              30% increase in efficiency
            </span>
            , and our staff loves the simplicity."
          </motion.blockquote>
          
          {/* Author */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center space-x-4"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              AS
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Dr. Anya Sharma</p>
              <p className="text-gray-600 text-sm">Chief Medical Officer, Apex Clinics</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-8 h-full hover:bg-white hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500 border border-transparent hover:border-gray-100 relative overflow-hidden">
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${testimonial.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Rating */}
                <div className="flex space-x-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                
                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-emerald-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <a 
            href="#case-studies" 
            className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group"
          >
            Read More Success Stories
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialSection;
