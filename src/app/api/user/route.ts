import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const updateSchema = z.object({
  motto: z.string().max(500).optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const { motto } = parsed.data;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { motto: motto ?? null },
    });
    return NextResponse.json({ motto });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
