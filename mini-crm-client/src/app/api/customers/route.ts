import { apiFetch } from "@/lib/api";


export async function GET() {

    const response = await apiFetch(
        "/api/Customers"
    );

    const data = await response.json();

    return Response.json(data);
}

export async function POST(req: Request) {

    const body = await req.json();

    const response = await apiFetch(
        "/api/Customers",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(body),
        }
    );

    const data = await response.json();

    return Response.json(
        data,
        {
            status: response.status
        }
    );
}