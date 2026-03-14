import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getUserByEmail, verifyPassword, createSession } from '$lib/server/auth.js';

export const actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase() ?? '';
		const password = data.get('password')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.', email });
		}

		const user = await getUserByEmail(email);
		if (!user) {
			return fail(400, { error: 'Invalid email or password.', email });
		}

		const valid = await verifyPassword(user.password_hash, password);
		if (!valid) {
			return fail(400, { error: 'Invalid email or password.', email });
		}

		const { token } = await createSession(user.id);

		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		const redirectParam = url.searchParams.get('redirect') ?? '/dashboard';
		// Prevent open redirect - only allow relative paths
		const redirectTo = redirectParam.startsWith('/') && !redirectParam.startsWith('//') ? redirectParam : '/dashboard';
		redirect(303, redirectTo);
	}
} satisfies Actions;
