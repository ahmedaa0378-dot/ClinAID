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

    console.log("=== Generate from PDF API ===");
    console.log("Input:", { title, pdfName, specialty, studentId });

    if (!OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Build prompt
    const topicsList = tags?.length > 0 ? tags.join(", ") : "key concepts";
    
    const prompt = `Create a comprehensive medical course on "${title}".

COURSE DETAILS:
- Specialty: ${specialty || "General Medicine"}
- Difficulty: ${difficulty || "intermediate"}
- Target: ${targetYear || "Medical Student"}
- Duration: ${durationWeeks || 8} weeks
- Topics: ${topicsList}

Return JSON with this structure:
{
  "title": "${title} - Complete Course",
  "code": "MED-101",
  "description": "Course description here",
  "image": "🫘",
  "objectives": ["Objective 1", "Objective 2", "Objective 3", "Objective 4"],
  "modules": [
    {
      "title": "Module 1: Introduction",
      "description": "Module overview",
      "lessons": [
        {
          "title": "Lesson 1.1",
          "description": "Lesson description",
          "duration_minutes": 30,
          "content_markdown": "## Lesson Content\\n\\nDetailed content here...",
          "key_points": ["Point 1", "Point 2", "Point 3"],
          "quiz_questions": [
            {
              "question": "Sample question?",
              "options": ["A", "B", "C", "D"],
              "correct_answer": 0,
              "explanation": "Explanation here"
            }
          ]
        }
      ]
    }
  ]
}

Create 4 modules with 3 lessons each. Return ONLY valid JSON.`;

    console.log("Calling OpenAI...");

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
            content: "You are a medical educator. Return only valid JSON, no markdown or code blocks.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 6000,
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
    
    console.log("OpenAI response length:", content.length);

    let courseStructure;
    try {
      courseStructure = JSON.parse(content.trim());
      console.log("Parsed course:", courseStructure.title);
    } catch (e) {
      console.error("JSON parse error:", e);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    // Count lessons
    let totalLessons = 0;
    courseStructure.modules?.forEach((m: any) => {
      totalLessons += m.lessons?.length || 0;
    });

    console.log("Saving course to database...");

    // Save course - simplified insert
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .insert({
        title: courseStructure.title || title,
        code: courseStructure.code || "MED-101",
        description: courseStructure.description || "",
        image: courseStructure.image || "📚",
        objectives: courseStructure.objectives || [],
        modules: courseStructure.modules || [],
        duration_weeks: durationWeeks || 8,
        total_lessons: totalLessons,
        status: "active",
        is_public: false,
        difficulty: difficulty || "intermediate",
        specialty: specialty || null,
        target_year: targetYear || null,
        tags: tags || [],
      })
      .select()
      .single();

    if (courseError) {
      console.error("Course insert error:", courseError);
      return NextResponse.json({ 
        error: "Database error: " + courseError.message 
      }, { status: 500 });
    }

    console.log("Course saved with ID:", courseData.id);

    // Insert lessons
    let lessonIndex = 0;
    for (const module of courseStructure.modules || []) {
      for (const lesson of module.lessons || []) {
        const { error: lessonError } = await supabase.from("lessons").insert({
          course_id: courseData.id,
          title: lesson.title,
          description: lesson.description || "",
          content_markdown: lesson.content_markdown || "",
          duration_minutes: lesson.duration_minutes || 30,
          key_points: lesson.key_points || [],
          quiz_questions: lesson.quiz_questions || [],
          order_index: lessonIndex++,
        });

        if (lessonError) {
          console.error("Lesson insert error:", lessonError);
        }
      }
    }

    console.log("Inserted", lessonIndex, "lessons");

    // Enroll student
    const { error: enrollError } = await supabase.from("course_enrollments").insert({
      course_id: courseData.id,
      student_id: studentId,
      progress_percent: 0,
    });

    if (enrollError) {
      console.error("Enrollment error:", enrollError);
    } else {
      console.log("Student enrolled successfully");
    }

    return NextResponse.json({
      success: true,
      courseId: courseData.id,
      course: courseStructure,
      totalLessons,
    });

  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}