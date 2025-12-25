import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Medical education system prompt
const SYSTEM_PROMPT = `You are ClinAid AI Tutor, an expert medical education assistant designed to help medical students learn effectively.

Your role:
- Explain complex medical concepts in clear, understandable terms
- Use clinical examples and case studies when helpful
- Provide accurate, evidence-based medical information
- Help students understand anatomy, physiology, pathology, pharmacology, and clinical medicine
- Quiz students when they ask to be tested
- Provide mnemonics and memory aids when appropriate
- Always cite sources when discussing specific medical facts

Guidelines:
- Be encouraging and supportive
- Break down complex topics into digestible parts
- Use analogies to explain difficult concepts
- If you're unsure about something, say so
- Always recommend consulting official medical resources and professors for critical information
- Never provide actual medical advice for real patients

When given context from course materials, prioritize that information as it's from the student's professor.`;

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userId, courseContext } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Step 1: Search for relevant content from professor's materials
    let relevantContent = "";
    
    if (userId) {
      try {
        // Get student's enrolled courses
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("subject_id")
          .eq("student_id", userId);

        if (enrollments && enrollments.length > 0) {
          const subjectIds = enrollments.map(e => e.subject_id);
          
          // Search content items for relevant materials
          const { data: contentItems } = await supabase
            .from("content_items")
            .select("title, content, content_type")
            .in("module_id", subjectIds)
            .textSearch("content", message.split(" ").slice(0, 5).join(" | "), {
              type: "websearch",
            })
            .limit(3);

          if (contentItems && contentItems.length > 0) {
            relevantContent = contentItems
              .map(item => `[${item.title}]: ${item.content?.substring(0, 500)}`)
              .join("\n\n");
          }
        }
      } catch (error) {
        console.log("Content search skipped:", error);
      }
    }

    // Step 2: Build the messages array
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add context from professor's materials if found
    if (relevantContent) {
      messages.push({
        role: "system",
        content: `Here is relevant content from the student's course materials that may help answer their question:\n\n${relevantContent}\n\nUse this information to provide a more personalized response.`,
      });
    }

    // Add course context if provided
    if (courseContext) {
      messages.push({
        role: "system",
        content: `The student is currently studying: ${courseContext}`,
      });
    }

    // Add the user's message
    messages.push({ role: "user", content: message });

    // Step 3: Get chat history for context (last 10 messages)
    if (sessionId) {
      try {
        const { data: history } = await supabase
          .from("ai_chat_messages")
          .select("role, content")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true })
          .limit(10);

        if (history && history.length > 0) {
          // Insert history before the current message
          const historyMessages = history.map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }));
          messages.splice(messages.length - 1, 0, ...historyMessages);
        }
      } catch (error) {
        console.log("History fetch skipped:", error);
      }
    }

    // Step 4: Call OpenAI GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiResponse = completion.choices[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again.";

    // Step 5: Save messages to database
    if (sessionId && userId) {
      try {
        // Save user message
        await supabase.from("ai_chat_messages").insert({
          session_id: sessionId,
          role: "user",
          content: message,
        });

        // Save AI response
        await supabase.from("ai_chat_messages").insert({
          session_id: sessionId,
          role: "assistant",
          content: aiResponse,
        });
      } catch (error) {
        console.log("Message save skipped:", error);
      }
    }

    return NextResponse.json({
      response: aiResponse,
      hasContext: !!relevantContent,
    });

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}