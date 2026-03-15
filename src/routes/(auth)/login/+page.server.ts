import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createMagicLinkToken, checkRateLimit } from '$lib/server/magic-link.js';
import { sendMagicLinkEmail } from '$lib/server/email.js';

export const load: PageServerLoad = async ({ url }) => {
	return {
		domain: url.searchParams.get('domain') ?? '',
		redirectTo: url.searchParams.get('redirect') ?? '',
		error: url.searchParams.get('error') ?? ''
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase() ?? '';
		const redirectTo = data.get('redirect')?.toString() ?? '';
		const domain = data.get('domain')?.toString() ?? '';

		if (!email) {
			return fail(400, { error: 'Email is required.', email });
		}

		const allowed = await checkRateLimit(email);
		if (!allowed) {
			return fail(429, { error: 'Too many requests. Wait a few minutes and try again.', email });
		}

		const rawToken = await createMagicLinkToken(
			email,
			redirectTo || null,
			domain || null
		);

		const authUrl = env.AUTH_URL ?? 'http://localhost:5173';
		const magicLinkUrl = `${authUrl}/login/verify?token=${rawToken}`;

		await sendMagicLinkEmail(email, magicLinkUrl);

		redirect(303, `/login/check-email?email=${encodeURIComponent(email)}`);
	}
} satisfies Actions;
