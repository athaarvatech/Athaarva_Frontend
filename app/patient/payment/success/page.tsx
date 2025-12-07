'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, Home, FileText, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');
  const amount = searchParams.get('amount');
  const invoiceId = searchParams.get('invoice_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
          <CardDescription>Your payment has been processed successfully.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {amount && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="text-xl font-semibold text-green-700 flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {parseFloat(amount).toLocaleString('en-IN')}
                </span>
              </div>
            )}
            
            {paymentId && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-mono text-sm">{paymentId}</span>
              </div>
            )}
            
            {orderId && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-sm">{orderId}</span>
              </div>
            )}
          </div>

          {/* Info Message */}
          <div className="text-center text-sm text-muted-foreground">
            <p>A confirmation email has been sent to your registered email address.</p>
            <p className="mt-1">Please save your payment ID for future reference.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {invoiceId && (
              <Button asChild variant="outline" className="w-full">
                <Link href={`/patient/billing?invoice=${invoiceId}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Invoice
                </Link>
              </Button>
            )}
            
            <Button asChild className="w-full">
              <Link href="/patient/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
