import type { User } from "@supabase/supabase-js";
import { hyper } from "./env";

export type Role =
  | "Administrator"
  | "AgentManager"
  | "MissionCreator"
  | "Evaluator"
  | "Viewer";

const DEFAULT_ROLE: Role = "Viewer";

export function getUserRoles(user: User | null): Role[] {
  if (!user) return [];
  const appRoles = (user.app_metadata as Record<string, unknown> | undefined)?.["roles"];
  const userRoles = (user.user_metadata as Record<string, unknown> | undefined)?.["roles"];
  const raw = Array.isArray(appRoles)
    ? appRoles
    : Array.isArray(userRoles)
    ? userRoles
    : undefined;
  const roles = (raw ?? [DEFAULT_ROLE])
    .map((r) => (typeof r === "string" ? r : ""))
    .filter((r) => r.length > 0) as Role[];
  return roles;
}

export function hasAnyRole(user: User | null, allowed: Role[]): boolean {
  if (!hyper.HYPER_ENABLE_AUTH_GUARDS) return true;
  if (!user) return false;
  const roles = getUserRoles(user);
  return roles.some((r) => allowed.includes(r));
}

export function isAuthenticated(user: User | null): boolean {
  if (!hyper.HYPER_ENABLE_AUTH_GUARDS) return true;
  return !!user;
}

