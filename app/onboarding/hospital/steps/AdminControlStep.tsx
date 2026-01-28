"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  Check,
  X,
  Loader2,
  Shield,
  Info,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Simulated domain availability check (replace with actual API call)
async function checkDomainAvailability(
  subdomain: string
): Promise<{ available: boolean; suggestions?: string[] }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Reserved/taken domains for demo
  const takenDomains = [
    "apollo",
    "fortis",
    "max",
    "medanta",
    "aiims",
    "admin",
    "www",
    "api",
    "app",
    "mail",
  ];

  const normalized = subdomain.toLowerCase().trim();

  if (takenDomains.includes(normalized)) {
    // Generate suggestions
    const suggestions = [
      `${normalized}-hospital`,
      `${normalized}-healthcare`,
      `${normalized}-care`,
      `${normalized}1`,
    ];
    return { available: false, suggestions };
  }

  // Basic validation
  if (normalized.length < 3) {
    return { available: false, suggestions: [] };
  }

  if (
    !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(normalized) &&
    normalized.length > 2
  ) {
    return { available: false, suggestions: [] };
  }

  return { available: true };
}

export default function AdminControlStep() {
  const { data, updateData } = useHospitalOnboarding();

  // Local state for domain checking
  const [domainCheckLoading, setDomainCheckLoading] = useState(false);
  const [domainStatus, setDomainStatus] = useState<{
    checked: boolean;
    available: boolean;
    suggestions?: string[];
  }>({ checked: false, available: false });

  // Get admin control data from context or initialize defaults
  const adminControl = data.adminControl || {
    admin: {
      full_name: "",
      email: data.invitation?.email || "",
      phone: "",
      age: "",
    },
    domain: {
      subdomain: "",
      verified: false,
    },
  };

  // Update admin control data in context
  const updateAdminControl = useCallback(
    (updates: Partial<typeof adminControl>) => {
      updateData("adminControl", { ...data.adminControl, ...updates });
    },
    [data.adminControl, updateData]
  );

  // Handle admin field changes
  const handleAdminChange = (field: string, value: string) => {
    updateAdminControl({
      admin: { ...adminControl.admin, [field]: value },
    });
  };

  // Check domain availability
  const handleCheckDomain = useCallback(async () => {
    const subdomain = adminControl.domain.subdomain.trim();
    if (!subdomain || subdomain.length < 3) {
      setDomainStatus({
        checked: true,
        available: false,
        suggestions: [],
      });
      return;
    }

    setDomainCheckLoading(true);
    try {
      const result = await checkDomainAvailability(subdomain);
      setDomainStatus({
        checked: true,
        available: result.available,
        suggestions: result.suggestions,
      });

      if (result.available) {
        updateAdminControl({
          domain: { ...adminControl.domain, verified: true },
        });
      } else {
        updateAdminControl({
          domain: { ...adminControl.domain, verified: false },
        });
      }
    } catch {
      setDomainStatus({
        checked: true,
        available: false,
        suggestions: [],
      });
    } finally {
      setDomainCheckLoading(false);
    }
  }, [adminControl.domain, updateAdminControl]);

  // Handle domain change
  const handleDomainChange = (value: string) => {
    // Normalize: lowercase, only alphanumeric and hyphens
    const normalized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-/, "");

    updateAdminControl({
      domain: { subdomain: normalized, verified: false },
    });
    setDomainStatus({ checked: false, available: false });
  };

  // Select a suggested domain
  const handleSelectSuggestion = (suggestion: string) => {
    updateAdminControl({
      domain: { subdomain: suggestion, verified: false },
    });
    setDomainStatus({ checked: false, available: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500/10 to-purple-100 border border-indigo-200 rounded-lg p-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Admin Control & Domain Setup
            </h3>
            <p className="text-sm text-gray-600">
              Configure your hospital administrator account and choose your
              unique subdomain
            </p>
          </div>
        </div>
      </motion.div>

      {/* Admin Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-indigo-600" />
          <h4 className="font-medium text-gray-900">
            Hospital Administrator Details
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={adminControl.admin.full_name}
                onChange={(e) => handleAdminChange("full_name", e.target.value)}
                placeholder="Enter your full name"
                className="pl-10"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                value={adminControl.admin.email}
                onChange={(e) => handleAdminChange("email", e.target.value)}
                placeholder="admin@hospital.com"
                className="pl-10"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="tel"
                value={adminControl.admin.phone}
                onChange={(e) => handleAdminChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="pl-10"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Age</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                min={18}
                max={100}
                value={adminControl.admin.age}
                onChange={(e) => handleAdminChange("age", e.target.value)}
                placeholder="Enter your age"
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Credentials Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Login Credentials Will Be Emailed
            </h4>
            <p className="text-sm text-blue-700">
              Once your onboarding is approved by the platform admin, secure login credentials 
              will be automatically generated and sent via email to:
            </p>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>
                <strong>Admin Email:</strong>{" "}
                {adminControl.admin.email || "(Enter email above)"}
              </li>
              <li>
                <strong>Hospital Owner:</strong> The email used to receive the onboarding invitation
              </li>
            </ul>
            <p className="mt-2 text-xs text-blue-600">
              Please ensure the email addresses are correct. You will use these credentials to 
              access your hospital admin dashboard.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Domain Selection Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-gray-900">Hospital Domain</h4>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Choose a unique subdomain for your hospital. This will be your
          hospital&apos;s web address on the Athaarva platform.
        </p>

        <div className="space-y-4">
          {/* Domain Input */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Your Subdomain <span className="text-red-500">*</span>
            </Label>
            <div className="mt-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  value={adminControl.domain.subdomain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  placeholder="your-hospital"
                  className={cn(
                    "pr-4",
                    domainStatus.checked &&
                      (domainStatus.available
                        ? "border-green-500 focus:ring-green-500"
                        : "border-red-500 focus:ring-red-500")
                  )}
                />
              </div>
              <span className="text-gray-500 text-sm font-medium">
                .athaarva.com
              </span>
              <Button
                onClick={handleCheckDomain}
                disabled={
                  domainCheckLoading ||
                  !adminControl.domain.subdomain ||
                  adminControl.domain.subdomain.length < 3
                }
                variant="outline"
                size="sm"
              >
                {domainCheckLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Check"
                )}
              </Button>
            </div>
          </div>

          {/* Domain Status */}
          {domainStatus.checked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={cn(
                "p-3 rounded-lg border",
                domainStatus.available
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              )}
            >
              <div className="flex items-center gap-2">
                {domainStatus.available ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {adminControl.domain.subdomain}.athaarva.com is
                      available!
                    </span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      This subdomain is not available
                    </span>
                  </>
                )}
              </div>

              {/* Suggestions */}
              {!domainStatus.available &&
                domainStatus.suggestions &&
                domainStatus.suggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">
                      Try one of these alternatives:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {domainStatus.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                          {suggestion}.athaarva.com
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </motion.div>
          )}

          {/* Domain Preview */}
          {adminControl.domain.subdomain && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">
                Your hospital URL will be:
              </p>
              <p className="text-lg font-medium text-indigo-600">
                https://{adminControl.domain.subdomain || "your-hospital"}
                .athaarva.com
              </p>
            </div>
          )}

          {/* Domain Rules */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Minimum 3 characters</p>
            <p>• Only lowercase letters, numbers, and hyphens allowed</p>
            <p>• Cannot start or end with a hyphen</p>
            <p>• Once set, the domain cannot be changed</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
