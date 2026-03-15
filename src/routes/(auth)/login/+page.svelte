<script lang="ts">
	import { enhance } from '$app/forms';
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { AlertCircle, Mail } from 'lucide-svelte';

	let { form, data } = $props();

	const theme = $derived(getTheme());
	let submitting = $state(false);

	const domain = $derived(data.domain);
	const redirectTo = $derived(data.redirectTo);
	const urlError = $derived(data.error);

	const googleUrl = $derived(() => {
		const params = new URLSearchParams();
		if (redirectTo) params.set('redirect', redirectTo);
		if (domain) params.set('domain', domain);
		const qs = params.toString();
		return `/login/google${qs ? `?${qs}` : ''}`;
	});

	const errorMessage = $derived(
		form?.error ||
		(urlError === 'expired' ? 'That link has expired. Request a new one.' : '') ||
		(urlError === 'invalid' ? 'Invalid sign-in link.' : '')
	);
</script>

<svelte:head>
	<title>Sign in - {theme.name}</title>
</svelte:head>

{#if domain}
	<div class="mb-6 p-4 rounded-lg bg-brand-50 border border-brand-200 text-center">
		<p class="text-sm text-brand-800 font-light">
			Sign in to register <strong>{domain}</strong> with {theme.name}
		</p>
	</div>
{/if}

<h1 class="text-2xl text-center mb-6">Sign in</h1>

<a
	href={googleUrl()}
	class="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white border border-gray-300
	       rounded-lg hover:bg-gray-50 transition text-gray-800 font-normal"
>
	<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
		<path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
		<path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
		<path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
		<path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
	</svg>
	Continue with Google
</a>

<div class="flex items-center gap-4 my-6">
	<div class="flex-1 border-t border-gray-200"></div>
	<span class="text-sm text-gray-400 font-light">or</span>
	<div class="flex-1 border-t border-gray-200"></div>
</div>

<form
	method="POST"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			submitting = false;
			await update();
		};
	}}
	class="space-y-4"
>
	<input type="hidden" name="redirect" value={redirectTo} />
	<input type="hidden" name="domain" value={domain} />

	<div>
		<label for="email" class="block text-sm font-light text-gray-700 mb-1">Email</label>
		<input
			id="email"
			name="email"
			type="email"
			required
			autocomplete="email"
			value={form?.email ?? ''}
			class="w-full px-4 py-3 rounded-lg border border-gray-300
			       focus:ring-2 focus:ring-brand-500 focus:border-transparent
			       transition font-light"
		/>
	</div>

	{#if errorMessage}
		<div class="flex items-center gap-2 p-3 rounded-lg bg-brand-50 border border-brand-200">
			<AlertCircle size={16} class="text-brand-700 shrink-0" />
			<p class="text-sm text-brand-700 font-light">{errorMessage}</p>
		</div>
	{/if}

	<button
		type="submit"
		disabled={submitting}
		class="w-full inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-lg
		       hover:bg-brand-700 transition shadow-lg font-normal
		       disabled:opacity-60 disabled:cursor-not-allowed"
	>
		{#if submitting}
			<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
			Sending link...
		{:else}
			<Mail size={16} />
			Send sign-in link
		{/if}
	</button>
</form>
