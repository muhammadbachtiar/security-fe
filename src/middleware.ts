import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessTokenHrd = request.cookies.get("session_hrd");
  const accessTokenWarehouse = request.cookies.get("session_wms");
  const accessTokenCore = request.cookies.get("session_core");

  if (request.nextUrl.pathname === "/login") {
    if (accessTokenCore) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname === "/warehouse/login") {
    if (accessTokenWarehouse) {
      return NextResponse.redirect(new URL("/warehouse", request.url));
    }
  }

  if (request.nextUrl.pathname === "/human-resource/login") {
    if (accessTokenHrd) {
      return NextResponse.redirect(new URL("/human-resource", request.url));
    }
  }

  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/warehouse") ||
    request.nextUrl.pathname.startsWith("/human-resource")
  ) {
    if (!accessTokenCore) {
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

    if (request.nextUrl.pathname.startsWith("/human-resource")) {
      if (request.nextUrl.pathname === "/human-resource/login") {
        if (accessTokenHrd) {
          return NextResponse.redirect(new URL("/human-resource", request.url));
        } else {
          return;
        }
      }
      if (!accessTokenHrd) {
        return NextResponse.redirect(
          new URL(`/human-resource/login`, request.url)
        );
      }
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login/:path*", "/:path*"],
};
