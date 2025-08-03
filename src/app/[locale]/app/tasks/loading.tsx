// ── src/app/[locale]/app/tasks/loading.tsx
import TaskCardSkeleton from "@/components/task/TaskCardSkeleton";

export default function TasksLoading() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
