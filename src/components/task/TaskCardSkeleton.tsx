// ─────────────────────────────────────────────────────────────
// FILE: src/components/task/TaskCardSkeleton.tsx
// DESC: Skeleton (Shimmer) รูปร่างเหมือน TaskCard จริง แต่ไม่มีข้อมูล
//       • ใช้ animate-pulse + bg-gray* เป็น placeholder
//       • ขนาด / layout ตรงกับ TaskCard.tsx 100%
// ─────────────────────────────────────────────────────────────
"use client";

import clsx from "clsx";

/* สีเทาของ placeholder */
const gray = "bg-gray-300/60";

/* UrgencyBars แบบ placeholder */
function UrgencyBarsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-[2px]">
      {[0, 1, 2].map((i) => (
        <div key={i} className={clsx("h-1 w-full rounded-sm", gray)} />
      ))}
    </div>
  );
}

export default function TaskCardSkeleton() {
  return (
    <div
      className={clsx(
        "relative flex h-[400px] w-[320px] flex-col rounded-lg bg-white p-6 shadow animate-pulse"
      )}
    >
      {/* Checkbox (outline) */}
      <div className="absolute right-4 top-4 h-5 w-5 rounded-sm border-2 border-gray-300" />

      {/* Flag icon placeholder */}
      <div className="absolute left-4 top-4 h-5 w-5 rounded-sm bg-gray-300/80" />

      {/* -------- TOP content (flex-1) -------- */}
      <div className="mb-4 mt-8 flex-1 space-y-3 overflow-hidden">
        {/* title */}
        <div className={clsx("h-4 w-2/3 rounded", gray)} />

        {/* description lines */}
        <div className={clsx("h-3 w-full rounded", gray)} />
        <div className={clsx("h-3 w-5/6 rounded", gray)} />

        <hr />

        {/* due-date row */}
        <div className={clsx("h-3 w-1/2 rounded", gray)} />

        {/* category row */}
        <div className={clsx("h-3 w-1/3 rounded", gray)} />

        <hr />

        {/* remain text */}
        <div className={clsx("h-3 w-1/4 rounded", gray)} />

        {/* urgency bars */}
        <UrgencyBarsSkeleton />
      </div>

      {/* -------- ACTION zone (3 ปุ่ม) -------- */}
      <div className="mt-auto flex gap-1">
        <div className={clsx("flex-1 h-8 rounded", gray)} />
        <div className={clsx("flex-1 h-8 rounded", gray)} />
        <div className={clsx("flex-1 h-8 rounded", gray)} />
      </div>
    </div>
  );
}
