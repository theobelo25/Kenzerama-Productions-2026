import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set at runtime. Configure it in the production runtime environment.",
  );
}

if (process.env.NODE_ENV === "production" && /127\.0\.0\.1|localhost/i.test(databaseUrl)) {
  throw new Error(
    "DATABASE_URL points to localhost in production. Use your managed Postgres host instead.",
  );
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
