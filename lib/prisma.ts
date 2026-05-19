import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    if (connectionString?.includes("neon.tech")) {
      if (typeof window === "undefined") {
        neonConfig.webSocketConstructor = ws;
      }
      const pool = new Pool({ connectionString });
      const adapter = new PrismaNeon(pool);
      return new PrismaClient({ adapter });
    }
    return new PrismaClient();
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
