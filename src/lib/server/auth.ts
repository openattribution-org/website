/**
 * Session management following Lucia patterns.
 * Sessions stored in Postgres. Passwordless - auth via magic link or OAuth.
 */

import { getDb } from './db.js';
import crypto from 'node:crypto';

const SESSION_EXPIRY_DAYS = 30;

/** Hash a token with SHA-256 before storing/looking up in DB. */
export function hashToken(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export interface SessionUser {
	id: string;
	email: string;
	name: string | null;
}

export interface Session {
	id: string;
	userId: string;
	organizationId: string | null;
	expiresAt: Date;
}

export interface SessionValidationResult {
	user: SessionUser | null;
	session: Session | null;
}

// --- Sessions ---

export async function createSession(userId: string, organizationId: string | null = null): Promise<{ token: string; session: Session }> {
	const sql = getDb();
	const token = generateToken();
	const id = hashToken(token);
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

	await sql`
		INSERT INTO auth_sessions (id, user_id, organization_id, expires_at)
		VALUES (${id}, ${userId}, ${organizationId}, ${expiresAt})
	`;

	return { token, session: { id, userId, organizationId, expiresAt } };
}

export async function validateSession(token: string): Promise<SessionValidationResult> {
	const sql = getDb();
	const id = hashToken(token);

	const rows = await sql`
		SELECT
			s.id AS session_id,
			s.user_id,
			s.organization_id,
			s.expires_at,
			u.email,
			u.name
		FROM auth_sessions s
		JOIN users u ON u.id = s.user_id
		WHERE s.id = ${id}
		  AND s.expires_at > NOW()
	`;

	if (rows.length === 0) {
		return { user: null, session: null };
	}

	const row = rows[0];

	// Extend session if it's more than halfway through its lifetime
	const expiresAt = new Date(row.expires_at);
	const halfLife = (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000) / 2;
	if (expiresAt.getTime() - Date.now() < halfLife) {
		const newExpiry = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
		await sql`UPDATE auth_sessions SET expires_at = ${newExpiry} WHERE id = ${id}`;
		expiresAt.setTime(newExpiry.getTime());
	}

	return {
		user: {
			id: row.user_id,
			email: row.email,
			name: row.name
		},
		session: {
			id: row.session_id,
			userId: row.user_id,
			organizationId: row.organization_id,
			expiresAt
		}
	};
}

export async function invalidateSession(token: string): Promise<void> {
	const sql = getDb();
	const id = hashToken(token);
	await sql`DELETE FROM auth_sessions WHERE id = ${id}`;
}

export async function switchOrganization(token: string, organizationId: string, userId: string): Promise<boolean> {
	const sql = getDb();

	// Verify membership
	const membership = await sql`
		SELECT 1 FROM memberships
		WHERE user_id = ${userId} AND organization_id = ${organizationId}
	`;
	if (membership.length === 0) return false;

	const id = hashToken(token);
	await sql`UPDATE auth_sessions SET organization_id = ${organizationId} WHERE id = ${id}`;
	return true;
}

// --- Users ---

export async function createUser(email: string, name: string | null = null): Promise<SessionUser> {
	const sql = getDb();

	const rows = await sql`
		INSERT INTO users (email, name, email_verified)
		VALUES (${email}, ${name}, TRUE)
		RETURNING id, email, name
	`;

	return rows[0] as SessionUser;
}

export async function getUserByEmail(email: string): Promise<SessionUser | null> {
	const sql = getDb();
	const rows = await sql`SELECT id, email, name FROM users WHERE email = ${email}`;
	if (rows.length === 0) return null;
	return rows[0] as SessionUser;
}

/**
 * Find existing user by email or create a new one.
 * Returns the user and whether they were just created.
 */
export async function getUserOrCreateByEmail(
	email: string,
	name: string | null = null
): Promise<{ user: SessionUser; isNew: boolean }> {
	const existing = await getUserByEmail(email);
	if (existing) {
		return { user: existing, isNew: false };
	}
	const user = await createUser(email, name);
	return { user, isNew: true };
}
