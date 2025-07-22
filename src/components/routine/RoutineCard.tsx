/* --------------------------------------------------------------------------
 * Path: src/components/routine/RoutineCard.tsx
 * Props:
 *  - title            (string)
 *  - weekdayTime      (string)   เช่น "Mon 18:00" หรือ "จันทร์ 18:00"
 *  - progressPercent  (number)   0-100, 100 = finished
 *  - onEdit           (fn)       callback เวลา click ปุ่มดินสอ
 * ------------------------------------------------------------------------ */
"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import clsx from "clsx";

interface Props {
  title: string;
  weekdayTime: string;
  progressPercent: number; // 0-100
  onEdit?: () => void;
}

export default function RoutineCard({
  title,
  weekdayTime,
  progressPercent,
  onEdit,
}: Props) {
  /* ------ local hover state (เฉพาะเพื่อโชว์ปุ่ม) --------------------- */
  const [hover, setHover] = useState(false);

  /* ------ คำนวณข้อความสถานะ & สี bar --------------------------------- */
  const finished = progressPercent >= 100;
  const barColor = finished ? "bg-emerald-600" : "bg-amber-400";
  const barBg    = finished ? "bg-emerald-700/40" : "bg-amber-100";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={clsx(
        "relative flex flex-col gap-1 rounded-lg p-4 shadow transition",
        finished
          ? "bg-emerald-500 text-white"
          : "bg-brand-cream hover:bg-brand-cream/80",
      )}
    >
      {/* ----- ชื่อ + วันเวลา ----- */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className={clsx("text-lg font-semibold", finished && "text-white")}>
            {title}
          </h3>
          <span
            className={clsx(
              "text-sm opacity-70",
              finished && "text-white/80",
            )}
          >
            {weekdayTime}
          </span>
        </div>

        {/* ----- ปุ่ม Edit (แสดงเมื่อ hover) ----- */}
        {hover && (
          <button
            onClick={onEdit}
            className={clsx(
              "group rounded-full p-2 transition",
              finished
                ? "hover:bg-white/10"
                : "hover:bg-brand-green/10",
            )}
            aria-label="Edit routine"
          >
            {finished ? (
              <Check
                size={20}
                className="stroke-[3] text-white group-hover:scale-110 transition"
              />
            ) : (
              <Pencil
                size={20}
                className={clsx(
                  "stroke-[3] transition",
                  finished ? "text-white" : "text-brand-green",
                )}
              />
            )}
          </button>
        )}
      </div>

      {/* ----- Progress bar ----- */}
      <div className={clsx("h-3 overflow-hidden rounded-full", barBg)}>
        <div
          className={clsx("h-full transition-all", barColor)}
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>

      {/* ----- ตัวเลข % หรือคำว่า finished ----- */}
      <span
        className={clsx(
          "absolute right-4 top-4 text-xs font-medium",
          finished ? "text-white" : "text-brand-green",
        )}
      >
        {finished ? "finished" : `${progressPercent.toFixed(0)}%`}
      </span>
    </div>
  );
}
