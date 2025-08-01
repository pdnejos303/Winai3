// ──────────────────────────────────────────────
// FILE: src/types/task.ts
// DESC: Type สำหรับ Task ที่ Generate โดย AI
// ──────────────────────────────────────────────

export type TaskWithMeta = {
  title: string;
  description?: string;
  dueDate?: string;         // ISO format
  category?: string;
  urgency?: "low" | "medium" | "high";
};
