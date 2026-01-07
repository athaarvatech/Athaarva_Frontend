"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
  useMemo,
} from "react";

// ============================================================================
// TYPE DEFINITIONS - Operational Hospital Configuration
// ============================================================================

export interface TemplateData {
  id: string;
  name: string;
  version: string;
  preview_snapshot_url: string;
  thumbnail_url: string;
  description: string;
  supported_modules: string[];
  recommended_for: string[];
  locked?: boolean;
}

// Extended interface to include customized blueprint data from the Canvas editor
export interface CustomizedTemplateData extends TemplateData {
  customizedBlueprint?: {
    id: string;
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      primaryCta: { label: string; href: string };
      secondaryCta: { label: string; href: string };
      stats: Array<{ label: string; value: string }>;
      heroImageAlt: string;
    };
    palette: {
      background: string;
      surface: string;
      accent: string;
      accentMuted: string;
      text: string;
      textMuted: string;
      gradient: string;
    };
    typography: {
      heading: string;
      body: string;
    };
    specialties: Array<{ icon: string; title: string; description: string }>;
    differentiators: Array<{ title: string; description: string }>;
    doctors: Array<{
      name: string;
      specialty: string;
      description: string;
      mediaLabel: string;
    }>;
    testimonials: Array<{
      quote: string;
      patient: string;
      procedure: string;
    }>;
    facilityHighlights: Array<{ title: string; copy: string }>;
    programs: Array<{ title: string; meta: string; description: string }>;
    footer: {
      contact: {
        phone: string;
        email: string;
        location: string;
      };
      quickLinks: string[];
    };
  };
}

// ============================================================================
// FACILITY MANAGEMENT TYPES (Step 4 - NEW)
// ============================================================================

export type WardType =
  | "icu"
  | "iccu"
  | "nicu"
  | "picu"
  | "hdu"
  | "private_ac"
  | "private_non_ac"
  | "semi_private"
  | "general"
  | "economy"
  | "deluxe"
  | "vvip"
  | "isolation"
  | "emergency"
  | "daycare"
  | "dialysis"
  | "labor"
  | "nursery"
  | "recovery";

export type BedType =
  | "standard"
  | "electric"
  | "bariatric"
  | "pediatric"
  | "maternity";
export type BedStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "blocked"
  | "housekeeping";

export interface BedData {
  id: string;
  bed_number: string;
  bed_type: BedType;
  status: BedStatus;
  amenities: string[];
  rent_per_day: number;
  nursing_charge_per_day: number;
  is_ventilator_equipped: boolean;
  is_monitored: boolean;
}

export interface WardData {
  id: string;
  name: string;
  code: string;
  type: WardType;
  department_id?: string;
  gender_restriction?: "male" | "female" | "any";
  age_restriction?: { min_age?: number; max_age?: number };
  nurse_station_id?: string;
  beds: BedData[];
}

export interface FloorData {
  id: string;
  name: string;
  code: string;
  wards: WardData[];
}

export interface WingData {
  id: string;
  location_id: string;
  name: string;
  code: string;
  type: "main_building" | "annexe" | "emergency_block" | "opd_block";
  floors: FloorData[];
}

// ============================================================================
// DEPARTMENT & COST CENTER TYPES (Step 5 - REVAMPED)
// ============================================================================

export type DepartmentType =
  | "clinical"
  | "diagnostic"
  | "support"
  | "administrative";

export interface DepartmentData {
  id: string;
  name: string;
  code: string;
  type: DepartmentType;
  cost_center_code: string;
  parent_department_id?: string;
  hod_designation?: string;
  location_ids: string[];
  is_revenue_generating: boolean;
  is_opd_enabled: boolean;
  is_ipd_enabled: boolean;
  default_consultation_duration: number;
  max_daily_opd_slots?: number;
  specializations: string[];
}

export interface CostCenterData {
  id: string;
  code: string;
  name: string;
  type: "revenue" | "cost" | "overhead";
  parent_center_code?: string;
  budget_allocation?: number;
  gl_account_prefix: string;
}

// ============================================================================
// BILLING & FINANCIAL TYPES (Step 6 - NEW)
// ============================================================================

export interface HSNSACCode {
  id: string;
  code: string;
  description: string;
  gst_rate: number;
  is_exempt: boolean;
}

export interface TaxConfiguration {
  gst_registration_type: "regular" | "composition" | "exempt";
  default_gst_rate: number;
  hsn_sac_codes: HSNSACCode[];
  exemption_categories: string[];
  tds_applicable: boolean;
  tds_rate?: number;
}

export interface BankAccountData {
  bank_name: string;
  branch_name: string;
  account_number: string;
  ifsc_code: string;
  account_type: "current" | "savings";
  beneficiary_name: string;
  upi_linked: boolean;
}

export interface PaymentConfiguration {
  accepted_payment_modes: (
    | "cash"
    | "card"
    | "upi"
    | "neft"
    | "cheque"
    | "wallet"
  )[];
  upi_id?: string;
  payment_gateway?: string;
  pg_merchant_id?: string;
  advance_payment_required: boolean;
  advance_percentage?: number;
  credit_period_days?: number;
}

export interface TPAPanelData {
  id: string;
  panel_type:
    | "tpa"
    | "insurance_direct"
    | "psu"
    | "corporate"
    | "esi"
    | "cghs"
    | "echs";
  name: string;
  code: string;
  contact_email: string;
  contact_phone: string;
  empanelment_date: string;
  empanelment_expiry?: string;
  mou_document_url?: string;
  discount_percentage: number;
  credit_period_days: number;
  tariff_type: "nabh" | "non_nabh" | "custom";
  custom_tariff_url?: string;
  pre_auth_required: boolean;
  pre_auth_turnaround_hours?: number;
  claim_submission_mode: "portal" | "email" | "physical";
  portal_url?: string;
}

