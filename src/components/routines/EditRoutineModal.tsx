"use client";

import { useEffect, useRef } from "react";
import { DAY_LABEL } from "../../lib/const-day";
import clsx from "clsx";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  routine: {
    id: number;
    title: string;
    durationSec: number;
    weekdays: number[];
  };
  onSaved?: () => void;
}

export default function EditRoutineModal({
  open,
  setOpen,
  routine,
  onSaved,
}: Props) {
  const dlgRef = useRef<HTMLDialogElement>(null);

  /* sync prop → dialog (แก้ no-unused-expressions) */
  useEffect(() => {
    const dlg = dlgRef.current;
    if (!dlg) return;
    if (open) {
      dlg.showModal();
    } else {
      dlg.close();
    }
  }, [open]);

  /* ---------- submit ---------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const title    = String(fd.get("title")).trim();
    const minutes  = Number(fd.get("minutes"));
    const weekdays = DAY_LABEL.map((_, idx: number) =>
      fd.get(`d${idx}`) ? idx : undefined,
    ).filter((n): n is number => n !== undefined);

    await fetch(`/api/routines/${routine.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        durationSec: minutes * 60,
        weekdays,
      }),
    });

    onSaved?.();
    setOpen(false);
  }

  return (
    <dialog
      ref={dlgRef}
      className="rounded-xl p-0 shadow-xl backdrop:bg-black/40"
      onClose={() => setOpen(false)}
    >
      {/* header */}
      <div className="border-b px-6 py-3 text-lg font-semibold">Edit routine</div>

      {/* form */}
      <form className="space-y-4 p-6" onSubmit={handleSubmit}>
        {/* title */}
        <label className="block">
          <span className="mb-1 block text-sm">Title</span>
          <input
            name="title"
            defaultValue={routine.title}
            className="w-full rounded border px-3 py-2"
            required
          />
        </label>

        {/* duration */}
        <label className="block">
          <span className="mb-1 block text-sm">Duration (minutes)</span>
          <input
            name="minutes"
            type="number"
            min={1}
            defaultValue={Math.round(routine.durationSec / 60)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </label>

        {/* weekdays */}
        <fieldset>
          <legend className="mb-1 text-sm">Weekdays</legend>
          <div className="flex flex-wrap gap-2">
            {DAY_LABEL.map((day: string, idx: number) => (
              <label
                key={idx}
                className={clsx(
                  "flex items-center gap-1 rounded px-2 py-1",
                  routine.weekdays.includes(idx)
                    ? "bg-brand-green text-white"
                    : "bg-gray-200",
                )}
              >
                <input
                  type="checkbox"
                  name={`d${idx}`}
                  defaultChecked={routine.weekdays.includes(idx)}
                />
                <span className="text-xs">{day.slice(0, 3)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* footer */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-brand-green px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}
