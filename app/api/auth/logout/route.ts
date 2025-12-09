import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const cookieStore = cookies();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: cookieStore.get("sb-access-token")
            ? `Bearer ${cookieStore.get("sb-access-token")?.value}`
            : "",
        },
      },
    }
  );

  await supabase.auth.signOut();

  // Clear Supabase cookies
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  return NextResponse.json({ success: true });
}
