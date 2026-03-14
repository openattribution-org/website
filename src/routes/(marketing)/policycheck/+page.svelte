<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, Download, Share2, ExternalLink, ChevronDown, ChevronUp, CheckCircle, XCircle, Minus, ArrowRight } from 'lucide-svelte';
	import { AI_CRAWLERS, ALL_AI_CRAWLERS, type CrawlerInfo } from '$lib/policycheck/crawlers.js';
	import type { AnalysisResult, AnalyzeResponse, AiBotAnalysis } from '$lib/policycheck/types.js';

	const API_URL = 'https://policycheck.openattribution.org';

	let { data }: { data: { initialUrl: string } } = $props();

	let urlInput = $state(data.initialUrl);
	let results = $state<AnalysisResult[]>([]);
	let loading = $state(false);
	let error = $state('');
	let expandedIndex = $state<number | null>(null);
	let sortColumn = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	onMount(() => {
		if (data.initialUrl) {
			analyze();
		}
	});

	async function analyze() {
		const input = urlInput.trim();
		if (!input) {
			error = 'Please enter a URL';
			return;
		}

		let urls = input.includes(',')
			? input.split(',').map((u) => u.trim()).filter(Boolean)
			: [input];

		urls = urls.map((u) => (u.startsWith('http://') || u.startsWith('https://') ? u : `https://${u}`));

		loading = true;
		error = '';
		results = [];
		expandedIndex = null;

		try {
			const res = await fetch(`${API_URL}/analyze`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ urls, user_agent: '*' })
			});

			if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

			const data: AnalyzeResponse = await res.json();
			results = data.results;

			// Update URL bar for sharing
			if (urls.length === 1) {
				window.history.replaceState(
					{},
					'',
					`/policycheck?url=${encodeURIComponent(urls[0])}`
				);
			}
		} catch (err) {
			error = `Analysis failed: ${err instanceof Error ? err.message : String(err)}`;
		} finally {
			loading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') analyze();
	}

	function getBotStatus(result: AnalysisResult, botName: string): 'blocked' | 'allowed' | 'unknown' {
		const bot = result.ai_bot_analysis?.find((b) => b.bot_name === botName);
		return bot?.status ?? 'unknown';
	}

	function analyzeAIBots(result: AnalysisResult) {
		const blocked: CrawlerInfo[] = [];
		const allowed: CrawlerInfo[] = [];

		if (!result.ai_bot_analysis?.length) return { blocked, allowed: ALL_AI_CRAWLERS };

		result.ai_bot_analysis.forEach((botResult) => {
			const info = ALL_AI_CRAWLERS.find((b) => b.name === botResult.bot_name);
			if (info) {
				(botResult.status === 'blocked' ? blocked : allowed).push(info);
			}
		});

		return { blocked, allowed };
	}

	function getDomainFromUrl(url: string): string {
		try {
			return new URL(url).hostname;
		} catch {
			return url;
		}
	}

	function downloadJson() {
		const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'policycheck-results.json';
		a.click();
		URL.revokeObjectURL(a.href);
	}

	async function shareResults() {
		if (!results.length) return;
		const url = `https://openattribution.org/policycheck?url=${encodeURIComponent(results[0].url)}`;
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			// fallback
		}
	}

	function sortBy(column: string) {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}
	}

	const successResults = $derived(results.filter((r) => r.status === 'success'));
	const failedCount = $derived(results.filter((r) => r.status !== 'success').length);
</script>

<svelte:head>
	<title>PolicyCheck - AI Crawler Policy Scanner</title>
	<meta name="description" content="See which AI bots can access your content. Check robots.txt, RSL licences, and AI crawler policies for any domain." />
</svelte:head>

<!-- Hero -->
<section class="pt-32 pb-16 px-6 bg-gradient-to-br from-brand-50 via-cream to-amber-50">
	<div class="max-w-6xl mx-auto text-center">
		<h1 class="text-5xl lg:text-6xl leading-tight mb-6">
			<span class="text-brand-600 font-normal">AI Crawler</span> Policy Scanner
		</h1>
		<p class="text-xl text-gray-700 font-light mb-8 max-w-3xl mx-auto">
			See which AI bots can access your content. Check robots.txt, RSL licences, and content signals for any domain.
		</p>
		<div class="flex flex-wrap justify-center gap-4 text-sm text-gray-600 font-light">
			<div class="flex items-center gap-2">
				<span class="text-brand-600">&#10003;</span>
				<span>Identify AI training crawlers</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-brand-600">&#10003;</span>
				<span>Detect unblocked bots</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-brand-600">&#10003;</span>
				<span>Fast, free, open source</span>
			</div>
		</div>
	</div>
