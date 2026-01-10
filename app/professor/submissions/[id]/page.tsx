"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Clock,
  Stethoscope,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Brain,
  Activity,
  Sparkles,
  Send,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useSubmissions } from "@/hooks/useSubmissions";

export default function SubmissionReviewPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id as string;
  const { profile } = useAuth();
  const { getSubmissionDetails, provideFeedback, loading } = useSubmissions();

  const [submissionData, setSubmissionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  // Feedback form state
  const [feedbackText, setFeedbackText] = useState("");
  const [suggestedDiagnosis, setSuggestedDiagnosis] = useState("");
  const [suggestedDiagnosisReasoning, setSuggestedDiagnosisReasoning] = useState("");
  const [grade, setGrade] = useState("");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [newStrength, setNewStrength] = useState("");
  const [newImprovement, setNewImprovement] = useState("");
  const [revisionNotes, setRevisionNotes] = useState("");

  useEffect(() => {
    loadSubmission();
  }, [submissionId]);

  const loadSubmission = async () => {
    setIsLoading(true);
    const data = await getSubmissionDetails(submissionId);
    setSubmissionData(data);

    // Pre-fill if feedback exists
    if (data?.feedback) {
      setFeedbackText(data.feedback.feedback_text || "");
      setSuggestedDiagnosis(data.feedback.suggested_diagnosis || "");
      setSuggestedDiagnosisReasoning(data.feedback.suggested_diagnosis_reasoning || "");
      setGrade(data.feedback.grade || "");
      setStrengths(data.feedback.strengths || []);
      setImprovements(data.feedback.areas_for_improvement || []);
      setRevisionNotes(data.feedback.revision_notes || "");
    }

    setIsLoading(false);
  };

  const handleApprove = async () => {
    if (!feedbackText.trim()) {
      alert("Please provide feedback before approving.");
      return;
    }

    setIsSubmitting(true);
    const success = await provideFeedback(submissionId, {
      feedbackText,
      suggestedDiagnosis: suggestedDiagnosis || undefined,
      suggestedDiagnosisReasoning: suggestedDiagnosisReasoning || undefined,
      grade: grade || undefined,
      isApproved: true,
      revisionRequired: false,
      strengths,
      areasForImprovement: improvements,
    });

    setIsSubmitting(false);

    if (success) {
      alert("Submission approved! Student has been notified.");
      router.push("/professor/submissions");
    }
  };

  const handleRequestRevision = async () => {
    if (!feedbackText.trim() || !revisionNotes.trim()) {
      alert("Please provide feedback and revision notes.");
      return;
    }

    setIsSubmitting(true);
    const success = await provideFeedback(submissionId, {
      feedbackText,
      suggestedDiagnosis: suggestedDiagnosis || undefined,
      suggestedDiagnosisReasoning: suggestedDiagnosisReasoning || undefined,
      grade: grade || undefined,
      isApproved: false,
      revisionRequired: true,
      revisionNotes,
      strengths,
      areasForImprovement: improvements,
    });

    setIsSubmitting(false);

    if (success) {
      alert("Revision requested! Student has been notified.");
      router.push("/professor/submissions");
    }
  };

  const addStrength = () => {
    if (newStrength.trim()) {
      setStrengths([...strengths, newStrength.trim()]);
      setNewStrength("");
    }
  };

  const addImprovement = () => {
    if (newImprovement.trim()) {
      setImprovements([...improvements, newImprovement.trim()]);
      setNewImprovement("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!submissionData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Submission not found</h2>
        <Button className="mt-4" onClick={() => router.push("/professor/submissions")}>
          Back to Submissions
        </Button>
      </div>
    );
  }

  const { submission, feedback, sessionData } = submissionData;
  const report = submission.clinical_reports;
  const isReviewed = ["approved", "revision_requested", "rejected"].includes(submission.status);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/professor/submissions")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Submission</h1>
            <p className="text-gray-500">
              From {submission.student?.full_name || "Student"}
            </p>
          </div>
        </div>
        <Badge
          className={
            submission.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : submission.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }
        >
          {submission.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      {/* Student & Submission Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Student</p>
                <p className="font-medium">{submission.student?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="font-medium text-sm">{formatDate(submission.submitted_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Diagnosis</p>
                <p className="font-medium text-emerald-600">{report?.primary_diagnosis}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Body Region</p>
                <p className="font-medium">{sessionData?.session?.body_region_display_name || "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Notes */}
      {submission.student_notes && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <MessageSquare className="h-5 w-5" />
              Student Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{submission.student_notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Session Details (Collapsible) */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setShowSessionDetails(!showSessionDetails)}
        >
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Analysis Session Details
            </span>
            {showSessionDetails ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </CardTitle>
        </CardHeader>
        {showSessionDetails && (
          <CardContent className="space-y-6">
            {/* Symptoms */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Reported Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {sessionData?.symptoms?.map((symptom: any) => (
                  <Badge
                    key={symptom.id}
                    className={
                      symptom.is_red_flag
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {symptom.is_red_flag && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {symptom.symptom_name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Q&A Steps */}
            {sessionData?.steps?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Clinical Interview</h4>
                <div className="space-y-3">
                  {sessionData.steps.map((step: any, index: number) => (
                    <div key={step.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        Q{index + 1}: {step.question_text}
                      </p>
                      <p className="font-medium text-gray-800">
                        A: {step.selected_option_text || "No response"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Differential Diagnoses */}
            {sessionData?.diagnoses?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">AI Differential Diagnoses</h4>
                <div className="space-y-3">
                  {sessionData.diagnoses.map((dx: any) => (
                    <div
                      key={dx.id}
                      className={`p-4 rounded-lg border ${
                        dx.is_selected ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{dx.diagnosis_name}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              dx.probability === "high"
                                ? "bg-red-100 text-red-800"
                                : dx.probability === "moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {dx.probability}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {Math.round(dx.confidence_score * 100)}%
                          </span>
                          {dx.is_selected && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{dx.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Professor Feedback Form */}
      {!isReviewed ? (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <FileText className="h-5 w-5" />
              Your Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Main Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Comments *
              </label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Provide your feedback on the student's analysis..."
                className="min-h-[120px]"
              />
            </div>

            {/* Suggested Alternative Diagnosis */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggest Alternative Diagnosis (Optional)
              </h4>
              <div className="space-y-3">
                <Input
                  value={suggestedDiagnosis}
                  onChange={(e) => setSuggestedDiagnosis(e.target.value)}
                  placeholder="Alternative diagnosis name"
                />
                <Textarea
                  value={suggestedDiagnosisReasoning}
                  onChange={(e) => setSuggestedDiagnosisReasoning(e.target.value)}
                  placeholder="Explain your reasoning for this alternative..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Strengths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ThumbsUp className="h-4 w-4 inline mr-1 text-green-500" />
                Strengths
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  placeholder="Add a strength..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStrength())}
                />
                <Button type="button" variant="outline" onClick={addStrength}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {strengths.map((s, i) => (
                  <Badge key={i} className="bg-green-100 text-green-800">
                    {s}
                    <button
                      onClick={() => setStrengths(strengths.filter((_, j) => j !== i))}
                      className="ml-1 hover:text-green-900"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ThumbsDown className="h-4 w-4 inline mr-1 text-orange-500" />
                Areas for Improvement
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newImprovement}
                  onChange={(e) => setNewImprovement(e.target.value)}
                  placeholder="Add an area for improvement..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImprovement())}
                />
                <Button type="button" variant="outline" onClick={addImprovement}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {improvements.map((s, i) => (
                  <Badge key={i} className="bg-orange-100 text-orange-800">
                    {s}
                    <button
                      onClick={() => setImprovements(improvements.filter((_, j) => j !== i))}
                      className="ml-1 hover:text-orange-900"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade (Optional)
              </label>
              <div className="flex gap-2">
                {["A", "B", "C", "D", "F"].map((g) => (
                  <Button
                    key={g}
                    type="button"
                    variant={grade === g ? "default" : "outline"}
                    onClick={() => setGrade(g)}
                    className={grade === g ? "bg-emerald-600" : ""}
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>

            {/* Revision Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revision Notes (Required if requesting revision)
              </label>
              <Textarea
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Specific instructions for the student to revise their work..."
                className="min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={handleRequestRevision}
                variant="outline"
                disabled={isSubmitting}
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Request Revision
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Approve Submission
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Show existing feedback for reviewed submissions */
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              Your Feedback (Submitted)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Feedback</p>
              <p className="text-gray-800">{feedback?.feedback_text || "No feedback provided"}</p>
            </div>

            {feedback?.suggested_diagnosis && (
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-700 font-medium">Suggested Alternative</p>
                <p className="text-amber-900 font-semibold">{feedback.suggested_diagnosis}</p>
                <p className="text-sm text-amber-700 mt-1">{feedback.suggested_diagnosis_reasoning}</p>
              </div>
            )}

            {feedback?.grade && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Grade</p>
                <Badge className="bg-emerald-100 text-emerald-800 text-lg px-3 py-1">
                  {feedback.grade}
                </Badge>
              </div>
            )}

            {feedback?.strengths?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {feedback.strengths.map((s: string, i: number) => (
                    <Badge key={i} className="bg-green-100 text-green-800">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {feedback?.areas_for_improvement?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Areas for Improvement</p>
                <div className="flex flex-wrap gap-2">
                  {feedback.areas_for_improvement.map((s: string, i: number) => (
                    <Badge key={i} className="bg-orange-100 text-orange-800">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {feedback?.revision_notes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Revision Notes</p>
                <p className="text-orange-700">{feedback.revision_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}