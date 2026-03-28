<script lang="ts">
	let { activeStep = 0 }: { activeStep?: number } = $props();

	const show = (minStep: number) => activeStep >= minStep;
</script>

<svg
	viewBox="0 0 480 560"
	xmlns="http://www.w3.org/2000/svg"
	class="w-full h-auto"
	role="img"
	aria-label="Telemetry flow diagram showing how content attribution works"
>
	<defs>
		<marker id="arrow" viewBox="0 0 10 7" refX="9" refY="3.5"
			markerWidth="8" markerHeight="6" orient="auto-start-reverse">
			<path d="M 0 0 L 10 3.5 L 0 7 z" fill="#9ca3af" />
		</marker>
		<marker id="arrow-brand" viewBox="0 0 10 7" refX="9" refY="3.5"
			markerWidth="8" markerHeight="6" orient="auto-start-reverse">
			<path d="M 0 0 L 10 3.5 L 0 7 z" fill="#dc3b35" />
		</marker>
		<marker id="arrow-green" viewBox="0 0 10 7" refX="9" refY="3.5"
			markerWidth="8" markerHeight="6" orient="auto-start-reverse">
			<path d="M 0 0 L 10 3.5 L 0 7 z" fill="#16a34a" />
		</marker>
		<marker id="arrow-amber" viewBox="0 0 10 7" refX="9" refY="3.5"
			markerWidth="8" markerHeight="6" orient="auto-start-reverse">
			<path d="M 0 0 L 10 3.5 L 0 7 z" fill="#f59e0b" />
		</marker>
	</defs>

	<!-- ======================== -->
	<!-- STEP 0: User asks Agent  -->
	<!-- ======================== -->
	<g class="flow-node" class:flow-visible={show(0)}>
		<rect x="15" y="20" width="130" height="50" rx="12"
			fill="white" stroke="#d1d5db" stroke-width="1.5" />
		<text x="80" y="50" text-anchor="middle" class="flow-label">User</text>

		<line x1="145" y1="38" x2="278" y2="38"
			stroke="#9ca3af" stroke-width="1.5" marker-end="url(#arrow)" />
		<text x="211" y="30" text-anchor="middle" class="flow-sublabel">asks a question</text>

		<rect x="288" y="20" width="170" height="50" rx="12"
			fill="#fef2f2" stroke="#dc3b35" stroke-width="1.5" />
		<text x="373" y="50" text-anchor="middle" class="flow-label flow-label-brand">AI Agent</text>
	</g>

	<!-- ========================= -->
	<!-- STEP 1: Content Retrieved -->
	<!-- ========================= -->
	<g class="flow-node" class:flow-visible={show(1)}>
		<!-- Agent retrieves: straight down left side -->
		<line x1="340" y1="70" x2="340" y2="185"
			stroke="#9ca3af" stroke-width="1.5" marker-end="url(#arrow)" />
		<text x="332" y="115" class="flow-sublabel" text-anchor="end">retrieves</text>
		<text x="332" y="130" class="flow-tiny" text-anchor="end">via web, marketplace, RAG</text>

		<!-- Content box (right side, under Agent) -->
		<rect x="265" y="185" width="200" height="55" rx="12"
			fill="#fef2f2" stroke="#dc3b35" stroke-width="2" />
		<text x="365" y="210" text-anchor="middle" class="flow-label flow-label-brand">Your Content</text>
		<text x="365" y="228" text-anchor="middle" class="flow-tiny">example.com/article</text>

		<!-- Content returns UP to Agent: right side -->
		<line x1="415" y1="185" x2="415" y2="70"
			stroke="#dc3b35" stroke-width="1.5" stroke-dasharray="6 4"
			marker-end="url(#arrow-brand)" />
		<text x="430" y="130" class="flow-tiny" fill="#dc3b35">content</text>
	</g>

	<!-- content_retrieved badge -->
	<g class="flow-node flow-badge-reveal" class:flow-visible={show(1)}>
		<rect x="280" y="245" width="125" height="26" rx="13"
			fill="#dc3b35" opacity="0.9" class="flow-badge-bg" />
		<text x="342" y="263" text-anchor="middle" class="flow-badge">content_retrieved</text>
	</g>

	<!-- ================================ -->
	<!-- STEP 2: Content enters context   -->
	<!-- ================================ -->
	<g class="flow-node" class:flow-visible={show(2)}>
		<text x="373" y="288" text-anchor="middle" class="flow-sublabel" fill="#7c3aed">enters generation context</text>
	</g>

	<!-- content_grounded badge -->
	<g class="flow-node flow-badge-reveal" class:flow-visible={show(2)}>
		<rect x="280" y="298" width="125" height="26" rx="13"
			fill="#7c3aed" opacity="0.9" class="flow-badge-bg" />
		<text x="342" y="316" text-anchor="middle" class="flow-badge">content_grounded</text>
	</g>

	<!-- =========================== -->
	<!-- STEP 3: Cited in response   -->
	<!-- =========================== -->
	<g class="flow-node" class:flow-visible={show(3)}>
		<line x1="288" y1="56" x2="145" y2="56"
			stroke="#dc3b35" stroke-width="1.5" stroke-dasharray="6 4"
			marker-end="url(#arrow-brand)" />
		<text x="211" y="76" text-anchor="middle" class="flow-sublabel flow-sublabel-brand">responds with citation</text>
	</g>

	<!-- content_cited badge -->
	<g class="flow-node flow-badge-reveal" class:flow-visible={show(3)}>
		<rect x="155" y="86" width="110" height="26" rx="13"
			fill="#dc3b35" opacity="0.9" class="flow-badge-bg" />
		<text x="210" y="104" text-anchor="middle" class="flow-badge">content_cited</text>
	</g>

	<!-- ============================== -->
	<!-- STEP 4: Telemetry Server       -->
	<!-- ============================== -->

	<!-- Server node (left side) -->
	<g class="flow-node flow-visible" style="opacity: {show(4) ? 1 : 0.2}; transition: opacity 0.6s ease;">
		<rect x="15" y="365" width="270" height="55" rx="14"
			fill="#16a34a" opacity="0.12" stroke="#16a34a" stroke-width="2" />
		<text x="150" y="390" text-anchor="middle" class="flow-label" fill="#166534">OA Telemetry Server</text>
		<text x="150" y="409" text-anchor="middle" class="flow-tiny" fill="#16a34a">openattribution.org</text>
	</g>

	<!-- Event paths to server -->
	<g class="flow-node" class:flow-visible={show(4)}>
		<!-- Retrieved event: left from badge, then straight down -->
		<path d="M 280,258 L 210,258 L 210,365"
			fill="none" stroke="#16a34a" stroke-width="1.5" marker-end="url(#arrow-green)" />

		<!-- Grounded event: left from badge, then straight down -->
		<path d="M 280,311 L 140,311 L 140,365"
			fill="none" stroke="#16a34a" stroke-width="1.5" marker-end="url(#arrow-green)" />

		<!-- Cited event: left from badge, then straight down -->
		<path d="M 155,99 L 70,99 L 70,365"
			fill="none" stroke="#16a34a" stroke-width="1.5" marker-end="url(#arrow-green)" />

		<text x="355" y="345" class="flow-sublabel" fill="#16a34a">events reported</text>
	</g>

	<!-- ================================ -->
	<!-- STEP 5: Two views                -->
	<!-- ================================ -->
	<g class="flow-node" class:flow-visible={show(5)}>
		<rect x="10" y="485" width="195" height="50" rx="10"
			fill="white" stroke="#dc3b35" stroke-width="1.5" />
		<text x="107" y="507" text-anchor="middle" class="flow-sublabel flow-sublabel-brand">Session Attribution</text>
		<text x="107" y="524" text-anchor="middle" class="flow-tiny">what happened in this session?</text>

		<line x1="107" y1="420" x2="107" y2="485"
			stroke="#dc3b35" stroke-width="1.5" marker-end="url(#arrow-brand)" />

		<rect x="255" y="485" width="210" height="50" rx="10"
			fill="white" stroke="#dc3b35" stroke-width="1.5" />
		<text x="360" y="507" text-anchor="middle" class="flow-sublabel flow-sublabel-brand">Content Owner Totals</text>
		<text x="360" y="524" text-anchor="middle" class="flow-tiny">how much is my content used?</text>

		<path d="M 285,392 L 360,392 L 360,485"
			fill="none" stroke="#dc3b35" stroke-width="1.5" marker-end="url(#arrow-brand)" />
	</g>

