import { cookies } from 'next/headers';

export async function apiFetch(
    path: string,
    init?: RequestInit
) {

    const token = (await cookies())
        .get("access_token")
        ?.value;


    const response = await fetch(
        `https://localhost:7187${path}`,
        {
            ...init,

            headers: {
                ...(init?.headers),

                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response;
}