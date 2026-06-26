import { apiFetch } from '@/lib/api';

export async function PUT(req: Request) {

    const formData = await req.formData();

    const response = await apiFetch(
        '/api/Users/profile',
        {
            method: 'PUT',
            body: formData
        }
    );

    if (response.status === 204) {
        return new Response(null, {
            status: 204
        });
    }

    const contentType =
        response.headers.get('content-type');

    if (
        contentType?.includes(
            'application/json'
        )
    ) {

        const data =
            await response.json();

        return Response.json(
            data,
            {
                status:
                    response.status
            }
        );
    }


    const text =
        await response.text();

    return new Response(
        text,
        {
            status:
                response.status
        }
    );

}