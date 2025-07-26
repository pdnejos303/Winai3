/* ───────────────────────────────────────────────────────────
 * ROUTE: /api/routines/[id]  (PATCH / DELETE)
 * NOTE: ต้องดึง params.id ก่อน await ใด ๆ  ➜ หาย warn
 * ---------------------------------------------------------*/
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ---------- PATCH --------------------------------------- */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  /* ⬇️ 1) ใช้ params.id ทันที (ก่อน await) */
  const id = Number(params.id);

  /* ⬇️ 2) ค่อย await body */
  const body = (await req.json()) as Partial<{
    progressSec: number;
    finished: boolean;
    title: string;
    durationSec: number;
    weekdays: number[];
    startAt: string;
  }>;

  const updated = await prisma.routine.update({
    where: { id },
    data: {
      progressSec: body.progressSec,
      finished: body.finished,
      title: body.title,
      durationSec: body.durationSec,
      weekdays: body.weekdays,
      startAt: body.startAt ? new Date(body.startAt) : undefined,
    },
  });

  return NextResponse.json(updated);
}

/* ---------- DELETE -------------------------------------- */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  /* ดึง params.id ก่อน await */
  const id = Number(params.id);

  await prisma.routine.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
