"use client";

/**
 * Hospital Not Found Page - Phase 6: Admin Setup & Domain Configuration
 * 
 * Error page displayed when a user tries to access an invalid
 * or non-existent hospital subdomain.
 */

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Search,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Home,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HospitalNotFoundPage() {
  const searchParams = useSearchParams();
  const attemptedSubdomain = searchParams.get("subdomain") || searchParams.get("attempted_hospital") || "";
  const reason = searchParams.get("reason") || "not_found";
  
  // Get appropriate message based on reason
  const getErrorMessage = () => {
    switch (reason) {
      case "invalid_subdomain":
        return {
          title: "Hospital Not Found",
          description: "The hospital you're looking for doesn't exist on our platform.",
        };
      case "suspended":
        return {
          title: "Hospital Temporarily Unavailable",
          description: "This hospital's services are temporarily suspended. Please contact them directly.",
        };
      case "inactive":
        return {
          title: "Hospital Inactive",
          description: "This hospital account is currently inactive. Please try again later.",
        };
      default:
        return {
          title: "Hospital Not Found",
          description: "We couldn't find the hospital you're looking for.",
        };
    }
  };
  
  const errorMessage = getErrorMessage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error Icon */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                <Building2 className="w-12 h-12 text-orange-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {errorMessage.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {errorMessage.description}
            </p>
            {attemptedSubdomain && (
              <p className="mt-3 text-gray-500">
                Attempted URL:{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                  {attemptedSubdomain}.athaarva.com
                </span>
              </p>
            )}
          </div>
          
          {/* Main Action Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="w-5 h-5 text-healthcare-primary" />
                Find Your Hospital
              </CardTitle>
              <CardDescription>
                Search for your hospital or browse our directory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search hospital name or city..."
                  defaultValue={attemptedSubdomain}
                  className="flex-1"
                />
                <Button className="bg-healthcare-primary hover:bg-healthcare-primary/90">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <Link href="/auth/selector">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="w-4 h-4 mr-2" />
                    Browse All Hospitals
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Help Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* For Patients */}
            <Card className="bg-blue-50/50 border-blue-100">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  For Patients
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have an appointment, check the confirmation email for the correct hospital link.
                </p>
                <Link href="/auth/selector">
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    Select your hospital <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* For Hospital Staff */}
            <Card className="bg-green-50/50 border-green-100">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-600" />
                  For Hospital Staff
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  If your hospital recently joined, check your invitation email for the correct URL.
                </p>
                <Button variant="link" className="p-0 h-auto text-green-600">
                  Contact support <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Support */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-3">
              Still having trouble? Our support team is here to help.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="mailto:support@athaarva.com"
                className="text-sm text-healthcare-primary hover:underline flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                support@athaarva.com
              </a>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>
            </div>
          </div>
          
          {/* Suggestions if subdomain was attempted */}
          {attemptedSubdomain && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Card className="bg-yellow-50/50 border-yellow-200">
                <CardContent className="pt-6">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Did you mean?
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {/* Generate similar suggestions */}
                    {[
                      `${attemptedSubdomain}-hospital`,
                      `${attemptedSubdomain}-clinic`,
                      `city-${attemptedSubdomain}`,
                    ].map((suggestion) => (
                      <a
                        key={suggestion}
                        href={`https://${suggestion}.athaarva.com`}
                        className="inline-flex items-center px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 hover:bg-yellow-100 border border-yellow-200 transition-colors"
                      >
                        {suggestion}.athaarva.com
                        <ArrowRight className="w-3 h-3 ml-1 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
