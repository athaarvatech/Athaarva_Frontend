/**
 * Patient Billing Service
 * Handles billing, invoices, payments, and insurance claims for patients
 */

import apiService from '../api-service';

// ==================== TYPES ====================

export interface Invoice {
  id: string;
  invoice_number: string;
  patient_id: string;
  encounter_id?: string;
  hospital_id: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  status: 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled' | 'refunded';
  notes?: string;
  items: InvoiceItem[];
  provider?: {
    id: string;
    name: string;
    specialty?: string;
  };
  hospital?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  service_code: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: 'consultation' | 'procedure' | 'medication' | 'lab' | 'imaging' | 'other';
}

export interface Payment {
  id: string;
  payment_number: string;
  invoice_id: string;
  patient_id: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'upi' | 'insurance' | 'wallet';
  transaction_id?: string;
  payment_date: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  receipt_url?: string;
  invoice?: Invoice;
  created_at: string;
}

export interface InsuranceClaim {
  id: string;
  claim_number: string;
  patient_id: string;
  invoice_id: string;
  insurance_policy_id: string;
  claim_amount: number;
  approved_amount?: number;
  rejected_amount?: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'partially_approved' | 'rejected' | 'appealed';
  submission_date?: string;
  response_date?: string;
  rejection_reason?: string;
  notes?: string;
  documents: ClaimDocument[];
  policy?: InsurancePolicy;
  invoice?: Invoice;
  created_at: string;
  updated_at: string;
}

export interface ClaimDocument {
  id: string;
  claim_id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
}

export interface InsurancePolicy {
  id: string;
  patient_id: string;
  provider_name: string;
  policy_number: string;
  plan_name: string;
  group_number?: string;
  member_id: string;
  coverage_start_date: string;
  coverage_end_date?: string;
  deductible: number;
  deductible_met: number;
  out_of_pocket_max: number;
  out_of_pocket_met: number;
  co_pay_amount?: number;
  co_insurance_percentage?: number;
  is_primary: boolean;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  created_at: string;
}

export interface BillingSummary {
  total_billed: number;
  total_paid: number;
  total_pending: number;
  total_overdue: number;
  insurance_covered: number;
  out_of_pocket: number;
  pending_claims: number;
  year_to_date: {
    total_billed: number;
    total_paid: number;
    insurance_covered: number;
    out_of_pocket: number;
  };
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

// Helper to build query strings
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `?${query}` : '';
}

// ==================== API FUNCTIONS ====================

/**
 * Get patient billing summary
 */
export async function getBillingSummary(patientId: string): Promise<BillingSummary> {
  return apiService.get<BillingSummary>(`/patients/${patientId}/billing/summary`);
}

/**
 * Get patient invoices
 */
export async function getInvoices(
  patientId: string,
  params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ invoices: Invoice[]; total: number }> {
  const query = buildQueryString(params);
  return apiService.get<{ invoices: Invoice[]; total: number }>(
    `/patients/${patientId}/invoices${query}`
  );
}

/**
 * Get invoice details
 */
export async function getInvoice(invoiceId: string): Promise<Invoice> {
  return apiService.get<Invoice>(`/invoices/${invoiceId}`);
}

/**
 * Download invoice PDF
 */
export async function downloadInvoicePDF(invoiceId: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const url = `/api/v1/invoices/${invoiceId}/pdf`;
  window.open(`${url}?token=${token}`, '_blank');
}

/**
 * Get payment history
 */
export async function getPayments(
  patientId: string,
  params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ payments: Payment[]; total: number }> {
  const query = buildQueryString(params);
  return apiService.get<{ payments: Payment[]; total: number }>(
    `/patients/${patientId}/payments${query}`
  );
}

/**
 * Get payment details
 */
export async function getPayment(paymentId: string): Promise<Payment> {
  return apiService.get<Payment>(`/payments/${paymentId}`);
}

/**
 * Download payment receipt
 */
export async function downloadReceipt(paymentId: string): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const url = `/api/v1/payments/${paymentId}/receipt`;
  window.open(`${url}?token=${token}`, '_blank');
}

/**
 * Create payment intent for online payment
 */
export async function createPaymentIntent(
  invoiceId: string,
  amount: number,
  paymentMethod: string
): Promise<PaymentIntent> {
  return apiService.post<PaymentIntent>('/payments/create-intent', {
    invoice_id: invoiceId,
    amount,
    payment_method: paymentMethod
  });
}

/**
 * Complete payment after successful transaction
 */
export async function completePayment(
  paymentIntentId: string,
  transactionId: string
): Promise<Payment> {
  return apiService.post<Payment>('/payments/complete', {
    payment_intent_id: paymentIntentId,
    transaction_id: transactionId
  });
}

/**
 * Record manual payment (for offline payments)
 */
export async function recordPayment(data: {
  invoice_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  transaction_id?: string;
  notes?: string;
}): Promise<Payment> {
  return apiService.post<Payment>('/payments', data);
}

// ==================== INSURANCE CLAIMS ====================

/**
 * Get patient insurance policies
 */
