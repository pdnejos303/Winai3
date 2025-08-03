// ── src/components/task/RoutineRowSkeleton.tsx
export default function RoutineRowSkeleton() {
  return (
    <div className="grid grid-cols-[40px_1fr_80px] gap-4 py-2 animate-pulse">
      <div className="h-4 w-4 rounded-full bg-gray-300" />
      <div className="h-4 w-full rounded bg-gray-300" />
      <div className="h-3 w-12 rounded bg-gray-300" />
    </div>
  );
}
