"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Shield,
  Mail,
  Globe,
  Key,
  Save,
  RefreshCcw,
} from "lucide-react";
import { useSecureSuperAdminAuth } from "@/contexts/SecureSuperAdminAuthContext";
import { toast } from "sonner";
import { useState } from "react";

export default function SecureSettingsPage() {
  const { user } = useSecureSuperAdminAuth();
  const [saving, setSaving] = useState(false);

  // Settings state (these would be loaded from API in production)
  const [settings, setSettings] = useState({
    otpExpiryMinutes: 15,
    sessionExpiryHours: 4,
    maxOtpAttempts: 3,
    ipWhitelistEnabled: true,
    requireOtpForAllLogins: true,
    smtpEnabled: true,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // In production, this would call an API to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-white">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Configuration
          </p>
          <h2 className="text-3xl font-semibold">Security Settings</h2>
          <p className="text-white/70">
            Configure platform security, authentication, and access controls.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-healthcare-primary hover:bg-healthcare-primary/80"
        >
          {saving ? (
            <>
              <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </header>

      {/* Current Admin Info */}
      <Card className="bg-gradient-to-r from-slate-900/60 to-slate-800/40 border-white/10">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-500/20">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-medium">Logged in as</p>
              <p className="text-white/60">{user?.email}</p>
            </div>
            <Badge className="ml-auto bg-emerald-500/20 text-emerald-100 border-0">
              2FA Verified
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* OTP Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              OTP Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>OTP Expiry (minutes)</Label>
              <Input
                type="number"
                value={settings.otpExpiryMinutes}
                onChange={(e) =>
                  setSettings({ ...settings, otpExpiryMinutes: Number(e.target.value) })
                }
                className="bg-white/10 border-white/20 text-white"
              />
              <p className="text-xs text-white/50">
                How long OTP codes remain valid after sending.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Max OTP Attempts</Label>
              <Input
                type="number"
                value={settings.maxOtpAttempts}
                onChange={(e) =>
                  setSettings({ ...settings, maxOtpAttempts: Number(e.target.value) })
                }
                className="bg-white/10 border-white/20 text-white"
              />
              <p className="text-xs text-white/50">
                Maximum failed attempts before OTP is invalidated.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Require OTP for All Logins</Label>
                <p className="text-xs text-white/50">
                  Enforce 2FA for every login attempt.
                </p>
              </div>
              <Switch
                checked={settings.requireOtpForAllLogins}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, requireOtpForAllLogins: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Session Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Session Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Session Expiry (hours)</Label>
              <Input
                type="number"
                value={settings.sessionExpiryHours}
                onChange={(e) =>
                  setSettings({ ...settings, sessionExpiryHours: Number(e.target.value) })
                }
                className="bg-white/10 border-white/20 text-white"
              />
              <p className="text-xs text-white/50">
                How long sessions remain active after OTP verification.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>IP Whitelist Enabled</Label>
                <p className="text-xs text-white/50">
                  Only allow access from whitelisted IPs.
                </p>
              </div>
              <Switch
                checked={settings.ipWhitelistEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, ipWhitelistEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>SMTP Enabled</Label>
                <p className="text-xs text-white/50">
                  Enable email sending for OTP and notifications.
                </p>
              </div>
              <Switch
                checked={settings.smtpEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, smtpEnabled: checked })
                }
              />
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-white/70">
                SMTP settings are configured via environment variables. Check the server
                configuration for SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* IP Whitelist */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              IP Whitelist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/70">
              Manage whitelisted IP addresses and CIDR ranges in the database.
              Currently managed via direct database access.
            </p>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-200">
                <strong>Note:</strong> To add IPs to the whitelist, insert records into
                the <code className="bg-white/10 px-1 rounded">platform.super_admin_ip_whitelist</code> table.
              </p>
            </div>
            <div className="text-xs text-white/50 space-y-1">
              <p>Example CIDR ranges:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li><code>0.0.0.0/0</code> - All IPv4 addresses (development only)</li>
                <li><code>192.168.1.0/24</code> - Local network</li>
                <li><code>203.0.113.50/32</code> - Single IP address</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