</svg>

<style>
	.flow-node {
		opacity: 0;
		transition: opacity 0.6s ease;
	}

	.flow-visible {
		opacity: 1;
	}

	.flow-badge-bg {
		clip-path: inset(0 100% 0 0);
		transition: clip-path 0.5s ease-out 0.3s;
	}

	.flow-badge-reveal.flow-visible .flow-badge-bg {
		clip-path: inset(0 0 0 0);
	}

	.flow-label {
		font-family: 'Geist', system-ui, sans-serif;
		font-size: 15px;
		font-weight: 400;
		fill: #1f2937;
	}

	.flow-label-brand {
		fill: #dc3b35;
	}

	.flow-sublabel {
		font-family: 'Geist', system-ui, sans-serif;
		font-size: 11px;
		font-weight: 300;
		fill: #6b7280;
	}

	.flow-sublabel-brand {
		fill: #dc3b35;
		font-weight: 400;
	}

	.flow-tiny {
		font-family: 'Geist Mono', 'Consolas', monospace;
		font-size: 10px;
		font-weight: 300;
		fill: #9ca3af;
	}

	.flow-badge {
		font-family: 'Geist Mono', 'Consolas', monospace;
		font-size: 10px;
		font-weight: 400;
		fill: white;
	}

	@media (prefers-reduced-motion: reduce) {
		.flow-node {
			transition: none;
			opacity: 1;
		}
		.flow-badge-bg {
			transition: none;
			clip-path: inset(0 0 0 0);
		}
	}
</style>
