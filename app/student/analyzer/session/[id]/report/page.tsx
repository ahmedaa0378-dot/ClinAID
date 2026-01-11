"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { BodyRegion, Symptom, DifferentialDiagnosis } from "@/lib/types/analyzer";
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
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const [regionName, setRegionName] = useState<string>("-");

  // Helper function to get diagnosis name
  const getDiagnosisName = (diag: any): string => {
    return diag?.diagnosis_name || diag?.name || diag?.diagnosisName || 'Unknown Diagnosis';
  };

  // Helper function to get confidence percentage
  const getConfidencePercent = (diag: any): number => {
    const score = diag?.confidence_score || diag?.confidenceScore || diag?.confidence || 0;
    // If score is already a percentage (> 1), use as is; otherwise multiply by 100
    const percent = Number(score);
    if (isNaN(percent)) return 0;
    return percent > 1 ? Math.round(percent) : Math.round(percent * 100);
  };

  // Parse data and fetch professors
  useEffect(() => {
    console.log("Report page mounted");
    console.log("Session ID:", sessionId);
    console.log("URL params - region:", regionId, "diagnosis:", diagnosisParam?.substring(0, 50), "symptoms:", symptomsParam?.substring(0, 50));

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        console.log("Starting data fetch...");

        // Parse diagnosis
        if (diagnosisParam) {
          console.log("Parsing diagnosis param...");
          try {
            const parsedDiagnosis = JSON.parse(decodeURIComponent(diagnosisParam));
            console.log("Parsed diagnosis:", parsedDiagnosis);
            console.log("Diagnosis keys:", Object.keys(parsedDiagnosis));
            console.log("Diagnosis name fields:", parsedDiagnosis?.name, parsedDiagnosis?.diagnosis_name, parsedDiagnosis?.diagnosisName);
            console.log("Confidence fields:", parsedDiagnosis?.confidence, parsedDiagnosis?.confidence_score, parsedDiagnosis?.confidenceScore);
            setDiagnosis(parsedDiagnosis);
          } catch (parseError) {
            console.error("Failed to parse diagnosis JSON:", parseError);
            // Try using it as plain text
            setDiagnosis({ name: decodeURIComponent(diagnosisParam) } as any);
          }
        } else {
          console.warn("No diagnosis parameter found");
        }

        // Parse symptoms
        if (symptomsParam) {
          console.log("Parsing symptoms param...");
          try {
            const parsedSymptoms = JSON.parse(decodeURIComponent(symptomsParam));
            console.log("Parsed symptoms:", parsedSymptoms);
            setSymptoms(Array.isArray(parsedSymptoms) ? parsedSymptoms : []);
          } catch (parseError) {
            console.error("Failed to parse symptoms JSON:", parseError);
            setSymptoms([]);
          }
        } else {
          console.warn("No symptoms parameter found");
        }

        // Handle region - could be UUID or name
        if (regionId) {
          console.log("Processing region:", regionId);
          
          // Check if regionId looks like a UUID
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(regionId);
          
          if (isUUID) {
            console.log("Region ID is UUID, fetching from Supabase...");
            try {
              const { data: regionData, error: regionError } = await supabase
                .from("body_regions")
                .select("*")
                .eq("id", regionId)
                .single();

              if (regionError) {
                console.error("Region fetch error:", regionError);
                setRegionName(regionId);
              } else if (regionData) {
                console.log("Region data fetched:", regionData);
                setRegion(regionData);
                setRegionName(regionData.displayName || regionData.display_name || regionData.name || regionId);
              }
            } catch (e) {
              console.error("Region fetch failed:", e);
              setRegionName(regionId);
            }
          } else {
            // regionId is a name like "chest", "head", etc.
            console.log("Region ID is a name, using directly:", regionId);
            setRegionName(regionId.charAt(0).toUpperCase() + regionId.slice(1));
          }
        } else {
          console.warn("No region ID provided");
          setRegionName("-");
        }

        // Fetch professors (sample data for now)
        console.log("Setting up professors list...");
        setProfessors([
          {
            id: "prof1",
            user_id: "user1",
            specialty: "Internal Medicine",
            title: "Dr.",
            user: { full_name: "Sarah Johnson", email: "s.johnson@medical.edu" },
          },
          {
            id: "prof2",
            user_id: "user2",
            specialty: "Neurology",
            title: "Dr.",
            user: { full_name: "Michael Chen", email: "m.chen@medical.edu" },
          },
          {
            id: "prof3",
            user_id: "user3",
            specialty: "Emergency Medicine",
            title: "Dr.",
            user: { full_name: "Emily Williams", email: "e.williams@medical.edu" },
          },
        ]);

        console.log("Data fetch completed successfully");
      } catch (err: any) {
        console.error("Error loading report data:", err);
        setError(err.message || "Failed to load report data. Please try again.");
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    }

    fetchData();
  }, [regionId, diagnosisParam, symptomsParam, sessionId]);

  // Handle submission
  const handleSubmit = async () => {
    if (!selectedProfessor || !diagnosis) return;
    
    setSubmitting(true);
    
    try {
      // In production, this would:
      // 1. Create a clinical_reports record
      // 2. Create a submissions record
      // 3. Notify the professor
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Format current date
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
          <p className="mt-2 text-gray-600">Generating clinical report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Report</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
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
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Report Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your clinical report has been sent to {professors.find(p => p.id === selectedProfessor)?.user.full_name} for review. 
              You'll receive a notification once it's reviewed.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/student/analyzer")}
              >
                Start New Analysis
              </Button>
              <Button
                onClick={() => router.push("/student/submissions")}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                View My Submissions
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
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Diagnosis
        </Button>
        
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Clinical Report</h1>
          </div>
          <p className="text-emerald-100">
            Review and submit your diagnosis report for professor evaluation
          </p>
        </div>
      </div>

      {/* Report Preview */}
      <Card className="mb-6">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Symptom Analysis Report</CardTitle>
              <CardDescription>Generated on {formatDate(new Date())}</CardDescription>
            </div>
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              Draft
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="py-6 space-y-6">
          {/* Patient/Student Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium">{profile?.full_name || "Medical Student"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Level</p>
              <p className="font-medium">Medical Student</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Session ID</p>
              <p className="font-medium font-mono text-sm">{sessionId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* SOAP Format Report */}
          <div className="space-y-4">
            {/* Subjective */}
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Subjective
              </h3>
              <div className="pl-7 space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Chief Complaint / Body Region</p>
                  <p className="text-gray-900">
                    {region?.displayName || region?.display_name || regionName || '-'}
                    {region?.description ? ` - ${region.description}` : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Symptoms Reported</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {symptoms && symptoms.length > 0 ? (
                      symptoms.map((s, index) => (
                        <Badge
                          key={s.id || index}
                          variant={s.isRedFlag || s.is_red_flag ? "destructive" : "secondary"}
                        >
                          {s.name}
                          {(s.isRedFlag || s.is_red_flag) && <AlertTriangle className="h-3 w-3 ml-1" />}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No symptoms recorded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Objective */}
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Stethoscope className="h-5 w-5 text-green-600" />
                Objective
              </h3>
              <div className="pl-7">
                <p className="text-sm text-gray-600 italic">
                  Physical examination findings would be documented here based on actual patient encounter.
                </p>
              </div>
            </div>

            {/* Assessment */}
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Assessment
              </h3>
              <div className="pl-7 space-y-3">
                {diagnosis ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Primary Diagnosis</p>
                        <p className="font-semibold text-lg text-emerald-900">
                          {getDiagnosisName(diagnosis)}
                        </p>
                        {(diagnosis.diagnosis_code || diagnosis.code) && (
                          <Badge variant="outline" className="mt-1">
                            ICD-10: {diagnosis.diagnosis_code || diagnosis.code}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">
                          {getConfidencePercent(diagnosis)}%
                        </p>
                        <p className="text-xs text-gray-500">confidence</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3">
                      {diagnosis.brief_description || diagnosis.briefDescription || diagnosis.description || ''}
                    </p>
                    
                    {/* Supporting Findings */}
                    {(diagnosis.supporting_findings || diagnosis.supportingFindings) && 
                     (diagnosis.supporting_findings || diagnosis.supportingFindings).length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Supporting Findings:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {(diagnosis.supporting_findings || diagnosis.supportingFindings)?.map((finding: string, i: number) => (
                            <li key={i}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Red Flags */}
                    {(diagnosis.red_flags || diagnosis.redFlags) && 
                     (diagnosis.red_flags || diagnosis.redFlags).length > 0 && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm font-medium text-red-800 flex items-center gap-1 mb-2">
                          <AlertTriangle className="h-4 w-4" />
                          Red Flags to Monitor
                        </p>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                          {(diagnosis.red_flags || diagnosis.redFlags)?.map((flag: string, i: number) => (
                            <li key={i}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-500 text-center">No diagnosis data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Plan */}
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                Plan
              </h3>
              <div className="pl-7">
                <p className="text-sm text-gray-600 italic">
                  Treatment plan and follow-up recommendations would be documented here.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Notes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Your Notes (Optional)</CardTitle>
          <CardDescription>
            Add any additional observations or questions for the reviewing professor
          </CardDescription>
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
          <CardDescription>
            Choose a professor to review and provide feedback on your diagnosis
          </CardDescription>
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
                    <Badge variant="outline" className="ml-2 text-xs">
                      {prof.specialty}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        
        <Button
          onClick={() => setShowSubmitDialog(true)}
          disabled={!selectedProfessor}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
        >
          <Send className="h-4 w-4 mr-2" />
          Submit for Review
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Report for Review?</DialogTitle>
            <DialogDescription>
              Your report will be sent to {professors.find(p => p.id === selectedProfessor)?.user.full_name} for review. 
              You'll receive feedback once they've evaluated your diagnosis.
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
                <span className="text-gray-600">Reviewing Professor:</span>
                <span className="font-medium">
                  {professors.find(p => p.id === selectedProfessor)?.user.full_name}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Confirm Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}