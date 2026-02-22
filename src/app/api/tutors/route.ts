import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tutors = await prisma.tutorProfile.findMany({
      include: {
        user: { select: { name: true, image: true } },
      },
    });
    return NextResponse.json(
      tutors.map((t) => ({
        id: t.id,
        userId: t.userId,
        name: t.user.name,
        bio: t.bio,
        subjects: t.subjects ? JSON.parse(t.subjects) : [],
        pricePerHour: t.pricePerHour,
        price4Sessions: t.price4Sessions,
      }))
    );
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
