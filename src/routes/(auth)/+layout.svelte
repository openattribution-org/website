<script lang="ts">
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import type { Snippet } from 'svelte';

	const theme = $derived(getTheme());
	let { children }: { children: Snippet } = $props();
</script>

<div class="min-h-screen flex items-center justify-center px-6">
	<div class="w-full max-w-sm">
		<div class="text-center mb-8">
			<a href="/">
				<img src={theme.logoUrl} alt={theme.logoAlt} class="h-10 w-auto mx-auto mb-4" />
			</a>
		</div>
		{@render children()}
	</div>
</div>
