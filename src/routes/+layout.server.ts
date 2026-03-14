import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, cookies }) => {
	return {
		user: locals.user,
		sessionToken: cookies.get('session') ?? null
	};
};
