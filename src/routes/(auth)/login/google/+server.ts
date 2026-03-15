/**
 * GET /login/google - Initiate Google OAuth flow.
 * Stores state + PKCE verifier + context in a cookie, then redirects to Google.
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGoogleProvider } from '$lib/server/oauth.js';
import { generateToken } from '$lib/server/auth.js';
import { generateCodeVerifier } from 'arctic';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const google = getGoogleProvider();
	const state = generateToken();
	const codeVerifier = generateCodeVerifier();

	const redirectTo = url.searchParams.get('redirect') ?? '';
	const domain = url.searchParams.get('domain') ?? '';

	// Store context in a cookie - Google won't forward our query params
	cookies.set('google_oauth_state', JSON.stringify({
		state,
		codeVerifier,
		redirect: redirectTo,
		domain
	}), {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 600 // 10 minutes
	});

	const authUrl = google.createAuthorizationURL(state, codeVerifier, ['openid', 'email', 'profile']);

	redirect(302, authUrl.toString());
};
