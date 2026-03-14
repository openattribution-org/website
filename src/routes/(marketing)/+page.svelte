<script lang="ts">
	import { ArrowRight, Search, Shield, BarChart3, FileCheck } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let stickyCta = $state(false);
	let formSuccess = $state(false);
	let formError = $state('');
	let formSubmitting = $state(false);

	onMount(() => {
		// Fade-in sections on scroll
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('opacity-100', 'translate-y-0');
						entry.target.classList.remove('opacity-0', 'translate-y-5');
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
		);

		document.querySelectorAll('section[data-animate]').forEach((el) => {
			el.classList.add('opacity-0', 'translate-y-5', 'transition-all', 'duration-700', 'ease-out');
			observer.observe(el);
		});

		// Sticky CTA after scrolling past hero
		const handleScroll = () => {
			stickyCta = window.scrollY > window.innerHeight * 0.8;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', handleScroll);
		};
	});

	async function handleContactSubmit(e: SubmitEvent) {
		e.preventDefault();
		formSubmitting = true;
		formSuccess = false;
		formError = '';

		const form = e.target as HTMLFormElement;
		const data = new FormData(form);

		try {
			const res = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({
					access_key: 'cccfc7bc-49a0-4ff7-83f3-236b5609d79a',
					subject: 'New OpenAttribution Inquiry',
					name: data.get('name'),
					email: data.get('email'),
					organization: data.get('organization'),
					organization_type: data.get('stakeholder'),
					message: data.get('message'),
					from_name: `${data.get('name')} (${data.get('organization')})`
				})
			});
			const result = await res.json();
			if (result.success) {
				formSuccess = true;
				form.reset();
			} else {
				throw new Error(result.message || 'Failed to submit');
			}
		} catch (err) {
			formError = err instanceof Error ? err.message : 'Submission failed. Try again or email info@openattribution.org';
		} finally {
			formSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>OpenAttribution - Open Standards for AI Content Transparency</title>
	<meta name="description" content="Your content is being used by AI. You should know about it. Open standards for AI agent identity and content attribution. Check your domain, claim it, get visibility." />
</svelte:head>

<!-- Sticky CTA -->
{#if stickyCta}
	<div class="fixed bottom-8 right-8 z-40 transition-all duration-300">
		<a href="#contact" class="flex items-center gap-2 px-6 py-4 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition shadow-2xl font-normal text-lg">
			Get Involved
			<ArrowRight size={20} />
		</a>
	</div>
{/if}

<!-- Hero -->
<section class="pt-32 pb-20 px-6 bg-gradient-to-br from-brand-50 via-cream to-amber-50">
	<div class="max-w-7xl mx-auto">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div class="space-y-8">
				<h1 class="text-5xl lg:text-7xl leading-tight">
					Your content is being used by AI. <span class="text-brand-600 font-normal">You should know about it.</span>
				</h1>
				<p class="text-xl text-gray-700 font-light leading-relaxed">
					Open standards for AI agent identity and content attribution. Check your domain, claim it, and get visibility into how AI systems use your content.
				</p>
				<div class="flex flex-wrap gap-4">
					<a href="/policycheck" class="px-8 py-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-lg hover:shadow-xl font-normal text-lg">
						Check your domain
					</a>
					<a href="#standards" class="px-8 py-4 bg-white text-brand-600 rounded-lg hover:bg-gray-50 transition shadow-lg hover:shadow-xl font-light border border-brand-200">
						View the Standards
					</a>
				</div>
			</div>
			<div class="relative">
				<img
					src="/img/journo.jpeg"
					alt="Content creator at work"
					class="rounded-2xl shadow-2xl w-full h-auto object-cover"
				/>
			</div>
		</div>
	</div>
</section>

<!-- The Problem -->
<section id="problem" data-animate class="py-20 px-6 bg-gradient-to-br from-cream to-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl lg:text-5xl mb-6">The <span class="text-brand-600">Problem</span></h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				AI systems use content created by others - articles, reviews, guides, documentation, blog posts - without any standard way to track, attribute, or compensate for that usage.
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8 mb-12">
			<div class="p-8 rounded-xl bg-white shadow-lg border border-brand-100">
				<h3 class="text-xl font-normal mb-4 text-brand-900">No identity verification</h3>
				<p class="text-gray-600 font-light leading-relaxed">
					When an AI agent requests content, there is no standard way to verify who it is, what it is licensed to access, or whether it will respect any terms. The choice is binary: block all AI agents or allow all of them.
				</p>
			</div>
			<div class="p-8 rounded-xl bg-white shadow-lg border border-amber-100">
				<h3 class="text-xl font-normal mb-4 text-amber-900">No usage tracking</h3>
				<p class="text-gray-600 font-light leading-relaxed">
					AI systems consume your content and present synthesised responses without attribution. You get no visibility into how your work is used, cited, or what value it creates for AI platforms.
				</p>
			</div>
			<div class="p-8 rounded-xl bg-white shadow-lg border border-amber-100">
				<h3 class="text-xl font-normal mb-4 text-amber-900">No compliance mechanism</h3>
				<p class="text-gray-600 font-light leading-relaxed">
					Even agents that want to operate transparently have no standard way to prove compliance. Content owners who license their work have no tools to verify that agreements are being followed.
				</p>
			</div>
			<div class="p-8 rounded-xl bg-white shadow-lg border border-brand-100">
				<h3 class="text-xl font-normal mb-4 text-brand-900">Content laundering</h3>
				<p class="text-gray-600 font-light leading-relaxed">
					Content blocked from AI bots gets scraped by third parties, repackaged on aggregator sites, and ingested by AI systems anyway. Without provenance standards, legitimate and laundered content are indistinguishable.
				</p>
			</div>
		</div>

		<div class="p-8 bg-gradient-to-r from-brand-50 to-amber-50 rounded-2xl border-l-4 border-brand-600">
			<h3 class="text-xl font-normal mb-4">The result</h3>
			<p class="text-gray-600 font-light leading-relaxed">
				An adversarial relationship between AI systems and content owners. You either block AI entirely or get scraped without accountability. The value created by your content flows to those who aggregate it, not those who create it.
			</p>
		</div>
	</div>
</section>

<!-- The Standards -->
<section id="standards" data-animate class="py-20 px-6 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl lg:text-5xl mb-6">The <span class="text-brand-600">Standards</span></h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				Two complementary open standards for AI content transparency.
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
			<!-- AIMS -->
			<div class="p-8 rounded-xl bg-gradient-to-br from-brand-50 to-amber-50 border border-brand-200 shadow-lg">
				<div class="w-12 h-12 bg-brand-600 rounded-lg flex items-center justify-center mb-4">
					<Shield size={24} class="text-white" />
				</div>
				<h3 class="text-2xl font-normal mb-2 text-brand-900">AIMS</h3>
				<p class="text-sm text-brand-700 font-normal mb-4">Identity &amp; Compliance</p>
				<p class="text-gray-600 font-light leading-relaxed mb-4">
					AI Manifest Standard. DID-based agent identity with a three-layer manifest: foundation (training provenance), deployment (operator context), and content access (licensed sources). Includes disclosure headers for runtime compliance verification.
				</p>
				<div class="flex flex-wrap gap-2 mb-4">
					<span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Draft v0.1</span>
					<span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">SDK Alpha</span>
				</div>
				<a href="https://github.com/openattribution-org/aims/blob/main/SPECIFICATION.md" target="_blank" rel="noopener noreferrer" class="text-brand-600 font-normal hover:underline text-sm">
					Read Specification &rarr;
				</a>
			</div>

			<!-- Telemetry -->
			<div class="p-8 rounded-xl bg-gradient-to-br from-amber-50 to-brand-50 border border-amber-200 shadow-lg">
				<div class="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4">
					<BarChart3 size={24} class="text-white" />
				</div>
				<h3 class="text-2xl font-normal mb-2 text-amber-900">Telemetry</h3>
				<p class="text-sm text-amber-700 font-normal mb-4">Behaviour</p>
				<p class="text-gray-600 font-light leading-relaxed mb-4">
					Content Attribution Telemetry. Session-based tracking of content events (retrieved, cited, displayed), conversation turns, and commerce outcomes. Configurable privacy levels.
				</p>
				<div class="flex flex-wrap gap-2 mb-4">
					<span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Preview v0.3</span>
					<span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">SDK Alpha</span>
				</div>
				<a href="https://github.com/openattribution-org/telemetry/blob/main/SPECIFICATION.md" target="_blank" rel="noopener noreferrer" class="text-amber-600 font-normal hover:underline text-sm">
					Read Specification &rarr;
				</a>
			</div>
		</div>

		<!-- Licensing compatibility -->
		<div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
			<h3 class="text-2xl font-normal mb-6 text-center">Licensing compatibility</h3>
			<p class="text-gray-600 font-light text-center mb-6 max-w-2xl mx-auto">
				OpenAttribution is compatible with source-side licensing standards like <a href="https://rslstandard.org/" class="text-brand-600 hover:underline">RSL</a>. You define permissions on your content; OpenAttribution provides the consumer-side identity and tracking so agents can prove compliance.
			</p>
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b-2 border-brand-200">
							<th class="py-3 px-4 font-normal text-gray-900">Standard</th>
							<th class="py-3 px-4 font-normal text-gray-900">Question</th>
							<th class="py-3 px-4 font-normal text-gray-900">Side</th>
						</tr>
					</thead>
					<tbody class="text-gray-600 font-light">
						<tr class="border-b border-gray-100">
							<td class="py-3 px-4 font-normal">Source-side licensing (e.g. RSL)</td>
							<td class="py-3 px-4">What can AI do with this content?</td>
							<td class="py-3 px-4">Source (content owner)</td>
						</tr>
						<tr class="border-b border-gray-100">
							<td class="py-3 px-4 font-normal">AIMS</td>
							<td class="py-3 px-4">Who is this AI and what can it access?</td>
							<td class="py-3 px-4">Consumer (agent)</td>
						</tr>
						<tr>
							<td class="py-3 px-4 font-normal">Telemetry</td>
							<td class="py-3 px-4">What did this AI actually do?</td>
							<td class="py-3 px-4">Behaviour (audit)</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>

<!-- PolicyCheck Promo -->
<section id="policycheck" data-animate class="py-20 px-6 bg-gradient-to-br from-brand-50 via-amber-50 to-brand-50">
	<div class="max-w-4xl mx-auto">
		<div class="bg-white rounded-2xl shadow-2xl border border-brand-200 overflow-hidden">
			<div class="p-8 lg:p-12">
				<div class="mb-6">
					<div class="flex items-center gap-3 mb-4">
						<h2 class="text-3xl lg:text-4xl">
							<span class="text-brand-600 font-normal">Check</span> your domain
						</h2>
					</div>
					<p class="text-xl text-gray-700 font-light leading-relaxed mb-6">
						See which AI bots can access your content right now. Then claim your domain and tell them where to report usage.
					</p>
				</div>

				<div class="grid md:grid-cols-3 gap-4 mb-8">
					<div class="p-4 rounded-lg bg-gradient-to-br from-brand-50 to-amber-50 border border-brand-100">
						<div class="text-brand-600 font-normal mb-2 flex items-center gap-2">
							<Search size={16} />
							26+ AI bots
						</div>
						<p class="text-sm text-gray-600 font-light">GPTBot, ClaudeBot, Gemini, and more</p>
					</div>
					<div class="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-brand-50 border border-amber-100">
						<div class="text-amber-600 font-normal mb-2 flex items-center gap-2">
							<FileCheck size={16} />
							.well-known check
						</div>
						<p class="text-sm text-gray-600 font-light">See if your domain already publishes a telemetry endpoint</p>
					</div>
					<div class="p-4 rounded-lg bg-gradient-to-br from-brand-50 to-amber-50 border border-brand-100">
						<div class="text-brand-600 font-normal mb-2 flex items-center gap-2">
							<ArrowRight size={16} />
							Claim it
						</div>
						<p class="text-sm text-gray-600 font-light">Register your domain and get visibility into AI usage</p>
					</div>
				</div>

				<div class="flex flex-wrap gap-4">
					<a href="/policycheck" class="px-8 py-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-lg hover:shadow-xl font-normal text-lg">
						Try PolicyCheck
					</a>
					<a href="https://github.com/openattribution-org/policycheck" target="_blank" rel="noopener noreferrer" class="px-8 py-4 bg-white text-brand-600 rounded-lg hover:bg-gray-50 transition shadow-lg hover:shadow-xl font-light border border-brand-200">
						View on GitHub
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- How It Works -->
<section id="architecture" data-animate class="py-20 px-6 bg-gradient-to-br from-cream to-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl lg:text-5xl mb-6">How it <span class="text-brand-600">works</span></h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				The full architecture from content source to telemetry destination.
			</p>
		</div>

		<div class="space-y-6">
			<div class="p-6 rounded-xl bg-white shadow-lg border border-gray-200">
				<div class="flex items-start gap-4">
					<div class="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
						<span class="text-brand-600 text-xl font-normal">1</span>
					</div>
					<div>
						<h3 class="text-xl font-normal mb-2">Content owners declare licensing</h3>
						<p class="text-gray-600 font-light">You use <a href="https://rslstandard.org/" class="text-brand-600 hover:underline">RSL</a> to declare machine-readable licensing terms: what AI systems can do with your content, what compensation is required.</p>
					</div>
				</div>
			</div>
			<div class="p-6 rounded-xl bg-white shadow-lg border border-gray-200">
				<div class="flex items-start gap-4">
					<div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
						<span class="text-amber-600 text-xl font-normal">2</span>
					</div>
					<div>
						<h3 class="text-xl font-normal mb-2">AI agent implements OpenAttribution</h3>
						<p class="text-gray-600 font-light">The agent publishes an <strong>AIMS manifest</strong> (DID-based identity + licensed sources) with a disclosure header on content requests, and emits <strong>Telemetry</strong> on content usage and outcomes.</p>
					</div>
				</div>
			</div>
			<div class="p-6 rounded-xl bg-white shadow-lg border border-gray-200">
				<div class="flex items-start gap-4">
					<div class="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
						<span class="text-brand-600 text-xl font-normal">3</span>
					</div>
					<div>
						<h3 class="text-xl font-normal mb-2">Content owner verifies and grants access</h3>
						<p class="text-gray-600 font-light">You resolve the AIMS manifest via the DID, check that the agent is licensed for the requested content, and grant or deny access based on verification.</p>
					</div>
				</div>
			</div>
			<div class="p-6 rounded-xl bg-white shadow-lg border border-gray-200">
				<div class="flex items-start gap-4">
					<div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
						<span class="text-amber-600 text-xl font-normal">4</span>
					</div>
					<div>
						<h3 class="text-xl font-normal mb-2">Telemetry creates audit trail</h3>
						<p class="text-gray-600 font-light">Content events (retrieved, cited, displayed), conversation turns, and outcomes are tracked. You get usage reports. Compliance is auditable. Compensation can flow based on measured value.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Getting Involved -->
<section id="roles" data-animate class="py-20 px-6 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl lg:text-5xl mb-6">Getting <span class="text-brand-600">involved</span></h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				OpenAttribution is built for everyone in the AI content ecosystem.
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8">
			<div class="p-8 rounded-xl bg-gradient-to-br from-brand-50 to-amber-50 border border-brand-200">
				<h3 class="text-xl font-normal mb-4 text-brand-900">For agent developers</h3>
				<ul class="text-gray-600 font-light space-y-2">
					<li>Install the Telemetry SDK: <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs font-mono">pip install openattribution-telemetry</code></li>
					<li>Install the AIMS SDK: <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs font-mono">pip install openattribution-aims</code></li>
					<li>Create an AIMS manifest for your agent</li>
					<li>Provide feedback on specifications</li>
				</ul>
			</div>
			<div class="p-8 rounded-xl bg-gradient-to-br from-amber-50 to-brand-50 border border-amber-200">
				<h3 class="text-xl font-normal mb-4 text-amber-900">For content owners</h3>
				<ul class="text-gray-600 font-light space-y-2">
					<li>Check your domain with <a href="/policycheck" class="text-brand-600 hover:underline">PolicyCheck</a></li>
					<li>Add a <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs font-mono">.well-known/openattribution.json</code> file</li>
					<li>Implement <a href="https://rslstandard.org/" class="text-brand-600 hover:underline">RSL</a> on your content</li>
					<li>Register your domain to get visibility into AI usage</li>
				</ul>
			</div>
			<div class="p-8 rounded-xl bg-gradient-to-br from-brand-50 to-amber-50 border border-brand-200">
				<h3 class="text-xl font-normal mb-4 text-brand-900">For platforms</h3>
				<ul class="text-gray-600 font-light space-y-2">
					<li>Integrate OpenAttribution into agent frameworks</li>
					<li>Support disclosure headers in infrastructure</li>
					<li>Participate in registry governance</li>
					<li>Build framework integrations (LangChain, LlamaIndex, MCP)</li>
				</ul>
			</div>
			<div class="p-8 rounded-xl bg-gradient-to-br from-amber-50 to-brand-50 border border-amber-200">
				<h3 class="text-xl font-normal mb-4 text-amber-900">For technology providers</h3>
				<ul class="text-gray-600 font-light space-y-2">
					<li>Deploy telemetry collection infrastructure (<a href="https://github.com/openattribution-org/telemetry/tree/main/server" class="text-brand-600 hover:underline">reference server available</a>)</li>
					<li>Build attribution reporting for licensing negotiations</li>
					<li>Provide proof of fair use and content influence measurement</li>
					<li>Enable compensation flows between agents and content owners</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Developer Quick Start -->
<section id="developers" data-animate class="py-20 px-6 bg-gradient-to-br from-cream to-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl lg:text-5xl mb-6"><span class="text-brand-600">Developer</span> quick start</h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				Python SDKs for both AIMS and Telemetry. Apache 2.0 licensed.
			</p>
		</div>

		<div class="grid lg:grid-cols-2 gap-8">
			<!-- AIMS SDK -->
			<div>
				<h3 class="text-xl font-normal mb-4">AIMS - Agent Identity</h3>
				<div class="rounded-xl overflow-hidden shadow-lg">
					<div class="bg-gray-800 px-4 py-2">
						<span class="text-xs text-gray-400 font-mono uppercase tracking-wider">bash</span>
					</div>
					<pre class="bg-gray-900 px-4 py-3 text-sm font-mono text-gray-200 overflow-x-auto">pip install openattribution-aims</pre>
				</div>
				<div class="rounded-xl overflow-hidden shadow-lg mt-4">
					<div class="bg-gray-800 px-4 py-2">
						<span class="text-xs text-gray-400 font-mono uppercase tracking-wider">python</span>
					</div>
					<pre class="bg-gray-900 px-4 py-3 text-sm font-mono text-gray-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">from</span> openattribution.aims <span class="text-purple-400">import</span> AIManifest
<span class="text-purple-400">from</span> openattribution.aims.layers <span class="text-purple-400">import</span> (
    DeploymentLayer,
    ContentAccessLayer,
)

manifest = AIManifest(
    did=<span class="text-green-400">"did:aims:web:example.com:my-agent"</span>,
    deployment=DeploymentLayer(
        operator=<span class="text-green-400">"Example Corp"</span>,
        specialization=<span class="text-green-400">"customer_service"</span>,
    ),
    content_access=ContentAccessLayer(
        licensed_sources=[<span class="text-green-400">"source:internal-docs"</span>],
        rsl_compliance=<span class="text-purple-400">True</span>,
    ),
)</code></pre>
				</div>
				<p class="mt-4 text-sm text-gray-500 font-light">
					<a href="https://github.com/openattribution-org/aims" class="text-brand-600 hover:underline">GitHub: openattribution-org/aims</a>
				</p>
			</div>

			<!-- Telemetry SDK -->
			<div>
				<h3 class="text-xl font-normal mb-4">Telemetry - Content Tracking</h3>
				<div class="rounded-xl overflow-hidden shadow-lg">
					<div class="bg-gray-800 px-4 py-2">
						<span class="text-xs text-gray-400 font-mono uppercase tracking-wider">bash</span>
					</div>
					<pre class="bg-gray-900 px-4 py-3 text-sm font-mono text-gray-200 overflow-x-auto">pip install openattribution-telemetry</pre>
				</div>
				<div class="rounded-xl overflow-hidden shadow-lg mt-4">
					<div class="bg-gray-800 px-4 py-2">
						<span class="text-xs text-gray-400 font-mono uppercase tracking-wider">python</span>
					</div>
					<pre class="bg-gray-900 px-4 py-3 text-sm font-mono text-gray-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">from</span> openattribution.telemetry <span class="text-purple-400">import</span> Client

<span class="text-purple-400">async with</span> Client(
    endpoint=<span class="text-green-400">"https://telemetry.example.com"</span>,
    api_key=<span class="text-green-400">"your-api-key"</span>,
) <span class="text-purple-400">as</span> client:

    session_id = <span class="text-purple-400">await</span> client.start_session(
        content_scope=<span class="text-green-400">"shopping-assistant"</span>,
        manifest_ref=<span class="text-green-400">"did:aims:web:example.com:agent"</span>,
    )

    <span class="text-purple-400">await</span> client.record_event(
        session_id=session_id,
        event_type=<span class="text-green-400">"content_retrieved"</span>,
        content_id=content_id,
    )</code></pre>
				</div>
				<p class="mt-4 text-sm text-gray-500 font-light">
					<a href="https://github.com/openattribution-org/telemetry" class="text-brand-600 hover:underline">GitHub: openattribution-org/telemetry</a>
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Roadmap -->
<section id="roadmap" data-animate class="py-20 px-6 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl lg:text-5xl mb-6">Status & <span class="text-brand-600">Roadmap</span></h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				Honest maturity levels for each component.
			</p>
		</div>

		<div class="overflow-x-auto mb-12">
			<table class="w-full text-left">
				<thead>
					<tr class="border-b-2 border-brand-200">
						<th class="py-3 px-4 font-normal text-gray-900">Component</th>
						<th class="py-3 px-4 font-normal text-gray-900">Status</th>
						<th class="py-3 px-4 font-normal text-gray-900">Notes</th>
					</tr>
				</thead>
				<tbody class="text-gray-600 font-light">
					<tr class="border-b border-gray-100">
						<td class="py-3 px-4 font-normal">AIMS Specification</td>
						<td class="py-3 px-4"><span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Draft v0.1</span></td>
						<td class="py-3 px-4">Content transparency layers complete; crypto sections incomplete</td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="py-3 px-4 font-normal">AIMS Python SDK</td>
						<td class="py-3 px-4"><span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Alpha</span></td>
						<td class="py-3 px-4"><code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">pip install openattribution-aims</code></td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="py-3 px-4 font-normal">Telemetry Specification</td>
						<td class="py-3 px-4"><span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Preview v0.3</span></td>
						<td class="py-3 px-4">Comprehensive but not finalised</td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="py-3 px-4 font-normal">Telemetry Python SDK</td>
						<td class="py-3 px-4"><span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Alpha</span></td>
						<td class="py-3 px-4"><code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">pip install openattribution-telemetry</code></td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="py-3 px-4 font-normal">Telemetry Reference Server</td>
						<td class="py-3 px-4"><span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Alpha</span></td>
						<td class="py-3 px-4">Self-hostable reference implementation</td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="py-3 px-4 font-normal">AIMS Registry</td>
						<td class="py-3 px-4"><span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Roadmap</span></td>
						<td class="py-3 px-4">Design partnership needed</td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="py-3 px-4 font-normal">Framework Integrations</td>
						<td class="py-3 px-4"><span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Roadmap</span></td>
						<td class="py-3 px-4">LangChain, LlamaIndex, MCP priority</td>
					</tr>
					<tr>
						<td class="py-3 px-4 font-normal">OpenTelemetry Export</td>
						<td class="py-3 px-4"><span class="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Roadmap</span></td>
						<td class="py-3 px-4">OTEL semantic conventions proposal</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="bg-gradient-to-r from-brand-50 to-amber-50 rounded-2xl p-8 border-l-4 border-brand-600">
			<h3 class="text-2xl font-normal mb-6 text-center">2026 Roadmap</h3>
			<div class="grid md:grid-cols-3 gap-6">
				<div class="bg-white rounded-xl p-6">
					<h4 class="font-normal mb-2 text-lg text-brand-900">Q1: Foundation</h4>
					<ul class="text-sm text-gray-600 font-light space-y-1">
						<li>Complete AIMS disclosure headers</li>
						<li>LangChain callback handler</li>
						<li>LlamaIndex span handler</li>
						<li>End-to-end reference demo</li>
					</ul>
				</div>
				<div class="bg-white rounded-xl p-6">
					<h4 class="font-normal mb-2 text-lg text-amber-900">Q2: Ecosystem</h4>
					<ul class="text-sm text-gray-600 font-light space-y-1">
						<li>OpenTelemetry semantic conventions</li>
						<li>RSL integration documentation</li>
						<li>Registry architecture proposal</li>
						<li>Pilot conversations</li>
					</ul>
				</div>
				<div class="bg-white rounded-xl p-6">
					<h4 class="font-normal mb-2 text-lg text-brand-900">Q3-Q4: Scale</h4>
					<ul class="text-sm text-gray-600 font-light space-y-1">
						<li>Registry MVP operational</li>
						<li>CrewAI, Google ADK, MCP integrations</li>
						<li>Agent operator pilots</li>
						<li>Case studies published</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Governance -->
<section id="governance" data-animate class="py-20 px-6 bg-gradient-to-br from-cream to-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl lg:text-5xl mb-6"><span class="text-brand-600">Governance</span></h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				Open standards governed by a multi-stakeholder community.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8 mb-12">
			<div class="p-6 rounded-xl bg-white shadow-lg border border-gray-200 text-center">
				<div class="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mx-auto mb-4">
					<Shield size={24} class="text-brand-600" />
				</div>
				<h3 class="text-lg font-normal mb-2">Apache 2.0</h3>
				<p class="text-gray-600 font-light text-sm">All specifications and SDKs are Apache 2.0 licensed. Free to use, modify, and distribute.</p>
			</div>
			<div class="p-6 rounded-xl bg-white shadow-lg border border-gray-200 text-center">
				<div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
					<BarChart3 size={24} class="text-amber-600" />
				</div>
				<h3 class="text-lg font-normal mb-2">UK CLG structure</h3>
				<p class="text-gray-600 font-light text-sm">Company Limited by Guarantee. No shareholders. Governed by members for the benefit of the standards.</p>
			</div>
			<div class="p-6 rounded-xl bg-white shadow-lg border border-gray-200 text-center">
				<div class="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mx-auto mb-4">
					<Search size={24} class="text-brand-600" />
				</div>
				<h3 class="text-lg font-normal mb-2">Multi-stakeholder</h3>
				<p class="text-gray-600 font-light text-sm">Input from content owners, AI operators, platforms, and civil society. No single company controls the standards.</p>
			</div>
		</div>

		<div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
			<h3 class="text-xl font-normal mb-6 text-center">Membership categories</h3>
			<div class="grid md:grid-cols-5 gap-4">
				<div class="text-center p-4 bg-brand-50 rounded-lg">
					<p class="font-normal text-brand-900 mb-1">Publishers</p>
					<p class="text-xs text-gray-600 font-light">Media, news, editorial</p>
				</div>
				<div class="text-center p-4 bg-amber-50 rounded-lg">
					<p class="font-normal text-amber-900 mb-1">Brands</p>
					<p class="text-xs text-gray-600 font-light">Retailers, manufacturers</p>
				</div>
				<div class="text-center p-4 bg-brand-50 rounded-lg">
					<p class="font-normal text-brand-900 mb-1">Tech Providers</p>
					<p class="text-xs text-gray-600 font-light">Attribution platforms, CDNs</p>
				</div>
				<div class="text-center p-4 bg-amber-50 rounded-lg">
					<p class="font-normal text-amber-900 mb-1">AI Providers</p>
					<p class="text-xs text-gray-600 font-light">LLMs, agent platforms</p>
				</div>
				<div class="text-center p-4 bg-brand-50 rounded-lg">
					<p class="font-normal text-brand-900 mb-1">Creators</p>
					<p class="text-xs text-gray-600 font-light">Bloggers, developers, academics</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FAQ -->
<section id="faq" data-animate class="py-20 px-6 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl lg:text-5xl mb-6"><span class="text-brand-600">FAQ</span></h2>
		</div>

		<div class="space-y-4 max-w-3xl mx-auto">
			<details class="p-6 rounded-xl bg-gradient-to-r from-brand-50 to-amber-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">What is OpenAttribution?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					OpenAttribution is an open standards body developing two specifications for AI content transparency: AIMS (agent identity and compliance) and Telemetry (content usage tracking). All specifications are Apache 2.0 licensed and community-governed.
				</p>
			</details>
			<details class="p-6 rounded-xl bg-gradient-to-r from-amber-50 to-brand-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">How does this relate to RSL?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					OpenAttribution is compatible with source-side licensing standards like RSL (Really Simple Licensing). You use standards like RSL to declare what AI can do with your content. OpenAttribution provides the consumer side - agents use it to declare who they are, what they are licensed to access, and track what they actually do. Together they create a complete licensing and compliance chain.
				</p>
			</details>
			<details class="p-6 rounded-xl bg-gradient-to-r from-brand-50 to-amber-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">Is this opposed to AI development?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					No. OpenAttribution provides infrastructure for AI systems to access content transparently and sustainably. AI systems need quality content. Content owners need measurement and attribution. These standards make both possible without requiring either party to trust the other blindly.
				</p>
			</details>
			<details class="p-6 rounded-xl bg-gradient-to-r from-amber-50 to-brand-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">Do I need technical expertise to participate?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					Not necessarily. While the SDKs are developer-focused, OpenAttribution needs input from content owners, brands, legal experts, and policy makers to shape the standards. Governance participation, pilot programs, and specification feedback are all valuable contributions.
				</p>
			</details>
			<details class="p-6 rounded-xl bg-gradient-to-r from-brand-50 to-amber-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">What does OpenAttribution NOT do?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					OpenAttribution does not prevent scraping, provide cryptographic provenance for text, solve the "who said it first" problem, or guarantee that declared access rights are accurate. It provides a framework where those who want to operate transparently can do so, and recipients can distinguish between verified and unverified sources.
				</p>
			</details>
			<details class="p-6 rounded-xl bg-gradient-to-r from-amber-50 to-brand-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">How do I get started?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					The simplest starting point is to <a href="/policycheck" class="text-brand-600 hover:underline">check your domain</a> with PolicyCheck. You will see which AI bots can access your content right now. From there you can claim your domain, add a <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs font-mono">.well-known/openattribution.json</code> file, and start getting visibility into AI usage. Developers can install the Python SDKs: <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs font-mono">pip install openattribution-aims</code> and <code class="px-1 py-0.5 bg-white rounded border border-gray-200 text-xs font-mono">pip install openattribution-telemetry</code>.
				</p>
			</details>
		</div>
	</div>
</section>

<!-- Contact -->
<section id="contact" data-animate class="py-20 px-6 bg-gradient-to-br from-cream to-white">
	<div class="max-w-2xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl lg:text-5xl mb-6">Get <span class="text-brand-600">involved</span></h2>
			<p class="text-xl text-gray-600 font-light">
				Interested in contributing to the standards? Get in touch.
			</p>
		</div>

		<form onsubmit={handleContactSubmit} class="space-y-6">
			<div>
				<label for="organization" class="block text-sm font-normal text-gray-700 mb-2">Organisation name</label>
				<input
					type="text"
					id="organization"
					name="organization"
					required
					class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition font-light"
					placeholder="Your organisation"
				/>
			</div>
			<div>
				<label for="contact-name" class="block text-sm font-normal text-gray-700 mb-2">Your name</label>
				<input
					type="text"
					id="contact-name"
					name="name"
					required
					class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition font-light"
					placeholder="Full name"
				/>
			</div>
			<div>
				<label for="contact-email" class="block text-sm font-normal text-gray-700 mb-2">Email</label>
				<input
					type="email"
					id="contact-email"
					name="email"
					required
					class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition font-light"
					placeholder="email@organisation.com"
				/>
			</div>
			<div>
				<label for="stakeholder" class="block text-sm font-normal text-gray-700 mb-2">Organisation type</label>
				<select
					id="stakeholder"
					name="stakeholder"
					required
					class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition font-light"
				>
					<option value="">Select type</option>
					<option value="publisher">Publisher / Media</option>
					<option value="brand">Brand / Retailer</option>
					<option value="tech-provider">Technology Provider</option>
					<option value="ai-provider">AI Provider</option>
					<option value="agency">Agency / Service Provider</option>
					<option value="creator">Creator / Individual</option>
					<option value="other">Other</option>
				</select>
			</div>
			<div>
				<label for="message" class="block text-sm font-normal text-gray-700 mb-2">Message</label>
				<textarea
					id="message"
					name="message"
					rows="5"
					required
					class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition font-light"
					placeholder="Tell us about your interest in OpenAttribution..."
				></textarea>
			</div>

			<button
				type="submit"
				disabled={formSubmitting}
				class="w-full px-8 py-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-lg hover:shadow-xl font-light text-lg disabled:opacity-60 disabled:cursor-not-allowed"
			>
				{formSubmitting ? 'Sending...' : 'Submit Inquiry'}
			</button>
			<p class="text-sm text-gray-500 text-center font-light">We respond within 48 hours</p>

			{#if formSuccess}
				<div class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center font-light">
					Thank you for your inquiry. We will respond within 48 hours.
				</div>
			{/if}

			{#if formError}
				<div class="p-4 bg-brand-50 border border-brand-200 rounded-lg text-brand-700 text-center font-light">
					{formError}
				</div>
			{/if}
		</form>

		<div class="mt-12 max-w-md mx-auto">
			<div class="p-6 bg-white rounded-xl shadow-md text-center">
				<h3 class="text-xl font-normal mb-4">Contact</h3>
				<a href="mailto:info@openattribution.org" class="text-brand-600 hover:underline text-lg">info@openattribution.org</a>
			</div>
		</div>
	</div>
</section>
