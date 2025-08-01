// ───────────────────────────────────────────────────────────────────
// FILE: src/components/task/TextToTaskModal.tsx
// DESC: Modal ใส่ข้อความ + Generate Task จาก GPT + เลือก Task ที่จะเพิ่ม
// ───────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import TaskCardPreview from "./TaskCardPreview";
import { generateTasksFromText } from "@/lib/aiTaskGenerator";
import { TaskWithMeta } from "@/types/task"; // ← สร้าง type ชั่วคราว

interface Props {
  open: boolean;
  setOpen: (b: boolean) => void;
  onSubmitTasks: (tasks: TaskWithMeta[]) => void;
}

export default function TextToTaskModal({ open, setOpen, onSubmitTasks }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskWithMeta[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateTasksFromText(input);
    setTasks(result);
    setSelected(new Set(result.map((_, i) => i))); // เลือกทั้งหมด
    setLoading(false);
  };

  const handleToggle = (i: number) => {
    const newSet = new Set(selected);
    newSet.has(i) ? newSet.delete(i) : newSet.add(i);
    setSelected(newSet);
  };

  const handleAdd = () => {
    const picked = tasks.filter((_, i) => selected.has(i));
    onSubmitTasks(picked);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Text To Task</h2>

        <textarea
          className="w-full p-3 border rounded-lg"
          rows={4}
          placeholder="พิมพ์ข้อความ เช่น พรุ่งนี้ส่งรายงาน คุยกับหัวหน้า..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="text-center my-4">
          <button
            onClick={handleGenerate}
            className="bg-orange-300 hover:bg-orange-400 px-6 py-2 rounded-lg text-white"
            disabled={loading || !input}
          >
            {loading ? "กำลังสร้าง..." : "Generate Task"}
          </button>
        </div>

        {/* รายการ Task Preview */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto">
            {tasks.map((task, i) => (
              <TaskCardPreview
                key={i}
                task={task}
                selected={selected.has(i)}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>
        )}

        {/* ปุ่มล่าง */}
        <div className="mt-6 flex justify-between">
          <button onClick={() => setOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">
            ยกเลิก
          </button>
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={selected.size === 0}
          >
            เพิ่มงาน
          </button>
        </div>
      </div>
    </div>
  );
}
