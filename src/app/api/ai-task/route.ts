// FILE: src/app/api/ai-task/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const buildPrompt = (input: string) => `
แปลงข้อความต่อไปนี้เป็นรายการ Task โดยแบ่งเป็นหลาย Task แยก title, description และกำหนด DueDate สมเหตุสมผลในรูปแบบ YYYY-MM-DD:

"${input}"

ผลลัพธ์ให้อยู่ในรูป JSON array เช่น:
[
  { "title": "ส่งรายงาน", "description": "เตรียมเอกสารและส่งให้หัวหน้า", "dueDate": "2025-08-01" },
  ...
]
`;

export async function POST(req: Request) {
  const { input } = await req.json();
  const prompt = buildPrompt(input);

  // Model fallback logic
  const tryModels = ["gpt-4", "gpt-3.5-turbo"];
  let resultText = "";
  let success = false;

  for (const model of tryModels) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      resultText = completion.choices[0].message.content || "[]";
      success = true;
      break;
    } catch (err: any) {
      console.warn(`❌ GPT fallback: ${model} failed`, err?.message);
      continue; // try next model
    }
  }

  if (!success) {
    return NextResponse.json(
      { error: "Both GPT-4 and GPT-3.5 failed." },
      { status: 500 }
    );
  }

  try {
    const tasks = JSON.parse(resultText);
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON returned by AI." },
      { status: 500 }
    );
  }
}
