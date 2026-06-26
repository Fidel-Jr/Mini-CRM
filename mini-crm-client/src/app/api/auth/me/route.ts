import { apiFetch } from "@/lib/api";

export async function GET() {
    const response = await apiFetch("/api/Auth/me");

    if (!response.ok) {
        return Response.json(null, {
            status: response.status,
        });
    }

    const user = await response.json();

    return Response.json(user);
}