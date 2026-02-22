import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

// GET: Wallet balance and summary
export async function GET() {
  try {
    const session = await requireAuth();
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });
    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }
    return NextResponse.json({
      balance: wallet.balance,
      totalEarned: wallet.totalEarned,
    });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
