// ─────────────────────────────────────────────────────────────
// FILE: src/components/task/TaskGrid.tsx
// DESC: Grid + Filter + Add + Bulk-edit + Category dialog
//       • ถ้ามี initialTasks / initialCategories → แสดงรายการทันที
//       • ถ้าไม่มี → ดึง API แล้วโชว์ Skeleton 6 ใบระหว่างโหลด
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Task, Category } from "@prisma/client";

import TaskCard from "./TaskCard";
import TaskCardSkeleton from "./TaskCardSkeleton";
import TaskFilter, { FilterState } from "./TaskFilters";
import AddTaskModal from "./AddTaskModal";
import BulkEditModal from "./BulkEditModal";
import AddCategoryDialog from "./AddCategoryDialog";

// ---------- helpers & types ----------
export type TaskWithCat = Task & { category: Category | null };

export interface TaskGridProps {
  initialTasks?: TaskWithCat[];
  initialCategories?: Category[];
}

const defaultFilters: FilterState = {
  status: "all",
  urgency: "all",
  categoryId: "all",
};

export default function TaskGrid({
  initialTasks = [],
  initialCategories = [],
}: TaskGridProps = {}) {
  // locale & router
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const router = useRouter();

  // ---------- state ----------
  const [filters, setFilters] = useState(defaultFilters);
  const [tasks, setTasks] = useState<TaskWithCat[]>(initialTasks);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(initialTasks.length === 0); // ถ้ามี data แล้วไม่ต้องโหลด
  const [showAdd, setShowAdd] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const reqId = useRef(0);

  // reset filters เมื่อ locale เปลี่ยน
  useEffect(() => setFilters(defaultFilters), [locale]);

  // ---------- fetch categories (ถ้าไม่มี preload) ----------
  useEffect(() => {
    if (initialCategories.length) return; // ข้ามถ้ามีแล้ว
    (async () => {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (res.status === 401) {
        router.replace(`/${locale}/login`);
        return;
      }
      const data: Category[] = await res.json();
      setCategories(data);
    })();
  }, [initialCategories.length, locale, router]);

  // ---------- fetch tasks (ถ้าไม่มี preload) ----------
  useEffect(() => {
    if (initialTasks.length) return; // มี preload แล้ว
    const id = ++reqId.current;
    setLoading(true);

    (async () => {
      try {
        const qs = new URLSearchParams();
        if (filters.status !== "all") qs.append("status", filters.status);
        if (filters.urgency !== "all") qs.append("urgency", String(filters.urgency));
        if (filters.categoryId !== "all") qs.append("category", String(filters.categoryId));

        const res = await fetch("/api/tasks?" + qs.toString(), { cache: "no-store" });
        if (res.status === 401) {
          router.replace(`/${locale}/login`);
          return;
        }
        const data: TaskWithCat[] = await res.json();
        if (id === reqId.current) setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    })();
  }, [filters, locale, router, initialTasks.length]);

  // ---------- helpers ----------
  const toggleSelect = (id: number) =>
    setSelectedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function handleToggle(id: number, status: "completed" | "incompleted") {
    setTasks((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setTasks((p) =>
        p.map((x) =>
          x.id === id ? { ...x, status: status === "completed" ? "incompleted" : "completed" } : x,
        ),
      );
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.length} tasks?`)) return;
    setTasks((p) => p.filter((x) => !selectedIds.includes(x.id)));
    setSelectedIds([]);
    await Promise.all(selectedIds.map((id) => fetch(`/api/tasks/${id}`, { method: "DELETE" })));
  }

  // ---------- JSX ----------
  return (
    <div className="space-y-6">
      {/* BAR */}
      <div className="flex items-center justify-between gap-4">
        <TaskFilter categories={categories} onChange={setFilters} />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddCat(true)}
            className="rounded-md border px-3 py-1 hover:bg-gray-50"
          >
            + Category
          </button>

          {selectedIds.length > 0 && (
            <>
              <span className="text-sm text-blue-600">{selectedIds.length} selected</span>
              <button
                onClick={() => setShowBulk(true)}
                className="rounded bg-sky-600 px-3 py-1 text-white hover:bg-sky-700"
              >
                Edit
              </button>
              <button
                onClick={handleBulkDelete}
                className="rounded bg-rose-600 px-3 py-1 text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </>
          )}

          <button
            onClick={() => setShowAdd(true)}
            className="rounded-md bg-brand-green px-4 py-2 font-medium text-white hover:opacity-90"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* GRID */}
      {loading && tasks.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No tasks found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((t) => (
            <TaskCard
              key={`${t.id}-${t.status}`}
              task={t}
              selected={selectedIds.includes(t.id)}
              onSelect={toggleSelect}
              onToggle={handleToggle}
              onDeleted={(id) => {
                setTasks((p) => p.filter((x) => x.id !== id));
                setSelectedIds((p) => p.filter((x) => x !== id));
              }}
              onUpdated={(u) => setTasks((p) => p.map((x) => (x.id === u.id ? (u as TaskWithCat) : x)))}
            />
          ))}
        </div>
      )}

      {/* MODAL – Add Task */}
      <AddTaskModal
        open={showAdd}
        setOpen={setShowAdd}
        categories={categories}
        onCreated={(t) =>
          setTasks((p) => [...p, t as TaskWithCat].sort((a, b) => +a.dueDate - +b.dueDate))
        }
      />

      {/* DIALOG – Add Category */}
      {showAddCat && (
        <AddCategoryDialog
          open={showAddCat}
          setOpen={setShowAddCat}
          onCreated={(c) => setCategories((p) => [...p, c])}
        />
      )}

      {/* MODAL – Bulk-edit */}
      {showBulk && (
        <BulkEditModal
          ids={selectedIds}
          setOpen={setShowBulk}
          categories={categories}
          onUpdated={(u) => setTasks((p) => p.map((x) => (x.id === u.id ? (u as TaskWithCat) : x)))}
          clearSelection={() => setSelectedIds([])}
        />
      )}
    </div>
  );
}
