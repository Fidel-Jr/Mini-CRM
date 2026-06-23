import { apiFetch } from "@/lib/api";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    const response = await apiFetch(
        `/api/Users/${id}/deactivate`,
        {
            method: "PATCH"
        }
    );

    if (response.status === 204) {
        return new Response(null, {
            status: 204
        });
    }

    const text = await response.text();

    return new Response(
        text,
        {
            status: response.status
        }
    );
}