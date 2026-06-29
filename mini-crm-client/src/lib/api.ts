import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
    path: string,
    init?: RequestInit
): Promise<Response> {

    const cookieStore = await cookies();

    let accessToken =
        cookieStore.get("access_token")?.value;

    const refreshToken =
        cookieStore.get("refresh_token")?.value;

    // Helper to call ASP.NET
    const sendRequest = async (token?: string) => {

        const headers = new Headers(init?.headers);

        if (token) {
            headers.set(
                "Authorization",
                `Bearer ${token}`
            );
        }

        return fetch(
            `${API_BASE}${path}`,
            {
                ...init,
                headers
            }
        );
    };

    // First attempt
    let response =
        await sendRequest(accessToken);

    // Success
    if (response.status !== 401) {
        return response;
    }

    // No refresh token available
    if (!refreshToken) {
        return response;
    }

    // Try refresh
    const refreshResponse =
        await fetch(
            `${API_BASE}/api/Auth/refresh`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken
                })
            }
        );

    // Refresh failed
    if (!refreshResponse.ok) {

        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");

        return response;
    }

    const tokens =
        await refreshResponse.json();

    // Save new cookies
    cookieStore.set(
        "access_token",
        tokens.accessToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            expires: new Date(
                tokens.accessTokenExpiresAt
            )
        }
    );

    cookieStore.set(
        "refresh_token",
        tokens.refreshToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            expires: new Date(
                tokens.refreshTokenExpiresAt
            )
        }
    );

    // Retry original request
    response =
        await sendRequest(tokens.accessToken);

    return response;
}