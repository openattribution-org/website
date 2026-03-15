/**
 * Google OAuth via Arctic.
 */

import { Google } from 'arctic';
import { env } from '$env/dynamic/private';

export function getGoogleProvider(): Google {
	const clientId = env.GOOGLE_CLIENT_ID;
	const clientSecret = env.GOOGLE_CLIENT_SECRET;
	const authUrl = env.AUTH_URL ?? 'http://localhost:5173';

	if (!clientId || !clientSecret) {
		throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set');
	}

	return new Google(clientId, clientSecret, `${authUrl}/login/google/callback`);
}

export interface GoogleUser {
	sub: string;
	email: string;
	name: string;
	picture: string;
	email_verified: boolean;
}