export interface CorporatePanelData {
  id: string;
  company_name: string;
  company_gstin?: string;
  billing_address: string;
  hr_contact_name: string;
  hr_contact_email: string;
  hr_contact_phone: string;
  discount_percentage: number;
  credit_limit?: number;
  credit_period_days: number;
  services_covered: string[];
  employee_verification_mode: "id_card" | "hr_approval" | "portal" | "open";
  mou_document_url?: string;
}

export interface InvoiceConfiguration {
  invoice_prefix: string;
  invoice_start_number: number;
  receipt_prefix: string;
  receipt_start_number: number;
  financial_year_format: "YYYY-YY" | "YYYY";
  auto_reset_on_fy: boolean;
  duplicate_print_allowed: boolean;
  digital_signature_enabled: boolean;
  qr_code_on_invoice: boolean;
  e_invoice_enabled: boolean;
  e_invoice_provider?: string;
}

// ============================================================================
// CLINICAL CONFIGURATION TYPES (Step 7 - NEW)
// ============================================================================

export interface PrescriptionConfiguration {
  default_prescription_language: "english" | "hindi" | "regional";
  prescription_format: "standard" | "detailed" | "branded";
  show_generic_name: boolean;
  show_brand_suggestion: boolean;
  default_dosage_language: "english" | "hindi" | "bilingual";
  include_diagnosis_on_rx: boolean;
  include_vitals_on_rx: boolean;
  default_validity_days: number;
  controlled_drug_warning: boolean;
  signature_required: boolean;
  digital_rx_enabled: boolean;
}

export interface CodingPreferences {
  icd_version: "icd_10" | "icd_11";
  icd_default_language: "english" | "hindi";
  procedure_coding_system: "icd_10_pcs" | "cpt" | "custom";
  mandatory_diagnosis_coding: boolean;
  snomed_ct_enabled: boolean;
  loinc_enabled: boolean;
  drg_grouping_enabled: boolean;
}

export interface ConsultationParameters {
  default_opd_slot_duration: number;
  follow_up_slot_duration: number;
  new_patient_slot_duration: number;
  procedure_slot_duration: number;
  buffer_between_slots: number;
  max_overbooking_allowed: number;
  walk_in_allowed: boolean;
  walk_in_priority: "fifo" | "after_scheduled";
  token_system_enabled: boolean;
  estimated_wait_display: boolean;
}

export interface ClinicalAlertsConfiguration {
  drug_allergy_check_enabled: boolean;
  drug_interaction_check_enabled: boolean;
  duplicate_order_warning: boolean;
  critical_value_alerts: boolean;
  dose_range_checking: boolean;
}

// ============================================================================
// PHARMACY & INVENTORY TYPES (Step 8 - NEW)
// ============================================================================

export interface PharmacyLicense {
  drug_license_number_retail: string;
  drug_license_number_wholesale?: string;
  drug_license_expiry: string;
  pharmacist_registration_number: string;
  pharmacist_name: string;
  narcotic_license_number?: string;
  narcotic_license_expiry?: string;
  fssai_license_number?: string;
}

export type StoreType =
  | "main_store"
  | "sub_store"
  | "opd_pharmacy"
  | "ipd_pharmacy"
  | "emergency_pharmacy"
  | "night_pharmacy"
  | "consignment_store"
  | "return_store";

export interface StoreLocationData {
  id: string;
  name: string;
  code: string;
  type: StoreType;
  location_id: string;
  is_dispensing_point: boolean;
  is_billing_enabled: boolean;
  parent_store_id?: string;
  min_stock_days: number;
  max_stock_days: number;
  reorder_point_percentage: number;
  auto_indent_enabled: boolean;
  fifo_mandatory: boolean;
}

export interface InventoryCategoryData {
  id: string;
  category_code: string;
  category_name: string;
  is_drug: boolean;
  is_consumable: boolean;
  is_surgical: boolean;
  is_implant: boolean;
  requires_batch_tracking: boolean;
  requires_expiry_tracking: boolean;
  requires_cold_chain: boolean;
  default_gst_rate: number;
  margin_percentage?: number;
}

// ============================================================================
// OPERATIONAL POLICIES TYPES (Step 9 - ENHANCED)
// ============================================================================

export interface OPDHours {
  day: string;
  morning_start: string;
  morning_end: string;
  evening_start: string;
  evening_end: string;
  is_closed: boolean;
}

export interface PharmacyHours {
  day: string;
  open: string;
  close: string;
  is_24x7: boolean;
}

export interface OperatingHoursData {
  location_id: string;
  opd_hours: OPDHours[];
  emergency_24x7: boolean;
  pharmacy_hours: PharmacyHours[];
}

export interface AppointmentPolicies {
  min_booking_advance_hours: number;
  max_booking_advance_days: number;
  cancellation_cutoff_hours: number;
  cancellation_charge_percentage: number;
  no_show_charge_percentage: number;
  reschedule_allowed: boolean;
  reschedule_limit?: number;
  reminder_sms_enabled: boolean;
  reminder_hours_before: number[];
  confirmation_required: boolean;
  auto_cancel_unconfirmed: boolean;
}

