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
      topic,
      specialty,
      difficulty,
      targetYear,
      durationWeeks,
      keyDiseases,
      focusAreas,
      additionalNotes,
      tags,
      studentId,
    } = body;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    if (!topic && !specialty) {
      return NextResponse.json({ error: "Topic or specialty is required" }, { status: 400 });
    }

    console.log("Generating student course:", { topic, specialty, difficulty, targetYear });

    // Build the prompt
    const courseTopic = topic || `${specialty} Overview`;
    const diseasesList = keyDiseases?.length > 0 ? keyDiseases.join(", ") : "common conditions";
    const focusAreasText = focusAreas || "clinical applications and patient care";

    const prompt = `Create a comprehensive medical course for a ${targetYear || "medical"} student.

COURSE REQUIREMENTS:
- Topic: ${courseTopic}
- Medical Specialty: ${specialty || "General Medicine"}
- Difficulty Level: ${difficulty || "intermediate"}
- Target Audience: ${targetYear || "Medical Student"}
- Duration: ${durationWeeks || 8} weeks
- Key Diseases/Conditions to Cover: ${diseasesList}
- Focus Areas: ${focusAreasText}
${additionalNotes ? `- Additional Requirements: ${additionalNotes}` : ""}
${tags?.length > 0 ? `- Related Topics: ${tags.join(", ")}` : ""}

Return a JSON object with this EXACT structure (no markdown, no code blocks, just raw JSON):

{
  "title": "Course Title Here",
  "code": "MED-XXX",
  "description": "Comprehensive course description (2-3 sentences)",
  "image": "🫀",
  "objectives": [
    "Learning objective 1",
    "Learning objective 2",
    "Learning objective 3",
    "Learning objective 4",
    "Learning objective 5"
  ],
  "modules": [
    {
      "title": "Module 1: Introduction to [Topic]",
      "description": "Module overview",
      "lessons": [
        {
          "title": "Lesson 1.1: [Specific Topic]",
          "description": "Brief lesson description",
          "duration_minutes": 30,
          "content_markdown": "## Lesson Title\\n\\nDetailed educational content here with multiple paragraphs covering the topic thoroughly.\\n\\n### Key Concepts\\n\\n- Important concept 1 with explanation\\n- Important concept 2 with explanation\\n\\n### Clinical Application\\n\\nHow this applies in clinical practice...\\n\\n### Summary\\n\\nKey takeaways from this lesson.",
          "key_points": [
            "Key point 1 - concise and memorable",
            "Key point 2 - clinically relevant",
            "Key point 3 - actionable knowledge"
          ],
          "quiz_questions": [
            {
              "question": "Clinical scenario or knowledge question?",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correct_answer": 0,
              "explanation": "Detailed explanation of why this answer is correct and why others are wrong"
            }
          ]
        }
      ]
    }
  ]
}

IMPORTANT REQUIREMENTS:
1. Create exactly 4 modules that progress logically
2. Each module should have 3-4 lessons (total 12-16 lessons)
3. Each lesson content_markdown should be 200-300 words of educational content
4. Include clinical scenarios, case examples, and practical applications
5. Quiz questions should test understanding, not just memorization
6. Tailor complexity to ${difficulty || "intermediate"} level and ${targetYear || "medical student"}
7. Use appropriate medical emoji for the "image" field (🫀❤️🧠💊🩺🔬🧬🩻💉🏥👶🚑🦠)
8. Make content evidence-based and clinically accurate
9. Include ${diseasesList} in the curriculum
10. Return ONLY the JSON object, nothing else`;

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
            content: "You are an expert medical educator creating structured, evidence-based courses for medical students. Return only valid JSON, no markdown formatting, no code blocks, no explanations. Focus on clinical relevance and practical applications.",
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

    console.log("AI Response length:", content.length);

    // Parse the JSON response
    let courseStructure;
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/```json\s*\n?/g, "").replace(/```\s*$/g, "").trim();
      }
      courseStructure = JSON.parse(jsonStr);
      console.log("Successfully parsed course:", courseStructure.title);
    } catch (e) {
      console.error("JSON parse error:", e);
      console.error("Raw content:", content.substring(0, 500));
      throw new Error("Failed to parse course structure from AI");
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
        professor_id: null, // Student-generated course
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
        tags: keyDiseases || tags || [],
      })
      .select()
      .single();

    if (courseError) {
      console.error("Course insert error:", courseError);
      throw new Error("Failed to save course to database");
    }

    console.log("Course saved with ID:", courseData.id);

    // Insert lessons
    let lessonIndex = 0;
    for (const module of courseStructure.modules || []) {
      for (const lesson of module.lessons || []) {
        const { error: lessonError } = await supabase.from("lessons").insert({
          course_id: courseData.id,
          title: lesson.title,
          description: lesson.description,
          content_markdown: lesson.content_markdown,
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

    // Auto-enroll the student
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
    console.error("Course generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate course" },
      { status: 500 }
    );
  }
}