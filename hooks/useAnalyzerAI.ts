import { useState } from "react";

export interface Symptom {
  id: string;
  name: string;
  description: string;
  isRedFlag: boolean;
  category?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  clinicalSignificance: string;
}

export interface Question {
  id: string;
  question: string;
  clinicalRationale: string;
  options: QuestionOption[];
}

export interface Diagnosis {
  name: string;
  icdCode: string;
  probability: "high" | "moderate" | "low";
  confidence: number;
  description: string;
  supportingFindings: string[];
  contradictingFindings: string[];
  redFlags: string[];
  nextSteps: string[];
}

export interface DiagnosisResponse {
  diagnoses: Diagnosis[];
  clinicalPearl: string;
  urgencyLevel: "routine" | "urgent" | "emergent";
  recommendedWorkup: string[];
}

export function useAnalyzerAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch symptoms for a body region
  const fetchSymptoms = async (
    regionName: string,
    regionDisplayName: string
  ): Promise<Symptom[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_symptoms",
          regionName,
          regionDisplayName,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch symptoms");

      const data = await response.json();
      return data.symptoms || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch follow-up questions
  const fetchQuestions = async (
    regionName: string,
    symptoms: Array<{ id: string; name: string; isRedFlag: boolean }>,
    studentLevel?: string
  ): Promise<Question[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_questions",
          regionName,
          symptoms,
          studentLevel,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      return data.questions || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch differential diagnosis
  const fetchDiagnosis = async (
    regionName: string,
    symptoms: Array<{ id: string; name: string; isRedFlag: boolean }>,
    answers: Record<string, string>,
    studentLevel?: string
  ): Promise<DiagnosisResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_diagnosis",
          regionName,
          symptoms,
          answers,
          studentLevel,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch diagnosis");

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchSymptoms,
    fetchQuestions,
    fetchDiagnosis,
  };
}