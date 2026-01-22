import type { MessagingAdapter, AdapterHealth } from "./adapters";

export class RabbitMQAdapter implements MessagingAdapter {
  name = "rabbitmq";
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

