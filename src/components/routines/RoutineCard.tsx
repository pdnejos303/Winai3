/* ────────────────────────────────────────────────────────────────
 * FILE: src/components/routines/RoutineCard.tsx
 * DESC: การ์ด routine (Client Component)
 *  - ปุ่ม Play / Pause / Done + Edit + Delete
 *  - จับเวลาแล้วบันทึก progress ↔ DB
 *  - Throttle PATCH ทุก 15 s  + save ตอน pause / unmount / finish
 *  - Edit: เปลี่ยนชื่อ + นาที  (prompt เวอร์ชันเร็ว)  → PATCH → reload
 * ----------------------------------------------------------------*/

"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, CheckCircle, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

/* ---------- Props ---------- */
export interface RoutineCardProps {
  id: number;
  title: string;
  weekdays: number[] | null;
  startAt: string;      // ISO string
  durationSec: number;
  progressSec: number;
  finished: boolean;
}

const DAY = ["S", "M", "T", "W", "T", "F", "S"];
const THROTTLE_SEC = 15;

export default function RoutineCard({
  id,
  title,
  weekdays,
  startAt,
  durationSec,
  progressSec: initProgress,
  finished: initFinished,
}: RoutineCardProps) {
  /* ---------- state ---------- */
  const [progress, setProgress] = useState(initProgress);
  const [finished, setFinished] = useState(initFinished);
  const [running, setRunning] = useState(false);

  /* ---------- refs ---------- */
  const timer = useRef<NodeJS.Timeout | null>(null);
  const throttle = useRef(0);

  /* ---------- API ---------- */
  const patch = (data: Partial<{ progressSec: number; finished: boolean; title: string; durationSec: number }>) =>
    fetch(`/api/routines/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

  const erase = () =>
    fetch(`/api/routines/${id}`, { method: "DELETE" }).then(() => location.reload());

  /* ---------- timer logic ---------- */
  const clear = () => timer.current && clearInterval(timer.current as unknown as number);

  const commitStop = async (p: number, done = false) => {
    clear();
    setRunning(false);
    await patch({ progressSec: p, finished: done });
  };

  const tick = () =>
    setProgress((prev) => {
      const next = prev + 1;
      throttle.current += 1;
      if (throttle.current >= THROTTLE_SEC) {
        throttle.current = 0;
        patch({ progressSec: next });
      }
      if (next >= durationSec) {
        setFinished(true);
        commitStop(durationSec, true);
        return durationSec;
      }
      return next;
    });

  const toggle = () => {
    if (running) return commitStop(progress);
    if (finished) return;
    throttle.current = 0;
    timer.current = setInterval(tick, 1_000) as unknown as NodeJS.Timeout;
    setRunning(true);
  };

  /* ---------- NEW: handleEdit ---------- */
  async function handleEdit() {
    const newTitle = prompt("Edit title:", title);
    if (!newTitle || newTitle.trim() === title) return;

    const newMin = prompt("Duration (minutes):", String(Math.round(durationSec / 60)));
    if (!newMin || isNaN(Number(newMin))) return;

    await patch({ title: newTitle.trim(), durationSec: Number(newMin) * 60 });
    location.reload();
  }

  /* save on unmount */
  useEffect(
    () => () => {
      if (running || progress !== initProgress) commitStop(progress, finished);
      clear();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* ---------- derived visual ---------- */
  const percent = durationSec ? Math.min(100, (progress / durationSec) * 100) : 0;
  const timeLabel = new Date((progress % 86_400) * 1_000).toISOString().substring(11, 19);

  const chipActive = finished ? "bg-white text-emerald-600" : "bg-brand-green text-white";
  const chipInactive = "bg-gray-300 text-white/60";

  /* ---------- UI ---------- */
  return (
    <div
      className={clsx(
        "rounded-xl border shadow-sm ring-1 ring-black/5 backdrop-blur",
        finished ? "bg-emerald-500" : "bg-white/90",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3">
        <h3 className={clsx("max-w-[60%] truncate text-base font-semibold", finished && "text-white")}>
          {title}
        </h3>

        <div className="flex items-center gap-1">
          {/* Play / Pause / Done */}
          <button
            onClick={toggle}
            disabled={finished}
            className={clsx(
              "grid h-8 w-8 place-items-center rounded-full transition",
              finished
                ? "bg-white/20 text-white"
                : "bg-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white",
            )}
          >
            {finished ? <CheckCircle size={18} strokeWidth={3} /> : running ? <Pause size={18} strokeWidth={3} /> : <Play size={18} strokeWidth={3} />}
          </button>

          {/* Edit */}
          <button
            onClick={handleEdit}
            className="rounded bg-brand-green/80 p-1 text-white hover:bg-brand-green"
            aria-label="edit"
          >
            <Pencil size={14} />
          </button>

          {/* Delete */}
          <button
            onClick={erase}
            className="rounded bg-red-500/80 p-1 text-white hover:bg-red-500"
            aria-label="delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Weekday chips */}
      <div className="flex gap-1 px-4 pb-1">
        {DAY.map((d, i) => (
          <span
            key={i}
            className={clsx(
              "inline-block h-5 w-5 rounded-full text-center text-[10px] leading-5",
              (weekdays ?? []).includes(i) ? chipActive : chipInactive,
            )}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200/80">
          <div
            className={clsx(
              "h-full origin-left rounded-full transition-[width] duration-300 ease-out",
              finished ? "bg-emerald-600" : "bg-amber-400",
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pb-4 text-xs font-medium">
        <span>{finished ? "finished" : timeLabel}</span>
        <span title={`Start: ${startAt.replace("T", " ").substring(0, 19)}`} />
      </div>
    </div>
  );
}
