import { getPrisma } from "@/lib/prisma";

export async function create(data: { name: string; version: number }) {
  const prisma = getPrisma();
  return prisma.flow.create({ data });
}

export async function findById(id: string) {
  const prisma = getPrisma();
  return prisma.flow.findUnique({ where: { id }, include: { nodes: true, edges: true } });
}

export async function update(id: string, data: { name: string; version: number }) {
  const prisma = getPrisma();
  return prisma.flow.update({ where: { id }, data });
}

export async function remove(id: string) {
  const prisma = getPrisma();
  await prisma.flow.delete({ where: { id } });
}

