/**
 * GET /login/google/callback - Handle Google OAuth callback.
 * Exchanges code for tokens, finds or creates user, creates session.
 */

import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGoogleProvider, type GoogleUser } from '$lib/server/oauth.js';
import { createSession, getUserOrCreateByEmail } from '$lib/server/auth.js';
import { getDb } from '$lib/server/db.js';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code || !state) {
		error(400, 'Missing code or state');
	}

	// Read and validate stored state
	const storedRaw = cookies.get('google_oauth_state');
	if (!storedRaw) {
		error(400, 'Missing OAuth state cookie');
	}

	const stored = JSON.parse(storedRaw) as {
		state: string;
		codeVerifier: string;
		redirect: string;
		domain: string;
	};

	if (state !== stored.state) {
		error(400, 'State mismatch');
	}

	cookies.delete('google_oauth_state', { path: '/' });

	// Exchange code for tokens
	const google = getGoogleProvider();
	const tokens = await google.validateAuthorizationCode(code, stored.codeVerifier);
	const accessToken = tokens.accessToken();

	// Fetch Google profile
	const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	if (!res.ok) {
		error(502, 'Failed to fetch Google profile');
	}

	const googleUser = (await res.json()) as GoogleUser;

	const sql = getDb();

	// Check if this Google account is already linked
	const oauthRows = await sql`
		SELECT user_id FROM oauth_accounts
		WHERE provider = 'google' AND provider_user_id = ${googleUser.sub}
	`;

	let userId: string;
	let isNew = false;

	if (oauthRows.length > 0) {
		// Existing OAuth link
		userId = oauthRows[0].user_id;
	} else {
		// Find or create user by email, then link OAuth account
		const result = await getUserOrCreateByEmail(googleUser.email, googleUser.name);
		userId = result.user.id;
		isNew = result.isNew;

		await sql`
			INSERT INTO oauth_accounts (provider, provider_user_id, user_id)
			VALUES ('google', ${googleUser.sub}, ${userId})
		`;

		// Ensure email is marked verified (Google verified it)
		await sql`UPDATE users SET email_verified = TRUE WHERE id = ${userId}`;
	}

	// Create session
	const { token } = await createSession(userId);

	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 30 * 24 * 60 * 60
	});

	// Redirect: new users go to onboarding, existing users to dashboard/redirect
	if (isNew) {
		const onboardingUrl = stored.domain
			? `/onboarding?domain=${encodeURIComponent(stored.domain)}`
			: '/onboarding';
		redirect(303, onboardingUrl);
	}

	const redirectTo = stored.redirect && stored.redirect.startsWith('/') && !stored.redirect.startsWith('//')
		? stored.redirect
		: '/dashboard';
	redirect(303, redirectTo);
};
