"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TemplateBlueprint } from './templateBlueprints';

export interface TemplatePreviewRendererProps {
  blueprint: TemplateBlueprint;
  device: 'desktop' | 'tablet' | 'mobile';
}

const sectionAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
};

export function TemplatePreviewRenderer({ blueprint, device }: TemplatePreviewRendererProps) {
  return (
    <div
      className={cn(
        'h-full w-full overflow-y-auto bg-white',
        device === 'desktop' && 'px-0',
        device === 'tablet' && 'scale-[0.92] origin-top',
        device === 'mobile' && 'scale-[0.7] origin-top'
      )}
      style={{
        background: blueprint.palette.background,
        fontFamily: blueprint.typography.body,
      }}
    >
      <main className="min-h-full">
        <HeroSection blueprint={blueprint} />
        <StatsStrip blueprint={blueprint} />
        <SpecialtiesSection blueprint={blueprint} />
        <DifferentiatorsSection blueprint={blueprint} />
        <DoctorsSection blueprint={blueprint} />
        <FacilitySection blueprint={blueprint} />
        <TestimonialsSection blueprint={blueprint} />
        <ProgramsSection blueprint={blueprint} />
        <Footer blueprint={blueprint} />
      </main>
    </div>
  );
}

function HeroSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: blueprint.palette.gradient,
        color: 'white',
        fontFamily: blueprint.typography.heading,
      }}
    >
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-8 py-16 md:flex-row md:items-center">
        <div className="flex-1 space-y-5">
          <span className="text-sm uppercase tracking-[0.4em] text-white/70">
            {blueprint.hero.eyebrow}
          </span>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {blueprint.hero.title}
          </h1>
          <p className="text-lg text-white/80" style={{ fontFamily: blueprint.typography.body }}>
            {blueprint.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={blueprint.hero.primaryCta.href}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
            >
              {blueprint.hero.primaryCta.label}
            </a>
            <a
              href={blueprint.hero.secondaryCta.href}
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90"
            >
              {blueprint.hero.secondaryCta.label}
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-1 justify-center md:mt-0">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Immersive OR Suite</p>
            <div className="mt-4 h-48 w-64 rounded-2xl bg-black/30 shadow-inner">
              <div className="flex h-full items-center justify-center">
                <PlayCircle className="h-12 w-12 text-white/60" />
              </div>
            </div>
            <p className="mt-3 text-xs text-white/80">{blueprint.hero.heroImageAlt}</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff22,transparent_55%)]" />
    </section>
  );
}

function StatsStrip({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-10 text-center sm:grid-cols-3">
      {blueprint.hero.stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-white/40 bg-white/80 p-6 shadow-sm">
          <p className="text-3xl font-bold" style={{ color: blueprint.palette.accent }}>
            {stat.value}
          </p>
          <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function SpecialtiesSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <motion.section {...sectionAnimation} className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Centres of Excellence</p>
          <h2 className="text-3xl font-semibold text-slate-900" style={{ fontFamily: blueprint.typography.heading }}>
            Specialty depth built for outcomes
          </h2>
        </div>
        <button className="text-sm font-semibold text-slate-700">Download Clinical Brief →</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {blueprint.specialties.map((specialty) => (
          <div key={specialty.title} className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-hidden>
                {specialty.icon}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{specialty.title}</h3>
                <p className="text-sm text-slate-600">{specialty.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function DifferentiatorsSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
        {blueprint.differentiators.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200/80 bg-white px-5 py-6 shadow">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Why it works</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DoctorsSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Physician voices</p>
          <h2 className="text-3xl font-semibold text-slate-900" style={{ fontFamily: blueprint.typography.heading }}>
            Meet the program leads
          </h2>
        </div>
        <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
          View all doctors
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {blueprint.doctors.map((doctor) => (
          <div key={doctor.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-100" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{doctor.specialty}</p>
                <h3 className="text-2xl font-semibold text-slate-900">{doctor.name}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{doctor.description}</p>
            <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <PlayCircle className="h-4 w-4" />
              {doctor.mediaLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function FacilitySection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Campus snapshots</p>
          <h2 className="text-3xl font-semibold text-slate-900" style={{ fontFamily: blueprint.typography.heading }}>
            Designed for families & teams
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {blueprint.facilityHighlights.map((highlight) => (
            <div key={highlight.title} className="rounded-3xl border border-slate-200 bg-white shadow">
              <div className="h-40 rounded-t-3xl bg-slate-100" />
              <div className="space-y-2 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{highlight.title}</h3>
                <p className="text-sm text-slate-600">{highlight.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <section className="bg-slate-900/95 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Quote className="h-8 w-8 text-white/60" />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Family stories</p>
            <h2 className="text-3xl font-semibold" style={{ fontFamily: blueprint.typography.heading }}>
              Trust that travels borders
            </h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {blueprint.testimonials.map((testimonial) => (
            <div key={testimonial.patient} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
              <p className="text-lg font-medium leading-relaxed text-white/90">{testimonial.quote}</p>
              <div className="mt-4 text-sm text-white/70">
                {testimonial.patient} · {testimonial.procedure}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramsSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Signature programs</p>
            <h2 className="text-3xl font-semibold text-slate-900" style={{ fontFamily: blueprint.typography.heading }}>
              Pathways built with you
            </h2>
          </div>
          <button className="text-sm font-semibold text-slate-700">View all pathways →</button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {blueprint.programs.map((program) => (
            <div key={program.title} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{program.meta}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{program.title}</h3>
              <p className="text-sm text-slate-600">{program.description}</p>
              <button className="mt-4 text-sm font-semibold text-slate-900">View care map →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Contact navigator</p>
          <p className="text-lg font-semibold">{blueprint.footer.contact.phone}</p>
          <p className="text-sm text-white/70">{blueprint.footer.contact.email}</p>
          <p className="mt-2 text-sm text-white/60">{blueprint.footer.contact.location}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {blueprint.footer.quickLinks.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Plan your journey</p>
          <p className="mt-3 text-sm text-white/80">
            Patient concierge desk coordinates travel, visas, insurance paperwork, and virtual second opinions in under 48 hours.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Athaarva Health Templates · Crafted for preview only
      </div>
    </footer>
  );
}
