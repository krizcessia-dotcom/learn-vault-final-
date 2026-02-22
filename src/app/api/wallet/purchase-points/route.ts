import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

// 2 LV = ₱1
const schema = z.object({ amount: z.number().int().min(10).max(10000) });

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    const { amount } = parsed.data;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });
    if (!wallet)
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: "PURCHASE_POINTS",
          amount,
          description: `Purchased ${amount} LV`,
        },
      }),
    ]);
    const updated = await prisma.wallet.findUnique({
      where: { id: wallet.id },
    });
    return NextResponse.json({ balance: updated!.balance });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
