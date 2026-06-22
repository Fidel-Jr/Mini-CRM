import { cookies } from 'next/headers';

export async function POST() {

    const cookieStore = await cookies();

    const refreshToken =
        cookieStore.get("refresh_token")?.value;
        console.log(cookieStore.get("refresh_token")?.value)

    if (!refreshToken) {

        return Response.json(
            {
                error: "No refresh token"
            },
            {
                status: 401
            }
        );
    }


    const response = await fetch(
        "https://localhost:7187/api/Auth/refresh",
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


    if (!response.ok) {

        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");


        return Response.json(
            {
                error: "Refresh failed"
            },
            {
                status: 401
            }
        );
    }


    const tokens = await response.json();


    cookieStore.set(
        "access_token",
        tokens.accessToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/"
        }
    );


    cookieStore.set(
        "refresh_token",
        tokens.refreshToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/"
        }
    );


    return Response.json({
        success: true
    });
}