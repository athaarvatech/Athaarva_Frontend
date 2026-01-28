"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, Lock } from "lucide-react";
import { useSecureSuperAdminAuth } from "@/contexts/SecureSuperAdminAuthContext";

/**
 * Access Denied Page
 * 
 * Shown when user's IP is not whitelisted for super-admin access.
 */
export default function AccessDeniedPage() {
  const { clientIP } = useSecureSuperAdminAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Danger pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #dc2626 0px,
              #dc2626 10px,
              transparent 10px,
              transparent 20px
            )`,
          }}
        />
      </div>

      <Card className="max-w-lg w-full bg-red-950/30 border-red-500/30 backdrop-blur-xl">
        <CardContent className="pt-10 pb-8 text-center space-y-8">
          {/* Icon */}
          <div className="relative inline-flex">
            <div className="w-24 h-24 bg-red-600/20 border-2 border-red-500/50 rounded-full flex items-center justify-center">
              <Lock className="h-12 w-12 text-red-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
            <p className="text-red-200/80 text-lg">
              You are not authorized to access this secure area.
            </p>
          </div>

          {/* IP Info */}
          <div className="bg-slate-900/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-5 w-5 text-slate-400" />
              <span className="text-slate-300">Your IP Address</span>
            </div>
            <code className="block text-xl font-mono text-red-300 bg-slate-800/50 py-3 px-6 rounded-lg">
              {clientIP || "Unable to detect"}
            </code>
            <p className="text-sm text-slate-500">
              This IP address is not in the authorized whitelist
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <p className="text-slate-400">
              If you believe you should have access, please contact the system administrator
              with your IP address above.
            </p>
            
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500">
                For security purposes, all access attempts are logged and monitored.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
