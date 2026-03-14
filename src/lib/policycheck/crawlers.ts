export interface CrawlerInfo {
	name: string;
	company: string;
	purpose: string;
}

export const AI_CRAWLERS = {
	training: [
		{ name: 'GPTBot', company: 'OpenAI', purpose: 'Model training' },
		{ name: 'ClaudeBot', company: 'Anthropic', purpose: 'Model training' },
		{ name: 'anthropic-ai', company: 'Anthropic', purpose: 'Bulk model training' },
		{ name: 'Claude-Web', company: 'Anthropic', purpose: 'Web-focused training' },
		{ name: 'Google-Extended', company: 'Google', purpose: 'Gemini training' },
		{ name: 'GoogleOther', company: 'Google', purpose: 'Research & development' },
		{ name: 'Meta-ExternalAgent', company: 'Meta', purpose: 'AI model training' },
		{ name: 'FacebookBot', company: 'Meta', purpose: 'Speech recognition training' },
		{ name: 'Applebot-Extended', company: 'Apple', purpose: 'Generative AI training' },
		{ name: 'Amazonbot', company: 'Amazon', purpose: 'AI improvement, model training' },
		{ name: 'CCBot', company: 'Common Crawl', purpose: 'Open dataset collection' },
		{ name: 'Bytespider', company: 'ByteDance', purpose: 'AI training' },
		{ name: 'cohere-ai', company: 'Cohere', purpose: 'LLM training' },
		{ name: 'Diffbot', company: 'Diffbot', purpose: 'AI data extraction' },
		{ name: 'Omgilibot', company: 'Webz.io', purpose: 'Data collection for resale' },
		{ name: 'ImagesiftBot', company: 'The Hive', purpose: 'Image model training' }
	],
	search: [
		{ name: 'OAI-SearchBot', company: 'OpenAI', purpose: 'ChatGPT search indexing' },
		{ name: 'PerplexityBot', company: 'Perplexity', purpose: 'Search indexing' },
		{ name: 'YouBot', company: 'You.com', purpose: 'AI search' },
		{ name: 'DuckAssistBot', company: 'DuckDuckGo', purpose: 'AI-assisted answers' }
	],
	userTriggered: [
		{ name: 'ChatGPT-User', company: 'OpenAI', purpose: 'User-requested fetching' },
		{ name: 'Perplexity-User', company: 'Perplexity', purpose: 'User-requested fetching' },
		{ name: 'Meta-ExternalFetcher', company: 'Meta', purpose: 'Real-time content fetching' }
	],
	other: [
		{ name: 'Applebot', company: 'Apple', purpose: 'Siri, Spotlight, Safari' },
		{ name: 'Google-CloudVertexBot', company: 'Google', purpose: 'Cloud AI services' },
		{ name: 'Amzn-SearchBot', company: 'Amazon', purpose: 'Alexa and Rufus search' }
	]
} as const;

export const ALL_AI_CRAWLERS: CrawlerInfo[] = [
	...AI_CRAWLERS.training,
	...AI_CRAWLERS.search,
	...AI_CRAWLERS.userTriggered,
	...AI_CRAWLERS.other
];
