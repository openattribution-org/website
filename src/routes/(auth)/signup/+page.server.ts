import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createUser, createSession } from '$lib/server/auth.js';

export const load: PageServerLoad = async ({ url }) => {
	return {
		domain: url.searchParams.get('domain') ?? ''
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim() || null;
		const email = data.get('email')?.toString().trim().toLowerCase() ?? '';
		const password = data.get('password')?.toString() ?? '';
		const domain = data.get('domain')?.toString().trim() ?? '';

		if (!email) {
			return fail(400, { error: 'Email is required.', name, email });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters.', name, email });
		}

		let user;
		try {
			user = await createUser(email, password, name);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			if (message.includes('unique') || message.includes('duplicate')) {
				return fail(400, { error: 'An account with this email already exists.', name, email });
			}
			throw err;
		}

		const { token } = await createSession(user.id);

		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		const onboardingUrl = domain ? `/onboarding?domain=${encodeURIComponent(domain)}` : '/onboarding';
		redirect(303, onboardingUrl);
	}
} satisfies Actions;
