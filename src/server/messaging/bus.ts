import { MessageEnvelope } from "./envelope";

export type BusHandler<TPayload> = (message: MessageEnvelope<TPayload>) => Promise<void> | void;

export interface EventBus {
  publish<TPayload>(topic: string, message: MessageEnvelope<TPayload>): Promise<void>;
  subscribe<TPayload>(topic: string, handler: BusHandler<TPayload>): void;
}

type Subscription = {
  topic: string;
  handler: BusHandler<unknown>;
};

export class InMemoryBus implements EventBus {
  private subscriptions: Subscription[] = [];

  async publish<TPayload>(topic: string, message: MessageEnvelope<TPayload>): Promise<void> {
    const subs = this.subscriptions.filter(s => s.topic === topic);
    for (const sub of subs) {
      const handler = sub.handler as BusHandler<TPayload>;
      await handler(message);
    }
  }

  subscribe<TPayload>(topic: string, handler: BusHandler<TPayload>): void {
    this.subscriptions.push({ topic, handler: handler as BusHandler<unknown> });
  }
}

let sharedBus: InMemoryBus | undefined;

export function getSharedBus(): InMemoryBus {
  if (!sharedBus) {
    sharedBus = new InMemoryBus();
  }
  return sharedBus;
}

