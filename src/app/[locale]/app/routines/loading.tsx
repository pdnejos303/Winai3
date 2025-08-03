// ── src/app/[locale]/app/routine/loading.tsx
import RoutineRowSkeleton from "@/components/task/RoutineRowSkeleton";

export default function RoutineLoading() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <RoutineRowSkeleton key={i} />
      ))}
    </main>
  );
}
