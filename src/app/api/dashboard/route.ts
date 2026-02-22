import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function GET() {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const [user, wallet, notesUploaded, notesBought] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.wallet.findUnique({ where: { userId } }),
      prisma.note.count({ where: { sellerId: userId } }),
      prisma.notePurchase.count({ where: { buyerId: userId } }),
    ]);

    if (!wallet)
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    return NextResponse.json({
      user: {
        name: user?.name,
        email: user?.email,
        motto: user?.motto ?? null,
        birthday: user?.birthday,
        level: user?.level,
        learningRole: user?.learningRole,
      },
      wallet: {
        balance: wallet.balance,
        totalEarned: wallet.totalEarned,
      },
      notesUploaded,
      notesBought,
    });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
