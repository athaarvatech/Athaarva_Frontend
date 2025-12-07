"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FlaskConical,
  Plus,
  Trash2,
  Search,
  AlertTriangle,
  Clock,
  Send,
  FileText,
  Printer,
  X,
} from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

// Types
interface LabTest {
  id: string;
  code: string;
  name: string;
  category: string;
  specimen: string;
  turnaroundTime: string;
  price?: number;
}

interface OrderedTest {
  test: LabTest;
  priority: "routine" | "urgent" | "stat";
  fasting: boolean;
  specialInstructions?: string;
}

interface LabOrder {
  id: string;
  tests: OrderedTest[];
  clinicalIndication: string;
  icdCodes: string[];
  notes: string;
  status: "draft" | "pending" | "sent" | "in_progress" | "completed";
  preferredLab?: string;
  scheduledDate?: string;
}

// Common lab tests database
const LAB_TESTS_DATABASE: LabTest[] = [
  // Blood Tests
  { id: "cbc", code: "CBC", name: "Complete Blood Count", category: "Hematology", specimen: "Blood", turnaroundTime: "4 hours" },
  { id: "bmp", code: "BMP", name: "Basic Metabolic Panel", category: "Chemistry", specimen: "Blood", turnaroundTime: "4 hours" },
  { id: "cmp", code: "CMP", name: "Comprehensive Metabolic Panel", category: "Chemistry", specimen: "Blood", turnaroundTime: "4 hours" },
  { id: "lipid", code: "LIPID", name: "Lipid Panel", category: "Chemistry", specimen: "Blood", turnaroundTime: "4 hours" },
  { id: "hba1c", code: "HBA1C", name: "Hemoglobin A1c", category: "Chemistry", specimen: "Blood", turnaroundTime: "24 hours" },
  { id: "tsh", code: "TSH", name: "Thyroid Stimulating Hormone", category: "Endocrine", specimen: "Blood", turnaroundTime: "24 hours" },
  { id: "t3t4", code: "T3T4", name: "T3/T4 Panel", category: "Endocrine", specimen: "Blood", turnaroundTime: "24 hours" },
  { id: "psa", code: "PSA", name: "Prostate Specific Antigen", category: "Oncology", specimen: "Blood", turnaroundTime: "24 hours" },
  { id: "pt_inr", code: "PT/INR", name: "Prothrombin Time/INR", category: "Coagulation", specimen: "Blood", turnaroundTime: "4 hours" },
  { id: "ptt", code: "PTT", name: "Partial Thromboplastin Time", category: "Coagulation", specimen: "Blood", turnaroundTime: "4 hours" },
  { id: "bnp", code: "BNP", name: "B-type Natriuretic Peptide", category: "Cardiac", specimen: "Blood", turnaroundTime: "4 hours" },
  { id: "troponin", code: "TROP", name: "Troponin I", category: "Cardiac", specimen: "Blood", turnaroundTime: "2 hours" },
  { id: "crp", code: "CRP", name: "C-Reactive Protein", category: "Inflammation", specimen: "Blood", turnaroundTime: "24 hours" },
  { id: "esr", code: "ESR", name: "Erythrocyte Sedimentation Rate", category: "Inflammation", specimen: "Blood", turnaroundTime: "4 hours" },
  { id: "ferritin", code: "FER", name: "Ferritin", category: "Hematology", specimen: "Blood", turnaroundTime: "24 hours" },
  { id: "b12", code: "B12", name: "Vitamin B12", category: "Vitamins", specimen: "Blood", turnaroundTime: "24 hours" },
  { id: "vitd", code: "VITD", name: "Vitamin D, 25-Hydroxy", category: "Vitamins", specimen: "Blood", turnaroundTime: "2-3 days" },
  // Urine Tests
  { id: "ua", code: "UA", name: "Urinalysis", category: "Urinalysis", specimen: "Urine", turnaroundTime: "4 hours" },
  { id: "uculture", code: "UCULT", name: "Urine Culture", category: "Microbiology", specimen: "Urine", turnaroundTime: "2-3 days" },
  { id: "microalb", code: "MALB", name: "Microalbumin", category: "Urinalysis", specimen: "Urine", turnaroundTime: "24 hours" },
  // Imaging
  { id: "xray_chest", code: "XR-CXR", name: "Chest X-Ray", category: "Imaging", specimen: "N/A", turnaroundTime: "Same day" },
  { id: "ct_head", code: "CT-HEAD", name: "CT Head without Contrast", category: "Imaging", specimen: "N/A", turnaroundTime: "Same day" },
  { id: "mri_brain", code: "MRI-BR", name: "MRI Brain", category: "Imaging", specimen: "N/A", turnaroundTime: "1-2 days" },
  { id: "us_abd", code: "US-ABD", name: "Ultrasound Abdomen", category: "Imaging", specimen: "N/A", turnaroundTime: "Same day" },
  { id: "echo", code: "ECHO", name: "Echocardiogram", category: "Imaging", specimen: "N/A", turnaroundTime: "Same day" },
  { id: "ekg", code: "EKG", name: "Electrocardiogram", category: "Cardiology", specimen: "N/A", turnaroundTime: "Immediate" },
];

const TEST_CATEGORIES = [
  "All",
  "Hematology",
  "Chemistry",
  "Endocrine",
  "Cardiac",
  "Coagulation",
  "Inflammation",
  "Vitamins",
  "Urinalysis",
  "Microbiology",
  "Imaging",
  "Cardiology",
  "Oncology",
];

