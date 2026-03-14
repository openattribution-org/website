/**
 * SvelteKit server hooks.
 * Reads session cookie, validates against DB, populates locals.
 */

import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	if (token) {
		const { user, session } = await validateSession(token);
		event.locals.user = user;
		event.locals.session = session
			? { id: session.id, organizationId: session.organizationId }
			: null;
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}

	return resolve(event);
};
