/* Client-side RoutineCard
   ────────────────────────────────────────────────────────────────
   CHANGE LOG
   • ปุ่ม Delete / Edit อยู่ใน header ด้านขวา (ไม่ overlay บนการ์ด)
   • บันทึก progressSec → PATCH ทุกครั้งที่กด “หยุด”, “เสร็จ”, หรือ unmount
   • throttle การส่ง patch ทุก 15 วินาทีขณะวิ่ง (กัน spam)
   • refactor เล็กน้อยให้โค้ดอ่านง่าย
*/

"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, CheckCircle, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

/* ---------- Props ---------- */
interface Props {
  id: number;
  title: string;
  weekdays: number[] | null;
  startAt: string;      // ISO string
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
  /* ---------- state ---------- */
  const [progress, setProgress] = useState(initProgress);
  const [finished, setFinished] = useState(initFinished);
  const [running, setRunning] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const sinceLastPatch = useRef(0);               // ส่ง patch ทุก 15 s

  /* ---------- helpers ---------- */
  const patchRoutine = (data: Partial<{ progressSec: number; finished: boolean }>) =>
    fetch(`/api/routines/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

  const deleteRoutine = () =>
    fetch(`/api/routines/${id}`, { method: "DELETE" }).then(() => location.reload());

  const clearTimer = () => {
    if (timer.current) clearInterval(timer.current as unknown as number);
    timer.current = null;
  };

  const saveAndStop = async (p: number, done = false) => {
    clearTimer();
    setRunning(false);
    await patchRoutine({ progressSec: p, finished: done });
  };

  /* ---------- ticking ---------- */
  const tick = () =>
    setProgress((prev) => {
      const next = prev + 1;

      // throttle patch: ทุก 15 วินาที
      sinceLastPatch.current += 1;
      if (sinceLastPatch.current >= 15) {
        sinceLastPatch.current = 0;
        patchRoutine({ progressSec: next });
      }

      // ครบเวลา
      if (next >= durationSec) {
        setFinished(true);
        saveAndStop(durationSec, true);
        return durationSec;
      }
      return next;
    });

  const toggle = () => {
    if (running) return saveAndStop(progress);    // กด pause ⇒ บันทึก

    if (finished) return;                         // เสร็จแล้วกดไม่ทำอะไร
    sinceLastPatch.current = 0;
    timer.current = setInterval(tick, 1_000) as unknown as NodeJS.Timeout;
    setRunning(true);
  };

  // clear / save เมื่อ unmount
  useEffect(
    () => () => {
      if (running || progress !== initProgress) saveAndStop(progress, finished);
      clearTimer();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* ---------- derived visual ---------- */
  const percent = durationSec ? Math.min(100, (progress / durationSec) * 100) : 0;
  const timeLabel = new Date((progress % 86_400) * 1_000)
    .toISOString()
    .substring(11, 19);

  const chipActive =
    finished ? "bg-white text-emerald-600" : "bg-brand-green text-white";
  const chipInactive = "bg-gray-300 text-white/60";

  /* ---------- render ---------- */
  return (
    <div
      className={clsx(
        "rounded-xl border shadow-sm ring-1 ring-black/5 backdrop-blur",
        finished ? "bg-emerald-500" : "bg-white/90",
      )}
    >
      {/* header --------------------------------------------------- */}
      <div className="flex items-start justify-between px-4 py-3">
        <h3
          className={clsx(
            "max-w-[60%] truncate text-base font-semibold",
            finished && "text-white",
          )}
        >
          {title}
        </h3>

        {/* ปุ่ม action 3 ชิ้น */}
        <div className="flex items-center gap-1">
          {/* play / pause / done */}
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

          {/* edit */}
          <button
            onClick={() => console.log("edit", id)}
            className="rounded bg-brand-green/80 p-1 text-white hover:bg-brand-green"
            aria-label="edit"
          >
            <Pencil size={14} />
          </button>

          {/* delete */}
          <button
            onClick={deleteRoutine}
            className="rounded bg-red-500/80 p-1 text-white hover:bg-red-500"
            aria-label="delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* weekdays ------------------------------------------------- */}
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

      {/* progress bar -------------------------------------------- */}
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

      {/* footer --------------------------------------------------- */}
      <div className="flex items-center justify-between px-4 pb-4 text-xs font-medium">
        <span>{finished ? "finished" : timeLabel}</span>
        <span title={`Start: ${startAt.replace("T", " ").substring(0, 19)}`} />
      </div>
    </div>
  );
}
