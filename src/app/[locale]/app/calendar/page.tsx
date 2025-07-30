/* ------------------------------------------------------------------
 * FILE: src/app/[locale]/app/calendar/page.tsx
 * DESC: Calendar page – route  : /[locale]/app/calendar
 * ------------------------------------------------------------------
 * NOTES
 * 1. ใช้ dynamic import ปิด SSR เพราะ FullCalendar ใช้ DOM APIs
 * 2. ใส่ <Metadata> เพื่อ SEO & Head title
 * 3. className ใช้ Tailwind (มีในโปรเจกต์อยู่แล้ว)
 * ---------------------------------------------------------------- */
import dynamic from "next/dynamic";
import type { Metadata } from "next";

/** 🏷️  Metadata สำหรับ <head> */
export const metadata: Metadata = {
  title: "Task Calendar",
  description: "Overview of all tasks on a monthly calendar",
};

/** 🔀 dynamic import เพื่อหลีกเลี่ยง SSR Error ของ FullCalendar */
const CalendarBoard = dynamic(
  () => import("@/components/calendar/CalendarBoard"),
  {
    ssr: false,                     // 👉 ปิด SSR
    loading: () => <p>Loading…</p>, // 👉 ฟอลแบ็กตอนโหลด component
  },
);

/** 🌐 หน้า Calendar */
export default function CalendarPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Task Calendar</h1>

      {/*  calendar board (FullCalendar) */}
      <CalendarBoard />
    </main>
  );
}
