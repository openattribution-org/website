<script lang="ts">
	import CodeBlock from '$lib/components/docs/CodeBlock.svelte';
	import Callout from '$lib/components/docs/Callout.svelte';
</script>

<svelte:head>
	<title>Cloudflare integration - OpenAttribution</title>
	<meta
		name="description"
		content="Normalise Cloudflare's AI bot signals into OA telemetry format. content_retrieved events from the edge, zero latency, cross-provider standard."
	/>
</svelte:head>

<h1 class="text-3xl lg:text-4xl mb-4">Cloudflare</h1>
<p class="text-lg text-gray-600 font-light mb-8 max-w-3xl">
	Cloudflare already classifies AI traffic at the edge - crawlers vs assistants vs search,
	verified vs suspected. OA normalises those signals into a standard
	<code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-sm font-mono"
		>content_retrieved</code
	> event. A publisher using Cloudflare, licensing through Microsoft's Content Marketplace, and
	getting crawled directly by ChatGPT sees all three in the same format. One standard across
	CDNs, content marketplaces, and agent-side reporting.
</p>

<div class="flex flex-wrap gap-3 mb-8">
	<span class="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-normal"
		>Edge layer</span
	>
	<span class="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-normal"
		>Zero latency impact</span
	>
	<span class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-normal"
		>source_role: edge</span
	>
</div>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">What Cloudflare provides</h2>
<p class="text-gray-600 font-light mb-4">
	Any site proxied through Cloudflare already has AI bot visibility. The depth of signal depends
	on the plan.
</p>

<div class="overflow-x-auto mb-6">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-gray-200">
				<th class="text-left py-3 px-4 font-normal text-gray-800">Plan</th>
				<th class="text-left py-3 px-4 font-normal text-gray-800">What you get</th>
			</tr>
		</thead>
		<tbody class="font-light text-gray-600">
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4">Free</td>
				<td class="py-3 px-4">Bot Fight Mode (JS detection), "Block AI Scrapers and Crawlers" toggle, Security Events dashboard showing flagged bot traffic</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4">Pro / Business</td>
				<td class="py-3 px-4">Super Bot Fight Mode with bot traffic groupings (automated, likely automated, likely human, verified bot) in Security Analytics</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4">Enterprise</td>
				<td class="py-3 px-4">
					Full Bot Management:
					<code class="text-xs font-mono">BotScore</code> (1-99),
					<code class="text-xs font-mono">VerifiedBotCategory</code>,
					<code class="text-xs font-mono">JA4</code> (TLS fingerprint),
					<code class="text-xs font-mono">JA4Signals</code>,
					<code class="text-xs font-mono">BotTags</code>.
					Available in Workers via <code class="text-xs font-mono">request.cf.botManagement</code>
				</td>
			</tr>
		</tbody>
	</table>
</div>

<p class="text-gray-600 font-light mb-4">
	Cloudflare also exposes this data programmatically via the
	<code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">GraphQL Analytics API</code>
	at <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">api.cloudflare.com/client/v4/graphql</code>.
	Datasets like <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">httpRequestsAdaptiveGroups</code>
	include bot classification dimensions - useful for understanding volume before enabling telemetry,
	or for building custom reporting alongside it.
</p>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">What OA adds</h2>
<p class="text-gray-600 font-light mb-4">
	Cloudflare's signals are rich but Cloudflare-specific. A publisher typically has multiple
	sources of AI interaction data - edge traffic through their CDN, licensing deals through
	content marketplaces like Microsoft or Amazon, and direct crawls from agents like ChatGPT
	or Perplexity. Without a standard format, each source reports differently and none of them
	correlate.
</p>
<p class="text-gray-600 font-light mb-4">
	OA normalises all of these into a single event structure:
</p>

<ul class="list-disc list-inside text-gray-600 font-light mb-4 space-y-2 ml-4">
	<li>A Cloudflare edge event, a Microsoft Content Marketplace citation event, and an agent-reported retrieval all produce the same <code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">content_retrieved</code> payload</li>
	<li>Events correlate across sources via <code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">OA-Telemetry-ID</code> - the edge saw the fetch, the marketplace reported the citation, and they link up</li>
	<li>The content owner's <code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">.well-known/openattribution</code> file tells agents, CDNs, and marketplaces where to send telemetry</li>
	<li>Measurement partners and dashboards consume one format regardless of source</li>
</ul>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">How it works</h2>

<CodeBlock
	lang="text"
	filename="flow"
	code={`AI Bot ──GET──> Cloudflare Edge (Worker)
                    │
                    ├── Classifies request via Bot Management
                    │   (BotScore, VerifiedBotCategory, JA4, ASN)
                    │
                    ├── Reads OA-Telemetry-ID header (if present)
                    ├── Passes request to origin (no delay)
                    └── ctx.waitUntil(fetch(...))
                        └── Async POST to OA telemetry endpoint`}
/>

<p class="text-gray-600 font-light mb-4">
	<code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">ctx.waitUntil()</code>
	fires the telemetry POST <em>after</em> the response has been sent to the client. The
	telemetry never blocks the page load.
