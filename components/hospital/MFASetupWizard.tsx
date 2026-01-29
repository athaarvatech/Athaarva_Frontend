"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Smartphone,
  Key,
  Copy,
  Check,
  Download,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useHospitalAdminMFAAuth } from "@/contexts/HospitalAdminMFAAuthContext";

// =============================================================================
// Types
// =============================================================================

interface MFASetupWizardProps {
  onComplete?: () => void;
  onSkip?: () => void;
  canSkip?: boolean;
}

type SetupStep = "intro" | "qrcode" | "verify" | "backup" | "complete";

// =============================================================================
// QR Code Component (using third-party or SVG)
// =============================================================================

function QRCodeDisplay({ uri, secret }: { uri: string; secret: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    toast.success("Secret key copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR code URL using a public service (for demo)
  // In production, use a library like 'qrcode' to generate SVG
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative p-4 bg-white rounded-xl shadow-lg border">
        <img
          src={qrImageUrl}
          alt="TOTP QR Code"
          className="w-48 h-48"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-white/80 rounded-xl">
          <QrCode className="w-8 h-8 text-gray-400" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Can't scan? Enter this key manually:
        </p>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <code className="text-sm font-mono text-gray-800 select-all">
            {secret}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Backup Codes Component
// =============================================================================

function BackupCodesDisplay({
  codes,
  onDownload,
}: {
  codes: string[];
  onDownload?: () => void;
}) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = () => {
    const text = codes.join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast.success("All backup codes copied!");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownload = () => {
    const text = [
      "Athaarva Healthcare - MFA Backup Codes",
      "=====================================",
      "Keep these codes safe. Each can only be used once.",
      "",
      ...codes,
      "",
      `Generated: ${new Date().toLocaleString()}`,
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "athaarva-backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Backup codes downloaded!");
    onDownload?.();
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Save these backup codes</p>
            <p>
              If you lose access to your authenticator app, you can use these
              one-time codes to sign in. Each code can only be used once.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg border">
        {codes.map((code, index) => (
          <code
            key={index}
            className="text-sm font-mono bg-white px-3 py-2 rounded border text-center select-all"
          >
            {code}
          </code>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleCopyAll}
          className="flex-1"
        >
          {copiedAll ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          Copy All
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// Main MFA Setup Wizard
// =============================================================================

export function MFASetupWizard({
  onComplete,
  onSkip,
  canSkip = false,
}: MFASetupWizardProps) {
  const { setupTOTP, verifyTOTPSetup, loading } = useHospitalAdminMFAAuth();

  const [step, setStep] = useState<SetupStep>("intro");
  const [secret, setSecret] = useState("");
  const [qrUri, setQrUri] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedBackupCodes, setSavedBackupCodes] = useState(false);

  // Initialize TOTP setup
  const handleSetupStart = async () => {
    try {
      const result = await setupTOTP();
      setSecret(result.secret);
      setQrUri(result.qrUri);
      setBackupCodes(result.backupCodes);
      setStep("qrcode");
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize MFA setup");
    }
  };

  // Verify TOTP code
  const handleVerify = async () => {
    if (verificationCode.length < 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      await verifyTOTPSetup(verificationCode);
      setStep("backup");
      toast.success("Authenticator verified successfully!");
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
      setVerificationCode("");
    } finally {
      setVerifying(false);
    }
  };

  // Complete setup
  const handleComplete = () => {
    if (!savedBackupCodes) {
      toast.warning("Please save your backup codes first");
      return;
    }
    setStep("complete");
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  };

  // Step content
  const stepContent = {
    intro: (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-healthcare-primary/10 flex items-center justify-center">
          <Shield className="w-10 h-10 text-healthcare-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Set Up Two-Factor Authentication</h3>
          <p className="text-gray-600">
            Add an extra layer of security to your account using an authenticator app
            like Google Authenticator or Authy.
          </p>
        </div>

        <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-healthcare-primary text-white flex items-center justify-center text-sm font-medium">
              1
            </div>
            <p className="text-sm">Download an authenticator app on your phone</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-healthcare-primary text-white flex items-center justify-center text-sm font-medium">
              2
            </div>
            <p className="text-sm">Scan the QR code or enter the key manually</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-healthcare-primary text-white flex items-center justify-center text-sm font-medium">
              3
            </div>
            <p className="text-sm">Enter the code from the app to verify</p>
          </div>
        </div>

        <div className="flex gap-3">
          {canSkip && (
            <Button variant="outline" onClick={onSkip} className="flex-1">
              Skip for Now
            </Button>
          )}
          <Button
            onClick={handleSetupStart}
            className="flex-1 bg-healthcare-primary hover:bg-healthcare-primary/90"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            Get Started
          </Button>
        </div>
      </div>
    ),

    qrcode: (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <p className="text-sm text-gray-600">
            Open your authenticator app and scan this QR code
          </p>
        </div>

        <QRCodeDisplay uri={qrUri} secret={secret} />

        <Button
          onClick={() => setStep("verify")}
          className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
        >
          I've Scanned the Code
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    ),

    verify: (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Verify Your Authenticator</h3>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="verifyCode">Verification Code</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="verifyCode"
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => {
                setError(null);
                setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              }}
              className="pl-10 text-center text-lg tracking-widest font-mono"
              autoComplete="one-time-code"
              maxLength={6}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setStep("qrcode")}
            disabled={verifying}
          >
            Back
          </Button>
          <Button
            onClick={handleVerify}
            className="flex-1 bg-healthcare-primary hover:bg-healthcare-primary/90"
            disabled={verifying || verificationCode.length < 6}
          >
            {verifying ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Verify
          </Button>
        </div>
      </div>
    ),

    backup: (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Save Your Backup Codes</h3>
          <p className="text-sm text-gray-600">
            Use these if you lose access to your authenticator
          </p>
        </div>

        <BackupCodesDisplay
          codes={backupCodes}
          onDownload={() => setSavedBackupCodes(true)}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="savedCodes"
            checked={savedBackupCodes}
            onChange={(e) => setSavedBackupCodes(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="savedCodes" className="text-sm cursor-pointer">
            I have saved my backup codes
          </Label>
        </div>

        <Button
          onClick={handleComplete}
          className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
          disabled={!savedBackupCodes}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete Setup
        </Button>
      </div>
    ),

    complete: (
      <div className="text-center space-y-6 py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-green-600">
            MFA Setup Complete!
          </h3>
          <p className="text-gray-600">
            Your account is now protected with two-factor authentication.
          </p>
        </div>
      </div>
    ),
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MFA Settings Component (for already-setup users)
// =============================================================================

export function MFASettings() {
  const { mfaStatus, getMFAStatus, regenerateBackupCodes, loading } =
    useHospitalAdminMFAAuth();

  const [showRegenDialog, setShowRegenDialog] = useState(false);
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);

  useEffect(() => {
    getMFAStatus();
  }, [getMFAStatus]);

  const handleRegenerate = async () => {
    try {
      const codes = await regenerateBackupCodes();
      setNewBackupCodes(codes);
    } catch (err: any) {
      toast.error(err.message || "Failed to regenerate backup codes");
    }
  };

  if (!mfaStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-healthcare-primary" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Manage your account's security settings
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                mfaStatus.mfa_enabled
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Authenticator App</p>
              <p className="text-sm text-gray-500">
                {mfaStatus.mfa_enabled
                  ? "Enabled and verified"
                  : "Not configured"}
              </p>
            </div>
          </div>
          {mfaStatus.mfa_enabled && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
              Active
            </span>
          )}
        </div>

        {mfaStatus.mfa_enabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Backup Codes</p>
                <p className="text-sm text-gray-500">
                  {mfaStatus.backup_codes_remaining} codes remaining
                  {mfaStatus.backup_codes_used > 0 &&
                    ` (${mfaStatus.backup_codes_used} used)`}
                </p>
              </div>
              <Dialog open={showRegenDialog} onOpenChange={setShowRegenDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Regenerate Backup Codes</DialogTitle>
                    <DialogDescription>
                      {newBackupCodes.length === 0
                        ? "This will invalidate all existing backup codes. Are you sure?"
                        : "Save your new backup codes. Previous codes are now invalid."}
                    </DialogDescription>
                  </DialogHeader>

                  {newBackupCodes.length === 0 ? (
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowRegenDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleRegenerate}
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Regenerate
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <BackupCodesDisplay codes={newBackupCodes} />
                      <Button
                        onClick={() => {
                          setShowRegenDialog(false);
                          setNewBackupCodes([]);
                        }}
                        className="w-full"
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MFASetupWizard;
