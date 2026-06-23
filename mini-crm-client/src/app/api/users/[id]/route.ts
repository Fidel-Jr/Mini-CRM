import { apiFetch } from '@/lib/api';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const body = await req.json();

    const { id } = await params;

    const response = await apiFetch(
        `/api/Users/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    // ASP.NET returns 204
    if (response.status === 204) {
        return new Response(null, {
            status: 204
        });
    }

    const data = await response.json();

    return Response.json(data, {
        status: response.status
    });
}