import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	return {
		initialUrl: url.searchParams.get('url') ?? ''
	};
};
