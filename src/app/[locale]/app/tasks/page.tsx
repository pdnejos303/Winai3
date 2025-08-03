// ─────────────────────────────────────────────────────────────
// FILE: src/app/[locale]/app/tasks/page.tsx
// DESC: หน้า Tasks (Server Component)
//       • ดึงข้อมูลจริงผ่าน TaskListServer (Server Component อีกชั้น)
//       • ใช้ <Suspense> เพื่อแสดง Skeleton ขณะรอ fetch
//       • ไม่มี “use client” ⇒ รันฝั่งเซิร์ฟเวอร์เต็ม ๆ
// ─────────────────────────────────────────────────────────────
import { Suspense } from "react";

// Server-side fetcher – คืน <TaskGrid tasks={…} />
import TaskListServer from "@/components/task/server/TaskListServer";

// Skeleton UI (Card เปล่า) ขนาดเท่าของจริง
import TaskCardSkeleton from "@/components/task/TaskCardSkeleton";

/* ───── ตั้ง title ให้ <head> ───── */
export const metadata = { title: "Tasks" };

/* ───── Skeleton fallback ใช้ 6 ใบ ───── */
function SkeletonGrid() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ───── Page Component (Server) ───── */
export default function TasksPage() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* 
        • ขณะแรกที่ TaskListServer ยัง fetch DB → Suspense จะ render SkeletonGrid 
        • เมื่อ fetch เสร็จ → TaskListServer แสดง TaskGrid จริงแทนที่
      */}
      <Suspense fallback={<SkeletonGrid />}>
        <TaskListServer />
      </Suspense>
    </main>
  );
}
