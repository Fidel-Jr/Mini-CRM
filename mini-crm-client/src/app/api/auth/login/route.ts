import { apiFetch } from '@/lib/api';
import { cookies } from 'next/headers';

export async function POST(req:Request){

    const body = await req.json();

    const response = await apiFetch(
        "/api/Auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        },
    );


    const result = await response.json();

    if(!response.ok)
        return Response.json(result,{status:401});


    const cookieStore = await cookies();

    cookieStore.set(
        "access_token",
        result.accessToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(result.accessTokenExpiresAt)
        }
    );

    cookieStore.set(
        "refresh_token",
        result.refreshToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            expires: new Date(result.refreshTokenExpiresAt)
        }
    );

    return Response.json({
        success:true
    });

}