import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({}, { status: 401 });

  const data = await req.json();
  const updated = await prisma.routine.update({
    where: { id: Number(params.id), user: { email: session.user.email ?? "" } },
    data,
  });
  return NextResponse.json(updated);
}
