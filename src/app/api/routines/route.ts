import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json([], { status: 401 });

  const routines = await prisma.routine.findMany({
    where: { userId: Number(session.user.id), NOT: { title: "" } },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(routines);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({}, { status: 401 });

  const { title, weekdays, startTime, durationSec } = await req.json();
  const routine = await prisma.routine.create({
    data: {
      title,
      weekdays,
      startTime,
      durationSec,
      userId: Number(session.user.id),
    },
  });
  return NextResponse.json(routine, { status: 201 });
}
