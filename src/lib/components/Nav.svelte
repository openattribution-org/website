<script lang="ts">
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { page } from '$app/stores';

	const theme = $derived(getTheme());
	const user = $derived($page.data.user);
</script>

<nav class="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-brand-100">
	<div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
		<a href="/" class="flex items-center gap-2 text-gray-900 font-normal text-lg">
			<img src={theme.logoUrl} alt={theme.logoAlt} class="h-8 w-auto" />
			{theme.name}
		</a>
		<div class="flex items-center gap-6">
			{#if user}
				<a href="/dashboard" class="text-gray-600 hover:text-brand-600 transition font-light">
					Dashboard
				</a>
				<a href="/domains" class="text-gray-600 hover:text-brand-600 transition font-light">
					Domains
				</a>
				<div class="flex items-center gap-3">
					<span class="text-sm text-gray-600 font-light">{user.email}</span>
					<form method="POST" action="/logout">
						<button
							type="submit"
							class="text-sm text-gray-500 hover:text-brand-600 transition font-light"
						>
							Sign out
						</button>
					</form>
				</div>
			{:else}
				<a href="/login" class="text-gray-600 hover:text-brand-600 transition font-light">
					Sign in
				</a>
				<a href="/signup" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-normal text-sm">
					Get started
				</a>
			{/if}
		</div>
	</div>
</nav>
