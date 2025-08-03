// src/components/ui/Skeleton.tsx
export default function Skeleton({
  className = "",
}: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-300/60 ${className}`}
    />
  );
}
