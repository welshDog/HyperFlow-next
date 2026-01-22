import { getPrisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function list(flowId: string, skip: number = 0, take: number = 20) {
  const prisma = getPrisma();
  return prisma.flowVersion.findMany({
    where: { flowId },
    orderBy: { version: "desc" },
    skip,
    take,
  });
}

export async function count(flowId: string) {
  const prisma = getPrisma();
  return prisma.flowVersion.count({ where: { flowId } });
}

export async function getLatestVersion(flowId: string) {
  const prisma = getPrisma();
  return prisma.flowVersion.findFirst({ where: { flowId }, orderBy: { version: "desc" } });
}

export async function create(
  flowId: string,
  version: number,
  snapshot: Prisma.InputJsonValue,
  author?: string
) {
  const prisma = getPrisma();
  return prisma.flowVersion.create({ data: { flowId, version, snapshot, author } });
}

export async function getById(id: string) {
  const prisma = getPrisma();
  return prisma.flowVersion.findUnique({ where: { id } });
}

export type SnapshotNode = { id: string; type: string; x: number; y: number; config?: Prisma.InputJsonValue };
export type SnapshotEdge = { id: string; sourceNodeId: string; sourcePort: string; targetNodeId: string; targetPort: string };

export async function restore(flowId: string, snapshot: { nodes: SnapshotNode[]; edges: SnapshotEdge[] }) {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    await tx.edge.deleteMany({ where: { flowId } });
    await tx.node.deleteMany({ where: { flowId } });
    if (snapshot.nodes.length) {
      await tx.node.createMany({ data: snapshot.nodes.map((n: SnapshotNode) => ({
        id: n.id,
        flowId,
        type: n.type,
        x: n.x,
        y: n.y,
        config: n.config ?? {},
      })) });
    }
    if (snapshot.edges.length) {
      await tx.edge.createMany({ data: snapshot.edges.map((e: SnapshotEdge) => ({
        id: e.id,
        flowId,
        sourceNodeId: e.sourceNodeId,
        sourcePort: e.sourcePort,
        targetNodeId: e.targetNodeId,
        targetPort: e.targetPort,
      })) });
    }
    return true;
  });
}
