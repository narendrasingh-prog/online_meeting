"use client";


import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SupabaseService } from "@/lib/supabase/SupabaseService";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = SupabaseService.browser();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
