import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diagnosis, symptoms, region, studentLevel = "Medical Student" } = body;

    if (!diagnosis) {
      return NextResponse.json({ error: "Diagnosis is required" }, { status: 400 });
    }

    const symptomsList = symptoms?.map((s: any) => s.name).join(", ") || "Not specified";
    const redFlags = symptoms?.filter((s: any) => s.isRedFlag || s.is_red_flag).map((s: any) => s.name).join(", ") || "None";
    const diagnosisName = diagnosis.name || diagnosis.diagnosis_name || diagnosis.diagnosisName || "Unknown";
    const confidence = diagnosis.confidence || diagnosis.confidence_score || diagnosis.confidenceScore || 0;

    const prompt = `You are an expert medical educator creating a detailed clinical report for a ${studentLevel}.

## Case Information:
- **Body Region:** ${region || "Not specified"}
- **Reported Symptoms:** ${symptomsList}
- **Red Flag Symptoms:** ${redFlags}
- **Primary Diagnosis:** ${diagnosisName}
- **Confidence Level:** ${typeof confidence === 'number' && confidence <= 1 ? Math.round(confidence * 100) : confidence}%

## Generate a comprehensive clinical report with the following sections:

### 1. CLINICAL SUMMARY
Write a concise clinical summary of this case (2-3 sentences).

### 2. PATHOPHYSIOLOGY
Explain the underlying pathophysiology of ${diagnosisName} in detail. Include:
- Disease mechanism
- How it relates to the presenting symptoms
- Risk factors

### 3. DIFFERENTIAL DIAGNOSES
List 3-5 other conditions that should be considered with similar presentations. For each:
- Condition name
- Key distinguishing features
- Why it was ruled out or less likely

### 4. RECOMMENDED INVESTIGATIONS
Suggest appropriate diagnostic tests:
- **Immediate/Essential:** (list 2-3)
- **Supportive/Confirmatory:** (list 2-3)
- **To Rule Out Differentials:** (list 2-3)

### 5. TREATMENT APPROACH
Provide treatment recommendations:
- **Acute Management:** Immediate interventions
- **Pharmacological:** Medications with typical dosing
- **Non-Pharmacological:** Lifestyle modifications, supportive care
- **When to Escalate:** Red flags requiring urgent attention

### 6. PATIENT EDUCATION
Key points to discuss with the patient:
- What to expect
- Warning signs to watch for
- Self-care recommendations
- When to seek emergency care

### 7. FOLLOW-UP PLAN
- Recommended follow-up timeline
- Monitoring parameters
- Expected outcomes

### 8. CLINICAL PEARLS
3-5 key learning points for medical students about this condition.

### 9. REFERENCES
List 2-3 relevant clinical guidelines or key references.

Format the response in clean markdown with headers and bullet points.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert medical educator. Provide detailed, accurate, educational clinical reports. Always emphasize that this is for educational purposes and real patients should consult healthcare providers.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    }

    const data = await response.json();
    const reportContent = data.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      report: reportContent,
      metadata: {
        diagnosis: diagnosisName,
        confidence,
        region,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}