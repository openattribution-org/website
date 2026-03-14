export interface Domain {
	id: string;
	organization_id: string;
	domain: string;
	verified: boolean;
	verification_method: 'dns' | 'metatag' | null;
	verification_token: string;
	created_at: string;
	verified_at: string | null;
}

export interface ApiKey {
	id: string;
	organization_id: string;
	name: string;
	prefix: string;
	created_at: string;
}
