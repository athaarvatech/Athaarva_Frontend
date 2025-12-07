"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Building2 } from 'lucide-react';
import { SuperAdminAPIService } from '@/lib/super-admin-api';
import { HospitalOnboardingProvider } from '@/contexts/HospitalOnboardingContext';

// Import hospital onboarding components
import dynamic from 'next/dynamic';
const HospitalOnboardingPage = dynamic(() => import('./hospital/page'), { ssr: false });

interface TokenValidation {
  valid: boolean;
  invitation_id?: number;
  email?: string;
  expires_at?: string;
  hospital_draft?: unknown;
  message: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isValidating, setIsValidating] = useState(true);
  const [validation, setValidation] = useState<TokenValidation | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided');
      setIsValidating(false);
      return;
    }

    validateToken(token);
  }, [token]);

  const validateToken = async (tokenValue: string) => {
    try {
      setIsValidating(true);
      const result = await SuperAdminAPIService.validateToken(tokenValue);
      setValidation(result);
      
      if (!result.valid) {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate token');
    } finally {
      setIsValidating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Validating Invitation</h2>
            <p className="text-slate-600 text-center">
              Please wait while we verify your invitation token...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !validation?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600 mr-2" />
              Invalid Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                {error || validation?.message || 'This invitation is no longer valid.'}
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-slate-600 space-y-2">
              <p><strong>Common reasons for invalid invitations:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The invitation has expired</li>
                <li>The invitation has already been used</li>
                <li>The invitation has been revoked</li>
                <li>The token is malformed or corrupted</li>
              </ul>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-4">
                Please contact your administrator for a new invitation.
              </p>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Token is valid, show invitation details and proceed to onboarding
  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50">
      {/* Valid invitation banner */}
      <div className="bg-emerald-50 border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <div>
                <h1 className="text-lg font-semibold text-emerald-900">
                  Valid Hospital Invitation
                </h1>
                <p className="text-sm text-emerald-700">
                  Welcome! Your invitation for <strong>{validation.email}</strong> is valid.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-emerald-700">
              <Clock className="h-4 w-4" />
              <span>
                Expires: {validation.expires_at && formatDate(validation.expires_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital draft preview if available */}
      {validation.hospital_draft && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Pre-filled Data Available
              </span>
              <span className="text-sm text-blue-700">
                Some hospital information has been pre-filled for your convenience.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Onboarding Form */}
      <HospitalOnboardingProvider>
        <TokenAwareHospitalOnboarding 
          token={token!}
          validationData={validation}
        />
      </HospitalOnboardingProvider>
    </div>
  );
}

// Component that handles the hospital onboarding with token context
function TokenAwareHospitalOnboarding({ 
  token, 
  validationData 
}: { 
  token: string; 
  validationData: TokenValidation;
}) {
  return <HospitalOnboardingPage token={token} validationData={validationData} />;
}