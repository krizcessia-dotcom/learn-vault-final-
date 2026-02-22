import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

// GET: Notes sold by current user
export async function GET() {
  try {
    const session = await requireAuth();
    const notes = await prisma.note.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
