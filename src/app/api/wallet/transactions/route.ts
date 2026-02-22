import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });
    if (!wallet)
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const tx = await prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return NextResponse.json(tx);
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
