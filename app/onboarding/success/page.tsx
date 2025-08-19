"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Building2, Globe, ArrowRight } from "lucide-react";

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subdomain = searchParams.get('subdomain');

  useEffect(() => {
    // Redirect to home after 10 seconds if no action is taken
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleGoToPortal = () => {
    if (subdomain) {
      // Redirect to the hospital's login page
      window.location.href = `https://${subdomain}.athaarva.com`;
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Hospital Setup Complete!
              </h1>
              <p className="text-gray-600 mb-6">
                Your hospital has been successfully onboarded to the Athaarva platform.
              </p>
            </motion.div>

            {/* Hospital Details */}
            {subdomain && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-healthcare-primary/5 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Building2 className="h-5 w-5 text-healthcare-primary" />
                  <span className="font-medium text-healthcare-primary">Your Hospital Portal</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {subdomain}.athaarva.com
                  </span>
                </div>
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              <Button
                onClick={handleGoToPortal}
                className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90 text-white"
                size="lg"
              >
                Access Your Hospital Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <p className="text-xs text-gray-500">
                Use the admin credentials you created to log in
              </p>
            </motion.div>

            {/* Auto-redirect notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-xs text-gray-400"
            >
              You&apos;ll be redirected automatically in 10 seconds
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
