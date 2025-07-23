/* Path: src/components/routines/RoutineCard.tsx
   ---------------------------------------------------------------------------
   • Safeguard `weekdays` → treats null/undefined as []
   • Fix TypeScript "clearInterval(null)" overload
--------------------------------------------------------------------------- */

"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Check, Pencil } from "lucide-react";
import clsx from "clsx";

interface Props {
  id: number;
  title: string;
  weekdays: number[] | null;  // ← ปล่อยให้เป็น null ได้
  durationSec: number;
  progressSec: number;
  finished: boolean;
  onEdit?: (id: number) => void;
  onUpdate?: (
    id: number,
    data: Partial<Pick<Props, "progressSec" | "finished">>
  ) => void;
}

const DAY = ["S", "M", "T", "W", "T", "F", "S"];

export default function RoutineCard({
  id,
  title,
  weekdays,
  durationSec,
  progressSec: initProgress,
  finished: initFinished,
  onEdit,
  onUpdate,
}: Props) {
  /* ---------------- local state ---------------- */
  const [progress, setProgress] = useState(initProgress);
  const [finished, setFinished] = useState(initFinished);
  const [running, setRunning] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- helpers -------------------- */
  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current as unknown as number);
      timer.current = null;
    }
  };

  const toggleTimer = () => {
    if (running) {
      clearTimer();
      setRunning(false);
      return;
    }
    if (finished) return;

    timer.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 1;
        if (next >= durationSec) {
          clearTimer();
          setFinished(true);
          setRunning(false);
          onUpdate?.(id, { progressSec: durationSec, finished: true });
        }
        return Math.min(next, durationSec);
      });
    }, 1000) as unknown as NodeJS.Timeout;

    setRunning(true);
  };

  useEffect(() => () => clearTimer(), []);

  /* ---------------- visual helpers ------------- */
  const days = Array.isArray(weekdays) ? weekdays : [];
  const percent = (progress / durationSec) * 100;
  const barColor = finished ? "bg-emerald-600" : "bg-amber-400";
  const barBg = finished ? "bg-emerald-700/40" : "bg-amber-100";

  return (
    <div
      className={clsx(
        "relative flex flex-col gap-2 rounded-lg p-4 shadow",
        finished ? "bg-emerald-500 text-white" : "bg-brand-cream"
      )}
    >
      {/* header */}
      <div className="flex justify-between">
        <h3 className="truncate text-lg font-semibold">{title}</h3>
        <button
          onClick={toggleTimer}
          disabled={finished}
          className="rounded-full p-2 hover:bg-black/5 disabled:opacity-50"
        >
          {finished ? (
            <Check size={20} />
          ) : running ? (
            <Pause size={20} />
          ) : (
            <Play size={20} />
          )}
        </button>
      </div>

      {/* weekday chips */}
      <div className="flex gap-1">
        {DAY.map((lbl, idx) => (
          <span
            key={idx}
            className={clsx(
              "inline-block h-4 w-4 rounded-full text-center text-[10px] leading-4",
              days.includes(idx)
                ? finished
                  ? "bg-white text-emerald-600"
                  : "bg-brand-green text-white"
                : "bg-gray-300 text-white/70"
            )}
          >
            {lbl}
          </span>
        ))}
      </div>

      {/* progress bar */}
      <div className={clsx("h-3 overflow-hidden rounded-full", barBg)}>
        <div
          className={clsx("h-full transition-all", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* footer */}
      <div className="flex items-center justify-between text-xs font-medium">
        <span>
          {finished
            ? "finished"
            : new Date(progress * 1000).toISOString().substring(11, 19)}
        </span>
        <button onClick={() => onEdit?.(id)} aria-label="edit">
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
}
