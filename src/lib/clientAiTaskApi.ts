// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/lib/clientAiTaskApi.ts
// DESC: Client-side helper — เรียก API “/api/ai-task” เพื่อให้ GPT
//       แปลงข้อความยาวเป็นรายการ Task[] สำหรับแสดงพรีวิว / import
//       (ยัง “ไม่” บันทึกเข้า DB  — แค่เตรียมข้อมูลเท่านั้น)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

/* -------------------------------------------------------------------------- */
/*  ชนิดข้อมูล Task ที่ AI คืนมา (ยังไม่มี id เพราะยังไม่บันทึกลงฐานข้อมูล)   */
/* -------------------------------------------------------------------------- */
export interface AiGeneratedTask {
  title: string;
  description: string;
  dueDate: Date;                    // ← แปลงจาก ISO string → Date object
  urgency?: number | null;
  status?: "pending" | "completed" | "incompleted" | null;
  categoryId?: number | null;
}

/* -------------------------------------------------------------------------- */
/*  ตัวเลือก (optional) สำหรับรองรับ AbortSignal ฯลฯ                          */
/* -------------------------------------------------------------------------- */
export type GenerateTasksOptions = {
  signal?: AbortSignal;
};

/* -------------------------------------------------------------------------- */
/*  ฟังก์ชันหลัก: generateTasks()                                             */
/* -------------------------------------------------------------------------- */
/**
 * ส่ง `prompt` ไปยัง API Route `/api/ai-task`
 * ซึ่งจะเรียก GPT-4 / GPT-3.5 ให้แปลงเป็น Task[]
 *
 * @param  prompt   ข้อความยาว ๆ ที่ผู้ใช้พิมพ์
 * @param  options  (optional) AbortSignal ฯลฯ
 * @returns         Promise<AiGeneratedTask[]>
 * @throws          Error หาก HTTP status ไม่ใช่ 2xx หรือ payload ไม่ถูกต้อง
 */
export async function generateTasks(
  prompt: string,
  options: GenerateTasksOptions = {},
): Promise<AiGeneratedTask[]> {
  const res = await fetch("/api/ai-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // BEFORE:  body: JSON.stringify({ prompt }),
    // AFTER : ส่ง field ชื่อ "input" ให้ตรงกับ route.ts
    body: JSON.stringify({ input: prompt }),
    signal: options.signal,
  });

  /* ----------------------------- ตรวจ Error ----------------------------- */
  if (!res.ok) {
    // พยายามอ่าน error message จาก JSON; ถ้าไม่มีให้ fallback เป็น status
    let message = `AI task generation failed (HTTP ${res.status})`;
    try {
      const err = (await res.json()) as { message?: string };
      if (err?.message) message = err.message;
    } catch {
    }
    throw new Error(message);
  }

  /* --------------------------- แปลงผลลัพธ์ ---------------------------- */
  // Server ส่ง ISO-8601 string; แปลงเป็น Date ก่อน return
  const data = (await res.json()) as Array<
    Omit<AiGeneratedTask, "dueDate"> & { dueDate: string }
  >;

  return data.map((t) => ({
    ...t,
    dueDate: new Date(t.dueDate),
  }));
}
