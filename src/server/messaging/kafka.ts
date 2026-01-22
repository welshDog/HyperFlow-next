import type { MessagingAdapter, AdapterHealth } from "./adapters";

export class KafkaAdapter implements MessagingAdapter {
  name = "kafka";
  private connected = false;
  async connect() {
    this.connected = true;
  }
  async disconnect() {
    this.connected = false;
  }
  async health(): Promise<AdapterHealth> {
    return { name: this.name, connected: this.connected };
  }
}

