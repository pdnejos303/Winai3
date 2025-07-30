/* --------------------------------------------------------------------
 * FILE: src/app/api/events/route.ts
 * DESC:  GET /api/events  → ส่ง Task ทั้งหมด (ทุกตัวมี dueDate) ให้ Calendar
 * ------------------------------------------------------------------ */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type EventRes = { id: string; title: string; date: string };

export async function GET() {
  try {
    /* ดึงทุก Task (ทุกตัวมี dueDate ตาม schema) */
    const tasks = await prisma.task.findMany({
      select: { id: true, title: true, dueDate: true },
    });

    const events: EventRes[] = tasks.map((t) => ({
      id: String(t.id),
      title: t.title,
      date: t.dueDate.toISOString().split("T")[0], // YYYY-MM-DD
    }));

    return NextResponse.json(events, { status: 200 });
  } catch (err) {
    console.error("GET /api/events failed:", err);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 },
    );
  }
}
