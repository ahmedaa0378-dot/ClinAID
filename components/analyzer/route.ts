import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types
interface SymptomRequest {
  action: "get_symptoms" | "get_questions" | "get_diagnosis";
  regionName: string;
  regionDisplayName?: string;
  symptoms?: Array<{ id: string; name: string; isRedFlag: boolean }>;
  answers?: Record<string, string>;
  studentLevel?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SymptomRequest = await request.json();
    const { action, regionName, regionDisplayName, symptoms, answers, studentLevel } = body;

    let result;

    switch (action) {
      case "get_symptoms":
        result = await getSymptoms(regionName, regionDisplayName || regionName);
        break;
      case "get_questions":
        result = await getQuestions(regionName, symptoms || [], studentLevel);
        break;
      case "get_diagnosis":
        result = await getDiagnosis(regionName, symptoms || [], answers || {}, studentLevel);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Analyzer API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Get symptoms for a body region
async function getSymptoms(regionName: string, regionDisplayName: string) {
  const systemPrompt = `You are a medical education AI assistant helping medical students learn clinical diagnosis. 
Generate realistic symptoms for the specified body region.

IMPORTANT: Respond ONLY with valid JSON, no markdown, no code blocks, no explanation.

Return a JSON object with this exact structure:
{
  "symptoms": [
    {
      "id": "unique_id",
      "name": "Symptom Name",
      "description": "Brief patient-friendly description",
      "isRedFlag": boolean,
      "category": "category name"
    }
  ]
}

Include 8-12 symptoms. Mark dangerous symptoms as red flags (isRedFlag: true).
Categories can be: "pain", "neurological", "respiratory", "gastrointestinal", "cardiovascular", "general", etc.`;

  const userMessage = `Generate common symptoms for the ${regionDisplayName} (${regionName}) body region. Include a mix of common and serious symptoms.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content || "{}";
  return JSON.parse(content);
}

// Get follow-up questions based on symptoms
async function getQuestions(
  regionName: string,
  symptoms: Array<{ id: string; name: string; isRedFlag: boolean }>,
  studentLevel?: string
) {
  const symptomList = symptoms.map((s) => s.name).join(", ");
  const hasRedFlags = symptoms.some((s) => s.isRedFlag);

  const systemPrompt = `You are a medical education AI assistant teaching clinical reasoning to ${studentLevel || "medical"} students.
Generate focused clinical questions to narrow down differential diagnoses.

IMPORTANT: Respond ONLY with valid JSON, no markdown, no code blocks.

Return a JSON object with this exact structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Clinical question text",
      "clinicalRationale": "Why this question matters for diagnosis",
      "options": [
        {
          "id": "q1_a",
          "text": "Answer option",
          "clinicalSignificance": "What this answer suggests clinically"
        }
      ]
    }
  ]
}

Generate exactly 5 questions. Each question should have 4 options.
Questions should follow logical clinical reasoning (history → characteristics → associated symptoms → risk factors → alleviating/aggravating factors).`;

  const userMessage = `Patient presenting with symptoms in the ${regionName} region.
Reported symptoms: ${symptomList}
${hasRedFlags ? "⚠️ Red flag symptoms are present - include urgent assessment questions." : ""}

Generate 5 clinical assessment questions to help narrow the differential diagnosis.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content || "{}";
  return JSON.parse(content);
}

// Get differential diagnosis based on symptoms and answers
async function getDiagnosis(
  regionName: string,
  symptoms: Array<{ id: string; name: string; isRedFlag: boolean }>,
  answers: Record<string, string>,
  studentLevel?: string
) {
  const symptomList = symptoms.map((s) => `${s.name}${s.isRedFlag ? " (RED FLAG)" : ""}`).join(", ");
  const answersText = Object.entries(answers)
    .map(([q, a]) => `${q}: ${a}`)
    .join("\n");

  const systemPrompt = `You are a medical education AI assistant providing differential diagnoses for ${studentLevel || "medical"} students.
Generate realistic differential diagnoses based on the clinical presentation.

IMPORTANT: Respond ONLY with valid JSON, no markdown, no code blocks.

Return a JSON object with this exact structure:
{
  "diagnoses": [
    {
      "name": "Diagnosis Name",
      "icdCode": "ICD-10 code",
      "probability": "high" | "moderate" | "low",
      "confidence": 0.0 to 1.0,
      "description": "Brief description of the condition",
      "supportingFindings": ["finding 1", "finding 2"],
      "contradictingFindings": ["finding that doesn't fit"],
      "redFlags": ["warning signs to watch for"],
      "nextSteps": ["recommended diagnostic steps"],
      "differentialConsiderations": "Why this diagnosis vs others"
    }
  ],
  "clinicalPearl": "Educational insight for the student",
  "urgencyLevel": "routine" | "urgent" | "emergent",
  "recommendedWorkup": ["test 1", "test 2"]
}

Provide 3-5 differential diagnoses ranked by probability. Be educational and explain clinical reasoning.`;

  const userMessage = `Clinical Presentation:
- Body Region: ${regionName}
- Symptoms: ${symptomList}

Clinical History Responses:
${answersText}

Generate a differential diagnosis list with clinical reasoning appropriate for medical education.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content || "{}";
  return JSON.parse(content);
}
