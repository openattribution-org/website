/**
 * API proxy - forwards client-side requests to the gateway.
 * Attaches the session token from the httpOnly cookie so it never reaches the browser.
 */

import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

async function proxy({ request, params, cookies }: { request: Request; params: { path: string }; cookies: { get: (name: string) => string | undefined } }) {
	const gatewayUrl = env.OA_GATEWAY_URL ?? 'http://localhost:8100';
	const target = `${gatewayUrl}/api/${params.path}`;

	const headers = new Headers();
	headers.set('Content-Type', request.headers.get('Content-Type') ?? 'application/json');

	const token = cookies.get('session');
	if (token) {
		headers.set('Authorization', `Bearer ${token}`);
	}

	const res = await fetch(target, {
		method: request.method,
		headers,
		body: request.method !== 'GET' && request.method !== 'HEAD'
			? await request.text()
			: undefined
	});

	return new Response(res.body, {
		status: res.status,
		headers: {
			'Content-Type': res.headers.get('Content-Type') ?? 'application/json'
		}
	});
}

export const GET: RequestHandler = (event) => proxy(event);
export const POST: RequestHandler = (event) => proxy(event);
export const PUT: RequestHandler = (event) => proxy(event);
export const PATCH: RequestHandler = (event) => proxy(event);
export const DELETE: RequestHandler = (event) => proxy(event);
