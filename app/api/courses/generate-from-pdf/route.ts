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
      pdfUrl,
      pdfName,
      title,
      specialty,
      difficulty,
      targetYear,
      tags,
      durationWeeks,
      studentId,
      libraryItemId,
    } = body;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    console.log("Generating course from PDF:", { title, pdfName, specialty });

    // Build comprehensive prompt based on PDF metadata
    const topicsList = tags?.length > 0 ? tags.join(", ") : "key concepts";

    const prompt = `Create a comprehensive medical course based on this PDF resource:

COURSE INFORMATION:
- Title: ${title}
- PDF Name: ${pdfName}
- Medical Specialty: ${specialty || "General Medicine"}
- Difficulty Level: ${difficulty || "intermediate"}
- Target Audience: ${targetYear || "Medical Student"}
- Duration: ${durationWeeks || 8} weeks
- Key Topics to Cover: ${topicsList}

This is a medical education PDF. Create a detailed, structured course that would comprehensively cover all aspects of "${title}".

Return a JSON object with this EXACT structure (no markdown, no code blocks, just raw JSON):

{
  "title": "${title} - Complete Course",
  "code": "${specialty?.substring(0, 3).toUpperCase() || 'MED'}-${Math.floor(Math.random() * 900) + 100}",
  "description": "Comprehensive course on ${title} covering pathophysiology, diagnosis, management, and clinical applications.",
  "image": "${getEmojiForSpecialty(specialty)}",
  "objectives": [
    "Understand the pathophysiology of ${title.toLowerCase()}",
    "Identify clinical presentations and diagnostic criteria",
    "Apply evidence-based management strategies",
    "Recognize complications and their management",
    "Demonstrate clinical reasoning in case scenarios"
  ],
  "modules": [
    {
      "title": "Module 1: Foundations & Pathophysiology",
      "description": "Understanding the basic science behind ${title.toLowerCase()}",
      "lessons": [
        {
          "title": "Introduction to ${title}",
          "description": "Overview and epidemiology",
          "duration_minutes": 35,
          "content_markdown": "## Introduction to ${title}\\n\\nDetailed content about the condition, its prevalence, and clinical significance...\\n\\n### Epidemiology\\n\\n- Key statistics and risk factors\\n- Population affected\\n\\n### Clinical Significance\\n\\nWhy this topic matters in clinical practice...",
          "key_points": [
            "Key point about definition and scope",
            "Key point about epidemiology",
            "Key point about clinical relevance"
          ],
          "quiz_questions": [
            {
              "question": "Clinical question about ${title}?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correct_answer": 0,
              "explanation": "Detailed explanation of the correct answer"
            }
          ]
        }
      ]
    }
  ]
}

REQUIREMENTS:
1. Create exactly 4 modules covering: Foundations, Clinical Features, Diagnosis & Management, Special Considerations
2. Each module should have 3-4 lessons
3. Each lesson must have detailed content_markdown (250+ words), 3 key_points, and 1-2 quiz questions
4. Make content clinically accurate and evidence-based for ${specialty || "medicine"}
5. Tailor complexity to ${difficulty || "intermediate"} level
6. Include practical clinical pearls and case-based learning
7. Focus on ${topicsList}
8. Return ONLY valid JSON`;

    // Call OpenAI API
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
            content: `You are an expert medical educator creating structured courses from PDF resources. You specialize in ${specialty || "medicine"}. Return only valid JSON, no markdown formatting or code blocks.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 8000,
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

    // Parse JSON
    let courseStructure;
    try {
      courseStructure = JSON.parse(content.trim());
      console.log("Successfully parsed course:", courseStructure.title);
    } catch (e) {
      console.error("JSON parse error:", e);
      throw new Error("Failed to parse course structure");
    }

    // Calculate total lessons
    let totalLessons = 0;
    courseStructure.modules?.forEach((module: any) => {
      totalLessons += module.lessons?.length || 0;
    });

    // Save course to database
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .insert({
        professor_id: null,
        title: courseStructure.title,
        code: courseStructure.code,
        description: courseStructure.description,
        image: courseStructure.image || "📚",
        objectives: courseStructure.objectives || [],
        modules: courseStructure.modules || [],
        duration_weeks: durationWeeks || 8,
        total_lessons: totalLessons,
        status: "active",
        is_public: false,
        difficulty: difficulty || "intermediate",
        specialty: specialty,
        target_year: targetYear,
        tags: tags || [],
        source_pdf_name: pdfName,
      })
      .select()
      .single();

    if (courseError) {
      console.error("Course insert error:", courseError);
      throw new Error("Failed to save course");
    }

    // Insert lessons
    let lessonIndex = 0;
    for (const module of courseStructure.modules || []) {
      for (const lesson of module.lessons || []) {
        await supabase.from("lessons").insert({
          course_id: courseData.id,
          title: lesson.title,
          description: lesson.description,
          content_markdown: lesson.content_markdown,
          duration_minutes: lesson.duration_minutes || 30,
          key_points: lesson.key_points || [],
          quiz_questions: lesson.quiz_questions || [],
          order_index: lessonIndex++,
        });
      }
    }

    // Auto-enroll student
    await supabase.from("course_enrollments").insert({
      course_id: courseData.id,
      student_id: studentId,
      progress_percent: 0,
    });

    return NextResponse.json({
      success: true,
      courseId: courseData.id,
      course: courseStructure,
      totalLessons,
    });
  } catch (error: any) {
    console.error("Course generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate course" },
      { status: 500 }
    );
  }
}

function getEmojiForSpecialty(specialty: string): string {
  const emojiMap: Record<string, string> = {
    "Cardiology": "🫀",
    "Nephrology": "🫘",
    "Pulmonology": "🌬️",
    "Endocrinology": "💉",
    "Pharmacology": "💊",
    "Critical Care": "🏥",
    "Neurology": "🧠",
    "Pediatrics": "👶",
    "Emergency Medicine": "🚑",
    "Surgery": "🔪",
    "Infectious Disease": "🦠",
    "Oncology": "🎗️",
    "Psychiatry": "🧠",
  };
  return emojiMap[specialty] || "📚";
}