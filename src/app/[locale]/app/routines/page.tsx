/*  ROUTINES PAGE
    ─────────────────────────────────────────────────────────────────────────
    • ถ้ายังไม่มี routine   →  แสดง “Add routine” + ฟอร์มเปิดไว้
    • มี routine แล้ว       →  ปุ่มอยู่ด้านบน, ลิสต์การ์ดจับเวลาได้
    • ใช้ relation filter user.email แทน userId → ไม่พังแม้ session.user.id ไม่มี
    • กรอง title ที่ว่าง / null ออก
*/

import RoutineCard           from "@/components/routines/RoutineCard";
import NewRoutineSection     from "@/components/routines/NewRoutineSection";
import { prisma }            from "@/lib/prisma";
import { getServerSession }  from "next-auth/next";
import type { Routine }      from "@prisma/client";
import { revalidatePath }    from "next/cache";

/* server-action อัปเดต progress */
async function updateRoutine(id:number,data:Partial<Routine>){
  "use server";
  await prisma.routine.update({where:{id},data});
  revalidatePath("/app/routines");
}

/* ───────────── PAGE ───────────── */
export default async function RoutinePage() {
  const session = await getServerSession();
  if (!session) return <p className="p-6">Please login.</p>;

  /* -- ดึง routine ของ user (อ้างอิงจาก email) -- */
  const routines = await prisma.routine.findMany({
    where: {
      user:  { email: session.user.email ?? "" },
      title: { not: "" },                // ตัดสตริงว่าง
    },
    orderBy: { id: "asc" },
  });

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* ---------- ปุ่ม / ฟอร์มเพิ่มใหม่ ---------- */}
      <NewRoutineSection empty={routines.length === 0} />

      {/* ---------- ลิสต์การ์ด ---------- */}
      {routines.length > 0 && (
        <div className="grid w-full max-w-md gap-4">
          {routines.map((r) => (
            <RoutineCard
              key={r.id}
              {...r}
              onEdit={(id) => console.log("edit", id)}
              onUpdate={updateRoutine}
            />
          ))}
        </div>
      )}

      {/* ---------- ข้อความเมื่อยังไม่มี routine ---------- */}
      {routines.length === 0 && (
        <p className="text-sm text-gray-500">
          No routine yet — add one above!
        </p>
      )}
    </div>
  );
}
