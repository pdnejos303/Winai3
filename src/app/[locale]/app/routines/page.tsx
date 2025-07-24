/* ────────────────────────────────────────────────────────────────
 * ROUTINE PAGE – ดึง routine ของผู้ใช้ & เรนเดอร์ RoutineCard
 * ----------------------------------------------------------------
 * UPDATE:
 *   • เปลี่ยนจาก  <RoutineCard routine={r} />  →  ส่ง prop รายตัว
 *   • แปลง  startAt: Date  →  ISO string  ให้ตรงกับ RoutineCard
 * ---------------------------------------------------------------- */
import RoutineCard          from "@/components/routines/RoutineCard";
import NewRoutineSection    from "@/components/routines/NewRoutineSection";
import { prisma }           from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect }         from "next/navigation";

export default async function RoutinePage() {
  /* ---------- 1) Auth guard ---------- */
  const session = await getServerSession();
  if (!session) redirect("/login");

  /* ---------- 2) Query ---------- */
  const routines = await prisma.routine.findMany({
    where: {
      user: { email: session.user.email ?? "" },
      title: { not: "" },
    },
    orderBy: { id: "asc" },
  });

  /* ---------- 3) UI ---------- */
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-xl font-semibold">My Routines</h1>

      <NewRoutineSection empty={routines.length === 0} />

      {routines.length > 0 ? (
        <>
          <hr className="my-6 w-full border-gray-700" />
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {routines.map((r) => (
              <RoutineCard
                key={r.id}
                /* --------- prop รายตัวให้ตรง interface --------- */
                id={r.id}
                title={r.title}
                weekdays={r.weekdays}
                startAt={r.startAt.toISOString()}  // ← ต้องเป็น string
                durationSec={r.durationSec}
                progressSec={r.progressSec}
                finished={r.finished}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          No routine yet — add one above!
        </p>
      )}
    </div>
  );
}
