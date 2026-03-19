import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabase = createClient(SUPABASE_URL || "", SUPABASE_SERVICE_KEY || "");

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });

    const body = await request.json();
    const { contentItemId, chunks } = body;

    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return NextResponse.json({ error: "chunks array is required" }, { status: 400 });
    }

    // Limit chunks per request to avoid huge payloads
    if (chunks.length > 200) {
      return NextResponse.json({ error: "Too many chunks in a single request" }, { status: 413 });
    }

    // Call embeddings for each chunk sequentially or with small concurrency
    const results: Array<{ embedding: number[]; index: number; text: string }> = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const resp = await fetchWithTimeout(
        "https://api.openai.com/v1/embeddings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({ model: "text-embedding-3-small", input: chunk }),
        },
        30000
      );

      if (!resp.ok) {
        const txt = await resp.text();
        console.error("Embedding error:", txt);
        return NextResponse.json({ error: "Embedding request failed" }, { status: 502 });
      }

      const data = await resp.json();
      const embedding = data.data?.[0]?.embedding || [];
      results.push({ embedding, index: i, text: chunk });
    }

    // If contentItemId provided, insert into DB in batch
    if (contentItemId) {
      const rows = results.map((r) => ({
        content_item_id: contentItemId,
        chunk_text: r.text,
        chunk_index: r.index,
        embedding: r.embedding,
      }));

      const { error } = await supabase.from("content_embeddings").insert(rows);
      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: "Failed to save embeddings" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, count: results.length });
  } catch (err: any) {
    console.error("Embeddings route error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
