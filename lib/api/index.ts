/**
 * API Module Exports
 * 
 * Central export point for all API services.
 */

export { superAdminAPI } from './super-admin';
export type {
  DashboardMetrics,
  TenantResponse,
  InvitationResponse,
  InvitationCreateResponse,
  TokenValidationResponse,
  OnboardingSessionResponse as SuperAdminOnboardingSession,
  OnboardingWizardState as SuperAdminWizardState,
  CreateInvitationRequest,
  LoginRequest,
  TokenResponse,
  CurrentUser,
} from './super-admin';

export { onboardingAPI } from './onboarding';
export type {
  ValidateTokenResponse,
  AcceptInvitationRequest,
  AcceptInvitationResponse,
  OnboardingSessionResponse,
  OnboardingWizardState,
  OnboardingChecklist,
  OrganizationProfileData,
  LocationsContactsData,
  BrandingData,
  SiteContentData,
  ServicesData,
  LeadershipData,
  OperationalPoliciesData,
  ComplianceData,
  IntegrationsData,
  AddressData,
  ContactData,
  LocationData,
  ServiceData,
  DepartmentData,
  LeaderPersonData,
  SaveStepRequest,
} from './onboarding';

export { hospitalAdminAPI } from './hospital-admin';
export type {
  HospitalProfile,
  AddressData as HospitalAddressData,
  ContactData as HospitalContactData,
  DataProtectionOfficerData,
  TelehealthPolicyData,
  TenantBranding,
  BrandingUpdate,
  StaffMember,
  StaffInviteRequest,
  DashboardStats,
} from './hospital-admin';
