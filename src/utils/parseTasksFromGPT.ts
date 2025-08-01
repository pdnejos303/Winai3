// ─────────────────────────────────────────────────────────────
// FILE: src/utils/parseTasksFromGPT.ts
// DESC: Parse JSON AI response → validate + normalize Tasks
// ─────────────────────────────────────────────────────────────
import { AITask } from "@/types/ai-task";

export function parseTasksFromGPT(raw: any[]): AITask[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => typeof item.title === "string" && item.title.length > 0)
    .map((item) => ({
      title: item.title.trim(),
      description: item.description?.trim() || "",
      dueDate: item.dueDate || null,
    }));
}
