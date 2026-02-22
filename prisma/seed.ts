import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await hash("password123", 12);

  const user1 = await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {},
    create: {
      email: "student@test.com",
      name: "Student User",
      password: hashed,
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: "tutor@test.com" },
    update: {},
    create: {
      email: "tutor@test.com",
      name: "Tutor User",
      password: hashed,
      role: "tutor",
    },
  });

  await prisma.wallet.upsert({
    where: { userId: user1.id },
    update: {},
    create: { userId: user1.id, balance: 100, totalEarned: 50 },
  });
  await prisma.wallet.upsert({
    where: { userId: user2.id },
    update: {},
    create: { userId: user2.id, balance: 200, totalEarned: 200 },
  });

  await prisma.tutorProfile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      bio: "Passionate about improving skills through guided learning.",
      subjects: JSON.stringify(["Computer Science", "Mathematics"]),
      pricePerHour: 500,
      price4Sessions: 1800,
    },
  });

  const note = await prisma.note.create({
    data: {
      title: "Sample Study Notes",
      description: "Comprehensive study guide for exams",
      subject: "Mathematics",
      price: 25,
      sellerId: user2.id,
    },
  });

  console.log("Seed done:", { user1: user1.email, user2: user2.email, note: note.title });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
