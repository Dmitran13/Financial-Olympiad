import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for PrismaClient initialization");
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({
    log: ["error"],
    adapter: new PrismaPg(databaseUrl),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
