import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {

    const token =
        request.cookies.get("access_token")?.value;

    const path =
        request.nextUrl.pathname;


    // Not authenticated
    if (
        !token &&
        path.startsWith("/dashboard")
    ) {

        return NextResponse.redirect(
            new URL(
                "/login",
                request.url
            )
        );
    }


    // Already authenticated
    if (
        token &&
        path === "/login"
    ) {

        return NextResponse.redirect(
            new URL(
                "/dashboard/crm",
                request.url
            )
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