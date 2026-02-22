import type { PrismaConfig } from "prisma";

/**
 * Prisma CLI config. Seed runs via `prisma db seed`.
 * DATABASE_URL stays in schema.prisma (Prisma 6 style).
 */
export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
} satisfies PrismaConfig;
