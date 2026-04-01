
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { SupabaseService } from "./SupabaseService";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase=await SupabaseService.server();

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/previous", "/personal", "/upcoming"];
  const authRoues = ["/auth/login", "/auth/sign-up"];
  const isProtected =pathname.startsWith("/meeting") ||
  pathname === "/" || protectedRoutes.some((r) => pathname.startsWith(r));
  
  const isAuth = authRoues.some((r) => pathname.startsWith(r));

 
  if (!user && isProtected) {
   
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    // url.searchParams.set('next',pathname)
    return NextResponse.redirect(url);
  }
  const addAccount=request.nextUrl.searchParams.get("add-account")==="true";
  if (isAuth && user && !addAccount) {
    return NextResponse.redirect(new URL("/", request.url));
  }


  return supabaseResponse;
}
