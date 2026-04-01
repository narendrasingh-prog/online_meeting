import { createServerClient, createBrowserClient } from "@supabase/ssr";


export class SupabaseService {
  static supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  static supabasekey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  static async server() {
    const {cookies}=await import ("next/headers")
    const cookieStore = await cookies();

    return createServerClient(this.supabaseUrl, this.supabasekey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    });
  }

  static browser() {
    return createBrowserClient(this.supabaseUrl, this.supabasekey);
  }
}
