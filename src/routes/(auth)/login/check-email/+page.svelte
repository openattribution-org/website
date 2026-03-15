<script lang="ts">
	import { page } from '$app/stores';
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { Mail } from 'lucide-svelte';

	const theme = $derived(getTheme());
	const email = $derived($page.url.searchParams.get('email') ?? '');
</script>

<svelte:head>
	<title>Check your email - {theme.name}</title>
</svelte:head>

<div class="text-center">
	<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 mb-6">
		<Mail size={32} class="text-brand-600" />
	</div>

	<h1 class="text-2xl mb-3">Check your email</h1>

	<p class="text-gray-600 font-light mb-2">
		We sent a sign-in link to
	</p>
	{#if email}
		<p class="font-normal text-gray-900 mb-6">{email}</p>
	{/if}

	<p class="text-sm text-gray-500 font-light mb-8">
		Click the link in the email to sign in. It expires in 15 minutes.
	</p>

	<a href="/login" class="text-sm text-brand-600 hover:text-brand-700 transition font-light">
		Back to sign in
	</a>
</div>