export interface IPDPolicies {
  checkout_time: string;
  late_checkout_charge?: number;
  admission_deposit_required: boolean;
  deposit_amount_icu?: number;
  deposit_amount_general?: number;
  interim_bill_frequency_days: number;
  discharge_clearance_departments: string[];
}

// ============================================================================
// LOCATION DATA (Step 2 - ENHANCED)
// ============================================================================

export interface LocationData {
  id: string;
  location_code: string;
  name: string;
  type: "hospital" | "clinic" | "diagnostic_center" | "pharmacy_outlet";
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  geo: { lat: number; lng: number } | null;
  contact_phone: string;
  contact_email: string;
  emergency_hotline?: string;
  is_headquarters: boolean;
  is_billing_entity: boolean;
  location_gstin?: string;
  state_code?: string;
}

// Legacy types kept for compatibility
export interface ServiceData {
  id: string;
  name: string;
  department: string;
  description: string;
  consultation_types: ("in-person" | "telehealth" | "home")[];
  fee_range: { min: number; max: number; currency: string };
  location_ids: string[];
  specialty_ids: string[];
}

export interface LeadershipCardData {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  credentials: string;
  profile_photo_url: string;
  profile_photo_file: File | null;
  linkedin_url?: string;
}

export interface TeamMemberData {
  id: string;
  full_name: string;
  role: string;
  department_id?: string;
  email: string;
  phone: string;
  employee_id?: string;
  designation?: string;
  access_scope: "organization" | "location" | "department";
  location_ids?: string[];
  status: "pending" | "invited" | "active" | "suspended";
  scope_hint?: string;
  notes?: string;
}

export interface DocumentData {
  id: string;
  type: string;
  document_number: string;
  issuing_authority?: string;
  issue_date?: string;
  expiry_date?: string;
  url: string;
  filename: string;
  size: number;
  status: "valid" | "expiring_soon" | "expired" | "uploaded" | "pending";
  renewal_reminder_days?: number;
  uploaded_at: string;
  file?: File;
}

export interface TestimonialData {
  id: string;
  patient_name: string;
  content: string;
  rating: number;
  consent_file_url: string;
  consent_file?: File;
  date: string;
}

export interface ActivityLogEntry {
  id: string;
  step_id: string;
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
}

export interface CollaboratorData {
  id: string;
  email: string;
  name: string;
  granted_steps: number[];
  status: "pending" | "active";
}

// ============================================================================
// ADMIN CONTROL & DOMAIN TYPES (NEW)
// ============================================================================

export interface AdminControlData {
  admin: {
    full_name: string;
    email: string;
    phone: string;
    age: string;
  };
  credentials: {
    username: string;
    password: string;
    generated: boolean;
  };
  domain: {
    subdomain: string;
    verified: boolean;
  };
}

export interface HospitalOnboardingData {
  // Step 0: Template Selection & Invitation Recap (UNCHANGED)
  invitation: {
    token: string;
    email: string;
    expires_at: string;
    invitation_id?: number;
  };
  template: {
    selected_template: CustomizedTemplateData | null;
    version_locked: boolean;
  };

  // Step 1: Organization Profile (ENHANCED)
  organizationProfile: {
    legal_name: string;
    trade_name?: string;
    parent_entity: string;
    registration_number: string;
    cin_number?: string;
    gst_number: string;
    pan_number: string;
    tan_number?: string;
    clinical_establishment_number: string;
    nabh_accreditation_number?: string;
    established_date: string;
    ownership_model: string;
    bed_count_licensed: number;
    timezone: string;
    fiscal_year_start: number;
    locale: string;
  };

  // Step 2: Locations & Contacts (ENHANCED)
  locations: LocationData[];

  // Step 3: Branding & Report Configuration (REDUCED - operational focus)
  branding: {
    logo_url: string;
    logo_file: File | null;
    logo_size: "small" | "medium" | "large";
    favicon_url: string;
    favicon_file: File | null;
    hero_asset_url?: string;
    hero_asset_file?: File | null;
    colors: {
      primary: string;
      secondary: string;
    };
    report_header: {
      show_logo: boolean;
      show_address: boolean;
      show_phone: boolean;
      show_registration: boolean;
      tagline?: string;
    };
    report_footer: {
      disclaimer_text?: string;
      signatory_line: boolean;
    };
    prescription_header_format: "standard" | "compact" | "detailed";
    invoice_header_format: "standard" | "detailed";
    watermark_text?: string;
  };

  // Step 4: Facility Management (NEW - Infrastructure for IPD)
  facility: {
    wings: WingData[];
  };

  // Step 5: Clinical Departments & Cost Centers (REVAMPED)
  departments: DepartmentData[];
  costCenters: CostCenterData[];

  // Step 6: Billing & Financial Configuration (NEW)
  billing: {
    tax_config: TaxConfiguration;
    payment_config: PaymentConfiguration;
    bank_details: BankAccountData;
    invoice_config: InvoiceConfiguration;
    tpa_panels: TPAPanelData[];
    corporate_panels: CorporatePanelData[];
  };

  // Step 7: Clinical Configuration (NEW)
  clinical: {
    prescription_config: PrescriptionConfiguration;
    coding_preferences: CodingPreferences;
    consultation_params: ConsultationParameters;
    alerts_config: ClinicalAlertsConfiguration;
  };

  // Step 7.5: Licensing & Certification (NEW) - Simplified
  licenses: Array<{
    id: string;
    name: string;
    certificate_file?: File | string;
    certificate_file_name?: string;
  }>;

