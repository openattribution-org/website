/**
 * Typed HTTP client for the OA gateway.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8100';

export class ApiError extends Error {
	constructor(
		public status: number,
		public detail: string
	) {
		super(`${status}: ${detail}`);
		this.name = 'ApiError';
	}
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
	authToken = token;
}

export async function request<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>)
	};

	if (authToken) {
		headers['Authorization'] = `Bearer ${authToken}`;
	}

	const res = await fetch(`${API_BASE}${endpoint}`, {
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
