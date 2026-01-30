"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Shield,
  Smartphone,
  Check,
  Copy,
  AlertCircle,
  Loader2,
  ArrowRight,
  Key,
  Download,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { API_CONFIG } from "@/lib/api-config";
import { toast } from "sonner";

interface TOTPSetupResponse {
  success: boolean;
  message: string;
  secret?: string;
  provisioning_uri?: string;
  qr_code_data?: string;
}

interface TOTPVerifyResponse {
  success: boolean;
  message: string;
  backup_codes?: string[];
}

type SetupStep = "intro" | "scan-qr" | "verify-code" | "backup-codes" | "complete";

interface MFASetupProps {
  userId: string;
  tenantSubdomain?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  isRequired?: boolean;
}

export default function MFASetup({
  userId,
  tenantSubdomain,
  onComplete,
  onSkip,
  isRequired = false,
}: MFASetupProps) {
  const router = useRouter();
  const [step, setStep] = useState<SetupStep>("intro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // TOTP setup data
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [provisioningUri, setProvisioningUri] = useState<string | null>(null);
  
  // Verification
  const [verificationCode, setVerificationCode] = useState("");
  const codeInputRef = useRef<HTMLInputElement>(null);
  
  // Backup codes
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Focus verification input when step changes
  useEffect(() => {
    if (step === "verify-code" && codeInputRef.current) {
      setTimeout(() => codeInputRef.current?.focus(), 100);
    }
  }, [step]);

  // Initialize TOTP setup
  const handleStartSetup = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/v1/hospital-admin/auth/mfa/setup/totp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      const data: TOTPSetupResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to initialize MFA setup");
      }

      setTotpSecret(data.secret || null);
      setQrCodeData(data.qr_code_data || null);
      setProvisioningUri(data.provisioning_uri || null);
      setStep("scan-qr");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Verify TOTP code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/v1/hospital-admin/auth/mfa/setup/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            totp_code: verificationCode,
          }),
        }
      );

      const data: TOTPVerifyResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Verification failed");
      }

      if (data.backup_codes) {
        setBackupCodes(data.backup_codes);
        setStep("backup-codes");
      } else {
        setStep("complete");
      }
    } catch (err) {
      setError((err as Error).message);
      setVerificationCode("");
    } finally {
      setLoading(false);
    }
  };

  // Copy secret to clipboard
  const handleCopySecret = () => {
    if (totpSecret) {
      navigator.clipboard.writeText(totpSecret);
      toast.success("Secret copied to clipboard");
    }
  };

  // Copy all backup codes
  const handleCopyBackupCodes = () => {
    const codesText = backupCodes.join("\n");
    navigator.clipboard.writeText(codesText);
    setCopiedCodes(true);
    toast.success("Backup codes copied to clipboard");
  };

  // Download backup codes as text file
  const handleDownloadCodes = () => {
    const content = `Athaarva Healthcare - MFA Backup Codes
Generated: ${new Date().toISOString()}
========================================

${backupCodes.map((code, i) => `${i + 1}. ${code}`).join("\n")}

========================================
IMPORTANT: Keep these codes in a safe place.
Each code can only be used once.
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "athaarva-backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Backup codes downloaded");
  };

  // Complete setup
  const handleComplete = () => {
    toast.success("MFA setup complete!");
    if (onComplete) {
      onComplete();
    } else if (tenantSubdomain) {
      router.push(`/hospital/${tenantSubdomain}/admin/settings/security`);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="max-w-lg mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-healthcare-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-healthcare-primary" />
                </div>
                <CardTitle>Secure Your Account</CardTitle>
                <CardDescription>
                  Set up two-factor authentication (2FA) for enhanced security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Smartphone className="h-5 w-5 text-healthcare-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Authenticator App Required</p>
                      <p className="text-xs text-gray-600">
                        Install Google Authenticator, Authy, or Microsoft Authenticator
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Key className="h-5 w-5 text-healthcare-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Backup Codes</p>
                      <p className="text-xs text-gray-600">
                        You&apos;ll receive backup codes for account recovery
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                  onClick={handleStartSetup}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  Begin Setup
                </Button>
                {!isRequired && onSkip && (
                  <Button variant="ghost" className="w-full" onClick={onSkip}>
                    Skip for now
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        );

      case "scan-qr":
        return (
          <motion.div
            key="scan-qr"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">Step 1 of 3</Badge>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>
                  Open your authenticator app and scan this QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  {qrCodeData ? (
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <Image
                        src={qrCodeData}
                        alt="TOTP QR Code"
                        width={200}
                        height={200}
                        className="rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Manual entry option */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    Can&apos;t scan? Enter this code manually:
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      value={totpSecret || ""}
                      readOnly
                      className="font-mono text-center tracking-wider"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopySecret}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                  onClick={() => setStep("verify-code")}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );

      case "verify-code":
        return (
          <motion.div
            key="verify-code"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">Step 2 of 3</Badge>
                <CardTitle>Verify Setup</CardTitle>
                <CardDescription>
                  Enter the 6-digit code from your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verify-code">Verification Code</Label>
                    <Input
                      ref={codeInputRef}
                      id="verify-code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="000000"
                      className="text-center text-2xl tracking-widest font-mono"
                      autoComplete="one-time-code"
                    />
                    <p className="text-xs text-gray-500 text-center">
                      The code refreshes every 30 seconds
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                    disabled={loading || verificationCode.length !== 6}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Verify
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep("scan-qr")}
                >
                  Back to QR Code
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );

      case "backup-codes":
        return (
          <motion.div
            key="backup-codes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">Step 3 of 3</Badge>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-healthcare-primary" />
                  Save Your Backup Codes
                </CardTitle>
                <CardDescription>
                  Store these codes securely. Each code can only be used once.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Important:</strong> If you lose access to your authenticator app,
                    you&apos;ll need these codes to sign in.
                  </AlertDescription>
                </Alert>

                {/* Backup codes grid */}
                <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg border">
                  {backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="font-mono text-sm bg-white px-3 py-2 rounded border text-center"
                    >
                      {code}
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCopyBackupCodes}
                  >
                    {copiedCodes ? (
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedCodes ? "Copied!" : "Copy All"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDownloadCodes}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                  onClick={() => setStep("complete")}
                >
                  I&apos;ve Saved My Codes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );

      case "complete":
        return (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="pt-8 pb-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  MFA Setup Complete!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your account is now protected with two-factor authentication.
                  You&apos;ll need your authenticator app to sign in from now on.
                </p>
                <Button
                  className="bg-healthcare-primary hover:bg-healthcare-primary/90"
                  onClick={handleComplete}
                >
                  Continue to Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cool-white to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}
