import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await getSession();

  // If the user is not logged in and trying to access parent routes
  if (!session && request.nextUrl.pathname.startsWith("/parent")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is logged in and trying to access login/signup
  if (session && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/parent/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent/:path*", "/login", "/signup"],
};
