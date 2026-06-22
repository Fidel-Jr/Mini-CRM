import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({
        success: true
    });

    response.cookies.set("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0), // 👈 this deletes it
    });

    return response;
}