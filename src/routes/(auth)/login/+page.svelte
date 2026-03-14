<script lang="ts">
	import { enhance } from '$app/forms';
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { AlertCircle } from 'lucide-svelte';

	let { form } = $props();

	const theme = $derived(getTheme());
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Sign in - {theme.name}</title>
</svelte:head>

<h1 class="text-2xl text-center mb-6">Sign in</h1>

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

	<div>
		<label for="password" class="block text-sm font-light text-gray-700 mb-1">Password</label>
		<input
			id="password"
			name="password"
			type="password"
			required
			autocomplete="current-password"
			class="w-full px-4 py-3 rounded-lg border border-gray-300
			       focus:ring-2 focus:ring-brand-500 focus:border-transparent
			       transition font-light"
		/>
	</div>

	{#if form?.error}
		<div class="flex items-center gap-2 p-3 rounded-lg bg-brand-50 border border-brand-200">
			<AlertCircle size={16} class="text-brand-700 shrink-0" />
			<p class="text-sm text-brand-700 font-light">{form.error}</p>
		</div>
	{/if}

	<button
		type="submit"
		disabled={submitting}
		class="w-full px-8 py-3 bg-brand-600 text-white rounded-lg
		       hover:bg-brand-700 transition shadow-lg font-normal
		       disabled:opacity-60 disabled:cursor-not-allowed"
	>
		{#if submitting}
			<span class="inline-flex items-center gap-2">
				<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
				Signing in...
			</span>
		{:else}
			Sign in
		{/if}
	</button>
</form>

<p class="text-center text-sm text-gray-600 font-light mt-6">
	Don't have an account? <a href="/signup" class="text-brand-600 hover:text-brand-700 transition">Sign up</a>
</p>
