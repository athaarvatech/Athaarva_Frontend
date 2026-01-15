/**
 * Login Page Templates - Phase 4: Custom Login Page Builder
 * 
 * Pre-built login page templates that hospitals can choose from.
 * Each template defines layout, colors, and component positions.
 */

export type LoginLayout = "centered" | "left" | "right" | "split";
export type BackgroundType = "solid" | "gradient" | "image" | "pattern";
export type InputStyle = "outlined" | "filled" | "underlined";
export type ButtonStyle = "solid" | "gradient" | "outlined";
export type LogoPosition = "top" | "inline" | "hidden";
export type LogoSize = "small" | "medium" | "large";

export interface LoginPageBackground {
  type: BackgroundType;
  value: string; // Color hex, gradient CSS, image URL, or pattern name
  overlay?: string; // Optional overlay color with opacity
}

export interface LoginPageLogo {
  url?: string;
  position: LogoPosition;
  size: LogoSize;
  showHospitalName?: boolean;
}

export interface LoginPageWelcomeText {
  heading: string;
  subheading: string;
  showOnMobile?: boolean;
}

export interface LoginPageFormStyle {
  cardBackground: string;
  cardBorderRadius: string;
  cardShadow: string;
  inputStyle: InputStyle;
  buttonStyle: ButtonStyle;
  buttonColor?: string; // Override primary color for button
}

export interface LoginPageConfig {
  id: string;
  name: string;
  description: string;
  layout: LoginLayout;
  background: LoginPageBackground;
  logo: LoginPageLogo;
  welcomeText: LoginPageWelcomeText;
  formStyle: LoginPageFormStyle;
  customCSS?: string;
  previewImage?: string;
}

// Pre-built templates
export const LOGIN_TEMPLATES: LoginPageConfig[] = [
  {
    id: "modern-centered",
    name: "Modern Centered",
    description: "Clean, centered login with gradient background",
    layout: "centered",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    logo: {
      position: "top",
      size: "medium",
      showHospitalName: true,
    },
    welcomeText: {
      heading: "Welcome Back",
      subheading: "Sign in to access your healthcare portal",
      showOnMobile: true,
    },
    formStyle: {
      cardBackground: "#ffffff",
      cardBorderRadius: "16px",
      cardShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      inputStyle: "outlined",
      buttonStyle: "gradient",
    },
    previewImage: "/templates/login/modern-centered.png",
  },
  {
    id: "professional-left",
    name: "Professional Left",
    description: "Business-style left-aligned login",
    layout: "left",
    background: {
      type: "solid",
      value: "#f8fafc",
    },
    logo: {
      position: "inline",
      size: "small",
      showHospitalName: true,
    },
    welcomeText: {
      heading: "Healthcare Portal",
      subheading: "Secure access to your medical records",
      showOnMobile: true,
    },
    formStyle: {
      cardBackground: "#ffffff",
      cardBorderRadius: "8px",
      cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      inputStyle: "outlined",
      buttonStyle: "solid",
    },
    previewImage: "/templates/login/professional-left.png",
  },
  {
    id: "split-image",
    name: "Split Screen",
    description: "Half image, half login form layout",
    layout: "split",
    background: {
      type: "image",
      value: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200",
      overlay: "rgba(0, 124, 124, 0.6)",
    },
    logo: {
      position: "top",
      size: "large",
      showHospitalName: true,
    },
    welcomeText: {
      heading: "Your Health, Our Priority",
      subheading: "Access your personalized healthcare dashboard",
      showOnMobile: false,
    },
    formStyle: {
      cardBackground: "#ffffff",
      cardBorderRadius: "0px",
      cardShadow: "none",
      inputStyle: "filled",
      buttonStyle: "solid",
    },
    previewImage: "/templates/login/split-image.png",
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    description: "Sleek dark theme with minimal design",
    layout: "centered",
    background: {
      type: "solid",
      value: "#0f172a",
    },
    logo: {
      position: "top",
      size: "medium",
      showHospitalName: true,
    },
    welcomeText: {
      heading: "Sign In",
      subheading: "Continue to your account",
      showOnMobile: true,
    },
    formStyle: {
      cardBackground: "#1e293b",
      cardBorderRadius: "12px",
      cardShadow: "0 0 40px rgba(0, 0, 0, 0.3)",
      inputStyle: "filled",
      buttonStyle: "gradient",
    },
    previewImage: "/templates/login/minimal-dark.png",
  },
  {
    id: "healthcare-teal",
    name: "Healthcare Teal",
    description: "Athaarva branded healthcare theme",
    layout: "centered",
    background: {
      type: "gradient",
      value: "linear-gradient(180deg, #007C7C 0%, #004d4d 100%)",
    },
    logo: {
      position: "top",
      size: "large",
      showHospitalName: true,
    },
    welcomeText: {
      heading: "Welcome to Your Health Portal",
      subheading: "Compassionate care, just a click away",
      showOnMobile: true,
    },
    formStyle: {
      cardBackground: "rgba(255, 255, 255, 0.95)",
      cardBorderRadius: "24px",
      cardShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
      inputStyle: "outlined",
      buttonStyle: "solid",
      buttonColor: "#007C7C",
    },
    previewImage: "/templates/login/healthcare-teal.png",
  },
  {
    id: "medical-pattern",
    name: "Medical Pattern",
    description: "Subtle medical pattern background",
    layout: "right",
    background: {
      type: "pattern",
      value: "medical-crosses", // Custom pattern name
      overlay: "rgba(248, 250, 252, 0.95)",
    },
    logo: {
      position: "inline",
      size: "medium",
      showHospitalName: true,
    },
    welcomeText: {
      heading: "Patient Portal",
      subheading: "Secure access to your health information",
      showOnMobile: true,
    },
    formStyle: {
      cardBackground: "#ffffff",
      cardBorderRadius: "16px",
      cardShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      inputStyle: "outlined",
      buttonStyle: "solid",
    },
    previewImage: "/templates/login/medical-pattern.png",
  },
];

