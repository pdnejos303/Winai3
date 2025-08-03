// ─────────────────────────────────────────────────────────────
// FILE: src/components/ai/TextToTaskModal.tsx
// DESC: Modal / Section “Text-to-Task”
//       • รับข้อความยาว → POST /api/ai-task → แสดงรายการ Task
//       • กำหนด type ชัดเจน (หลีกเลี่ยง any)
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { AITask } from "@/types/ai-task";           // ✅ type ที่ประกาศไว้
import { Loader2 } from "lucide-react";

/* — helper ปุ่ม shimmer — */
function InlineSpinner() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}

export default function TextToTaskModal() {
  /* ---------------- state ---------------- */
  const [text, setText] = useState<string>("");
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /* -------------- call API --------------- */
  const generateTasks = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });

      if (!res.ok) throw new Error("AI generate failed");

      const data: { tasks: AITask[] } = await res.json();
      setTasks(data.tasks);
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  /* -------------- UI --------------- */
  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Text To Task</h2>

      {/* —— textarea —— */}
      <textarea
        className="w-full p-4 border rounded-lg"
        rows={4}
        placeholder="พิมพ์สิ่งที่ต้องทำ เช่น 'พรุ่งนี้ส่งรายงาน ซื้อของ เข้าประชุม'"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* —— ปุ่ม Generate —— */}
      <button
        onClick={generateTasks}
        disabled={loading || text.trim().length === 0}
        className="flex items-center gap-2 px-6 py-2 bg-orange-400
                   hover:bg-orange-500 text-white rounded disabled:opacity-50"
      >
        {loading && <InlineSpinner />}
        {loading ? "กำลังสร้าง..." : "Generate Task"}
      </button>

      {/* —— error message —— */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* —— รายการ Task —— */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="p-4 rounded-xl shadow border space-y-2 bg-gray-50"
          >
            <h3 className="text-lg font-semibold">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
            {task.dueDate && (
              <p className="text-sm">
                🗓 {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}

            {/* TODO: connect this button to real /api/tasks */}
            <button className="mt-2 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded">
              เพิ่มงาน
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