export async function getInsurancePolicies(
  patientId: string
): Promise<InsurancePolicy[]> {
  return apiService.get<InsurancePolicy[]>(
    `/patients/${patientId}/insurance-policies`
  );
}

/**
 * Add insurance policy
 */
export async function addInsurancePolicy(
  patientId: string,
  data: Omit<InsurancePolicy, 'id' | 'patient_id' | 'deductible_met' | 'out_of_pocket_met' | 'status' | 'created_at'>
): Promise<InsurancePolicy> {
  return apiService.post<InsurancePolicy>(
    `/patients/${patientId}/insurance-policies`,
    data
  );
}

/**
 * Update insurance policy
 */
export async function updateInsurancePolicy(
  policyId: string,
  data: Partial<InsurancePolicy>
): Promise<InsurancePolicy> {
  return apiService.put<InsurancePolicy>(
    `/insurance-policies/${policyId}`,
    data
  );
}

/**
 * Delete insurance policy
 */
export async function deleteInsurancePolicy(policyId: string): Promise<void> {
  await apiService.delete(`/insurance-policies/${policyId}`);
}

/**
 * Get patient claims
 */
export async function getClaims(
  patientId: string,
  params?: {
    status?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ claims: InsuranceClaim[]; total: number }> {
  const query = buildQueryString(params);
  return apiService.get<{ claims: InsuranceClaim[]; total: number }>(
    `/patients/${patientId}/claims${query}`
  );
}

/**
 * Get claim details
 */
export async function getClaim(claimId: string): Promise<InsuranceClaim> {
  return apiService.get<InsuranceClaim>(`/claims/${claimId}`);
}

/**
 * Submit new insurance claim
 */
export async function submitClaim(data: {
  patient_id: string;
  invoice_id: string;
  insurance_policy_id: string;
  claim_amount: number;
  notes?: string;
}): Promise<InsuranceClaim> {
  return apiService.post<InsuranceClaim>('/claims', data);
}

/**
 * Upload claim document
 */
export async function uploadClaimDocument(
  claimId: string,
  file: File,
  documentType: string
): Promise<ClaimDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', documentType);

  return apiService.post<ClaimDocument>(
    `/claims/${claimId}/documents`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
}

/**
 * Appeal rejected claim
 */
export async function appealClaim(
  claimId: string,
  reason: string
): Promise<InsuranceClaim> {
  return apiService.post<InsuranceClaim>(
    `/claims/${claimId}/appeal`,
    { reason }
  );
}

// ==================== BILLING REPORTS ====================

/**
 * Get billing statement for date range
 */
export async function getBillingStatement(
  patientId: string,
  fromDate: string,
  toDate: string
): Promise<{
  patient: { id: string; name: string };
  period: { from: string; to: string };
  invoices: Invoice[];
  payments: Payment[];
  opening_balance: number;
  closing_balance: number;
  total_charges: number;
  total_payments: number;
}> {
  const query = buildQueryString({ from_date: fromDate, to_date: toDate });
  return apiService.get(
    `/patients/${patientId}/billing/statement${query}`
  );
}

/**
 * Download billing statement PDF
 */
export async function downloadBillingStatement(
  patientId: string,
  fromDate: string,
  toDate: string
): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const query = buildQueryString({ from_date: fromDate, to_date: toDate, token });
  window.open(`/api/v1/patients/${patientId}/billing/statement/pdf${query}`, '_blank');
}

/**
 * Get upcoming bills
 */
export async function getUpcomingBills(
  patientId: string
): Promise<Invoice[]> {
  return apiService.get<Invoice[]>(
    `/patients/${patientId}/billing/upcoming`
  );
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Get invoice status color
 */
export function getInvoiceStatusColor(status: Invoice['status']): string {
  const colors = {
    draft: 'gray',
    sent: 'blue',
    paid: 'green',
    partially_paid: 'yellow',
    overdue: 'red',
    cancelled: 'gray',
    refunded: 'purple'
  };
  return colors[status] || 'gray';
}

/**
 * Get claim status color
 */
export function getClaimStatusColor(status: InsuranceClaim['status']): string {
  const colors = {
    draft: 'gray',
    submitted: 'blue',
    under_review: 'yellow',
    approved: 'green',
    partially_approved: 'orange',
    rejected: 'red',
    appealed: 'purple'
  };
  return colors[status] || 'gray';
}

const PatientBillingService = {
  // Summary
  getBillingSummary,
  
  // Invoices
  getInvoices,
  getInvoice,
  downloadInvoicePDF,
  
  // Payments
  getPayments,
  getPayment,
  downloadReceipt,
  createPaymentIntent,
  completePayment,
  recordPayment,
  
  // Insurance
  getInsurancePolicies,
  addInsurancePolicy,
  updateInsurancePolicy,
  deleteInsurancePolicy,
  
  // Claims
  getClaims,
  getClaim,
  submitClaim,
  uploadClaimDocument,
  appealClaim,
  
  // Reports
  getBillingStatement,
  downloadBillingStatement,
  getUpcomingBills,
  
  // Utilities
  formatCurrency,
  getInvoiceStatusColor,
  getClaimStatusColor
};

export default PatientBillingService;
