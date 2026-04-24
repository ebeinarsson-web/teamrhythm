import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PUBLIC_PATHS = ["/sign-in", "/api/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path));
}

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const authenticated = Boolean(request.auth);

  if (!authenticated && !isPublicPath(pathname)) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (authenticated && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
