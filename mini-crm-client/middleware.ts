import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';



export function middleware(req:NextRequest){

    const token =
        req.cookies.get("access_token");


    const pathname =
        req.nextUrl.pathname;


    const publicRoutes=[
        "/login"
    ];


    if(
        !token &&
        !publicRoutes.includes(pathname)
    ){

        return NextResponse.redirect(
            new URL("/login",req.url)
        );

    }


    return NextResponse.next();

}



export const config={

matcher:[
"/((?!api|_next|favicon.ico).*)"
]

};