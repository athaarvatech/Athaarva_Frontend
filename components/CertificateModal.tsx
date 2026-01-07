"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: {
    name: string;
    issuing_authority: string;
    issue_date: string;
    expiry_date?: string;
    certificate_file?: string;
  } | null;
}

export function CertificateModal({ isOpen, onClose, license }: CertificateModalProps) {
  if (!license) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpired = license.expiry_date
    ? new Date(license.expiry_date) < new Date()
    : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
                {license.name}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isExpired ? "destructive" : "default"}
                  className="bg-teal-100 text-teal-800 hover:bg-teal-200"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {isExpired ? "Expired" : "Active"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Details */}
          <div className="bg-slate-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Issuing Authority</p>
                  <p className="text-base font-semibold text-slate-900 mt-1">
                    {license.issuing_authority}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-500">Issue Date</p>
                  <p className="text-base font-semibold text-slate-900 mt-1">
                    {formatDate(license.issue_date)}
                  </p>
                </div>
              </div>

              {license.expiry_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Expiry Date</p>
                    <p
                      className={`text-base font-semibold mt-1 ${
                        isExpired ? "text-red-600" : "text-slate-900"
                      }`}
                    >
                      {formatDate(license.expiry_date)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certificate Image/PDF */}
          {license.certificate_file && (
            <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
              {license.certificate_file.endsWith(".pdf") ? (
                <iframe
                  src={license.certificate_file}
                  className="w-full h-[600px]"
                  title="Certificate PDF"
                />
              ) : (
                <img
                  src={license.certificate_file}
                  alt={`${license.name} Certificate`}
                  className="w-full h-auto"
                />
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              This certificate is displayed publicly on our website
            </p>
            {license.certificate_file && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(license.certificate_file, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Full Screen
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
