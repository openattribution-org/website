<script lang="ts">
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { ApiError } from '$lib/api/client.js';
	import { listDomains, registerDomain, verifyDomain, deleteDomain } from '$lib/api/domains.js';
	import type { Domain } from '$lib/api/types.js';
	import type { AnalyzeResponse, InfraDetection } from '$lib/policycheck/types.js';
	import {
		Globe, CheckCircle, Clock, AlertCircle, Copy, Check,
		RefreshCw, Plus, Trash2, ArrowRight, Loader2
	} from 'lucide-svelte';
	import { onMount } from 'svelte';

	const POLICYCHECK_API = 'https://policycheck.openattribution.org';

	const theme = $derived(getTheme());

	let domains = $state<Domain[]>([]);
	let loading = $state(true);
	let error = $state('');

	let showAdd = $state(false);
	let newDomain = $state('');
	let adding = $state(false);

	let verifyingId = $state<string | null>(null);
	let verifyError = $state('');
	let copiedToken = $state(false);

	// Infrastructure detection per domain
	let infraMap = $state<Record<string, InfraDetection | 'scanning'>>({});

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

	async function scanInfra(domain: string) {
		if (infraMap[domain]) return;
		infraMap[domain] = 'scanning';
		try {
			const res = await fetch(`${POLICYCHECK_API}/analyze`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ urls: [`https://${domain}`], user_agent: '*' })
			});
			if (!res.ok) return;
			const data: AnalyzeResponse = await res.json();
			const result = data.results[0];
			if (result?.status === 'success' && result.infrastructure) {
				infraMap[domain] = result.infrastructure;
			} else {
				infraMap[domain] = { cdn: null, cms: null };
			}
		} catch {
			infraMap[domain] = { cdn: null, cms: null };
		}
	}

	onMount(async () => {
		await loadDomains();
		// Scan infrastructure for verified domains
		for (const d of domains) {
			if (d.verified) scanInfra(d.domain);
		}
	});

	async function loadDomains() {
		loading = true;
		error = '';
		try {
			domains = await listDomains();
		} catch (err) {
			// No active org yet - treat as empty (the empty state UI handles this)
			if (err instanceof ApiError && err.status === 400) {
				domains = [];
			} else {
				error = err instanceof Error ? err.message : 'Failed to load domains';
				domains = [];
			}
		} finally {
			loading = false;
		}
	}

	async function handleAdd(e: SubmitEvent) {
		e.preventDefault();
		adding = true;
		error = '';
		try {
			const domain = await registerDomain(newDomain);
			domains = [...domains, domain];
			newDomain = '';
			showAdd = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to register domain';
		} finally {
			adding = false;
		}
	}

	async function handleVerify(domain: Domain) {
		verifyingId = domain.id;
		verifyError = '';
		try {
			const updated = await verifyDomain(domain.id);
			domains = domains.map((d) => (d.id === updated.id ? updated : d));
		} catch (err) {
			verifyError = err instanceof Error ? err.message : 'Verification failed';
		} finally {
			verifyingId = null;
		}
	}

	async function handleDelete(domain: Domain) {
		try {
			await deleteDomain(domain.id);
			domains = domains.filter((d) => d.id !== domain.id);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete domain';
		}
	}

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copiedToken = true;
		setTimeout(() => (copiedToken = false), 2000);
	}
</script>

<svelte:head>
	<title>Domains - {theme.name}</title>
</svelte:head>

