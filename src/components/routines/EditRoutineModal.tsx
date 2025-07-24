/* ────────────────────────────────────────────────────────────────
 * EditRoutineModal – ใช้ shadcn/ui Dialog (หรือ Headless UI ก็ได้)
 * ----------------------------------------------------------------*/
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (b: boolean) => void;

  /* ค่าเริ่มต้นของ routine */
  id: number;
  title: string;
  durationSec: number;
  weekdays: number[];
  startAt: string;
  onSaved?: () => void; // callback reload
}

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EditRoutineModal({
  open,
  setOpen,
  id,
  title: initTitle,
  durationSec: initDur,
  weekdays: initWD,
  startAt,
  onSaved,
}: Props) {
  /* ─ state form ─ */
  const [title, setTitle] = useState(initTitle);
  const [minutes, setMinutes] = useState(String(Math.round(initDur / 60)));
  const [weekdays, setWeekdays] = useState<Set<number>>(new Set(initWD));

  const toggleDay = (d: number) =>
    setWeekdays((s) => {
      const c = new Set(s);
      c.has(d) ? c.delete(d) : c.add(d);
      return c;
    });

  /* ─ submit ─ */
  async function handleSave() {
    await fetch(`/api/routines/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        durationSec: Number(minutes) * 60,
        weekdays: [...weekdays],
        startAt,
      }),
    });
    onSaved?.();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit routine</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <Input
            label="Duration (minutes)"
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {DAY.map((d, i) => (
              <Checkbox
                key={i}
                checked={weekdays.has(i)}
                onCheckedChange={() => toggleDay(i)}
                label={d}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
