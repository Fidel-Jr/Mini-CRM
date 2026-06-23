import { apiFetch } from '@/lib/api';

export async function POST(req: Request) {

    const body = await req.json();

    const response = await apiFetch(
        '/api/Documents/chat/stream',
        {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(body)
        }
    );

    if (!response.ok) {
        return Response.json(
            { error: 'Chat failed' },
            { status: response.status }
        );
    }

    return new Response(response.body, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}