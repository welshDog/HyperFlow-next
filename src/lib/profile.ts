import { getPrisma } from "./prisma";

export async function getRoles(userId: string): Promise<string[] | null> {
  try {
    const prisma = getPrisma() as unknown as Record<string, unknown>;
    const model = prisma["userProfile"] as Record<string, unknown> | undefined;
    const finder = model?.["findUnique"] as (a: unknown) => Promise<unknown> | undefined;
    if (!finder) return null;
    const row = await finder({ where: { userId } }) as { roles?: unknown } | null;
    const roles = (row?.roles as unknown) as string[] | undefined;
    return Array.isArray(roles) ? roles : null;
  } catch {
    return null;
  }
}

export async function setRoles(userId: string, roles: string[]): Promise<boolean> {
  try {
    const prisma = getPrisma() as unknown as Record<string, unknown>;
    const model = prisma["userProfile"] as Record<string, unknown> | undefined;
    const upserter = model?.["upsert"] as (a: unknown) => Promise<unknown> | undefined;
    if (!upserter) return false;
    await upserter({ where: { userId }, update: { roles }, create: { userId, roles } });
    return true;
  } catch {
    return false;
  }
}
