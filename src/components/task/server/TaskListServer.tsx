// ─────────────────────────────────────────────────────────────
// SERVER fetcher – คืน TaskGrid พร้อม props ที่ถูกต้อง
// ─────────────────────────────────────────────────────────────
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import TaskGrid from "@/components/task/TaskGrid";

export default async function TaskListServer() {
  const session = await getServerSession();
  if (!session) return null;                 // จะ redirect ที่ page อยู่แล้ว

  const email = session.user.email!;
  /* --- ดึง tasks + categories ของผู้ใช้เดียวกัน --- */
  const [tasks, categories] = await Promise.all([
    prisma.task.findMany({
      where: { user: { email } },
      include: { category: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.category.findMany({ where: { user: { email } } }),
  ]);

  /* --- ส่ง prop ชื่อ initialTasks --- */
  return (
    <TaskGrid
      initialTasks={tasks}
      categories={categories}
    />
  );
}
