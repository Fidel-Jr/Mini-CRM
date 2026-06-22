// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(
    request: NextRequest
){

    const token =
        request.cookies.get(
            "accessToken"
        );

    if(
        !token &&
        request.nextUrl.pathname.startsWith(
            "/dashboard"
        )
    ){

        return NextResponse.redirect(
            new URL(
                "/login",
                request.url
            )
        );

    }

    return NextResponse.next();

}


export const config = {

    matcher:[
        "/dashboard/:path*"
    ]

};