import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a medical education AI. Generate realistic symptoms for the specified body region.
Return ONLY valid JSON with this structure:
{
  "symptoms": [
    {
      "id": "unique_id",
      "name": "Symptom Name",
      "description": "Brief description",
      "isRedFlag": boolean,
      "category": "category"
    }
  ]
}
Include 8-10 symptoms. Mark dangerous symptoms as isRedFlag: true.`
      },
      {
        role: "user",
        content: `Generate symptoms for: ${regionDisplayName} (${regionName})`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

// Get follow-up questions
async function getQuestions(
  regionName: string,
  symptoms: Array<{ id: string; name: string; isRedFlag: boolean }>,
  studentLevel?: string
) {
  const symptomList = symptoms.map((s) => s.name).join(", ");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a medical education AI teaching clinical reasoning.
Return ONLY valid JSON with this structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "clinicalRationale": "Why this matters",
      "options": [
        { "id": "q1_a", "text": "Option", "clinicalSignificance": "What it means" }
      ]
    }
  ]
}
Generate exactly 5 questions with 4 options each.`
      },
      {
        role: "user",
        content: `Patient with ${regionName} symptoms: ${symptomList}. Generate clinical assessment questions.`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

// Get differential diagnosis
async function getDiagnosis(
  regionName: string,
  symptoms: Array<{ id: string; name: string; isRedFlag: boolean }>,
  answers: Record<string, string>,
  studentLevel?: string
) {
  const symptomList = symptoms.map((s) => `${s.name}${s.isRedFlag ? " (RED FLAG)" : ""}`).join(", ");
  const answersText = Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a medical education AI providing differential diagnoses.
Return ONLY valid JSON with this structure:
{
  "diagnoses": [
    {
      "name": "Diagnosis Name",
      "icdCode": "ICD-10",
      "probability": "high" | "moderate" | "low",
      "confidence": 0.0-1.0,
      "description": "Brief description",
      "supportingFindings": ["finding1"],
      "contradictingFindings": ["finding1"],
      "redFlags": ["warning1"],
      "nextSteps": ["step1"]
    }
  ],
  "clinicalPearl": "Educational insight",
  "urgencyLevel": "routine" | "urgent" | "emergent",
  "recommendedWorkup": ["test1"]
}
Provide 3-4 diagnoses ranked by probability.`
      },
      {
        role: "user",
        content: `Region: ${regionName}\nSymptoms: ${symptomList}\nHistory:\n${answersText}\n\nGenerate differential diagnoses.`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}