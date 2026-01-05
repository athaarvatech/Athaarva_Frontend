"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";

interface TestimonialAuthor {
  name: string;
  handle: string;
  avatar: string;
}

interface Testimonial {
  author: TestimonialAuthor;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    author: {
      name: "Dr. Rajesh Kumar",
      handle: "Cardiologist, Apollo Hospitals",
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    },
    text: "Athaarva's AI-assisted diagnosis features are a lifesaver. I can focus more on patients, less on paperwork. The clinical decision support is incredibly accurate.",
  },
  {
    author: {
      name: "Priya Sharma",
      handle: "Hospital Administrator, Max Healthcare",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    },
    text: "Athaarva reduced our admin time by 40%. The billing automation and patient queue management have transformed our operations completely.",
  },
  {
    author: {
      name: "Ankit Verma",
      handle: "Patient",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    text: "Booking appointments and accessing my medical records is finally simple. The telehealth feature saved me hours of travel time. Everything in one app!",
  },
  {
    author: {
      name: "Dr. Sarah Patel",
      handle: "Oncologist, Fortis Healthcare",
      avatar:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
    },
    text: "The auto website builder feature is brilliant. Our clinic now has a professional online presence without hiring a developer. Patients can book appointments 24/7.",
  },
  {
    author: {
      name: "Vikram Singh",
      handle: "Lab Director, Quest Diagnostics",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    text: "Integration with our lab systems was seamless. Real-time test result sharing with doctors has reduced turnaround time significantly.",
  },
  {
    author: {
      name: "Meera Desai",
      handle: "Nurse Manager, Narayana Health",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    text: "The staff scheduling and task management features are intuitive. Our nursing team loves how easy it is to coordinate patient care across shifts.",
  },
];

interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
}

function TestimonialCard({ author, text }: TestimonialCardProps) {
  return (
    <div className="w-[350px] flex-shrink-0 rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
      <div className="flex items-start gap-4">
        <Image
          src={author.avatar}
          alt={author.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="font-semibold text-slate-900">{author.name}</div>
          <div className="text-sm text-slate-500">{author.handle}</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

interface TestimonialsProps {
  className?: string;
}

export function Testimonials({ className }: TestimonialsProps) {
  return (
    <section
      className={cn("relative py-24 lg:py-32 overflow-hidden", className)}
    >
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/30 to-rose-50/50" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 text-center px-6">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="max-w-[720px] font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Loved by Healthcare{" "}
            <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              Professionals
            </span>
          </h2>
          <p className="max-w-[600px] text-lg text-slate-600">
            Join thousands of doctors, administrators, and patients who are
            experiencing better healthcare with Athaarva
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative flex w-full flex-col items-center justify-center mt-8">
          {/* Top Row - Moving Left */}
          <div className="group flex overflow-hidden py-2 [--gap:1rem] [gap:var(--gap)] flex-row">
            <motion.div
              className="flex shrink-0 justify-around [gap:var(--gap)] flex-row"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(4)].map((_, setIndex) =>
                testimonials
                  .slice(0, 3)
                  .map((testimonial, i) => (
                    <TestimonialCard
                      key={`top-${setIndex}-${i}`}
                      {...testimonial}
                    />
                  ))
              )}
            </motion.div>
          </div>

          {/* Bottom Row - Moving Right */}
          <div className="group flex overflow-hidden py-2 [--gap:1rem] [gap:var(--gap)] flex-row">
            <motion.div
              className="flex shrink-0 justify-around [gap:var(--gap)] flex-row"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(4)].map((_, setIndex) =>
                testimonials
                  .slice(3, 6)
                  .map((testimonial, i) => (
                    <TestimonialCard
                      key={`bottom-${setIndex}-${i}`}
                      {...testimonial}
                    />
                  ))
              )}
            </motion.div>
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 text-slate-500"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-900">4.9</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-sm">from 500+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
