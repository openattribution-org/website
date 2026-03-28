<script lang="ts">
	import { enhance } from '$app/forms';
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { Globe, CheckCircle, AlertCircle, Copy, Check, Mail, ArrowRight, Loader2 } from 'lucide-svelte';
	import type { AnalysisResult, AnalyzeResponse } from '$lib/policycheck/types.js';

	const POLICYCHECK_API = 'https://policycheck.openattribution.org';

	let { form, data }: { form: any; data: { prefillDomain: string } } = $props();

	const theme = $derived(getTheme());
	const prefillDomain = $derived(data.prefillDomain);

	let submitting = $state(false);
	let copiedDns = $state(false);
	let copiedMeta = $state(false);
	let copiedWellKnown = $state(false);

	// PolicyCheck state
	let scanResult = $state<AnalysisResult | null>(null);
	let scanning = $state(false);

	const allowedCount = $derived(
		scanResult ? scanResult.ai_bot_analysis.filter((b) => b.status === 'allowed').length : 0
	);
	const totalBots = $derived(scanResult ? scanResult.ai_bot_analysis.length : 0);
	const detectedCdn = $derived(scanResult?.infrastructure?.cdn ?? null);
	const detectedCms = $derived(scanResult?.infrastructure?.cms ?? null);
	const wellKnownFound = $derived(scanResult?.well_known_oa?.found ?? false);

	const integrationLabel: Record<string, string> = {
		cloudflare: 'Cloudflare Worker',
		vercel: 'Vercel Middleware',
		netlify: 'Netlify Extension',
		fastly: 'Fastly Log Stream',
		akamai: 'Akamai EdgeWorker',
		cloudfront: 'CloudFront + Kinesis',
		wordpress: 'WordPress Plugin',
		shopify: 'Shopify App',
	};

	const integrationHref: Record<string, string> = {
		cloudflare: '/docs/integrations/cloudflare',
		vercel: '/docs/integrations/vercel',
		netlify: '/docs/integrations/netlify',
		fastly: '/docs/integrations/fastly',
		akamai: '/docs/integrations/akamai',
		cloudfront: '/docs/integrations/cloudfront',
		wordpress: '/docs/integrations/wordpress',
		shopify: '/docs/integrations/shopify',
	};

	async function runScan(domain: string) {
		scanning = true;
		try {
			const url = domain.startsWith('http') ? domain : `https://${domain}`;
			const res = await fetch(`${POLICYCHECK_API}/analyze`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ urls: [url], user_agent: '*' })
			});
			if (!res.ok) return;
			const data: AnalyzeResponse = await res.json();
			if (data.results.length > 0 && data.results[0].status === 'success') {
				scanResult = data.results[0];
			}
		} catch {
			// Scan is optional - don't block onboarding
		} finally {
			scanning = false;
		}
	}

	// Auto-scan when domain is registered
	$effect(() => {
		if (form?.success && form?.domain && !scanResult && !scanning) {
			runScan(form.domain);
		}
	});

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
						Create <code class="px-1 py-0.5 bg-white rounded border border-brand-200 text-xs">/.well-known/openattribution</code> on your site. This also tells AI agents where to send telemetry - so you'll need it anyway.
					</p>
					<div class="flex items-start gap-2">
						<pre class="flex-1 px-3 py-2 bg-white rounded-lg border border-brand-200 text-sm font-mono text-gray-800 overflow-x-auto">{`{
  "openattribution": {
    "version": "0.1",
    "telemetry_endpoint": "https://api.openattribution.org",
    "verification": "${form.token}"
  }
}`}</pre>
						<button
							onclick={() => copyToClipboard(JSON.stringify({ openattribution: { version: '0.1', telemetry_endpoint: 'https://api.openattribution.org', verification: form?.token } }, null, 2), 'wellknown')}
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

			<!-- PolicyCheck scan results -->
			<div class="bg-white rounded-2xl shadow border border-gray-200 p-6 mt-8">
				{#if scanning}
					<div class="flex items-center gap-3">
						<Loader2 size={18} class="text-brand-600 animate-spin" />
						<p class="text-sm font-light text-gray-600">Scanning {form.domain} for AI bot access and infrastructure...</p>
					</div>
				{:else if scanResult}
					<div class="space-y-4">
						<div>
							<p class="text-sm font-normal text-gray-800">
								{allowedCount} of {totalBots} AI agents can access {form.domain}
							</p>
							<p class="text-sm font-light text-gray-500">
								Every retrieval delivers value to the agent's users - and right now you have no visibility into how often that happens.
							</p>
						</div>

						{#if detectedCdn || detectedCms}
							<div class="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
								<p class="text-sm font-normal text-gray-800 mb-1">
									We detected
									{#if detectedCms && detectedCdn}
										{detectedCms.charAt(0).toUpperCase() + detectedCms.slice(1)} behind {detectedCdn.charAt(0).toUpperCase() + detectedCdn.slice(1)}
									{:else if detectedCms}
										{detectedCms.charAt(0).toUpperCase() + detectedCms.slice(1)}
									{:else if detectedCdn}
										{detectedCdn.charAt(0).toUpperCase() + detectedCdn.slice(1)}
									{/if}
									on your domain
								</p>
								<p class="text-xs font-light text-gray-600 mb-3">
									{#if detectedCms === 'wordpress' && detectedCdn}
										Install the WordPress plugin to catch AI agents that identify themselves, and add a {detectedCdn.charAt(0).toUpperCase() + detectedCdn.slice(1)} integration to catch the ones that don't.
									{:else if detectedCms === 'wordpress'}
										The WordPress plugin catches every AI agent that identifies itself via user-agent. Install it and you'll start seeing data.
									{:else if detectedCdn}
										A short edge integration detects AI user agents and reports retrieval events. Your {detectedCdn.charAt(0).toUpperCase() + detectedCdn.slice(1)} infrastructure already sees every request.
									{/if}
								</p>
								<div class="flex flex-wrap gap-2">
									{#if detectedCms && integrationHref[detectedCms]}
										<a
											href={integrationHref[detectedCms]}
											class="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-normal"
										>
											Set up {integrationLabel[detectedCms]} <ArrowRight size={14} />
										</a>
									{/if}
									{#if detectedCdn && integrationHref[detectedCdn]}
										<a
											href={integrationHref[detectedCdn]}
											class="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:border-green-300 hover:text-green-700 transition font-light"
										>
											{integrationLabel[detectedCdn]} guide <ArrowRight size={14} />
										</a>
									{/if}
								</div>
							</div>
						{:else}
							<div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
								<p class="text-sm font-normal text-gray-800 mb-1">Connect your infrastructure</p>
								<p class="text-xs font-light text-gray-600 mb-3">
									Your CDN or web server already sees every AI bot request. Pick your platform to start reporting telemetry events.
								</p>
								<div class="flex flex-wrap gap-2">
									{#each [
										{ href: '/docs/integrations/wordpress', label: 'WordPress' },
										{ href: '/docs/integrations/cloudflare', label: 'Cloudflare' },
										{ href: '/docs/integrations/vercel', label: 'Vercel' },
										{ href: '/docs/integrations/netlify', label: 'Netlify' },
										{ href: '/docs', label: 'All options' },
									] as item}
										<a
											href={item.href}
											class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-700 hover:border-brand-200 hover:text-brand-600 transition font-light"
										>
											{item.label}
										</a>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<p class="text-sm font-normal text-gray-800 mb-1">What happens next</p>
					<p class="text-sm font-light text-gray-600">
						Once you verify ownership, connect your CDN or web server. Your infrastructure already sees every AI bot request -
						a short integration turns those into telemetry events so you can see which agents use your content, how often, and which pages they value most.
					</p>
				{/if}
			</div>

			<div class="flex justify-center mt-6">
				<a
					href="/domains"
					class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg
					       hover:bg-brand-700 transition shadow-lg font-normal"
				>
					Verify your domain
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
					<p class="mt-3 text-sm text-brand-700 font-light">
						We've pre-filled <strong>{prefillDomain}</strong> for you.
					</p>
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
