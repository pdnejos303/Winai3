// ─────────────────────────────────────────────────────────────
// FILE: src/components/task/TaskViewSwitcher.tsx
// DESC: ปุ่มสลับมุมมอง “List / Calendar” (Client Component)
//       - ใช้ CalendarBoard ที่มีอยู่แล้ว (ไม่มี dependency ใหม่)
//       - ไม่ต้องรับ props  → logic fetch-ใน-TaskGrid เหมือนเดิมได้
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { Calendar, List } from "lucide-react";

/* ───── CHILD COMPONENTS ───── */
import TaskGrid from "./TaskGrid";
import CalendarBoard from "../calendar/CalendarBoard";   // ← path จริงใน zip

export default function TaskViewSwitcher() {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <section className="space-y-4">
      {/* ───── Toggle Buttons ───── */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setView("list")}
          className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm
            ${view === "list" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          <List size={16} /> List
        </button>

        <button
          onClick={() => setView("calendar")}
          className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm
            ${view === "calendar" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          <Calendar size={16} /> Calendar
        </button>
      </div>

      {/* ───── Switch View ───── */}
      {view === "list" ? <TaskGrid /> : <CalendarBoard />}
    </section>
  );
}
