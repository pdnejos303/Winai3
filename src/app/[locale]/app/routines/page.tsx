import RoutineCard       from "@/components/routines/RoutineCard";
import NewRoutineSection from "@/components/routines/NewRoutineSection";
import { prisma }        from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export default async function RoutinePage() {
  const session = await getServerSession();
  if (!session) return <p className="p-6">Please login.</p>;

  const routines = await prisma.routine.findMany({
    where: {
      user:  { email: session.user.email ?? "" },
      title: { not: "" },
    },
    orderBy: { id: "asc" },
  });

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-xl font-semibold">My Routines</h1>

      <NewRoutineSection empty={routines.length === 0} />

      {routines.length > 0 ? (
        <>
          <hr className="w-full max-w-md border-gray-200" />
          <div className="grid w-full max-w-md gap-4">
            {routines.map((r) => (
              <RoutineCard
                key={r.id}
                {...r}
                startAt={r.startAt.toISOString()}   {/* ← string ✓ */}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          No routine yet — add one above!
        </p>
      )}
    </div>
  );
}
