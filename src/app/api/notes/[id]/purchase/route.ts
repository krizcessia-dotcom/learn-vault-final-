import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const noteId = params.id;

    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note)
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    if (note.sellerId === session.user.id)
      return NextResponse.json(
        { error: "Cannot purchase your own note" },
        { status: 400 }
      );

    const buyerWallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });
    const sellerWallet = await prisma.wallet.findUnique({
      where: { userId: note.sellerId },
    });
    if (!buyerWallet || !sellerWallet)
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    if (buyerWallet.balance < note.price)
      return NextResponse.json(
        { error: "Insufficient LV balance" },
        { status: 400 }
      );

    const existing = await prisma.notePurchase.findFirst({
      where: { noteId, buyerId: session.user.id },
    });
    if (existing)
      return NextResponse.json(
        { error: "Already purchased this note" },
        { status: 400 }
      );

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: buyerWallet.id },
        data: { balance: { decrement: note.price } },
      }),
      prisma.wallet.update({
        where: { id: sellerWallet.id },
        data: {
          balance: { increment: note.price },
          totalEarned: { increment: note.price },
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: buyerWallet.id,
          type: "PURCHASE",
          amount: -note.price,
          description: `Purchased: ${note.title}`,
          metadata: JSON.stringify({ noteId }),
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: sellerWallet.id,
          type: "SALE",
          amount: note.price,
          description: `Sold: ${note.title}`,
          metadata: JSON.stringify({ noteId, buyerId: session.user.id }),
        },
      }),
      prisma.notePurchase.create({
        data: {
          noteId,
          buyerId: session.user.id,
          amount: note.price,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Note purchased successfully",
    });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
