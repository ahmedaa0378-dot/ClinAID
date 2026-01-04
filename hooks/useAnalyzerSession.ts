import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface SessionData {
  id: string;
  student_id: string;
  status: string;
  student_level: string;
  initial_body_region_id?: string;
  initial_complaint?: string;
  started_at: string;
  completed_at?: string;
  total_steps?: number;
  time_spent_seconds?: number;
}

interface SessionStep {
  id: string;
  session_id: string;
  step_number: number;
  step_type: string;
  question_text: string;
  question_explanation?: string;
  options_presented: any;
  selected_option_id?: string;
  selected_option_text?: string;
  ai_model_used?: string;
  ai_confidence_score?: number;
}

interface Symptom {
  id: string;
  name: string;
  isRedFlag: boolean;
}

interface Diagnosis {
  name: string;
  icdCode?: string;
  probability: string;
  confidence: number;
  description: string;
  supportingFindings: string[];
  redFlags?: string[];
}

export function useAnalyzerSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new analysis session
  const createSession = async (
    studentId: string,
    regionId?: string,
    initialComplaint?: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // Get student level from users table
      const { data: userData } = await supabase
        .from("users")
        .select("student_type")
        .eq("id", studentId)
        .single();

      const studentLevel = userData?.student_type || "R1";

      // Create session
      const { data, error: insertError } = await supabase
        .from("analysis_sessions")
        .insert({
          student_id: studentId,
          student_level: studentLevel,
          initial_body_region_id: regionId,
          initial_complaint: initialComplaint,
          status: "in_progress",
          started_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSessionId(data.id);
      return data.id;
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating session:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add symptoms to session
  const addSymptoms = async (
    sessionId: string,
    symptoms: Symptom[],
    regionId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const symptomRecords = symptoms.map((symptom) => ({
        session_id: sessionId,
        body_region_id: regionId,
        symptom_name: symptom.name,
        is_red_flag: symptom.isRedFlag,
        reported_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from("session_symptoms")
        .insert(symptomRecords);

      if (insertError) throw insertError;

      // Update session activity
      await supabase
        .from("analysis_sessions")
        .update({ last_activity_at: new Date().toISOString() })
        .eq("id", sessionId);

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding symptoms:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add a Q&A step to session
  const addStep = async (
    sessionId: string,
    stepNumber: number,
    stepType: string,
    questionText: string,
    questionExplanation: string,
    options: any[],
    selectedOptionId?: string,
    selectedOptionText?: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("session_steps")
        .insert({
          session_id: sessionId,
          step_number: stepNumber,
          step_type: stepType,
          question_text: questionText,
          question_explanation: questionExplanation,
          options_presented: options,
          selected_option_id: selectedOptionId,
          selected_option_text: selectedOptionText,
          ai_model_used: "gpt-4o",
          presented_at: new Date().toISOString(),
          answered_at: selectedOptionId ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Update session activity
      await supabase
        .from("analysis_sessions")
        .update({ last_activity_at: new Date().toISOString() })
        .eq("id", sessionId);

      return data.id;
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding step:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save differential diagnoses
  const saveDiagnoses = async (
    sessionId: string,
    diagnoses: Diagnosis[]
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const diagnosisRecords = diagnoses.map((diagnosis, index) => ({
        session_id: sessionId,
        diagnosis_name: diagnosis.name,
        diagnosis_code: diagnosis.icdCode,
        probability: diagnosis.probability,
        confidence_score: diagnosis.confidence,
        supporting_findings: diagnosis.supportingFindings,
        red_flags: diagnosis.redFlags || [],
        brief_description: diagnosis.description,
        display_order: index + 1,
      }));

      const { error: insertError } = await supabase
        .from("differential_diagnoses")
        .insert(diagnosisRecords);

      if (insertError) throw insertError;

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error("Error saving diagnoses:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Save final diagnosis selection
  const saveFinalDiagnosis = async (
    sessionId: string,
    differentialId: string,
    diagnosisName: string,
    diagnosisCode: string,
    studentRationale?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from("final_diagnosis")
        .insert({
          session_id: sessionId,
          differential_id: differentialId,
          diagnosis_name: diagnosisName,
          diagnosis_code: diagnosisCode,
          student_rationale: studentRationale,
          confirmed_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error("Error saving final diagnosis:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Complete session
  const completeSession = async (sessionId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Get session start time to calculate duration
      const { data: session } = await supabase
        .from("analysis_sessions")
        .select("started_at")
        .eq("id", sessionId)
        .single();

      const startTime = new Date(session?.started_at || new Date());
      const timeSpent = Math.floor(
        (new Date().getTime() - startTime.getTime()) / 1000
      );

      // Count steps
      const { count } = await supabase
        .from("session_steps")
        .select("*", { count: "exact", head: true })
        .eq("session_id", sessionId);

      // Update session
      const { error: updateError } = await supabase
        .from("analysis_sessions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          total_steps: count || 0,
          time_spent_seconds: timeSpent,
        })
        .eq("id", sessionId);

      if (updateError) throw updateError;

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error("Error completing session:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create clinical report
  const createReport = async (
    sessionId: string,
    reportTitle: string,
    content: {
      subjective: any;
      objective: any;
      assessment: any;
      plan: any;
    },
    executiveSummary?: string,
    keyFindings?: string[]
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("clinical_reports")
        .insert({
          session_id: sessionId,
          report_title: reportTitle,
          subjective: content.subjective,
          objective: content.objective,
          assessment: content.assessment,
          plan: content.plan,
          content_json: content,
          executive_summary: executiveSummary,
          key_findings: keyFindings,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return data.id;
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating report:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Submit for professor review
  const submitForReview = async (
    reportId: string,
    studentId: string,
    professorId: string,
    studentNotes?: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("submissions")
        .insert({
          report_id: reportId,
          student_id: studentId,
          professor_id: professorId,
          student_notes: studentNotes,
          status: "pending",
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Create notification for professor
      const { data: profData } = await supabase
        .from("professors")
        .select("user_id")
        .eq("id", professorId)
        .single();

      if (profData?.user_id) {
        await supabase.from("notifications").insert({
          user_id: profData.user_id,
          title: "New Submission for Review",
          message: "A student has submitted a diagnosis analysis for your review.",
          notification_type: "submission_received",
          entity_type: "submission",
          entity_id: data.id,
          action_url: `/professor/reviews/${data.id}`,
        });
      }

      return data.id;
    } catch (err: any) {
      setError(err.message);
      console.error("Error submitting for review:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get session history for a student
  const getStudentSessions = async (
    studentId: string,
    limit: number = 10
  ): Promise<SessionData[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("analysis_sessions")
        .select(`
          *,
          body_regions:initial_body_region_id(display_name),
          final_diagnosis(diagnosis_name)
        `)
        .eq("student_id", studentId)
        .order("started_at", { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;

      return data || [];
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching sessions:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    sessionId,
    loading,
    error,
    createSession,
    addSymptoms,
    addStep,
    saveDiagnoses,
    saveFinalDiagnosis,
    completeSession,
    createReport,
    submitForReview,
    getStudentSessions,
  };
}
