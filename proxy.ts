import { AuthService } from "./services/AuthService";

import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  // const protectedRouteRegex = /^\/($|search$|profile(\/.*)?$)/;

  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/previous", "/personal", "/upcoming"];
  const authRoues = ["/auth/login", "/auth/sign-up"];
  const isProtected =
    pathname.startsWith("/meeting") ||
    pathname === "/" ||
    protectedRoutes.some((r) => pathname.startsWith(r));

  const isAuth = authRoues.some((r) => pathname.startsWith(r));
  const supabase = await AuthService.Server();
  const user = await supabase.getUsers();


  if (!user && isProtected) {
     
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
     
      return NextResponse.redirect(url);
    }
    const addAccount=request.nextUrl.searchParams.get("add-account")==="true";
    if (isAuth && user && !addAccount) {
      return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
