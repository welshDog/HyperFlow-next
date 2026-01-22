export type AdapterHealth = {
  name: string;
  connected: boolean;
  details?: Record<string, unknown>;
};

export interface MessagingAdapter {
  name: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  health(): Promise<AdapterHealth>;
}

const adapters: MessagingAdapter[] = [];

export function registerAdapter(adapter: MessagingAdapter) {
  adapters.push(adapter);
}

export function listAdapters(): MessagingAdapter[] {
  return adapters.slice();
}

export async function adaptersHealth(): Promise<AdapterHealth[]> {
  const all = adapters.slice();
  const out: AdapterHealth[] = [];
  for (const a of all) {
    try {
      out.push(await a.health());
    } catch {
      out.push({ name: a.name, connected: false });
    }
  }
  return out;
}
