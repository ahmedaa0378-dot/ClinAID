// src/services/aiRecommendation.ts
// Frontend service for AI-powered CI approach recommendations
// Calls Supabase Edge Function → OpenAI/Claude → returns structured recommendation

export interface AIRecommendation {
  approach: string;
  confidence: number;
  reasoning: string;
  alternativeApproach: string;
  alternativeReasoning: string;
  keyConsiderations: string[];
  estimatedComplexity: 'low' | 'medium' | 'high';
  estimatedDuration: string;
}

export interface IdeaData {
  category: string;
  site: string;
  department: string;
  problemStatement: string;
  currentState?: string;
  proposedSolution: string;
  desiredState?: string;
  estimatedHoursSaved?: number;
  estimatedSavings?: number;
  qualityImprovement?: string;
  safetyImprovement?: string;
}

// ============================================
// Get Supabase URL from env or default
// ============================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// ============================================
// Call AI Recommendation Edge Function
// ============================================
export async function getAIRecommendation(data: IdeaData): Promise<AIRecommendation> {
  // If Supabase is not configured, use mock
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured — using mock AI recommendation');
    return getMockRecommendation(data);
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('AI Edge Function error:', response.status, errorBody);
      throw new Error(`AI service error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.recommendation) {
      throw new Error(result.error || 'Invalid AI response');
    }

    return result.recommendation as AIRecommendation;

  } catch (error) {
    console.error('AI recommendation failed, falling back to mock:', error);
    return getMockRecommendation(data);
  }
}

// ============================================
// Mock AI Recommendation (Fallback)
// Enhanced rule-based engine for demo/offline use
// ============================================
export function getMockRecommendation(data: IdeaData): AIRecommendation {
  const problem = (data.problemStatement || '').toLowerCase();
  const solution = (data.proposedSolution || '').toLowerCase();
  const combined = `${problem} ${solution}`;
  const category = (data.category || '').toLowerCase();

  // Scoring system — each approach gets points
  const scores: Record<string, number> = {
    'Kaizen': 0,
    'DMAIC': 0,
    'PDCA': 0,
    '5S': 0,
    '5 Whys': 0,
    'A3 Problem Solving': 0,
    'Value Stream Mapping': 0,
    'FMEA': 0,
    'Poka-Yoke': 0,
    'SMED': 0,
    'TPM': 0,
  };

  // Category signals
  if (category.includes('quality')) { scores['DMAIC'] += 3; scores['Poka-Yoke'] += 2; scores['FMEA'] += 1; }
  if (category.includes('safety')) { scores['A3 Problem Solving'] += 3; scores['FMEA'] += 2; scores['Poka-Yoke'] += 2; }
  if (category.includes('productivity')) { scores['Kaizen'] += 2; scores['SMED'] += 2; scores['Value Stream Mapping'] += 1; }
  if (category.includes('cost')) { scores['DMAIC'] += 2; scores['Value Stream Mapping'] += 2; scores['Kaizen'] += 1; }
  if (category.includes('delivery')) { scores['Value Stream Mapping'] += 3; scores['Kaizen'] += 2; scores['5S'] += 1; }
  if (category.includes('equipment') || category.includes('maintenance')) { scores['TPM'] += 4; scores['FMEA'] += 1; }
  if (category.includes('energy') || category.includes('sustain')) { scores['Kaizen'] += 2; scores['PDCA'] += 2; }
  if (category.includes('workplace') || category.includes('organization')) { scores['5S'] += 4; scores['Kaizen'] += 1; }

  // Keyword signals
  const keywordMap: Record<string, Record<string, number>> = {
    'scrap|defect|reject|out.of.spec|cpk|variation|sigma|quality escape': { 'DMAIC': 4, 'Poka-Yoke': 2 },
    'changeover|setup time|die change|tooling change': { 'SMED': 5 },
    'breakdown|downtime|unplanned|preventive|predictive|vibration|sensor': { 'TPM': 4 },
    'error.proof|mistake|human error|operator error|mislabel|wrong part': { 'Poka-Yoke': 5 },
    'organiz|clutter|search|shadow board|label|floor marking|5s': { '5S': 4 },
    'lead time|cycle time|bottleneck|flow|waste|value stream|end.to.end': { 'Value Stream Mapping': 4 },
    'risk|failure mode|fmea|severity|occurrence|detection': { 'FMEA': 5 },
    'root cause|why|investigation|understand|unknown cause': { '5 Whys': 3, 'A3 Problem Solving': 2 },
    'cross.functional|stakeholder|alignment|communication|complex problem': { 'A3 Problem Solving': 4 },
    'pilot|test|experiment|validate|hypothesis|try': { 'PDCA': 3 },
    'statistical|data.driven|measure|analyze|control chart|spc': { 'DMAIC': 3 },
    'quick win|simple|straightforward|easy|implement immediately': { 'Kaizen': 3 },
    'ergonomic|workstation|posture|strain|injury|safety hazard': { 'A3 Problem Solving': 3, 'Kaizen': 2 },
    'inventory|kanban|stock|reorder|supply': { 'Kaizen': 3, 'Value Stream Mapping': 2 },
    'visual|management|andon|board|indicator': { '5S': 3, 'Kaizen': 2 },
    'calibrat|torque|tolerance|precision|accuracy': { 'DMAIC': 3, 'PDCA': 2 },
    'automat|sensor|camera|barcode|verification': { 'Poka-Yoke': 3, 'TPM': 1 },
    'energy|waste|packaging|environmental|carbon|consumption': { 'Kaizen': 2, 'PDCA': 2 },
    'supplier|vendor|consolidat|sourcing|procurement': { 'DMAIC': 3, 'A3 Problem Solving': 2 },
  };

  for (const [pattern, approachScores] of Object.entries(keywordMap)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(combined)) {
      for (const [approach, score] of Object.entries(approachScores)) {
        scores[approach] += score;
      }
    }
  }

  // Complexity signals boost complex approaches
  const savings = data.estimatedSavings || 0;
  if (savings > 100000) { scores['DMAIC'] += 2; scores['Value Stream Mapping'] += 1; }
  if (savings < 30000) { scores['Kaizen'] += 2; scores['PDCA'] += 1; }

  // Get top 2
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topApproach = sorted[0][0];
  const topScore = sorted[0][1];
  const altApproach = sorted[1][0];
  const maxPossible = Math.max(topScore, 1);

  // Generate reasoning
  const reasoningMap: Record<string, string> = {
    'Kaizen': `This improvement is well-suited for a Kaizen approach — it's a focused, actionable change that the team can implement relatively quickly. The problem scope is contained and the proposed solution is clear, making this ideal for a rapid improvement cycle rather than a lengthy analytical project.`,
    'DMAIC': `This problem shows signs of process variation and quality issues that require data-driven analysis. DMAIC provides the rigorous statistical framework needed to quantify the current state, validate root causes, and establish controls — ensuring the improvement is sustained long-term.`,
    'PDCA': `The proposed solution is promising but needs validation before full implementation. PDCA's iterative Plan-Do-Check-Act cycle allows the team to pilot the change on a small scale, measure results, and refine the approach before committing to a full rollout.`,
    '5S': `This is fundamentally a workplace organization challenge. 5S methodology directly addresses the clutter, searching, and lack of visual management described. It provides a structured framework to sort, organize, clean, standardize, and sustain the improvements.`,
    '5 Whys': `The root cause of this problem isn't immediately obvious from the symptoms described. A 5 Whys analysis will help the team drill down through the layers of causation to identify the true underlying issue before jumping to solutions.`,
    'A3 Problem Solving': `This problem involves multiple stakeholders and has cross-functional implications. A3 thinking provides a structured, visual framework that drives consensus while ensuring a thorough analysis. The one-page format keeps the team focused and aligned.`,
    'Value Stream Mapping': `This improvement opportunity spans multiple process steps and potentially multiple departments. VSM will help the team visualize the entire flow, identify waste and bottlenecks, and design a future state that eliminates non-value-added activities.`,
    'FMEA': `This situation involves potential failure modes that need systematic assessment. FMEA will help the team identify what could go wrong, assess severity and likelihood, and prioritize preventive actions — ensuring the most critical risks are addressed first.`,
    'Poka-Yoke': `The core issue here is human error in a repetitive process. Error-proofing (Poka-Yoke) directly addresses this by designing mechanisms that either prevent mistakes from happening or immediately detect them when they do — eliminating reliance on operator vigilance.`,
    'SMED': `This is a changeover/setup time problem — exactly what SMED was designed for. By separating internal and external setup activities, converting internal to external where possible, and streamlining remaining steps, significant time reductions are achievable.`,
    'TPM': `Equipment reliability is at the core of this problem. TPM provides a comprehensive framework to move from reactive to preventive and predictive maintenance, involving operators in basic equipment care and establishing systematic maintenance practices.`,
  };

  const complexity = savings > 100000 ? 'high' : savings > 40000 ? 'medium' : 'low';
  const duration = complexity === 'high' ? '8-12 weeks' : complexity === 'medium' ? '4-8 weeks' : '2-4 weeks';
  const confidence = Math.min(0.95, 0.5 + (topScore / (maxPossible + 5)) * 0.45);

  // Generate tips
  const tipsMap: Record<string, string[]> = {
    'Kaizen': ['Form a small cross-functional team (4-6 people) for a focused Kaizen event', 'Set a clear 2-5 day timeline for implementation', 'Document before/after measurements to validate impact'],
    'DMAIC': ['Start with a clear project charter defining scope, goals, and timeline', 'Invest time in the Measure phase — good data drives good decisions', 'Plan control mechanisms early to sustain the improvement'],
    'PDCA': ['Keep the initial pilot scope small and measurable', 'Define success criteria before starting the Do phase', 'Build in a structured Check phase with specific metrics'],
    '5S': ['Take before photos to document starting condition', 'Involve the people who work in the area daily', 'Create visual standards so anyone can spot when things drift'],
    '5 Whys': ['Involve people closest to the problem in the analysis', 'Don\'t accept vague answers — each "why" should be specific and verifiable', 'Validate the root cause with data before implementing countermeasures'],
    'A3 Problem Solving': ['Fill out the left side (problem analysis) before jumping to solutions', 'Get stakeholder input during the process, not just at the end', 'Use the A3 as a living document that evolves as understanding deepens'],
    'Value Stream Mapping': ['Walk the actual process before drawing the map', 'Include both material and information flows', 'Focus the future state on eliminating the top 2-3 wastes identified'],
    'FMEA': ['Ensure cross-functional participation for comprehensive risk identification', 'Be specific about failure modes — vague descriptions lead to vague actions', 'Prioritize actions on highest RPN scores first'],
    'Poka-Yoke': ['Design for prevention first (make errors impossible), detection second', 'Test the error-proofing mechanism under real operating conditions', 'Consider both the normal and edge-case scenarios operators encounter'],
    'SMED': ['Video the current changeover to identify internal vs external activities', 'Focus first on converting internal to external activities — biggest time savings', 'Standardize and practice the new changeover procedure'],
    'TPM': ['Start with equipment cleaning and inspection to identify deterioration', 'Train operators on basic maintenance tasks (autonomous maintenance)', 'Track OEE as the primary metric to measure improvement'],
  };

  return {
    approach: topApproach,
    confidence: Math.round(confidence * 100) / 100,
    reasoning: reasoningMap[topApproach] || `Based on the problem description and category, ${topApproach} is the recommended approach.`,
    alternativeApproach: altApproach,
    alternativeReasoning: `${altApproach} could also be effective here, especially if ${altApproach === 'PDCA' ? 'the solution needs piloting first' : altApproach === 'Kaizen' ? 'a rapid improvement event is preferred' : 'additional analytical rigor is needed'}.`,
    keyConsiderations: tipsMap[topApproach] || ['Form a cross-functional team', 'Define clear metrics', 'Document the improvement'],
    estimatedComplexity: complexity as 'low' | 'medium' | 'high',
    estimatedDuration: duration,
  };
}