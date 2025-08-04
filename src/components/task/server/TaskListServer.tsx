// ─────────────────────────────────────────────────────────────
// FILE: src/components/task/server/TaskListServer.tsx
// DESC: Preload tasks + categories ที่เซิร์ฟเวอร์ แล้วส่งลง TaskGrid
// ─────────────────────────────────────────────────────────────
import prisma from "@/lib/prisma";
import TaskGrid, { type TaskWithCat } from "@/components/task/TaskGrid";

export default async function TaskListServer() {
  const [tasks, categories] = await Promise.all([
    prisma.task.findMany({ include: { category: true } }),
    prisma.category.findMany(),
  ]);

  return (
    <TaskGrid
      initialTasks={tasks as TaskWithCat[]}
      initialCategories={categories}
    />
  );
}
