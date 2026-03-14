import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth.js';

export const actions = {
	default: async ({ cookies }) => {
		const token = cookies.get('session');
		if (token) {
			await invalidateSession(token);
		}
		cookies.delete('session', { path: '/' });
		redirect(303, '/');
	}
} satisfies Actions;
