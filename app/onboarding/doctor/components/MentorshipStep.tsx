"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  X,
  Heart,
  Award,
  BookOpen,
  Star,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingData } from "../page";

interface MentorshipStepProps {
  data: OnboardingData;
  updateData: <T extends keyof OnboardingData>(
    section: T,
    data: Partial<OnboardingData[T]>
  ) => void;
  onStepComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const expertiseAreas = [
  "Clinical Diagnosis",
  "Patient Communication", 
  "Medical Research",
  "Surgical Techniques",
  "Emergency Medicine",
  "Pediatric Care",
  "Geriatric Care",
  "Mental Health",
  "Preventive Medicine",
  "Medical Ethics",
  "Healthcare Technology",
  "Medical Education",
  "Leadership & Management",
  "Clinical Decision Making",
  "Medical Documentation",
  "Patient Safety",
  "Quality Improvement",
  "Telemedicine",
  "Interdisciplinary Care",
  "Medical Informatics"
];

const mentorshipBenefits = [
  {
    icon: Heart,
    title: "Make a Difference",
    description: "Shape the next generation of healthcare professionals"
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Earn recognition as a mentor in the medical community"
  },
  {
    icon: BookOpen,
    title: "Continuous Learning",
    description: "Stay updated with latest practices through mentoring"
  },
  {
    icon: Star,
    title: "Professional Growth",
    description: "Enhance your leadership and teaching skills"
  }
];

function MentorshipStep({ data, updateData, onStepComplete }: MentorshipStepProps) {
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [customExpertise, setCustomExpertise] = useState("");

  const mentorship = data.mentorship;
  const personalInfo = data.personalInfo;

  // Initialize expertise areas from data
  useEffect(() => {
    if (mentorship.expertiseAreas.length > 0) {
      setSelectedExpertise(mentorship.expertiseAreas);
    }
  }, [mentorship.expertiseAreas]);

  // Handle input changes
  const handleInputChange = (field: keyof typeof mentorship, value: string | number | boolean | string[]) => {
    updateData("mentorship", { [field]: value });
  };

  // Handle mentoring toggle
  const handleMentoringToggle = (willing: boolean) => {
    updateData("mentorship", { 
      willingToMentor: willing,
      mentorSlots: willing ? (mentorship.mentorSlots || 2) : 0,
      experience: willing ? mentorship.experience : "",
      expertiseAreas: willing ? selectedExpertise : []
    });

    if (!willing) {
      setSelectedExpertise([]);
    }
  };

  // Add expertise area
  const addExpertiseArea = (area: string) => {
    if (!selectedExpertise.includes(area)) {
      const updated = [...selectedExpertise, area];
      setSelectedExpertise(updated);
      updateData("mentorship", { expertiseAreas: updated });
    }
  };

  // Remove expertise area
  const removeExpertiseArea = (area: string) => {
    const updated = selectedExpertise.filter(e => e !== area);
    setSelectedExpertise(updated);
    updateData("mentorship", { expertiseAreas: updated });
  };

  // Add custom expertise
  const addCustomExpertise = () => {
    if (customExpertise.trim() && !selectedExpertise.includes(customExpertise.trim())) {
      addExpertiseArea(customExpertise.trim());
      setCustomExpertise("");
    }
  };

  // Check step completion
  const isStepComplete = useCallback(() => {
    if (!mentorship.willingToMentor) {
      return true; // Optional step, can skip
    }
    
    return (
      mentorship.mentorSlots > 0 &&
      mentorship.experience.trim().length > 20 &&
      selectedExpertise.length > 0
    );
  }, [mentorship.willingToMentor, mentorship.mentorSlots, mentorship.experience, selectedExpertise]);

  // Auto-complete step when all requirements are met
  useEffect(() => {
    if (isStepComplete()) {
      onStepComplete();
    }
  }, [isStepComplete, onStepComplete]);

  // Get suggested mentor slots based on experience
  const getSuggestedSlots = () => {
    const years = personalInfo.yearsOfExperience;
    if (years >= 15) return 5;
    if (years >= 10) return 3;
    if (years >= 5) return 2;
    return 1;
  };

  return (
    <div className="space-y-8">
      {/* Introduction Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-gray-100 bg-gradient-to-br from-healthcare-cool-white to-white">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-healthcare-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-healthcare-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Join Our Mentorship Program</h3>
                <p className="text-gray-600 mt-2">
                  Help shape the future of healthcare by mentoring junior doctors and medical students
                </p>
                <Badge variant="secondary" className="mt-2 bg-healthcare-primary/10 text-healthcare-primary">
                  Optional Step
                </Badge>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-4">
              {mentorshipBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-gray-100">
                  <div className="w-8 h-8 bg-healthcare-emerald/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-4 h-4 text-healthcare-emerald" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{benefit.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mentoring Decision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border border-gray-100">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-healthcare-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-healthcare-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Mentorship Participation</h3>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                Would you like to participate in our mentorship program?
              </Label>
              
              <RadioGroup
                value={mentorship.willingToMentor.toString()}
                onValueChange={(value) => handleMentoringToggle(value === "true")}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="mentoring-yes"
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                    mentorship.willingToMentor
                      ? "border-healthcare-primary bg-healthcare-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <RadioGroupItem value="true" id="mentoring-yes" />
                  <div>
                    <div className="font-medium text-gray-900">Yes, I&apos;d like to mentor</div>
                    <div className="text-sm text-gray-600">Help guide junior doctors</div>
                  </div>
                </Label>

                <Label
                  htmlFor="mentoring-no"
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                    !mentorship.willingToMentor
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <RadioGroupItem value="false" id="mentoring-no" />
                  <div>
                    <div className="font-medium text-gray-900">Not right now</div>
                    <div className="text-sm text-gray-600">Focus on my practice first</div>
                  </div>
                </Label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mentorship Details - Only show if willing to mentor */}
      {mentorship.willingToMentor && (
        <>
          {/* Mentoring Capacity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border border-gray-100">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-healthcare-emerald/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-healthcare-emerald" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Mentoring Capacity</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mentorSlots" className="text-sm font-medium text-gray-700">
                      How many mentees can you accommodate? *
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="mentorSlots"
                        type="number"
                        min="1"
                        max="10"
                        value={mentorship.mentorSlots || ""}
                        onChange={(e) => handleInputChange("mentorSlots", parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          Based on your {personalInfo.yearsOfExperience} years of experience, we suggest {getSuggestedSlots()} mentee(s)
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInputChange("mentorSlots", getSuggestedSlots())}
                          className="text-healthcare-primary hover:text-healthcare-teal mt-1 p-0 h-auto"
                        >
                          Use suggested number
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Mentoring Slots Visual */}
                  {mentorship.mentorSlots > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Mentoring slots:</span>
                      {Array.from({ length: Math.min(mentorship.mentorSlots, 10) }, (_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 bg-healthcare-emerald/20 border-2 border-healthcare-emerald rounded-full flex items-center justify-center"
                        >
                          <Users className="w-3 h-3 text-healthcare-emerald" />
                        </div>
                      ))}
                      {mentorship.mentorSlots > 10 && (
                        <span className="text-sm text-gray-500">+{mentorship.mentorSlots - 10} more</span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mentorship Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border border-gray-100">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-healthcare-teal/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-healthcare-teal" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Mentorship Experience</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                      Tell us about your teaching/mentoring experience *
                    </Label>
                    <Textarea
                      id="experience"
                      placeholder="Describe your experience in teaching, training, or mentoring medical students, interns, or junior doctors. Include any formal teaching positions, workshops conducted, or informal mentoring activities..."
                      value={mentorship.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className="min-h-[120px] resize-none"
                      rows={5}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Minimum 20 characters required</span>
                      <span>{mentorship.experience.length} characters</span>
                    </div>
                  </div>

                  {mentorship.experience.length >= 20 && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Experience description looks good!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expertise Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border border-gray-100">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-healthcare-indigo/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-healthcare-indigo" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Areas of Expertise</h3>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Select areas where you can provide valuable guidance: *
                  </Label>

                  {/* Quick Select Common Areas */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {expertiseAreas.slice(0, 12).map((area) => (
                      <Button
                        key={area}
                        type="button"
                        variant={selectedExpertise.includes(area) ? "default" : "outline"}
                        size="sm"
                        onClick={() => 
                          selectedExpertise.includes(area) 
                            ? removeExpertiseArea(area)
                            : addExpertiseArea(area)
                        }
                        className={cn(
                          "justify-start text-left h-auto py-2 px-3",
                          selectedExpertise.includes(area)
                            ? "bg-healthcare-indigo text-white hover:bg-healthcare-indigo/90"
                            : "hover:border-healthcare-indigo hover:text-healthcare-indigo"
                        )}
                      >
                        <span className="text-xs">{area}</span>
                      </Button>
                    ))}
                  </div>

                  {/* More Areas */}
                  {expertiseAreas.length > 12 && (
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-healthcare-primary hover:text-healthcare-teal">
                        Show more areas ({expertiseAreas.length - 12} more)
                      </summary>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                        {expertiseAreas.slice(12).map((area) => (
                          <Button
                            key={area}
                            type="button"
                            variant={selectedExpertise.includes(area) ? "default" : "outline"}
                            size="sm"
                            onClick={() => 
                              selectedExpertise.includes(area) 
                                ? removeExpertiseArea(area)
                                : addExpertiseArea(area)
                            }
                            className={cn(
                              "justify-start text-left h-auto py-2 px-3",
                              selectedExpertise.includes(area)
                                ? "bg-healthcare-indigo text-white hover:bg-healthcare-indigo/90"
                                : "hover:border-healthcare-indigo hover:text-healthcare-indigo"
                            )}
                          >
                            <span className="text-xs">{area}</span>
                          </Button>
                        ))}
                      </div>
                    </details>
                  )}

                  {/* Custom Expertise */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Add custom expertise area:
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="e.g., Robotic Surgery, Digital Health"
                        value={customExpertise}
                        onChange={(e) => setCustomExpertise(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomExpertise()}
                      />
                      <Button
                        type="button"
                        onClick={addCustomExpertise}
                        disabled={!customExpertise.trim()}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Selected Expertise */}
                  {selectedExpertise.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Selected Areas ({selectedExpertise.length}):
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedExpertise.map((area) => (
                          <Badge
                            key={area}
                            variant="secondary"
                            className="bg-healthcare-indigo/10 text-healthcare-indigo hover:bg-healthcare-indigo/20 flex items-center gap-1"
                          >
                            {area}
                            <button
                              type="button"
                              onClick={() => removeExpertiseArea(area)}
                              className="ml-1 hover:bg-healthcare-indigo/20 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* Step Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {isStepComplete() ? (
          <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              {mentorship.willingToMentor 
                ? "Mentorship setup completed successfully!" 
                : "Mentorship step completed (opted out)"
              }
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              {mentorship.willingToMentor 
                ? "Please complete mentorship details to proceed"
                : "This step is optional - you can skip or complete it"
              }
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default MentorshipStep;
