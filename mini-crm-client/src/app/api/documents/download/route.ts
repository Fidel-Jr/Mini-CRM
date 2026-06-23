import { apiFetch } from "@/lib/api";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const response = await apiFetch(
        `/api/Documents/${id}/download`
    );

    if (!response.ok) {
        return Response.json(
            { error: "Download failed" },
            { status: response.status }
        );
    }

    return new Response(response.body, {
        headers: {
            "Content-Type":
                response.headers.get("Content-Type") ??
                "application/octet-stream",

            "Content-Disposition":
                response.headers.get("Content-Disposition") ??
                "attachment"
        }
    });
}