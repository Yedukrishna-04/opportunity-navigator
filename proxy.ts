import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const protectedPath = ["/dashboard", "/cases", "/resources"].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!protectedPath) return NextResponse.next();

  const user = await verifySession(request.cookies.get("opnav_session")?.value);
  if (!user) {
    const login = new URL("/", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cases/:path*", "/resources/:path*"]
};
