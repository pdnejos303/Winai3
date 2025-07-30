/* ------------------------------------------------------------------
 * FILE: src/components/task/TaskViewSwitcher.tsx
 * DESC:  แถบปุ่ม + ตัวสลับมุมมอง Task (list ↔ calendar)
 * ---------------------------------------------------------------- */
"use client";

import { useState } from "react";
import { Calendar, List } from "lucide-react"; // ไอคอน

import TaskGrid from "./TaskGrid";                 // 👈 ใช้มุมมองเดิม
import CalendarBoard from "../calendar/CalendarBoard";

export default function TaskViewSwitcher() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  return (
    <section className="space-y-4">
      {/* ░░░ Toolbar ░░░ */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setViewMode("list")}
          className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm
            ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          <List size={16} /> List
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm
            ${viewMode === "calendar" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          <Calendar size={16} /> Calendar
        </button>
      </div>

      {/* ░░░ Content ░░░ */}
      {viewMode === "list" ? (
        <TaskGrid />          
      ) : (
        <CalendarBoard />     
      )}
    </section>
  );
}
