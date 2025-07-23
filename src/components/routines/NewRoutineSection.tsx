"use client";
import { useState } from "react";
import NewRoutineForm from "./NewRoutineForm";

export default function NewRoutineSection({ empty }: { empty: boolean }) {
  const [open, setOpen] = useState(empty);

  return open ? (
    <NewRoutineForm onClose={() => setOpen(false)} />
  ) : (
    <button
      onClick={() => setOpen(true)}
      className="mx-auto mb-6 flex items-center gap-2 rounded-lg border-2 border-dashed border-brand-green px-4 py-2 text-brand-green hover:bg-brand-green/10"
    >
      <span className="text-lg leading-none">＋</span> Add routine
    </button>
  );
}
