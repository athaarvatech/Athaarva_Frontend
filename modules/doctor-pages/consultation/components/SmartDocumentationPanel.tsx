"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  ChevronDown,
  ChevronUp,
  Languages,
  Loader2,
  BrainCircuit,
  FileText,
  Stethoscope,
  Save,
  Sparkles,
  Calendar,
  Clock,
  User,
  Activity,
  Target,
  Clipboard,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import AI and voice recognition services
import { useVoiceRecognition } from "../services/VoiceRecognitionService";
import {
  generateDocumentationTemplate,
  generateDifferentialDiagnosis,
  generateTreatmentSuggestions,
  generateBillingCodes,
} from "../services/AIService";
import { useAuditLogging } from "../services/SecurityService";
import { useEHRIntegration } from "../services/EHRService";
import { useConsultation } from "../context/ConsultationContext";

// Type definitions for better type safety
interface AIReference {
  title: string;
  url?: string;
  authors?: string[];
}

interface AIInteraction {
  medication: string;
  severity: "low" | "moderate" | "high";
  description: string;
}

interface AISuggestion {
  name: string;
  description?: string;
  code?: string;
  probability?: number;
  confidence?: number;
  evidenceLevel?: string;
  evidencePoints?: string[];
  contraindications?: string[];
  interactions?: AIInteraction[];
  references?: AIReference[];
}