export function LabOrderPanel() {
  const { consultation } = useConsultation();
  const [labOrder, setLabOrder] = useState<LabOrder>({
    id: `lab-order-${Date.now()}`,
    tests: [],
    clinicalIndication: "",
    icdCodes: [],
    notes: "",
    status: "draft",
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showTestSelector, setShowTestSelector] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Filter tests based on search and category
  const filteredTests = LAB_TESTS_DATABASE.filter((test) => {
    const matchesSearch = 
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add test to order
  const addTest = (test: LabTest) => {
    if (labOrder.tests.some((t) => t.test.id === test.id)) return;
    
    setLabOrder((prev) => ({
      ...prev,
      tests: [
        ...prev.tests,
        {
          test,
          priority: "routine",
          fasting: false,
        },
      ],
    }));
  };

  // Remove test from order
  const removeTest = (testId: string) => {
    setLabOrder((prev) => ({
      ...prev,
      tests: prev.tests.filter((t) => t.test.id !== testId),
    }));
  };

  // Update test options
  const updateTest = (testId: string, updates: Partial<OrderedTest>) => {
    setLabOrder((prev) => ({
      ...prev,
      tests: prev.tests.map((t) =>
        t.test.id === testId ? { ...t, ...updates } : t
      ),
    }));
  };

  // Send order
  const sendOrder = async () => {
    if (labOrder.tests.length === 0) return;
    
    setIsSending(true);
    try {
      // TODO: Integrate with actual API
      // await labOrderService.createOrder(labOrder);
      console.log("Sending lab order:", labOrder);
      
      setLabOrder((prev) => ({
        ...prev,
        status: "sent",
      }));
      
      // Show success message
      alert("Lab order sent successfully!");
    } catch (error) {
      console.error("Error sending lab order:", error);
      alert("Failed to send lab order. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Print order
  const printOrder = () => {
    window.print();
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "stat": return "bg-red-100 text-red-800";
      case "urgent": return "bg-orange-100 text-orange-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Lab & Diagnostic Orders
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={showTestSelector} onOpenChange={setShowTestSelector}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Test
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Select Lab Tests</DialogTitle>
                    <DialogDescription>
                      Search and select tests to add to the order
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Search and Filter */}
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEST_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Tests List */}
                  <ScrollArea className="h-[400px] border rounded-md">
                    <div className="p-2 space-y-1">
                      {filteredTests.map((test) => {
                        const isSelected = labOrder.tests.some((t) => t.test.id === test.id);
                        return (
                          <div
                            key={test.id}
                            className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                              isSelected 
                                ? "bg-primary/10 border border-primary" 
                                : "hover:bg-muted"
                            }`}
                            onClick={() => !isSelected && addTest(test)}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{test.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {test.code}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {test.category} • {test.specimen} • {test.turnaroundTime}
                              </div>
                            </div>
                            {isSelected && (
                              <Badge className="bg-primary text-primary-foreground">
                                Added
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowTestSelector(false)}>
                      Done
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Ordered Tests */}
      {labOrder.tests.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ordered Tests ({labOrder.tests.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {labOrder.tests.map((orderedTest) => (
              <div
                key={orderedTest.test.id}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{orderedTest.test.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {orderedTest.test.code}
                    </Badge>
                    <Badge className={getPriorityColor(orderedTest.priority)}>
                      {orderedTest.priority}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {orderedTest.test.turnaroundTime}
                  </div>
                  
                  {/* Test Options */}
                  <div className="flex flex-wrap gap-4 mt-3">
                    <Select
                      value={orderedTest.priority}
                      onValueChange={(val) => 
                        updateTest(orderedTest.test.id, { priority: val as "routine" | "urgent" | "stat" })
                      }
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="stat">STAT</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`fasting-${orderedTest.test.id}`}
                        checked={orderedTest.fasting}
                        onCheckedChange={(checked) =>
                          updateTest(orderedTest.test.id, { fasting: checked === true })
                        }
                      />
                      <Label htmlFor={`fasting-${orderedTest.test.id}`} className="text-sm">
                        Fasting required
                      </Label>
                    </div>
                  </div>
                  
                  {/* Special Instructions */}
                  <Input
                    placeholder="Special instructions (optional)"
                    className="mt-2 text-sm"
                    value={orderedTest.specialInstructions || ""}
                    onChange={(e) =>
                      updateTest(orderedTest.test.id, { specialInstructions: e.target.value })
                    }
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeTest(orderedTest.test.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Clinical Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Clinical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Clinical Indication / Reason for Order</Label>
            <Textarea
              placeholder="Enter clinical indication..."
              value={labOrder.clinicalIndication}
              onChange={(e) =>
                setLabOrder((prev) => ({ ...prev, clinicalIndication: e.target.value }))
              }
              className="mt-1"
              rows={2}
            />
          </div>
          
          <div>
            <Label>ICD-10 Codes (comma-separated)</Label>
            <Input
              placeholder="E.g., I10, E11.9, J06.9"
              value={labOrder.icdCodes.join(", ")}
              onChange={(e) =>
                setLabOrder((prev) => ({
                  ...prev,
                  icdCodes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                }))
              }
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Additional notes for the lab..."
              value={labOrder.notes}
              onChange={(e) =>
                setLabOrder((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="mt-1"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {labOrder.tests.length === 0 ? (
            <span>No tests ordered yet</span>
          ) : (
            <span className="flex items-center gap-1">
              {labOrder.tests.some((t) => t.priority === "stat") && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              {labOrder.tests.length} test(s) ready to send
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={printOrder} disabled={labOrder.tests.length === 0}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button variant="outline" disabled={labOrder.tests.length === 0}>
            <FileText className="h-4 w-4 mr-1" />
            Save Draft
          </Button>
          <Button 
            onClick={sendOrder} 
            disabled={labOrder.tests.length === 0 || isSending}
          >
            <Send className="h-4 w-4 mr-1" />
            {isSending ? "Sending..." : "Send Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LabOrderPanel;
