"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  Key,
  Check,
  X,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useHospitalOnboarding } from "@/contexts/HospitalOnboardingContextV2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Helper function to generate a secure password
function generateSecurePassword(length: number = 16): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const allChars = lowercase + uppercase + numbers + symbols;

  let password = "";
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

// Helper function to generate username from email
function generateUsername(email: string): string {
  return email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

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

  // Local state for form
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
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
    credentials: {
      username: "",
      password: "",
      generated: false,
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

    // Auto-generate username when email changes
    if (field === "email" && value) {
      const username = generateUsername(value);
      updateAdminControl({
        admin: { ...adminControl.admin, [field]: value },
        credentials: { ...adminControl.credentials, username },
      });
    }
  };

  // Generate credentials
  const handleGenerateCredentials = () => {
    const password = generateSecurePassword(16);
    const username =
      adminControl.credentials.username ||
      generateUsername(adminControl.admin.email);

    updateAdminControl({
      credentials: {
        username,
        password,
        generated: true,
      },
    });
  };

  // Regenerate password only
  const handleRegeneratePassword = () => {
    const password = generateSecurePassword(16);
    updateAdminControl({
      credentials: {
        ...adminControl.credentials,
        password,
      },
    });
  };

  // Copy password to clipboard
  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(adminControl.credentials.password);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch {
      console.error("Failed to copy password");
    }
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

      {/* Credential Generation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Admin Credentials</h4>
          </div>
          {!adminControl.credentials.generated ? (
            <Button
              onClick={handleGenerateCredentials}
              disabled={!adminControl.admin.email}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Key className="w-4 h-4 mr-2" />
              Generate Credentials
            </Button>
          ) : (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Check className="w-3 h-3 mr-1" />
              Credentials Generated
            </Badge>
          )}
        </div>

        {adminControl.credentials.generated ? (
          <div className="space-y-4">
            {/* Username Display */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                <span className="font-mono text-sm">
                  {adminControl.credentials.username}
                </span>
                <Badge variant="outline" className="text-xs">
                  Auto-generated from email
                </Badge>
              </div>
            </div>

            {/* Password Display */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
                <span className="font-mono text-sm flex-1">
                  {showPassword
                    ? adminControl.credentials.password
                    : "••••••••••••••••"}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-8 w-8 p-0"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyPassword}
                    className="h-8 w-8 p-0"
                  >
                    {passwordCopied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegeneratePassword}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                <strong>Important:</strong> Please save these credentials
                securely. The password will be required for your first login.
                You can change it after logging in.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Key className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">
              Enter your email address first, then generate secure credentials
              for your admin account.
            </p>
          </div>
        )}
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
                .athaarva.health
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
                      {adminControl.domain.subdomain}.athaarva.health is
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
                          {suggestion}.athaarva.health
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
                .athaarva.health
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