export function SmartDocumentationPanel() {
  // Use consultation context
  const {
    consultation,
    updateConsultation,
    updateDocumentation,
    saveConsultation,
    isOnline,
    isLoading,
  } = useConsultation();

  // Use voice recognition hook
  const {
    isRecording,
    currentSession,
    error: recordingError,
    startRecording,
    stopRecording,
    updateConfig,
  } = useVoiceRecognition();

  // Use audit logging hook
  const { logAction } = useAuditLogging();

  // Use EHR integration hook
  const { submitDocumentation } = useEHRIntegration();

  // Local state for UI elements
  const [transcription, setTranscription] = useState("");
  const [language, setLanguage] = useState("English");
  const [processingAI, setProcessingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // State for section expansion (UI only)
  const [expandedSections, setExpandedSections] = useState({
    subjective: true,
    objective: true,
    assessment: true,
    plan: true,
  });

  // Local state for sections content (synced with consultation context)
  const [sections, setSections] = useState({
    subjective: { expanded: true, content: "" },
    objective: { expanded: true, content: "" },
    assessment: { expanded: true, content: "" },
    plan: { expanded: true, content: "" },
  });

  // Extract documentation and AI suggestions from consultation context
  const { documentation, aiSuggestions } = consultation;

  // Sync local sections state with consultation context
  useEffect(() => {
    setSections({
      subjective: {
        expanded: expandedSections.subjective,
        content: documentation.subjective,
      },
      objective: {
        expanded: expandedSections.objective,
        content: documentation.objective,
      },
      assessment: {
        expanded: expandedSections.assessment,
        content: documentation.assessment,
      },
      plan: { expanded: expandedSections.plan, content: documentation.plan },
    });
  }, [documentation, expandedSections]);

  // Update language configuration when language changes
  useEffect(() => {
    updateConfig({
      language:
        language === "English"
          ? "en-US"
          : language === "Spanish"
          ? "es-ES"
          : language === "French"
          ? "fr-FR"
          : "zh-CN",
    });
  }, [language, updateConfig]);

  // Update transcription when recording session changes
  useEffect(() => {
    if (currentSession?.transcription) {
      setTranscription(currentSession.transcription);
    }
  }, [currentSession]);

  // Log actions for audit purposes
  useEffect(() => {
    if (isRecording) {
      logAction(
        "doctor-123", // Mock doctor ID
        "doctor",
        "start_recording",
        "consultation",
        "consultation-123", // Mock consultation ID
        { sessionId: currentSession?.id }
      );
    }
  }, [isRecording, currentSession, logAction]);

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Update section content
  const updateSectionContent = (
    section: keyof typeof expandedSections,
    content: string
  ) => {
    // Update local state
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        content,
      },
    }));

    // Update consultation context
    updateDocumentation(section, content);

    // Log content update for audit
    logAction(
      "doctor-123", // Mock doctor ID
      "doctor",
      "update_documentation",
      "consultation_section",
      section,
      { length: content.length }
    );
  };

  // Toggle recording state
  const toggleRecording = async () => {
    try {
      if (isRecording) {
        const session = await stopRecording();
        console.log("Recording stopped:", session);
      } else {
        const session = await startRecording();
        console.log("Recording started:", session);
      }
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  // Add transcription to notes
  const addTranscriptionToNotes = (section: keyof typeof sections) => {
    if (transcription) {
      updateSectionContent(
        section,
        sections[section].content + "\n\n" + transcription
      );
      setTranscription("");

      // After adding transcription, generate AI suggestions
      generateAISuggestions();
    }
  };

  // Generate AI suggestions based on documentation content
  const generateAISuggestions = async () => {
    try {
      setProcessingAI(true);
      // Update AI suggestions in consultation context
      updateConsultation({
        ...consultation,
        aiSuggestions: { ...consultation.aiSuggestions, showSuggestions: true },
      });

      // Extract symptoms from subjective section with advanced NLP
      const symptoms = extractSymptoms(sections.subjective.content);

      // Extract patient context from all sections for more accurate suggestions
      const patientContext = {
        patientAge: 42, // Mock patient data - in real app would come from patient record
        patientGender: "Female",
        currentMedications: extractMedications(sections.subjective.content),
        vitalSigns: extractVitalSigns(sections.objective.content),
        allergies: extractAllergies(sections.subjective.content),
        pastMedicalHistory: extractPastHistory(sections.subjective.content),
      };

      // Generate differential diagnosis with confidence levels
      const diagnoses = await generateDifferentialDiagnosis(
        symptoms,
        patientContext
      );

      // Get primary diagnosis from assessment section
      const primaryDiagnosis =
        extractPrimaryDiagnosis(sections.assessment.content) ||
        "Migraine without aura";

      // Generate treatment suggestions with evidence levels
      const treatments = await generateTreatmentSuggestions(
        primaryDiagnosis,
        patientContext
      );

      // Generate billing codes with confidence scores
      const billingCodes = await generateBillingCodes(
        Object.values(sections)
          .map((section) => section.content)
          .join("\n\n")
      );

      // Update AI suggestions with comprehensive data
      updateConsultation({
        ...consultation,
        aiSuggestions: {
          diagnoses,
          treatments,
          billingCodes,
          showSuggestions: true,
        },
      });

      // Show AI panel after generating suggestions
      setShowAIPanel(true);

      // Log AI suggestion generation for audit trail
      logAction(
        "doctor-123", // Mock doctor ID
        "doctor",
        "generate_ai_suggestions",
        "consultation",
        "consultation-123", // Mock consultation ID
        {
          diagnosesCount: diagnoses.length,
          treatmentsCount: treatments.length,
          primaryDiagnosis,
          isOffline: !isOnline, // Track if generated while offline
        }
      );
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      // If offline, try to use cached models
      if (!isOnline) {
        // Attempt to use locally cached AI models
        console.log("Attempting to use offline AI models");
        // This would be implemented with TensorFlow.js or similar
      }
    } finally {
      setProcessingAI(false);
    }
  };

  // Extract primary diagnosis from assessment text
  const extractPrimaryDiagnosis = (text: string): string | null => {
    // Look for diagnosis patterns like "Diagnosis: X" or "X (ICD-10 code)"
    const diagnosisMatch =
      text.match(/(?:diagnosis|assessment|impression):\s*([^\n]+)/i) ||
      text.match(/([^\n:]+)\s*\([A-Z][0-9]+\.[0-9]+\)/i);

    return diagnosisMatch ? diagnosisMatch[1].trim() : null;
  };

  // Extract medications from text using NLP
  const extractMedications = (text: string): string[] => {
    const commonMedications = [
      "sumatriptan",
      "imitrex",
      "rizatriptan",
      "maxalt",
      "zolmitriptan",
      "zomig",
      "almotriptan",
      "axert",
      "eletriptan",
      "relpax",
      "frovatriptan",
      "frova",
      "naratriptan",
      "amerge",
      "topiramate",
      "topamax",
      "propranolol",
      "inderal",
      "amitriptyline",
      "elavil",
      "nortriptyline",
      "pamelor",
      "valproate",
      "depakote",
      "botulinum toxin",
      "botox",
      "cgrp",
      "aimovig",
      "ajovy",
      "emgality",
      "vyepti",
      "ubrelvy",
      "nurtec",
      "qulipta",
      "ibuprofen",
      "advil",
      "naproxen",
      "aleve",
      "acetaminophen",
      "tylenol",
      "aspirin",
      "excedrin",
    ];

    return commonMedications.filter((med) =>
      new RegExp(`\\b${med}\\b`, "i").test(text.toLowerCase())
    );
  };

  // Extract vital signs from objective section
  const extractVitalSigns = (text: string): Record<string, string> => {
    const vitalSigns: Record<string, string> = {};

    // Extract blood pressure
    const bpMatch = text.match(/BP:\s*([0-9]{2,3}\/[0-9]{2,3})/i);
    if (bpMatch) vitalSigns.bloodPressure = bpMatch[1];

    // Extract heart rate
    const hrMatch =
      text.match(/HR:\s*([0-9]{2,3})/i) || text.match(/pulse:\s*([0-9]{2,3})/i);
    if (hrMatch) vitalSigns.heartRate = hrMatch[1];

    // Extract temperature
    const tempMatch = text.match(/Temp:\s*([0-9]{2,3}(?:\.[0-9])?)(?:°[CF])?/i);
    if (tempMatch) vitalSigns.temperature = tempMatch[1];

    // Extract respiratory rate
    const rrMatch = text.match(/RR:\s*([0-9]{1,2})/i);
    if (rrMatch) vitalSigns.respiratoryRate = rrMatch[1];

    // Extract oxygen saturation
    const o2Match = text.match(/(?:SpO2|O2 Sat):\s*([0-9]{1,3})%?/i);
    if (o2Match) vitalSigns.oxygenSaturation = o2Match[1];

    return vitalSigns;
  };

  // Extract allergies from text
  const extractAllergies = (text: string): string[] => {
    // Look for allergy patterns
    const allergySection = text.match(/allergies:([^\n]+)/i);
    if (!allergySection) return [];

    // Split by commas and clean up
    return allergySection[1].split(",").map((a) => a.trim());
  };

  // Extract past medical history
  const extractPastHistory = (text: string): string[] => {
    // Look for past medical history patterns
    const pmhSection = text.match(
      /(?:past medical history|pmh|medical history):([^\n]+)/i
    );
    if (!pmhSection) return [];

    // Split by commas and clean up
    return pmhSection[1].split(",").map((h) => h.trim());
  };

  // Extract symptoms from text using advanced NLP techniques
  const extractSymptoms = (text: string): string[] => {
    // Comprehensive list of symptoms with synonyms and related terms
    const symptomPatterns: Record<string, RegExp> = {
      headache: /\b(?:headache|head pain|cephalgia|head discomfort)\b/i,
      migraine:
        /\b(?:migraine|migraine headache|hemiplegic migraine|migraine with aura|migraine without aura)\b/i,
      pain: /\b(?:pain|discomfort|ache|soreness|tenderness)\b/i,
      nausea: /\b(?:nausea|nauseated|queasy|sick to stomach)\b/i,
      vomiting: /\b(?:vomiting|emesis|throwing up|vomited)\b/i,
      "sensitivity to light":
        /\b(?:sensitivity to light|photophobia|light sensitivity|light hurts|bright light)\b/i,
      "sensitivity to sound":
        /\b(?:sensitivity to sound|phonophobia|sound sensitivity|noise sensitivity)\b/i,
      aura: /\b(?:aura|visual disturbance|visual changes|flashing lights|zigzag lines|scotoma)\b/i,
      dizziness:
        /\b(?:dizziness|dizzy|vertigo|lightheaded|lightheadedness|unsteady)\b/i,
      fatigue: /\b(?:fatigue|tired|exhaustion|lethargy|malaise|low energy)\b/i,
      throbbing: /\b(?:throbbing|pulsating|pounding|pulsing)\b/i,
      "neck pain": /\b(?:neck pain|cervical pain|neck stiffness|stiff neck)\b/i,
      "visual changes":
        /\b(?:visual changes|blurry vision|double vision|vision changes|visual disturbance|blurred vision)\b/i,
      numbness: /\b(?:numbness|tingling|paresthesia|pins and needles)\b/i,
      weakness: /\b(?:weakness|motor weakness|muscle weakness|hemiparesis)\b/i,
      confusion:
        /\b(?:confusion|disoriented|altered mental status|brain fog)\b/i,
      fever: /\b(?:fever|febrile|elevated temperature|pyrexia)\b/i,
      chills: /\b(?:chills|rigors|feeling cold)\b/i,
      sweating: /\b(?:sweating|diaphoresis|perspiration|night sweats)\b/i,
      "sleep disturbance":
        /\b(?:sleep disturbance|insomnia|difficulty sleeping|trouble sleeping|sleep problems)\b/i,
      anxiety: /\b(?:anxiety|anxious|nervousness|worry|panic)\b/i,
      depression: /\b(?:depression|depressed|feeling down|low mood|sadness)\b/i,
      irritability: /\b(?:irritability|irritable|agitation|easily annoyed)\b/i,
      "concentration problems":
        /\b(?:concentration problems|difficulty concentrating|trouble focusing|poor concentration)\b/i,
      "memory problems":
        /\b(?:memory problems|forgetfulness|memory loss|poor memory)\b/i,
    };

    // Extract symptoms using regex patterns
    const foundSymptoms: string[] = [];

    // Check each symptom pattern against the text
    Object.entries(symptomPatterns).forEach(([symptom, pattern]) => {
      if (pattern.test(text)) {
        foundSymptoms.push(symptom);
      }
    });

    // Look for symptom severity indicators
    const severityPatterns = {
      mild: /\b(?:mild|slight|minimal)\b/i,
      moderate: /\b(?:moderate|medium)\b/i,
      severe: /\b(?:severe|intense|extreme|worst|excruciating)\b/i,
    };

    // Look for temporal patterns
    const temporalPatterns = {
      acute: /\b(?:acute|sudden|abrupt|new onset)\b/i,
      chronic: /\b(?:chronic|persistent|ongoing|long-standing|long-term)\b/i,
      intermittent: /\b(?:intermittent|comes and goes|episodic|occasional)\b/i,
      constant: /\b(?:constant|continuous|persistent|always present)\b/i,
    };

    // Add severity and temporal characteristics if found
    Object.entries(severityPatterns).forEach(([severity, pattern]) => {
      if (pattern.test(text)) {
        foundSymptoms.push(`${severity} severity`);
      }
    });

    Object.entries(temporalPatterns).forEach(([temporal, pattern]) => {
      if (pattern.test(text)) {
        foundSymptoms.push(`${temporal} pattern`);
      }
    });

    // Extract frequency information if available
    const frequencyMatch = text.match(
      /\b(\d+)(?:-|\s*to\s*)(\d+)\s*(?:times|x)\s*(?:per|a|every)\s*(day|week|month|year)\b/i
    );
    if (frequencyMatch) {
      foundSymptoms.push(
        `frequency: ${frequencyMatch[1]}-${frequencyMatch[2]} times per ${frequencyMatch[3]}`
      );
    }

    // Extract duration information if available
    const durationMatch = text.match(
      /\b(?:for|since|over the past|over last)\s*(\d+)\s*(day|days|week|weeks|month|months|year|years)\b/i
    );
    if (durationMatch) {
      foundSymptoms.push(`duration: ${durationMatch[1]} ${durationMatch[2]}`);
    }

    return foundSymptoms;
  };

  // Generate documentation from AI with context awareness
  const generateDocumentation = async () => {
    try {
      setProcessingAI(true);

      // In a real implementation, this would fetch patient data from EHR
      // For now, we'll use mock data
      const patientData = {
        id: "patient-123",
        name: "Sarah Johnson",
        age: 42,
        gender: "Female",
        existingConditions: ["Migraine", "Hypertension"],
        medications: [
          { name: "Lisinopril", dosage: "10mg", frequency: "Daily" },
          { name: "Sumatriptan", dosage: "50mg", frequency: "As needed" },
        ],
        allergies: ["Penicillin", "Sulfa drugs"],
        lastVisit: {
          date: "2023-10-15",
          chiefComplaint: "Headache",
          diagnosis: "Migraine without aura",
          treatment: "Sumatriptan 50mg as needed",
        },
        vitalTrends: {
          bloodPressure: [
            { date: "2023-10-15", value: "128/82" },
            { date: "2023-06-10", value: "130/85" },
          ],
          heartRate: [
            { date: "2023-10-15", value: 76 },
            { date: "2023-06-10", value: 80 },
          ],
        },
      };

      // Determine visit type based on context
      // In a real implementation, this would come from the appointment type
      const visitType = "follow-up";

      // Generate documentation template with enhanced context
      const template = await generateDocumentationTemplate(
        patientData.id,
        visitType,
        patientData.existingConditions,
        {
          patientName: patientData.name,
          patientAge: patientData.age,
          patientGender: patientData.gender,
          currentMedications: patientData.medications,
          allergies: patientData.allergies,
          lastVisitDate: patientData.lastVisit.date,
          lastVisitDiagnosis: patientData.lastVisit.diagnosis,
          lastVisitTreatment: patientData.lastVisit.treatment,
          vitalTrends: patientData.vitalTrends,
        }
      );

      // Update sections with AI-generated content
      setSections({
        subjective: {
          expanded: true,
          content: template.sections.subjective,
        },
        objective: {
          expanded: true,
          content: template.sections.objective,
        },
        assessment: {
          expanded: true,
          content: template.sections.assessment,
        },
        plan: {
          expanded: true,
          content: template.sections.plan,
        },
      });

      // Generate AI suggestions based on the new documentation
      await generateAISuggestions();

      // Log template generation for audit trail
      logAction(
        "doctor-123", // Mock doctor ID
        "doctor",
        "generate_documentation_template",
        "consultation",
        "consultation-123", // Mock consultation ID
        {
          templateGenerated: true,
          visitType,
          patientId: patientData.id,
          isOffline: !isOnline, // Track if generated while offline
        }
      );

      // If offline, store the generated documentation locally
      if (!isOnline) {
        // In a real implementation, this would use IndexedDB or similar
        console.log("Storing documentation locally for later synchronization");
        // This would be implemented with a local storage mechanism
      }
    } catch (error) {
      console.error("Error generating documentation:", error);

      // If offline, try to use cached models
      if (!isOnline) {
        console.log(
          "Attempting to use offline AI models for documentation generation"
        );
        // This would be implemented with TensorFlow.js or similar
      }
    } finally {
      setProcessingAI(false);
    }
  };

  // Apply AI suggestion to documentation with smart formatting
  const applyAISuggestion = (
    type: "diagnosis" | "treatment" | "billingCode",
    item: AISuggestion
  ) => {
    // Log the application of AI suggestion
    logAction(
      "doctor-123", // Mock doctor ID
      "doctor",
      "apply_ai_suggestion",
      "consultation",
      "consultation-123", // Mock consultation ID
      { suggestionType: type, itemName: item.name }
    );

    if (type === "diagnosis") {
      // Check if this diagnosis is already in the assessment
      const diagnosisPattern = new RegExp(
        `\\b${item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      );

      if (diagnosisPattern.test(sections.assessment.content)) {
        // If already present, enhance with evidence
        const updatedContent = sections.assessment.content.replace(
          diagnosisPattern,
          `${item.name} (${item.code}) - AI confidence: ${Math.round(
            (item.probability || 0) * 100
          )}%`
        );

        updateSectionContent("assessment", updatedContent);
      } else {
        // If not present, add as new diagnosis
        const newDiagnosis = `\n\n${item.name} (${
          item.code
        }) - AI confidence: ${Math.round(
          (item.probability || 0) * 100
        )}%\nEvidence: ${item.evidencePoints?.join(", ") || "N/A"}`;

        // Check if there are references and add them
        if (item.references && item.references.length > 0) {
          const referenceText = item.references
            .map((ref: AIReference) => `${ref.title}`)
            .join("; ");
          updateSectionContent(
            "assessment",
            sections.assessment.content +
              newDiagnosis +
              `\nReferences: ${referenceText}`
          );
        } else {
          updateSectionContent(
            "assessment",
            sections.assessment.content + newDiagnosis
          );
        }
      }
    } else if (type === "treatment") {
      // Check if this treatment is already in the plan
      const treatmentPattern = new RegExp(
        `\\b${item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      );

      if (treatmentPattern.test(sections.plan.content)) {
        // If already present, enhance with evidence level
        const updatedContent = sections.plan.content.replace(
          treatmentPattern,
          `${item.name} (Evidence Level: ${item.evidenceLevel || "N/A"})`
        );

        updateSectionContent("plan", updatedContent);
      } else {
        // If not present, add as new treatment
        let newTreatment = `\n\n${item.name} - ${
          item.description || ""
        }\nEvidence Level: ${item.evidenceLevel || "N/A"}`;

        // Add contraindications if present
        if (item.contraindications && item.contraindications.length > 0) {
          newTreatment += `\nContraindications: ${item.contraindications.join(
            ", "
          )}`;
        }

        // Add interactions if present
        if (item.interactions && item.interactions.length > 0) {
          const interactionText = item.interactions
            .map(
              (interaction: AIInteraction) =>
                `${interaction.medication} (${interaction.severity} risk): ${interaction.description}`
            )
            .join("; ");
          newTreatment += `\nInteractions: ${interactionText}`;
        }

        // Add references if present
        if (item.references && item.references.length > 0) {
          const referenceText = item.references
            .map((ref: AIReference) => `${ref.title}`)
            .join("; ");
          newTreatment += `\nReferences: ${referenceText}`;
        }

        updateSectionContent("plan", sections.plan.content + newTreatment);
      }
    } else if (type === "billingCode") {
      // Add billing code to the plan section
      const billingCodeText = `\n\nBilling Code: ${item.code} - ${
        item.description || item.name
      } (${Math.round((item.confidence || 0) * 100)}% confidence)`;
      updateSectionContent("plan", sections.plan.content + billingCodeText);
    }
  };

  // Submit documentation to EHR
  const submitToEHR = async () => {
    try {
      setProcessingAI(true);

      // Prepare documentation submission
      const submission = {
        patientId: "patient-123", // Mock patient ID
        encounterId: "encounter-" + Date.now(),
        encounterDate: new Date().toISOString(),
        providerId: "doctor-123", // Mock doctor ID
        documentation: {
          subjective: sections.subjective.content,
          objective: sections.objective.content,
          assessment: sections.assessment.content,
          plan: sections.plan.content,
        },
        billingCodes:
          aiSuggestions.billingCodes?.map((code) => code.code) || [],
        signatures: [
          {
            providerId: "doctor-123", // Mock doctor ID
            timestamp: new Date().toISOString(),
            signatureData: "electronic-signature",
          },
        ],
      };

      // Submit to EHR
      const result = await submitDocumentation(submission);

      if (result) {
        alert("Documentation successfully submitted to EHR");

        // Log submission
        logAction(
          "doctor-123", // Mock doctor ID
          "doctor",
          "submit_documentation",
          "consultation",
          "consultation-123", // Mock consultation ID
          { submitted: true, billingCodes: submission.billingCodes }
        );
      }
    } catch (error) {
      console.error("Error submitting to EHR:", error);
      alert("Failed to submit documentation to EHR");
    } finally {
      setProcessingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Enhanced Design */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Smart Documentation
                  </h1>
                  <p className="text-gray-600">
                    AI-powered clinical note generation and management
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Indicators */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                    isOnline
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  )}
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isOnline ? "bg-green-500" : "bg-red-500"
                    )}
                  />
                  {isOnline ? "Online" : "Offline"}
                </div>

                {processingAI && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    AI Processing
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveConsultation()}
                  disabled={isLoading}
                  className="bg-white/80 border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  Save Draft
                </Button>

                <Button
                  size="sm"
                  onClick={generateDocumentation}
                  disabled={processingAI || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                >
                  {processingAI ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-1.5" />
                  )}
                  AI Assist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Documentation Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Voice Recognition Panel */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Voice Recognition
                </h2>
              </div>

              <div className="space-y-4">
                {/* Recording Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Button
                      size="lg"
                      onClick={toggleRecording}
                      disabled={processingAI}
                      className={cn(
                        "shadow-lg transition-all duration-200",
                        isRecording
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse"
                          : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                      )}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-5 h-5 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>

                    {/* Language Selector */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                      <Languages className="w-4 h-4 text-gray-500" />
                      <select
                        className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 font-medium"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        disabled={isRecording}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>Mandarin</option>
                      </select>
                    </div>
                  </div>

                  {/* Recording Status */}
                  {isRecording && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-red-700">
                        Recording in progress...
                      </span>
                    </div>
                  )}

                  {recordingError && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        {recordingError}
                      </span>
                    </div>
                  )}
                </div>

                {/* Transcription Area */}
                <div className="relative">
                  <Textarea
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    placeholder="Speech transcription will appear here... Click 'Start Recording' to begin voice-to-text conversion."
                    className="min-h-[120px] resize-none bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-gray-800 placeholder:text-gray-500"
                  />

                  {transcription && (
                    <div className="absolute bottom-3 right-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addTranscriptionToNotes("subjective")}
                          className="bg-white/90 border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Subjective
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* SOAP Documentation Sections */}
          <div className="space-y-4">
            {/* Subjective Section */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border-b border-blue-100"
                onClick={() => toggleSection("subjective")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Subjective</h3>
                    <p className="text-sm text-gray-600">
                      Patient's symptoms and history
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/50">
                    {sections.subjective.content.length} chars
                  </Badge>
                  {sections.subjective.expanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </div>

              {sections.subjective.expanded && (
                <div className="p-6 bg-white">
                  <Textarea
                    value={sections.subjective.content}
                    onChange={(e) =>
                      updateSectionContent("subjective", e.target.value)
                    }
                    className="min-h-[140px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50"
                    placeholder="Enter patient's subjective information, chief complaint, history of present illness, review of systems..."
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addTranscriptionToNotes("subjective")}
                        disabled={!transcription}
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        <Mic className="w-3 h-3 mr-1" />
                        Add Voice Note
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Objective Section */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 cursor-pointer hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 border-b border-emerald-100"
                onClick={() => toggleSection("objective")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-sm">
                    <Stethoscope className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Objective</h3>
                    <p className="text-sm text-gray-600">
                      Physical exam and vital signs
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/50">
                    {sections.objective.content.length} chars
                  </Badge>
                  {sections.objective.expanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </div>

              {sections.objective.expanded && (
                <div className="p-6 bg-white">
                  <Textarea
                    value={sections.objective.content}
                    onChange={(e) =>
                      updateSectionContent("objective", e.target.value)
                    }
                    className="min-h-[140px] resize-none border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50"
                    placeholder="Enter physical examination findings, vital signs, laboratory results, imaging findings..."
                  />

                  {/* Enhanced Vitals Quick Input */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">
                        Quick Vitals Entry
                      </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-700">
                          Blood Pressure
                        </Label>
                        <Input
                          placeholder="120/80"
                          className="h-8 text-sm bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-700">
                          Heart Rate
                        </Label>
                        <Input
                          placeholder="72 bpm"
                          className="h-8 text-sm bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-700">
                          Temperature
                        </Label>
                        <Input
                          placeholder="98.6°F"
                          className="h-8 text-sm bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-700">
                          Resp. Rate
                        </Label>
                        <Input
                          placeholder="16/min"
                          className="h-8 text-sm bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-700">
                          O2 Saturation
                        </Label>
                        <Input
                          placeholder="99%"
                          className="h-8 text-sm bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add to Notes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Assessment Section */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 cursor-pointer hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 border-b border-purple-100"
                onClick={() => toggleSection("assessment")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-sm">
                    <BrainCircuit className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Assessment</h3>
                    <p className="text-sm text-gray-600">
                      Clinical reasoning and diagnosis
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/50">
                    {sections.assessment.content.length} chars
                  </Badge>
                  {sections.assessment.expanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </div>

              {sections.assessment.expanded && (
                <div className="p-6 bg-white">
                  <Textarea
                    value={sections.assessment.content}
                    onChange={(e) =>
                      updateSectionContent("assessment", e.target.value)
                    }
                    className="min-h-[120px] resize-none border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gray-50"
                    placeholder="Enter your clinical assessment, primary and differential diagnoses, clinical reasoning..."
                  />

                  {/* AI Diagnosis Suggestions */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">
                          AI-Suggested Diagnoses
                        </span>
                      </div>
                      {processingAI && (
                        <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-100 shadow-sm">
                        <Checkbox id="diag1" className="border-purple-300" />
                        <div className="flex-1">
                          <Label
                            htmlFor="diag1"
                            className="text-sm font-medium text-gray-900"
                          >
                            Migraine without aura (G43.009)
                          </Label>
                          <p className="text-xs text-gray-600 mt-1">
                            Based on: headache pattern, photophobia, patient
                            history
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          95% confidence
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-100 shadow-sm">
                        <Checkbox id="diag2" className="border-purple-300" />
                        <div className="flex-1">
                          <Label
                            htmlFor="diag2"
                            className="text-sm font-medium text-gray-900"
                          >
                            Tension-type headache (G44.209)
                          </Label>
                          <p className="text-xs text-gray-600 mt-1">
                            Based on: bilateral presentation, pressure sensation
                          </p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          72% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Plan Section */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 cursor-pointer hover:from-orange-100 hover:to-red-100 transition-all duration-200 border-b border-orange-100"
                onClick={() => toggleSection("plan")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-sm">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Plan</h3>
                    <p className="text-sm text-gray-600">
                      Treatment and follow-up plan
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/50">
                    {sections.plan.content.length} chars
                  </Badge>
                  {sections.plan.expanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </div>

              {sections.plan.expanded && (
                <div className="p-6 bg-white">
                  <Textarea
                    value={sections.plan.content}
                    onChange={(e) =>
                      updateSectionContent("plan", e.target.value)
                    }
                    className="min-h-[140px] resize-none border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gray-50"
                    placeholder="Enter treatment plan, medications, procedures, follow-up instructions, patient education..."
                  />

                  {/* Documentation Completeness Checker */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        Documentation Quality Check
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-green-100">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">
                          Diagnosis code included
                        </span>
                        <Badge className="ml-auto bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-green-100">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">
                          Treatment plan specified
                        </span>
                        <Badge className="ml-auto bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-amber-100">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-gray-700">
                          Follow-up timeframe needs specificity
                        </span>
                        <Badge className="ml-auto bg-amber-100 text-amber-800">
                          Needs Review
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => saveConsultation()}
              disabled={isLoading}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>

            <Button
              onClick={submitToEHR}
              disabled={isLoading || processingAI}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Clipboard className="w-4 h-4 mr-2" />
              )}
              Finalize & Submit
            </Button>
          </div>
        </div>

        {/* AI Suggestions Sidebar */}
        <div className="space-y-6">
          {/* AI Suggestions Panel */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  AI Insights
                </h2>
              </div>

              {showAIPanel ? (
                <div className="space-y-4">
                  {/* Treatment Suggestions */}
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
                    <h3 className="text-sm font-medium text-violet-800 mb-3">
                      Recommended Treatments
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-violet-100">
                        <Checkbox id="treat1" className="border-violet-300" />
                        <Label htmlFor="treat1" className="text-sm flex-1">
                          Sumatriptan 50mg PRN
                        </Label>
                        <Badge className="bg-violet-100 text-violet-800">
                          Grade A
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-violet-100">
                        <Checkbox id="treat2" className="border-violet-300" />
                        <Label htmlFor="treat2" className="text-sm flex-1">
                          Lifestyle modifications
                        </Label>
                        <Badge className="bg-violet-100 text-violet-800">
                          Grade B
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Billing Codes */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-medium text-blue-800 mb-3">
                      Suggested Billing Codes
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded-md border border-blue-100">
                        <span className="text-sm font-medium">99213</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Office Visit
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded-md border border-blue-100">
                        <span className="text-sm font-medium">G43.909</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Migraine
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BrainCircuit className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    AI suggestions will appear here after documentation analysis
                  </p>
                  <Button
                    size="sm"
                    onClick={generateAISuggestions}
                    disabled={processingAI}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                  >
                    {processingAI ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate Insights
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Session Info */}
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Session Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Started: {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Patient: Sarah Johnson
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Follow-up Visit</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
