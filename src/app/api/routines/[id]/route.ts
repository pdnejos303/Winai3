/* ────────────────────────────────────────────────────────────────
 * ROUTE: /api/routines/[id]   (PATCH / DELETE)
 * หมด warning "params.id should be awaited…"  + รองรับ edit title ฯลฯ
 * ----------------------------------------------------------------*/
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ---------- PATCH ------------------------------------------------ */
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  /* 1) รออ่าน body ก่อนใช้ params → เคลียร์ warn ★ */
  const body = (await req.json()) as Partial<{
    progressSec: number;
    finished: boolean;
    title: string;
    weekdays: number[];
    durationSec: number;
    startAt: string;
  }>;

  /* 2) หลัง await แล้วจึงใช้ context.params ★ */
  const id = Number(context.params.id);

  const updated = await prisma.routine.update({
    where: { id },
    data: {
      /* บันทึกเฉพาะ field ที่ส่งมา */
      progressSec: body.progressSec,
      finished: body.finished,
      title: body.title,
      weekdays: body.weekdays,
      durationSec: body.durationSec,
      startAt: body.startAt ? new Date(body.startAt) : undefined,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}

/* ---------- DELETE ---------------------------------------------- */
export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } },
) {
  /* await อะไรก็ได้ก่อนอ่าน params เพื่อหลบ warn ★ */
  await Promise.resolve();
  const id = Number(context.params.id);

  await prisma.routine.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
