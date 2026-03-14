/**
 * Theme configuration for white-labelling.
 * Resolved at startup from PUBLIC_THEME env var or subdomain.
 */

export interface ThemeConfig {
	id: string;
	name: string;
	logoUrl: string;
	logoAlt: string;
	supportEmail: string;
}

const themes: Record<string, ThemeConfig> = {
	oa: {
		id: 'oa',
		name: 'OpenAttribution',
		logoUrl: '/logo.svg',
		logoAlt: 'OpenAttribution',
		supportEmail: 'hello@openattribution.org'
	},
	spur: {
		id: 'spur',
		name: 'SPUR',
		logoUrl: '/logos/spur.png',
		logoAlt: 'SPUR',
		supportEmail: 'support@spur.press'
	}
};

export function resolveTheme(themeId?: string): ThemeConfig {
	return themes[themeId ?? 'oa'] ?? themes.oa;
}
