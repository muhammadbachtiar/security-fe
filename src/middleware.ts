import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("session");
  const accessTokenWarehouse = request.cookies.get("session_wms");

  if (request.nextUrl.pathname === "/login") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname === "/warehouse/login") {
    if (accessTokenWarehouse) {
      return NextResponse.redirect(new URL("/warehouse", request.url));
    }
  }

  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/warehouse")
  ) {
    if (!accessToken) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }

    if (request.nextUrl.pathname.startsWith("/warehouse")) {
      if (request.nextUrl.pathname === "/warehouse/login") {
        if (accessTokenWarehouse) {
          return NextResponse.redirect(new URL("/warehouse", request.url));
        } else {
          return;
        }
      }
      if (!accessTokenWarehouse) {
        return NextResponse.redirect(new URL(`/warehouse/login`, request.url));
      }
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login/:path*", "/:path*"],
};
