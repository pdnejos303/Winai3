// ─────────────────────────────────────────────────────────────
// FILE: src/types/ai-task.ts
// DESC: Type ของ Task ที่ AI สร้าง
// ─────────────────────────────────────────────────────────────
export interface AITask {
  title: string;
  description: string;
  dueDate: string;          // ISO date (YYYY-MM-DD)
  category?: string;
  urgency?: "low" | "medium" | "high";
}
