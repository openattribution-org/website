/**
 * Neon Postgres connection for SvelteKit server-side code.
 * Shares the same database as the Rust services.
 */

import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

export function getDb() {
	const url = env.DATABASE_URL;
	if (!url) throw new Error('DATABASE_URL is not set');
	return neon(url);
}
