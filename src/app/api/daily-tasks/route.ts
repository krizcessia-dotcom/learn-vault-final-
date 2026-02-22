import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

// Static task definitions
const TASK_DEFS = [
  { slug: "daily_checkin", label: "Daily check-in", reward: 1 },
  { slug: "pomodoro_1", label: "Complete 1 Pomodoro", reward: 2 },
  { slug: "study_60", label: "Study 60 mins total", reward: 3 },
  { slug: "flashcards_10", label: "Review 10 flashcards", reward: 1 },
  { slug: "upload_note", label: "Upload quality note", reward: 10 },
  { slug: "pomodoro_3", label: "3 Pomodoros", reward: 6 },
  { slug: "streak_7", label: "7-day streak", reward: 15 },
];

// GET: List tasks with completion status
export async function GET() {
  try {
    const session = await requireAuth();
    const completions = await prisma.dailyTaskCompletion.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });
    const completedSlugs = new Set(completions.map((c) => c.taskId));

    const tasks = TASK_DEFS.map((t) => ({
      ...t,
      completed: completedSlugs.has(t.slug),
      rewardText: `+${t.reward} LV`,
    }));
    return NextResponse.json(tasks);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
