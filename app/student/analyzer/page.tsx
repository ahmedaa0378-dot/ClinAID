"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import HumanBodySVG from "@/components/analyzer/HumanBodySVG";
import SymptomMindMap from "@/components/analyzer/SymptomMindMap";
import AIChatInterface from "@/components/analyzer/AIChatInterface";
import {
  Stethoscope,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Step = "body" | "symptoms" | "chat" | "results";

interface Symptom {
  id: string;
  name: string;
  description: string;
  isRedFlag: boolean;
}

interface DiagnosisResult {
  name: string;
  probability: "high" | "moderate" | "low";
  confidence: number;
  description: string;
  supportingFindings: string[];
  redFlags?: string[];
}

export default function SymptomAnalyzerPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<Step>("body");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Handle body region selection
  const handleRegionClick = (regionId: string, regionName: string) => {
    setSelectedRegion(regionId);
    setSelectedRegionName(regionName);
  };

  // Handle symptom selection
  const handleSymptomSelect = (symptom: Symptom) => {
    setSelectedSymptoms((prev) => [...prev, symptom]);
  };

  const handleSymptomDeselect = (symptomId: string) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s.id !== symptomId));
  };

  // Handle chat completion
  const handleChatComplete = (results: DiagnosisResult[]) => {
    setDiagnoses(results);
    setCurrentStep("results");
  };

  // Reset analyzer
  const handleReset = () => {
    setCurrentStep("body");
    setSelectedRegion(null);
    setSelectedRegionName("");
    setSelectedSymptoms([]);
    setDiagnoses([]);
    setSelectedDiagnosis(null);
    setShowResetDialog(false);
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep === "body" && selectedRegion) {
      setCurrentStep("symptoms");
    } else if (currentStep === "symptoms" && selectedSymptoms.length > 0) {
      setCurrentStep("chat");
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep === "symptoms") {
      setCurrentStep("body");
    } else if (currentStep === "chat") {
      setCurrentStep("symptoms");
    } else if (currentStep === "results") {
      setCurrentStep("chat");
    }
  };

  // Get probability badge color
  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Step indicators
  const steps = [
    { id: "body", label: "Select Region", icon: "🫀" },
    { id: "symptoms", label: "Symptoms", icon: "🔍" },
    { id: "chat", label: "AI Analysis", icon: "🤖" },
    { id: "results", label: "Diagnosis", icon: "📋" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Symptom Analyzer</h1>
                <p className="text-emerald-100">
                  Interactive AI-powered clinical diagnosis training
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setShowResetDialog(true)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex flex-col items-center ${
                  index <= currentStepIndex ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    index < currentStepIndex
                      ? "bg-emerald-500 text-white"
                      : index === currentStepIndex
                      ? "bg-emerald-100 border-2 border-emerald-500"
                      : "bg-gray-100"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 md:w-24 h-1 mx-2 rounded ${
                    index < currentStepIndex ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Body Selection */}
        {currentStep === "body" && (
          <motion.div
            key="body"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Human Body SVG */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🫀</span>
                  Click on the affected body area
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HumanBodySVG
                  onRegionClick={handleRegionClick}
                  selectedRegion={selectedRegion}
                />
              </CardContent>
            </Card>

            {/* Info Panel */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">How it works</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Select Body Region</p>
                        <p className="text-sm text-gray-500">
                          Click on the area where symptoms are present
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Pick Symptoms</p>
                        <p className="text-sm text-gray-500">
                          Select from the symptom mind map
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Answer Questions</p>
                        <p className="text-sm text-gray-500">
                          Chat with AI to refine diagnosis
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Get Differential Diagnosis</p>
                        <p className="text-sm text-gray-500">
                          Review AI-generated diagnoses
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Region Info */}
              {selectedRegion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-emerald-200 bg-emerald-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-emerald-600">Selected Region</p>
                          <p className="text-xl font-bold text-emerald-800">
                            {selectedRegionName}
                          </p>
                        </div>
                        <Button
                          onClick={goToNextStep}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Continue
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Symptom Selection (Mind Map) */}
        {currentStep === "symptoms" && (
          <motion.div
            key="symptoms"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Select Symptoms - {selectedRegionName}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Click on symptoms to select them
                  </p>
                </div>
                <Button variant="outline" onClick={goToPreviousStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </CardHeader>
              <CardContent>
                <SymptomMindMap
                  regionName={selectedRegion || "head_neck"}
                  regionDisplayName={selectedRegionName}
                  onSymptomSelect={handleSymptomSelect}
                  onSymptomDeselect={handleSymptomDeselect}
                  selectedSymptoms={selectedSymptoms.map((s) => s.id)}
                  onContinue={() => setCurrentStep("chat")}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: AI Chat */}
        {currentStep === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-4 flex items-center justify-between">
              <Button variant="outline" onClick={goToPreviousStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Symptoms
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {selectedSymptoms.length} symptoms selected
                </Badge>
              </div>
            </div>
            
            <AIChatInterface
              regionName={selectedRegionName}
              symptoms={selectedSymptoms.map((s) => ({
                id: s.id,
                name: s.name,
                isRedFlag: s.isRedFlag,
              }))}
              onComplete={handleChatComplete}
            />
          </motion.div>
        )}

        {/* Step 4: Results */}
        {currentStep === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Differential Diagnosis Results
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Based on your symptoms and responses, here are the possible diagnoses
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {diagnoses.map((diagnosis, index) => (
                  <motion.div
                    key={diagnosis.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedDiagnosis === diagnosis.name
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedDiagnosis(diagnosis.name)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{diagnosis.name}</h3>
                          <Badge className={getProbabilityColor(diagnosis.probability)}>
                            {diagnosis.probability} probability
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {diagnosis.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {diagnosis.supportingFindings.map((finding) => (
                            <Badge key={finding} variant="secondary" className="text-xs">
                              {finding}
                            </Badge>
                          ))}
                        </div>
                        {diagnosis.redFlags && diagnosis.redFlags.length > 0 && (
                          <div className="mt-3 p-2 bg-red-50 rounded-lg">
                            <p className="text-xs text-red-700 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Red flags: {diagnosis.redFlags.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-emerald-600">
                          {Math.round(diagnosis.confidence * 100)}%
                        </div>
                        <p className="text-xs text-gray-500">confidence</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowResetDialog(true)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start New Analysis
                  </Button>
                  <Button
                    disabled={!selectedDiagnosis}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                    onClick={() => {
                      // Navigate to report generation
                      router.push(`/student/analyzer/report?diagnosis=${encodeURIComponent(selectedDiagnosis || "")}`);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Over?</DialogTitle>
            <DialogDescription>
              This will clear all your selections and start a new analysis session.
              Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReset} variant="destructive">
              Yes, Start Over
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
