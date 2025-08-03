// ─────────────────────────────────────────────────────────────
// FILE:  src/components/task/generator/TaskGenerateForm.tsx
// DESC:  ฟอร์มหลักให้ผู้ใช้พิมพ์ข้อความ → กด Generate → แสดง Task
//        • ใช้ gptGenerateTasks() เรียก API ฝั่งเซิร์ฟเวอร์
//        • แสดง error / loading / preview list
// ─────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { gptGenerateTasks } from "@/lib/gptGenerateTasks";
import { AITask } from "@/types/ai-task";
import TaskPreviewList from "./TaskPreviewList";
import TaskGenerateButton from "./TaskGenerateButton";

export default function TaskGenerateForm() {
  /* ------ state หลัก ------ */
  const [input, setInput] = useState("");        // ข้อความยาวจากผู้ใช้
  const [loading, setLoading] = useState(false); // กำลังเรียก GPT?
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [error, setError] = useState("");

  /* ------ เรียก GPT เมื่อกดปุ่ม ------ */
  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    try {
      const generated = await gptGenerateTasks(input.trim());
      setTasks(generated);
    } catch (err) {
      console.error(err);
      setError("สร้าง Task ไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold text-gray-800">AI Task Generator</h2>

      {/* -------- กล่องข้อความ -------- */}
      <textarea
        rows={5}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="พิมพ์สิ่งที่ต้องทำหลายบรรทัด เช่น ส่งรายงาน นัดประชุมฯลฯ"
        className="w-full p-3 border rounded-md text-sm"
      />

      {/* -------- ปุ่ม Generate -------- */}
      <TaskGenerateButton
        loading={loading}
        disabled={input.trim().length === 0}
        onClick={handleGenerate}
      />

      {/* -------- แสดง error -------- */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* -------- แสดงรายการ Task Preview -------- */}
      <TaskPreviewList tasks={tasks} />
    </div>
  );
}
