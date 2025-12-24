"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, PlayCircle, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText, EditableStat, EditableListItem } from "./EditableText";
import type {
  TemplateBlueprint,
  UploadedImageData,
} from "./templateBlueprints";
import { Button } from "@/components/ui/button";
import {
  LogoUploader,
  HeroImageUploader,
  AvatarUploader,
  FacilityImageUploader,
} from "./ImageUploader";

export interface EditableTemplatePreviewRendererProps {
  blueprint: TemplateBlueprint;
  device: "desktop" | "tablet" | "mobile";
  onBlueprintChange: (updatedBlueprint: TemplateBlueprint) => void;
  isEditMode?: boolean;
}

const sectionAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

/**
 * EditableTemplatePreviewRenderer - A WYSIWYG canvas for editing website templates.
 * Each section is editable inline. Changes are propagated up to the parent via onBlueprintChange.
 */
export function EditableTemplatePreviewRenderer({
  blueprint,
  device,
  onBlueprintChange,
  isEditMode = true,
}: EditableTemplatePreviewRendererProps) {
  // Helper to update nested properties immutably
  const updateBlueprint = <K extends keyof TemplateBlueprint>(
    key: K,
    value: TemplateBlueprint[K]
  ) => {
    onBlueprintChange({ ...blueprint, [key]: value });
  };

  const updateHero = (updates: Partial<TemplateBlueprint["hero"]>) => {
    updateBlueprint("hero", { ...blueprint.hero, ...updates });
  };

  const updateImages = (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => {
    updateBlueprint("images", { ...blueprint.images, ...updates });
  };

  return (
    <div
      className={cn(
        "h-full w-full overflow-y-auto bg-white",
        device === "desktop" && "px-0",
        device === "tablet" && "scale-[0.92] origin-top",
        device === "mobile" && "scale-[0.7] origin-top"
      )}
      style={{
        background: blueprint.palette.background,
        fontFamily: blueprint.typography.body,
      }}
    >
      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="sticky top-0 z-50 bg-healthcare-primary/95 text-white px-4 py-2 text-center text-sm backdrop-blur">
          <span className="font-medium">🎨 Canvas Mode</span> — Click on any
          text to edit, hover on images to upload. Your changes are saved
          automatically.
        </div>
      )}

      <main className="min-h-full">
        <EditableHeroSection
          blueprint={blueprint}
          onUpdate={updateHero}
          onImageUpdate={updateImages}
          isEditMode={isEditMode}
        />
        <EditableStatsStrip
          blueprint={blueprint}
          onUpdate={(stats) => updateHero({ stats })}
          isEditMode={isEditMode}
        />
        <EditableSpecialtiesSection
          blueprint={blueprint}
          onUpdate={(specialties) =>
            updateBlueprint("specialties", specialties)
          }
          isEditMode={isEditMode}
        />
        <EditableDifferentiatorsSection
          blueprint={blueprint}
          onUpdate={(differentiators) =>
            updateBlueprint("differentiators", differentiators)
          }
          isEditMode={isEditMode}
        />
        <EditableDoctorsSection
          blueprint={blueprint}
          onUpdate={(doctors) => updateBlueprint("doctors", doctors)}
          onImageUpdate={updateImages}
          isEditMode={isEditMode}
        />
        <EditableFacilitySection
          blueprint={blueprint}
          onUpdate={(facilityHighlights) =>
            updateBlueprint("facilityHighlights", facilityHighlights)
          }
          onImageUpdate={updateImages}
          isEditMode={isEditMode}
        />
        <EditableTestimonialsSection
          blueprint={blueprint}
          onUpdate={(testimonials) =>
            updateBlueprint("testimonials", testimonials)
          }
          isEditMode={isEditMode}
        />
        <EditableProgramsSection
          blueprint={blueprint}
          onUpdate={(programs) => updateBlueprint("programs", programs)}
          isEditMode={isEditMode}
        />
        <EditableFooter
          blueprint={blueprint}
          onUpdate={(footer) => updateBlueprint("footer", footer)}
          isEditMode={isEditMode}
        />
      </main>
    </div>
  );
}

// ============================================================================
// EDITABLE HERO SECTION
// ============================================================================

