import { apiFetch } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    const response = await apiFetch("/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        // safely read body — might be empty
        const text = await response.text();
        const error = text ? JSON.parse(text) : { message: "Login failed" };
        return NextResponse.json(error, { status: response.status });
    }

    const result = await response.json();

    const cookieStore = await cookies();

    cookieStore.set("access_token", result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        expires: new Date(result.accessTokenExpiresAt),
    });

    cookieStore.set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        expires: new Date(result.refreshTokenExpiresAt),
    });

    return NextResponse.json({ success: true });
}