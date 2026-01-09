/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zendenta: {
          primary: "#06B6D4", // Teal color
          secondary: "#4A6572",
          accent: "#F9A826",
          positive: "#34D399",
          danger: "#F87171",
          warning: "#FBBF24",
        },
        healthcare: {
          primary: "#007C7C", // Emerald Green
          secondary: "#20B2AA", // Light Sea Green
          teal: "#008080", // Teal
          emerald: "#50C878", // Emerald
          indigo: "#4F46E5", // Indigo accent
          "cool-white": "#FAFAFA",
          "soft-grey": "#F3F4F6",
          dark: "#1F2937",
        },
        // Landing page medical colors
        medical: {
          DEFAULT: "#0F67B1",
          dark: "#03346E",
          light: "#3FA2F6",
        },
        mint: {
          DEFAULT: "#96E9C6",
          accent: "#6EE7B7",
        },
        // Background and text colors for landing
        surface: {
          base: "#FFFFFF",
          elevated: "#FFFFFF",
          muted: "#F1F5F9",
          subtle: "#E2E8F0",
        },
        text: {
          main: "#1E293B",
          muted: "#64748B",
          light: "#94A3B8",
          inverse: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "Satoshi", "ui-sans-serif", "system-ui"],
        serif: ["Playfair Display", "ui-serif", "Georgia"],
        display: ["Manrope", "Inter", "Satoshi", "Poppins", "sans-serif"],
      },
      boxShadow: {
        zendenta: "0 4px 12px rgba(0, 0, 0, 0.05)",
        "zendenta-lg": "0 10px 25px rgba(0, 0, 0, 0.1)",
        "healthcare-sm": "0 1px 3px rgba(0, 0, 0, 0.12)",
        healthcare:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "healthcare-md":
          "0 6px 10px -1px rgba(0, 0, 0, 0.1), 0 2px 5px -1px rgba(0, 0, 0, 0.06)",
        "healthcare-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        // Landing page shadows
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "glow-primary": "0 0 20px rgba(15, 103, 177, 0.15)",
      },
      borderRadius: {
        zendenta: "10px",
        "healthcare-sm": "0.375rem" /* 6px */,
        healthcare: "0.5rem" /* 8px */,
        "healthcare-md": "0.75rem" /* 12px */,
        "healthcare-lg": "1rem" /* 16px */,
        "healthcare-xl": "1.5rem" /* 24px */,
        // Landing page border radius
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionDuration: {
        "400": "400ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "shimmer-slide": {
          to: { transform: "translate(calc(100cqw - 100%), 0)" },
        },
        "spin-around": {
          "0%": { transform: "translateZ(0) rotate(0)" },
          "15%, 35%": { transform: "translateZ(0) rotate(90deg)" },
          "65%, 85%": { transform: "translateZ(0) rotate(270deg)" },
          "100%": { transform: "translateZ(0) rotate(360deg)" },
        },
      },
      animation: {
        "pulse-gentle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        "shimmer-slide":
          "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
      },
      zIndex: {
        dropdown: "50",
        modal: "100",
        tooltip: "60",
      },
    },
  },
  plugins: [],
};
