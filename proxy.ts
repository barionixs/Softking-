import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isLoginRoute = path === "/login";

  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (isAdminRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && session?.userId) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
