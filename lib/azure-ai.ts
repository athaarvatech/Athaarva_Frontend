/**
 * Azure AI Integration - Phase 3: Onboarding UX Redesign
 * 
 * Integration with Azure OpenAI services for:
 * - Image generation (DALL-E)
 * - Content suggestions (GPT)
 * 
 * Note: Requires Azure OpenAI API keys to be configured in environment variables.
 */

import { API_CONFIG } from "./api-config";

// Types
export interface GenerateImageRequest {
  prompt: string;
  size?: "256x256" | "512x512" | "1024x1024";
  n?: number;
}

export interface GenerateImageResponse {
  success: boolean;
  images?: string[];
  error?: string;
}

export interface ContentSuggestionRequest {
  hospitalName: string;
  specialties?: string[];
  section: "tagline" | "about" | "services" | "welcome" | "contact";
  tone?: "professional" | "friendly" | "warm" | "modern";
  language?: "en" | "hi";
}

export interface ContentSuggestionResponse {
  success: boolean;
  suggestions?: string[];
  error?: string;
}

// Fallback suggestions when AI is not available
const FALLBACK_SUGGESTIONS: Record<string, Record<string, string[]>> = {
  tagline: {
    default: [
      "Where Health Meets Compassion",
      "Excellence in Healthcare, Delivered with Care",
      "Your Health, Our Priority",
      "Healing Hands, Caring Hearts",
      "Advanced Medicine, Personal Touch",
    ],
  },
  about: {
    default: [
      "We are a leading healthcare facility dedicated to providing exceptional medical care with compassion and expertise. Our team of skilled professionals uses the latest medical technology to ensure the best outcomes for our patients.",
      "Established with a vision to deliver world-class healthcare, we combine cutting-edge medical practices with personalized patient care. Our commitment is to treat every patient like family.",
      "At our hospital, we believe in holistic healthcare that addresses not just the physical but also the emotional well-being of our patients. Our state-of-the-art facilities and experienced staff are here to serve you.",
    ],
  },
  services: {
    default: [
      "We offer comprehensive medical services including emergency care, specialized surgeries, diagnostic imaging, and preventive health programs. Our departments are equipped with modern equipment and staffed by expert physicians.",
      "Our services range from primary care to advanced surgical procedures. We specialize in cardiology, orthopedics, neurology, and oncology, supported by cutting-edge diagnostic facilities.",
      "From routine check-ups to complex medical procedures, we provide end-to-end healthcare solutions. Our 24/7 emergency services ensure you're never alone in times of need.",
    ],
  },
  welcome: {
    default: [
      "Welcome to your trusted healthcare partner. We're committed to your well-being.",
      "Thank you for choosing us for your healthcare needs. Your health is our mission.",
      "We're honored to be your healthcare provider. Experience the difference that compassionate care makes.",
    ],
  },
  contact: {
    default: [
      "We're here for you 24/7. Reach out to us for appointments, emergencies, or any healthcare inquiries.",
      "Connect with us to schedule your visit or learn more about our services. Our friendly staff is ready to assist you.",
      "Have questions? Our dedicated team is just a call away. We look forward to serving you.",
    ],
  },
};

/**
 * Generate images using Azure DALL-E
 * Falls back to placeholder images if AI is unavailable
 */
export async function generateImage(
  request: GenerateImageRequest
): Promise<GenerateImageResponse> {
  try {
    // Check if Azure AI endpoint is configured
    const azureEndpoint = process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT;
    const azureKey = process.env.NEXT_PUBLIC_AZURE_AI_KEY;

    if (!azureEndpoint || !azureKey) {
      console.warn("Azure AI not configured, using placeholder images");
      // Return placeholder images
      const placeholderUrl = `https://via.placeholder.com/${request.size || "512x512"}/007C7C/ffffff?text=${encodeURIComponent(
        request.prompt.slice(0, 30)
      )}`;
      return {
        success: true,
        images: Array(request.n || 1).fill(placeholderUrl),
      };
    }

    // Call Azure DALL-E API via our backend proxy
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/ai/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const data = await response.json();
    return {
      success: true,
      images: data.images,
    };
  } catch (error) {
    console.error("Image generation error:", error);
    // Return placeholder on error
    const placeholderUrl = `https://via.placeholder.com/${request.size || "512x512"}/007C7C/ffffff?text=Generated+Image`;
    return {
      success: true,
      images: [placeholderUrl],
    };
  }
}

