import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "info" },
      { emit: "stdout", level: "warn" },
    ],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;

// Create backward compatibility wrapper with Proxy
const db = new Proxy(prismaClient, {
  get(target, prop) {
    // Backward compatibility aliases
    if (prop === 'product') {
      return target.dish;
    }
    if (prop === 'supplier') {
      return target.country;
    }
    return (target as any)[prop];
  }
}) as PrismaClient & {
  product: typeof prismaClient.dish;
  supplier: typeof prismaClient.country;
};

export default db;

