import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerUser } from "@/lib/supabaseServer";
import { hasAnyRole } from "@/lib/rbac";
import { unauthorized } from "@/lib/errors";
import { hyper } from "@/lib/env";
import { setRoles } from "@/lib/profile";
import { recordAudit } from "@/lib/audit";

const SetRolesSchema = z.object({
  userId: z.string().min(1),
  roles: z.array(z.string().min(1)).min(1),
});

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (hyper.HYPER_ENABLE_AUTH_GUARDS && !hasAnyRole(user, ["Administrator"])) {
    await recordAudit({ userId: user?.id, action: "roles:set:denied", entity: "UserProfile" });
    return NextResponse.json({ error: unauthorized("Administrator role required") }, { status: 403 });
  }
  const body = await req.json();
  const parsed = SetRolesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const ok = await setRoles(parsed.data.userId, parsed.data.roles);
  await recordAudit({ userId: user?.id, action: "roles:set", entity: "UserProfile", entityId: parsed.data.userId, diff: { roles: parsed.data.roles } });
  return NextResponse.json({ ok }, { status: ok ? 200 : 500 });
}

