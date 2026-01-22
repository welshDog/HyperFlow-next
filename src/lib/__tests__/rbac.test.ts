import { describe, it, expect } from "vitest";
import type { User } from "@supabase/supabase-js";
import { getUserRoles, hasAnyRole } from "../rbac";

function makeUser(meta: { app?: Record<string, unknown>; user?: Record<string, unknown> }): User {
  const u = {
    id: "u1",
    email: "test@example.com",
    app_metadata: meta.app ?? {},
    user_metadata: meta.user ?? {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as unknown as User;
  return u;
}

describe("rbac", () => {
  it("extracts roles from app_metadata", () => {
    const user = makeUser({ app: { roles: ["Administrator", "Evaluator"] } });
    const roles = getUserRoles(user);
    expect(roles).toContain("Administrator");
    expect(roles).toContain("Evaluator");
  });

  it("falls back to user_metadata roles", () => {
    const user = makeUser({ user: { roles: ["Viewer"] } });
    const roles = getUserRoles(user);
    expect(roles).toEqual(["Viewer"]);
  });

  it("hasAnyRole validates membership", () => {
    const user = makeUser({ app: { roles: ["MissionCreator"] } });
    const ok1 = hasAnyRole(user, ["Administrator", "MissionCreator"]);
    const ok2 = hasAnyRole(user, ["Administrator"]);
    expect(ok1).toBe(true);
    expect(ok2).toBe(false);
  });
});

