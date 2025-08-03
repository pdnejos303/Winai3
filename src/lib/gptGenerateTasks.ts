// ─────────────────────────────────────────────────────────────
// FILE: src/lib/gptGenerateTasks.ts
// DESC: เรียก API /api/ai-task → คืนรายการ Task (AITask[])
// ─────────────────────────────────────────────────────────────

import { AITask } from "@/types/ai-task";

/** ฟังก์ชันหลัก export ชื่อเดียวกับที่ Form เรียก */
export async function gptGenerateTasks(input: string): Promise<AITask[]> {
  const res = await fetch("/api/ai-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  if (!res.ok) throw new Error("AI generate failed");

  const { tasks } = (await res.json()) as { tasks: AITask[] };
  return tasks;
}

/* ถ้าอยาก import แบบ default ก็เปิดบรรทัดล่างได้ */
/* export default gptGenerateTasks; */
