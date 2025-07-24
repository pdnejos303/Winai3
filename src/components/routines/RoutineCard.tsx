/* ────────────────────────────────────────────────────────────────
 * FILE: src/components/routines/RoutineCard.tsx
 * DESC: การ์ด Routine (Client Component)
 *  - ปุ่ม Play / Pause / Done + Edit + Delete
 *  - จับเวลา → PATCH progressSec ↔ DB ทุก 15 s + ตอน pause / unmount / finish
 *  - ดีไซน์ตรง mockup: พื้นครีม, progress เหลือง, ปุ่มวงกลมฟ้า/มะกอก
 * ----------------------------------------------------------------*/

"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, CheckCircle, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

/* ---------- Props ---------- */
export interface RoutineCardProps {
  id: number;
  title: string;
  description?: string;          // ★ subtitle (optional)
  weekdays: number[] | null;
  startAt: string;               // ISO string
  durationSec: number;
  progressSec: number;
  finished: boolean;
}

const DAY = ["S", "M", "T", "W", "T", "F", "S"];
const THROTTLE_SEC = 15; // PATCH ทุก 15 s

export default function RoutineCard({
  id,
  title,
  description,
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

  /* ---------- API helpers ---------- */
  const patch = (data: Partial<{ progressSec: number; finished: boolean }>) =>
    fetch(`/api/routines/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

  const erase = () =>
    fetch(`/api/routines/${id}`, { method: "DELETE" }).then(() => location.reload());

  /* ---------- timer helpers ---------- */
  const clear = () => {
    if (timer.current) clearInterval(timer.current as unknown as number);
    timer.current = null;
  };

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
  const timeLabel = new Date((progress % 86_400) * 1_000)
    .toISOString()
    .substring(11, 19);
  const durationLabel =
    durationSec % 3600 === 0
      ? `${durationSec / 3600} Hour`
      : `${Math.round(durationSec / 60)} Min`;

  const chipActive = finished
    ? "bg-white text-emerald-600"
    : "bg-brand-green text-white";
  const chipInactive = "bg-gray-300 text-white/60";

  /* ---------- UI ---------- */
  return (
    <div className="relative flex items-center gap-3">
      {/* ── Card body ─────────────────────────────────────── */}
      <div className="flex-1 rounded-xl bg-[#FFFBEA] p-4 shadow-sm">
        {/* title + duration */}
        <div className="mb-1 flex items-baseline gap-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-2xl font-bold text-gray-300">{durationLabel}</span>
        </div>

        {description && (
          <p className="mb-1 text-sm text-gray-600">{description}</p>
        )}

        {/* weekday chips */}
        <div className="mb-2 flex gap-1">
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

        {/* counter */}
        <div className="mb-2 text-right text-sm text-gray-700">{timeLabel}</div>

        {/* progress bar */}
        <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#F5CF19] transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* ── Play / Pause / Done ───────────────────────────── */}
      <button
        onClick={toggle}
        disabled={finished}
        className={clsx(
          "grid h-12 w-12 flex-shrink-0 place-items-center rounded-full shadow",
          finished
            ? "bg-[#8BC6EC] text-white"
            : "bg-[#B9DEF3] text-white hover:brightness-110",
        )}
      >
        {finished ? (
          <CheckCircle size={20} strokeWidth={3} />
        ) : running ? (
          <Pause size={20} strokeWidth={3} />
        ) : (
          <Play size={20} strokeWidth={3} />
        )}
      </button>

      {/* ── Edit ──────────────────────────────────────────── */}
      <button
        onClick={() => console.log("edit", id)}
        className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-[#C3C700] text-white shadow hover:brightness-110"
        title="edit (stub)"
      >
        <Pencil size={20} />
      </button>

      {/* ── Delete (hover) ────────────────────────────────── */}
      <button
        onClick={erase}
        className="absolute -top-2 -right-2 hidden h-7 w-7 place-items-center rounded-full bg-red-500 p-[6px] text-white hover:bg-red-600 group-hover:grid sm:grid"
        title="delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
