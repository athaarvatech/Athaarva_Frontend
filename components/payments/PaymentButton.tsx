'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle2, XCircle, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface PaymentOrder {
  order_id: string;
  amount: number;
  currency: string;
  razorpay_key: string;
  receipt: string;
  description: string;
  status: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  payment_id: string;
  order_id: string;
  amount: number;
  status: string;
  method?: string;
  invoice_id?: string;
  message: string;
}

export interface PaymentButtonProps {
  /** Invoice ID to pay for */
  invoiceId: string;
  /** Amount in rupees */
  amount: number;
  /** Description shown on Razorpay checkout */
  description?: string;
  /** Patient/customer details */
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  /** Called when payment is successful */
  onSuccess?: (result: PaymentVerificationResult) => void;
  /** Called when payment fails */
  onError?: (error: Error) => void;
  /** Called when payment is cancelled */
  onCancel?: () => void;
  /** Custom button text */
  buttonText?: string;
  /** Button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Additional class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Show amount on button */
  showAmount?: boolean;
}

// Declare Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

// API Functions
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function createPaymentOrder(invoiceId: string, amount?: number, description?: string): Promise<PaymentOrder> {
  const response = await fetch(`${API_BASE}/api/v1/payments/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add auth header if needed
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      invoice_id: invoiceId,
      amount,
      description,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create payment order');
  }

  return response.json();
}

async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<PaymentVerificationResult> {
  const response = await fetch(`${API_BASE}/api/v1/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Payment verification failed');
  }

  return response.json();
}

// Load Razorpay script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * PaymentButton Component
 * 
 * A complete payment button that handles:
 * - Creating payment orders
 * - Opening Razorpay checkout
 * - Verifying payments
 * - Success/error handling
 */
export function PaymentButton({
  invoiceId,
  amount,
  description,
  customerInfo,
  onSuccess,
  onError,
  onCancel,
  buttonText = 'Pay Now',
  variant = 'default',
  size = 'default',
  className,
  disabled = false,
  showAmount = true,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    details?: PaymentVerificationResult;
  } | null>(null);

  const handlePayment = useCallback(async () => {
    setIsLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway. Please refresh and try again.');
      }

      // Create order
      const order = await createPaymentOrder(invoiceId, amount, description);

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: order.razorpay_key,
        amount: order.amount * 100, // Convert to paise
        currency: order.currency,
        name: 'Athaarva Healthcare',
        description: order.description,
        order_id: order.order_id,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const result = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            setPaymentResult({
              success: true,
              message: 'Payment successful!',
              details: result,
            });
            setShowResult(true);
            onSuccess?.(result);
          } catch (error) {
            const err = error instanceof Error ? error : new Error('Payment verification failed');
            setPaymentResult({
              success: false,
              message: err.message,
            });
            setShowResult(true);
            onError?.(err);
          }
        },
        prefill: {
          name: customerInfo?.name,
          email: customerInfo?.email,
          contact: customerInfo?.phone,
        },
        theme: {
          color: '#0d9488', // Teal color matching Athaarva branding
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onCancel?.();
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', () => {
        setPaymentResult({
          success: false,
          message: 'Payment failed. Please try again.',
        });
        setShowResult(true);
        onError?.(new Error('Payment failed'));
      });
      razorpay.open();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to initiate payment');
      setPaymentResult({
        success: false,
        message: err.message,
      });
      setShowResult(true);
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [invoiceId, amount, description, customerInfo, onSuccess, onError, onCancel]);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn('gap-2', className)}
        onClick={handlePayment}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            {buttonText}
            {showAmount && amount > 0 && (
              <span className="flex items-center">
                <IndianRupee className="h-3 w-3" />
                {amount.toLocaleString('en-IN')}
              </span>
            )}
          </>
        )}
      </Button>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {paymentResult?.success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Payment Successful
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  Payment Failed
                </>
              )}
            </DialogTitle>
            <DialogDescription>{paymentResult?.message}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {paymentResult?.success && paymentResult.details && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium flex items-center">
                    <IndianRupee className="h-3 w-3" />
                    {paymentResult.details.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs">{paymentResult.details.payment_id}</span>
                </div>
                {paymentResult.details.method && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span className="capitalize">{paymentResult.details.method}</span>
                  </div>
                )}
              </div>
            )}

            {!paymentResult?.success && (
              <Alert variant="destructive">
                <AlertDescription>
                  Your payment could not be processed. Please try again or contact support if the
                  issue persists.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowResult(false)}>
              {paymentResult?.success ? 'Done' : 'Close'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * PaymentStatus Component
 * Shows payment status with appropriate styling
 */
export function PaymentStatus({
  status,
  className,
}: {
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  className?: string;
}) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800',
    },
    completed: {
      label: 'Paid',
      className: 'bg-green-100 text-green-800',
    },
    failed: {
      label: 'Failed',
      className: 'bg-red-100 text-red-800',
    },
    refunded: {
      label: 'Refunded',
      className: 'bg-purple-100 text-purple-800',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-gray-100 text-gray-800',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export default PaymentButton;
