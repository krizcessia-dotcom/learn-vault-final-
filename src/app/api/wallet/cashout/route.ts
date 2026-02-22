import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

// 2 LV = ₱1. Commission 20% on withdrawal
const LV_TO_PESO = 0.5;
const COMMISSION = 0.2;

const schema = z.object({ lvAmount: z.number().int().min(100).max(100000) });

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid amount (min 100 LV)" }, { status: 400 });
    const { lvAmount } = parsed.data;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });
    if (!wallet)
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    if (wallet.balance < lvAmount)
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );

    const grossPeso = lvAmount * LV_TO_PESO;
    const commissionAmount = grossPeso * COMMISSION;
    const netPeso = grossPeso - commissionAmount;

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: lvAmount } },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: "CASHOUT",
          amount: -lvAmount,
          description: `${lvAmount} LV → ₱${netPeso.toFixed(2)} (20% fee: ₱${commissionAmount.toFixed(2)})`,
          metadata: JSON.stringify({ grossPeso, netPeso, commission: commissionAmount }),
        },
      }),
      prisma.cashoutRequest.create({
        data: {
          userId: session.user.id,
          lvAmount,
          pesoAmount: netPeso,
          status: "PENDING",
        },
      }),
    ]);
    const updated = await prisma.wallet.findUnique({
      where: { id: wallet.id },
    });
    return NextResponse.json({
      balance: updated!.balance,
      message: `Cashout request submitted: ${lvAmount} LV → ₱${netPeso.toFixed(2)} (pending)`,
    });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
