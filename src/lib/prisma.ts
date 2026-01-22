import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/lib/env";

let prismaSingleton: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (prismaSingleton) return prismaSingleton;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prismaSingleton = new PrismaClient({ adapter, log: ["error", "warn"] });
  return prismaSingleton;
}
