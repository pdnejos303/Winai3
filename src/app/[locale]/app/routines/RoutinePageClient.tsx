"use client";
import { useClientT } from "@/i18n/useClientT";
import RoutineCard from "@/components/routines/RoutineCard";

export interface Routine {
  id: number;
  title: string;
  weekdays: number[] | null;
  startAt: string;
  durationSec: number;
  progressSec: number;
  finished: boolean;
}

interface Props {
  routines: Routine[];
  todayName: string;
}

export default function RoutinePageClient({ routines, todayName }: Props) {
  const t = useClientT();

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-xl font-semibold">
        {t("routine.today", { day: todayName })}
      </h1>

      {routines.length ? (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {routines.map((r) => (
            <RoutineCard key={r.id} {...r} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">{t("routine.empty")}</p>
      )}
    </div>
  );
}
