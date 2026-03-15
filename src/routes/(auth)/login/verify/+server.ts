/**
 * GET /login/verify?token=... - Verify a magic link token.
 * Finds or creates user, creates session, redirects.
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyMagicLinkToken } from '$lib/server/magic-link.js';
import { createSession, getUserOrCreateByEmail } from '$lib/server/auth.js';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const rawToken = url.searchParams.get('token');

	if (!rawToken) {
		redirect(303, '/login?error=invalid');
	}

	const data = await verifyMagicLinkToken(rawToken);

	if (!data) {
		redirect(303, '/login?error=expired');
	}

	// Find or create user
	let userId: string;
	let isNew: boolean;

	if (data.userId) {
		userId = data.userId;
		isNew = false;
	} else {
		const result = await getUserOrCreateByEmail(data.email);
		userId = result.user.id;
		isNew = result.isNew;
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
		const onboardingUrl = data.domain
			? `/onboarding?domain=${encodeURIComponent(data.domain)}`
			: '/onboarding';
		redirect(303, onboardingUrl);
	}

	const redirectTo = data.redirectTo && data.redirectTo.startsWith('/') && !data.redirectTo.startsWith('//')
		? data.redirectTo
		: '/dashboard';
	redirect(303, redirectTo);
};
