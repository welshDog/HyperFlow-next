import { NextResponse } from "next/server";
import { missionMetrics } from "@/server/orchestrator/service";
import { listAgents, ensureDefaultAgents } from "@/server/agents/registry";
import { adaptersHealth, registerAdapter } from "@/server/messaging/adapters";
import { KafkaAdapter } from "@/server/messaging/kafka";
import { RabbitMQAdapter } from "@/server/messaging/rabbitmq";
import { hyper } from "@/lib/env";

export async function GET() {
  ensureDefaultAgents();
  const metrics = missionMetrics();
  const agents = listAgents();
  const resourceSnapshot = {
    memoryRssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    uptimeSeconds: Math.round(process.uptime()),
  };
  if (!registeredOnce) {
    registerAdapter(new KafkaAdapter());
    registerAdapter(new RabbitMQAdapter());
    registeredOnce = true;
  }
  const messaging = await adaptersHealth();
  return NextResponse.json({
    status: "ok",
    orchestrator: metrics,
    agents: {
      count: agents.length,
    },
    resources: resourceSnapshot,
    messaging,
    flags: {
      authGuards: hyper.HYPER_ENABLE_AUTH_GUARDS,
    },
  });
}

let registeredOnce = false;
