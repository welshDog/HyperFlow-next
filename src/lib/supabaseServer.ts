import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getServerUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          const c = cookieStore.get(name);
          return c?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

