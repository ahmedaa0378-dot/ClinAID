import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, questionCount, title } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const difficultyGuide = {
      easy: "basic recall and recognition questions suitable for early medical students",
      medium: "application and analysis questions suitable for clinical clerkship students",
      hard: "complex clinical reasoning and synthesis questions suitable for residents",
    };

    const prompt = `You are a medical education expert creating quiz questions for medical students.

Generate ${questionCount || 10} multiple-choice questions about: "${topic}"

Difficulty Level: ${difficulty || "medium"} - ${difficultyGuide[difficulty as keyof typeof difficultyGuide] || difficultyGuide.medium}

${title ? `Quiz Title Context: ${title}` : ""}

Requirements:
1. Each question should test clinical knowledge and reasoning
2. Questions should be clear and unambiguous
3. All 4 options should be plausible to someone with incomplete knowledge
4. Include the correct answer and a detailed explanation
5. Add clinical relevance when applicable

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "questions": [
    {
      "questionText": "The full question text here?",
      "questionType": "multiple_choice",
      "options": [
        {"id": "a", "text": "First option"},
        {"id": "b", "text": "Second option"},
        {"id": "c", "text": "Third option"},
        {"id": "d", "text": "Fourth option"}
      ],
      "correctAnswer": "a",
      "explanation": "Detailed explanation of why this is correct and why other options are incorrect.",
      "clinicalRelevance": "How this applies in clinical practice"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a medical education expert. Always respond with valid JSON only, no markdown formatting or code blocks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // Parse the JSON response
    let parsedContent;
    try {
      // Remove any potential markdown code blocks
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error("Failed to parse AI response");
    }

    // Validate the response structure
    if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
      throw new Error("Invalid response structure");
    }

    // Validate each question
    const validatedQuestions = parsedContent.questions.map((q: any, index: number) => {
      if (!q.questionText || !q.options || !q.correctAnswer) {
        throw new Error(`Invalid question at index ${index}`);
      }

      return {
        questionText: q.questionText,
        questionType: q.questionType || "multiple_choice",
        options: q.options.map((opt: any) => ({
          id: opt.id,
          text: opt.text,
        })),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "",
        clinicalRelevance: q.clinicalRelevance || "",
      };
    });

    return NextResponse.json({
      questions: validatedQuestions,
      topic,
      difficulty,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}