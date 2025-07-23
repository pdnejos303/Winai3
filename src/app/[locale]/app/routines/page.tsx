/* Path: src/components/routines/RoutineCard.tsx
   ---------------------------------------------------------------------------
   • ป้องกัน invalid data ⇒ fallback
   • สี-สัน & ขนาดปรับใหม่ → ดู “การ์ด” ชัดขึ้น
   • แถบ Progress มี animation
   • Tooltip title เมื่อ hover
--------------------------------------------------------------------------- */

"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, CheckCircle, Pencil } from "lucide-react";
import clsx from "clsx";

interface Props {
  id: number;
  title: string;
  weekdays: number[] | null; // 0–6
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
  const [progress, setProgress] = useState(initProgress);
  const [finished, setFinished] = useState(initFinished);
  const [running, setRunning] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- helpers ---------------- */
  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current as unknown as number);
      timer.current = null;
    }
  };

  const tick = () =>
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

  const toggleTimer = () => {
    if (running) {
      clearTimer();
      setRunning(false);
      return;
    }
    if (finished) return;

    timer.current = setInterval(tick, 1_000) as unknown as NodeJS.Timeout;
    setRunning(true);
  };

  useEffect(() => () => clearTimer(), []);

  /* ---------------- visual helpers -------- */
  const days = Array.isArray(weekdays) ? weekdays : [];
  const percent =
    durationSec > 0 ? Math.min(100, (progress / durationSec) * 100) : 0;

  const timeLabel = new Date(((progress ?? 0) % 86_400) * 1000)
    .toISOString()
    .substring(11, 19);

  /* color scheme */
  const cardBg = finished ? "bg-emerald-500" : "bg-white/90";
  const chipActive = finished ? "bg-white text-emerald-600" : "bg-brand-green text-white";
  const chipInactive = "bg-gray-300 text-white/60";

  return (
    <div
      className={clsx(
        "relative rounded-xl border shadow-sm ring-1 ring-black/5 backdrop-blur",
        cardBg
      )}
      title={title}
    >
      {/* top row */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className={clsx("max-w-[70%] truncate text-base font-semibold", finished && "text-white")}>
          {title}
        </h3>

        <button
          onClick={toggleTimer}
          disabled={finished}
          className={clsx(
            "grid h-8 w-8 place-items-center rounded-full transition",
            finished
              ? "bg-white/20 text-white"
              : "bg-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white"
          )}
          aria-label="toggle timer"
        >
          {finished ? (
            <CheckCircle size={18} strokeWidth={3} />
          ) : running ? (
            <Pause size={18} strokeWidth={3} />
          ) : (
            <Play size={18} strokeWidth={3} />
          )}
        </button>
      </div>

      {/* weekday chips */}
      <div className="flex gap-1 px-4 pb-1">
        {DAY.map((lbl, i) => (
          <span
            key={i}
            className={clsx(
              "inline-block h-5 w-5 rounded-full text-center text-[10px] leading-5",
              days.includes(i) ? chipActive : chipInactive
            )}
          >
            {lbl}
          </span>
        ))}
      </div>

      {/* progress bar */}
      <div className="px-4 pb-3">
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200/80">
          <div
            className={clsx(
              "h-full origin-left rounded-full transition-[width] duration-300 ease-out",
              finished ? "bg-emerald-600" : "bg-amber-400"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between px-4 pb-4 text-xs font-medium">
        <span>{finished ? "finished" : timeLabel}</span>

        <button
          onClick={() => onEdit?.(id)}
          aria-label="edit routine"
          className="text-gray-500 hover:text-brand-green"
        >
          <Pencil size={14} />
        </button>
      </div>
    </div>
  );
}
