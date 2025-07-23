import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({}, { status: 401 });

  const data = await req.json();
  const routine = await prisma.routine.update({
    where: { id: Number(params.id), userId: Number(session.user.id) },
    data,
  });
  return NextResponse.json(routine);
}
