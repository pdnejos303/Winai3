// ─────────────────────────────────────────────────────────────
// FILE: src/components/task/TaskGenerateButton.tsx
// DESC: ปุ่มเรียก GPT เพื่อ Generate Tasks จากข้อความ input
// ─────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { Sparkles, Loader } from "lucide-react";
import { TaskWithMeta } from "@/types/task";

interface Props {
  input: string;
  setTasks: (tasks: TaskWithMeta[]) => void;
}

export default function TaskGenerateButton({ input, setTasks }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gpt/generate-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) throw new Error("Failed to fetch from GPT API");

      const data = await res.json();
      setTasks(data.tasks);
    } catch (err) {
      setError("เกิดข้อผิดพลาดระหว่างการใช้ GPT");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 mt-2">
      <button
        onClick={handleGenerate}
        disabled={loading || input.trim().length === 0}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader className="animate-spin" size={18} />
            กำลังคิด...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            สร้าง Task ด้วย AI
          </>
        )}
      </button>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
