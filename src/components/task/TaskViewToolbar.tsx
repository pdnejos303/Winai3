// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/components/task/TaskViewToolbar.tsx
// DESC: แถบเครื่องมือด้านบนตาราง Task (ปุ่ม “+ AI Tasks” + ปุ่มเดิม)
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import AddAiTasksModal from "./AddAiTasksModal";
import type { TaskWithCat } from "./AddTaskModal";

interface Props {
  onAiImported: (tasks: TaskWithCat[]) => void;
  onAddManual: () => void;
}

export default function TaskViewToolbar({ onAiImported, onAddManual }: Props) {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="mb-4 flex items-center gap-2">
      {/* ปุ่มเพิ่มแบบ Manual (ใช้ Modal เดิม) */}
      <button
        onClick={onAddManual}
        className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        Task
      </button>

      {/* ปุ่มเพิ่มด้วย AI */}
      <button
        onClick={() => setAiOpen(true)}
        className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
      >
        <Sparkles className="h-4 w-4" />
        AI Tasks
      </button>

      {/* Modal AI */}
      <AddAiTasksModal
        open={aiOpen}
        setOpen={setAiOpen}
        onImported={onAiImported}
      />
    </div>
  );
}
