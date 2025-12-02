"use client";

import React from "react";
import {
  ArrowRight, Star, ChevronDown, ChevronUp, Globe, Phone, Mail, MapPin,
  Heart, Brain, Bone, Baby, Activity, Ribbon, Stethoscope, Clock, Users,
  Award, Shield, Cpu, Building2, Video, FileText, Home, ClipboardCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TemplateBlueprint } from "./templateBlueprints";

export interface TemplatePreviewRendererProps {
  blueprint: TemplateBlueprint;
  device: "desktop" | "tablet" | "mobile";
}

const iconMap: Record<string, React.ElementType> = {
  Heart, Brain, Bone, Baby, Activity, Ribbon, Stethoscope, Clock, Users,
  Award, Shield, Cpu, Building2, Video, FileText, Home, ClipboardCheck, Globe, Phone, Mail, MapPin
};

const getIcon = (iconName: string) => iconMap[iconName] || Heart;

export function TemplatePreviewRenderer({ blueprint, device }: TemplatePreviewRendererProps) {
  const scale = device === "mobile" ? "scale-[0.5]" : device === "tablet" ? "scale-[0.75]" : "";
  return (
    <div
      className={cn("h-full w-full overflow-y-auto overflow-x-hidden", scale && `${scale} origin-top-left`)}
      style={{ background: blueprint.palette.background, width: device === "mobile" ? "200%" : device === "tablet" ? "133%" : "100%" }}
    >
      <HeroSection blueprint={blueprint} />
      <div className="relative z-10 -mt-8 px-4 md:px-8 max-w-5xl mx-auto"><StatsStrip blueprint={blueprint} /></div>
      <div className="px-4 md:px-8 max-w-5xl mx-auto">
        {blueprint.about && <section className="py-12"><AboutSection blueprint={blueprint} /></section>}
        <section className="py-10">{blueprint.centersOfExcellence ? <CentersOfExcellence blueprint={blueprint} /> : <SpecialtiesGrid blueprint={blueprint} />}</section>
        <section className="py-10"><DoctorsCarousel blueprint={blueprint} /></section>
        {blueprint.infrastructureCards && <section className="py-10"><InfrastructureSection blueprint={blueprint} /></section>}
        {blueprint.services && <section className="py-10"><ServicesSection blueprint={blueprint} /></section>}
        {blueprint.internationalPatients && <section className="py-10"><InternationalSection blueprint={blueprint} /></section>}
        <section className="py-10"><TestimonialsSection blueprint={blueprint} /></section>
        {blueprint.news && <section className="py-10"><NewsSection blueprint={blueprint} /></section>}
        {blueprint.faqs && <section className="py-10"><FAQSection blueprint={blueprint} /></section>}
        <section className="py-10"><FacilitiesSection blueprint={blueprint} /></section>
      </div>
      <FooterSection blueprint={blueprint} />
    </div>
  );
}

function HeroSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <header className="relative min-h-[320px] flex items-center overflow-hidden" style={{ background: blueprint.palette.gradient }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
      </div>
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>{blueprint.hero.eyebrow}</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: blueprint.typography.heading }}>{blueprint.hero.title}</h1>
          <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">{blueprint.hero.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg" style={{ background: "white", color: blueprint.palette.accent }}>{blueprint.hero.primaryCta.label}<ArrowRight className="w-4 h-4" /></button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}><Phone className="w-4 h-4" />{blueprint.hero.secondaryCta.label}</button>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatsStrip({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 rounded-xl overflow-hidden shadow-xl bg-white">
      {blueprint.hero.stats.map((stat, idx) => (
        <div key={stat.label} className="p-4 text-center hover:bg-slate-50 transition-colors" style={{ borderRight: idx < 3 ? "1px solid #e2e8f0" : "none" }}>
          <div className="text-2xl md:text-3xl font-bold" style={{ color: blueprint.palette.accent }}>{stat.value}</div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function AboutSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  if (!blueprint.about) return null;
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: blueprint.palette.accent }}>{blueprint.about.subtitle}</span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4" style={{ color: blueprint.palette.text }}>{blueprint.about.title}</h2>
        <p className="text-slate-600 leading-relaxed mb-6">{blueprint.about.description}</p>
        <div className="grid grid-cols-2 gap-3">
          {blueprint.about.highlights.map(h => (
            <div key={h.label} className="p-3 rounded-lg" style={{ background: blueprint.palette.accentMuted }}>
              <div className="text-xl font-bold" style={{ color: blueprint.palette.accent }}>{h.value}</div>
              <div className="text-xs text-slate-600">{h.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-56 rounded-xl flex items-center justify-center" style={{ background: blueprint.palette.surface }}>
        <Building2 className="w-16 h-16" style={{ color: blueprint.palette.accent, opacity: 0.5 }} />
      </div>
    </div>
  );
}

function SpecialtiesGrid({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold" style={{ color: blueprint.palette.text }}>Our Specialties</h2>
        <p className="text-slate-500 mt-2">Comprehensive care across all major disciplines</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {blueprint.specialties.slice(0, 6).map(sp => {
          const Icon = getIcon(sp.icon);
          return (
            <div key={sp.name} className="p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer group" style={{ background: blueprint.palette.surface }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ background: blueprint.palette.accentMuted }}>
                <Icon className="w-5 h-5" style={{ color: blueprint.palette.accent }} />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: blueprint.palette.text }}>{sp.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sp.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CentersOfExcellence({ blueprint }: { blueprint: TemplateBlueprint }) {
  if (!blueprint.centersOfExcellence) return null;
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold" style={{ color: blueprint.palette.text }}>Centers of Excellence</h2>
        <p className="text-slate-500 mt-2">World-class specialized care units</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {blueprint.centersOfExcellence.map(center => {
          const Icon = getIcon(center.icon);
          return (
            <div key={center.name} className="p-4 rounded-xl text-center hover:shadow-lg transition-all cursor-pointer group" style={{ background: blueprint.palette.surface }}>
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ background: blueprint.palette.accentMuted }}>
                <Icon className="w-6 h-6" style={{ color: blueprint.palette.accent }} />
              </div>
              <h3 className="font-semibold text-xs" style={{ color: blueprint.palette.text }}>{center.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DoctorsCarousel({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold" style={{ color: blueprint.palette.text }}>Our Expert Doctors</h2>
        <p className="text-slate-500 mt-2">Meet our world-renowned medical specialists</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {blueprint.doctors.slice(0, 4).map(doc => (
          <div key={doc.name} className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group bg-white">
            <div className="h-28 flex items-center justify-center" style={{ background: blueprint.palette.surface }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg" style={{ background: blueprint.palette.gradient }}>
                {doc.name.split(" ").map(n => n[0]).join("")}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm truncate" style={{ color: blueprint.palette.text }}>{doc.name}</h3>
              <p className="text-xs truncate" style={{ color: blueprint.palette.accent }}>{doc.title}</p>
              <p className="text-xs text-slate-400 mt-1">{doc.experience}</p>
              <button className="w-full mt-2 py-1.5 rounded-md text-xs font-medium" style={{ background: blueprint.palette.accentMuted, color: blueprint.palette.accent }}>Book Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfrastructureSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  if (!blueprint.infrastructureCards) return null;
  return (
    <div className="rounded-2xl p-6" style={{ background: blueprint.palette.surface }}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: blueprint.palette.text }}>World-Class Infrastructure</h2>
        <p className="text-slate-500 mt-2">State-of-the-art facilities for optimal care</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {blueprint.infrastructureCards.map(card => (
          <div key={card.title} className="p-4 rounded-xl text-center bg-white">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: blueprint.palette.accentMuted }}>
              <Cpu className="w-6 h-6" style={{ color: blueprint.palette.accent }} />
            </div>
            <h3 className="font-semibold text-xs mb-1" style={{ color: blueprint.palette.text }}>{card.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-2">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  if (!blueprint.services) return null;
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: blueprint.palette.text }}>Hospital Services</h2>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {blueprint.services.map(svc => (
          <div key={svc.name} className="p-3 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer" style={{ background: blueprint.palette.surface }}>
            <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2" style={{ background: blueprint.palette.accentMuted }}>
              <Activity className="w-5 h-5" style={{ color: blueprint.palette.accent }} />
            </div>
            <h3 className="text-xs font-medium" style={{ color: blueprint.palette.text }}>{svc.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

function InternationalSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  if (!blueprint.internationalPatients) return null;
  return (
    <div className="rounded-2xl p-6 text-white" style={{ background: blueprint.palette.gradient }}>
      <div className="flex items-start gap-4 mb-4">
        <Globe className="w-8 h-8 flex-shrink-0" />
        <div>
          <h2 className="text-xl font-bold mb-2">{blueprint.internationalPatients.title}</h2>
          <p className="text-white/80 text-sm">{blueprint.internationalPatients.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {blueprint.internationalPatients.features.slice(0, 6).map(f => (
          <div key={f} className="flex items-center gap-2 text-xs text-white/90">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />{f}
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: blueprint.palette.surface }}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: blueprint.palette.text }}>Patient Stories</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {blueprint.testimonials.slice(0, 2).map(t => (
          <div key={t.name} className="p-4 rounded-xl bg-white">
            <div className="flex gap-0.5 mb-2">
              {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-sm text-slate-600 italic mb-3 line-clamp-3">&quot;{t.quote}&quot;</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: blueprint.palette.gradient }}>{t.name[0]}</div>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-slate-400">{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  if (!blueprint.news) return null;
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: blueprint.palette.text }}>Latest News</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {blueprint.news.map(item => (
          <div key={item.title} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="h-24" style={{ background: blueprint.palette.surface }} />
            <div className="p-3">
              <div className="text-xs text-slate-400 mb-1">{item.date}</div>
              <h3 className="text-sm font-semibold line-clamp-2" style={{ color: blueprint.palette.text }}>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  const [openIndex, setOpenIndex] = React.useState<number>(0);
  if (!blueprint.faqs) return null;
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: blueprint.palette.text }}>Frequently Asked Questions</h2>
      </div>
      <div className="space-y-2 max-w-2xl mx-auto">
        {blueprint.faqs.slice(0, 4).map((faq, idx) => (
          <div key={faq.question} className="rounded-lg overflow-hidden bg-white">
            <button className="w-full px-4 py-3 flex items-center justify-between text-left" onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}>
              <span className="text-sm font-medium pr-4" style={{ color: blueprint.palette.text }}>{faq.question}</span>
              {openIndex === idx ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 flex-shrink-0 text-slate-400" />}
            </button>
            {openIndex === idx && <div className="px-4 pb-3 text-xs text-slate-600">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function FacilitiesSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: blueprint.palette.text }}>Our Facilities</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {blueprint.facilityHighlights.slice(0, 3).map(f => (
          <div key={f.title} className="rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="h-28" style={{ background: blueprint.palette.surface }} />
            <div className="p-3">
              <h3 className="text-sm font-semibold" style={{ color: blueprint.palette.text }}>{f.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterSection({ blueprint }: { blueprint: TemplateBlueprint }) {
  return (
    <footer className="mt-12 bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">{blueprint.footer.tagline}</h3>
            <p className="text-slate-400 text-sm">Excellence in healthcare, compassion in care.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-1.5">
              {blueprint.footer.links.slice(0, 4).map(link => <li key={link.label} className="text-slate-400 text-xs hover:text-white cursor-pointer">{link.label}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> 1800-XXX-XXXX</div>
              <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> info@hospital.com</div>
              <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Hospital Address</div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500">{blueprint.footer.copyright}</div>
      </div>
    </footer>
  );
}
