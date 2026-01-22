import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

export type SerializationFormat = "json" | "protobuf";

export type MessageEnvelope<TPayload> = {
  id: string;
  traceId: string;
  correlationId?: string;
  topic: string;
  format: SerializationFormat;
  createdAt: number;
  ttlMs?: number;
  headers: Record<string, string>;
  payload: TPayload;
  signature?: string;
};

export type EnvelopeOptions = {
  traceId?: string;
  correlationId?: string;
  ttlMs?: number;
  headers?: Record<string, string>;
  format?: SerializationFormat;
};

export function createEnvelope<TPayload>(topic: string, payload: TPayload, opts?: EnvelopeOptions): MessageEnvelope<TPayload> {
  const id = randomBytes(16).toString("hex");
  const traceId = opts?.traceId ?? id;
  const correlationId = opts?.correlationId;
  const createdAt = Date.now();
  const ttlMs = opts?.ttlMs;
  const headers = opts?.headers ?? {};
  const format = opts?.format ?? "json";
  return {
    id,
    traceId,
    correlationId,
    topic,
    format,
    createdAt,
    ttlMs,
    headers,
    payload,
  };
}

export function signEnvelope<TPayload>(env: MessageEnvelope<TPayload>, secret: string): MessageEnvelope<TPayload> {
  const base = JSON.stringify({
    id: env.id,
    traceId: env.traceId,
    correlationId: env.correlationId,
    topic: env.topic,
    createdAt: env.createdAt,
    ttlMs: env.ttlMs,
    headers: env.headers,
  });
  const hmac = createHmac("sha256", secret);
  hmac.update(base);
  const sig = hmac.digest("hex");
  return {
    ...env,
    signature: sig,
  };
}

export function verifyEnvelope<TPayload>(env: MessageEnvelope<TPayload>, secret: string): boolean {
  if (!env.signature) return false;
  const base = JSON.stringify({
    id: env.id,
    traceId: env.traceId,
    correlationId: env.correlationId,
    topic: env.topic,
    createdAt: env.createdAt,
    ttlMs: env.ttlMs,
    headers: env.headers,
  });
  const hmac = createHmac("sha256", secret);
  hmac.update(base);
  const expected = hmac.digest("hex");
  return expected === env.signature;
}

export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

export function encryptPayload<TPayload>(payload: TPayload, secret: string): EncryptedPayload {
  const key = createKey(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const json = JSON.stringify(payload);
  const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

export function decryptPayload<TPayload>(encrypted: EncryptedPayload, secret: string): TPayload {
  const key = createKey(secret);
  const iv = Buffer.from(encrypted.iv, "base64");
  const authTag = Buffer.from(encrypted.authTag, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const ciphertext = Buffer.from(encrypted.ciphertext, "base64");
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  const json = decrypted.toString("utf8");
  return JSON.parse(json) as TPayload;
}

function createKey(secret: string): Buffer {
  const buf = Buffer.from(secret, "utf8");
  if (buf.length === 32) return buf;
  if (buf.length > 32) return buf.subarray(0, 32);
  const out = Buffer.alloc(32);
  buf.copy(out);
  return out;
}
