import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

export async function GET() {
  try {
    const session = await requireAuth();
    const sets = await prisma.flashcardSet.findMany({
      where: { userId: session.user.id },
      include: { flashcards: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sets);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

const createSchema = z.object({
  title: z.string().min(1),
  cards: z.array(z.object({ front: z.string(), back: z.string() })).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const { title, cards = [] } = parsed.data;

    const set = await prisma.flashcardSet.create({
      data: {
        userId: session.user.id,
        title,
        flashcards: {
          create: cards.map((c, i) => ({
            front: c.front,
            back: c.back,
            order: i,
          })),
        },
      },
      include: { flashcards: true },
    });
    return NextResponse.json(set);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
