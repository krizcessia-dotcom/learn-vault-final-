import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const TASK_DEFS: Record<string, { label: string; reward: number }> = {
  daily_checkin: { label: "Daily check-in", reward: 1 },
  pomodoro_1: { label: "Complete 1 Pomodoro", reward: 2 },
  study_60: { label: "Study 60 mins total", reward: 3 },
  flashcards_10: { label: "Review 10 flashcards", reward: 1 },
  upload_note: { label: "Upload quality note", reward: 10 },
  pomodoro_3: { label: "3 Pomodoros", reward: 6 },
  streak_7: { label: "7-day streak", reward: 15 },
};

const schema = z.object({
  taskSlug: z.string().refine((s) => s in TASK_DEFS, "Invalid task"),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid task" }, { status: 400 });
    const { taskSlug } = parsed.data;

    const def = TASK_DEFS[taskSlug];
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });
    if (!wallet)
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    const already = await prisma.dailyTaskCompletion.findFirst({
      where: {
        userId: session.user.id,
        taskId: taskSlug,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });
    if (already)
      return NextResponse.json(
        { error: "Task already completed today" },
        { status: 400 }
      );

    await prisma.$transaction([
      prisma.dailyTaskCompletion.create({
        data: { userId: session.user.id, taskId: taskSlug },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: def.reward } },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: "REWARD",
          amount: def.reward,
          description: `Daily task: ${def.label}`,
          metadata: JSON.stringify({ taskSlug }),
        },
      }),
    ]);

    return NextResponse.json({ success: true, reward: def.reward });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
