<script lang="ts">
	import { getTheme } from '$lib/stores/theme.svelte.js';
	import { listDomains, registerDomain, verifyDomain, deleteDomain } from '$lib/api/domains.js';
	import type { Domain } from '$lib/api/types.js';
	import {
		Globe, CheckCircle, Clock, AlertCircle, Copy, Check,
		RefreshCw, Plus, Trash2
	} from 'lucide-svelte';
	import { onMount } from 'svelte';

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

	onMount(async () => {
		await loadDomains();
	});

	async function loadDomains() {
		loading = true;
		error = '';
		try {
			domains = await listDomains();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load domains';
			domains = [];
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

<div class="py-8">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-2xl lg:text-3xl">Domains</h1>
			<p class="text-gray-600 font-light mt-1">Register and verify ownership of your domains</p>
		</div>
		<button
			onclick={() => (showAdd = !showAdd)}
			class="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg
			       hover:bg-brand-700 transition font-normal text-sm"
		>
			<Plus size={16} />
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
		<div class="bg-white rounded-2xl shadow-lg border border-brand-100 p-8 mb-8">
			<h2 class="text-lg mb-4">Add a domain</h2>
			<form onsubmit={handleAdd} class="flex gap-3">
				<div class="relative flex-1">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Globe size={18} class="text-gray-400" />
					</div>
					<input
						type="text"
						bind:value={newDomain}
						required
						placeholder="example.com"
						class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300
						       focus:ring-2 focus:ring-brand-500 focus:border-transparent
						       transition font-light"
					/>
				</div>
				<button
					type="submit"
					disabled={adding}
					class="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700
					       transition font-normal disabled:opacity-60 disabled:cursor-not-allowed"
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
				<div class="bg-white rounded-2xl shadow-lg border border-brand-100 p-8">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center gap-3">
							<Globe size={20} class="text-gray-400" />
							<h3 class="text-lg font-normal">{domain.domain}</h3>
							{#if domain.verified}
								<span class="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									<CheckCircle size={12} />
									Verified
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
									<Clock size={12} />
									Pending
								</span>
							{/if}
						</div>
						<button
							onclick={() => handleDelete(domain)}
							class="p-2 text-gray-400 hover:text-brand-700 transition rounded-lg hover:bg-brand-50"
							aria-label="Delete domain"
						>
							<Trash2 size={16} />
						</button>
					</div>

					{#if !domain.verified}
						<div class="bg-gradient-to-r from-brand-50 to-amber-50 rounded-xl border-l-4 border-brand-600 p-6">
							<p class="text-sm font-normal text-gray-800 mb-4">
								Verify ownership using any of these methods:
							</p>

							<div class="space-y-4">
								<div>
									<div class="flex items-center gap-2 mb-2">
										<h4 class="text-sm font-normal text-gray-700">.well-known file</h4>
										<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700">Recommended</span>
									</div>
									<p class="text-xs text-gray-600 font-light mb-2">
										Serve this at <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs">https://{domain.domain}/.well-known/openattribution.json</code> - also tells AI agents where to send telemetry.
									</p>
									<div class="flex items-start gap-2">
										<pre class="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-800 overflow-x-auto">{`{
  "openattribution": {
    "version": "0.5",
    "telemetry_endpoint": "https://api.openattribution.org/api/v1/telemetry",
    "verification": "${domain.verification_token}"
  }
}`}</pre>
										<button
											onclick={() => copyToClipboard(JSON.stringify({ openattribution: { version: '0.5', telemetry_endpoint: 'https://api.openattribution.org/api/v1/telemetry', verification: domain.verification_token } }, null, 2))}
											class="p-2 text-gray-400 hover:text-brand-600 transition mt-1"
											aria-label="Copy JSON"
										>
											{#if copiedToken}
												<Check size={16} class="text-green-600" />
											{:else}
												<Copy size={16} />
											{/if}
										</button>
									</div>
								</div>

								<div>
									<h4 class="text-sm font-normal text-gray-700 mb-2">DNS TXT record</h4>
									<p class="text-xs text-gray-600 font-light mb-2">
										Add a TXT record for <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs">_openattribution.{domain.domain}</code>
									</p>
									<div class="flex items-center gap-2">
										<code class="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-800 break-all">
											{domain.verification_token}
										</code>
										<button
											onclick={() => copyToClipboard(domain.verification_token)}
											class="p-2 text-gray-400 hover:text-brand-600 transition"
											aria-label="Copy token"
										>
											<Copy size={16} />
										</button>
									</div>
								</div>

								<div>
									<h4 class="text-sm font-normal text-gray-700 mb-2">HTML meta tag</h4>
									<p class="text-xs text-gray-600 font-light mb-2">
										Add to the <code class="px-1 py-0.5 bg-gray-100 rounded text-xs">&lt;head&gt;</code> of your homepage
									</p>
									<div class="flex items-center gap-2">
										<code class="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-800 break-all">
											&lt;meta name="oa-verify" content="{domain.verification_token}" /&gt;
										</code>
										<button
											onclick={() => copyToClipboard(`<meta name="oa-verify" content="${domain.verification_token}" />`)}
											class="p-2 text-gray-400 hover:text-brand-600 transition"
											aria-label="Copy meta tag"
										>
											<Copy size={16} />
										</button>
									</div>
								</div>
							</div>

							{#if verifyError}
								<div class="flex items-center gap-2 mt-4 p-3 rounded-lg bg-brand-50 border border-brand-200">
									<AlertCircle size={14} class="text-brand-700 shrink-0" />
									<p class="text-xs text-brand-700 font-light">{verifyError}</p>
								</div>
							{/if}

							<button
								onclick={() => handleVerify(domain)}
								disabled={verifyingId === domain.id}
								class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-600
								       rounded-lg border border-brand-200 hover:bg-brand-50 transition
								       font-light text-sm disabled:opacity-60"
							>
								{#if verifyingId === domain.id}
									<RefreshCw size={14} class="animate-spin" />
									Checking...
								{:else}
									<RefreshCw size={14} />
									Check now
								{/if}
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
