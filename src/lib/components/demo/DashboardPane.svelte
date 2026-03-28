<script lang="ts">
	interface TelemetryEvent {
		type: 'content_retrieved' | 'content_grounded' | 'content_cited' | 'content_engaged';
		count: number;
		urls: string[];
		timestamp: string;
	}

	let { events = [] }: { events: TelemetryEvent[] } = $props();

	// Background data - the content owner already has history
	const baseline = {
		events: 312,
		sessions: 47,
		retrieved: 189,
		grounded: 142,
		cited: 94,
		engaged: 29,
		agents: [
			{ name: 'perplexity / research', events: 143, sessions: 21 },
			{ name: 'chatgpt / browsing', events: 98, sessions: 14 },
			{ name: 'claude / artifacts', events: 71, sessions: 12 }
		],
		topContent: [
			{ path: '/technology/ai-regulation-transparency-2026', events: 87, types: 3 },
			{ path: '/business/publisher-attribution-revenue', events: 64, types: 3 },
			{ path: '/technology/browser-agents-reshaping-web', events: 51, types: 2 },
			{ path: '/opinion/open-standards-ai-era', events: 38, types: 2 },
			{ path: '/technology/cdn-telemetry-integration', events: 29, types: 1 }
		]
	};

	let liveEvents = $derived(events.reduce((sum, e) => sum + e.count, 0));
	let liveRetrieved = $derived(
		events.filter((e) => e.type === 'content_retrieved').reduce((sum, e) => sum + e.count, 0)
	);
	let liveGrounded = $derived(
		events.filter((e) => e.type === 'content_grounded').reduce((sum, e) => sum + e.count, 0)
	);
	let liveCited = $derived(
		events.filter((e) => e.type === 'content_cited').reduce((sum, e) => sum + e.count, 0)
	);
	let liveEngaged = $derived(
		events.filter((e) => e.type === 'content_engaged').reduce((sum, e) => sum + e.count, 0)
	);

	let totalEvents = $derived(baseline.events + liveEvents);
	let sessions = $derived(baseline.sessions + (liveEvents > 0 ? 1 : 0));
	let retrieved = $derived(baseline.retrieved + liveRetrieved);
	let grounded = $derived(baseline.grounded + liveGrounded);
	let cited = $derived(baseline.cited + liveCited);
	let engaged = $derived(baseline.engaged + liveEngaged);

	let agents = $derived.by(() => {
		const list = baseline.agents.map((a) => ({ ...a }));
		if (liveEvents > 0) {
			list[0] = {
				...list[0],
				events: list[0].events + liveEvents,
				sessions: list[0].sessions + 1
			};
		}
		return list;
	});

	let topContent = $derived.by(() => {
		const list = baseline.topContent.map((c) => ({ ...c }));
		// The live demo articles match the first three baseline entries
		if (liveEvents > 0) {
			for (const event of events) {
				for (const url of event.urls) {
					const idx = url.includes('ai-regulation') ? 0 : url.includes('publisher-attribution') ? 1 : url.includes('browser-agents') ? 2 : -1;
					if (idx >= 0) {
						list[idx] = { ...list[idx], events: list[idx].events + 1 };
					}
				}
			}
		}
		return list.sort((a, b) => b.events - a.events);
	});

	let recentEvents = $derived(
		events
			.slice()
			.reverse()
			.slice(0, 6)
			.map((e) => ({
				type: e.type,
				url: e.urls[0] || '-',
				timestamp: e.timestamp
			}))
	);

	function shortUrl(url: string): string {
		try {
			const u = new URL(url);
			return u.pathname.length > 35 ? u.pathname.slice(0, 32) + '...' : u.pathname;
		} catch {
			return url;
		}
	}

	function shortPath(path: string): string {
		return path.length > 35 ? path.slice(0, 32) + '...' : path;
	}

	function formatTime(iso: string): string {
		return new Date(iso).toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	function badgeShort(type: string): string {
		if (type === 'content_retrieved') return 'RET';
		if (type === 'content_grounded') return 'GND';
		if (type === 'content_cited') return 'CIT';
		return 'ENG';
	}
</script>

<div class="dashboard-container">
	<div class="content">
		<div class="cards">
			<div class="card">
				<div class="card-value">{totalEvents}</div>
				<div class="card-label">Total events</div>
			</div>
			<div class="card">
				<div class="card-value">{sessions}</div>
				<div class="card-label">Sessions</div>
			</div>
			<div class="card">
				<div class="card-value">{retrieved}</div>
				<div class="card-label">Retrieved</div>
			</div>
			<div class="card">
				<div class="card-value">{grounded}</div>
				<div class="card-label">Grounded</div>
			</div>
			<div class="card">
				<div class="card-value">{cited}</div>
				<div class="card-label">Cited</div>
			</div>
			<div class="card">
				<div class="card-value">{engaged}</div>
				<div class="card-label">Engaged</div>
			</div>
		</div>

		<div class="section">
			<div class="section-title">Agents</div>
			{#each agents as agent}
				<div class="agent-row">
					<span class="agent-name">{agent.name}</span>
					<div class="agent-stats">
						<span class="stat">{agent.events} events</span>
						<span class="stat">{agent.sessions} sessions</span>
					</div>
				</div>
			{/each}
		</div>

		<div class="section">
			<div class="section-title">Top content</div>
			<div class="url-list">
				{#each topContent as entry}
					<div class="url-row">
						<span class="url-path">{shortPath(entry.path)}</span>
						<div class="url-stats">
							<span class="stat">{entry.events} events</span>
							<span class="stat">{entry.types} types</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		{#if recentEvents.length > 0}
			<div class="section">
				<div class="section-title">Live</div>
				<div class="events-list">
					{#each recentEvents as event}
						<div class="event-row">
							<span class="event-badge {event.type}">
								{badgeShort(event.type)}
							</span>
							<span class="event-url">{shortUrl(event.url)}</span>
							<span class="event-time">{formatTime(event.timestamp)}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.dashboard-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
		padding: 0.75rem;
	}

.content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.4rem;
	}

	.card {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		padding: 0.5rem 0.65rem;
	}

	.card-value {
		font-size: 1.2rem;
		font-weight: 700;
		color: #111827;
	}

	.card-label {
		font-size: 0.55rem;
		color: #9ca3af;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 0.1rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.section-title {
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #9ca3af;
	}

	.agent-row {
		padding: 0.35rem 0.5rem;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.agent-name {
		font-size: 0.65rem;
		color: #0284c7;
		font-family: 'Geist Mono', monospace;
	}

	.agent-stats {
		display: flex;
		gap: 0.6rem;
	}

	.url-list,
	.events-list {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.url-row {
		padding: 0.35rem 0.5rem;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
	}

	.url-path {
		font-size: 0.65rem;
		color: #dc3b35;
		font-family: 'Geist Mono', monospace;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.url-stats {
		display: flex;
		gap: 0.6rem;
		margin-top: 0.15rem;
	}

	.stat {
		font-size: 0.55rem;
		color: #9ca3af;
	}

	.event-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.25rem 0.4rem;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
	}

	.event-badge {
		font-size: 0.5rem;
		font-weight: 700;
		padding: 0.1rem 0.25rem;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.event-badge.content_retrieved {
		background: #fef2f2;
		color: #dc3b35;
	}

	.event-badge.content_grounded {
		background: #f5f3ff;
		color: #7c3aed;
	}

	.event-badge.content_cited {
		background: #fef3c7;
		color: #d97706;
	}

	.event-badge.content_engaged {
		background: #dcfce7;
		color: #16a34a;
	}

	.event-url {
		font-size: 0.6rem;
		color: #6b7280;
		font-family: 'Geist Mono', monospace;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	.event-time {
		font-size: 0.55rem;
		color: #9ca3af;
		font-family: 'Geist Mono', monospace;
		flex-shrink: 0;
	}
</style>