// Default login page configuration
export const DEFAULT_LOGIN_CONFIG: LoginPageConfig = LOGIN_TEMPLATES[4]; // Healthcare Teal

/**
 * Get a login template by ID
 */
export function getLoginTemplate(id: string): LoginPageConfig | undefined {
  return LOGIN_TEMPLATES.find((t) => t.id === id);
}

/**
 * Generate CSS from login page configuration
 */
export function generateLoginCSS(config: LoginPageConfig): string {
  const { background, formStyle, layout } = config;

  let bgCSS = "";
  switch (background.type) {
    case "solid":
      bgCSS = `background-color: ${background.value};`;
      break;
    case "gradient":
      bgCSS = `background: ${background.value};`;
      break;
    case "image":
      bgCSS = `
        background-image: url('${background.value}');
        background-size: cover;
        background-position: center;
        ${background.overlay ? `background-color: ${background.overlay};` : ""}
      `;
      break;
    case "pattern":
      bgCSS = `background-color: #f8fafc;`; // Fallback for patterns
      break;
  }

  return `
    .login-page {
      ${bgCSS}
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: ${layout === "left" ? "flex-start" : layout === "right" ? "flex-end" : "center"};
      padding: 2rem;
    }
    
    .login-card {
      background: ${formStyle.cardBackground};
      border-radius: ${formStyle.cardBorderRadius};
      box-shadow: ${formStyle.cardShadow};
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }
    
    ${config.customCSS || ""}
  `.trim();
}

/**
 * Create a custom login configuration from template
 */
export function createLoginConfig(
  templateId: string,
  overrides?: Partial<LoginPageConfig>
): LoginPageConfig {
  const template = getLoginTemplate(templateId) || DEFAULT_LOGIN_CONFIG;
  return {
    ...template,
    ...overrides,
    id: `custom-${Date.now()}`,
    name: overrides?.name || template.name,
    background: { ...template.background, ...overrides?.background },
    logo: { ...template.logo, ...overrides?.logo },
    welcomeText: { ...template.welcomeText, ...overrides?.welcomeText },
    formStyle: { ...template.formStyle, ...overrides?.formStyle },
  };
}

export default LOGIN_TEMPLATES;
