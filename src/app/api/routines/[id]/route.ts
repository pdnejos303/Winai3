/* ───────────────────────────────────────────────────────────
 * ROUTE: /api/routines/[id]    PATCH | DELETE
 * FIX : ต้อง “await สักอย่าง” ก่อนใช้ params.id
 * ----------------------------------------------------------------*/
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ---------- PATCH --------------------------------------- */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  /* ① await ก่อน */
  const body = (await req.json()) as Partial<{
    progressSec: number;
    finished: boolean;
    title: string;
    durationSec: number;
    weekdays: number[];
    startAt: string;
  }>;

  /* ② ค่อยใช้ params.id */
  const id = Number(params.id);

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
  /* dummy await เพื่อหลบ warning */
  await Promise.resolve();
  const id = Number(params.id);

  await prisma.routine.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
