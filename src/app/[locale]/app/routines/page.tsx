/* ────────────────────────────────────────────────────────────────
 * FILE:  src/app/[locale]/app/routines/page.tsx
 * PAGE:  /{locale}/app/routines
 * ROLE:
 *   1) ตรวจ session
 *   2) ดึง routine ทั้งหมดของผู้ใช้
 *   3) ส่งต่อให้ <RoutineBoardClient />  (client component)
 *      └ มีฟีเจอร์ Today / All toggle, search, sort, badge count ฯลฯ
 * ----------------------------------------------------------------*/

import RoutineBoardClient   from "./RoutineBoardClient";      // ★ ใช้ client board
import NewRoutineSection    from "@/components/routines/NewRoutineSection";
import { prisma }           from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect }         from "next/navigation";

/* array ชื่อวัน (เอาไว้โชว์ heading) */
const DAY_LABEL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export default async function RoutinePage() {
  /* ── 1) auth ─────────────────────────────────────────── */
  const session = await getServerSession();
  if (!session) redirect("/login");

  const email = session.user.email ?? "";
  if (!email) return <p className="p-6 text-red-600">User e-mail missing.</p>;

  /* ── 2) fetch routine ───────────────────────────────── */
  const dbRoutines = await prisma.routine.findMany({
    where: { user: { email }, title: { not: "" } },
    orderBy: { id: "asc" },
  });

  /*  แปลง startAt ให้เป็น string (client safe) */
  const routines = dbRoutines.map((r) => ({
    ...r,
    startAt: r.startAt.toISOString(),
  }));

  /* ── 3) meta: วันปัจจุบัน ──────────────────────────── */
  const todayIdx  = new Date().getDay();            // 0-6
  const todayName = DAY_LABEL[todayIdx];

  /* ── 4) render ─────────────────────────────────────── */
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* heading แสดงวันนี้ */}
      <h1 className="text-xl font-semibold">Today is {todayName}</h1>

      {/* ฟอร์มเพิ่ม (ยังคงใช้ได้เหมือนเดิม) */}
      <NewRoutineSection empty={routines.length === 0} />

      {/* ★ RoutineBoardClient จัดการ filter / search / sort / stats ทั้งหมด */}
      <RoutineBoardClient routines={routines} todayIdx={todayIdx} />
    </div>
  );
}
