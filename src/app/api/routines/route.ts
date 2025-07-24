import { prisma }             from "@/lib/prisma";
import { getServerSession }   from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

/* -------------------- GET -------------------- */
export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json([], { status: 401 });

  const routines = await prisma.routine.findMany({
    where: {
      user:  { email: session.user.email ?? "" },
      title: { not: "" },
    },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(routines);
}

/* -------------------- POST ------------------- */
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({}, { status: 401 });

  /* ➊ หา userId จาก email แทนการใช้ session.user.id */
  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? "" },
    select: { id: true },
  });
  if (!user) return NextResponse.json({}, { status: 404 });

  /* ➋ รับ payload */
  const { title, weekdays, date, time, durationSec } = await req.json();

  /* ➌ รวม date + time → DateTime */
  const [h, m] = time.split(":").map(Number);
  const startAt = new Date(date);
  startAt.setHours(h, m, 0, 0);

  /* ➍ บันทึก */
  const routine = await prisma.routine.create({
    data: {
      title,
      weekdays,
      startAt,          // DateTime ✓
      durationSec,
      userId: user.id,  // FK ถูกต้อง ✓
    },
  });

  return NextResponse.json(routine, { status: 201 });
}
