<script lang="ts">
	import CodeBlock from '$lib/components/docs/CodeBlock.svelte';
</script>

<svelte:head>
	<title>Specifications - OpenAttribution</title>
	<meta
		name="description"
		content="OpenAttribution specifications: Telemetry (content attribution events) and AIMS (agent identity manifests). Apache 2.0."
	/>
</svelte:head>

<h1 class="text-3xl lg:text-4xl mb-4">Specifications</h1>
<p class="text-lg text-gray-600 font-light mb-8 max-w-3xl">
	Two specs, both Apache 2.0, both on GitHub. Telemetry defines the event model for content
	attribution. AIMS defines agent identity. They work independently or together.
</p>

<hr class="my-8 border-gray-200" />

<!-- Telemetry -->
<div class="mb-12">
	<div class="flex items-start justify-between gap-4 mb-4">
		<div>
			<h2 class="text-2xl font-normal">Telemetry</h2>
			<p class="text-sm text-gray-500 font-light">v0.5 - Preview</p>
		</div>
		<a
			href="https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md"
			target="_blank"
			rel="noopener noreferrer"
			class="px-4 py-2 rounded-lg text-sm font-normal text-brand-600 border border-brand-200 hover:bg-brand-50 transition whitespace-nowrap"
		>
			Read on GitHub
		</a>
	</div>

	<p class="text-gray-600 font-light mb-4">
		The session-event-outcome model for content attribution in AI agent interactions.
		Defines how retrieval, citation, engagement, and conversion events are structured,
		transported, and correlated across multiple observers.
	</p>

	<h3 class="text-lg font-normal mb-3">Core event types</h3>
	<div class="overflow-x-auto mb-6">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-gray-200">
					<th class="text-left py-3 px-4 font-normal text-gray-800">Event</th>
					<th class="text-left py-3 px-4 font-normal text-gray-800">When</th>
				</tr>
			</thead>
			<tbody class="font-light text-gray-600">
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4"><code class="text-xs font-mono">content_retrieved</code></td>
					<td class="py-3 px-4">Content fetched from source by an agent</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4"><code class="text-xs font-mono">content_cited</code></td>
					<td class="py-3 px-4">Content referenced in an agent's response</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4"><code class="text-xs font-mono">content_engaged</code></td>
					<td class="py-3 px-4">User interacted with cited content</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4"><code class="text-xs font-mono">turn_started</code> / <code class="text-xs font-mono">turn_completed</code></td>
					<td class="py-3 px-4">Conversation turn lifecycle</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4"><code class="text-xs font-mono">checkout_completed</code></td>
					<td class="py-3 px-4">Purchase confirmed - ties outcome back to content</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-normal mb-3">Key concepts</h3>
	<ul class="space-y-2 text-gray-600 font-light mb-6">
		<li>
			<strong class="font-normal">Source roles</strong> -
			<code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">origin</code>,
			<code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">cache</code>,
			<code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">index</code>,
			<code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">agent</code>.
			Multiple observers can report the same retrieval from different vantage points.
		</li>
		<li>
			<strong class="font-normal">Cross-observer correlation</strong> -
			the <code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">OA-Telemetry-ID</code> HTTP header
			links events from different reporters into one corroborated retrieval.
		</li>
		<li>
			<strong class="font-normal">Privacy levels</strong> -
			four tiers from <code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">full</code> (complete query/response text) to
			<code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">minimal</code> (only content URLs and token counts). No PII.
		</li>
		<li>
			<strong class="font-normal">Multi-session attribution</strong> -
			<code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">prior_session_ids</code>
			links research, comparison, and purchase sessions into a full journey.
		</li>
	</ul>

	<h3 class="text-lg font-normal mb-3">Protocol bindings</h3>
	<div class="overflow-x-auto mb-6">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-gray-200">
					<th class="text-left py-3 px-4 font-normal text-gray-800">Binding</th>
					<th class="text-left py-3 px-4 font-normal text-gray-800">Purpose</th>
					<th class="text-left py-3 px-4 font-normal text-gray-800">Spec</th>
				</tr>
			</thead>
			<tbody class="font-light text-gray-600">
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4">ACP</td>
					<td class="py-3 px-4">Embed attribution in Agentic Commerce Protocol checkouts</td>
					<td class="py-3 px-4">
						<a href="https://github.com/openattribution-org/telemetry/blob/main/acp/rfc.content_attribution.md" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">acp/rfc</a>
					</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4">UCP</td>
					<td class="py-3 px-4">Embed attribution in Universal Commerce Protocol checkouts</td>
					<td class="py-3 px-4">
						<a href="https://github.com/openattribution-org/telemetry/blob/main/ucp/EXTENSION.md" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">ucp/EXTENSION</a>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h3 class="text-lg font-normal mb-3">SDKs</h3>
	<div class="flex flex-wrap gap-3">
		<a href="https://github.com/openattribution-org/telemetry" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-lg text-sm font-light border border-gray-200 hover:border-brand-200 hover:bg-brand-50 transition">
			Python: <code class="text-xs font-mono">pip install openattribution-telemetry</code>
		</a>
		<a href="https://github.com/openattribution-org/telemetry/tree/main/ts" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-lg text-sm font-light border border-gray-200 hover:border-brand-200 hover:bg-brand-50 transition">
			TypeScript: <code class="text-xs font-mono">npm install @openattribution/telemetry</code>
		</a>
	</div>
