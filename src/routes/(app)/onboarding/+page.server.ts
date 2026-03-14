import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db.js';
import { checkDomainExists, registerDomain } from '$lib/server/identity.js';

function extractDomain(input: string): string | null {
	try {
		const withProtocol = input.startsWith('http') ? input : `https://${input}`;
		const hostname = new URL(withProtocol).hostname;
		return hostname.includes('.') ? hostname : null;
	} catch {
		return null;
	}
}

function slugify(domain: string): string {
	return domain
		.replace(/\./g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.slice(0, 48);
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		redirect(303, '/signup');
	}
	return {
		prefillDomain: url.searchParams.get('domain') ?? ''
	};
};

export const actions = {
	default: async ({ request, locals, cookies }) => {
		if (!locals.user || !locals.session) {
			redirect(303, '/signup');
		}

		const data = await request.formData();
		const url = data.get('url')?.toString().trim() ?? '';

		const domain = extractDomain(url);
		if (!domain) {
			return fail(400, { error: 'Please enter a valid domain (e.g. example.com)', url });
		}

		// Check if domain is already verified by another org
		const existing = await checkDomainExists(domain);
		if (existing.exists && existing.verified) {
			return fail(409, {
				error: 'already_verified',
				domain,
				url
			});
		}

		const sql = getDb();

		// Create org directly in our database
		const orgRows = await sql`
			INSERT INTO organizations (name, slug)
			VALUES (${domain}, ${slugify(domain)})
			RETURNING id
		`;
		const orgId = orgRows[0].id;

		// Create membership for this user
		await sql`
			INSERT INTO memberships (user_id, organization_id, role)
			VALUES (${locals.user.id}, ${orgId}, 'owner')
		`;

		// Set active org on the session
		await sql`
			UPDATE sessions SET organization_id = ${orgId}
			WHERE id = ${locals.session.id}
		`;

		// Register domain in oa-identity
		let domainRecord;
		try {
			domainRecord = await registerDomain(orgId, domain);
		} catch {
			domainRecord = {
				domain,
				verification_token: `oa-verify=${crypto.randomUUID()}`,
				id: null
			};
		}

		return {
			success: true,
			domain,
			token: domainRecord.verification_token
		};
	}
} satisfies Actions;
