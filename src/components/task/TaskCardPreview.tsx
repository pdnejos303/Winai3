// ─────────────────────────────────────────────────────────────────────
// FILE: src/components/task/TaskCardPreview.tsx
// DESC: การ์ดแสดง Task ที่ Generate จาก GPT แบบ Preview พร้อมเลือก
// ─────────────────────────────────────────────────────────────────────

"use client";

import { TaskWithMeta } from "@/types/task"; // ← ใช้ type เดียวกัน
import { CheckCircle, Circle } from "lucide-react"; // ไอคอนเลือก

interface Props {
  task: TaskWithMeta;
  selected: boolean;
  onToggle: () => void;
}

export default function TaskCardPreview({ task, selected, onToggle }: Props) {
  return (
    <div
      className={`relative p-4 rounded-lg shadow-md border cursor-pointer transition-all ${
        selected ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onClick={onToggle}
    >
      {/* ปุ่มเลือก */}
      <div className="absolute top-2 right-2 text-blue-500">
        {selected ? <CheckCircle size={24} /> : <Circle size={24} />}
      </div>

      <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{task.description}</p>

      <div className="text-sm mt-3 text-gray-500">
        <div>
          <strong>Due:</strong>{" "}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "ไม่ระบุ"}
        </div>
        <div>
          <strong>Category:</strong> {task.category ?? "ทั่วไป"}
        </div>
        <div>
          <strong>Urgency:</strong> {task.urgency ?? "ปานกลาง"}
        </div>
      </div>
    </div>
  );
}
