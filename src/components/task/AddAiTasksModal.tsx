// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/components/task/AddAiTasksModal.tsx
// DESC: Modal “สร้างงานด้วย AI”
//       (แก้ 2025-08-04 — เพิ่ม createdAt/updatedAt ให้ชนิด TaskWithCat)
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Loader2 } from "lucide-react";

import {
  generateTasks,
  type AiGeneratedTask,
} from "@/lib/clientAiTaskApi";
import type { TaskWithCat } from "./AddTaskModal";

/* -------------------------------------------------------------------------- */
/*  props                                                                     */
/* -------------------------------------------------------------------------- */
interface Props {
  open: boolean;
  setOpen: (b: boolean) => void;
  /** callback เมื่อผู้ใช้กด Import (parent จะบันทึก DB เอง) */
  onImported: (tasks: TaskWithCat[]) => void;
}

/* -------------------------------------------------------------------------- */
/*  component                                                                 */
/* -------------------------------------------------------------------------- */
export default function AddAiTasksModal({ open, setOpen, onImported }: Props) {
  /* ------------------------------- state --------------------------------- */
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<AiGeneratedTask[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------- event handler ----------------------------- */
  async function handleGenerate() {
    setError(null);
    setLoading(true);
    try {
      const tasks = await generateTasks(input.trim());
      setPreview(tasks);
    } catch (err) {
      setError((err as Error).message);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setPreview(null);
  }

  function handleImport() {
    if (!preview) return;

    /* -------------------------------------------------------------------- */
    /*  map AiGeneratedTask → TaskWithCat                                    */
    /*  ต้องใส่ฟิลด์ createdAt / updatedAt เพื่อให้ TypeScript ผ่าน        */
    /* -------------------------------------------------------------------- */
    const now = new Date();
    const mapped = preview.map<TaskWithCat>((t) => ({
      ...t,
      id: 0,               // placeholder – ยังไม่บันทึก DB
      userId: 0,
      urgency: t.urgency ?? 0,
      status: t.status ?? "pending",
      categoryId: t.categoryId ?? null,
      category: null,
      createdAt: now,
      updatedAt: now,
    }));

    onImported(mapped);
    closeModal();
  }

  function closeModal() {
    setInput("");
    setPreview(null);
    setError(null);
    setOpen(false);
  }

  /* ------------------------- helper (localized) -------------------------- */
  const fmt = (d: Date) => d.toLocaleDateString();

  /* ---------------------------------------------------------------------- */
  /*  render                                                                */
  /* ---------------------------------------------------------------------- */
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog onClose={closeModal} className="relative z-50">
        {/* backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-150"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 dark:text-zinc-100">
              {/* close */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                <X className="h-5 w-5" />
              </button>

              <Dialog.Title className="text-lg font-semibold">
                เพิ่มงานด้วย AI
              </Dialog.Title>

              {/* STEP 1 – textarea */}
              {!preview && (
                <>
                  <label className="mt-4 block text-sm font-medium">
                    พิมพ์คำอธิบายสิ่งที่ต้องทำ
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={6}
                    className="mt-2 w-full rounded-lg border border-zinc-300 p-3 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800"
                    placeholder="ตัวอย่าง: งานบ้าน ซักผ้า ส่งรายงานปลายเดือน …"
                  />

                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleGenerate}
                      disabled={loading || !input.trim()}
                      className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generate
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2 – preview */}
              {preview && (
                <>
                  <p className="mt-4 text-sm text-zinc-500">
                    AI สร้างงาน {preview.length} รายการ ตรวจสอบก่อนนำเข้า
                  </p>

                  <div className="mt-4 max-h-72 overflow-y-auto rounded-lg border">
                    <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-700">
                      <thead className="bg-zinc-50 dark:bg-zinc-800">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">ชื่องาน</th>
                          <th className="px-3 py-2 text-left font-medium">คำอธิบาย</th>
                          <th className="px-3 py-2 text-left font-medium">กำหนดเสร็จ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                        {preview.map((t, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2">{t.title}</td>
                            <td className="px-3 py-2 opacity-80">{t.description}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{fmt(t.dueDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={handleBack}
                      className="rounded-lg border border-zinc-300 px-4 py-2 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      ย้อนกลับ
                    </button>

                    <button
                      onClick={handleImport}
                      className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
                    >
                      Import
                    </button>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
