import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

// GET: List notes (public for browse, optional auth)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

    const notes = await prisma.note.findMany({
      where: subject ? { subject } : undefined,
      include: {
        seller: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return NextResponse.json(
      notes.map((n) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        subject: n.subject,
        price: n.price,
        fileType: n.fileType,
        sellerName: n.seller.name,
        createdAt: n.createdAt,
      }))
    );
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST: Create note (auth required)
const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subject: z.string().optional(),
  price: z.number().int().min(1).max(1000),
  fileUrl: z.string().optional(),
  fileType: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const data = parsed.data;

    const note = await prisma.note.create({
      data: {
        ...data,
        sellerId: session.user.id,
      },
    });
    return NextResponse.json(note);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
