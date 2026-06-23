// app/api/documents/upload/route.ts

import { apiFetch } from '@/lib/api';
import { cookies } from 'next/headers';

export async function POST(req: Request) {

    const token = (await cookies())
        .get("access_token")
        ?.value;

    if (!token) {
        return Response.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const formData = await req.formData();

    const response = await apiFetch(
        "/api/Documents/upload",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );

    const result = await response.json();

    return Response.json(
        result,
        { status: response.status }
    );
}