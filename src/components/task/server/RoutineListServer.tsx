// ─────────────────────────────────────────────────────────────
// FILE: src/components/task/server/RoutineListServer.tsx
// DESC: Server Component – ดึง Routine แล้วแสดงด้วย <RoutineCard/>
//       (แปลง startAt → ISO-string ให้ตรงกับ RoutineCardProps)
// ─────────────────────────────────────────────────────────────
import prisma from "@/lib/prisma";
import RoutineCard from "@/components/routines/RoutineCard";
import type { Routine } from "@prisma/client";

export default async function RoutineListServer() {
  /* ดึง Routine เรียงตาม updatedAt ล่าสุด */
  const routines: Routine[] = await prisma.routine.findMany({
    orderBy: { updatedAt: "desc" },
  });

  /* แสดงผลเป็นกริดการ์ด */
  return (
    <div className="grid gap-4">
      {routines.map((r) => (
        <RoutineCard
          key={r.id}
          /* ----- กระจายฟิลด์ โดยแปลง startAt (Date ➜ string) ----- */
          {...r}
          startAt={r.startAt.toISOString()}       // ✅ ตรง type string
        />
      ))}
    </div>
  );
}
