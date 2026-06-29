import http from "node:http";
import https from "node:https";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7187";

type BackendFetchOptions = {
	method?: string;
	headers?: Record<string, string>;
	body?: string;
};

const isLocalhost = (hostname: string) =>
	hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

export function backendUrl(path: string) {
	return new URL(path, backendBaseUrl);
}

export function backendFetch(path: string, init: BackendFetchOptions = {}) {
	const url = backendUrl(path);

	return new Promise<Response>((resolve, reject) => {
		const request =
			url.protocol === "https:" ? https.request : http.request;

		const req = request(
			url,
			{
				method: init.method ?? "GET",
				headers: init.headers,
				rejectUnauthorized:
					url.protocol === "https:" && isLocalhost(url.hostname) ? false : undefined,
			},
			(res) => {
				const chunks: Buffer[] = [];

				res.on("data", (chunk: Buffer) => {
					chunks.push(chunk);
				});

				res.on("end", () => {
					resolve(
						new Response(Buffer.concat(chunks), {
							status: res.statusCode,
							headers: res.headers as HeadersInit,
						}),
					);
				});
			},
		);

		req.on("error", reject);

		if (init.body) {
			req.write(init.body);
		}

		req.end();
	});
}
