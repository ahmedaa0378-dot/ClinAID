"use client";

import { useState, useEffect, useRef } from "react";
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
  BookOpen,
  Brain,
  Activity,
  Pill,
  HeartPulse,
  GraduationCap,
  MessageSquare,
  Save,
  Send,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useAnalyzerSession } from "@/hooks/useAnalyzerSession";
import { useSubmissions } from "@/hooks/useSubmissions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { saveReport, updateStudentNotes } = useAnalyzerSession();
  const { submitToProf, getAvailableProfessors } = useSubmissions();
  
  const diagnosis = searchParams.get("diagnosis") || "Unknown Condition";
  const sessionId = searchParams.get("sessionId");
  
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [studentNotes, setStudentNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showProfessorModal, setShowProfessorModal] = useState(false);
  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }));

  const reportRef = useRef<HTMLDivElement>(null);

  // Educational content based on diagnosis
  const [educationalContent, setEducationalContent] = useState({
    pathophysiology: "",
    epidemiology: "",
    riskFactors: [] as string[],
    clinicalPresentation: "",
    diagnosticCriteria: [] as string[],
    differentialDiagnosis: [] as string[],
    treatment: {
      firstLine: "",
      alternatives: "",
      supportive: "",
    },
    complications: [] as string[],
    prognosis: "",
    clinicalPearls: [] as string[],
    suggestedReferences: [] as string[],
  });

  useEffect(() => {
    // Generate report content and save to database
    const generateAndSaveReport = async () => {
      // Generate educational content
      const content = {
        pathophysiology: `${diagnosis} involves a complex interplay of physiological mechanisms. The underlying pathology typically begins with cellular changes that lead to the clinical manifestations observed in patients. Understanding the molecular and cellular basis helps clinicians predict disease progression and response to treatment.`,
        epidemiology: `${diagnosis} affects a significant portion of the population, with varying prevalence across different demographics. Studies show higher incidence in certain age groups and geographic regions. Understanding the epidemiological patterns helps in risk stratification and preventive strategies.`,
        riskFactors: [
          "Age-related factors",
          "Genetic predisposition",
          "Environmental exposures",
          "Lifestyle factors (diet, exercise, smoking)",
          "Comorbid conditions",
          "Medication history",
        ],
        clinicalPresentation: `Patients with ${diagnosis} typically present with a constellation of symptoms that may vary in severity. The hallmark features include the symptoms reported during this analysis. Clinical presentation can range from mild to severe, and atypical presentations should always be considered, especially in elderly or immunocompromised patients.`,
        diagnosticCriteria: [
          "Clinical history and symptom duration",
          "Physical examination findings",
          "Laboratory investigations as indicated",
          "Imaging studies when appropriate",
          "Exclusion of alternative diagnoses",
        ],
        differentialDiagnosis: [
          "Primary differential based on symptom pattern",
          "Secondary considerations based on risk factors",
          "Must-not-miss diagnoses (red flags)",
          "Common mimics and look-alikes",
        ],
        treatment: {
          firstLine: "Evidence-based first-line therapy should be initiated based on severity and patient factors. Treatment decisions should consider efficacy, safety profile, cost, and patient preferences.",
          alternatives: "Alternative therapies may be considered in cases of contraindications, treatment failure, or patient intolerance. Combination therapy may be warranted in certain scenarios.",
          supportive: "Supportive care measures including symptom management, lifestyle modifications, and patient education are essential components of comprehensive treatment.",
        },
        complications: [
          "Acute complications requiring immediate attention",
          "Chronic complications with long-term management implications",
          "Treatment-related adverse effects",
          "Disease progression markers",
        ],
        prognosis: `The prognosis for ${diagnosis} varies based on multiple factors including early diagnosis, appropriate treatment, and patient compliance. With proper management, many patients achieve good outcomes. Regular follow-up is essential for monitoring disease progression and treatment response.`,
        clinicalPearls: [
          "Always consider red flag symptoms that may indicate serious underlying pathology",
          "Patient history is often the most valuable diagnostic tool",
          "Physical examination findings should correlate with reported symptoms",
          "Consider atypical presentations, especially in vulnerable populations",
          "Document thoroughly and reassess if the patient's condition changes",
        ],
        suggestedReferences: [
          "Harrison's Principles of Internal Medicine, 21st Edition",
          "UpToDate Clinical Decision Support",
          "Current Medical Diagnosis & Treatment 2024",
          "Relevant specialty guidelines and consensus statements",
        ],
      };

      setEducationalContent(content);

      // Save to database if we have a session
      if (sessionId && user) {
        try {
          const report = await saveReport(sessionId, diagnosis, {
            reportTitle: `Clinical Report - ${diagnosis}`,
            soapNote: {
              subjective: `Patient presents with symptoms consistent with ${diagnosis}.`,
              objective: "Physical examination and diagnostic workup pending.",
              assessment: `Primary working diagnosis: ${diagnosis}`,
              plan: "Recommended workup and management as outlined.",
            },
            educationalContent: content,
            clinicalPearls: content.clinicalPearls,
            suggestedReferences: content.suggestedReferences,
            studentNotes: "",
          });

          if (report) {
            setReportId(report.id);
          }
        } catch (err) {
          console.error("Error saving report:", err);
        }
      }

      // Load available professors
      const profs = await getAvailableProfessors();
      setProfessors(profs);

      setReportGenerated(true);
    };

    const timer = setTimeout(generateAndSaveReport, 1500);
    return () => clearTimeout(timer);
  }, [diagnosis, sessionId, user]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setIsGeneratingPDF(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Clinical_Report_${diagnosis.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Error generating PDF. Please try printing instead.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!reportId) {
      alert("Report not saved yet. Please wait.");
      return;
    }

    setIsSaving(true);
    const success = await updateStudentNotes(reportId, studentNotes);
    setIsSaving(false);

    if (success) {
      alert("Notes saved successfully!");
    } else {
      alert("Error saving notes. Please try again.");
    }
  };

  const handleSubmitForReview = () => {
    if (!reportId) {
      alert("Please wait for the report to be saved first.");
      return;
    }
    setShowProfessorModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedProfessor || !reportId) return;

    setIsSubmitting(true);

    const submission = await submitToProf(reportId, selectedProfessor, studentNotes);

    setIsSubmitting(false);
    setShowProfessorModal(false);

    if (submission) {
      setSubmitSuccess(true);
    } else {
      alert("Error submitting for review. Please try again.");
    }
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
          <h2 className="text-xl font-semibold text-gray-800">Generating Detailed Report...</h2>
          <p className="text-gray-500 mt-2">AI is preparing your comprehensive clinical study material</p>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your clinical analysis has been submitted to your professor for review. 
              You'll receive a notification when they provide feedback.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push("/student/submissions")}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                View My Submissions
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/student/analyzer")}
                className="w-full"
              >
                Start New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header Actions */}
      <div className="mb-6 print:hidden">
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
            <Button 
              variant="outline" 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-5xl mx-auto space-y-6" ref={reportRef}>
        {/* Report Header Card */}
        <Card className="shadow-lg print:shadow-none overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-emerald-500 to-cyan-500 text-white print:bg-gray-100 print:text-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center print:bg-gray-200">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Clinical Analysis Report</CardTitle>
                  <p className="text-emerald-100 text-sm print:text-gray-600">
                    Comprehensive Educational Study Material
                  </p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-sm px-3 py-1 print:bg-gray-200 print:text-black">
                <Sparkles className="h-4 w-4 mr-1" />
                AI Generated
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Patient/Student Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Student</p>
                  <p className="font-medium">{profile?.full_name || "Student Name"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-sm">{currentDate}</p>
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
                  <p className="font-medium font-mono text-xs">{sessionId?.slice(0, 8) || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Primary Diagnosis Banner */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6">
              <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                <HeartPulse className="h-6 w-6" />
                Primary Working Diagnosis: {diagnosis}
              </h2>
            </div>
          </CardContent>
        </Card>

        {/* SOAP Note Card */}
        <Card className="shadow-lg print:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-emerald-500" />
              SOAP Note Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-r-xl">
              <h4 className="font-bold text-emerald-700 mb-2 text-lg">S - Subjective</h4>
              <p className="text-gray-700 leading-relaxed">
                Patient presents with symptoms consistent with <strong>{diagnosis}</strong>. 
                Chief complaint includes symptoms reported during the interactive AI-guided analysis session.
                The patient described the onset, duration, character, and associated factors of symptoms 
                through structured clinical interview.
              </p>
            </div>

            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-xl">
              <h4 className="font-bold text-blue-700 mb-2 text-lg">O - Objective</h4>
              <div className="text-gray-700 space-y-2">
                <p><strong>Vital Signs:</strong> To be documented during physical examination</p>
                <p><strong>General Appearance:</strong> Pending clinical assessment</p>
                <p><strong>Physical Examination:</strong> Focused examination based on chief complaint indicated</p>
                <p><strong>AI Analysis:</strong> Symptom pattern analysis completed with differential diagnosis generation.</p>
              </div>
            </div>

            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-xl">
              <h4 className="font-bold text-purple-700 mb-2 text-lg">A - Assessment</h4>
              <div className="text-gray-700 space-y-3">
                <p><strong>Primary Working Diagnosis:</strong> {diagnosis}</p>
                <p><strong>Clinical Reasoning:</strong> Based on AI-assisted analysis of reported symptoms and pattern recognition.</p>
              </div>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-xl">
              <h4 className="font-bold text-orange-700 mb-2 text-lg">P - Plan</h4>
              <div className="text-gray-700 space-y-3">
                <p className="font-semibold">Diagnostic Workup:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Complete physical examination</li>
                  <li>Laboratory studies as indicated</li>
                  <li>Imaging studies if warranted</li>
                  <li>Specialist consultation as needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Educational Content - Pathophysiology */}
        <Card className="shadow-lg print:shadow-none">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
              <Brain className="h-5 w-5" />
              Pathophysiology & Disease Mechanism
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed mb-4">{educationalContent.pathophysiology}</p>
            <p className="text-gray-700 leading-relaxed">{educationalContent.epidemiology}</p>
          </CardContent>
        </Card>

        {/* Risk Factors & Diagnostic Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg print:shadow-none">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-2 text-lg text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-2">
                {educationalContent.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg print:shadow-none">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                <Activity className="h-5 w-5" />
                Diagnostic Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-2">
                {educationalContent.diagnosticCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Treatment */}
        <Card className="shadow-lg print:shadow-none">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-lg text-teal-800">
              <Pill className="h-5 w-5" />
              Treatment Approach
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 bg-teal-50 rounded-xl">
              <h5 className="font-semibold text-teal-800 mb-2">First-Line Treatment</h5>
              <p className="text-gray-700">{educationalContent.treatment.firstLine}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <h5 className="font-semibold text-blue-800 mb-2">Alternative Therapies</h5>
              <p className="text-gray-700">{educationalContent.treatment.alternatives}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <h5 className="font-semibold text-green-800 mb-2">Supportive Care</h5>
              <p className="text-gray-700">{educationalContent.treatment.supportive}</p>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Pearls */}
        <Card className="shadow-lg print:shadow-none border-2 border-yellow-200">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardTitle className="flex items-center gap-2 text-lg text-yellow-800">
              <Sparkles className="h-5 w-5" />
              Clinical Pearls for Students
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {educationalContent.clinicalPearls.map((pearl, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">💡</span>
                  <p className="text-gray-700">{pearl}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card className="shadow-lg print:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-gray-500" />
              Suggested References
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2">
              {educationalContent.suggestedReferences.map((ref, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="font-semibold text-gray-400">{index + 1}.</span>
                  <span>{ref}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* AI Disclaimer */}
        <Card className="shadow-lg print:shadow-none bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Analysis Disclaimer
            </h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              This report was generated using AI-assisted clinical decision support powered by OpenAI. 
              The differential diagnoses, educational content, and recommendations are based on pattern 
              recognition and should be used as an educational tool only. All clinical decisions must be 
              made by qualified healthcare professionals.
            </p>
          </CardContent>
        </Card>

        {/* Signature Area */}
        <Card className="shadow-lg print:shadow-none">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-6">Student Signature</p>
                <div className="border-b-2 border-gray-300 pb-1">
                  <p className="font-medium text-lg">{profile?.full_name || "Student Name"}</p>
                </div>
                <p className="text-sm text-gray-400 mt-2">{currentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-6">Reviewed By (Professor)</p>
                <div className="border-b-2 border-gray-300 pb-1">
                  <p className="text-gray-400 italic">Pending Review</p>
                </div>
                <p className="text-sm text-gray-400 mt-2">Date: _______________</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Notes Section - Outside printable area */}
      <div className="max-w-5xl mx-auto mt-6 print:hidden">
        <Card className="shadow-lg border-2 border-emerald-200">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-lg text-emerald-800">
              <MessageSquare className="h-5 w-5" />
              Student Notes
              <Badge className="ml-2 bg-emerald-100 text-emerald-700">For Professor Review</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-600 text-sm">
              Add your notes, questions, or reflections about this case. These notes will be visible 
              to your professor when you submit for review.
            </p>
            <Textarea
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="Enter your notes here...

Examples:
• Questions you have about the diagnosis
• Areas where you need clarification
• Your clinical reasoning process
• Alternative diagnoses you considered
• Learning points from this case"
              className="min-h-[200px] resize-y text-sm"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {studentNotes.length} characters
              </p>
              <Button 
                variant="outline" 
                onClick={handleSaveNotes}
                disabled={isSaving || !reportId}
                className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 sticky bottom-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border">
          <Button variant="outline" onClick={() => router.push("/student/analyzer")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={handleSubmitForReview} 
              disabled={!reportId}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Submit to Professor
            </Button>
          </div>
        </div>
      </div>

      {/* Professor Selection Modal */}
      {showProfessorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Select Professor</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowProfessorModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Choose the professor who should review your clinical analysis.
              </p>
              
              {professors.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No professors available</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {professors.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => setSelectedProfessor(prof.id)}
                      className={`w-full p-3 text-left rounded-lg border transition-all ${
                        selectedProfessor === prof.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <p className="font-medium">{prof.full_name}</p>
                      <p className="text-sm text-gray-500">{prof.email}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowProfessorModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmSubmit}
                  disabled={!selectedProfessor || isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}