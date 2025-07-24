/* Client-side RoutineCard
   ──────────────────────────────────────────────────────────────── */

"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, CheckCircle, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

interface Props {
  id: number;
  title: string;
  weekdays: number[] | null;
  startAt: string;           // ISO string (server serialized)
  durationSec: number;
  progressSec: number;
  finished: boolean;
}

const DAY = ["S", "M", "T", "W", "T", "F", "S"];

export default function RoutineCard({
  id,
  title,
  weekdays,
  startAt,
  durationSec,
  progressSec: initProgress,
  finished: initFinished,
}: Props) {
  /* state ---------------------------- */
  const [progress, setProgress] = useState(initProgress);
  const [finished, setFinished] = useState(initFinished);
  const [running,  setRunning]  = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  /* helpers -------------------------- */
  const clearTimer = () => {
    if (timer.current) clearInterval(timer.current as unknown as number);
    timer.current = null;
  };

  const patchRoutine = (data: Partial<{ progressSec: number; finished: boolean }>) =>
    fetch(`/api/routines/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

  const deleteRoutine = () =>
    fetch(`/api/routines/${id}`, { method: "DELETE" }).then(() => location.reload());

  const tick = () =>
    setProgress((p) => {
      const next = p + 1;
      if (next >= durationSec) {
        clearTimer();
        setFinished(true);
        setRunning(false);
        patchRoutine({ progressSec: durationSec, finished: true });
      }
      return Math.min(next, durationSec);
    });

  const toggle = () => {
    if (running) return clearTimer(), setRunning(false);
    if (finished) return;
    timer.current = setInterval(tick, 1_000) as unknown as NodeJS.Timeout;
    setRunning(true);
  };

  useEffect(() => () => clearTimer(), []);

  /* visual derived ------------------- */
  const percent = durationSec ? Math.min(100, (progress / durationSec) * 100) : 0;
  const timeLabel = new Date((progress % 86_400) * 1000)
    .toISOString()
    .substring(11, 19);

  const chips = Array.isArray(weekdays) ? weekdays : [];
  const chipActive =
    finished ? "bg-white text-emerald-600" : "bg-brand-green text-white";
  const chipInactive = "bg-gray-300 text-white/60";

  return (
    <div
      className={clsx(
        "group relative rounded-xl border shadow-sm ring-1 ring-black/5 backdrop-blur",
        finished ? "bg-emerald-500" : "bg-white/90",
      )}
    >
      {/* hover buttons ------------------------------------ */}
      <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
        <button
          onClick={deleteRoutine}
          className="rounded bg-red-500/80 p-1 text-white hover:bg-red-500"
          aria-label="delete"
        >
          <Trash2 size={14} />
        </button>
        {/* placeholder edit – open console for now */}
        <button
          onClick={() => console.log("edit", id)}
          className="rounded bg-brand-green/80 p-1 text-white hover:bg-brand-green"
          aria-label="edit"
        >
          <Pencil size={14} />
        </button>
      </div>

      {/* header row -------------------------------------- */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3
          className={clsx(
            "max-w-[70%] truncate text-base font-semibold",
            finished && "text-white",
          )}
        >
          {title}
        </h3>
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
          {finished ? (
            <CheckCircle size={18} strokeWidth={3} />
          ) : running ? (
            <Pause size={18} strokeWidth={3} />
          ) : (
            <Play size={18} strokeWidth={3} />
          )}
        </button>
      </div>

      {/* weekdays ---------------------------------------- */}
      <div className="flex gap-1 px-4 pb-1">
        {DAY.map((d, i) => (
          <span
            key={i}
            className={clsx(
              "inline-block h-5 w-5 rounded-full text-center text-[10px] leading-5",
              chips.includes(i) ? chipActive : chipInactive,
            )}
          >
            {d}
          </span>
        ))}
      </div>

      {/* progress bar ------------------------------------ */}
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

      {/* footer ------------------------------------------ */}
      <div className="flex items-center justify-between px-4 pb-4 text-xs font-medium">
        <span>{finished ? "finished" : timeLabel}</span>
        <span title={`Start: ${startAt.replace("T", " ").substring(0, 19)}`} />
      </div>
    </div>
  );
}
