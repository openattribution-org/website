/**
 * Server-side client for oa-identity.
 * Hits the gateway or identity service directly for domain and org operations.
 */

import { env } from '$env/dynamic/private';

function getBaseUrl(): string {
	return env.OA_GATEWAY_URL ?? 'http://localhost:8100';
}

function getIdentityUrl(): string {
	return env.OA_IDENTITY_URL ?? 'http://localhost:8001';
}

interface DomainRecord {
	id: string;
	organization_id: string;
	domain: string;
	verification_token: string;
	verification_method: string;
	verified_at: string | null;
	created_at: string;
}

interface DomainCheckResult {
	exists: boolean;
	verified: boolean;
	organization_id?: string;
}

/**
 * Check if a domain is already registered and verified by any org.
 */
export async function checkDomainExists(domain: string): Promise<DomainCheckResult> {
	try {
		const res = await fetch(
			`${getBaseUrl()}/api/v1/telemetry/resolve?domain=${encodeURIComponent(domain)}`
		);
		if (res.ok) {
			const data = await res.json();
			if (data.handled && data.organization) {
				return { exists: true, verified: true, organization_id: data.organization.id };
			}
		}
	} catch {
		// Resolve endpoint might not be running in dev
	}
	return { exists: false, verified: false };
}

/**
 * Register a domain for an org via the identity service.
 * Bypasses gateway auth and hits identity directly with the org ID header.
 */
export async function registerDomain(orgId: string, domain: string): Promise<DomainRecord> {
	const res = await fetch(`${getIdentityUrl()}/domains`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Organization-Id': orgId
		},
		body: JSON.stringify({ domain })
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Failed to register domain: ${res.status} ${body}`);
	}

	return res.json();
}
