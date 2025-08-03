// ─────────────────────────────────────────────────────────────
// SERVER fetcher สำหรับ Routine
// ─────────────────────────────────────────────────────────────
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import RoutineTable from "@/components/routines/RoutineTable";  // ✅ path ใหม่
//                              └─📂 s          └─ RoutineTable.tsx

export default async function RoutineListServer() {
  const session = await getServerSession();
  if (!session) return null;

  const email = session.user.email!;
  const routines = await prisma.routine.findMany({
    where: { user: { email } },
    include: { RoutineLog: true },
    orderBy: { startAt: "asc" },
  });

  return <RoutineTable routines={routines} />;
}
