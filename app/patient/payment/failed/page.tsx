'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { XCircle, RotateCcw, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  
  const errorCode = searchParams.get('error_code');
  const errorMessage = searchParams.get('error_message') || 'Your payment could not be processed.';
  const invoiceId = searchParams.get('invoice_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
          <CardDescription>We were unable to process your payment.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Details */}
          <Alert variant="destructive">
            <AlertTitle>What happened?</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
            {errorCode && (
              <p className="mt-2 text-xs text-muted-foreground">Error Code: {errorCode}</p>
            )}
          </Alert>

          {/* Suggestions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Try the following:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Check if your card/UPI has sufficient balance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Verify your card details are correct
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Try a different payment method
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Contact your bank if the issue persists
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {invoiceId && (
              <Button asChild className="w-full">
                <Link href={`/patient/billing?invoice=${invoiceId}`}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>
            )}
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/patient/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/support">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>

          {/* Note */}
          <p className="text-center text-xs text-muted-foreground">
            If money was deducted from your account, it will be refunded within 5-7 business days.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
