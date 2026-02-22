import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const schema = z.object({ minutes: z.number().int().min(1).max(60) });

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid minutes" }, { status: 400 });
    const { minutes } = parsed.data;

    await prisma.pomodoroSession.create({
      data: {
        userId: session.user.id,
        minutes,
        completed: true,
      },
    });
    return NextResponse.json({ success: true, minutes });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
