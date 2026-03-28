<script lang="ts">
	interface TelemetryEvent {
		type: 'content_retrieved' | 'content_grounded' | 'content_cited' | 'content_engaged';
		count: number;
		urls: string[];
		timestamp: string;
	}

	let { events = [], sessionId = '' }: { events: TelemetryEvent[]; sessionId: string } = $props();

	let eventsEl: HTMLDivElement;

	$effect(() => {
		events.length;
		if (eventsEl) {
			requestAnimationFrame(() => {
				eventsEl.scrollTop = eventsEl.scrollHeight;
			});
		}
	});

	function shortUrl(url: string): string {
		try {
			const u = new URL(url);
			return u.pathname.length > 45 ? u.pathname.slice(0, 42) + '...' : u.pathname;
		} catch {
			return url;
		}
	}

	function formatTime(iso: string): string {
		return new Date(iso).toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	function badgeLabel(type: string): string {
		if (type === 'content_retrieved') return 'RETRIEVED';
		if (type === 'content_grounded') return 'GROUNDED';
		if (type === 'content_cited') return 'CITED';
		return 'ENGAGED';
	}
</script>

<div class="telemetry-container">
	<div class="legend">
		<span class="legend-item"><span class="dot dot-retrieved"></span> retrieved</span>
		<span class="legend-item"><span class="dot dot-grounded"></span> grounded</span>
		<span class="legend-item"><span class="dot dot-cited"></span> cited</span>
		<span class="legend-item"><span class="dot dot-engaged"></span> engaged</span>
		{#if sessionId}
			<span class="session-id">Session: <code>{sessionId.slice(0, 8)}</code></span>
		{/if}
	</div>

	<div class="events" bind:this={eventsEl}>
		{#if events.length === 0}
			<div class="empty">
				<p>No telemetry events yet.</p>
				<p class="hint">Events appear here as the agent retrieves and cites content.</p>
			</div>
		{/if}

		{#each events as event}
			<div class="event {event.type}">
				<div class="event-header">
					<span class="badge badge-{event.type}">
						{badgeLabel(event.type)}
					</span>
					<span class="count">{event.count} URL{event.count !== 1 ? 's' : ''}</span>
					<span class="time">{formatTime(event.timestamp)}</span>
				</div>
				<div class="event-urls">
					{#each event.urls as url}
						<span class="url">{shortUrl(url)}</span>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.telemetry-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.legend {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.4rem 1rem;
		border-bottom: 1px solid #e5e7eb;
		background: #ffffff;
		font-size: 0.6rem;
		color: #9ca3af;
		flex-shrink: 0;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.dot-retrieved {
		background: #f87572;
	}

	.dot-grounded {
		background: #a78bfa;
	}

	.dot-cited {
		background: #fbbf24;
	}

	.dot-engaged {
		background: #4ade80;
	}

	.session-id {
		margin-left: auto;
		color: #9ca3af;
	}

	.session-id code {
		color: #6b7280;
		font-family: 'Geist Mono', monospace;
	}

	.events {
		flex: 1;
		overflow-y: auto;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 0.5rem;
		color: #9ca3af;
		font-size: 0.8rem;
		text-align: center;
	}

	.hint {
		font-size: 0.7rem;
		max-width: 20rem;
	}

	.event {
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
		background: #ffffff;
		animation: slide-in 0.3s ease-out;
	}

	.event.content_retrieved {
		border-left: 3px solid #f87572;
	}

	.event.content_grounded {
		border-left: 3px solid #a78bfa;
	}

	.event.content_cited {
		border-left: 3px solid #fbbf24;
	}

	.event.content_engaged {
		border-left: 3px solid #4ade80;
	}

	.event-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.4rem;
	}

	.badge {
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		padding: 0.15rem 0.4rem;
		border-radius: 3px;
	}

	.badge-content_retrieved {
		background: #fef2f2;
		color: #dc3b35;
	}

	.badge-content_grounded {
		background: #f5f3ff;
		color: #7c3aed;
	}

	.badge-content_cited {
		background: #fef3c7;
		color: #d97706;
	}

	.badge-content_engaged {
		background: #dcfce7;
		color: #16a34a;
	}

	.count {
		font-size: 0.7rem;
		color: #6b7280;
	}

	.time {
		font-size: 0.65rem;
		color: #9ca3af;
		margin-left: auto;
		font-family: 'Geist Mono', monospace;
	}

	.event-urls {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.url {
		font-size: 0.7rem;
		color: #6b7280;
		font-family: 'Geist Mono', monospace;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
