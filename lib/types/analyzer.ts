// Body Region Types
export interface BodyRegion {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  svgPath?: string;
}

// Symptom Types
export interface Symptom {
  id: string;
  name: string;
  description?: string;
  isRedFlag?: boolean;
  bodyRegionId?: string;
}

// Session Symptom (from database)
export interface SessionSymptom {
  id: string;
  session_id: string;
  symptom_id?: string;
  symptom_name: string;
  symptom_description?: string;
  is_red_flag: boolean;
  reported_at?: string;
}

// Differential Diagnosis Types (Database Schema)
export interface DifferentialDiagnosis {
  id: string;
  session_id?: string;
  diagnosis_name: string;
  diagnosis_code?: string;
  icd_code?: string;
  probability: "high" | "moderate" | "low";
  confidence_score: number;
  description?: string;
  brief_description?: string;
  supporting_findings: string[];
  contradicting_findings?: string[];
  red_flags?: string[];
  next_steps?: string[];
  diagnostic_criteria?: string;
  typical_presentation?: string;
  guideline_source?: string;
  display_order?: number;
  is_selected?: boolean;
  created_at?: string;
}

// Frontend Differential Diagnosis (for AI responses)
export interface FrontendDifferentialDiagnosis {
  id: string;
  name: string;
  icdCode?: string;
  probability: "high" | "moderate" | "low";
  confidence: number;
  description: string;
  supportingFindings: string[];
  contradictingFindings?: string[];
  redFlags?: string[];
  nextSteps?: string[];
  isSelected?: boolean;
}

// Analysis Session Types
export interface AnalysisSession {
  id: string;
  student_id: string;
  student_level: string;
  body_region?: string;
  body_region_display_name?: string;
  initial_complaint?: string;
  status: "in_progress" | "completed" | "submitted" | "reviewed";
  started_at: string;
  completed_at?: string;
  total_steps: number;
  time_spent_seconds: number;
  created_at?: string;
  updated_at?: string;
}

// Session Step Types
export interface SessionStep {
  id: string;
  session_id: string;
  step_number: number;
  question_text: string;
  question_rationale?: string;
  options_presented?: QuestionOption[];
  selected_option_id?: string;
  selected_option_text?: string;
  is_custom_response: boolean;
  ai_model_used?: string;
  answered_at?: string;
}

// Question Option Types
export interface QuestionOption {
  id: string;
  text: string;
  isRedFlag?: boolean;
}

// Clinical Report Types
export interface ClinicalReport {
  id: string;
  session_id: string;
  report_title?: string;
  primary_diagnosis: string;
  soap_note?: SOAPNote;
  educational_content?: EducationalContent;
  clinical_pearls?: string[];
  suggested_references?: string[];
  student_notes?: string;
  ai_disclaimer?: string;
  created_at?: string;
  updated_at?: string;
}

// SOAP Note Types
export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

// Educational Content Types
export interface EducationalContent {
  pathophysiology?: string;
  epidemiology?: string;
  riskFactors?: string[];
  clinicalPresentation?: string;
  diagnosticCriteria?: string[];
  differentialDiagnosis?: string[];
  treatment?: {
    firstLine?: string;
    alternatives?: string;
    supportive?: string;
  };
  complications?: string[];
  prognosis?: string;
  clinicalPearls?: string[];
  suggestedReferences?: string[];
}

// Submission Types
export interface Submission {
  id: string;
  report_id: string;
  student_id: string;
  professor_id: string;
  student_notes?: string;
  status: "pending" | "in_review" | "approved" | "revision_requested" | "rejected";
  submitted_at: string;
  reviewed_at?: string;
  created_at?: string;
}

// Submission Feedback Types
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
  strengths?: string[];
  areas_for_improvement?: string[];
  additional_resources?: string[];
  created_at?: string;
  updated_at?: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  professor_id: string;
  college_id?: string;
  title: string;
  description?: string;
  topic?: string;
  difficulty_level: "easy" | "medium" | "hard";
  time_limit_minutes?: number;
  passing_score: number;
  is_ai_generated: boolean;
  ai_prompt_used?: string;
  is_published: boolean;
  total_questions: number;
  created_at?: string;
  updated_at?: string;
}

// Quiz Question Types
export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_number: number;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "short_answer";
  options?: QuestionOption[];
  correct_answer: string;
  explanation?: string;
  points: number;
  clinical_relevance?: string;
  created_at?: string;
}

// Quiz Assignment Types
export interface QuizAssignment {
  id: string;
  quiz_id: string;
  student_id: string;
  assigned_by: string;
  due_date?: string;
  status: "assigned" | "in_progress" | "completed" | "expired";
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
}

// Quiz Result Types
export interface QuizResult {
  id: string;
  assignment_id: string;
  student_id: string;
  quiz_id: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score_percentage: number;
  passed: boolean;
  time_taken_seconds?: number;
  professor_feedback?: string;
  completed_at: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  entity_type?: string;
  entity_id?: string;
  action_url?: string;
  is_read: boolean;
  is_email_sent: boolean;
  created_at: string;
}

// AI Response Types
export interface AISymptomResponse {
  symptoms: Symptom[];
  isAIGenerated: boolean;
}

export interface AIQuestionResponse {
  question: string;
  rationale: string;
  options: QuestionOption[];
  isComplete: boolean;
}

export interface AIDiagnosisResponse {
  diagnoses: DifferentialDiagnosis[];
  primaryDiagnosis: string;
  confidence: number;
}