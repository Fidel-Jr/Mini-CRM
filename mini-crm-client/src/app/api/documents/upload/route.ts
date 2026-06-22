// app/api/documents/upload/route.ts

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

    const response = await fetch(
        "https://localhost:7187/api/Documents/upload",
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