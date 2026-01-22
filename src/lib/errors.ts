import { ZodIssue } from "zod";

export interface ErrorEnvelope {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export function fromZodIssues(issues: ZodIssue[]): ErrorEnvelope {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const path = issue.path?.join(".") || "global";
    const msg = issue.message || issue.code || "invalid";
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(msg);
  }
  return {
    code: "validation_error",
    message: "Validation failed",
    fieldErrors,
  };
}

export function notFound(message = "Resource not found"): ErrorEnvelope {
  return { code: "not_found", message };
}

export function serverError(message = "Server error"): ErrorEnvelope {
  return { code: "server_error", message };
}

export function unauthorized(message = "Unauthorized"): ErrorEnvelope {
  return { code: "unauthorized", message };
}

export type ActionResponse<T> = { ok: true; data: T } | { ok: false; error: ErrorEnvelope };
