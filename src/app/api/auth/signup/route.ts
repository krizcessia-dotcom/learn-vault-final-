import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashed = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    // Create wallet with signup bonus (10 LV) in a transaction so both succeed or neither
    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.create({
        data: {
          userId: user.id,
          balance: 10,
          totalEarned: 0,
        },
      });
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: "REWARD",
          amount: 10,
          description: "Signup bonus",
        },
      });
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    const err = e as Error;
    console.error("Signup error:", err);
    const message =
      process.env.NODE_ENV === "development" ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
