import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    if (!connectionString) {
       // Return a dummy client or throw a better error for build time
       console.warn("DATABASE_URL is not set, Prisma client may not work");
       return new PrismaClient();
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
