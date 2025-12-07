"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Clock,
  User,
  Stethoscope,
  Pill,
  FlaskConical,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  Send,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";
import { format } from "date-fns";

interface ConsultationSummaryProps {
  onComplete?: () => void;
  onEdit?: (section: string) => void;
}

interface SummarySection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
  isComplete: boolean;
  isRequired: boolean;
}

export function ConsultationSummary({ onComplete, onEdit }: ConsultationSummaryProps) {
  const { consultation, saveConsultation, updateConsultation } = useConsultation();
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [finalNotes, setFinalNotes] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [confirmations, setConfirmations] = useState({
    documentation: false,
    prescriptions: false,
    labOrders: false,
    followUp: false,
    billing: false,
  });

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  // Check if section is complete
  const checkDocumentation = () => {
    return Boolean(
      consultation.documentation.subjective ||
      consultation.documentation.objective ||
      consultation.documentation.assessment ||
      consultation.documentation.plan
    );
  };

  // Summary sections
  const sections: SummarySection[] = [
    {
      id: "patient",
      title: "Patient Information",
      icon: User,
      isComplete: true,
      isRequired: true,
      content: (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Patient ID</span>
            <span className="font-medium">{consultation.patientId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Visit Date</span>
            <span className="font-medium">
              {format(consultation.startTime, "PPP")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">
              {formatDuration(consultation.duration)}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "documentation",
      title: "Clinical Documentation",
      icon: FileText,
      isComplete: checkDocumentation(),
      isRequired: true,
      content: (
        <div className="space-y-4">
          {/* Subjective */}
          <div>
            <h4 className="font-medium text-sm mb-1">Subjective</h4>
            {consultation.documentation.subjective ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {consultation.documentation.subjective}
              </p>
            ) : (
              <p className="text-sm text-red-500 italic">Not documented</p>
            )}
          </div>
          
          {/* Objective */}
          <div>
            <h4 className="font-medium text-sm mb-1">Objective</h4>
            {consultation.documentation.objective ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {consultation.documentation.objective}
              </p>
            ) : (
              <p className="text-sm text-red-500 italic">Not documented</p>
            )}
          </div>
          
          {/* Assessment */}
          <div>
            <h4 className="font-medium text-sm mb-1">Assessment</h4>
            {consultation.documentation.assessment ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {consultation.documentation.assessment}
              </p>
            ) : (
              <p className="text-sm text-red-500 italic">Not documented</p>
            )}
          </div>
          
          {/* Plan */}
          <div>
            <h4 className="font-medium text-sm mb-1">Plan</h4>
            {consultation.documentation.plan ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {consultation.documentation.plan}
              </p>
            ) : (
              <p className="text-sm text-red-500 italic">Not documented</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "diagnosis",
      title: "Diagnosis & Billing Codes",
      icon: Stethoscope,
      isComplete: consultation.aiSuggestions.billingCodes.length > 0,
      isRequired: false,
      content: (
        <div>
          {consultation.aiSuggestions.diagnoses.length > 0 ? (
            <div className="space-y-2">
              {consultation.aiSuggestions.diagnoses.map((diagnosis: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline">{diagnosis.code}</Badge>
                  <span className="text-sm">{diagnosis.description}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No diagnoses added yet
            </p>
          )}
        </div>
      ),
    },
    {
      id: "prescriptions",
      title: "Prescriptions",
      icon: Pill,
      isComplete: false, // Would check prescription context
      isRequired: false,
      content: (
        <div>
          <p className="text-sm text-muted-foreground italic">
            Check prescriptions tab for medication orders
          </p>
        </div>
      ),
    },
    {
      id: "labOrders",
      title: "Lab Orders",
      icon: FlaskConical,
      isComplete: false, // Would check lab orders
      isRequired: false,
      content: (
        <div>
          <p className="text-sm text-muted-foreground italic">
            Check lab orders for pending tests
          </p>
        </div>
      ),
    },
    {
      id: "followUp",
      title: "Follow-Up",
      icon: Calendar,
      isComplete: false, // Would check follow-up scheduling
      isRequired: false,
      content: (
        <div>
          <p className="text-sm text-muted-foreground italic">
            No follow-up scheduled
          </p>
        </div>
      ),
    },
  ];

  // Check all required sections
  const allRequiredComplete = sections
    .filter((s) => s.isRequired)
    .every((s) => s.isComplete);

  // Complete consultation
  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      // Save final notes
      await saveConsultation();
      
      // Update status to completed
      updateConsultation({
        status: "Completed",
      });

      // TODO: Call backend API to complete consultation
      // await consultationService.completeConsultation(consultation.id, {
      //   final_notes: finalNotes,
      //   follow_up_recommended: true,
      // });

      setShowConfirmDialog(false);
      setShowCompleteDialog(false);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error completing consultation:", error);
      alert("Failed to complete consultation. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  // Print summary
  const printSummary = () => {
    window.print();
  };

  // Download summary
  const downloadSummary = () => {
    // TODO: Generate PDF summary
    alert("PDF download coming soon");
  };

  // Send to patient
  const sendToPatient = () => {
    // TODO: Send summary to patient
    alert("Send to patient coming soon");
  };

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Consultation Summary
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={consultation.status === "Completed" ? "default" : "secondary"}
                className={
                  consultation.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }
              >
                {consultation.status}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {formatDuration(consultation.duration)}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Sections */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-4 pr-4">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    {section.title}
                    {section.isRequired && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {section.isComplete ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    ) : section.isRequired ? (
                      <Badge className="bg-red-100 text-red-800">
                        <X className="h-3 w-3 mr-1" />
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="outline">Optional</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(section.id)}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{section.content}</CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Actions */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={printSummary}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={downloadSummary}>
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={sendToPatient}>
                <Send className="h-4 w-4 mr-1" />
                Send to Patient
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={saveConsultation}
              >
                Save Draft
              </Button>
              <Button
                onClick={() => setShowCompleteDialog(true)}
                disabled={consultation.status === "Completed"}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Complete Consultation
              </Button>
            </div>
          </div>
          
          {!allRequiredComplete && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Required sections incomplete
                </p>
                <p className="text-sm text-amber-600">
                  Please complete all required sections before finalizing the consultation.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complete Consultation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Consultation</DialogTitle>
            <DialogDescription>
              Review and confirm consultation details before completing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Final Notes */}
            <div>
              <Label>Final Notes (Optional)</Label>
              <Textarea
                placeholder="Add any final notes or summary..."
                value={finalNotes}
                onChange={(e) => setFinalNotes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Confirmation Checklist */}
            <div>
              <Label className="mb-2 block">Confirmation Checklist</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={confirmations.documentation}
                    onCheckedChange={(checked) =>
                      setConfirmations((prev) => ({
                        ...prev,
                        documentation: checked === true,
                      }))
                    }
                  />
                  <span className="text-sm">
                    Clinical documentation is complete and accurate
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={confirmations.prescriptions}
                    onCheckedChange={(checked) =>
                      setConfirmations((prev) => ({
                        ...prev,
                        prescriptions: checked === true,
                      }))
                    }
                  />
                  <span className="text-sm">
                    All prescriptions have been reviewed
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={confirmations.labOrders}
                    onCheckedChange={(checked) =>
                      setConfirmations((prev) => ({
                        ...prev,
                        labOrders: checked === true,
                      }))
                    }
                  />
                  <span className="text-sm">
                    Lab orders have been placed if needed
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={confirmations.followUp}
                    onCheckedChange={(checked) =>
                      setConfirmations((prev) => ({
                        ...prev,
                        followUp: checked === true,
                      }))
                    }
                  />
                  <span className="text-sm">
                    Follow-up has been scheduled if appropriate
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={confirmations.billing}
                    onCheckedChange={(checked) =>
                      setConfirmations((prev) => ({
                        ...prev,
                        billing: checked === true,
                      }))
                    }
                  />
                  <span className="text-sm">
                    Billing codes have been assigned
                  </span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowConfirmDialog(true)}>
              Complete Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to complete this consultation? This action
              will finalize all documentation and cannot be easily undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete} disabled={isCompleting}>
              {isCompleting ? "Completing..." : "Yes, Complete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ConsultationSummary;
