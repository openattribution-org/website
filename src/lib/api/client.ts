/**
 * Typed HTTP client for the OA gateway via server-side proxy.
 * Requests go to /api/... on the same origin - the proxy attaches
 * the session token from the httpOnly cookie. No tokens in the browser.
 */

export class ApiError extends Error {
	constructor(
		public status: number,
		public detail: string
	) {
		super(`${status}: ${detail}`);
		this.name = 'ApiError';
	}
}

export async function request<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>)
	};

	const res = await fetch(endpoint, {
		...options,
		headers
	});

	if (!res.ok) {
		const body = await res.text();
		let detail: string;
		try {
			detail = JSON.parse(body).detail ?? body;
		} catch {
			detail = body;
		}
		throw new ApiError(res.status, detail);
	}

	if (res.status === 204) return undefined as T;
	return res.json();
}
