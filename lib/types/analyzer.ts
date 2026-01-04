export type RegionLevel = 'system' | 'area' | 'structure' | 'component';

export interface BodyRegion {
  id: string;
  name: string;
  display_name: string;
  parent_id: string | null;
  level: RegionLevel;
  description: string;
  medical_term?: string;
  svg_path_id?: string;
  display_order: number;
}

export interface AnalysisSession {
  id: string;
  student_id: string;
  status: 'in_progress' | 'completed' | 'submitted';
  initial_body_region_id?: string;
  initial_complaint?: string;
  started_at: string;
  completed_at?: string;
}

export interface SessionStep {
  id: string;
  session_id: string;
  step_number: number;
  step_type: string;
  question_text: string;
  question_explanation?: string;
  options_presented: Array<{
    id: string;
    text: string;
    description?: string;
  }>;
  selected_option_id?: string;
  selected_option_text?: string;
}

export interface DifferentialDiagnosis {
  id: string;
  diagnosis_name: string;
  probability: 'high' | 'moderate' | 'low';
  confidence_score: number;
  supporting_findings: string[];
  brief_description: string;
  red_flags?: string[];
}
