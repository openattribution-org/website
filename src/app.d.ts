declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				email: string;
				name: string | null;
			} | null;
			session: {
				id: string;
				organizationId: string | null;
			} | null;
		}
	}
}

export {};
