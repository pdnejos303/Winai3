import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

/* ---------- GET  /api/routines ---------- */
export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json([], { status: 401 });

  const routines = await prisma.routine.findMany({
    where: { user: { email: session.user.email ?? "" }, title: { not: "" } },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(routines);
}

/* ---------- POST  /api/routines ---------- */
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({}, { status: 401 });

  const { title, weekdays, date, time, durationSec } = await req.json();
  const [h, m] = time.split(":").map(Number);

  /** combine date + time → ISO */
  const startAt = new Date(date);
  startAt.setHours(h, m, 0, 0); // local time

  const routine = await prisma.routine.create({
    data: {
      title,
      weekdays,
      startAt,
      durationSec,
      userId: Number(session.user?.id ?? 0),
    },
  });
  return NextResponse.json(routine, { status: 201 });
}