<div class="py-6">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-xl">Domains</h1>
		<button
			onclick={() => (showAdd = !showAdd)}
			class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg
			       hover:bg-brand-700 transition font-normal text-sm"
		>
			<Plus size={14} />
			Add domain
		</button>
	</div>

	{#if error}
		<div class="flex items-center gap-2 p-4 rounded-lg bg-brand-50 border border-brand-200 mb-6">
			<AlertCircle size={16} class="text-brand-700 shrink-0" />
			<p class="text-sm text-brand-700 font-light">{error}</p>
		</div>
	{/if}

	{#if showAdd}
		<div class="bg-white rounded-xl border border-gray-200 p-5 mb-6">
			<form onsubmit={handleAdd} class="flex gap-3">
				<div class="relative flex-1">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Globe size={16} class="text-gray-400" />
					</div>
					<input
						type="text"
						bind:value={newDomain}
						required
						placeholder="example.com"
						class="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300
						       focus:ring-2 focus:ring-brand-500 focus:border-transparent
						       transition font-light text-sm"
					/>
				</div>
				<button
					type="submit"
					disabled={adding}
					class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700
					       transition font-normal text-sm disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{adding ? 'Adding...' : 'Register'}
				</button>
			</form>
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
		</div>
	{:else if domains.length === 0}
		<div class="text-center py-20">
			<Globe size={48} class="text-gray-300 mx-auto mb-4" />
			<p class="text-gray-600 font-light text-lg">No domains registered yet</p>
			<p class="text-gray-500 font-light text-sm mt-1">Add your first domain to get started</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each domains as domain}
				{@const infra = domain.verified ? infraMap[domain.domain] : null}
				<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
					<!-- Domain header -->
					<div class="flex items-center justify-between px-5 py-3 border-b border-gray-100">
						<div class="flex items-center gap-3">
							<span class="text-sm font-mono text-gray-900">{domain.domain}</span>
							{#if domain.verified}
								<CheckCircle size={14} class="text-green-600" />
							{:else}
								<Clock size={14} class="text-amber-500" />
							{/if}
						</div>
						<button
							onclick={() => handleDelete(domain)}
							class="p-1 text-gray-300 hover:text-brand-700 transition"
							aria-label="Delete domain"
						>
							<Trash2 size={13} />
						</button>
					</div>

					<!-- Steps -->
					<div class="grid grid-cols-3 divide-x divide-gray-100">
						<!-- Step 1: Verify -->
						<div class="p-4">
							<div class="flex items-center gap-2 mb-2">
								{#if domain.verified}
									<div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
										<CheckCircle size={12} class="text-green-600" />
									</div>
								{:else}
									<div class="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
										<span class="text-xs text-brand-700 font-normal">1</span>
									</div>
								{/if}
								<span class="text-xs font-normal text-gray-700">Verify ownership</span>
							</div>
							{#if domain.verified}
								<p class="text-xs text-green-600 font-light">Verified via .well-known</p>
							{:else}
								<p class="text-xs text-gray-500 font-light mb-3">
									Add a <code class="px-1 py-0.5 bg-gray-100 rounded text-xs">.well-known/openattribution</code> file to your site.
								</p>
								<div class="flex items-start gap-1.5 mb-3">
									<pre class="flex-1 px-2 py-1.5 bg-gray-50 rounded text-xs font-mono text-gray-700 overflow-x-auto leading-relaxed">{`{
  "openattribution": {
    "version": "0.1",
    "telemetry_endpoint": "https://api.openattribution.org",
    "verification": "${domain.verification_token}"
  }
}`}</pre>
									<button
										onclick={() => copyToClipboard(JSON.stringify({ openattribution: { version: '0.1', telemetry_endpoint: 'https://api.openattribution.org', verification: domain.verification_token } }, null, 2))}
										class="p-1 text-gray-400 hover:text-brand-600 transition shrink-0"
										aria-label="Copy JSON"
									>
										{#if copiedToken}
											<Check size={14} class="text-green-600" />
										{:else}
											<Copy size={14} />
										{/if}
									</button>
								</div>

								{#if verifyError}
									<p class="text-xs text-brand-700 font-light mb-2">{verifyError}</p>
								{/if}

								<button
									onclick={() => handleVerify(domain)}
									disabled={verifyingId === domain.id}
									class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white
									       rounded-lg hover:bg-brand-700 transition text-xs font-normal disabled:opacity-60"
								>
									{#if verifyingId === domain.id}
										<RefreshCw size={12} class="animate-spin" />
										Checking...
									{:else}
										Verify now <ArrowRight size={12} />
									{/if}
								</button>
							{/if}
						</div>

						<!-- Step 2: Connect integration -->
						<div class="p-4 {domain.verified ? '' : 'opacity-40'}">
							<div class="flex items-center gap-2 mb-2">
								<div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
									<span class="text-xs text-gray-500 font-normal">2</span>
								</div>
								<span class="text-xs font-normal text-gray-700">Connect integration</span>
							</div>
							{#if domain.verified}
								{#if infra === 'scanning'}
									<div class="flex items-center gap-2">
										<Loader2 size={12} class="text-gray-400 animate-spin" />
										<p class="text-xs text-gray-500 font-light">Detecting...</p>
									</div>
								{:else if infra && (infra.cdn || infra.cms)}
									<p class="text-xs text-gray-500 font-light mb-3">
										Detected
										<strong class="text-gray-700">
											{#if infra.cms && infra.cdn}
												{infra.cms.charAt(0).toUpperCase() + infra.cms.slice(1)} + {infra.cdn.charAt(0).toUpperCase() + infra.cdn.slice(1)}
											{:else if infra.cms}
												{infra.cms.charAt(0).toUpperCase() + infra.cms.slice(1)}
											{:else if infra.cdn}
												{infra.cdn.charAt(0).toUpperCase() + infra.cdn.slice(1)}
											{/if}
										</strong>
									</p>
									<div class="space-y-1.5">
										{#if infra.cms && integrationHref[infra.cms]}
											<a
												href={integrationHref[infra.cms]}
												class="flex items-center justify-between px-3 py-2 text-xs bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-normal"
											>
												{integrationLabel[infra.cms]} <ArrowRight size={12} />
											</a>
										{/if}
										{#if infra.cdn && integrationHref[infra.cdn]}
											<a
												href={integrationHref[infra.cdn]}
												class="flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:border-brand-200 hover:text-brand-600 transition font-light"
											>
												{integrationLabel[infra.cdn]} <ArrowRight size={12} />
											</a>
										{/if}
									</div>
								{:else}
									<p class="text-xs text-gray-500 font-light mb-3">Pick your platform</p>
									<div class="space-y-1.5">
										{#each [
											{ href: '/docs/integrations/wordpress', label: 'WordPress' },
											{ href: '/docs/integrations/cloudflare', label: 'Cloudflare' },
											{ href: '/docs/integrations/vercel', label: 'Vercel' },
											{ href: '/docs', label: 'All options' },
										] as item}
											<a
												href={item.href}
												class="flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:border-brand-200 hover:text-brand-600 transition font-light"
											>
												{item.label} <ArrowRight size={12} />
											</a>
										{/each}
									</div>
								{/if}
							{:else}
								<p class="text-xs text-gray-400 font-light">Verify your domain first</p>
							{/if}
						</div>

						<!-- Step 3: See telemetry -->
						<div class="p-4 {domain.verified ? '' : 'opacity-40'}">
							<div class="flex items-center gap-2 mb-2">
								<div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
									<span class="text-xs text-gray-500 font-normal">3</span>
								</div>
								<span class="text-xs font-normal text-gray-700">See telemetry</span>
							</div>
							{#if domain.verified}
								<p class="text-xs text-gray-500 font-light mb-3">
									Once your integration is live, events appear on your dashboard.
								</p>
								<a
									href="/dashboard"
									class="flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:border-brand-200 hover:text-brand-600 transition font-light"
								>
									Go to dashboard <ArrowRight size={12} />
								</a>
							{:else}
								<p class="text-xs text-gray-400 font-light">Coming after integration</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
