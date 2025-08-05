// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/app/api/ai-task/route.ts
// DESC: POST /api/ai-task — แปลง “input” (ข้อความยาว) → Task[] JSON
//       • ปรับลำดับ fallback model ให้ตรงกับ account ทั่วไป
//         1) gpt-4o-mini         (ถ้ามีสิทธิ์จะเร็วและถูกกว่า gpt-4)
//         2) gpt-3.5-turbo-0125  (รุ่น default ทุก key ใช้ได้)
//         3) gpt-3.5-turbo       (สำรองสุดท้าย)
//       • ถ้าแต่ละ model error 404 / 429 จะลองตัวถัดไปอัตโนมัติ
//       • ส่ง status / message กลับ client ให้แสดงผลชัดเจน
// ─────────────────────────────────────────────────────────────────────────────

import { type NextRequest, NextResponse } from "next/server";
import OpenAI, { APIError } from "openai";

/* -------------------------------------------------------------------------- */
/*  Init OpenAI                                                               */
/* -------------------------------------------------------------------------- */
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* -------------------------------------------------------------------------- */
/*  Helper – prompt                                                           */
/* -------------------------------------------------------------------------- */
const buildPrompt = (input: string): string => `
แปลงข้อความต่อไปนี้เป็นรายการ Task โดยแบ่งเป็นหลาย Task แยก title, description และกำหนด DueDate สมเหตุสมผลในรูปแบบ YYYY-MM-DD:

"${input}"

ผลลัพธ์ให้อยู่ในรูป JSON array เช่น:
[
  { "title": "ส่งรายงาน", "description": "เตรียมเอกสารและส่งให้หัวหน้า", "dueDate": "2025-08-01" },
  ...
]
`;

/* -------------------------------------------------------------------------- */
/*  ลิสต์โมเดล fallback (ปรับตามที่ account ส่วนใหญ่ใช้ได้แน่นอน)           */
/*  สามารถ override ได้ด้วย ENV: WINAI_FALLBACK_MODELS="model1,model2,..."    */
/* -------------------------------------------------------------------------- */
const fallbackModels = process.env.WINAI_FALLBACK_MODELS?.split(",").map((m) => m.trim()) ?? [
  "gpt-4o-mini",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo",
];

/* -------------------------------------------------------------------------- */
/*  POST /api/ai-task                                                         */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  /* ---------- รับ input ---------- */
  const { input } = (await req.json()) as { input?: string };
  const text = input?.trim();
  if (!text) {
    return NextResponse.json({ error: "No input provided" }, { status: 400 });
  }

  const prompt = buildPrompt(text);
  let lastErr: APIError | Error | null = null;

  for (const model of fallbackModels) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const raw = completion.choices[0].message.content ?? "[]";
      const tasks: Array<{ title: string; description: string; dueDate: string }> = JSON.parse(raw);

      return NextResponse.json({ tasks, model });
    } catch (err: unknown) {
      lastErr = err instanceof Error ? err : new Error(String(err));

      // ถ้า 404 (model ไม่เปิด) หรือ 429 (quota/ rate) → ลองตัวถัดไป
      if (err instanceof APIError && (err.status === 404 || err.status === 429)) {
        console.warn(`⚠️  Model ${model} unavailable (${err.status}) – trying next…`);
        continue;
      }

      // ถ้า error ประเภทอื่น (เช่น 500) ให้หยุดทันที
      break;
    }
  }

  /* ---------- ทุก model ล้มเหลว ---------- */
  const status = lastErr instanceof APIError ? lastErr.status : 500;
  const message =
    lastErr instanceof APIError ? `${lastErr.status} ${lastErr.message}` : lastErr?.message ?? "Unknown error";

  return NextResponse.json({ error: message }, { status });
}
