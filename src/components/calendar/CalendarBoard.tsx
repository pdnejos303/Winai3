/* ------------------------------------------------------------------
 * FILE: src/components/calendar/CalendarBoard.tsx
 * DESC: แสดงปฏิทิน FullCalendar + โหลดข้อมูลผ่าน /api/events
 * ---------------------------------------------------------------- */
"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventInput } from "@fullcalendar/core";

/* ✅ import CSS ถูกต้องสำหรับ v6 */
import "@fullcalendar/daygrid/index.cjs"
export default function CalendarBoard() {
  /* -- state ---------------------------------------------------- */
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -- side-effect: โหลด events --------------------------------- */
  useEffect(() => {
    fetch("/api/events")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: EventInput[] = await res.json();
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load events");
        setLoading(false);
      });
  }, []);

  /* -- UI ------------------------------------------------------- */
  if (loading) return <p>Loading calendar…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}               // ✅ EventInput[]
        headerToolbar={{
          left:   "prev,next today",
          center: "title",
          right:  "dayGridMonth",
        }}
        firstDay={1}                  // สัปดาห์เริ่มวันจันทร์
        dayMaxEventRows={3}
      />
    </div>
  );
}
