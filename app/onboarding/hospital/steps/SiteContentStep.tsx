/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * Step 4: Site Content Editor
 *
 * This step allows hospitals to craft their website content including:
 * - Hero section (headline, subtext, CTA)
 * - Services highlights
 * - Specialty descriptions
 * - Patient testimonials with consent forms
 * - FAQ entries
 * - Blog/news teasers
 *
 * Features:
 * - Word counters for text fields
 * - AI-assisted content suggestions (placeholder)
 * - Drag-to-reorder lists
 * - File upload for testimonial consents
 * - Character/word limits with live validation
 */

import React from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles, X } from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { HelpPopover } from "../widgets/HelpPopover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { countWords } from "@/lib/onboarding-utils";

export default function SiteContentStep() {
  const { data, updateData } = useHospitalOnboarding();
  const content = data.siteContent;

  // TODO: Implement hero section editor
  // TODO: Implement services highlights (min 3)
  // TODO: Implement specialty blurbs editor
  // TODO: Implement testimonials with consent upload
  // TODO: Implement FAQ editor
  // TODO: Implement blog teasers
  // TODO: Add word counters
  // TODO: Add AI suggestion placeholders

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hero Section
        </h3>

        <div className="space-y-4">
          <FormField label="Headline" required wordCount maxWords={80}>
            <Input
              value={content.hero.headline}
              onChange={(e) =>
                updateData("siteContent", {
                  hero: { ...content.hero, headline: e.target.value },
                })
              }
              placeholder="e.g., World-Class Healthcare, Close to Home"
            />
          </FormField>

          <FormField label="Subtext" required wordCount maxWords={200}>
            <Textarea
              value={content.hero.subtext}
              onChange={(e) =>
                updateData("siteContent", {
                  hero: { ...content.hero, subtext: e.target.value },
                })
              }
              placeholder="Brief description of your hospital's mission and services"
              rows={3}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="CTA Button Text" required>
              <Input
                value={content.hero.cta_text}
                onChange={(e) =>
                  updateData("siteContent", {
                    hero: { ...content.hero, cta_text: e.target.value },
                  })
                }
                placeholder="e.g., Book Appointment"
              />
            </FormField>

            <FormField label="CTA URL" required>
              <Input
                value={content.hero.cta_url}
                onChange={(e) =>
                  updateData("siteContent", {
                    hero: { ...content.hero, cta_url: e.target.value },
                  })
                }
                placeholder="/appointments"
              />
            </FormField>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            AI: Suggest Hero Content (Coming Soon)
          </Button>
        </div>
      </motion.div>

      {/* Services Highlights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-healthcare-primary/5 to-healthcare-teal/5 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Services Highlights
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Showcase your key services (minimum 3)
          </p>
        </div>

        <div className="p-6 space-y-4">
          {data.siteContent.services_highlights?.map(
            (service: any, index: number) => (
              <div
                key={service.id || index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    Service #{index + 1}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = [
                        ...(data.siteContent.services_highlights || []),
                      ];
                      updated.splice(index, 1);
                      updateData("siteContent", {
                        services_highlights: updated,
                      });
                    }}
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Icon" required>
                    <Select
                      value={service.icon}
                      onValueChange={(value) => {
                        const updated = [
                          ...(data.siteContent.services_highlights || []),
                        ];
                        updated[index] = { ...updated[index], icon: value };
                        updateData("siteContent", {
                          services_highlights: updated,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heart">
                          ❤️ Heart (Cardiology)
                        </SelectItem>
                        <SelectItem value="brain">
                          🧠 Brain (Neurology)
                        </SelectItem>
                        <SelectItem value="bone">
                          🦴 Bone (Orthopedics)
                        </SelectItem>
                        <SelectItem value="eye">
                          👁️ Eye (Ophthalmology)
                        </SelectItem>
                        <SelectItem value="tooth">
                          🦷 Tooth (Dentistry)
                        </SelectItem>
                        <SelectItem value="baby">
                          👶 Baby (Pediatrics)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Title" required>
                    <Input
                      value={service.title}
                      onChange={(e) => {
                        const updated = [
                          ...(data.siteContent.services_highlights || []),
                        ];
                        updated[index] = {
                          ...updated[index],
                          title: e.target.value,
                        };
                        updateData("siteContent", {
                          services_highlights: updated,
                        });
                      }}
                      placeholder="e.g., Advanced Cardiology"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Description"
                  required
                  wordCount
                  maxWords={150}
                >
                  <Textarea
                    value={service.description}
                    onChange={(e) => {
                      const updated = [
                        ...(data.siteContent.services_highlights || []),
                      ];
                      updated[index] = {
                        ...updated[index],
                        description: e.target.value,
                      };
                      updateData("siteContent", {
                        services_highlights: updated,
                      });
                    }}
                    placeholder="Describe this service..."
                    rows={3}
                  />
                </FormField>
              </div>
            )
          )}

          <Button
            variant="outline"
            onClick={() => {
              const newService = {
                id: String(Date.now()),
                icon: "",
                title: "",
                description: "",
              };
              updateData("siteContent", {
                services_highlights: [
                  ...(data.siteContent.services_highlights || []),
                  newService,
                ],
              });
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service Highlight
          </Button>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Patient Testimonials
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Share patient feedback (minimum 2 with consent)
          </p>
        </div>

        <div className="p-6 space-y-4">
          {data.siteContent.testimonials?.map(
            (testimonial: any, index: number) => (
              <div
                key={testimonial.id || index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    Testimonial #{index + 1}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updated = [
                        ...(data.siteContent.testimonials || []),
                      ];
                      updated.splice(index, 1);
                      updateData("siteContent", { testimonials: updated });
                    }}
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Patient Name" required>
                    <Input
                      value={testimonial.patient_name}
                      onChange={(e) => {
                        const updated = [
                          ...(data.siteContent.testimonials || []),
                        ];
                        updated[index] = {
                          ...updated[index],
                          patient_name: e.target.value,
                        };
                        updateData("siteContent", { testimonials: updated });
                      }}
                      placeholder="e.g., Mrs. Sharma"
                    />
                  </FormField>

                  <FormField label="Rating" required>
                    <Select
                      value={String(testimonial.rating)}
                      onValueChange={(value) => {
                        const updated = [
                          ...(data.siteContent.testimonials || []),
                        ];
                        updated[index] = {
                          ...updated[index],
                          rating: Number(value),
                        };
                        updateData("siteContent", { testimonials: updated });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <FormField
                  label="Testimonial"
                  required
                  wordCount
                  maxWords={200}
                >
                  <Textarea
                    value={testimonial.testimonial}
                    onChange={(e) => {
                      const updated = [
                        ...(data.siteContent.testimonials || []),
                      ];
                      updated[index] = {
                        ...updated[index],
                        testimonial: e.target.value,
                      };
                      updateData("siteContent", { testimonials: updated });
                    }}
                    placeholder="Patient's feedback..."
                    rows={4}
                  />
                </FormField>

                <FormField label="Date">
                  <Input
                    type="date"
                    value={testimonial.date}
                    onChange={(e) => {
                      const updated = [
                        ...(data.siteContent.testimonials || []),
                      ];
                      updated[index] = {
                        ...updated[index],
                        date: e.target.value,
                      };
                      updateData("siteContent", { testimonials: updated });
                    }}
                  />
                </FormField>
              </div>
            )
          )}

          <Button
            variant="outline"
            onClick={() => {
              const newTestimonial = {
                id: String(Date.now()),
                patient_name: "",
                rating: 5,
                testimonial: "",
                date: new Date().toISOString().split("T")[0],
              };
              updateData("siteContent", {
                testimonials: [
                  ...(data.siteContent.testimonials || []),
                  newTestimonial,
                ],
              });
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Answer common patient questions (minimum 5)
          </p>
        </div>

        <div className="p-6 space-y-4">
          {data.siteContent.faq?.map((item: any, index: number) => (
            <div
              key={item.id || index}
              className="border border-gray-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  FAQ #{index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updated = [...(data.siteContent.faq || [])];
                    updated.splice(index, 1);
                    updateData("siteContent", { faq: updated });
                  }}
                >
                  <X className="w-4 h-4 text-red-600" />
                </Button>
              </div>

              <FormField label="Question" required>
                <Input
                  value={item.question}
                  onChange={(e) => {
                    const updated = [...(data.siteContent.faq || [])];
                    updated[index] = {
                      ...updated[index],
                      question: e.target.value,
                    };
                    updateData("siteContent", { faq: updated });
                  }}
                  placeholder="e.g., What are your visiting hours?"
                />
              </FormField>

              <FormField label="Answer" required wordCount maxWords={300}>
                <Textarea
                  value={item.answer}
                  onChange={(e) => {
                    const updated = [...(data.siteContent.faq || [])];
                    updated[index] = {
                      ...updated[index],
                      answer: e.target.value,
                    };
                    updateData("siteContent", { faq: updated });
                  }}
                  placeholder="Provide a detailed answer..."
                  rows={3}
                />
              </FormField>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={() => {
              const newFaq = {
                id: String(Date.now()),
                question: "",
                answer: "",
              };
              updateData("siteContent", {
                faq: [...(data.siteContent.faq || []), newFaq],
              });
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </motion.div>

      {/* Blog/News Teasers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Blog/News Teasers
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Highlight recent updates (exactly 3)
          </p>
        </div>

        <div className="p-6 space-y-4">
          {data.siteContent.blog_teasers?.map((teaser: any, index: number) => (
            <div
              key={teaser.id || index}
              className="border border-gray-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  Blog Post #{index + 1}
                </h4>
                {data.siteContent.blog_teasers &&
                  data.siteContent.blog_teasers.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = [
                          ...(data.siteContent.blog_teasers || []),
                        ];
                        updated.splice(index, 1);
                        updateData("siteContent", { blog_teasers: updated });
                      }}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
              </div>

              <FormField label="Title" required>
                <Input
                  value={teaser.title}
                  onChange={(e) => {
                    const updated = [...(data.siteContent.blog_teasers || [])];
                    updated[index] = {
                      ...updated[index],
                      title: e.target.value,
                    };
                    updateData("siteContent", { blog_teasers: updated });
                  }}
                  placeholder="e.g., New Heart Surgery Wing Opens"
                />
              </FormField>

              <FormField label="Excerpt" required wordCount maxWords={100}>
                <Textarea
                  value={teaser.excerpt}
                  onChange={(e) => {
                    const updated = [...(data.siteContent.blog_teasers || [])];
                    updated[index] = {
                      ...updated[index],
                      excerpt: e.target.value,
                    };
                    updateData("siteContent", { blog_teasers: updated });
                  }}
                  placeholder="Brief summary..."
                  rows={2}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Publish Date" required>
                  <Input
                    type="date"
                    value={teaser.publish_date}
                    onChange={(e) => {
                      const updated = [
                        ...(data.siteContent.blog_teasers || []),
                      ];
                      updated[index] = {
                        ...updated[index],
                        publish_date: e.target.value,
                      };
                      updateData("siteContent", { blog_teasers: updated });
                    }}
                  />
                </FormField>

                <FormField label="Author">
                  <Input
                    value={teaser.author}
                    onChange={(e) => {
                      const updated = [
                        ...(data.siteContent.blog_teasers || []),
                      ];
                      updated[index] = {
                        ...updated[index],
                        author: e.target.value,
                      };
                      updateData("siteContent", { blog_teasers: updated });
                    }}
                    placeholder="Author name"
                  />
                </FormField>
              </div>
            </div>
          ))}

          {(!data.siteContent.blog_teasers ||
            data.siteContent.blog_teasers.length < 3) && (
            <Button
              variant="outline"
              onClick={() => {
                const newTeaser = {
                  id: String(Date.now()),
                  title: "",
                  excerpt: "",
                  publish_date: new Date().toISOString().split("T")[0],
                  author: "",
                };
                updateData("siteContent", {
                  blog_teasers: [
                    ...(data.siteContent.blog_teasers || []),
                    newTeaser,
                  ],
                });
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Teaser
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  wordCount?: boolean;
  maxWords?: number;
  help?: {
    title: string;
    content: string;
    examples?: string[];
    tips?: string[];
  };
  children: React.ReactElement;
}

function FormField({
  label,
  required,
  wordCount,
  maxWords,
  help,
  children,
}: FormFieldProps) {
  const value = (children.props as any)?.value || "";
  const words = countWords(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {help && <HelpPopover {...help} />}
        </div>
        {wordCount && (
          <Badge
            variant={maxWords && words > maxWords ? "destructive" : "secondary"}
            className="text-xs"
          >
            {words} {maxWords && `/ ${maxWords}`} words
          </Badge>
        )}
      </div>
      {children}
    </div>
  );
}
