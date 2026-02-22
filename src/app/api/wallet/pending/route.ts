import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  try {
    const session = await requireAuth();
    const pending = await prisma.cashoutRequest.findFirst({
      where: { userId: session.user.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pending ?? null);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
