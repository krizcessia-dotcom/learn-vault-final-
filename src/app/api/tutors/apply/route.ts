import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const applySchema = z.object({
  bio: z.string().max(2000).optional(),
  subjects: z.array(z.string()).optional(),
  pricePerHour: z.number().int().min(0).optional(),
  price4Sessions: z.number().int().min(0).optional(),
  yearsExp: z.number().int().min(0).optional(),
  teachingStyle: z.string().max(500).optional(),
  certifications: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = applySchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const data = parsed.data;

    const existing = await prisma.tutorProfile.findUnique({
      where: { userId: session.user.id },
    });

    const tutorData = {
      bio: data.bio ?? undefined,
      subjects: data.subjects ? JSON.stringify(data.subjects) : undefined,
      pricePerHour: data.pricePerHour ?? undefined,
      price4Sessions: data.price4Sessions ?? undefined,
      yearsExp: data.yearsExp ?? undefined,
      teachingStyle: data.teachingStyle ?? undefined,
      certifications: data.certifications ?? undefined,
    };

    if (existing) {
      await prisma.tutorProfile.update({
        where: { id: existing.id },
        data: tutorData,
      });
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "tutor" },
      });
      return NextResponse.json({ success: true, updated: true });
    }

    await prisma.tutorProfile.create({
      data: {
        userId: session.user.id,
        ...tutorData,
      },
    });
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "tutor" },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    if ((e as Error).message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
