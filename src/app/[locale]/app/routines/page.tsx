/* ────────────────────────────────────────────────────────────────
 * PAGE : /{locale}/app/routines       (Server Component)
 * ----------------------------------------------------------------*/
import RoutineBoardClient   from "./RoutineBoardClient";
import NewRoutineSection    from "@/components/routines/NewRoutineSection";
import { prisma }           from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect }         from "next/navigation";
import { getServerT }       from "@/i18n/getServerT";

const DAY_LABEL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export default async function RoutinePage({
  params,                                 // ★ รับเป็น Promise
}: {
  params: Promise<{ locale: string }>;
}) {
  /* ① ต้อง await params ก่อนใช้ */
  const { locale } = await params;

  /* ② auth */
  const session = await getServerSession();
  if (!session) redirect("/login");

  const email = session.user.email ?? "";
  if (!email)
    return <p className="p-6 text-red-600">User e-mail missing.</p>;

  /* ③ query */
  const dbRoutines = await prisma.routine.findMany({
    where: { user: { email }, title: { not: "" } },
    orderBy: { id: "asc" },
  });

  const routines = dbRoutines.map((r) => ({
    ...r,
    startAt: r.startAt.toISOString(),
  }));

  /* ④ meta + translate */
  const todayIdx  = new Date().getDay();
  const todayName = DAY_LABEL[todayIdx];
  const t         = await getServerT(locale);

  /* ⑤ render */
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-xl font-semibold">
        {t("routine.today", { day: todayName })}
      </h1>

      <NewRoutineSection empty={routines.length === 0} />

      <RoutineBoardClient routines={routines} todayIdx={todayIdx} />
    </div>
  );
}
