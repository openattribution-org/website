<script lang="ts">
	import { enhance } from '$app/forms';
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { Bot, CheckCircle, AlertCircle, Copy, Check, Eye, EyeOff } from 'lucide-svelte';

	let { form }: { form: any } = $props();

	const theme = $derived(getTheme());

	let submitting = $state(false);
	let copied = $state(false);
	let revealed = $state(true);

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>Register your agent - {theme.name}</title>
</svelte:head>

<div class="py-8">
	{#if form?.success}
		<div class="max-w-2xl mx-auto">
			<div class="text-center mb-10">
				<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
					<CheckCircle size={32} class="text-green-600" />
				</div>
				<h1 class="text-3xl mb-3">You're in</h1>
				<p class="text-lg font-light text-gray-600">
					<strong>{form.name}</strong> is registered. Here's your API key.
				</p>
			</div>

			<div class="bg-white rounded-2xl shadow-lg border border-brand-100 p-8 space-y-6">
				<div class="p-6 rounded-xl bg-gradient-to-r from-amber-50 to-red-50 border border-amber-200">
					<h2 class="text-sm font-normal text-gray-800 mb-1">Your API key</h2>
					<p class="text-xs font-light text-gray-500 mb-3">
						Copy this now. We don't store the raw key and can't show it again.
					</p>
					<div class="flex items-center gap-2">
						<code class="flex-1 px-3 py-2 bg-white rounded-lg border border-amber-200 text-sm font-mono text-gray-800 break-all">
							{#if revealed}
								{form.apiKey}
							{:else}
								{'*'.repeat(form.apiKey.length)}
							{/if}
						</code>
						<button
							onclick={() => (revealed = !revealed)}
							class="shrink-0 p-2 text-gray-400 hover:text-brand-600 transition rounded-lg hover:bg-white"
							aria-label={revealed ? 'Hide key' : 'Reveal key'}
						>
							{#if revealed}
								<EyeOff size={16} />
							{:else}
								<Eye size={16} />
							{/if}
						</button>
						<button
							onclick={() => copyToClipboard(form?.apiKey ?? '')}
							class="shrink-0 p-2 text-gray-400 hover:text-brand-600 transition rounded-lg hover:bg-white"
							aria-label="Copy key"
						>
							{#if copied}
								<Check size={16} class="text-green-600" />
							{:else}
								<Copy size={16} />
							{/if}
						</button>
					</div>
				</div>

				<div>
					<h2 class="text-sm font-normal text-gray-800 mb-1">Start sending telemetry</h2>
					<p class="text-xs font-light text-gray-500 mb-3">
						Use this key in the <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs">X-API-Key</code> header when calling the telemetry API.
					</p>
					<pre class="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-mono text-gray-800 overflow-x-auto">{`curl -X POST https://api.openattribution.org/api/v1/telemetry/session/start \\
  -H "X-API-Key: ${form.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "initiator_type": "agent",
    "agent_id": "${form.name}"
  }'`}</pre>
				</div>

				<div class="pt-2">
					<p class="text-sm font-light text-gray-500">
						Full docs at <a href="/docs" class="text-brand-600 hover:underline">/docs</a>.
						Or install the SDK: <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs">pip install openattribution-telemetry</code>
					</p>
				</div>
			</div>
		</div>

	{:else}
		<div class="max-w-lg mx-auto">
			<div class="text-center mb-10">
				<h1 class="text-3xl leading-tight mb-4">Register your agent</h1>
				<p class="text-lg font-light text-gray-600">
					Get an API key so your agent can report telemetry events when it retrieves or cites content.
				</p>
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
				class="space-y-6"
			>
				<div>
					<label for="name" class="block text-sm font-light text-gray-700 mb-1">
						Agent name
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Bot size={18} class="text-gray-400" />
						</div>
						<input
							id="name"
							name="name"
							type="text"
							required
							value={form?.name ?? ''}
							placeholder="My Research Agent"
							class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300
							       focus:ring-2 focus:ring-brand-500 focus:border-transparent
							       transition font-light"
						/>
					</div>
					<p class="mt-1 text-xs text-gray-500 font-light">
						The name of the agent or application that will send telemetry.
					</p>
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
					       hover:bg-brand-700 transition shadow-lg hover:shadow-xl font-normal
					       disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{#if submitting}
						<span class="inline-flex items-center gap-2">
							<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
							Registering...
						</span>
					{:else}
						Register and get API key
					{/if}
				</button>
			</form>
		</div>
	{/if}
</div>