</p>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">Event payload</h2>
<p class="text-gray-600 font-light mb-4">
	The Worker maps Cloudflare's signals into a standard OA event. This is the same structure
	produced by every OA integration - other CDNs, content marketplaces, origin middleware, and
	agent-side reporting.
</p>

<CodeBlock
	lang="json"
	filename="target payload"
	code={`POST /api/v1/telemetry/edge/events
X-API-Key: oa_yourkey...
Content-Type: application/json

{
  "events": [{
    "type": "content_retrieved",
    "timestamp": "2026-03-28T14:30:00Z",
    "content_url": "https://example.com/article/ai-transparency",
    "source_role": "edge",
    "oa_telemetry_id": "from OA-Telemetry-ID request header, if present",
    "data": {
      "user_agent": "ChatGPT-User/1.0",
      "bot_category": "inference",
      "verified": true,
      "asn": 14061,
      "asn_org": "DigitalOcean, LLC",
      "country": "US",
      "ja4": "t13d..."
    }
  }]
}`}
/>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">Bot classification</h2>
<p class="text-gray-600 font-light mb-4">
	Cloudflare classifies AI traffic into three categories via
	<code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">VerifiedBotCategory</code>.
	The Worker maps these to OA's standard <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">bot_category</code> values:
</p>

<div class="overflow-x-auto mb-6">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-gray-200">
				<th class="text-left py-3 px-4 font-normal text-gray-800">Cloudflare category</th>
				<th class="text-left py-3 px-4 font-normal text-gray-800">OA bot_category</th>
				<th class="text-left py-3 px-4 font-normal text-gray-800">Meaning</th>
			</tr>
		</thead>
		<tbody class="font-light text-gray-600">
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">AI Crawler</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">training</code></td>
				<td class="py-3 px-4">Crawling for model training data (GPTBot, ClaudeBot, etc.)</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">AI Assistant</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">inference</code></td>
				<td class="py-3 px-4">User-triggered fetching at query time (ChatGPT-User, Perplexity-User)</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">AI Search</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">search</code></td>
				<td class="py-3 px-4">AI-powered search indexing (OAI-SearchBot)</td>
			</tr>
		</tbody>
	</table>
</div>

<p class="text-gray-600 font-light mb-4">
	The <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">inference</code>
	category is where content attribution is most relevant - there is a user, a query, and a session
	behind the retrieval. <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">training</code>
	crawls have no session context but are valuable to track for volume and compliance visibility.
</p>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">Integration paths</h2>

<h3 class="text-lg font-normal mb-3">Deploy via Wrangler (open source)</h3>
<p class="text-gray-600 font-light mb-4">Clone the open source Worker and deploy to your account:</p>

<CodeBlock
	lang="bash"
	code={`git clone https://github.com/openattribution-org/cloudflare-worker
cd cloudflare-worker
cp wrangler.example.toml wrangler.toml
npm install

# Set your API key as a secret (not in config)
npx wrangler secret put OA_API_KEY

npx wrangler deploy`}
/>

<h3 class="text-lg font-normal mb-3 mt-8">API token deployment</h3>
<p class="text-gray-600 font-light mb-4">
	Grant OA a scoped Cloudflare API token and we deploy and maintain the Worker for you. The token
	only needs <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">Workers Scripts:Edit</code>
	permission on your zone.
</p>

<h3 class="text-lg font-normal mb-3 mt-8">Native integration</h3>
<p class="text-gray-600 font-light mb-4">
	The ideal path: Cloudflare's bot classification triggers an async event to the content owner's
	OA telemetry endpoint without a separate Worker. The publisher enables it, the
	<code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">.well-known/openattribution</code>
	file tells the integration where to send events, and retrieval data flows in the standard
	format. No Worker deployment, no Wrangler, no API token.
</p>

<Callout type="note" title="Zaraz alternative">
	For sites already using Cloudflare Zaraz for analytics, OpenAttribution can be added as a custom
	managed component. Lighter weight than a full Worker.
</Callout>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">The Worker</h2>

<p class="text-gray-600 font-light mb-4">
	The Worker uses Cloudflare's bot classification rather than maintaining a hardcoded bot list.
	On Enterprise plans, <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">request.cf.botManagement</code>
	provides the full classification. On Free and Pro plans, Cloudflare's managed "AI Scrapers and
	Crawlers" rules handle detection upstream - the Worker checks whether the request was flagged.
</p>

