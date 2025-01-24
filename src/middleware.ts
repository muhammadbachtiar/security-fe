import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("session");

  if (request.nextUrl.pathname === "/login") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname === "/") {
    if (!accessToken) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login/:path*", "/:path*"],
};
