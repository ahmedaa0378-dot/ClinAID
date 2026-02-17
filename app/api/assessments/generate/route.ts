import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      courseId,
      title,
      type,
      numQuestions,
      difficulty,
      topics,
    } = body;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    // Fetch course details
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Fetch lessons for more context
    const { data: lessons } = await supabase
      .from("lessons")
      .select("title, key_points")
      .eq("course_id", courseId);

    const lessonTopics = lessons?.map(l => l.title).join(", ") || "";
    const keyPoints = lessons?.flatMap(l => l.key_points || []).join(", ") || "";

    console.log("Generating assessment for course:", course.title);

    const prompt = `Generate ${numQuestions || 10} ${type || "exam"} questions for a medical assessment.

COURSE: ${course.title}
SPECIALTY: ${course.specialty || "Medicine"}
DIFFICULTY: ${difficulty || "intermediate"}
TOPICS COVERED: ${lessonTopics}
KEY CONCEPTS: ${keyPoints}
${topics ? `FOCUS ON: ${topics}` : ""}

Return JSON with this exact structure:
{
  "questions": [
    {
      "question_text": "Clear, specific medical question?",
      "question_type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Detailed explanation of why this is correct",
      "points": 10
    }
  ]
}

REQUIREMENTS:
1. Generate exactly ${numQuestions || 10} questions
2. Mix of difficulty levels appropriate for ${difficulty || "intermediate"}
3. Questions should test clinical reasoning, not just memorization
4. Include case-based scenarios where appropriate
5. Each question must have exactly 4 options for multiple choice
6. Provide detailed explanations for learning
7. Return ONLY valid JSON`;

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
            content: "You are a medical education expert creating assessment questions. Return only valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", errorText);
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    let questionsData;
    try {
      questionsData = JSON.parse(content.trim());
      console.log("Generated", questionsData.questions?.length, "questions");
    } catch (e) {
      console.error("JSON parse error:", e);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      questions: questionsData.questions || [],
      courseTitle: course.title,
    });

  } catch (error: any) {
    console.error("Assessment generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}