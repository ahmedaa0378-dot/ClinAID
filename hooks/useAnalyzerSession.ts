"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

// Types
export interface AnalysisSession {
  id: string;
  student_id: string;
  student_level: string;
  body_region: string;
  body_region_display_name: string;
  initial_complaint?: string;
  status: "in_progress" | "completed" | "submitted" | "reviewed";
  started_at: string;
  completed_at?: string;
  total_steps: number;
  time_spent_seconds: number;
}

export interface SessionSymptom {
  id: string;
  session_id: string;
  symptom_id: string;
  symptom_name: string;
  symptom_description?: string;
  is_red_flag: boolean;
}

export interface SessionStep {
  id: string;
  session_id: string;
  step_number: number;
  question_text: string;
  question_rationale?: string;
  options_presented?: any;
  selected_option_id?: string;
  selected_option_text?: string;
  is_custom_response: boolean;
}

export interface DifferentialDiagnosis {
  id: string;
  session_id: string;
  diagnosis_name: string;
  icd_code?: string;
  probability: "high" | "moderate" | "low";
  confidence_score: number;
  description?: string;
  supporting_findings: string[];
  red_flags: string[];
  next_steps: string[];
  display_order: number;
  is_selected: boolean;
}

export interface ClinicalReport {
  id: string;
  session_id: string;
  report_title?: string;
  primary_diagnosis: string;
  soap_note?: any;
  educational_content?: any;
  clinical_pearls?: string[];
  suggested_references?: string[];
  student_notes?: string;
}

export function useAnalyzerSession() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new analysis session
  const createSession = async (
    bodyRegion: string,
    bodyRegionDisplayName: string,
    studentLevel: string = "R1"
  ): Promise<AnalysisSession | null> => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("analysis_sessions")
        .insert({
          student_id: user.id,
          student_level: studentLevel,
          body_region: bodyRegion,
          body_region_display_name: bodyRegionDisplayName,
          status: "in_progress",
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return data;
    } catch (err: any) {
      console.error("Error creating session:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save symptoms for a session
  const saveSymptoms = async (
    sessionId: string,
    symptoms: { id: string; name: string; description?: string; isRedFlag: boolean }[]
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const symptomsData = symptoms.map((s) => ({
        session_id: sessionId,
        symptom_id: s.id,
        symptom_name: s.name,
        symptom_description: s.description || "",
        is_red_flag: s.isRedFlag,
      }));

      const { error: dbError } = await supabase
        .from("session_symptoms")
        .insert(symptomsData);

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      console.error("Error saving symptoms:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Save a Q&A step
  const saveStep = async (
    sessionId: string,
    stepNumber: number,
    questionText: string,
    questionRationale: string,
    optionsPresented: any[],
    selectedOptionId: string,
    selectedOptionText: string,
    isCustomResponse: boolean = false
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase.from("session_steps").insert({
        session_id: sessionId,
        step_number: stepNumber,
        question_text: questionText,
        question_rationale: questionRationale,
        options_presented: optionsPresented,
        selected_option_id: selectedOptionId,
        selected_option_text: selectedOptionText,
        is_custom_response: isCustomResponse,
      });

      if (dbError) throw dbError;

      // Update total steps in session
      await supabase
        .from("analysis_sessions")
        .update({ total_steps: stepNumber })
        .eq("id", sessionId);

      return true;
    } catch (err: any) {
      console.error("Error saving step:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Save differential diagnoses
  const saveDiagnoses = async (
    sessionId: string,
    diagnoses: {
      name: string;
      icdCode?: string;
      probability: "high" | "moderate" | "low";
      confidence: number;
      description?: string;
      supportingFindings?: string[];
      redFlags?: string[];
      nextSteps?: string[];
    }[],
    selectedDiagnosisName?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const diagnosesData = diagnoses.map((d, index) => ({
        session_id: sessionId,
        diagnosis_name: d.name,
        icd_code: d.icdCode || null,
        probability: d.probability,
        confidence_score: d.confidence,
        description: d.description || "",
        supporting_findings: d.supportingFindings || [],
        red_flags: d.redFlags || [],
        next_steps: d.nextSteps || [],
        display_order: index + 1,
        is_selected: d.name === selectedDiagnosisName,
      }));

      const { error: dbError } = await supabase
        .from("differential_diagnoses")
        .insert(diagnosesData);

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      console.error("Error saving diagnoses:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Save clinical report
  const saveReport = async (
    sessionId: string,
    primaryDiagnosis: string,
    reportData: {
      reportTitle?: string;
      soapNote?: any;
      educationalContent?: any;
      clinicalPearls?: string[];
      suggestedReferences?: string[];
      studentNotes?: string;
    }
  ): Promise<ClinicalReport | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("clinical_reports")
        .insert({
          session_id: sessionId,
          primary_diagnosis: primaryDiagnosis,
          report_title: reportData.reportTitle || `Clinical Report - ${primaryDiagnosis}`,
          soap_note: reportData.soapNote || {},
          educational_content: reportData.educationalContent || {},
          clinical_pearls: reportData.clinicalPearls || [],
          suggested_references: reportData.suggestedReferences || [],
          student_notes: reportData.studentNotes || "",
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Update session status to completed
      await supabase
        .from("analysis_sessions")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", sessionId);

      return data;
    } catch (err: any) {
      console.error("Error saving report:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update student notes on existing report
  const updateStudentNotes = async (
    reportId: string,
    studentNotes: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from("clinical_reports")
        .update({ student_notes: studentNotes })
        .eq("id", reportId);

      if (dbError) throw dbError;
      return true;
    } catch (err: any) {
      console.error("Error updating notes:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get session with all related data
  const getFullSession = async (sessionId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get session
      const { data: session, error: sessionError } = await supabase
        .from("analysis_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Get symptoms
      const { data: symptoms } = await supabase
        .from("session_symptoms")
        .select("*")
        .eq("session_id", sessionId);

      // Get steps
      const { data: steps } = await supabase
        .from("session_steps")
        .select("*")
        .eq("session_id", sessionId)
        .order("step_number");

      // Get diagnoses
      const { data: diagnoses } = await supabase
        .from("differential_diagnoses")
        .select("*")
        .eq("session_id", sessionId)
        .order("display_order");

      // Get report
      const { data: report } = await supabase
        .from("clinical_reports")
        .select("*")
        .eq("session_id", sessionId)
        .single();

      return {
        session,
        symptoms: symptoms || [],
        steps: steps || [],
        diagnoses: diagnoses || [],
        report,
      };
    } catch (err: any) {
      console.error("Error fetching session:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get student's recent sessions
  const getRecentSessions = async (limit: number = 10) => {
    if (!user) return [];

    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from("analysis_sessions")
        .select(`
          *,
          clinical_reports (id, primary_diagnosis),
          submissions (id, status)
        `)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (dbError) throw dbError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching sessions:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSession,
    saveSymptoms,
    saveStep,
    saveDiagnoses,
    saveReport,
    updateStudentNotes,
    getFullSession,
    getRecentSessions,
  };
}