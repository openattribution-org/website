import { resolveTheme, type ThemeConfig } from '$lib/theme/tokens.js';

let current = $state<ThemeConfig>(resolveTheme());

export function getTheme(): ThemeConfig {
	return current;
}

export function setTheme(id: string) {
	current = resolveTheme(id);
}
