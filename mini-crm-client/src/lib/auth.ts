// lib/auth.ts

import { cookies } from 'next/headers';

export async function getUser() {
    const token = (await cookies())
        .get('access_token')
        ?.value;

        console.log("Token exists:", !!token);
        console.log("Token:", token);


    if (!token) {
        return null;
    }

    const res = await fetch(
        "https://localhost:7187/api/Auth/me",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        }
    );

    if (!res.ok) {
        console.log("Not Ok")
        return null;
    }

    return res.json();
}