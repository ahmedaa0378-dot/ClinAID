"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  ArrowLeft,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  User,
  Stethoscope,
  AlertTriangle,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  
  const diagnosis = searchParams.get("diagnosis") || "Unknown";
  const sessionId = searchParams.get("sessionId");
  
  const [reportGenerated, setReportGenerated] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }));

  useEffect(() => {
    // Simulate report generation
    const timer = setTimeout(() => setReportGenerated(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In production, this would generate a PDF
    alert("PDF download would be implemented with a library like jsPDF or react-pdf");
  };

  const handleSubmitForReview = () => {
    // In production, this would submit to professor
    alert("Submit for review functionality coming soon!");
  };

  if (!reportGenerated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Sparkles className="w-16 h-16 text-emerald-500" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800">Generating Report...</h2>
          <p className="text-gray-500 mt-2">AI is preparing your clinical report</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => router.push("/student/analyzer")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analyzer
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleSubmitForReview} className="bg-emerald-600 hover:bg-emerald-700">
              <Share2 className="h-4 w-4 mr-2" />
              Submit for Review
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg print:shadow-none">
          {/* Report Header */}
          <CardHeader className="border-b bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-t-lg print:bg-gray-100 print:text-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center print:bg-gray-200">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Clinical Analysis Report</CardTitle>
                  <p className="text-emerald-100 text-sm print:text-gray-600">
                    AI-Assisted Differential Diagnosis
                  </p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0 print:bg-gray-200 print:text-black">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Patient/Student Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Student Name</p>
                  <p className="font-medium">{profile?.full_name || "Student"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Report Date</p>
                  <p className="font-medium">{currentDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Primary Diagnosis</p>
                  <p className="font-medium text-emerald-600">{diagnosis}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Session ID</p>
                  <p className="font-medium font-mono text-sm">{sessionId || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* SOAP Note */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                SOAP Note
              </h3>

              {/* Subjective */}
              <div className="p-4 border rounded-xl">
                <h4 className="font-semibold text-emerald-700 mb-2">S - Subjective</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Patient presents with symptoms consistent with {diagnosis}. 
                  Chief complaint includes symptoms reported during the interactive analysis session.
                  The patient described the onset, duration, and characteristics of symptoms through 
                  the AI-guided clinical interview.
                </p>
              </div>

              {/* Objective */}
              <div className="p-4 border rounded-xl">
                <h4 className="font-semibold text-blue-700 mb-2">O - Objective</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>Vitals:</strong> To be documented during physical examination<br />
                  <strong>Physical Exam:</strong> Pending clinical assessment<br />
                  <strong>AI Analysis:</strong> Symptom pattern analysis completed with differential 
                  diagnosis generation based on reported symptoms and clinical history responses.
                </p>
              </div>

              {/* Assessment */}
              <div className="p-4 border rounded-xl">
                <h4 className="font-semibold text-purple-700 mb-2">A - Assessment</h4>
                <div className="text-gray-700 text-sm leading-relaxed">
                  <p className="mb-2">
                    <strong>Primary Working Diagnosis:</strong> {diagnosis}
                  </p>
                  <p className="mb-2">
                    <strong>Clinical Reasoning:</strong> Based on AI-assisted analysis of reported 
                    symptoms, pattern recognition, and clinical correlation with common presentations.
                  </p>
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-xs flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Educational Note:</strong> This AI-generated assessment is for 
                        learning purposes only and should be validated by clinical examination 
                        and appropriate diagnostic testing.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan */}
              <div className="p-4 border rounded-xl">
                <h4 className="font-semibold text-orange-700 mb-2">P - Plan</h4>
                <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                  <p><strong>Recommended Workup:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Complete physical examination</li>
                    <li>Relevant laboratory studies based on differential</li>
                    <li>Imaging studies if indicated</li>
                    <li>Specialist consultation as needed</li>
                  </ul>
                  <p className="mt-3"><strong>Patient Education:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Review red flag symptoms requiring immediate attention</li>
                    <li>Discuss expected course and follow-up timeline</li>
                    <li>Provide resources for additional information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Disclaimer */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Analysis Disclaimer
              </h4>
              <p className="text-blue-700 text-sm">
                This report was generated using AI-assisted clinical decision support. 
                The differential diagnoses and recommendations are based on pattern recognition 
                and should be used as an educational tool. All clinical decisions should be 
                made by qualified healthcare professionals based on complete patient evaluation.
              </p>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t">
              <div>
                <p className="text-sm text-gray-500 mb-8">Student Signature</p>
                <div className="border-b border-gray-300 pb-1">
                  <p className="font-medium">{profile?.full_name || "Student Name"}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">{currentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-8">Reviewed By (Professor)</p>
                <div className="border-b border-gray-300 pb-1">
                  <p className="text-gray-400 italic">Pending Review</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">Date: _______________</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between print:hidden">
          <Button variant="outline" onClick={() => router.push("/student/analyzer")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
          <Button onClick={handleSubmitForReview} className="bg-gradient-to-r from-emerald-500 to-cyan-500">
            <Share2 className="h-4 w-4 mr-2" />
            Submit to Professor for Review
          </Button>
        </div>
      </div>
    </div>
  );
}