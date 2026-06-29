export async function GET() {
    return Response.json({
        API_URL: process.env.NEXT_PUBLIC_API_URL ?? "NOT SET",
        NODE_ENV: process.env.NODE_ENV,
    });
}