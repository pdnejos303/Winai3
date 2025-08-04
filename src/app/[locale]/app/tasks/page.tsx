// ─────────────────────────────────────────────────────────────
// หน้า Tasks – โหลด <TaskViewSwitcher/> พร้อม skeleton ระหว่าง hydrate
// ─────────────────────────────────────────────────────────────
import { Suspense } from "react";

import TaskViewSwitcher from "@/components/task/TaskViewSwitcher";
import TaskCardSkeleton from "@/components/task/TaskCardSkeleton";

/* <head> title */
export const metadata = { title: "Tasks" };

/* Skeleton 6 card */
function TaskListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function TasksPage() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* ไม่ส่ง props – TaskViewSwitcher ดึงข้อมูลเอง */}
      <Suspense fallback={<TaskListSkeleton />}>
        <TaskViewSwitcher />
      </Suspense>
    </main>
  );
}
