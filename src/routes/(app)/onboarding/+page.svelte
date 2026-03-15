<script lang="ts">
	import { enhance } from '$app/forms';
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { Globe, CheckCircle, AlertCircle, Copy, Check, Mail } from 'lucide-svelte';

	let { form, data }: { form: any; data: { prefillDomain: string } } = $props();

	const theme = $derived(getTheme());
	const prefillDomain = $derived(data.prefillDomain);

	let submitting = $state(false);
	let copiedDns = $state(false);
	let copiedMeta = $state(false);
	let copiedWellKnown = $state(false);

	async function copyToClipboard(text: string, which: 'dns' | 'meta' | 'wellknown') {
		await navigator.clipboard.writeText(text);
		if (which === 'dns') {
			copiedDns = true;
			setTimeout(() => (copiedDns = false), 2000);
		} else if (which === 'meta') {
			copiedMeta = true;
			setTimeout(() => (copiedMeta = false), 2000);
		} else {
			copiedWellKnown = true;
			setTimeout(() => (copiedWellKnown = false), 2000);
		}
	}
</script>

<svelte:head>
	<title>Register your domain - {theme.name}</title>
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
					We've registered <strong>{form.domain}</strong> to your account.
					To activate your dashboard, verify you own this domain.
				</p>
			</div>

			<div class="bg-white rounded-2xl shadow-lg border border-brand-100 p-8 space-y-6">
				<div>
					<h2 class="text-lg mb-1">Verify ownership of {form.domain}</h2>
					<p class="text-sm font-light text-gray-600">
						Pick whichever is easiest. No deadline - come back when you're ready.
					</p>
				</div>

				<!-- .well-known method (recommended) -->
				<div class="p-6 rounded-xl bg-gradient-to-r from-brand-50 to-amber-50 border border-brand-200">
					<div class="flex items-center gap-2 mb-1">
						<h3 class="text-sm font-normal text-gray-800">Option A: .well-known file</h3>
						<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700">Recommended</span>
					</div>
					<p class="text-xs font-light text-gray-500 mb-3">
						Create <code class="px-1 py-0.5 bg-white rounded border border-brand-200 text-xs">/.well-known/openattribution.json</code> on your site. This also tells AI agents where to send telemetry - so you'll need it anyway.
					</p>
					<div class="flex items-start gap-2">
						<pre class="flex-1 px-3 py-2 bg-white rounded-lg border border-brand-200 text-sm font-mono text-gray-800 overflow-x-auto">{`{
  "openattribution": {
    "version": "0.5",
    "telemetry_endpoint": "https://api.openattribution.org/api/v1/telemetry",
    "verification": "${form.token}"
  }
}`}</pre>
						<button
							onclick={() => copyToClipboard(JSON.stringify({ openattribution: { version: '0.5', telemetry_endpoint: 'https://api.openattribution.org/api/v1/telemetry', verification: form?.token } }, null, 2), 'wellknown')}
							class="shrink-0 p-2 text-gray-400 hover:text-brand-600 transition rounded-lg hover:bg-white mt-1"
							aria-label="Copy JSON"
						>
							{#if copiedWellKnown}
								<Check size={16} class="text-green-600" />
							{:else}
								<Copy size={16} />
							{/if}
						</button>
					</div>
				</div>

				<!-- DNS method -->
				<div class="p-6 rounded-xl bg-gray-50 border border-gray-200">
					<h3 class="text-sm font-normal text-gray-800 mb-1">Option B: DNS TXT record</h3>
					<p class="text-xs font-light text-gray-500 mb-3">
						Add a TXT record for <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs">_openattribution.{form.domain}</code> in your DNS provider.
					</p>
					<div class="flex items-center gap-2">
						<code class="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-mono text-gray-800 break-all">
							{form.token}
						</code>
						<button
							onclick={() => copyToClipboard(form?.token ?? '', 'dns')}
							class="shrink-0 p-2 text-gray-400 hover:text-brand-600 transition rounded-lg hover:bg-white"
							aria-label="Copy token"
						>
							{#if copiedDns}
								<Check size={16} class="text-green-600" />
							{:else}
								<Copy size={16} />
							{/if}
						</button>
					</div>
				</div>

				<!-- Meta tag method -->
				<div class="p-6 rounded-xl bg-gray-50 border border-gray-200">
					<h3 class="text-sm font-normal text-gray-800 mb-1">Option C: HTML meta tag</h3>
					<p class="text-xs font-light text-gray-500 mb-3">
						Add this to the <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs">&lt;head&gt;</code> of your homepage.
					</p>
					<div class="flex items-center gap-2">
						<code class="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-mono text-gray-800 break-all">
							&lt;meta name="oa-verify" content="{form.token}" /&gt;
						</code>
						<button
							onclick={() => copyToClipboard(`<meta name="oa-verify" content="${form?.token}" />`, 'meta')}
							class="shrink-0 p-2 text-gray-400 hover:text-brand-600 transition rounded-lg hover:bg-white"
							aria-label="Copy meta tag"
						>
							{#if copiedMeta}
								<Check size={16} class="text-green-600" />
							{:else}
								<Copy size={16} />
							{/if}
						</button>
					</div>
				</div>

				<div class="pt-2 text-sm font-light text-gray-500">
					<p>
						We check all three methods when you verify - use whichever one you can get deployed.
					</p>
				</div>
			</div>

			<div class="flex justify-center mt-8">
				<a
					href="/domains"
					class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg
					       hover:bg-brand-700 transition shadow-lg font-normal"
				>
					Go to domains
				</a>
			</div>
		</div>

	{:else if form?.error === 'already_verified'}
		<div class="max-w-lg mx-auto text-center">
			<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-6">
				<Mail size={32} class="text-amber-700" />
			</div>
			<h1 class="text-3xl mb-4">This domain is already registered</h1>
			<p class="text-lg font-light text-gray-600 mb-4">
				<strong>{form.domain}</strong> has already been verified by another account.
			</p>
			<p class="text-gray-600 font-light mb-8">
				If you're part of this organisation, ask the account owner to invite you.
				Otherwise, get in touch and we'll sort it out.
			</p>
			<a
				href="mailto:{theme.supportEmail}?subject=Domain access request: {form.domain}"
				class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg
				       hover:bg-brand-700 transition shadow-lg font-normal"
			>
				Contact us
			</a>
		</div>

	{:else}
		<div class="max-w-lg mx-auto">
			<div class="text-center mb-10">
				<h1 class="text-3xl leading-tight mb-4">Register your domain</h1>
				<p class="text-lg font-light text-gray-600">
					What domain do you own? You'll verify ownership next.
				</p>
				{#if prefillDomain}
					<div class="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-sm text-brand-700">
						from PolicyCheck
					</div>
				{/if}
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
					<label for="url" class="block text-sm font-light text-gray-700 mb-1">
						Your website
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Globe size={18} class="text-gray-400" />
						</div>
						<input
							id="url"
							name="url"
							type="text"
							required
							value={form?.url ?? prefillDomain ?? ''}
							placeholder="example.com"
							class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300
							       focus:ring-2 focus:ring-brand-500 focus:border-transparent
							       transition font-light"
						/>
					</div>
					<p class="mt-1 text-xs text-gray-500 font-light">
						The domain you publish content on.
					</p>
				</div>

				{#if form?.error && form.error !== 'already_verified'}
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
						Register domain
					{/if}
				</button>
			</form>
		</div>
	{/if}
</div>
