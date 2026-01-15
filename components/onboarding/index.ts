/**
 * Onboarding Components - Phase 3 & 4: UX Redesign & Login Page Builder
 * 
 * This barrel file exports all onboarding-related components.
 */

// Phase 3: Onboarding UX Components
export { WelcomeModal } from "./WelcomeModal";
export { WalkthroughOverlay } from "./WalkthroughOverlay";
export { ImageToolbox, type ImageCategory } from "./ImageToolbox";
export { ContentSuggester } from "./ContentSuggester";
export { TemplatePreview, PreviewPanel } from "./TemplatePreview";

// Phase 4: Login Page Builder
export { LoginPageBuilder } from "./LoginPageBuilder";
export { CustomLoginPage } from "./CustomLoginPage";

// Re-export hooks
export { useWalkthrough, type WalkthroughStep } from "@/hooks/useWalkthrough";
export { useAutoSave, AutoSaveIndicator, formatTimeSince } from "@/hooks/useAutoSave";

// Re-export AI utilities
export {
  generateImage,
  suggestContent,
  suggestBrandingPackage,
  enhanceText,
} from "@/lib/azure-ai";

// Re-export Login Templates
export {
  LOGIN_TEMPLATES,
  DEFAULT_LOGIN_CONFIG,
  getLoginTemplate,
  generateLoginCSS,
  createLoginConfig,
  type LoginPageConfig,
  type LoginLayout,
  type BackgroundType,
  type InputStyle,
  type ButtonStyle,
} from "@/lib/login-templates";