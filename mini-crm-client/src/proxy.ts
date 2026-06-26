import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const hasAccessToken =
        request.cookies.has("access_token");

    const hasRefreshToken =
        request.cookies.has("refresh_token");

    const hasSession =
        hasAccessToken || hasRefreshToken;

    // Protected routes
    if (
        pathname.startsWith("/dashboard") &&
        !hasSession
    ) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    // Already logged in
    if (
        pathname === "/login" &&
        hasSession
    ) {
        return NextResponse.redirect(
            new URL("/dashboard/crm", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login"
    ]
};