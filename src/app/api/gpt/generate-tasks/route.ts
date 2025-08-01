// ─────────────────────────────────────────────────────────────
// FILE: src/app/api/gpt/generate-tasks/route.ts
// DESC: API route ที่เรียก GPT เพื่อแปลงข้อความยาวให้เป็น Tasks
// METHOD: POST { input: string }
// RESPONSE: { tasks: TaskWithMeta[] }
// ─────────────────────────────────────────────────────────────

import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { TaskWithMeta } from "@/types/task";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const input: string = body.input;

  if (!input || input.trim().length === 0) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const prompt = `
You are a helpful assistant. Convert the following text into a list of tasks in JSON format.

For each task, include:
- title (string)
- dueDate (optional, YYYY-MM-DD)
- category (optional string)
- urgency (one of: low, medium, high)

Input:
${input}

Output (as JSON array):
[
  {
    "title": "Write project proposal",
    "dueDate": "2025-08-03",
    "category": "Work",
    "urgency": "high"
  },
  ...
]
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ใช้ GPT ฟรี
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content || "[]";

    const tasks: TaskWithMeta[] = JSON.parse(raw);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[GPT ERROR]", error);
    return NextResponse.json({ error: "Failed to generate tasks" }, { status: 500 });
  }
}