  // Step 8: Pharmacy & Inventory Configuration (NEW)
  pharmacy: {
    license: PharmacyLicense;
    stores: StoreLocationData[];
    inventory_categories: InventoryCategoryData[];
  };

  // Step 9: Operational Policies & Scheduling (ENHANCED)
  operationalPolicies: {
    operating_hours: OperatingHoursData[];
    appointment_policies: AppointmentPolicies;
    ipd_policies: IPDPolicies;
    consent_languages: string[];
  };

  // Step 10: Compliance & Documentation (ENHANCED)
  compliance: {
    documents: DocumentData[];
    dpo_contact: {
      name: string;
      designation: string;
      email: string;
      phone: string;
      address?: string;
    };
    quality_config: {
      incident_reporting_enabled: boolean;
      medication_error_tracking: boolean;
      patient_feedback_enabled: boolean;
      clinical_audit_frequency: "monthly" | "quarterly" | "annual";
      mortality_review_enabled: boolean;
    };
    consent_templates: Array<{
      id: string;
      type: string;
      url: string;
      file?: File;
    }>;
  };

  // Step 11: Admin & Staff Invitations (ENHANCED)
  adminTeam: TeamMemberData[];

  // Admin Control & Domain Configuration (NEW)
  adminControl: AdminControlData;

  // Step 12: Review & Submission (ENHANCED with Operational Readiness)
  review: {
    completion_status: { [step: string]: boolean };
    operational_readiness: {
      organization_complete: boolean;
      locations_configured: boolean;
      branding_complete: boolean;
      facility_configured: boolean;
      departments_configured: boolean;
      billing_configured: boolean;
      clinical_configured: boolean;
      pharmacy_configured: boolean;
      policies_configured: boolean;
      compliance_uploaded: boolean;
      admin_invited: boolean;
    };
    publication_plan: {
      launch_mode: "immediate" | "scheduled" | "pilot";
      scheduled_date?: string;
      pilot_location_ids?: string[];
      data_migration_required: boolean;
      go_live_checklist_completed: boolean;
      training_completed: boolean;
    };
    acknowledgements: {
      terms: boolean;
      privacy: boolean;
      dpa: boolean;
      baa: boolean;
      sla: boolean;
      ai_usage: boolean;
    };
  };

  // Legacy fields for backward compatibility (to be migrated)
  siteContent?: {
    hero: {
      headline: string;
      subtext: string;
      cta_text: string;
      cta_url: string;
    };
    services_highlights: {
      id: string;
      icon: string;
      title: string;
      description: string;
    }[];
    specialty_blurbs: { id: string; specialty: string; description: string }[];
    testimonials: {
      id: string;
      patient_name: string;
      testimonial: string;
      rating: number;
      date: string;
    }[];
    faq: { id: string; question: string; answer: string }[];
    blog_teasers: {
      id: string;
      title: string;
      excerpt: string;
      publish_date: string;
      author: string;
    }[];
  };

  servicesPricing?: {
    departments: string[];
    procedures: string[];
    consultation_types: ("in-person" | "telehealth" | "home")[];
    services: ServiceData[];
    insurance_partnerships: string[];
  };

  leadershipTeam?: {
    leadership_cards: LeadershipCardData[];
    staffing_plan: {
      id: string;
      role: string;
      count: number;
      status: string;
    }[];
  };

  integrations?: {
    messaging_channels: ("sms" | "email" | "whatsapp")[];
    analytics_tags: { id: string; platform: string; tag_id: string }[];
    llm_opt_in: boolean;
    telehealth_provider: string;
    patient_portal_modules: string[];
  };

  // Metadata
  metadata: {
    autosave_version: number;
    collaboration_notes: string;
    last_saved_at?: string;
  };
}