<CodeBlock
	lang="javascript"
	filename="worker.js (Enterprise - Bot Management)"
	code={`export default {
  async fetch(request, env, ctx) {
    // Pass request to origin immediately
    const response = await fetch(request);

    const cf = request.cf;
    const bm = cf?.botManagement || {};
    const isAiBot = bm.score < 30 || bm.verifiedBot;

    if (isAiBot) {
      // Map Cloudflare's category to OA bot_category
      const categoryMap = {
        'AI Crawler': 'training',
        'AI Assistant': 'inference',
        'AI Search': 'search',
      };
      const botCategory = categoryMap[cf?.verifiedBotCategory] || 'training';

      const event = {
        type: 'content_retrieved',
        timestamp: new Date().toISOString(),
        content_url: request.url,
        source_role: 'edge',
        oa_telemetry_id: request.headers.get('OA-Telemetry-ID') || undefined,
        data: {
          user_agent: request.headers.get('user-agent'),
          bot_category: botCategory,
          verified: bm.verifiedBot || false,
          asn: cf?.asn,
          asn_org: cf?.asOrganization,
          country: cf?.country,
          ja4: bm.ja4,
        },
      };

      // Fire and forget - does not block response
      ctx.waitUntil(
        fetch(env.OA_TELEMETRY_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': env.OA_API_KEY,
          },
          body: JSON.stringify({ events: [event] }),
        })
      );
    }

    return response;
  },
};`}
/>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">Enrichment signals</h2>
<p class="text-gray-600 font-light mb-4">
	These Cloudflare edge signals are available to the Worker and map into OA event fields:
</p>

<div class="overflow-x-auto mb-6">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-gray-200">
				<th class="text-left py-3 px-4 font-normal text-gray-800">Cloudflare signal</th>
				<th class="text-left py-3 px-4 font-normal text-gray-800">OA field</th>
				<th class="text-left py-3 px-4 font-normal text-gray-800">Plan</th>
			</tr>
		</thead>
		<tbody class="font-light text-gray-600">
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">request.headers['user-agent']</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">user_agent</code></td>
				<td class="py-3 px-4">All</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">request.headers['OA-Telemetry-ID']</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">oa_telemetry_id</code></td>
				<td class="py-3 px-4">All</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">cf.asn</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">asn</code></td>
				<td class="py-3 px-4">All</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">cf.asOrganization</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">asn_org</code></td>
				<td class="py-3 px-4">All</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">cf.country</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">country</code></td>
				<td class="py-3 px-4">All</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">botManagement.verifiedBot</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">verified</code></td>
				<td class="py-3 px-4">Enterprise</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">botManagement.score</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">bot_score</code></td>
				<td class="py-3 px-4">Enterprise</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">botManagement.ja4</code></td>
				<td class="py-3 px-4"><code class="text-xs font-mono">ja4</code></td>
				<td class="py-3 px-4">Enterprise</td>
			</tr>
		</tbody>
	</table>
</div>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">Access gating</h2>
<p class="text-gray-600 font-light mb-4">
	Separate from telemetry, the Worker (or a WAF rule on Enterprise) can conditionally block AI
	agents that don't include the
	<code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">OA-Telemetry-ID</code>
	header:
</p>

<CodeBlock
	lang="text"
	filename="WAF expression (Enterprise)"
	code={`(cf.bot_management.verified_bot) and (not http.request.headers["OA-Telemetry-ID"])`}
/>

<p class="text-gray-600 font-light mb-4">
	Agents that participate in the protocol get access. Agents that don't get a 403 with a response
	explaining how to participate.
</p>

<Callout type="tip" title="Complementary to existing products">
	This pattern sits alongside Cloudflare's AI crawl control and monetisation tools, and alongside
	content marketplace licensing deals. Cloudflare handles access decisions at the edge. Marketplaces
	handle licensing and payment. OA handles attribution - what happened after access was granted,
	across all of those channels. A publisher uses all three.
</Callout>

<hr class="my-8 border-gray-200" />

<h2 class="text-2xl font-normal mb-4">Configuration</h2>

<div class="overflow-x-auto mb-6">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-gray-200">
				<th class="text-left py-3 px-4 font-normal text-gray-800">Variable</th>
				<th class="text-left py-3 px-4 font-normal text-gray-800">Description</th>
				<th class="text-left py-3 px-4 font-normal text-gray-800">Default</th>
			</tr>
		</thead>
		<tbody class="font-light text-gray-600">
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">OA_API_KEY</code></td>
				<td class="py-3 px-4">Your OpenAttribution API key (set via <code class="text-xs font-mono">wrangler secret put</code>)</td>
				<td class="py-3 px-4">Required (secret)</td>
			</tr>
			<tr class="border-b border-gray-100">
				<td class="py-3 px-4"><code class="text-xs font-mono">OA_TELEMETRY_ENDPOINT</code></td>
				<td class="py-3 px-4">Edge events endpoint URL</td>
				<td class="py-3 px-4"><code class="text-xs font-mono">https://api.openattribution.org/api/v1/telemetry/edge/events</code></td>
			</tr>
		</tbody>
	</table>
</div>

<p class="text-gray-600 font-light mb-4">
	Publishers not currently on Cloudflare can proxy traffic through a free Cloudflare account.
	The proxy adds sub-50ms of latency and immediately unlocks bot classification and Security
	Analytics. The OA Worker can then be deployed on top.
</p>

<Callout type="tip" title="Existing precedents">
	This pattern is proven in production by Castle (bot detection), DataDome (bot protection),
	and Honeycomb (observability) - all deploy Workers via API token with async outbound telemetry.
</Callout>
