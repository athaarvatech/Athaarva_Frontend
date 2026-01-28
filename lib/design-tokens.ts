/**
 * Athaarva Design System - Design Tokens
 * ========================================
 * Centralized design tokens for consistent styling across the application.
 * Based on Zendenta/Healthcare UI Kit analysis of 60 reference designs.
 * 
 * Usage:
 * import { colors, spacing, typography } from '@/lib/design-tokens'
 */

// ==========================================================================
// COLOR TOKENS
// ==========================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    DEFAULT: '#3B5998',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#3B5998',
    700: '#2D4373',
    800: '#1E3A5F',
    900: '#1E293B',
  },
  
  // Secondary Colors
  secondary: {
    DEFAULT: '#20B2AA',
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#20B2AA',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
  
  // Accent Colors
  accent: {
    teal: '#06B6D4',
    cyan: '#22D3EE',
    yellow: '#F9A826',
  },
  
  // Semantic Colors
  success: {
    DEFAULT: '#10B981',
    light: '#D1FAE5',
    dark: '#047857',
  },
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
  },
  error: {
    DEFAULT: '#EF4444',
    light: '#FEE2E2',
    dark: '#DC2626',
  },
  info: {
    DEFAULT: '#3B82F6',
    light: '#DBEAFE',
    dark: '#2563EB',
  },
  
  // Neutral Gray Scale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Surface Colors
  surface: {
    background: '#F9FAFB',
    base: '#FFFFFF',
    elevated: '#FFFFFF',
    muted: '#F3F4F6',
    subtle: '#E5E7EB',
  },
  
  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Chart/Data Visualization Colors
  chart: [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ],
} as const

// ==========================================================================
// STATUS COLORS (Healthcare-specific)
// ==========================================================================

export const statusColors = {
  // Appointment Status
  registered: { bg: 'bg-blue-100', text: 'text-blue-700', hex: { bg: '#DBEAFE', text: '#1D4ED8' } },
  encounter: { bg: 'bg-purple-100', text: 'text-purple-700', hex: { bg: '#EDE9FE', text: '#7C3AED' } },
  finished: { bg: 'bg-green-100', text: 'text-green-700', hex: { bg: '#D1FAE5', text: '#047857' } },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', hex: { bg: '#FEE2E2', text: '#DC2626' } },
  
  // Payment Status
  paid: { bg: 'bg-green-100', text: 'text-green-700', hex: { bg: '#D1FAE5', text: '#047857' } },
  unpaid: { bg: 'bg-yellow-100', text: 'text-yellow-700', hex: { bg: '#FEF3C7', text: '#D97706' } },
  partiallyPaid: { bg: 'bg-orange-100', text: 'text-orange-700', hex: { bg: '#FFEDD5', text: '#C2410C' } },
  
  // General Status
  active: { bg: 'bg-green-100', text: 'text-green-700', hex: { bg: '#D1FAE5', text: '#047857' } },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-700', hex: { bg: '#F3F4F6', text: '#374151' } },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', hex: { bg: '#FEF3C7', text: '#D97706' } },
  
  // Staff Type
  fullTime: { bg: 'bg-blue-100', text: 'text-blue-700', hex: { bg: '#DBEAFE', text: '#1D4ED8' } },
  partTime: { bg: 'bg-pink-100', text: 'text-pink-700', hex: { bg: '#FCE7F3', text: '#BE185D' } },
  
  // Stock Status
  inStock: { bg: 'bg-green-100', text: 'text-green-700', hex: { bg: '#D1FAE5', text: '#047857' } },
  lowStock: { bg: 'bg-yellow-100', text: 'text-yellow-700', hex: { bg: '#FEF3C7', text: '#D97706' } },
  outOfStock: { bg: 'bg-red-100', text: 'text-red-700', hex: { bg: '#FEE2E2', text: '#DC2626' } },
} as const

// ==========================================================================
// SPACING TOKENS (4px base unit)
// ==========================================================================