</section>

<!-- Input + Results -->
<section class="pb-20 px-6">
	<div class="max-w-5xl mx-auto -mt-8">

		<!-- Input Card -->
		<div class="bg-white rounded-2xl shadow-lg border border-brand-100 p-8 mb-8">
			<div class="flex flex-col sm:flex-row gap-4">
				<div class="relative flex-1">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search size={18} class="text-gray-400" />
					</div>
					<input
						type="text"
						bind:value={urlInput}
						onkeydown={handleKeydown}
						placeholder="example.com"
						class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition font-light"
					/>
				</div>
				<button
					onclick={analyze}
					disabled={loading}
					class="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-lg hover:shadow-xl font-normal disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{loading ? 'Analysing...' : 'Analyse'}
				</button>
			</div>
			<p class="text-sm text-gray-600 font-light mt-2">Enter a URL to check its AI crawler policies</p>
		</div>

		<!-- Loading -->
		{#if loading}
			<div class="text-center py-12">
				<div class="inline-block w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
				<p class="mt-4 text-gray-600 font-light">Analysing...</p>
			</div>
		{/if}

		<!-- Error -->
		{#if error}
			<div class="bg-brand-50 border border-brand-200 rounded-lg p-4 text-brand-700 font-light mb-8">
				{error}
			</div>
		{/if}

		<!-- Results -->
		{#if successResults.length > 0}
			<div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-2xl font-normal">Results</h2>
					<div class="flex gap-2">
						<button onclick={downloadJson} class="px-4 py-2 bg-white text-brand-600 rounded-lg border border-brand-200 hover:bg-brand-50 transition font-light text-sm">
							<span class="hidden sm:inline">Download </span>JSON
						</button>
						<button onclick={shareResults} class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-normal text-sm">
							Share
						</button>
					</div>
				</div>

				<!-- Summary -->
				<div class="bg-gradient-to-r from-brand-50 to-amber-50 rounded-lg p-4 mb-6 text-sm font-light">
					<strong>Total:</strong> {results.length}
					&nbsp;|&nbsp;
					<strong class="text-green-700">Successful:</strong> {successResults.length}
					{#if failedCount > 0}
						&nbsp;|&nbsp;
						<strong class="text-brand-700">Failed:</strong> {failedCount}
					{/if}
				</div>

				<!-- Results table -->
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b-2 border-brand-200">
								<th class="py-3 px-4 text-left font-normal text-gray-900">URL</th>
								<th class="py-3 px-4 text-center font-normal text-gray-900 w-20" title="Path Allowed">Path</th>
								<th class="py-3 px-4 text-center font-normal text-gray-900 w-16">RSL</th>
								<th class="py-3 px-4 text-center font-normal text-gray-900 w-20">GPTBot</th>
								<th class="py-3 px-4 text-center font-normal text-gray-900 w-20">ClaudeBot</th>
								<th class="py-3 px-4 text-center font-normal text-gray-900 w-24">Google-Ext</th>
								<th class="py-3 px-4 text-center font-normal text-gray-900 w-16">CCBot</th>
								<th class="py-3 px-4 text-center font-normal text-gray-900 w-20">Detail</th>
							</tr>
						</thead>
						<tbody class="text-gray-600 font-light text-sm">
							{#each successResults as result, i}
								<tr
									class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
									onclick={() => (expandedIndex = expandedIndex === i ? null : i)}
								>
									<td class="py-3 px-4">
										<div class="flex items-center gap-2">
											<span class="truncate max-w-xs">{result.url}</span>
											<a
												href={`${new URL(result.url).origin}/robots.txt`}
												target="_blank"
												rel="noopener noreferrer"
												class="text-blue-600 hover:text-blue-800 shrink-0"
												onclick={(e) => e.stopPropagation()}
											>
												<ExternalLink size={12} />
											</a>
										</div>
									</td>
									<td class="py-3 px-4 text-center">
										{#if result.is_path_allowed}
											<CheckCircle size={16} class="text-green-700 inline" />
										{:else}
											<XCircle size={16} class="text-brand-700 inline" />
										{/if}
									</td>
									<td class="py-3 px-4 text-center">
										{#if result.active_licenses?.length}
											<span class="text-green-700">{result.active_licenses.length}</span>
										{:else}
											<Minus size={14} class="text-gray-400 inline" />
										{/if}
									</td>
									<td class="py-3 px-4 text-center">
										{#if getBotStatus(result, 'GPTBot') === 'blocked'}<XCircle size={16} class="text-brand-700 inline" />{:else if getBotStatus(result, 'GPTBot') === 'allowed'}<CheckCircle size={16} class="text-green-700 inline" />{:else}<Minus size={14} class="text-gray-400 inline" />{/if}
									</td>
									<td class="py-3 px-4 text-center">
										{#if getBotStatus(result, 'ClaudeBot') === 'blocked'}<XCircle size={16} class="text-brand-700 inline" />{:else if getBotStatus(result, 'ClaudeBot') === 'allowed'}<CheckCircle size={16} class="text-green-700 inline" />{:else}<Minus size={14} class="text-gray-400 inline" />{/if}
									</td>
									<td class="py-3 px-4 text-center">
										{#if getBotStatus(result, 'Google-Extended') === 'blocked'}<XCircle size={16} class="text-brand-700 inline" />{:else if getBotStatus(result, 'Google-Extended') === 'allowed'}<CheckCircle size={16} class="text-green-700 inline" />{:else}<Minus size={14} class="text-gray-400 inline" />{/if}
									</td>
									<td class="py-3 px-4 text-center">
										{#if getBotStatus(result, 'CCBot') === 'blocked'}<XCircle size={16} class="text-brand-700 inline" />{:else if getBotStatus(result, 'CCBot') === 'allowed'}<CheckCircle size={16} class="text-green-700 inline" />{:else}<Minus size={14} class="text-gray-400 inline" />{/if}
									</td>
									<td class="py-3 px-4 text-center">
										{#if expandedIndex === i}
											<ChevronUp size={16} class="text-brand-600 inline" />
										{:else}
											<ChevronDown size={16} class="text-gray-400 inline" />
										{/if}
									</td>
								</tr>

								<!-- Expanded detail -->
								{#if expandedIndex === i}
									{@const { blocked, allowed } = analyzeAIBots(result)}
									<tr>
										<td colspan="8" class="p-0">
											<div class="p-6 bg-gray-50 space-y-4">
												{#if blocked.length > 0}
													<div>
														<h4 class="font-normal text-brand-700 mb-2">Blocked AI Crawlers ({blocked.length})</h4>
														<div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-600 font-light">
															{#each blocked as bot}
																<div><XCircle size={12} class="text-brand-700 inline mr-1" />{bot.name} <span class="text-gray-400">- {bot.company}</span></div>
															{/each}
														</div>
													</div>
												{/if}

												{#if allowed.length > 0}
													<div>
														<h4 class="font-normal text-green-700 mb-2">Allowed AI Crawlers ({allowed.length})</h4>
														<div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-600 font-light">
															{#each allowed as bot}
																<div><CheckCircle size={12} class="text-green-700 inline mr-1" />{bot.name} <span class="text-gray-400">- {bot.company}</span></div>
															{/each}
														</div>
													</div>
												{/if}

												<!-- Markdown for Agents -->
												{#if result.markdown_agents}
													<div>
														{#if result.markdown_agents.supported}
															<h4 class="font-normal text-green-700 mb-1">Markdown for Agents Supported</h4>
															<p class="text-sm text-gray-600 font-light">
																{#if result.markdown_agents.token_count}Token count: <strong>{result.markdown_agents.token_count.toLocaleString()}</strong>{/if}
															</p>
														{:else}
															<h4 class="font-normal text-gray-500 mb-1">Markdown for Agents Not Detected</h4>
														{/if}
													</div>
												{/if}

												<!-- .well-known/openattribution.json -->
												{#if result.well_known_oa}
													<div>
														{#if result.well_known_oa.found}
															<h4 class="font-normal text-green-700 mb-1">
																<CheckCircle size={14} class="inline mr-1" />
																.well-known/openattribution.json found
															</h4>
															<p class="text-sm text-gray-600 font-light">
																{#if result.well_known_oa.version}Version: {result.well_known_oa.version}{/if}
																{#if result.well_known_oa.telemetry_endpoint} &middot; Endpoint: {result.well_known_oa.telemetry_endpoint}{/if}
															</p>
														{:else}
															<h4 class="font-normal text-gray-500 mb-1">
																<Minus size={14} class="inline mr-1" />
																No .well-known/openattribution.json
															</h4>
														{/if}
													</div>
												{/if}

												<div class="text-xs text-gray-600 p-3 bg-blue-50 rounded border border-blue-200">
													<strong>Note:</strong> Analysis based on robots.txt only. CDN-level blocking (Cloudflare, etc.) is not detected.
												</div>
											</div>
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Claim CTA -->
			{#each successResults as result}
				{@const domain = getDomainFromUrl(result.url)}
				{@const wellKnown = result.well_known_oa}

				<div class="bg-white rounded-2xl shadow-lg border border-brand-200 p-8 mb-6">
					{#if !wellKnown || !wellKnown.found}
						<!-- No .well-known found -->
						<div class="flex flex-col md:flex-row md:items-center gap-6">
							<div class="flex-1">
								<h3 class="text-xl font-normal mb-2">Register {domain} with OpenAttribution</h3>
								<p class="text-gray-600 font-light">
									No <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">.well-known/openattribution.json</code> found.
									Register your domain to tell AI agents where to send telemetry and get visibility into how your content is used.
								</p>
							</div>
							<a
								href="/signup?domain={encodeURIComponent(domain)}"
								class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-lg font-normal shrink-0"
							>
								Claim this domain
								<ArrowRight size={16} />
							</a>
						</div>
					{:else if wellKnown.found && !wellKnown.has_verification}
						<!-- Has .well-known but not registered -->
						<div class="flex flex-col md:flex-row md:items-center gap-6">
							<div class="flex-1">
								<h3 class="text-xl font-normal mb-2">{domain} publishes a telemetry endpoint</h3>
								<p class="text-gray-600 font-light">
									This domain has a <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">.well-known/openattribution.json</code> file but isn't registered with OpenAttribution yet.
								</p>
							</div>
							<a
								href="/signup?domain={encodeURIComponent(domain)}"
								class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-lg font-normal shrink-0"
							>
								Register it
								<ArrowRight size={16} />
							</a>
						</div>
					{:else}
						<!-- Registered and verified -->
						<div class="flex items-center gap-3">
							<CheckCircle size={24} class="text-green-600" />
							<div>
								<h3 class="text-xl font-normal">{domain} is registered with OpenAttribution</h3>
								<p class="text-sm text-gray-600 font-light">This domain publishes a telemetry endpoint and is verified.</p>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		{/if}

		<!-- AI Crawler Reference -->
		<details class="bg-white border border-gray-200 rounded-lg p-6 mb-6 mt-8">
			<summary class="cursor-pointer text-sm font-normal text-gray-900">
				AI Crawler Reference - What each bot does
			</summary>
			<div class="mt-4 grid md:grid-cols-2 gap-6 text-sm">
				<div>
					<h4 class="font-normal text-gray-900 mb-2">Training Crawlers ({AI_CRAWLERS.training.length})</h4>
					<div class="text-gray-600 font-light space-y-1">
						{#each AI_CRAWLERS.training as bot}
							<div>{bot.name} - {bot.company} ({bot.purpose})</div>
						{/each}
					</div>
				</div>
				<div>
					<h4 class="font-normal text-gray-900 mb-2">Search Crawlers ({AI_CRAWLERS.search.length})</h4>
					<div class="text-gray-600 font-light space-y-1 mb-4">
						{#each AI_CRAWLERS.search as bot}
							<div>{bot.name} - {bot.company} ({bot.purpose})</div>
						{/each}
					</div>
					<h4 class="font-normal text-gray-900 mb-2">Other ({AI_CRAWLERS.userTriggered.length + AI_CRAWLERS.other.length})</h4>
					<div class="text-gray-600 font-light space-y-1">
						{#each [...AI_CRAWLERS.userTriggered, ...AI_CRAWLERS.other] as bot}
							<div>{bot.name} - {bot.company} ({bot.purpose})</div>
						{/each}
					</div>
				</div>
			</div>
		</details>
	</div>
</section>
