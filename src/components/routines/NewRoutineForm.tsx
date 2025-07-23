"use client";
import { useState } from "react";

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function NewRoutineForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [days, setDays] = useState<number[]>([]);
  const [minutes, setMinutes] = useState(60);

  const toggle = (i: number) =>
    setDays((d) => (d.includes(i) ? d.filter((n) => n !== i) : [...d, i]));

  async function save() {
    await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        weekdays: days,
        startTime: "18:00:00",
        durationSec: minutes * 60,
      }),
    });
    location.reload();
  }

  return (
    <div className="rounded-xl border bg-white/90 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold">New routine</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          ✕
        </button>
      </div>

      <input
        className="mb-3 w-full rounded border px-3 py-1"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <p className="mb-2 text-sm font-medium">Weekdays</p>
      <div className="mb-4 flex gap-1">
        {WEEK.map((d, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`h-8 w-8 rounded-full text-xs leading-8 ${
              days.includes(i)
                ? "bg-brand-green text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {d[0]}
          </button>
        ))}
      </div>

      <label className="mb-4 block text-sm font-medium">
        Duration&nbsp;(min)
        <input
          type="number"
          min={1}
          className="ml-2 w-20 rounded border px-2 py-0.5"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
      </label>

      <button
        disabled={!title || days.length === 0}
        onClick={save}
        className="rounded bg-brand-green px-4 py-2 text-white disabled:opacity-40"
      >
        Save
      </button>
    </div>
  );
}
