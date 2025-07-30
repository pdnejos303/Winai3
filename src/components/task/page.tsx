// ─────────────────────────────────────────────────────────────
// FILE: src/app/en/app/tasks/page.tsx
// DESC: หน้า Tasks  –  สลับ List / Calendar + Add Task
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";                 // ✅ ใช้จริง
import type { Task, Category } from "@prisma/client";

import { List as ListIcon, Calendar as CalIcon, Plus } from "lucide-react";

import AddTaskModal from "@/components/task/AddTaskModal";

/* ------------------------------------------------------------
 * โหลด CalendarBoard แบบ dynamic (ปิด SSR) เพื่อหลบ DOM issue
 * ---------------------------------------------------------- */
const CalendarBoard = dynamic(
  () => import("@/components/calendar/CalendarBoard"),
  { ssr: false },
);

export default function TasksPage() {
  /* ---------- state ---------- */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  /* ---------- fetch helpers ---------- */
  async function fetchTasks() {
    const res = await fetch("/api/tasks", { credentials: "include" });
    if (!res.ok) throw new Error(await res.text());
    setTasks(await res.json());
  }

  async function fetchCategories() {
    const res = await fetch("/api/categories", { credentials: "include" });
    if (!res.ok) throw new Error(await res.text());
    setCategories(await res.json());
  }

  /* ---------- initial load ---------- */
  useEffect(() => {
    Promise.all([fetchTasks(), fetchCategories()]).finally(() =>
      setLoading(false),
    );
  }, []);

  /* ---------- callback เมื่อสร้าง Task ---------- */
  const handleCreated = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  /* ---------- JSX ---------- */
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        {/* View switch buttons */}
        <div className="inline-flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <ListIcon size={16} />
            List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm ${
              viewMode === "calendar"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <CalIcon size={16} />
            Calendar
          </button>
        </div>

        {/* Add Task */}
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading…</p>
      ) : viewMode === "list" ? (
        tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="rounded-lg border p-4 shadow transition hover:bg-gray-50"
              >
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(t.dueDate).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )
      ) : (
        /* Calendar View */
        <CalendarBoard />
      )}

      {/* Modal */}
      <AddTaskModal
        open={modalOpen}
        setOpen={setModalOpen}
        categories={categories}
        onCreated={handleCreated}
      />
    </div>
  );
}
