<script lang="ts">
	import { onMount } from 'svelte';
	import ChatPane from './ChatPane.svelte';
	import TelemetryPane from './TelemetryPane.svelte';
	import DashboardPane from './DashboardPane.svelte';

	interface Article {
		url: string;
		headline: string;
	}

	interface ChatMessage {
		role: 'user' | 'assistant';
		content: string;
		sources?: Article[];
	}

	interface TelemetryEvent {
		type: 'content_retrieved' | 'content_grounded' | 'content_cited' | 'content_engaged';
		count: number;
		urls: string[];
		timestamp: string;
	}

	const articles: Article[] = [
		{
			url: 'https://example-news.com/technology/ai-regulation-transparency-2026',
			headline: 'EU agrees landmark AI transparency rules'
		},
		{
			url: 'https://example-news.com/technology/browser-agents-reshaping-web',
			headline: 'How browser agents are changing the web'
		},
		{
			url: 'https://example-news.com/business/publisher-attribution-revenue',
			headline: 'Publishers find new revenue through attribution data'
		}
	];

	const responseText = `The EU has recently agreed new AI transparency requirements [1] that mandate attribution data for content used by AI systems. This comes as browser-based agents are fundamentally reshaping how people interact with web content [2], creating new challenges for publishers who need visibility into how their work is being consumed.\n\nSome publishers are already adapting by implementing content attribution standards, which provide granular data on retrieval, citation, and engagement events [3]. Early adopters report significantly better understanding of their content's reach in AI-mediated contexts.`;

	let chatMessages = $state<ChatMessage[]>([]);
	let events = $state<TelemetryEvent[]>([]);
	let typingContent = $state('');
	let typingSources = $state<Article[]>([]);
	let isTyping = $state(false);
	let playing = $state(false);
	let hasPlayed = $state(false);
	let reducedMotion = $state(false);
	let sessionId = 'a3f8c2d1';
	let demoEl: HTMLDivElement;

	function now(): string {
		return new Date().toISOString();
	}

	function delay(ms: number): Promise<void> {
		return new Promise((r) => setTimeout(r, ms));
	}

	function populateStatic() {
		const ts = now();
		chatMessages = [
			{ role: 'user', content: 'What are the latest developments in AI content regulation?' },
			{ role: 'assistant', content: responseText, sources: articles }
		];
		events = [
			{ type: 'content_retrieved', count: 3, urls: articles.map((a) => a.url), timestamp: ts },
			{ type: 'content_grounded', count: 3, urls: articles.map((a) => a.url), timestamp: ts },
			{ type: 'content_cited', count: 1, urls: [articles[0].url], timestamp: ts },
			{ type: 'content_cited', count: 1, urls: [articles[1].url], timestamp: ts },
			{ type: 'content_cited', count: 1, urls: [articles[2].url], timestamp: ts },
			{ type: 'content_engaged', count: 1, urls: [articles[0].url], timestamp: ts }
		];
		hasPlayed = true;
	}

	async function runDemo() {
		if (playing) return;
		playing = true;
		chatMessages = [];
		events = [];
		typingContent = '';
		typingSources = [];
		isTyping = false;

		await delay(600);

		chatMessages = [
			{ role: 'user', content: 'What are the latest developments in AI content regulation?' }
		];

		await delay(1200);

		events = [
			{
				type: 'content_retrieved',
				count: 3,
				urls: articles.map((a) => a.url),
				timestamp: now()
			}
		];

		await delay(600);

		events = [
			...events,
			{
				type: 'content_grounded',
				count: 3,
				urls: articles.map((a) => a.url),
				timestamp: now()
			}
		];

		await delay(600);

		isTyping = true;
		typingSources = articles;
		typingContent = '';

		const words = responseText.split(' ');
		let accumulated = '';
		const citationsSent = new Set<number>();

		for (let i = 0; i < words.length; i++) {
			accumulated += (i > 0 ? ' ' : '') + words[i];
			typingContent = accumulated;

			for (let n = 1; n <= 3; n++) {
				if (!citationsSent.has(n) && accumulated.includes(`[${n}]`)) {
					citationsSent.add(n);
					events = [
						...events,
						{
							type: 'content_cited',
							count: 1,
							urls: [articles[n - 1].url],
							timestamp: now()
						}
					];
				}
			}

			await delay(30 + Math.random() * 30);
		}

		isTyping = false;
		chatMessages = [
			...chatMessages,
			{ role: 'assistant', content: responseText, sources: articles }
		];
		typingContent = '';
		typingSources = [];

		await delay(2000);
		events = [
			...events,
			{
				type: 'content_engaged',
				count: 1,
				urls: [articles[0].url],
				timestamp: now()
			}
		];

		playing = false;
		hasPlayed = true;
	}

	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reducedMotion) {
			populateStatic();
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !hasPlayed && !playing) {
					runDemo();
				}
			},
			{ threshold: 0.2 }
		);

		if (demoEl) observer.observe(demoEl);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={demoEl}
	role="img"
	aria-label="Simulated telemetry session: an AI agent retrieves 3 articles, cites them in a response, and a user clicks through to one. The three panes show what the user sees, what the server does, and what the content owner sees."
>
	<div class="demo-frame" aria-hidden="true">
		<div class="demo-chrome">
			<div class="chrome-dots">
				<span class="dot"></span>
				<span class="dot"></span>
				<span class="dot"></span>
			</div>
			{#if hasPlayed && !playing}
				<button class="replay-btn" onclick={runDemo} aria-label="Replay demo animation">Replay</button>
			{/if}
		</div>

		<div class="panes">
			<div class="pane chat-pane">
				<div class="pane-header">What a user sees</div>
				<ChatPane messages={chatMessages} {isTyping} {typingContent} sources={typingSources} />
			</div>
			<div class="pane telemetry-pane">
				<div class="pane-header">What the server does</div>
				<TelemetryPane {events} {sessionId} />
			</div>
			<div class="pane dashboard-pane">
				<div class="pane-header">What the content owner sees</div>
				<DashboardPane {events} />
			</div>
		</div>
	</div>
</div>

<style>
	.demo-frame {
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
		border: 1px solid #d1d5db;
		background: #f8f9fa;
	}

	.demo-chrome {
		display: flex;
		align-items: center;
		padding: 0.6rem 1rem;
		background: #f3f4f6;
		border-bottom: 1px solid #e5e7eb;
	}

	.chrome-dots {
		display: flex;
		gap: 6px;
	}

	.chrome-dots .dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #d1d5db;
	}

	.replay-btn {
		margin-left: auto;
		font-size: 0.7rem;
		color: #6b7280;
		background: none;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		padding: 0.2rem 0.6rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.replay-btn:hover {
		color: #374151;
		border-color: #9ca3af;
	}

	.panes {
		display: flex;
		height: 500px;
		gap: 1px;
		background: #e5e7eb;
	}

	.pane {
		display: flex;
		flex-direction: column;
		background: #f8f9fa;
		overflow: hidden;
	}

	.chat-pane {
		flex: 2;
	}

	.telemetry-pane {
		flex: 1.5;
	}

	.dashboard-pane {
		flex: 1.5;
	}

	.pane-header {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #111827;
		padding: 0.6rem 1rem;
		border-top: 3px solid #dc3b35;
		border-bottom: 1px solid #e5e7eb;
		flex-shrink: 0;
		background: #ffffff;
	}

	@media (max-width: 768px) {
		.panes {
			flex-direction: column;
			height: auto;
		}

		.pane {
			height: 300px;
		}
	}
</style>