interface EditableHeroSectionProps {
  blueprint: TemplateBlueprint;
  onUpdate: (updates: Partial<TemplateBlueprint["hero"]>) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
  isEditMode: boolean;
}

function EditableHeroSection({
  blueprint,
  onUpdate,
  onImageUpdate,
  isEditMode,
}: EditableHeroSectionProps) {
  const heroImage = blueprint.images?.heroImage;
  const logoImage = blueprint.images?.logo;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: blueprint.palette.gradient,
        color: "white",
        fontFamily: blueprint.typography.heading,
      }}
    >
      {/* Logo Upload Area - Top Left */}
      {isEditMode && (
        <div className="absolute top-4 left-8 z-20">
          <div className="bg-white/10 backdrop-blur rounded-xl p-2 border border-white/20">
            <p className="text-[10px] text-white/60 mb-1 text-center">
              Hospital Logo
            </p>
            <LogoUploader
              value={logoImage || null}
              onChange={(img) => onImageUpdate({ logo: img || undefined })}
              className="w-32"
            />
          </div>
        </div>
      )}

      {/* Show logo if uploaded (non-edit mode) */}
      {!isEditMode && logoImage?.previewUrl && (
        <div className="absolute top-4 left-8 z-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoImage.previewUrl}
            alt="Hospital Logo"
            className="h-12 object-contain"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-8 py-16 md:flex-row md:items-center">
        <div className="flex-1 space-y-5 pt-16 md:pt-0">
          {/* Eyebrow */}
          {isEditMode ? (
            <EditableText
              value={blueprint.hero.eyebrow}
              onChange={(val) => onUpdate({ eyebrow: val })}
              as="span"
              className="text-sm uppercase tracking-[0.4em] text-white/70"
              placeholder="Your Tagline"
              editIndicator="border"
            />
          ) : (
            <span className="text-sm uppercase tracking-[0.4em] text-white/70">
              {blueprint.hero.eyebrow}
            </span>
          )}

          {/* Title */}
          {isEditMode ? (
            <EditableText
              value={blueprint.hero.title}
              onChange={(val) => onUpdate({ title: val })}
              as="h1"
              className="text-4xl font-semibold leading-tight md:text-5xl text-white"
              placeholder="Your Hospital Name"
              editIndicator="both"
            />
          ) : (
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              {blueprint.hero.title}
            </h1>
          )}

          {/* Subtitle */}
          {isEditMode ? (
            <EditableText
              value={blueprint.hero.subtitle}
              onChange={(val) => onUpdate({ subtitle: val })}
              as="p"
              className="text-lg text-white/80"
              style={{ fontFamily: blueprint.typography.body }}
              placeholder="Describe your hospital's mission and specialties..."
              multiline
              editIndicator="border"
            />
          ) : (
            <p
              className="text-lg text-white/80"
              style={{ fontFamily: blueprint.typography.body }}
            >
              {blueprint.hero.subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            {isEditMode ? (
              <>
                <div className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg">
                  <EditableText
                    value={blueprint.hero.primaryCta.label}
                    onChange={(val) =>
                      onUpdate({
                        primaryCta: {
                          ...blueprint.hero.primaryCta,
                          label: val,
                        },
                      })
                    }
                    className="text-slate-900"
                    placeholder="Primary Button"
                    editIndicator="none"
                  />
                </div>
                <div className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90">
                  <EditableText
                    value={blueprint.hero.secondaryCta.label}
                    onChange={(val) =>
                      onUpdate({
                        secondaryCta: {
                          ...blueprint.hero.secondaryCta,
                          label: val,
                        },
                      })
                    }
                    className="text-white/90"
                    placeholder="Secondary Button"
                    editIndicator="none"
                  />
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Hero Media Preview with Image Upload */}
        <div className="mt-8 flex flex-1 justify-center md:mt-0">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-2">
              {isEditMode ? "Upload Hospital Image/Video" : "Featured Media"}
            </p>

            {isEditMode ? (
              <HeroImageUploader
                value={heroImage || null}
                onChange={(img) =>
                  onImageUpdate({ heroImage: img || undefined })
                }
                className="w-64"
              />
            ) : heroImage?.previewUrl ? (
              <div className="h-48 w-64 rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage.previewUrl}
                  alt={blueprint.hero.heroImageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-48 w-64 rounded-2xl bg-black/30 shadow-inner">
                <div className="flex h-full items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-white/60" />
                </div>
              </div>
            )}

            {isEditMode ? (
              <EditableText
                value={blueprint.hero.heroImageAlt}
                onChange={(val) => onUpdate({ heroImageAlt: val })}
                as="p"
                className="mt-3 text-xs text-white/80"
                placeholder="Media caption..."
                editIndicator="none"
              />
            ) : (
              <p className="mt-3 text-xs text-white/80">
                {blueprint.hero.heroImageAlt}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff22,transparent_55%)]" />
    </section>
  );
}

// ============================================================================
// EDITABLE STATS STRIP
// ============================================================================

interface EditableStatsStripProps {
  blueprint: TemplateBlueprint;
  onUpdate: (stats: TemplateBlueprint["hero"]["stats"]) => void;
  isEditMode: boolean;
}

function EditableStatsStrip({
  blueprint,
  onUpdate,
  isEditMode,
}: EditableStatsStripProps) {
  const updateStat = (
    index: number,
    field: "value" | "label",
    newVal: string
  ) => {
    const newStats = [...blueprint.hero.stats];
    newStats[index] = { ...newStats[index], [field]: newVal };
    onUpdate(newStats);
  };

  const addStat = () => {
    onUpdate([...blueprint.hero.stats, { label: "New Stat", value: "0" }]);
  };

  const removeStat = (index: number) => {
    const newStats = blueprint.hero.stats.filter((_, i) => i !== index);
    onUpdate(newStats);
  };

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-10 text-center sm:grid-cols-3">
      {blueprint.hero.stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "relative rounded-2xl border border-white/40 bg-white/80 p-6 shadow-sm",
            isEditMode && "group"
          )}
        >
          {isEditMode && (
            <button
              onClick={() => removeStat(index)}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
              title="Remove stat"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {isEditMode ? (
            <EditableStat
              value={stat.value}
              label={stat.label}
              onValueChange={(val) => updateStat(index, "value", val)}
              onLabelChange={(val) => updateStat(index, "label", val)}
              accentColor={blueprint.palette.accent}
            />
          ) : (
            <>
              <p
                className="text-3xl font-bold"
                style={{ color: blueprint.palette.accent }}
              >
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
            </>
          )}
        </div>
      ))}

      {/* Add Stat Button */}
      {isEditMode && blueprint.hero.stats.length < 5 && (
        <button
          onClick={addStat}
          className="rounded-2xl border-2 border-dashed border-gray-300 p-6 flex items-center justify-center gap-2 text-gray-500 hover:border-healthcare-primary hover:text-healthcare-primary transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Stat
        </button>
      )}
    </div>
  );
}

// ============================================================================
// EDITABLE SPECIALTIES SECTION
// ============================================================================

interface EditableSpecialtiesSectionProps {
  blueprint: TemplateBlueprint;
  onUpdate: (specialties: TemplateBlueprint["specialties"]) => void;
  isEditMode: boolean;
}

function EditableSpecialtiesSection({
  blueprint,
  onUpdate,
  isEditMode,
}: EditableSpecialtiesSectionProps) {
  const updateSpecialty = (
    index: number,
    field: keyof TemplateBlueprint["specialties"][0],
    value: string
  ) => {
    const newSpecialties = [...blueprint.specialties];
    newSpecialties[index] = { ...newSpecialties[index], [field]: value };
    onUpdate(newSpecialties);
  };

  const addSpecialty = () => {
    onUpdate([
      ...blueprint.specialties,
      {
        icon: "🏥",
        title: "New Specialty",
        description: "Add description here...",
      },
    ]);
  };

  const removeSpecialty = (index: number) => {
    const newSpecialties = blueprint.specialties.filter((_, i) => i !== index);
    onUpdate(newSpecialties);
  };

  return (
    <motion.section
      {...sectionAnimation}
      className="mx-auto max-w-6xl px-6 py-12"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Centres of Excellence
          </p>
          <h2
            className="text-3xl font-semibold text-slate-900"
            style={{ fontFamily: blueprint.typography.heading }}
          >
            {isEditMode
              ? "Our Specialties"
              : "Specialty depth built for outcomes"}
          </h2>
        </div>
        {isEditMode && (
          <Button variant="outline" size="sm" onClick={addSpecialty}>
            <Plus className="w-4 h-4 mr-1" /> Add Specialty
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {blueprint.specialties.map((specialty, index) => (
          <div
            key={index}
            className={cn(
              "relative rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm",
              isEditMode && "group"
            )}
          >
            {isEditMode && (
              <button
                onClick={() => removeSpecialty(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                title="Remove specialty"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}

            {isEditMode ? (
              <EditableListItem
                icon={specialty.icon || ""}
                title={specialty.title || ""}
                description={specialty.description || ""}
                onIconChange={(val) => updateSpecialty(index, "icon", val)}
                onTitleChange={(val) => updateSpecialty(index, "title", val)}
                onDescriptionChange={(val) =>
                  updateSpecialty(index, "description", val)
                }
              />
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-hidden>
                  {specialty.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {specialty.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {specialty.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// ============================================================================
// EDITABLE DIFFERENTIATORS SECTION
// ============================================================================

interface EditableDifferentiatorsSectionProps {
  blueprint: TemplateBlueprint;
  onUpdate: (differentiators: TemplateBlueprint["differentiators"]) => void;
  isEditMode: boolean;
}

function EditableDifferentiatorsSection({
  blueprint,
  onUpdate,
  isEditMode,
}: EditableDifferentiatorsSectionProps) {
  const updateDifferentiator = (
    index: number,
    field: keyof TemplateBlueprint["differentiators"][0],
    value: string
  ) => {
    const newDifferentiators = [...blueprint.differentiators];
    newDifferentiators[index] = {
      ...newDifferentiators[index],
      [field]: value,
    };
    onUpdate(newDifferentiators);
  };

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
        {blueprint.differentiators.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200/80 bg-white px-5 py-6 shadow"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Why it works
            </p>
            {isEditMode ? (
              <>
                <EditableText
                  value={item.title}
                  onChange={(val) => updateDifferentiator(index, "title", val)}
                  as="h3"
                  className="mt-2 text-xl font-semibold text-slate-900"
                  placeholder="Title"
                  editIndicator="border"
                />
                <EditableText
                  value={item.description}
                  onChange={(val) =>
                    updateDifferentiator(index, "description", val)
                  }
                  as="p"
                  className="text-sm text-slate-600"
                  placeholder="Description..."
                  multiline
                  editIndicator="none"
                />
              </>
            ) : (
              <>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// EDITABLE DOCTORS SECTION
// ============================================================================

interface EditableDoctorsSectionProps {
  blueprint: TemplateBlueprint;
  onUpdate: (doctors: TemplateBlueprint["doctors"]) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
  isEditMode: boolean;
}

function EditableDoctorsSection({
  blueprint,
  onUpdate,
  onImageUpdate,
  isEditMode,
}: EditableDoctorsSectionProps) {
  const doctorAvatars = blueprint.images?.doctorAvatars || [];

  const updateDoctor = (
    index: number,
    field: keyof TemplateBlueprint["doctors"][0],
    value: string
  ) => {
    const newDoctors = [...blueprint.doctors];
    newDoctors[index] = { ...newDoctors[index], [field]: value };
    onUpdate(newDoctors);
  };

  const updateDoctorAvatar = (
    index: number,
    avatar: UploadedImageData | null
  ) => {
    const newAvatars = [...doctorAvatars];
    if (avatar) {
      newAvatars[index] = avatar;
    } else {
      newAvatars[index] = undefined as unknown as UploadedImageData;
    }
    onImageUpdate({ doctorAvatars: newAvatars.filter(Boolean) });
  };

  const addDoctor = () => {
    onUpdate([
      ...blueprint.doctors,
      {
        name: "Dr. New Doctor",
        specialty: "Specialty",
        description: "Add bio here...",
        mediaLabel: "Watch Video",
      },
    ]);
  };

  const removeDoctor = (index: number) => {
    const newDoctors = blueprint.doctors.filter((_, i) => i !== index);
    onUpdate(newDoctors);
    // Also remove avatar
    const newAvatars = doctorAvatars.filter(
      (_: UploadedImageData | undefined, i: number) => i !== index
    );
    onImageUpdate({ doctorAvatars: newAvatars });
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Physician voices
          </p>
          <h2
            className="text-3xl font-semibold text-slate-900"
            style={{ fontFamily: blueprint.typography.heading }}
          >
            Meet the program leads
          </h2>
        </div>
        <div className="flex gap-2">
          {isEditMode && (
            <Button variant="outline" size="sm" onClick={addDoctor}>
              <Plus className="w-4 h-4 mr-1" /> Add Doctor
            </Button>
          )}
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            View all doctors
          </button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {blueprint.doctors.map((doctor, index) => (
          <div
            key={index}
            className={cn(
              "relative rounded-3xl border border-slate-200 bg-white p-6 shadow-lg",
              isEditMode && "group"
            )}
          >
            {isEditMode && (
              <button
                onClick={() => removeDoctor(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                title="Remove doctor"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}

            <div className="flex items-center gap-4">
              {/* Doctor Avatar */}
              {isEditMode ? (
                <div className="flex-shrink-0">
                  <AvatarUploader
                    value={doctorAvatars[index] || null}
                    onChange={(img) => updateDoctorAvatar(index, img)}
                  />
                </div>
              ) : doctorAvatars[index]?.previewUrl ? (
                <div className="h-16 w-16 rounded-2xl overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doctorAvatars[index].previewUrl}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl flex-shrink-0">
                  👨‍⚕️
                </div>
              )}

              <div className="flex-1">
                {isEditMode ? (
                  <>
                    <EditableText
                      value={doctor.specialty}
                      onChange={(val) => updateDoctor(index, "specialty", val)}
                      as="p"
                      className="text-sm uppercase tracking-[0.3em] text-slate-400"
                      placeholder="Specialty"
                      editIndicator="none"
                    />
                    <EditableText
                      value={doctor.name}
                      onChange={(val) => updateDoctor(index, "name", val)}
                      as="h3"
                      className="text-2xl font-semibold text-slate-900"
                      placeholder="Doctor Name"
                      editIndicator="border"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                      {doctor.specialty}
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      {doctor.name}
                    </h3>
                  </>
                )}
              </div>
            </div>
            {isEditMode ? (
              <EditableText
                value={doctor.description}
                onChange={(val) => updateDoctor(index, "description", val)}
                as="p"
                className="mt-4 text-sm text-slate-600"
                placeholder="Doctor bio..."
                multiline
                editIndicator="none"
              />
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                {doctor.description}
              </p>
            )}
            <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <PlayCircle className="h-4 w-4" />
              {isEditMode ? (
                <EditableText
                  value={doctor.mediaLabel}
                  onChange={(val) => updateDoctor(index, "mediaLabel", val)}
                  className="text-slate-900"
                  placeholder="Button label"
                  editIndicator="none"
                />
              ) : (
                doctor.mediaLabel
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// EDITABLE FACILITY SECTION
// ============================================================================

interface EditableFacilitySectionProps {
  blueprint: TemplateBlueprint;
  onUpdate: (
    facilityHighlights: TemplateBlueprint["facilityHighlights"]
  ) => void;
  onImageUpdate: (
    updates: Partial<NonNullable<TemplateBlueprint["images"]>>
  ) => void;
  isEditMode: boolean;
}

function EditableFacilitySection({
  blueprint,
  onUpdate,
  onImageUpdate,
  isEditMode,
}: EditableFacilitySectionProps) {
  const facilityImages = blueprint.images?.facilityImages || [];

  const updateHighlight = (
    index: number,
    field: keyof TemplateBlueprint["facilityHighlights"][0],
    value: string
  ) => {
    const newHighlights = [...blueprint.facilityHighlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    onUpdate(newHighlights);
  };

  const updateFacilityImage = (
    index: number,
    image: UploadedImageData | null
  ) => {
    const newImages = [...facilityImages];
    if (image) {
      newImages[index] = image;
    } else {
      newImages[index] = undefined as unknown as UploadedImageData;
    }
    onImageUpdate({ facilityImages: newImages.filter(Boolean) });
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Campus snapshots
          </p>
          <h2
            className="text-3xl font-semibold text-slate-900"
            style={{ fontFamily: blueprint.typography.heading }}
          >
            Designed for families & teams
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {blueprint.facilityHighlights.map((highlight, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white shadow overflow-hidden"
            >
              {/* Facility Image */}
              {isEditMode ? (
                <div className="h-40 bg-slate-50">
                  <FacilityImageUploader
                    value={facilityImages[index] || null}
                    onChange={(img) => updateFacilityImage(index, img)}
                    className="h-full"
                  />
                </div>
              ) : facilityImages[index]?.previewUrl ? (
                <div className="h-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={facilityImages[index].previewUrl}
                    alt={highlight.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                  <span className="text-4xl">🏛️</span>
                </div>
              )}

              <div className="space-y-2 p-5">
                {isEditMode ? (
                  <>
                    <EditableText
                      value={highlight.title}
                      onChange={(val) => updateHighlight(index, "title", val)}
                      as="h3"
                      className="text-lg font-semibold text-slate-900"
                      placeholder="Facility name"
                      editIndicator="border"
                    />
                    <EditableText
                      value={highlight.copy}
                      onChange={(val) => updateHighlight(index, "copy", val)}
                      as="p"
                      className="text-sm text-slate-600"
                      placeholder="Description..."
                      multiline
                      editIndicator="none"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-slate-600">{highlight.copy}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EDITABLE TESTIMONIALS SECTION
// ============================================================================

interface EditableTestimonialsSectionProps {
  blueprint: TemplateBlueprint;
  onUpdate: (testimonials: TemplateBlueprint["testimonials"]) => void;
  isEditMode: boolean;
}

function EditableTestimonialsSection({
  blueprint,
  onUpdate,
  isEditMode,
}: EditableTestimonialsSectionProps) {
  const updateTestimonial = (
    index: number,
    field: keyof TemplateBlueprint["testimonials"][0],
    value: string
  ) => {
    const newTestimonials = [...blueprint.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    onUpdate(newTestimonials);
  };

  return (
    <section className="bg-slate-900/95 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Quote className="h-8 w-8 text-white/60" />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">
              Family stories
            </p>
            <h2
              className="text-3xl font-semibold"
              style={{ fontFamily: blueprint.typography.heading }}
            >
              Trust that travels borders
            </h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {blueprint.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg"
            >
              {isEditMode ? (
                <>
                  <EditableText
                    value={testimonial.quote}
                    onChange={(val) => updateTestimonial(index, "quote", val)}
                    as="p"
                    className="text-lg font-medium leading-relaxed text-white/90"
                    placeholder="Patient testimonial..."
                    multiline
                    editIndicator="border"
                  />
                  <div className="mt-4 flex gap-2 text-sm text-white/70">
                    <EditableText
                      value={testimonial.patient || ""}
                      onChange={(val) =>
                        updateTestimonial(index, "patient", val)
                      }
                      className="text-white/70"
                      placeholder="Patient name"
                      editIndicator="none"
                    />
                    <span>·</span>
                    <EditableText
                      value={testimonial.procedure || ""}
                      onChange={(val) =>
                        updateTestimonial(index, "procedure", val)
                      }
                      className="text-white/70"
                      placeholder="Procedure"
                      editIndicator="none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium leading-relaxed text-white/90">
                    {testimonial.quote}
                  </p>
                  <div className="mt-4 text-sm text-white/70">
                    {testimonial.patient} · {testimonial.procedure}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EDITABLE PROGRAMS SECTION
// ============================================================================

interface EditableProgramsSectionProps {
  blueprint: TemplateBlueprint;
  onUpdate: (programs: TemplateBlueprint["programs"]) => void;
  isEditMode: boolean;
}

function EditableProgramsSection({
  blueprint,
  onUpdate,
  isEditMode,
}: EditableProgramsSectionProps) {
  const updateProgram = (
    index: number,
    field: keyof TemplateBlueprint["programs"][0],
    value: string
  ) => {
    const newPrograms = [...blueprint.programs];
    newPrograms[index] = { ...newPrograms[index], [field]: value };
    onUpdate(newPrograms);
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Signature programs
            </p>
            <h2
              className="text-3xl font-semibold text-slate-900"
              style={{ fontFamily: blueprint.typography.heading }}
            >
              Pathways built with you
            </h2>
          </div>
          <button className="text-sm font-semibold text-slate-700">
            View all pathways →
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {blueprint.programs.map((program, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow"
            >
              {isEditMode ? (
                <>
                  <EditableText
                    value={program.meta}
                    onChange={(val) => updateProgram(index, "meta", val)}
                    as="p"
                    className="text-xs uppercase tracking-[0.3em] text-slate-400"
                    placeholder="Category"
                    editIndicator="none"
                  />
                  <EditableText
                    value={program.title}
                    onChange={(val) => updateProgram(index, "title", val)}
                    as="h3"
                    className="mt-2 text-xl font-semibold text-slate-900"
                    placeholder="Program name"
                    editIndicator="border"
                  />
                  <EditableText
                    value={program.description}
                    onChange={(val) => updateProgram(index, "description", val)}
                    as="p"
                    className="text-sm text-slate-600"
                    placeholder="Description..."
                    multiline
                    editIndicator="none"
                  />
                </>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {program.meta}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    {program.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {program.description}
                  </p>
                </>
              )}
              <button className="mt-4 text-sm font-semibold text-slate-900">
                View care map →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EDITABLE FOOTER
// ============================================================================

interface EditableFooterProps {
  blueprint: TemplateBlueprint;
  onUpdate: (footer: TemplateBlueprint["footer"]) => void;
  isEditMode: boolean;
}

function EditableFooter({
  blueprint,
  onUpdate,
  isEditMode,
}: EditableFooterProps) {
  const updateContact = (
    field: "phone" | "email" | "location",
    value: string
  ) => {
    const currentContact = blueprint.footer.contact || {
      phone: "",
      email: "",
      location: "",
    };
    onUpdate({
      ...blueprint.footer,
      contact: {
        phone: currentContact.phone || "",
        email: currentContact.email || "",
        location: currentContact.location || "",
        [field]: value,
      },
    });
  };

  // Safely access footer contact with defaults
  const contact = blueprint.footer.contact || {
    phone: "",
    email: "",
    location: "",
  };
  const quickLinks = blueprint.footer.quickLinks || [];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Contact navigator
          </p>
          {isEditMode ? (
            <>
              <EditableText
                value={contact.phone || ""}
                onChange={(val) => updateContact("phone", val)}
                as="p"
                className="text-lg font-semibold text-white"
                placeholder="Phone number"
                editIndicator="border"
              />
              <EditableText
                value={contact.email || ""}
                onChange={(val) => updateContact("email", val)}
                as="p"
                className="text-sm text-white/70"
                placeholder="Email address"
                editIndicator="none"
              />
              <EditableText
                value={contact.location || ""}
                onChange={(val) => updateContact("location", val)}
                as="p"
                className="mt-2 text-sm text-white/60"
                placeholder="Location"
                editIndicator="none"
              />
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">{contact.phone}</p>
              <p className="text-sm text-white/70">{contact.email}</p>
              <p className="mt-2 text-sm text-white/60">{contact.location}</p>
            </>
          )}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Quick links
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {quickLinks.map((link, index) => (
              <li key={index}>
                {isEditMode ? (
                  <EditableText
                    value={link}
                    onChange={(val) => {
                      const newLinks = [...quickLinks];
                      newLinks[index] = val;
                      onUpdate({ ...blueprint.footer, quickLinks: newLinks });
                    }}
                    className="text-white/80"
                    placeholder="Link text"
                    editIndicator="none"
                  />
                ) : (
                  link
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Plan your journey
          </p>
          <p className="mt-3 text-sm text-white/80">
            Patient concierge desk coordinates travel, visas, insurance
            paperwork, and virtual second opinions in under 48 hours.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Athaarva Health Templates · Crafted for
        preview only
      </div>
    </footer>
  );
}

export default EditableTemplatePreviewRenderer;