/**
 * Generate content suggestions using Azure GPT
 * Falls back to curated suggestions if AI is unavailable
 */
export async function suggestContent(
  request: ContentSuggestionRequest
): Promise<ContentSuggestionResponse> {
  try {
    // Check if Azure AI endpoint is configured
    const azureEndpoint = process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT;
    const azureKey = process.env.NEXT_PUBLIC_AZURE_AI_KEY;

    if (!azureEndpoint || !azureKey) {
      console.warn("Azure AI not configured, using fallback suggestions");
      return getFallbackSuggestions(request);
    }

    // Call Azure GPT API via our backend proxy
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/ai/suggest-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to generate suggestions");
    }

    const data = await response.json();
    return {
      success: true,
      suggestions: data.suggestions,
    };
  } catch (error) {
    console.error("Content suggestion error:", error);
    return getFallbackSuggestions(request);
  }
}

/**
 * Get fallback suggestions when AI is not available
 * Personalizes suggestions with hospital name
 */
function getFallbackSuggestions(
  request: ContentSuggestionRequest
): ContentSuggestionResponse {
  const sectionSuggestions = FALLBACK_SUGGESTIONS[request.section]?.default || [];

  // Personalize suggestions with hospital name
  const personalizedSuggestions = sectionSuggestions.map((suggestion) => {
    return suggestion
      .replace(/our hospital/gi, request.hospitalName)
      .replace(/the hospital/gi, request.hospitalName)
      .replace(/we are/gi, `${request.hospitalName} is`)
      .replace(/our team/gi, `${request.hospitalName}'s team`);
  });

  return {
    success: true,
    suggestions: personalizedSuggestions,
  };
}

/**
 * Generate a complete branding package suggestion
 */
export async function suggestBrandingPackage(
  hospitalName: string,
  specialties: string[] = []
): Promise<{
  tagline: string;
  about: string;
  welcomeMessage: string;
  colorSuggestions: string[];
}> {
  const [taglineResult, aboutResult, welcomeResult] = await Promise.all([
    suggestContent({ hospitalName, specialties, section: "tagline" }),
    suggestContent({ hospitalName, specialties, section: "about" }),
    suggestContent({ hospitalName, specialties, section: "welcome" }),
  ]);

  return {
    tagline: taglineResult.suggestions?.[0] || "Excellence in Healthcare",
    about:
      aboutResult.suggestions?.[0] ||
      `${hospitalName} is dedicated to providing quality healthcare services.`,
    welcomeMessage:
      welcomeResult.suggestions?.[0] ||
      `Welcome to ${hospitalName}. Your health is our priority.`,
    colorSuggestions: ["#007C7C", "#20B2AA", "#2E8B57", "#4682B4", "#6B8E23"],
  };
}

/**
 * Enhance text with AI suggestions
 */
export async function enhanceText(
  text: string,
  context: "professional" | "friendly" | "formal"
): Promise<string> {
  try {
    const azureEndpoint = process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT;
    const azureKey = process.env.NEXT_PUBLIC_AZURE_AI_KEY;

    if (!azureEndpoint || !azureKey) {
      return text; // Return original text if AI not configured
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/ai/enhance-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, context }),
    });

    if (!response.ok) {
      return text;
    }

    const data = await response.json();
    return data.enhancedText || text;
  } catch (error) {
    console.error("Text enhancement error:", error);
    return text;
  }
}

const azureAI = {
  generateImage,
  suggestContent,
  suggestBrandingPackage,
  enhanceText,
};

export default azureAI;
