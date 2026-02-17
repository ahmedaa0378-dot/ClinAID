"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { BodyRegion, Symptom, DifferentialDiagnosis } from "@/lib/types/analyzer";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Loader2,
  FileText,
  CheckCircle2,
  Download,
  Send,
  User,
  Calendar,
  Stethoscope,
  ClipboardList,
  AlertTriangle,
  BookOpen,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Professor {
  id: string;
  user_id: string;
  specialty: string;
  title: string;
  user: {
    full_name: string;
    email: string;
  };
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();

  const sessionId = params.id as string;
  const regionId = searchParams.get("region");
  const diagnosisParam = searchParams.get("diagnosis");
  const symptomsParam = searchParams.get("symptoms");

  const [region, setRegion] = useState<BodyRegion | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [diagnosis, setDiagnosis] = useState<DifferentialDiagnosis | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string>("");
  const [studentNotes, setStudentNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [regionName, setRegionName] = useState<string>("-");
  
  // AI Report states
  const [aiReport, setAiReport] = useState<string>("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string>("");
  const [showBasicInfo, setShowBasicInfo] = useState(true);

  // Helper function to get diagnosis name
  const getDiagnosisName = (diag: any): string => {
    return diag?.diagnosis_name || diag?.name || diag?.diagnosisName || 'Unknown Diagnosis';
  };

  // Helper function to get confidence percentage
  const getConfidencePercent = (diag: any): number => {
    const score = diag?.confidence_score || diag?.confidenceScore || diag?.confidence || 0;
    const percent = Number(score);
    if (isNaN(percent)) return 0;
    return percent > 1 ? Math.round(percent) : Math.round(percent * 100);
  };

  // Generate AI Report
  const generateAIReport = async () => {
    setGeneratingReport(true);
    setReportError("");

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosis,
          symptoms,
          region: regionName,
          studentLevel: "Medical Student",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const data = await response.json();
      setAiReport(data.report);
    } catch (err: any) {
      console.error("Report generation error:", err);
      setReportError(err.message || "Failed to generate AI report");
    } finally {
      setGeneratingReport(false);
    }
  };

  // Parse data and fetch professors
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        // Parse diagnosis
        if (diagnosisParam) {
          try {
            const parsedDiagnosis = JSON.parse(decodeURIComponent(diagnosisParam));
            setDiagnosis(parsedDiagnosis);
          } catch (parseError) {
            setDiagnosis({ name: decodeURIComponent(diagnosisParam) } as any);
          }
        }

        // Parse symptoms
        if (symptomsParam) {
          try {
            const parsedSymptoms = JSON.parse(decodeURIComponent(symptomsParam));
            setSymptoms(Array.isArray(parsedSymptoms) ? parsedSymptoms : []);
          } catch (parseError) {
            setSymptoms([]);
          }
        }

        // Handle region
        if (regionId) {
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(regionId);
          
          if (isUUID) {
            try {
              const { data: regionData, error: regionError } = await supabase
                .from("body_regions")
                .select("*")
                .eq("id", regionId)
                .single();

              if (!regionError && regionData) {
                setRegion(regionData);
                setRegionName(regionData.displayName || regionData.display_name || regionData.name || regionId);
              } else {
                setRegionName(regionId);
              }
            } catch (e) {
              setRegionName(regionId);
            }
          } else {
            setRegionName(regionId.charAt(0).toUpperCase() + regionId.slice(1));
          }
        }

        // Fetch real professors from database
try {
  const { data: professorsData, error: profError } = await supabase
    .from("professors")
    .select(`
      id,
      specialty,
      title,
      user:users!professors_user_id_fkey (
        id,
        full_name,
        email
      )
    `)
    .eq("is_accepting_reviews", true);

  if (!profError && professorsData && professorsData.length > 0) {
    setProfessors(professorsData.map(p => ({
      id: p.id,
      user_id: (p.user as any)?.id || p.id,
      specialty: p.specialty || "Medical Education",
      title: p.title || "Dr.",
      user: { 
        full_name: (p.user as any)?.full_name || "Professor", 
        email: (p.user as any)?.email || "" 
      }
    })));
  } else {
    console.log("No professors found or error:", profError);
    setProfessors([]);
  }
} catch (e) {
  console.error("Error fetching professors:", e);
  setProfessors([]);
}

      } catch (err: any) {
        setError(err.message || "Failed to load report data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [regionId, diagnosisParam, symptomsParam, sessionId]);

  // Auto-generate AI report when data is loaded
  useEffect(() => {
    if (!loading && diagnosis && !aiReport && !generatingReport) {
      generateAIReport();
    }
  }, [loading, diagnosis]);

  // Handle submission - SAVES TO DATABASE
  const handleSubmit = async () => {
    if (!selectedProfessor || !diagnosis) return;
    
    setSubmitting(true);
    setSubmitError("");
    
    try {
      // Get current user ID (use profile.id or a fallback for dev mode)
      const studentId = profile?.id || user?.id || "a4c24c6b-6cce-45e5-9640-cfdd5308c0c9";
      
      // 1. First, check if session exists, if not create it
      const { data: existingSession } = await supabase
        .from("analysis_sessions")
        .select("id")
        .eq("id", sessionId)
        .single();
      
      let finalSessionId = sessionId;
      
      if (!existingSession) {
        // Create the session first
        const { data: newSession, error: sessionError } = await supabase
          .from("analysis_sessions")
          .insert({
            id: sessionId,
            student_id: studentId,
            student_level: "MS3", // MS3, MS4, R1, R2, R3
            status: "completed",
            initial_complaint: regionName,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (sessionError) {
          console.error("Error creating session:", sessionError);
          throw new Error(`Failed to create session: ${sessionError.message}`);
        }
        
        if (newSession) {
          finalSessionId = newSession.id;
        }
      }

      // 2. Create clinical_reports record
      const reportData = {
        session_id: finalSessionId,
        report_title: `${getDiagnosisName(diagnosis)} - Clinical Analysis`,
        subjective: {
          chief_complaint: regionName,
          symptoms: symptoms.map(s => s.name),
          red_flags: symptoms.filter(s => s.isRedFlag).map(s => s.name),
        },
        objective: {
          note: "Physical examination findings would be documented here based on actual patient encounter."
        },
        assessment: {
          primary_diagnosis: getDiagnosisName(diagnosis),
          confidence: getConfidencePercent(diagnosis),
          supporting_findings: diagnosis?.supporting_findings || diagnosis?.supportingFindings || [],
          red_flags: diagnosis?.red_flags || diagnosis?.redFlags || [],
        },
        plan: {
          note: "Treatment plan and follow-up recommendations would be documented here."
        },
        content_json: {
          diagnosis,
          symptoms,
          region: regionName,
          sessionId: finalSessionId,
        },
        content_markdown: aiReport || "",
        executive_summary: `Clinical analysis for ${getDiagnosisName(diagnosis)} with ${getConfidencePercent(diagnosis)}% confidence.`,
        key_findings: symptoms.map(s => s.name),
        recommendations: [],
        generated_by: "student",
        ai_model_used: "gpt-4o",
        word_count: aiReport ? aiReport.split(/\s+/).length : 0,
      };

      const { data: reportResult, error: reportError } = await supabase
        .from("clinical_reports")
        .insert(reportData)
        .select("id")
        .single();

      if (reportError) {
        console.error("Error creating report:", reportError);
        throw new Error(`Failed to save report: ${reportError.message}`);
      }

      // 3. Create submissions record
      const submissionData = {
        report_id: reportResult.id,
        student_id: studentId,
        professor_id: selectedProfessor,
        status: "pending",
        student_notes: studentNotes || null,
        submitted_at: new Date().toISOString(),
      };

      const { error: submissionError } = await supabase
        .from("submissions")
        .insert(submissionData);

      if (submissionError) {
        console.error("Error creating submission:", submissionError);
        throw new Error(`Failed to create submission: ${submissionError.message}`);
      }

      console.log("Report submitted successfully!");
      setSubmitSuccess(true);
      setShowSubmitDialog(false);
      
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Failed to submit report. Please try again.");
      setShowSubmitDialog(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle PDF Download
  const handleDownloadPDF = () => {
    // For now, create a simple text download
    // In production, use a PDF library like jsPDF or html2pdf
    const content = `
CLINICAL REPORT
===============

Patient Region: ${regionName}
Date: ${new Date().toLocaleDateString()}
Student: ${profile?.full_name || "Medical Student"}

SYMPTOMS REPORTED:
${symptoms.map(s => `- ${s.name}${s.isRedFlag || s.is_red_flag ? ' (RED FLAG)' : ''}`).join('\n')}

PRIMARY DIAGNOSIS:
${getDiagnosisName(diagnosis)}
Confidence: ${getConfidencePercent(diagnosis)}%

CLINICAL ANALYSIS:
${aiReport || 'No AI report generated.'}

STUDENT NOTES:
${studentNotes || 'None'}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical-report-${sessionId.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Report</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
              </Button>
              <Button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-700">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your clinical report has been sent to {professors.find(p => p.id === selectedProfessor)?.user.full_name} for review.
              You'll receive feedback once they've evaluated your diagnosis.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/student/analyzer")}>
                Start New Analysis
              </Button>
              <Button onClick={() => router.push("/student")} className="bg-emerald-600 hover:bg-emerald-700">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Diagnosis
        </Button>
        
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Clinical Report</h1>
          </div>
          <p className="text-emerald-100">
            AI-generated comprehensive clinical analysis and study material
          </p>
        </div>
      </div>

      {/* Basic Case Info - Collapsible */}
      <Collapsible open={showBasicInfo} onOpenChange={setShowBasicInfo}>
        <Card className="mb-6">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Case Summary</CardTitle>
                  <CardDescription>Basic information about this analysis</CardDescription>
                </div>
                {showBasicInfo ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Student</p>
                  <p className="font-medium">{profile?.full_name || "Medical Student"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Body Region</p>
                  <p className="font-medium">{regionName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Session ID</p>
                  <p className="font-medium font-mono text-xs">{sessionId}</p>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Reported Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {symptoms && symptoms.length > 0 ? (
                    symptoms.map((s, index) => (
                      <Badge key={s.id || index} variant={s.isRedFlag || s.is_red_flag ? "destructive" : "secondary"}>
                        {s.name}
                        {(s.isRedFlag || s.is_red_flag) && <AlertTriangle className="h-3 w-3 ml-1" />}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No symptoms recorded</span>
                  )}
                </div>
              </div>

              {/* Diagnosis Summary */}
              {diagnosis && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Primary Diagnosis</p>
                      <p className="font-semibold text-lg text-emerald-900">{getDiagnosisName(diagnosis)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{getConfidencePercent(diagnosis)}%</p>
                      <p className="text-xs text-gray-500">confidence</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* AI Generated Report */}
      <Card className="mb-6">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Comprehensive Clinical Analysis
              </CardTitle>
              <CardDescription>AI-generated educational report with study material</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateAIReport}
              disabled={generatingReport}
            >
              {generatingReport ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Regenerate</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          {generatingReport ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
              <p className="text-gray-600 font-medium">Generating comprehensive clinical report...</p>
              <p className="text-gray-400 text-sm mt-2">This may take 10-20 seconds</p>
            </div>
          ) : reportError ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{reportError}</p>
              <Button onClick={generateAIReport} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Try Again
              </Button>
            </div>
          ) : aiReport ? (
            <div className="prose prose-emerald max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-3 pb-2 border-b">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">{children}</ol>,
                  li: ({ children }) => <li className="ml-4">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-4 bg-emerald-50 rounded-r">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {aiReport}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No report generated yet</p>
              <Button onClick={generateAIReport} className="mt-4">
                Generate Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Notes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Your Notes (Optional)</CardTitle>
          <CardDescription>Add any additional observations or questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter any additional notes, reasoning, or questions..."
            value={studentNotes}
            onChange={(e) => setStudentNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Professor Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Select Reviewing Professor</CardTitle>
          <CardDescription>Choose a professor to review your diagnosis</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a professor..." />
            </SelectTrigger>
            <SelectContent>
              {professors?.map((prof) => (
                <SelectItem key={prof.id} value={prof.id}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{prof.title} {prof.user.full_name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">{prof.specialty}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Submit Error */}
      {submitError && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <p>{submitError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" /> Download Report
        </Button>
        
        <Button
          onClick={() => setShowSubmitDialog(true)}
          disabled={!selectedProfessor || generatingReport}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
        >
          <Send className="h-4 w-4 mr-2" /> Submit for Review
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Report for Review?</DialogTitle>
            <DialogDescription>
              Your report will be sent to {professors.find(p => p.id === selectedProfessor)?.user.full_name} for review.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Diagnosis:</span>
                <span className="font-medium">{getDiagnosisName(diagnosis)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Confidence:</span>
                <span className="font-medium">{getConfidencePercent(diagnosis)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Professor:</span>
                <span className="font-medium">{professors.find(p => p.id === selectedProfessor)?.user.full_name}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4 mr-2" /> Confirm Submit</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}