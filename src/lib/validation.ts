import { z } from "zod";

export const FlowSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1),
  version: z.number().int().positive().default(1),
});

export const NodeSchema = z.object({
  id: z.string().cuid().optional(),
  flowId: z.string().cuid(),
  type: z.string().min(1),
  x: z.number().int(),
  y: z.number().int(),
  config: z.record(z.string(), z.unknown()).optional().default({}),
});

export const EdgeSchema = z.object({
  id: z.string().cuid().optional(),
  flowId: z.string().cuid(),
  sourceNodeId: z.string().cuid(),
  sourcePort: z.string().min(1),
  targetNodeId: z.string().cuid(),
  targetPort: z.string().min(1),
});

export type FlowInput = z.infer<typeof FlowSchema>;
export type NodeInput = z.infer<typeof NodeSchema>;
export type EdgeInput = z.infer<typeof EdgeSchema>;