export const spacing = {
  0: '0',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const

// Layout-specific spacing
export const layout = {
  sidebarWidth: '264px',
  sidebarCollapsedWidth: '64px',
  headerHeight: '64px',
  gutter: '20px',
  maxContentWidth: '1440px',
  containerPadding: {
    mobile: '16px',
    desktop: '28px',
  },
} as const

// ==========================================================================
// TYPOGRAPHY TOKENS
// ==========================================================================

export const typography = {
  // Font Families
  fontFamily: {
    primary: "'Manrope', 'Inter', system-ui, -apple-system, sans-serif",
    display: "'Manrope', 'Inter', sans-serif",
    body: "'Manrope', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  
  // Font Sizes with line heights
  fontSize: {
    display: { size: '48px', lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
    h1: { size: '32px', lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' },
    h2: { size: '24px', lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' },
    h3: { size: '20px', lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' },
    h4: { size: '16px', lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' },
    h5: { size: '14px', lineHeight: '1.5', letterSpacing: '0', fontWeight: '600' },
    bodyLg: { size: '16px', lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' },
    body: { size: '14px', lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' },
    bodySm: { size: '12px', lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' },
    caption: { size: '11px', lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' },
    overline: { size: '10px', lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '600' },
  },
  
  // Font Weights
  fontWeight: {
    thin: '200',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.1',
    snug: '1.2',
    normal: '1.4',
    relaxed: '1.5',
    loose: '1.6',
  },
} as const

// ==========================================================================
// BORDER RADIUS TOKENS
// ==========================================================================

export const borderRadius = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const

// ==========================================================================
// SHADOW TOKENS
// ==========================================================================

export const shadows = {
  xs: '0 1px 2px rgba(0,0,0,0.05)',
  sm: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  DEFAULT: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  md: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  lg: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
  xl: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
  '2xl': '0 25px 50px rgba(0,0,0,0.15)',
  inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  
  // Component-specific
  card: '0 2px 8px rgba(0,0,0,0.08)',
  cardHover: '0 8px 16px rgba(0,0,0,0.12)',
  dropdown: '0 10px 40px rgba(0,0,0,0.12)',
  modal: '0 25px 50px rgba(0,0,0,0.15)',
} as const

// ==========================================================================
// TRANSITION TOKENS
// ==========================================================================

export const transitions = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
  },
  
  easing: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    gentle: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ==========================================================================
// Z-INDEX SCALE
// ==========================================================================

export const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 40,
  fixed: 30,
  popover: 60,
  tooltip: 70,
  modalBackdrop: 90,
  modal: 100,
  toast: 110,
} as const

// ==========================================================================
// BREAKPOINTS
// ==========================================================================

export const breakpoints = {
  xs: '0px',
  sm: '480px',
  md: '640px',
  lg: '768px',
  xl: '1024px',
  '2xl': '1280px',
  '3xl': '1536px',
} as const

// ==========================================================================
// COMPONENT SIZE TOKENS
// ==========================================================================

export const componentSizes = {
  // Button Sizes
  button: {
    xs: { height: '28px', paddingX: '8px', fontSize: '12px', iconSize: '14px' },
    sm: { height: '32px', paddingX: '12px', fontSize: '13px', iconSize: '16px' },
    md: { height: '40px', paddingX: '16px', fontSize: '14px', iconSize: '18px' },
    lg: { height: '48px', paddingX: '20px', fontSize: '16px', iconSize: '20px' },
    xl: { height: '56px', paddingX: '24px', fontSize: '18px', iconSize: '22px' },
  },
  
  // Input Sizes
  input: {
    sm: { height: '32px', paddingX: '12px', fontSize: '13px' },
    md: { height: '40px', paddingX: '14px', fontSize: '14px' },
    lg: { height: '48px', paddingX: '16px', fontSize: '16px' },
  },
  
  // Icon Sizes
  icon: {
    xs: '14px',
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  
  // Avatar Sizes
  avatar: {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px',
    '2xl': '96px',
  },
} as const

// ==========================================================================
// HELPER FUNCTIONS
// ==========================================================================

/**
 * Get status color classes for a given status
 * @param status - The status key (e.g., 'registered', 'paid', 'inStock')
 * @returns Object with bg and text Tailwind classes
 */
export function getStatusClasses(status: keyof typeof statusColors) {
  return statusColors[status] || statusColors.inactive
}

/**
 * Get chart color by index (cycles through available colors)
 * @param index - Index of the data point
 * @returns Hex color string
 */
export function getChartColor(index: number): string {
  return colors.chart[index % colors.chart.length]
}

// ==========================================================================
// DEFAULT EXPORT
// ==========================================================================

const designTokens = {
  colors,
  statusColors,
  spacing,
  layout,
  typography,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  componentSizes,
  getStatusClasses,
  getChartColor,
}

export default designTokens
