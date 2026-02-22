import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const schema = z.object({
  tutorId: z.string(),
  lvAmount: z.number().int().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const { tutorId, lvAmount } = parsed.data;

    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: { user: true },
    });
    if (!tutor)
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    if (tutor.userId === session.user.id)
      return NextResponse.json(
        { error: "Cannot book yourself" },
        { status: 400 }
      );

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });
    const tutorWallet = await prisma.wallet.findUnique({
      where: { userId: tutor.userId },
    });
    if (!wallet || !tutorWallet)
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    if (wallet.balance < lvAmount)
      return NextResponse.json(
        { error: "Insufficient LV balance" },
        { status: 400 }
      );

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: lvAmount } },
      }),
      prisma.wallet.update({
        where: { id: tutorWallet.id },
        data: {
          balance: { increment: lvAmount },
          totalEarned: { increment: lvAmount },
        },
      }),
      prisma.booking.create({
        data: {
          tutorId,
          studentId: session.user.id,
          lvAmount,
          status: "CONFIRMED",
        },
      }),
    ]);
    return NextResponse.json({ success: true });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
