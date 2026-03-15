/**
 * Magic link token creation and verification.
 */

import { getDb } from './db.js';
import { hashToken, generateToken, getUserByEmail } from './auth.js';

const MAGIC_LINK_EXPIRY_MINUTES = 15;
const RATE_LIMIT_WINDOW_MINUTES = 5;
const RATE_LIMIT_MAX = 3;

export interface MagicLinkData {
	email: string;
	userId: string | null;
	redirectTo: string | null;
	domain: string | null;
}

/**
 * Check rate limit for an email. Returns true if sending is allowed.
 */
export async function checkRateLimit(email: string): Promise<boolean> {
	const sql = getDb();
	const cutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
	const rows = await sql`
		SELECT COUNT(*)::int AS cnt
		FROM magic_link_tokens
		WHERE email = ${email}
		  AND created_at > ${cutoff}
	`;
	return rows[0].cnt < RATE_LIMIT_MAX;
}

/**
 * Create a magic link token and store its hash in the database.
 * Returns the raw (unhashed) token for inclusion in the email link.
 */
export async function createMagicLinkToken(
	email: string,
	redirectTo: string | null,
	domain: string | null
): Promise<string> {
	const sql = getDb();

	// Look up existing user to store user_id on the token
	const user = await getUserByEmail(email);
	const userId = user?.id ?? null;

	const rawToken = generateToken();
	const id = hashToken(rawToken);
	const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000);

	await sql`
		INSERT INTO magic_link_tokens (id, email, user_id, redirect_to, domain, expires_at)
		VALUES (${id}, ${email}, ${userId}, ${redirectTo}, ${domain}, ${expiresAt})
	`;

	return rawToken;
}

/**
 * Verify a magic link token. Returns the token data if valid, null if expired or not found.
 * Deletes the token (single-use) and cleans up other tokens for the same email.
 */
export async function verifyMagicLinkToken(rawToken: string): Promise<MagicLinkData | null> {
	const sql = getDb();
	const id = hashToken(rawToken);

	const rows = await sql`
		SELECT email, user_id, redirect_to, domain
		FROM magic_link_tokens
		WHERE id = ${id}
		  AND expires_at > NOW()
	`;

	if (rows.length === 0) {
		return null;
	}

	const row = rows[0];

	// Delete this token and all other tokens for this email
	await sql`DELETE FROM magic_link_tokens WHERE email = ${row.email}`;

	return {
		email: row.email,
		userId: row.user_id,
		redirectTo: row.redirect_to,
		domain: row.domain
	};
}