</div>

<hr class="my-8 border-gray-200" />

<!-- AIMS -->
<div class="mb-12">
	<div class="flex items-start justify-between gap-4 mb-4">
		<div>
			<h2 class="text-2xl font-normal">AIMS - Agent Identity and Manifest Standard</h2>
			<p class="text-sm text-gray-500 font-light">v0.2 - Draft</p>
		</div>
		<a
			href="https://github.com/openattribution-org/aims/blob/main/SPECIFICATION.md"
			target="_blank"
			rel="noopener noreferrer"
			class="px-4 py-2 rounded-lg text-sm font-normal text-brand-600 border border-brand-200 hover:bg-brand-50 transition whitespace-nowrap"
		>
			Read on GitHub
		</a>
	</div>

	<p class="text-gray-600 font-light mb-4">
		Verifiable identity for AI agents that access web content. AIMS is the identity layer
		in the four-layer stack - it provides the verified subject that telemetry events are attributed to.
	</p>

	<h3 class="text-lg font-normal mb-3">What the manifest declares</h3>
	<div class="overflow-x-auto mb-6">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-gray-200">
					<th class="text-left py-3 px-4 font-normal text-gray-800">Field</th>
					<th class="text-left py-3 px-4 font-normal text-gray-800">What it declares</th>
				</tr>
			</thead>
			<tbody class="font-light text-gray-600">
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4">Identity</td>
					<td class="py-3 px-4">W3C DID (any method - did:web recommended)</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4">Licences</td>
					<td class="py-3 px-4">Content licences held, RSL references, redistribution policies</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4">Telemetry</td>
					<td class="py-3 px-4">OpenAttribution endpoint this agent reports to</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-3 px-4">Foundation / Deployment</td>
					<td class="py-3 px-4">Optional: training data provenance, commercial context</td>
				</tr>
			</tbody>
		</table>
	</div>

	<p class="text-gray-600 font-light mb-4">
		The agent's DID in the manifest matches the
		<code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">agent_id</code>
		in telemetry events, linking identity to usage data. Publishers resolve the DID
		to verify licences before granting access.
	</p>

	<h3 class="text-lg font-normal mb-3">SDK</h3>
	<a href="https://github.com/openattribution-org/aims" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-lg text-sm font-light border border-gray-200 hover:border-brand-200 hover:bg-brand-50 transition">
		Python: <code class="text-xs font-mono">pip install openattribution-aims</code>
	</a>
</div>

<hr class="my-8 border-gray-200" />

<!-- JSON Schema -->
<div>
	<h2 class="text-2xl font-normal mb-4">Machine-readable schemas</h2>
	<p class="text-gray-600 font-light mb-4">
		Both specs have JSON Schema definitions for validation and code generation:
	</p>
	<ul class="space-y-2 text-gray-600 font-light">
		<li>
			<a href="https://github.com/openattribution-org/telemetry/blob/main/schema.json" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">
				Telemetry schema.json
			</a>
			- canonical session and event schema
		</li>
		<li>
			<a href="https://github.com/openattribution-org/telemetry/blob/main/acp/schemas/content_attribution.json" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">
				ACP content_attribution schema
			</a>
		</li>
		<li>
			<a href="https://github.com/openattribution-org/telemetry/blob/main/ucp/extension-schema.json" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline">
				UCP extension schema
			</a>
		</li>
	</ul>
</div>
