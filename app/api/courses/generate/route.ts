import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const courseName = formData.get("courseName") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const fileName = file.name;
    const courseTopic = courseName || fileName.replace(/\.pdf$/i, "").replace(/_/g, " ");

    console.log("Generating course for:", courseTopic);

    const courseStructure = await generateCourseWithAI(courseTopic);

    return NextResponse.json({
      success: true,
      course: courseStructure,
      pdfName: fileName,
    });
  } catch (error: any) {
    console.error("Course generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate course" },
      { status: 500 }
    );
  }
}

async function generateCourseWithAI(courseTopic: string): Promise<any> {
  const prompt = `Create a medical course structure for: "${courseTopic}"

Return a JSON object with this EXACT structure (no markdown, no code blocks, just raw JSON):

{
  "title": "${courseTopic}",
  "code": "MED-101",
  "description": "Course description here",
  "image": "🫀",
  "duration_weeks": 10,
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "modules": [
    {
      "title": "Module 1: Introduction",
      "description": "Module overview",
      "lessons": [
        {
          "title": "Lesson 1.1",
          "description": "Lesson description",
          "duration_minutes": 30,
          "content_markdown": "## Lesson Content\\n\\nDetailed content here with multiple paragraphs.\\n\\n### Key Topics\\n\\n- Topic 1\\n- Topic 2\\n\\n### Clinical Notes\\n\\nImportant clinical information.",
          "key_points": ["Point 1", "Point 2", "Point 3"],
          "quiz_questions": [
            {
              "question": "Sample question?",
              "options": ["Answer A", "Answer B", "Answer C", "Answer D"],
              "correct_answer": 0,
              "explanation": "Explanation here"
            }
          ]
        }
      ]
    }
  ]
}

REQUIREMENTS:
- Create exactly 4 modules
- Each module has exactly 3 lessons
- Each lesson has content_markdown (200+ words), 3 key_points, and 1 quiz question
- Make it medically accurate for "${courseTopic}"
- Return ONLY the JSON object, nothing else`;

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
          content: "You are a medical education expert. Return only valid JSON, no markdown formatting, no code blocks, no explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 6000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI API error:", errorText);
    throw new Error("Failed to generate course from AI");
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || "";

  console.log("AI Response length:", content.length);

  try {
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/```json\s*\n?/g, "").replace(/```\s*$/g, "").trim();
    }
    const parsed = JSON.parse(jsonStr);
    console.log("Successfully parsed course:", parsed.title);
    return parsed;
  } catch (e) {
    console.error("JSON parse error:", e);
    console.error("Raw content:", content.substring(0, 500));
    throw new Error("Failed to parse course structure");
  }
}