"use client";

/*  RoutineBoardClient
 *  รวม toolbar + routine list + logic filter/search/sort
 * ----------------------------------------------------------------*/

import { useMemo, useState } from "react";
import RoutineCard from "@/components/routines/RoutineCard";
import clsx        from "clsx";
import { useClientT } from "@/i18n/useClientT";           // ★– i18n hook

/* ---------- prop type (ตรงกับ page.tsx) ---------- */
interface Routine {
  id: number;
  title: string;
  weekdays: number[] | null;
  startAt: string;          // iso
  durationSec: number;
  progressSec: number;
  finished: boolean;
}
interface Props {
  routines: Routine[];
  todayIdx: number;         // 0-6
}

/* ---------- helper ---------- */
function formatTotal(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h ? `${h} h ` : ""}${m} m`;
}

/* ─────────────────────────────────────────────────────────── */
export default function RoutineBoardClient({ routines, todayIdx }: Props) {
  const t = useClientT();                                 // ★– translator

  /* state */
  const [showToday, setShowToday] = useState(true);
  const [query, setQuery]         = useState("");
  const [sortKey, setSortKey]     = useState<"new"|"old"|"long">("new");

  /* filtered / sorted list */
  const list = useMemo(() => {
    /* 1) today filter */
    let arr = showToday
      ? routines.filter((r) =>
          (r.weekdays ?? []).includes(todayIdx)
        )
      : routines;

    /* 2) search */
    if (query.trim())
      arr = arr.filter((r) =>
        r.title.toLowerCase().includes(query.trim().toLowerCase()),
      );

    /* 3) sort */
    arr = [...arr]; // clone
    switch (sortKey) {
      case "new":  arr.sort((a,b)=>b.id-a.id); break;
      case "old":  arr.sort((a,b)=>a.id-b.id); break;
      case "long": arr.sort((a,b)=>b.durationSec-a.durationSec); break;
    }
    return arr;
  }, [routines, showToday, query, sortKey, todayIdx]);

  /* total duration sec */
  const totalSec = list.reduce((s,r)=>s+r.durationSec,0);

  /* labels (i18n) ------------------------------------ */
  const countLabel =
    list.length === 1
      ? t("routine.summary.single")
      : t("routine.summary.many", { count: list.length });

  const totalLabel = t("routine.summary.total", { time: formatTotal(totalSec) });

  /* ---------- UI ---------- */
  return (
    <div className="w-full space-y-4">
      {/* ── Toolbar ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {/* left group */}
        <div className="flex flex-wrap items-center gap-2">

          {/* toggle Today/All */}
          <div className="rounded-lg bg-gray-200 p-1">
            {[t("routine.filter.today"), t("routine.filter.all")].map((lbl,i)=>(
              <button
                key={i}
                onClick={()=>setShowToday(i===0)}
                className={clsx(
                  "rounded-md px-3 py-1 text-sm",
                  (showToday?(i===0):(i===1))
                    ? "bg-brand-green text-white shadow"
                    : "text-gray-600 hover:bg-white",
                )}
              >
                {lbl}
              </button>
            ))}
          </div>

          {/* search */}
          <input
            type="text"
            placeholder={t("common.search")}
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            className="w-44 rounded border px-2 py-1 text-sm shadow-inner focus:outline-brand-green"
          />

          {/* sort */}
          <select
            value={sortKey}
            onChange={(e) =>
              setSortKey(e.target.value as "new" | "old" | "long")
            }
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="new">{t("routine.sort.newest")}</option>
            <option value="old">{t("routine.sort.oldest")}</option>
            <option value="long">{t("routine.sort.longest")}</option>
          </select>
        </div>

        {/* right group (stats) */}
        <div className="flex items-center gap-3">
          <span className="rounded bg-brand-green/20 px-2 py-1 text-xs text-brand-green">
            {countLabel}
          </span>
          <span className="text-xs text-gray-500">{totalLabel}</span>
        </div>
      </div>

      {/* ── List grid ─────────────────────────────────────── */}
      {list.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {list.map((r) => (
            <RoutineCard
              key={r.id}
              id={r.id}
              title={r.title}
              weekdays={r.weekdays}
              startAt={r.startAt}
              durationSec={r.durationSec}
              progressSec={r.progressSec}
              finished={r.finished}
            />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-gray-500">
          {t("routine.noMatch")}
        </p>
      )}
    </div>
  );
}
