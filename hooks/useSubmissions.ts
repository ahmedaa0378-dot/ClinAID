"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export interface Submission {
  id: string;
  report_id: string;
  student_id: string;
  professor_id: string;
  student_notes?: string;
  status: "pending" | "in_review" | "approved" | "revision_requested" | "rejected";
  submitted_at: string;
  reviewed_at?: string;
  // Joined data
  student?: {
    full_name: string;
    email: string;
  };
  professor?: {
    full_name: string;
    email: string;
  };
  clinical_report?: {
    id: string;
    primary_diagnosis: string;
    session_id: string;
  };
  feedback?: SubmissionFeedback;
}

export interface SubmissionFeedback {
  id: string;
  submission_id: string;
  professor_id: string;
  feedback_text?: string;
  suggested_diagnosis?: string;
  suggested_diagnosis_reasoning?: string;
  grade?: string;
  is_approved: boolean;
  revision_required: boolean;
  revision_notes?: string;
  strengths: string[];
  areas_for_improvement: string[];
  additional_resources: string[];
  created_at: string;
}

export function useSubmissions() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit report to professor
  const submitToProf = async (
    reportId: string,
    professorId: string,
    studentNotes?: string
  ): Promise<Submission | null> => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the report to find session_id
      const { data: report, error: reportError } = await supabase
        .from("clinical_reports")
        .select("session_id")
        .eq("id", reportId)
        .single();

      if (reportError) throw reportError;

      // Create submission
      const { data: submission, error: subError } = await supabase
        .from("submissions")
        .insert({
          report_id: reportId,
          student_id: user.id,
          professor_id: professorId,
          student_notes: studentNotes || "",
          status: "pending",
        })
        .select()
        .single();

      if (subError) throw subError;

      // Update session status
      await supabase
        .from("analysis_sessions")
        .update({ status: "submitted" })
        .eq("id", report.session_id);

      // Create notification for professor
      await supabase.from("notifications").insert({
        user_id: professorId,
        title: "New Submission for Review",
        message: `${profile?.full_name || "A student"} has submitted a clinical analysis for your review.`,
        notification_type: "submission_received",
        entity_type: "submission",
        entity_id: submission.id,
        action_url: `/professor/submissions/${submission.id}`,
      });

      // Add to email queue
      const { data: professor } = await supabase
        .from("users")
        .select("email, full_name")
        .eq("id", professorId)
        .single();

      if (professor) {
        await supabase.from("email_queue").insert({
          recipient_email: professor.email,
          recipient_name: professor.full_name,
          subject: "New Clinical Analysis Submission for Review",
          body_html: `
            <h2>New Submission Received</h2>
            <p>Dear ${professor.full_name},</p>
            <p><strong>${profile?.full_name || "A student"}</strong> has submitted a clinical analysis for your review.</p>
            <p>Please log in to ClinAID to review the submission.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/professor/submissions/${submission.id}">Review Submission</a></p>
          `,
          body_text: `New submission from ${profile?.full_name || "A student"}. Please log in to review.`,
        });
      }

      return submission;
    } catch (err: any) {
      console.error("Error submitting to professor:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get student's submissions
  const getStudentSubmissions = async () => {
    if (!user) return [];

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("submissions")
        .select(`
          *,
          professor:professor_id (full_name, email),
          clinical_reports:report_id (id, primary_diagnosis, session_id)
        `)
        .eq("student_id", user.id)
        .order("submitted_at", { ascending: false });

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching submissions:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get professor's pending submissions
  const getProfessorSubmissions = async (status?: string) => {
    if (!user) return [];

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("submissions")
        .select(`
          *,
          student:student_id (full_name, email),
          clinical_reports:report_id (id, primary_diagnosis, session_id)
        `)
        .eq("professor_id", user.id)
        .order("submitted_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching professor submissions:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get single submission with full details
  const getSubmissionDetails = async (submissionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: submission, error: subError } = await supabase
        .from("submissions")
        .select(`
          *,
          student:student_id (id, full_name, email),
          professor:professor_id (id, full_name, email),
          clinical_reports:report_id (*)
        `)
        .eq("id", submissionId)
        .single();

      if (subError) throw subError;

      // Get feedback if exists
      const { data: feedback } = await supabase
        .from("submission_feedback")
        .select("*")
        .eq("submission_id", submissionId)
        .single();

      // Get full session data
      let sessionData = null;
      if (submission.clinical_reports?.session_id) {
        const { data: session } = await supabase
          .from("analysis_sessions")
          .select("*")
          .eq("id", submission.clinical_reports.session_id)
          .single();

        const { data: symptoms } = await supabase
          .from("session_symptoms")
          .select("*")
          .eq("session_id", submission.clinical_reports.session_id);

        const { data: steps } = await supabase
          .from("session_steps")
          .select("*")
          .eq("session_id", submission.clinical_reports.session_id)
          .order("step_number");

        const { data: diagnoses } = await supabase
          .from("differential_diagnoses")
          .select("*")
          .eq("session_id", submission.clinical_reports.session_id)
          .order("display_order");

        sessionData = {
          session,
          symptoms: symptoms || [],
          steps: steps || [],
          diagnoses: diagnoses || [],
        };
      }

      return {
        submission,
        feedback,
        sessionData,
      };
    } catch (err: any) {
      console.error("Error fetching submission details:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Professor provides feedback
  const provideFeedback = async (
    submissionId: string,
    feedbackData: {
      feedbackText: string;
      suggestedDiagnosis?: string;
      suggestedDiagnosisReasoning?: string;
      grade?: string;
      isApproved: boolean;
      revisionRequired: boolean;
      revisionNotes?: string;
      strengths?: string[];
      areasForImprovement?: string[];
      additionalResources?: string[];
    }
  ): Promise<boolean> => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Create feedback
      const { error: feedbackError } = await supabase
        .from("submission_feedback")
        .insert({
          submission_id: submissionId,
          professor_id: user.id,
          feedback_text: feedbackData.feedbackText,
          suggested_diagnosis: feedbackData.suggestedDiagnosis,
          suggested_diagnosis_reasoning: feedbackData.suggestedDiagnosisReasoning,
          grade: feedbackData.grade,
          is_approved: feedbackData.isApproved,
          revision_required: feedbackData.revisionRequired,
          revision_notes: feedbackData.revisionNotes,
          strengths: feedbackData.strengths || [],
          areas_for_improvement: feedbackData.areasForImprovement || [],
          additional_resources: feedbackData.additionalResources || [],
        });

      if (feedbackError) throw feedbackError;

      // Update submission status
      const newStatus = feedbackData.isApproved
        ? "approved"
        : feedbackData.revisionRequired
        ? "revision_requested"
        : "in_review";

      const { data: submission, error: updateError } = await supabase
        .from("submissions")
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId)
        .select("student_id, report_id")
        .single();

      if (updateError) throw updateError;

      // Notify student
      const statusMessage = feedbackData.isApproved
        ? "Your clinical analysis has been approved!"
        : feedbackData.revisionRequired
        ? "Your clinical analysis requires revision."
        : "Your clinical analysis has been reviewed.";

      await supabase.from("notifications").insert({
        user_id: submission.student_id,
        title: "Submission Reviewed",
        message: statusMessage,
        notification_type: "feedback_received",
        entity_type: "submission",
        entity_id: submissionId,
        action_url: `/student/submissions/${submissionId}`,
      });

      // Update session status to reviewed
      const { data: report } = await supabase
        .from("clinical_reports")
        .select("session_id")
        .eq("id", submission.report_id)
        .single();

      if (report) {
        await supabase
          .from("analysis_sessions")
          .update({ status: "reviewed" })
          .eq("id", report.session_id);
      }

      return true;
    } catch (err: any) {
      console.error("Error providing feedback:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get available professors for submission
  const getAvailableProfessors = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("users")
        .select("id, full_name, email, department_id")
        .eq("role", "professor")
        .eq("status", "active");

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching professors:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitToProf,
    getStudentSubmissions,
    getProfessorSubmissions,
    getSubmissionDetails,
    provideFeedback,
    getAvailableProfessors,
  };
}