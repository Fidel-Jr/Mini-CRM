import { apiFetch } from "@/lib/api";

export async function GET() {

    const response = await apiFetch(
        "/api/Users/roles"
    );

    const data = await response.json();

    return Response.json(data);
}