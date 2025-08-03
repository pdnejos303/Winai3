/* ────────────────────────────────────────────────────────────────
 * PAGE : /{locale}/app/routines         (Server Component)
 * DESC : แสดง Routine Board + ฟอร์มเพิ่ม Routine
 * FLOW : ① อ่าน locale  → ② เช็ก auth  → ③ query Prisma
 *        ④ เตรียม i18n  → ⑤ เรนเดอร์ RoutineBoardClient
 * ----------------------------------------------------------------*/
import { prisma }           from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect }         from "next/navigation";
import { getServerT }       from "@/i18n/getServerT";

import RoutineBoardClient from "./RoutineBoardClient";
import NewRoutineSection  from "@/components/routines/NewRoutineSection";

/* ---------- ค่าคงที่ ---------- */
const DAY_LABEL = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
] as const;

/* ---------- Component (Server) ---------- */
export default async function RoutinePage({
  params,                     // ← มาเป็น object ธรรมดา
}: {
  params: { locale: string };
}) {
  /* ① locale */
  const { locale } = params;

  /* ② authentication */
  const session = await getServerSession();
  if (!session) redirect(`/${locale}/login`);

  const email = session.user.email ?? "";
  if (!email) {
    return (
      <p className="p-6 text-red-600">
        User e-mail missing. (Impossible state)
      </p>
    );
  }

  /* ③ query Prisma → routine list ของ user */
  const dbRoutines = await prisma.routine.findMany({
    where: { user: { email }, title: { not: "" } },
    orderBy: { id: "asc" },
  });

  /* แปลง Date → ISO string (จะถูกส่งไป client ผ่าน props) */
  const routines = dbRoutines.map((r) => ({
    ...r,
    startAt: r.startAt.toISOString(),
  }));

  /* ④ i18n & meta */
  const todayIdx  = new Date().getDay();        // 0-6
  const todayName = DAY_LABEL[todayIdx];
  const t         = await getServerT(locale);    // ฟังก์ชันแปล async

  /* ⑤ render */
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* วันนี้คือ… */}
      <h1 className="text-xl font-semibold">
        {t("routine.today", { day: todayName })}
      </h1>

      {/* ถ้า list ว่าง → section แนะนำให้เพิ่ม */}
      <NewRoutineSection empty={routines.length === 0} />

      {/* กระดาน routine – ฝั่ง client มี interactive drag / complete */}
      <RoutineBoardClient routines={routines} todayIdx={todayIdx} />
    </div>
  );
}