export interface HospitalOnboardingContextType {
  data: HospitalOnboardingData;
  currentStep: number;
  activityLog: ActivityLogEntry[];
  collaborators: CollaboratorData[];
  lastSaved: Date | null;
  isSaving: boolean;
  isStepValid: (step: number) => boolean;
  getStepCompletion: () => { [step: number]: boolean };
  updateData: <T extends keyof HospitalOnboardingData>(
    section: T,
    updates:
      | Partial<HospitalOnboardingData[T]>
      | ((
          prev: HospitalOnboardingData[T]
        ) => Partial<HospitalOnboardingData[T]>)
  ) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetData: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  addActivityLog: (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => void;
  addCollaborator: (collaborator: Omit<CollaboratorData, "id">) => void;
  removeCollaborator: (id: string) => void;
  buildSubmissionPayload: () => any;
}

// ============================================================================
// INITIAL DATA - Operational Configuration
// ============================================================================

const initialData: HospitalOnboardingData = {
  // Step 0: Invitation & Template
  invitation: {
    token: "",
    email: "",
    expires_at: "",
  },
  template: {
    selected_template: null,
    version_locked: false,
  },

  // Step 1: Organization Profile (Enhanced)
  organizationProfile: {
    legal_name: "",
    trade_name: "",
    parent_entity: "",
    registration_number: "",
    cin_number: "",
    gst_number: "",
    pan_number: "",
    tan_number: "",
    clinical_establishment_number: "",
    nabh_accreditation_number: "",
    established_date: "",
    ownership_model: "",
    bed_count_licensed: 0,
    timezone: "Asia/Kolkata",
    fiscal_year_start: 4, // April (Indian FY)
    locale: "en-IN",
  },

  // Step 2: Locations
  locations: [],

  // Step 3: Branding & Report Configuration (Reduced)
  branding: {
    logo_url: "",
    logo_file: null,
    logo_size: "medium",
    favicon_url: "",
    favicon_file: null,
    hero_asset_url: "",
    hero_asset_file: null,
    colors: {
      primary: "#007C7C",
      secondary: "#20B2AA",
    },
    report_header: {
      show_logo: true,
      show_address: true,
      show_phone: true,
      show_registration: true,
      tagline: "",
    },
    report_footer: {
      disclaimer_text: "",
      signatory_line: true,
    },
    prescription_header_format: "standard",
    invoice_header_format: "standard",
    watermark_text: "",
  },

  // Step 4: Facility Management (NEW)
  facility: {
    wings: [],
  },

  // Step 5: Departments & Cost Centers (NEW)
  departments: [],
  costCenters: [],

  // Step 6: Billing & Financial Configuration (NEW)
  billing: {
    tax_config: {
      gst_registration_type: "regular",
      default_gst_rate: 18,
      hsn_sac_codes: [],
      exemption_categories: [],
      tds_applicable: false,
    },
    payment_config: {
      accepted_payment_modes: ["cash", "card", "upi"],
      advance_payment_required: false,
    },
    bank_details: {
      bank_name: "",
      branch_name: "",
      account_number: "",
      ifsc_code: "",
      account_type: "current",
      beneficiary_name: "",
      upi_linked: false,
    },
    invoice_config: {
      invoice_prefix: "",
      invoice_start_number: 1,
      receipt_prefix: "",
      receipt_start_number: 1,
      financial_year_format: "YYYY-YY",
      auto_reset_on_fy: true,
      duplicate_print_allowed: true,
      digital_signature_enabled: false,
      qr_code_on_invoice: true,
      e_invoice_enabled: false,
    },
    tpa_panels: [],
    corporate_panels: [],
  },

  // Step 7: Clinical Configuration (NEW)
  clinical: {
    prescription_config: {
      default_prescription_language: "english",
      prescription_format: "standard",
      show_generic_name: true,
      show_brand_suggestion: true,
      default_dosage_language: "english",
      include_diagnosis_on_rx: true,
      include_vitals_on_rx: false,
      default_validity_days: 30,
      controlled_drug_warning: true,
      signature_required: true,
      digital_rx_enabled: false,
    },
    coding_preferences: {
      icd_version: "icd_10",
      icd_default_language: "english",
      procedure_coding_system: "icd_10_pcs",
      mandatory_diagnosis_coding: true,
      snomed_ct_enabled: false,
      loinc_enabled: false,
      drg_grouping_enabled: false,
    },
    consultation_params: {
      default_opd_slot_duration: 15,
      follow_up_slot_duration: 10,
      new_patient_slot_duration: 20,
      procedure_slot_duration: 30,
      buffer_between_slots: 5,
      max_overbooking_allowed: 2,
      walk_in_allowed: true,
      walk_in_priority: "after_scheduled",
      token_system_enabled: true,
      estimated_wait_display: true,
    },
    alerts_config: {
      drug_allergy_check_enabled: true,
      drug_interaction_check_enabled: true,
      duplicate_order_warning: true,
      critical_value_alerts: true,
      dose_range_checking: true,
    },
  },

  // Step 7.5: Licensing & Certification (NEW)
  licenses: [],

  // Step 8: Pharmacy & Inventory (NEW)
  pharmacy: {
    license: {
      drug_license_number_retail: "",
      drug_license_number_wholesale: "",
      drug_license_expiry: "",
      pharmacist_registration_number: "",
      pharmacist_name: "",
      narcotic_license_number: "",
      narcotic_license_expiry: "",
      fssai_license_number: "",
    },
    stores: [],
    inventory_categories: [],
  },

  // Step 9: Operational Policies (Enhanced)
  operationalPolicies: {
    operating_hours: [],
    appointment_policies: {
      min_booking_advance_hours: 2,
      max_booking_advance_days: 30,
      cancellation_cutoff_hours: 4,
      cancellation_charge_percentage: 0,
      no_show_charge_percentage: 50,
      reschedule_allowed: true,
      reschedule_limit: 2,
      reminder_sms_enabled: true,
      reminder_hours_before: [24, 2],
      confirmation_required: false,
      auto_cancel_unconfirmed: false,
    },
    ipd_policies: {
      checkout_time: "11:00",
      late_checkout_charge: 0,
      admission_deposit_required: true,
      deposit_amount_icu: 50000,
      deposit_amount_general: 20000,
      interim_bill_frequency_days: 3,
      discharge_clearance_departments: ["billing", "pharmacy", "nursing"],
    },
    consent_languages: ["english", "hindi"],
  },

  // Step 10: Compliance (Enhanced)
  compliance: {
    documents: [],
    dpo_contact: {
      name: "",
      designation: "",
      email: "",
      phone: "",
      address: "",
    },
    quality_config: {
      incident_reporting_enabled: true,
      medication_error_tracking: true,
      patient_feedback_enabled: true,
      clinical_audit_frequency: "quarterly",
      mortality_review_enabled: true,
    },
    consent_templates: [],
  },

  // Step 11: Admin Team
  adminTeam: [],

  // Admin Control & Domain Configuration
  adminControl: {
    admin: {
      full_name: "",
      email: "",
      phone: "",
      age: "",
    },
    credentials: {
      username: "",
      password: "",
      generated: false,
    },
    domain: {
      subdomain: "",
      verified: false,
    },
  },

  // Step 12: Review & Submission (Enhanced)
  review: {
    completion_status: {},
    operational_readiness: {
      organization_complete: false,
      locations_configured: false,
      branding_complete: false,
      facility_configured: false,
      departments_configured: false,
      billing_configured: false,
      clinical_configured: false,
      pharmacy_configured: false,
      policies_configured: false,
      compliance_uploaded: false,
      admin_invited: false,
    },
    publication_plan: {
      launch_mode: "immediate",
      data_migration_required: false,
      go_live_checklist_completed: false,
      training_completed: false,
    },
    acknowledgements: {
      terms: false,
      privacy: false,
      dpa: false,
      baa: false,
      sla: false,
      ai_usage: false,
    },
  },

  // Legacy fields (for backward compatibility during migration)
  siteContent: {
    hero: {
      headline: "",
      subtext: "",
      cta_text: "Book Appointment",
      cta_url: "/appointments",
    },
    services_highlights: [],
    specialty_blurbs: [],
    testimonials: [],
    faq: [],
    blog_teasers: [],
  },
  servicesPricing: {
    departments: [],
    procedures: [],
    consultation_types: [],
    services: [],
    insurance_partnerships: [],
  },
  leadershipTeam: {
    leadership_cards: [],
    staffing_plan: [],
  },
  integrations: {
    messaging_channels: [],
    analytics_tags: [],
    llm_opt_in: false,
    telehealth_provider: "",
    patient_portal_modules: [],
  },

  // Metadata
  metadata: {
    autosave_version: 0,
    collaboration_notes: "",
  },
};

const TOTAL_STEPS = 8; // 0-7 (added licensing step)

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string): boolean => {
  return /^\+?[\d\s-()]{10,}$/.test(phone);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

// ============================================================================
// CONTEXT
// ============================================================================

const HospitalOnboardingContext = createContext<
  HospitalOnboardingContextType | undefined
>(undefined);

export const useHospitalOnboarding = () => {
  const context = useContext(HospitalOnboardingContext);
  if (!context) {
    throw new Error(
      "useHospitalOnboarding must be used within a HospitalOnboardingProvider"
    );
  }
  return context;
};

interface HospitalOnboardingProviderProps {
  children: ReactNode;
}

export const HospitalOnboardingProvider: React.FC<
  HospitalOnboardingProviderProps
> = ({ children }) => {
  const [data, setData] = useState<HospitalOnboardingData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [collaborators, setCollaborators] = useState<CollaboratorData[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // UPDATE DATA
  // ============================================================================

  const updateData = useCallback(
    <T extends keyof HospitalOnboardingData>(
      section: T,
      updates:
        | HospitalOnboardingData[T]
        | Partial<HospitalOnboardingData[T]>
        | ((
            prev: HospitalOnboardingData[T]
          ) => HospitalOnboardingData[T] | Partial<HospitalOnboardingData[T]>)
    ) => {
      setData((prev) => {
        let updatedSection: HospitalOnboardingData[T];

        if (typeof updates === "function") {
          const result = updates(prev[section]);
          // If function returns a full array or primitive, use it directly
          if (
            Array.isArray(result) ||
            typeof result !== "object" ||
            result === null
          ) {
            updatedSection = result as HospitalOnboardingData[T];
          } else {
            updatedSection = {
              ...prev[section],
              ...result,
            } as HospitalOnboardingData[T];
          }
        } else {
          // If updates is an array, replace entirely; otherwise merge
          if (Array.isArray(updates)) {
            updatedSection = updates as HospitalOnboardingData[T];
          } else if (typeof updates === "object" && updates !== null) {
            // Check if prev[section] is an array - if so, replace entirely
            if (Array.isArray(prev[section])) {
              updatedSection = updates as HospitalOnboardingData[T];
            } else {
              updatedSection = {
                ...prev[section],
                ...updates,
              } as HospitalOnboardingData[T];
            }
          } else {
            updatedSection = updates as HospitalOnboardingData[T];
          }
        }

        return {
          ...prev,
          [section]: updatedSection,
          metadata: {
            ...prev.metadata,
            autosave_version: prev.metadata.autosave_version + 1,
            last_saved_at: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  // ============================================================================
  // STEP VALIDATION - Operational Readiness
  // ============================================================================

  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 0: // Invitation & Template Selection
          return !!data.template.selected_template;

        case 1: // Organization Profile - Only check fields that exist in form
          const org = data.organizationProfile;
          return !!(
            org.legal_name &&
            org.registration_number &&
            org.established_date &&
            org.timezone &&
            org.locale
          );

        case 2: // Locations & Contacts
          return (
            data.locations.length > 0 &&
            data.locations.every(
              (loc) =>
                loc.name &&
                loc.address_line_1 &&
                loc.city &&
                loc.state &&
                loc.pincode &&
                loc.contact_phone
            )
          );

        case 3: // Departments - Only check what exists in form
          return (
            data.departments.length > 0 &&
            data.departments.every(
              (dept) =>
                dept.name &&
                dept.code
            )
          );

        case 4: // Billing & Financial - Only bank details
          const billing = data.billing;
          return !!(
            billing.bank_details.bank_name &&
            billing.bank_details.account_number &&
            billing.bank_details.ifsc_code &&
            billing.bank_details.beneficiary_name
          );

        case 5: // Clinical Configuration - prescription only
          const clinical = data.clinical;
          return !!(
            clinical.prescription_config.default_prescription_language
          );

        case 6: // Licensing & Certification - at least one license with name and PDF
          return (
            data.licenses &&
            data.licenses.length > 0 &&
            data.licenses.some((license) => license.name && license.certificate_file)
          );

        case 7: // Review & Submission - basic acknowledgements
          const review = data.review;
          return !!(
            review.acknowledgements.terms &&
            review.acknowledgements.privacy
          );

        default:
          return false;
      }
    },
    [data]
  );

  // ============================================================================
  // COMPLETION STATUS
  // ============================================================================

  const getStepCompletion = useCallback((): { [step: number]: boolean } => {
    const completion: { [step: number]: boolean } = {};
    for (let i = 0; i <= TOTAL_STEPS - 1; i++) {
      completion[i] = isStepValid(i);
    }
    return completion;
  }, [isStepValid]);

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1 && isStepValid(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, isStepValid]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // ============================================================================
  // ACTIVITY LOG
  // ============================================================================

  const addActivityLog = useCallback(
    (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => {
      const newEntry: ActivityLogEntry = {
        ...entry,
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };
      setActivityLog((prev) => [newEntry, ...prev]);
    },
    []
  );

  // ============================================================================
  // COLLABORATORS
  // ============================================================================

  const addCollaborator = useCallback(
    (collaborator: Omit<CollaboratorData, "id">) => {
      const newCollaborator: CollaboratorData = {
        ...collaborator,
        id: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      setCollaborators((prev) => [...prev, newCollaborator]);
    },
    []
  );

  const removeCollaborator = useCallback((id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  const saveToLocalStorage = useCallback(() => {
    try {
      setIsSaving(true);
      const invitationId = data.invitation.invitation_id || "default";
      const storageKey = `hospital-onboarding-${invitationId}`;

      // Clone and remove files before serialization
      const dataToSave = JSON.parse(
        JSON.stringify(data, (key, value) => {
          // Skip File objects
          if (value instanceof File) return null;
          return value;
        })
      );

      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      localStorage.setItem(`${storageKey}-step`, currentStep.toString());
      localStorage.setItem(
        `${storageKey}-activity`,
        JSON.stringify(activityLog.slice(0, 50))
      ); // Keep last 50 entries
      localStorage.setItem(
        `${storageKey}-collaborators`,
        JSON.stringify(collaborators)
      );
      
      setLastSaved(new Date());
      setTimeout(() => setIsSaving(false), 300);
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
      setIsSaving(false);
    }
  }, [data, currentStep, activityLog, collaborators]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      // Try to load based on invitation_id or use default
      const invitationId = data.invitation.invitation_id || "default";
      const storageKey = `hospital-onboarding-${invitationId}`;

      const savedData = localStorage.getItem(storageKey);
      const savedStep = localStorage.getItem(`${storageKey}-step`);
      const savedActivity = localStorage.getItem(`${storageKey}-activity`);
      const savedCollaborators = localStorage.getItem(
        `${storageKey}-collaborators`
      );

      if (savedData) {
        const parsed = JSON.parse(savedData) as HospitalOnboardingData;
        // Ensure arrays are properly initialized (for backward compatibility with old localStorage data)
        setData({
          ...initialData,
          ...parsed,
          locations: Array.isArray(parsed.locations) ? parsed.locations : [],
          // Facility wings array
          facility: {
            ...initialData.facility,
            ...parsed.facility,
            wings: Array.isArray(parsed.facility?.wings)
              ? parsed.facility.wings
              : [],
          },
          // Departments and cost centers arrays
          departments: Array.isArray(parsed.departments)
            ? parsed.departments
            : [],
          costCenters: Array.isArray(parsed.costCenters)
            ? parsed.costCenters
            : [],
          // Billing arrays
          billing: {
            ...initialData.billing,
            ...parsed.billing,
            tpa_panels: Array.isArray(parsed.billing?.tpa_panels)
              ? parsed.billing.tpa_panels
              : [],
            corporate_panels: Array.isArray(parsed.billing?.corporate_panels)
              ? parsed.billing.corporate_panels
              : [],
          },
          // Clinical configuration
          clinical: {
            ...initialData.clinical,
            ...parsed.clinical,
          },
          // Pharmacy arrays
          pharmacy: {
            ...initialData.pharmacy,
            ...parsed.pharmacy,
            stores: Array.isArray(parsed.pharmacy?.stores)
              ? parsed.pharmacy.stores
              : [],
            inventory_categories: Array.isArray(
              parsed.pharmacy?.inventory_categories
            )
              ? parsed.pharmacy.inventory_categories
              : [],
          },
          // Operational policies
          operationalPolicies: {
            ...initialData.operationalPolicies,
            ...parsed.operationalPolicies,
            operating_hours: Array.isArray(
              parsed.operationalPolicies?.operating_hours
            )
              ? parsed.operationalPolicies.operating_hours
              : [],
          },
          // Compliance arrays
          compliance: {
            ...initialData.compliance,
            ...parsed.compliance,
            documents: Array.isArray(parsed.compliance?.documents)
              ? parsed.compliance.documents
              : [],
          },
          // Admin Team array
          adminTeam: Array.isArray(parsed.adminTeam) ? parsed.adminTeam : [],
        });
      }
      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (
          !Number.isNaN(parsedStep) &&
          parsedStep >= 0 &&
          parsedStep < TOTAL_STEPS
        ) {
          setCurrentStep(parsedStep);
        }
      }
      if (savedActivity) {
        setActivityLog(JSON.parse(savedActivity));
      }
      if (savedCollaborators) {
        setCollaborators(JSON.parse(savedCollaborators));
      }
    } catch (error) {
      console.error("Failed to load onboarding data:", error);
    }
  }, [data.invitation.invitation_id]);

  const resetData = useCallback(() => {
    setData(initialData);
    setCurrentStep(0);
    setActivityLog([]);
    setCollaborators([]);

    const invitationId = data.invitation.invitation_id || "default";
    const storageKey = `hospital-onboarding-${invitationId}`;
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}-step`);
    localStorage.removeItem(`${storageKey}-activity`);
    localStorage.removeItem(`${storageKey}-collaborators`);
  }, [data.invitation.invitation_id]);

  // ============================================================================
  // SUBMISSION PAYLOAD
  // ============================================================================

  const buildSubmissionPayload = useCallback(() => {
    return {
      // Step 0: Invitation & Template
      invitation_token: data.invitation.token,
      template: {
        id: data.template.selected_template?.id,
        version: data.template.selected_template?.version,
        preview_snapshot_url:
          data.template.selected_template?.preview_snapshot_url,
      },

      // Step 1: Organization Profile
      organization_profile: data.organizationProfile,

      // Step 2: Locations & Contacts
      locations: data.locations.map((loc) => ({
        ...loc,
        // Remove file objects for serialization
      })),

      // Step 3: Branding & Report Configuration
      branding: {
        logo_url: data.branding.logo_url,
        logo_size: data.branding.logo_size,
        favicon_url: data.branding.favicon_url,
        colors: data.branding.colors,
        report_header: data.branding.report_header,
        report_footer: data.branding.report_footer,
        prescription_header_format: data.branding.prescription_header_format,
        invoice_header_format: data.branding.invoice_header_format,
        watermark_text: data.branding.watermark_text,
      },

      // Step 4: Facility Management (Wings/Floors/Wards/Beds)
      facility: {
        wings: data.facility.wings.map((wing) => ({
          ...wing,
          floors: wing.floors.map((floor) => ({
            ...floor,
            wards: floor.wards.map((ward) => ({
              ...ward,
              beds: ward.beds,
            })),
          })),
        })),
      },

      // Step 5: Clinical Departments & Cost Centers
      departments: data.departments,
      cost_centers: data.costCenters,

      // Step 6: Billing & Financial Configuration
      billing: {
        tax_config: data.billing.tax_config,
        payment_config: data.billing.payment_config,
        bank_details: {
          ...data.billing.bank_details,
          // Remove sensitive fields if needed for security
        },
        invoice_config: data.billing.invoice_config,
        tpa_panels: data.billing.tpa_panels,
        corporate_panels: data.billing.corporate_panels,
      },

      // Step 7: Clinical Configuration
      clinical: {
        prescription_config: data.clinical.prescription_config,
        coding_preferences: data.clinical.coding_preferences,
        consultation_params: data.clinical.consultation_params,
        alerts_config: data.clinical.alerts_config,
      },

      // Step 8: Pharmacy & Inventory Configuration
      pharmacy: {
        license: data.pharmacy.license,
        stores: data.pharmacy.stores,
        inventory_categories: data.pharmacy.inventory_categories,
      },

      // Step 9: Operational Policies & Scheduling
      operational_policies: {
        operating_hours: data.operationalPolicies.operating_hours,
        appointment_policies: data.operationalPolicies.appointment_policies,
        ipd_policies: data.operationalPolicies.ipd_policies,
        consent_languages: data.operationalPolicies.consent_languages,
      },

      // Step 10: Compliance & Documentation
      compliance: {
        documents: data.compliance.documents.map((doc) => ({
          ...doc,
          file: undefined, // Remove file objects
        })),
        dpo_contact: data.compliance.dpo_contact,
        quality_config: data.compliance.quality_config,
      },

      // Step 11: Admin & Staff Invitations
      admin_team: data.adminTeam,

      // Step 12: Review & Submission
      publication_plan: data.review.publication_plan,
      acknowledgements: data.review.acknowledgements,
      operational_readiness: data.review.operational_readiness,

      // Metadata
      metadata: {
        autosave_version: data.metadata.autosave_version,
        collaboration_notes: data.metadata.collaboration_notes,
      },
    };
  }, [data]);

  // ============================================================================
  // AUTOSAVE
  // ============================================================================

  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      saveToLocalStorage();
    }, 1000); // Debounce for 1 second

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [data, currentStep, saveToLocalStorage]);

  // ============================================================================
  // LOAD ON MOUNT
  // ============================================================================

  useEffect(() => {
    loadFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: HospitalOnboardingContextType = useMemo(
    () => ({
      data,
      currentStep,
      activityLog,
      collaborators,
      lastSaved,
      isSaving,
      isStepValid,
      getStepCompletion,
      updateData,
      setCurrentStep,
      nextStep,
      previousStep,
      resetData,
      saveToLocalStorage,
      loadFromLocalStorage,
      addActivityLog,
      addCollaborator,
      removeCollaborator,
      buildSubmissionPayload,
    }),
    [
      data,
      currentStep,
      activityLog,
      collaborators,
      lastSaved,
      isSaving,
      isStepValid,
      getStepCompletion,
      updateData,
      nextStep,
      previousStep,
      resetData,
      saveToLocalStorage,
      loadFromLocalStorage,
      addActivityLog,
      addCollaborator,
      removeCollaborator,
      buildSubmissionPayload,
    ]
  );

  return (
    <HospitalOnboardingContext.Provider value={value}>
      {children}
    </HospitalOnboardingContext.Provider>
  );
};
