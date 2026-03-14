import { request } from './client.js';
import type { Domain } from './types.js';

export function listDomains(): Promise<Domain[]> {
	return request<Domain[]>('/api/v1/identity/domains');
}

export function registerDomain(domain: string): Promise<Domain> {
	return request<Domain>('/api/v1/identity/domains', {
		method: 'POST',
		body: JSON.stringify({ domain })
	});
}

export function verifyDomain(domainId: string): Promise<Domain> {
	return request<Domain>(`/api/v1/identity/domains/${domainId}/verify`, {
		method: 'POST'
	});
}

export function deleteDomain(domainId: string): Promise<void> {
	return request<void>(`/api/v1/identity/domains/${domainId}`, {
		method: 'DELETE'
	});
}
