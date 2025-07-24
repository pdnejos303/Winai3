"use client";
import { useState } from "react";

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function NewRoutineForm({ onClose }: { onClose(): void }) {
  const [title, setTitle] = useState("");
  const [days,  setDays]  = useState<number[]>([]);
  const [date,  setDate]  = useState(
    new Date().toISOString().substring(0, 10),
  );
  const [time,  setTime]  = useState("18:00");
  const [min,   setMin]   = useState(60);

  const toggle = (i:number) =>
    setDays((d)=> d.includes(i) ? d.filter(n=>n!==i) : [...d,i]);

  async function save() {
    await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        title,
        weekdays: days,
        date,
        time,
        durationSec: min * 60,
      }),
    });
    location.reload();
  }

  return (
    <div className="rounded-xl border bg-white/90 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold">New routine</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">✕</button>
      </div>

      {/* title */}
      <input
        className="mb-3 w-full rounded border px-3 py-1"
        placeholder="Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        required
      />

      {/* weekdays */}
      <p className="mb-2 text-sm font-medium">Weekdays</p>
      <div className="mb-4 flex gap-1">
        {WEEK.map((d,i)=>(
          <button
            key={i}
            type="button"
            onClick={()=>toggle(i)}
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

      {/* date & time */}
      <div className="mb-4 flex gap-4">
        <label className="text-sm font-medium">
          Date
          <input type="date" value={date}
            onChange={(e)=>setDate(e.target.value)}
            className="ml-2 rounded border px-2 py-0.5"
          />
        </label>
        <label className="text-sm font-medium">
          Time
          <input type="time" value={time}
            onChange={(e)=>setTime(e.target.value)}
            className="ml-2 rounded border px-2 py-0.5"
          />
        </label>
      </div>

      {/* duration */}
      <label className="mb-4 block text-sm font-medium">
        Duration&nbsp;(min)
        <input type="number" min={1} value={min}
          onChange={(e)=>setMin(Number(e.target.value))}
          className="ml-2 w-20 rounded border px-2 py-0.5"
        />
      </label>

      <button
        disabled={!title || days.length===0}
        onClick={save}
        className="rounded bg-brand-green px-4 py-2 text-white disabled:opacity-40"
      >
        Save
      </button>
    </div>
  );
}
