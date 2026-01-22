import { randomUUID } from "node:crypto";

export type AgentKind = "specialist" | "evaluator";

export type AgentCapability = {
  id: string;
  description: string;
  inputs: string[];
  outputs: string[];
};

export type AgentResourceLimits = {
  maxConcurrentMissions: number;
  maxCpuPercent: number;
  maxMemoryMb: number;
};

export type AgentIdentity = {
  id: string;
  handle: string;
  displayName: string;
  kind: AgentKind;
  version: string;
  capabilities: AgentCapability[];
  resourceLimits: AgentResourceLimits;
  dependencies: string[];
  createdAt: number;
};

type RegistryState = {
  agents: Map<string, AgentIdentity>;
};

const state: RegistryState = {
  agents: new Map(),
};

export function registerAgent(input: Omit<AgentIdentity, "id" | "createdAt"> & { id?: string }): AgentIdentity {
  const id = input.id ?? randomUUID();
  const createdAt = Date.now();
  const agent: AgentIdentity = {
    ...input,
    id,
    createdAt,
  };
  state.agents.set(id, agent);
  return agent;
}

export function listAgents(): AgentIdentity[] {
  return Array.from(state.agents.values());
}

export function findAgentByHandle(handle: string): AgentIdentity | undefined {
  const all = Array.from(state.agents.values());
  return all.find(a => a.handle === handle);
}

export function ensureDefaultAgents() {
  if (state.agents.size > 0) return;
  const defaults: Array<Omit<AgentIdentity, "id" | "createdAt">> = [
    {
      handle: "frontend-specialist",
      displayName: "Frontend Specialist",
      kind: "specialist",
      version: "1.0.0",
      capabilities: [
        {
          id: "ui-flow-editing",
          description: "Implements and refines UI flows and components",
          inputs: ["featureBrief", "apiContract"],
          outputs: ["uiComponents", "interactionFlows"],
        },
      ],
      resourceLimits: {
        maxConcurrentMissions: 3,
        maxCpuPercent: 40,
        maxMemoryMb: 512,
      },
      dependencies: ["backend-specialist"],
    },
    {
      handle: "backend-specialist",
      displayName: "Backend Specialist",
      kind: "specialist",
      version: "1.0.0",
      capabilities: [
        {
          id: "api-implementation",
          description: "Designs and implements APIs and business logic",
          inputs: ["featureBrief", "dataModel"],
          outputs: ["apiEndpoints", "integrationTests"],
        },
      ],
      resourceLimits: {
        maxConcurrentMissions: 4,
        maxCpuPercent: 60,
        maxMemoryMb: 1024,
      },
      dependencies: ["database-architect"],
    },
    {
      handle: "system-architect",
      displayName: "System Architect",
      kind: "specialist",
      version: "1.0.0",
      capabilities: [
        {
          id: "architecture-design",
          description: "Defines system architecture and integration patterns",
          inputs: ["productVision"],
          outputs: ["architectureDocs", "serviceContracts"],
        },
      ],
      resourceLimits: {
        maxConcurrentMissions: 2,
        maxCpuPercent: 30,
        maxMemoryMb: 512,
      },
      dependencies: [],
    },
    {
      handle: "mission-success-evaluator",
      displayName: "Mission Success Evaluator",
      kind: "evaluator",
      version: "1.0.0",
      capabilities: [
        {
          id: "mission-scoring",
          description: "Scores missions based on success criteria",
          inputs: ["missionLog"],
          outputs: ["successScore"],
        },
      ],
      resourceLimits: {
        maxConcurrentMissions: 6,
        maxCpuPercent: 30,
        maxMemoryMb: 256,
      },
      dependencies: [],
    },
    {
      handle: "performance-evaluator",
      displayName: "Performance Evaluator",
      kind: "evaluator",
      version: "1.0.0",
      capabilities: [
        {
          id: "performance-benchmarking",
          description: "Benchmarks mission latency and throughput",
          inputs: ["metrics"],
          outputs: ["performanceReport"],
        },
      ],
      resourceLimits: {
        maxConcurrentMissions: 6,
        maxCpuPercent: 30,
        maxMemoryMb: 256,
      },
      dependencies: [],
    },
    {
      handle: "compliance-evaluator",
      displayName: "Compliance Evaluator",
      kind: "evaluator",
      version: "1.0.0",
      capabilities: [
        {
          id: "compliance-checks",
          description: "Verifies missions comply with defined policies",
          inputs: ["missionArtifacts"],
          outputs: ["complianceReport"],
        },
      ],
      resourceLimits: {
        maxConcurrentMissions: 4,
        maxCpuPercent: 30,
        maxMemoryMb: 256,
      },
      dependencies: [],
    },
  ];
  defaults.forEach(def => {
    registerAgent(def);
  });
}

