import { useState, useRef } from "react";

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

  const cache = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const CACHE_TTL = 300000; // 5 minutes

  const getCached = (key: string) => {
    const cached = cache.current.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    return null;
  };

  const setCache = (key: string, data: any) => {
    cache.current.set(key, { data, timestamp: Date.now() });
  };

  // Fetch symptoms for a body region
  const fetchSymptoms = async (
    regionName: string,
    regionDisplayName: string
  ): Promise<Symptom[]> => {
    const cacheKey = `symptoms-${regionName}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

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
      const result = data.symptoms || [];
      setCache(cacheKey, result);
      return result;
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
    const cacheKey = `questions-${regionName}-${symptoms.map((s) => s.id).join(",")}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

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
      const result = data.questions || [];
      setCache(cacheKey, result);
      return result;
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
    const cacheKey = `diagnosis-${regionName}-${symptoms.map((s) => s.id).join(",")}-${JSON.stringify(answers)}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

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

      const result = await response.json();
      setCache(cacheKey, result);
      return result;
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
