<script lang="ts">
	import { ArrowRight, ArrowDown } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import EventTicker from '$lib/components/flow/EventTicker.svelte';
	import TelemetryFlowDiagram from '$lib/components/flow/TelemetryFlowDiagram.svelte';
	import FlowStep from '$lib/components/flow/FlowStep.svelte';
	import FlowEventSnippet from '$lib/components/flow/FlowEventSnippet.svelte';
	import WellKnownShowcase from '$lib/components/WellKnownShowcase.svelte';
	import OpenInAgent from '$lib/components/OpenInAgent.svelte';
	import TelemetryDemo from '$lib/components/demo/TelemetryDemo.svelte';

	let activeStep = $state(0);
	let stickyCta = $state(false);
	let formSuccess = $state(false);
	let formError = $state('');
	let formSubmitting = $state(false);

	onMount(() => {
		// Step detection for flow diagram - pick the highest visible step
		const visibleSteps = new Set<number>();
		const stepObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const step = parseInt((entry.target as HTMLElement).dataset.step ?? '0');
					if (entry.isIntersecting) {
						visibleSteps.add(step);
					} else {
						visibleSteps.delete(step);
					}
				});
				if (visibleSteps.size > 0) {
					activeStep = Math.max(...visibleSteps);
				}
			},
			{ threshold: 0.1, rootMargin: '0px 0px -20% 0px' }
		);

		document.querySelectorAll('[data-step]').forEach((el) => {
			stepObserver.observe(el);
		});

		// Fade-in for other sections
		const fadeObserver = new IntersectionObserver(
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
			fadeObserver.observe(el);
		});

		// Sticky CTA
		const handleScroll = () => {
			stickyCta = window.scrollY > window.innerHeight * 0.8;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			stepObserver.disconnect();
			fadeObserver.disconnect();
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
	<title>OpenAttribution - See how AI uses your content</title>
	<meta name="description" content="OpenAttribution is a not-for-profit building open standards and free infrastructure for AI content usage transparency. See how AI agents use your content and help shape the rules." />
</svelte:head>

<!-- Sticky bottom bar -->
{#if stickyCta}
	<div class="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-t border-white/10 transition-all duration-300">
		<div class="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
			<p class="text-sm text-gray-300 font-light hidden sm:block">AI agents use your content every day. Do you know how?</p>
			<div class="flex items-center gap-3 mx-auto sm:mx-0">
				<a href="/policycheck" class="text-sm text-gray-300 hover:text-white transition font-light">Check your domain</a>
				<a href="/login" class="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-normal">
					Get visibility <ArrowRight size={14} />
				</a>
			</div>
		</div>
	</div>
{/if}

<!-- ==================== -->
<!-- TICKER HERO           -->
<!-- ==================== -->
<section class="relative min-h-[100svh] flex items-center justify-center bg-gray-900" style="overflow: clip;">
	<EventTicker />

	<!-- Overlay content -->
	<div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
		<p class="text-lg sm:text-xl text-gray-300 font-light mb-3">Not-for-profit. Open standard.</p>
		<p class="text-2xl sm:text-3xl lg:text-4xl text-white font-light leading-tight mb-4">
			AI agents retrieve your content every day.<br />
			<span class="text-brand-400 font-normal">Start seeing it.</span>
		</p>
		<p class="text-sm sm:text-base text-gray-300 font-light mb-10 max-w-2xl mx-auto">
			If you publish content on the web - news, product pages, guides, research - you should know how AI systems use it. OpenAttribution operates free telemetry infrastructure and works with AI platforms, agent developers, and standards bodies to make that visibility the default.
		</p>

		<!-- Primary CTAs -->
		<div class="flex flex-wrap justify-center gap-4 mb-6">
			<a href="/login" class="inline-flex items-center gap-2 px-6 py-3 text-base bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-normal shadow-lg">
				Get visibility <ArrowRight size={16} />
			</a>
			<a href="/policycheck" class="inline-flex items-center gap-2 px-6 py-3 text-base bg-white/10 text-white rounded-lg hover:bg-white/15 transition font-light">
				Check your domain
			</a>
		</div>

		<!-- Agent builder secondary CTA -->
		<div class="mt-6 pt-6 border-t border-white/10 max-w-xl mx-auto">
			<p class="text-sm text-gray-300 font-light mb-3">Building an AI agent? Agents that report usage get better content access.</p>
			<div class="flex flex-wrap justify-center gap-3">
				<a href="#developers" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-white/8 text-gray-300 rounded-lg hover:bg-white/15 transition font-light">
					Developer quick start <ArrowRight size={14} />
				</a>
				<a href="/docs" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-white/8 text-gray-300 rounded-lg hover:bg-white/15 transition font-light">
					Documentation <ArrowRight size={14} />
				</a>
			</div>
		</div>

		<div class="mt-8">
			<OpenInAgent
				label="Ask an AI agent about this"
				dark={true}
				context="This is the OpenAttribution homepage. Read it and help me understand which integration is right for my site - I might be on WordPress, Cloudflare, Fastly, Vercel, or something else."
			/>
		</div>

		<a href="#demo" class="inline-flex flex-col items-center gap-1 mt-8 text-gray-400 hover:text-white transition animate-bounce">
			<span class="text-xs tracking-wide">See how it works</span>
			<ArrowDown size={24} />
		</a>
	</div>
</section>

<!-- ========================= -->
<!-- LIVE DEMO - Three-pane     -->
<!-- ========================= -->
<section id="demo" data-animate class="scroll-mt-20 py-20 px-6 bg-white">
	<div class="max-w-5xl mx-auto text-center mb-10">
		<h2 class="text-2xl lg:text-3xl mb-3">One session, three events</h2>
		<p class="text-gray-600 max-w-2xl mx-auto">
			A user asks a question. The agent retrieves your content, cites it in the response, and the user clicks through.
			Each step is a telemetry event. This is what that looks like.
		</p>
	</div>

	<div class="max-w-7xl mx-auto">
		<TelemetryDemo />
	</div>
</section>

<!-- ================================ -->
<!-- .WELL-KNOWN SHOWCASE             -->
<!-- ================================ -->
<WellKnownShowcase />

<!-- ================================ -->
<!-- THE FLOW - Interactive walkthrough -->
<!-- ================================ -->
<section id="how-it-works" class="scroll-mt-20 pt-20 pb-20 px-6 bg-white">
	<div class="max-w-7xl mx-auto">
		<div class="lg:grid lg:grid-cols-2 lg:gap-12">
			<!-- Sticky diagram (desktop) -->
			<div class="hidden lg:block">
				<div class="sticky top-20">
					<TelemetryFlowDiagram {activeStep} />
				</div>
			</div>

			<!-- Scrollable steps -->
			<div>
				<!-- Sticky header + step indicator -->
				<div class="sticky top-16 z-20 bg-white/90 backdrop-blur-sm pt-6 pb-3 mb-4 border-b border-gray-200/50">
					<p class="text-xs font-mono text-brand-600 tracking-wider uppercase mb-2">Open standard. Your data.</p>
					<h2 class="text-2xl lg:text-3xl mb-2">What happens when AI <span class="text-brand-600">uses your content</span></h2>
					<p class="text-sm text-gray-500 font-light mb-3">
						Your infrastructure already sees AI bot traffic. The standard gives it structure so you can track, measure, and act on it.
					</p>
					<div class="flex items-center gap-1.5">
						{#each Array(5) as _, i}
							<div
								class="h-1 flex-1 rounded-full transition-all duration-300 {i <= activeStep ? 'bg-brand-500' : 'bg-gray-200'}"
							></div>
						{/each}
					</div>
					<p class="text-xs text-gray-500 font-light mt-1.5">Step {activeStep + 1} of 5</p>
				</div>

				<!-- Diagram is desktop-only (sticky sidebar). On mobile the steps stand alone. -->

				<FlowStep step={0} title="A user asks an AI agent a question">
					<p>
						Someone opens ChatGPT, Perplexity, a shopping assistant - any agentic interface. They type a question.
						The agent needs to answer, and to answer well, it needs content.
					</p>
				</FlowStep>

				<FlowStep step={1} title="Your content is retrieved">
					<p>
						<span class="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-normal mb-2">Works today - no agent cooperation needed</span>
					</p>
					<p>
						The agent fetches your article, your review, your product page.
						Your CDN or web server sees the request and reports it. You detect the AI user agent, emit a structured event, done.
						This works with any bot that visits your site - whether it cooperates with the standard or not.
					</p>
					<FlowEventSnippet event={{
						type: "content_retrieved",
						content_url: "https://example.com/best-headphones",
						source_role: "origin",
						timestamp: "2026-01-15T10:30:01Z"
					}} />
				</FlowStep>

				<FlowStep step={2} title="Your content is cited in the response">
					<p>
						<span class="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-normal mb-2">Requires agent adoption - the standard's core goal</span>
					</p>
					<p>
						The agent paraphrases your review, quotes your comparison, references your data.
						Today, visibility ends at retrieval. You can see the fetch but not what happens next.
						This is the gap the standard closes - when agents adopt it, they report how your content was used.
						That's the principle that was never conceded for search. It's being built for AI.
					</p>
					<FlowEventSnippet event={{
						type: "content_cited",
						content_url: "https://example.com/best-headphones",
						data: {
							citation_type: "paraphrase",
							excerpt_tokens: 85,
							position: "primary"
						}
					}} />
				</FlowStep>

				<FlowStep step={3} title="Events flow to your telemetry endpoint">
					<p>
						Retrieval events from your infrastructure, citation events from cooperative agents - they all flow to the endpoint
						declared in your <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">.well-known/openattribution.json</code> file.
						The OA public server collects them for free, or you self-host. Your data either way.
					</p>
				</FlowStep>

				<FlowStep step={4} title="Content owners get visibility">
					<p>
						Which AI bots are hitting your site? How often? Which pages?
						That's what you can see today with server-side reporting.
					</p>
					<p class="mt-2">
						As agent adoption grows, the picture fills in - which agents are citing your content, in what form, how prominently.
						That's the data that makes licensing conversations real instead of guesswork.
					</p>
					<p class="mt-4 text-brand-600 font-normal">
						It starts with seeing the retrieval. The standard is how we get to the rest.
					</p>
				</FlowStep>
			</div>
		</div>
	</div>
</section>

<!-- ================================ -->
<!-- ENGAGEMENT LADDER                -->
<!-- ================================ -->
<section data-animate class="py-20 px-6 bg-cream">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16">
			<h2 class="text-3xl lg:text-5xl mb-6">See what's <span class="text-brand-600">happening</span></h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				Whether you're a publisher, a brand, or a retailer - if you have content on the web, AI agents are using it.
				Free tools to see it happening. Open standards to do something about it.
			</p>
		</div>

		<!-- Graduated engagement ladder -->
		<div class="space-y-6">
			<!-- Level 1: PolicyCheck -->
			<div class="rounded-xl bg-white border border-gray-200 shadow-md overflow-hidden">
				<div class="flex items-center gap-3 px-5 py-2.5 bg-brand-600 text-white lg:hidden">
					<span class="text-sm font-normal">1</span>
					<h3 class="text-base font-normal text-white">Check your domain with PolicyCheck</h3>
				</div>
				<div class="p-6 lg:p-8">
					<div class="hidden lg:flex items-start gap-4">
						<span class="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-normal flex-shrink-0">1</span>
						<div>
							<h3 class="text-xl font-normal text-gray-800">Check your domain with PolicyCheck</h3>
							<p class="text-gray-600 font-light mt-1 mb-3">
								See which of 26+ AI bots can access your content right now. No signup needed.
								Takes 30 seconds.
							</p>
							<a href="/policycheck" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow font-normal text-sm">
								Try PolicyCheck <ArrowRight size={14} />
							</a>
						</div>
					</div>
					<div class="lg:hidden">
						<p class="text-gray-600 font-light mb-3">
							See which of 26+ AI bots can access your content right now. No signup needed.
							Takes 30 seconds.
						</p>
						<a href="/policycheck" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow font-normal text-sm">
							Try PolicyCheck <ArrowRight size={14} />
						</a>
					</div>
				</div>
			</div>

			<!-- Level 2: .well-known file -->
			<div class="rounded-xl bg-white border border-gray-200 shadow-md overflow-hidden">
				<div class="flex items-center gap-3 px-5 py-2.5 bg-brand-600 text-white lg:hidden">
					<span class="text-sm font-normal">2</span>
					<h3 class="text-base font-normal text-white">Start tracking with a .well-known file</h3>
				</div>
				<div class="p-6 lg:p-8">
					<div class="hidden lg:flex items-start gap-4">
						<span class="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-normal flex-shrink-0">2</span>
						<div>
							<h3 class="text-xl font-normal text-gray-800">Start tracking with a .well-known file</h3>
							<p class="text-gray-600 font-light mt-1 mb-3">
								We generate your <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">.well-known/openattribution.json</code> file.
								Place it on your site - four lines of JSON that declare your telemetry endpoint.
								Publishing this file costs nothing and positions you for the cooperative future.
							</p>
							<a href="/login" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow font-normal text-sm">
								Sign up and get your file <ArrowRight size={14} />
							</a>
						</div>
					</div>
					<div class="lg:hidden">
						<p class="text-gray-600 font-light mb-3">
							We generate your <code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">.well-known/openattribution.json</code> file.
							Place it on your site - four lines of JSON that declare your telemetry endpoint.
							Publishing this file costs nothing and positions you for the cooperative future.
						</p>
						<a href="/login" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow font-normal text-sm">
							Sign up and get your file <ArrowRight size={14} />
						</a>
					</div>
				</div>
			</div>

			<!-- Level 3: Report AI bot traffic from your stack -->
			<div class="rounded-xl bg-white border border-gray-200 shadow-md overflow-hidden">
				<div class="flex items-center gap-3 px-5 py-2.5 bg-brand-600 text-white lg:hidden">
					<span class="text-sm font-normal">3</span>
					<h3 class="text-base font-normal text-white">Report AI bot traffic from your stack</h3>
				</div>
				<div class="p-6 lg:p-8">
					<div class="hidden lg:flex items-start gap-4">
						<span class="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-normal flex-shrink-0">3</span>
						<div class="w-full">
							<h3 class="text-xl font-normal text-gray-800">Report AI bot traffic from your stack</h3>
							<p class="text-gray-600 font-light mt-1 mb-3">
								Your infrastructure already sees every AI bot request. Pick your platform -
								a short integration detects AI user agents and reports retrieval events to your telemetry endpoint.
								You don't need AI companies to cooperate. Events go to the OA public server by default, or route them to your own.
							</p>
							<p class="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 font-light">
								Only bot identity (user agent) and URL visited. No cookies, no user data, no impression tracking.
							</p>
							<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
								{#each [
									{ href: '/docs/integrations/wordpress', label: 'WordPress', tag: 'Plugin' },
									{ href: '/docs/integrations/cloudflare', label: 'Cloudflare', tag: 'Worker' },
									{ href: '/docs/integrations/fastly', label: 'Fastly', tag: 'Log stream' },
									{ href: '/docs/integrations/vercel', label: 'Vercel', tag: 'Marketplace' },
									{ href: '/docs/integrations/netlify', label: 'Netlify', tag: 'Extension' },
									{ href: '/docs/integrations/akamai', label: 'Akamai', tag: 'EdgeWorker' },
									{ href: '/docs/integrations/cloudfront', label: 'CloudFront', tag: 'Kinesis' },
									{ href: '/docs', label: 'All options', tag: 'Docs' },
								] as item}
									<a
										href={item.href}
										class="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-brand-200 hover:bg-brand-50/50 transition text-center group"
									>
										<span class="text-sm font-normal text-gray-800 group-hover:text-brand-600 transition">{item.label}</span>
										<span class="text-xs text-gray-400 font-light">{item.tag}</span>
									</a>
								{/each}
							</div>
						</div>
					</div>
					<div class="lg:hidden">
						<p class="text-gray-600 font-light mb-3">
							Your infrastructure already sees every AI bot request. Pick your platform -
							a short integration detects AI user agents and reports retrieval events to your telemetry endpoint.
							You don't need AI companies to cooperate. Events go to the OA public server by default, or route them to your own.
						</p>
						<p class="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 font-light">
							Only bot identity (user agent) and URL visited. No cookies, no user data, no impression tracking.
						</p>
						<div class="grid grid-cols-2 gap-2">
							{#each [
								{ href: '/docs/integrations/wordpress', label: 'WordPress', tag: 'Plugin' },
								{ href: '/docs/integrations/cloudflare', label: 'Cloudflare', tag: 'Worker' },
								{ href: '/docs/integrations/fastly', label: 'Fastly', tag: 'Log stream' },
								{ href: '/docs/integrations/vercel', label: 'Vercel', tag: 'Marketplace' },
								{ href: '/docs/integrations/netlify', label: 'Netlify', tag: 'Extension' },
								{ href: '/docs/integrations/akamai', label: 'Akamai', tag: 'EdgeWorker' },
								{ href: '/docs/integrations/cloudfront', label: 'CloudFront', tag: 'Kinesis' },
								{ href: '/docs', label: 'All options', tag: 'Docs' },
							] as item}
								<a
									href={item.href}
									class="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-brand-200 hover:bg-brand-50/50 transition text-center group"
								>
									<span class="text-sm font-normal text-gray-800 group-hover:text-brand-600 transition">{item.label}</span>
									<span class="text-xs text-gray-400 font-light">{item.tag}</span>
								</a>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Level 4: Web server middleware -->
			<div class="rounded-xl bg-white border border-gray-200 shadow-md overflow-hidden">
				<div class="flex items-center gap-3 px-5 py-2.5 bg-brand-600 text-white lg:hidden">
					<span class="text-sm font-normal">4</span>
					<h3 class="text-base font-normal text-white">Add web server middleware</h3>
				</div>
				<div class="p-6 lg:p-8">
					<div class="hidden lg:flex items-start gap-4">
						<span class="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-normal flex-shrink-0">4</span>
						<div>
							<h3 class="text-xl font-normal text-gray-800">Add web server middleware</h3>
							<p class="text-gray-600 font-light mt-1 mb-3">
								Origin-side reporting for Express, Django, Rails. Catches the
								<code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">OA-Telemetry-ID</code> header
								from cooperative agents and reports corroborated retrieval events. When both your server and the agent report the same fetch,
								you get a stronger signal than either alone.
							</p>
							<a href="/docs" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:border-brand-300 hover:text-brand-600 transition font-normal text-sm">
								View integration guides <ArrowRight size={14} />
							</a>
						</div>
					</div>
					<div class="lg:hidden">
						<p class="text-gray-600 font-light mb-3">
							Origin-side reporting for Express, Django, Rails. Catches the
							<code class="px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-xs font-mono">OA-Telemetry-ID</code> header
							from cooperative agents and reports corroborated retrieval events. When both your server and the agent report the same fetch,
							you get a stronger signal than either alone.
						</p>
						<a href="/docs" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:border-brand-300 hover:text-brand-600 transition font-normal text-sm">
							View integration guides <ArrowRight size={14} />
						</a>
					</div>
				</div>
			</div>

			<!-- Level 5: Self-host -->
			<div class="rounded-xl bg-white border border-gray-200 shadow-md overflow-hidden">
				<div class="flex items-center gap-3 px-5 py-2.5 bg-gray-700 text-white lg:hidden">
					<span class="text-sm font-normal">5</span>
					<h3 class="text-base font-normal text-white">Host your own telemetry server</h3>
				</div>
				<div class="p-6 lg:p-8">
					<div class="hidden lg:flex items-start gap-4">
						<span class="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-normal flex-shrink-0">5</span>
						<div>
							<h3 class="text-xl font-normal text-gray-800">Host your own telemetry server</h3>
							<p class="text-gray-600 font-light mt-1 mb-3">
								The reference server is open source (Apache 2.0). Deploy it yourself and own the full pipeline -
								collection, storage, reporting. Point your .well-known file at your own endpoint
								and every signal routes to infrastructure you control.
								No third-party dependency. No data leaving your network. The protocol is the same either way.
							</p>
							<a href="https://github.com/openattribution-org/oa-telemetry-server" target="_blank" rel="noopener noreferrer"
								class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:border-brand-300 hover:text-brand-600 transition font-normal text-sm">
								Reference server on GitHub <ArrowRight size={14} />
							</a>
						</div>
					</div>
					<div class="lg:hidden">
						<p class="text-gray-600 font-light mb-3">
							The reference server is open source (Apache 2.0). Deploy it yourself and own the full pipeline -
							collection, storage, reporting. Point your .well-known file at your own endpoint
							and every signal routes to infrastructure you control.
							No third-party dependency. No data leaving your network. The protocol is the same either way.
						</p>
						<a href="https://github.com/openattribution-org/oa-telemetry-server" target="_blank" rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:border-brand-300 hover:text-brand-600 transition font-normal text-sm">
							Reference server on GitHub <ArrowRight size={14} />
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Agent builders callout -->
		<div class="mt-12 p-8 bg-brand-50 rounded-2xl border-l-4 border-brand-600">
			<h3 class="text-xl font-normal mb-3">Building an agent?</h3>
			<p class="text-gray-600 font-light leading-relaxed">
				Chatbots, agentic browsers, shopping assistants - if your agent retrieves and cites content,
				you can respect content owners by emitting telemetry events. Check the .well-known file on any
				domain to find their preferred endpoint. The direction of travel is clear: CDNs and content marketplaces
				are exploring requiring agents to declare attribution intent before granting access.
				RSL and IAB CoMP are developing the licensing frameworks to support this. Get ahead of it.
			</p>
			<a href="#developers" class="inline-block mt-4 text-brand-600 font-normal hover:underline">
				Jump to developer SDKs
			</a>
		</div>
	</div>
</section>

<!-- ================================ -->
<!-- JOIN THE INITIATIVE              -->
<!-- ================================ -->
<section data-animate class="py-20 px-6 bg-cream">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-3xl lg:text-4xl mb-6">This takes <span class="text-brand-600">collective action</span></h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				No single publisher, brand, or technology provider can solve the attribution challenge alone.
				The standards defined now will shape the content economy for the next decade.
				Early participants shape those standards.
			</p>
		</div>

		<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="p-6 rounded-xl bg-white border border-gray-200 shadow-md">
				<h3 class="text-lg font-normal text-gray-800 mb-2">Publishers</h3>
				<p class="text-sm text-gray-600 font-light">
					Your content powers AI systems that capture your traffic.
					Without measurement, there is no basis for negotiation.
				</p>
			</div>
			<div class="p-6 rounded-xl bg-white border border-gray-200 shadow-md">
				<h3 class="text-lg font-normal text-gray-800 mb-2">Brands</h3>
				<p class="text-sm text-gray-600 font-light">
					Your product information powers AI shopping recommendations.
					You currently have no visibility into how it is represented.
				</p>
			</div>
			<div class="p-6 rounded-xl bg-white border border-gray-200 shadow-md">
				<h3 class="text-lg font-normal text-gray-800 mb-2">Tech providers</h3>
				<p class="text-sm text-gray-600 font-light">
					Attribution infrastructure is the next frontier.
					CDNs, analytics platforms, and commerce tools all need this layer.
				</p>
			</div>
			<div class="p-6 rounded-xl bg-white border border-gray-200 shadow-md">
				<h3 class="text-lg font-normal text-gray-800 mb-2">AI platforms</h3>
				<p class="text-sm text-gray-600 font-light">
					Transparency solves the content access problem.
					Negotiate once with coalitions, not individually with every publisher.
				</p>
			</div>
		</div>

		<!-- Member ticker -->
		<div class="mt-12 py-8 border-t border-b border-gray-200">
			<div class="flex items-center justify-between mb-5">
				<div class="flex items-baseline gap-6">
					<span class="text-sm font-normal text-gray-800">
						<span class="text-brand-600 text-lg">7</span> steering
					</span>
					<span class="text-sm font-normal text-gray-800">
						<span class="text-brand-600 text-lg">10</span> members
					</span>
					<span class="text-sm font-normal text-gray-800">
						<span class="text-brand-600 text-lg">20</span> community
					</span>
				</div>
				<a href="/members" class="text-sm text-brand-600 font-normal hover:underline inline-flex items-center gap-1">
					All members <ArrowRight size={14} />
				</a>
			</div>

			<div class="member-marquee-container overflow-hidden">
				<div class="member-marquee flex gap-8 whitespace-nowrap">
					{#each Array(2) as _}
						<span class="text-sm font-normal text-gray-600">Acme AI</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">GlobalMedia Group</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">EdgeServe</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">Nexus Affiliates</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">Meridian Partners</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">CloudPath</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">TradeLink</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">The Daily Record</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">Commerce Insider</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">BrightTag</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">Vantage Media</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">Retail Sciences</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">Signal Analytics</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">Northstar Publishing</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">Converge Digital</span>
						<span class="text-gray-300">&middot;</span>
						<span class="text-sm font-normal text-gray-600">Parity Commerce</span>
						<span class="text-gray-300">&middot;</span>
					{/each}
				</div>
			</div>
		</div>

		<div class="text-center mt-10">
			<p class="text-gray-600 font-light mb-4">
				OpenAttribution is a not-for-profit standards body, not a vendor. Open governance. One member, one vote.
			</p>
			<a href="#contact" class="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-lg font-normal text-lg">
				Join the initiative <ArrowRight size={20} />
			</a>
		</div>
	</div>
</section>

<!-- ================================ -->
<!-- DEVELOPER QUICK START            -->
<!-- ================================ -->
<section id="developers" data-animate class="scroll-mt-20 py-20 px-6 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-3xl lg:text-4xl mb-6"><span class="text-brand-600">Developer</span> quick start</h2>
			<p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
				Start emitting telemetry events in minutes. No registration required - just an endpoint and your user agent.
			</p>
		</div>

		<div class="grid lg:grid-cols-2 gap-8">
			<!-- Telemetry: primary, open by default -->
			<details class="group" open>
				<summary class="cursor-pointer p-6 rounded-xl bg-brand-50 border border-brand-200 hover:shadow-md transition">
					<span class="text-xl font-normal text-brand-900">Telemetry - Content Events</span>
					<span class="block mt-1 text-sm text-gray-600 font-light">Report retrieval and citation events. No AIMS manifest needed.</span>
				</summary>
				<div class="mt-4 space-y-4">
					<div class="rounded-xl overflow-hidden shadow-lg">
						<div class="bg-gray-800 px-4 py-2">
							<span class="text-xs text-gray-400 font-mono uppercase tracking-wider">bash</span>
						</div>
						<pre class="bg-gray-900 px-4 py-3 text-sm font-mono text-gray-200 overflow-x-auto">pip install openattribution-telemetry</pre>
					</div>
					<div class="rounded-xl overflow-hidden shadow-lg">
						<div class="bg-gray-800 px-4 py-2">
							<span class="text-xs text-gray-400 font-mono uppercase tracking-wider">python</span>
						</div>
						<pre class="bg-gray-900 px-4 py-3 text-sm font-mono text-gray-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">from</span> openattribution.telemetry <span class="text-purple-400">import</span> Client

<span class="text-purple-400">async with</span> Client(
    endpoint=<span class="text-green-400">"https://telemetry.openattribution.org/v1"</span>,
) <span class="text-purple-400">as</span> client:

    session_id = <span class="text-purple-400">await</span> client.start_session(
        content_scope=<span class="text-green-400">"shopping-assistant"</span>,
    )

    <span class="text-purple-400">await</span> client.record_event(
        session_id=session_id,
        event_type=<span class="text-green-400">"content_retrieved"</span>,
        content_url=<span class="text-green-400">"https://example.com/article"</span>,
    )

    <span class="text-purple-400">await</span> client.record_event(
        session_id=session_id,
        event_type=<span class="text-green-400">"content_cited"</span>,
        content_url=<span class="text-green-400">"https://example.com/article"</span>,
    )</code></pre>
					</div>
					<p class="text-sm text-gray-500 font-light">
						<a href="https://github.com/openattribution-org/telemetry" class="text-brand-600 hover:underline">GitHub: openattribution-org/telemetry</a>
					</p>
				</div>
			</details>

			<!-- AIMS: secondary -->
			<details class="group">
				<summary class="cursor-pointer p-6 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-md transition">
					<span class="text-xl font-normal text-gray-700">AIMS - Agent Identity</span>
					<span class="block mt-1 text-sm text-gray-500 font-light">Optional. Verifiable agent identity for content marketplace access.</span>
				</summary>
				<div class="mt-4 space-y-4">
					<div class="rounded-xl overflow-hidden shadow-lg">
						<div class="bg-gray-800 px-4 py-2">
							<span class="text-xs text-gray-400 font-mono uppercase tracking-wider">bash</span>
						</div>
						<pre class="bg-gray-900 px-4 py-3 text-sm font-mono text-gray-200 overflow-x-auto">pip install openattribution-aims</pre>
					</div>
					<div class="rounded-xl overflow-hidden shadow-lg">
						<div class="bg-gray-800 px-4 py-2">
							<span class="text-xs text-gray-400 font-mono uppercase tracking-wider">python</span>
						</div>
						<pre class="bg-gray-900 px-4 py-3 text-sm font-mono text-gray-200 overflow-x-auto leading-relaxed"><code><span class="text-purple-400">from</span> openattribution.aims <span class="text-purple-400">import</span> (
    AIMSManifest, Operator, Licence,
    TelemetryCompliance,
)

manifest = AIMSManifest(
    id=<span class="text-green-400">"did:web:example.com:agents:my-agent"</span>,
    operator=Operator(name=<span class="text-green-400">"Example Corp"</span>),
    licences=[Licence(
        source=<span class="text-green-400">"internal-docs.example.com"</span>,
        type=<span class="text-green-400">"partnership"</span>,
        scope=<span class="text-green-400">"inference"</span>,
    )],
    telemetry=TelemetryCompliance(
        endpoint=<span class="text-green-400">"https://collect.openattribution.org/v1/events"</span>,
        agent_id=<span class="text-green-400">"did:web:example.com:agents:my-agent"</span>,
    ),
)</code></pre>
					</div>
					<p class="text-sm text-gray-500 font-light">
						<a href="https://github.com/openattribution-org/aims" class="text-brand-600 hover:underline">GitHub: openattribution-org/aims</a>
					</p>
				</div>
			</details>
		</div>
	</div>
</section>

<!-- ================================ -->
<!-- WHERE IT FITS                    -->
<!-- ================================ -->
<section data-animate class="py-20 px-6 bg-white">
	<div class="max-w-5xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-3xl lg:text-4xl mb-4">Where OpenAttribution <span class="text-brand-600">fits</span></h2>
			<p class="text-lg text-gray-600 font-light max-w-3xl mx-auto">
				OpenAttribution doesn't replace licensing standards - it completes the picture.
				Publishers declare what AI can do with their content. We provide the identity and measurement to verify it's happening.
			</p>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="border-b-2 border-brand-200">
						<th class="py-3 px-4 text-sm font-normal text-gray-800">Standard</th>
						<th class="py-3 px-4 text-sm font-normal text-gray-800">The question it answers</th>
						<th class="py-3 px-4 text-sm font-normal text-gray-800">Side</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-gray-100">
						<td class="py-4 px-4">
							<span class="text-sm font-normal text-gray-800">Source-side licensing</span>
							<span class="block text-xs text-gray-400 font-light">RSL, IAB CoMP, Peek-Then-Pay</span>
						</td>
						<td class="py-4 px-4 text-sm text-gray-600 font-light">What can AI do with this content?</td>
						<td class="py-4 px-4"><span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-normal">Publisher</span></td>
					</tr>
					<tr class="border-b border-gray-100">
						<td class="py-4 px-4">
							<span class="text-sm font-normal text-brand-600">AIMS</span>
							<span class="block text-xs text-gray-400 font-light">Agent identity + licensed sources</span>
						</td>
						<td class="py-4 px-4 text-sm text-gray-600 font-light">Who is this AI and what can it access?</td>
						<td class="py-4 px-4"><span class="px-2 py-1 bg-brand-50 text-brand-600 text-xs rounded-full font-normal">Agent</span></td>
					</tr>
					<tr>
						<td class="py-4 px-4">
							<span class="text-sm font-normal text-brand-600">Telemetry</span>
							<span class="block text-xs text-gray-400 font-light">Content attribution events</span>
						</td>
						<td class="py-4 px-4 text-sm text-gray-600 font-light">What did this AI actually do with the content?</td>
						<td class="py-4 px-4"><span class="px-2 py-1 bg-brand-50 text-brand-600 text-xs rounded-full font-normal">Behaviour</span></td>
					</tr>
				</tbody>
			</table>
		</div>

		<p class="mt-6 text-sm text-gray-500 font-light text-center">
			Compatible with any source-side licensing standard. Publishers define permissions. OpenAttribution provides the audit trail.
		</p>
	</div>
</section>

<!-- ================================ -->
<!-- STATUS + GOVERNANCE              -->
<!-- ================================ -->
<section data-animate class="py-20 px-6 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-3xl lg:text-4xl mb-4">Open by <span class="text-brand-600">design</span></h2>
			<p class="text-lg text-gray-600 font-light max-w-3xl mx-auto">
				Shaped by the people who use it. Building common ground between content owners and AI - so the relationship runs on transparency, not conflict.
			</p>
		</div>

		<div class="lg:grid lg:grid-cols-2 lg:gap-12">
			<!-- Left: Status -->
			<div>
				<h3 class="text-xl font-normal text-gray-800 mb-4">Where we are today</h3>
				<div class="space-y-3">
					<div class="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200">
						<div>
							<span class="text-sm font-normal text-gray-800">Telemetry specification</span>
						</div>
						<span class="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-normal">Preview v0.3</span>
					</div>
					<div class="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200">
						<div>
							<span class="text-sm font-normal text-gray-800">Telemetry Python SDK</span>
						</div>
						<span class="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-normal">Alpha</span>
					</div>
					<div class="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200">
						<div>
							<span class="text-sm font-normal text-gray-800">Telemetry reference server</span>
						</div>
						<span class="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-normal">Alpha</span>
					</div>
					<div class="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200">
						<div>
							<span class="text-sm font-normal text-gray-800">AIMS specification</span>
						</div>
						<span class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-normal">Draft v0.1</span>
					</div>
					<div class="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200">
						<div>
							<span class="text-sm font-normal text-gray-800">AIMS Python SDK</span>
						</div>
						<span class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-normal">Alpha</span>
					</div>
					<div class="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200">
						<div>
							<span class="text-sm font-normal text-gray-800">Framework integrations</span>
							<span class="block text-xs text-gray-400 font-light">LangChain, LlamaIndex, MCP</span>
						</div>
						<span class="px-2.5 py-1 bg-brand-50 text-brand-600 text-xs rounded-full font-normal">In progress</span>
					</div>
				</div>
			</div>

			<!-- Right: Governance + Roadmap -->
			<div>
				<h3 class="text-xl font-normal text-gray-800 mb-4">How it's governed</h3>
				<div class="space-y-4 mb-8">
					<div class="p-4 rounded-xl bg-white border border-gray-200">
						<p class="text-sm font-normal text-gray-800 mb-1">Apache 2.0 licensed</p>
						<p class="text-xs text-gray-500 font-light">Every specification, SDK, and reference server. Open source, free to use, modify, and distribute.</p>
					</div>
					<div class="p-4 rounded-xl bg-white border border-gray-200">
						<p class="text-sm font-normal text-gray-800 mb-1">Not-for-profit</p>
						<p class="text-xs text-gray-500 font-light">No shareholders. No dividends. Surplus reinvests into the mission. Accounts filed publicly.</p>
					</div>
					<div class="p-4 rounded-xl bg-white border border-gray-200">
						<p class="text-sm font-normal text-gray-800 mb-1">One member, one vote</p>
						<p class="text-xs text-gray-500 font-light">Membership fees fund operations, not influence. A mid-size publisher has the same voting power as a big tech company. Technical decisions are made by a Technical Steering Committee guided by the mission, not the money.</p>
					</div>
				</div>

				<h3 class="text-xl font-normal text-gray-800 mb-4">2026 roadmap</h3>
				<div class="space-y-2">
					<div class="flex items-start gap-3">
						<span class="mt-0.5 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-normal shrink-0">Q1</span>
						<p class="text-sm text-gray-600 font-light">Founding membership confirmed, steering committee established, governance formalised</p>
					</div>
					<div class="flex items-start gap-3">
						<span class="mt-0.5 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-normal shrink-0">Q2</span>
						<p class="text-sm text-gray-600 font-light">Organising documents ratified, standard framework agreed, legal and operational foundations set</p>
					</div>
					<div class="flex items-start gap-3">
						<span class="mt-0.5 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-normal shrink-0">Q2-3</span>
						<p class="text-sm text-gray-600 font-light">Roundtable working groups live, attribution standards defined with direct AI platform input</p>
					</div>
					<div class="flex items-start gap-3">
						<span class="mt-0.5 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-normal shrink-0">Q4</span>
						<p class="text-sm text-gray-600 font-light">Research published on AI content usage patterns, attribution implementations underway across members</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ================================ -->
<!-- FAQ + CONTACT                    -->
<!-- ================================ -->
<section id="faq" data-animate class="py-20 px-6 bg-white">
	<div class="max-w-3xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-3xl lg:text-4xl"><span class="text-brand-600">FAQ</span></h2>
		</div>

		<div class="space-y-4">
			<details class="p-6 rounded-xl bg-brand-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">What if AI agents ignore the standard?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					That's precisely why server-side and CDN reporting exist. You don't need the agent to cooperate.
					Your infrastructure can detect AI user agents and report retrieval events regardless.
					When an agent does cooperate, you get corroborated events - stronger signal, not a dependency.
				</p>
			</details>
			<details class="p-6 rounded-xl bg-brand-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">How is this different from GEO?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					Generative engine optimisation is probabilistic - you guess how content influences AI responses based on ranking signals and heuristics.
					OpenAttribution is deterministic - you observe the actual events. Today that means retrieval events from your own infrastructure.
					As agents adopt the standard, you get citation events too - which content was used, how, and how prominently.
					It's the difference between estimating TV ad impact and watching the transaction happen.
				</p>
			</details>
			<details class="p-6 rounded-xl bg-brand-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">Is this opposed to AI development?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					No. AI systems need quality content. Content owners need measurement and attribution. These standards make both possible
					without requiring either party to trust the other blindly. The agents who participate get better content access.
					The ones who don't still get tracked at the infrastructure level.
				</p>
			</details>
			<details class="p-6 rounded-xl bg-brand-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">Why an open standard instead of a product?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					Attribution only works if both sides of the transaction trust the data. A proprietary intermediary
					taking a cut on every interaction creates the wrong incentives. An open protocol that anyone can
					implement - and anyone can verify - creates the right ones.
					Think DNS, not an analytics vendor. The protocol is the value.
					Companies building attribution products, content marketplaces, and licensing platforms
					can all build on the same telemetry layer instead of each inventing their own.
				</p>
			</details>
			<details class="p-6 rounded-xl bg-brand-50 cursor-pointer hover:shadow-md transition">
				<summary class="font-normal text-lg">What does it cost?</summary>
				<p class="mt-4 text-gray-600 font-light leading-relaxed">
					Nothing. The specifications, SDKs, and reference server are Apache 2.0 - free to use, modify, distribute.
					OpenAttribution is a not-for-profit standards body, not a vendor. No transaction fees. No data fees.
					Claiming your domain is free. The public telemetry server is free. Self-hosting is free. The protocol is the same either way.
				</p>
			</details>
		</div>

		<!-- Contact -->
		<div id="contact" class="scroll-mt-20 mt-20 text-center">
			<h2 class="text-3xl lg:text-4xl mb-6">Get <span class="text-brand-600">involved</span></h2>
			<p class="text-xl text-gray-600 font-light mb-12">
				Join the publishers, brands, and technology providers shaping how content attribution works in AI.
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

		<div class="mt-8 text-center">
			<a href="mailto:info@openattribution.org" class="text-brand-600 hover:underline">info@openattribution.org</a>
		</div>
	</div>
</section>

<!-- ================================ -->
<!-- AUDIENCE CARDS (utility nav)     -->
<!-- ================================ -->
<section data-animate class="py-12 px-6 bg-white border-t border-gray-100">
	<div class="max-w-6xl mx-auto">
		<p class="text-center text-sm text-gray-500 font-light mb-6">Find your integration</p>
		<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<a href="/docs/integrations/wordpress" class="group p-5 rounded-xl border border-gray-200 hover:border-brand-200 hover:shadow-md transition bg-white text-center">
				<p class="text-base font-normal text-gray-800 group-hover:text-brand-600 transition mb-1">WordPress</p>
				<p class="text-xs text-gray-400 font-light">Plugin - 5 minute setup</p>
			</a>

			<a href="/docs" class="group p-5 rounded-xl border border-gray-200 hover:border-brand-200 hover:shadow-md transition bg-white text-center">
				<p class="text-base font-normal text-gray-800 group-hover:text-brand-600 transition mb-1">CDN / Edge</p>
				<p class="text-xs text-gray-400 font-light">Cloudflare, Fastly, Vercel, Akamai</p>
			</a>

			<a href="/docs" class="group p-5 rounded-xl border border-gray-200 hover:border-brand-200 hover:shadow-md transition bg-white text-center">
				<p class="text-base font-normal text-gray-800 group-hover:text-brand-600 transition mb-1">Brand / Retailer</p>
				<p class="text-xs text-gray-400 font-light">Product pages, buying guides</p>
			</a>

			<a href="#developers" class="group p-5 rounded-xl border border-gray-200 hover:border-amber-200 hover:shadow-md transition bg-white text-center">
				<p class="text-base font-normal text-gray-800 group-hover:text-amber-600 transition mb-1">Agent builder</p>
				<p class="text-xs text-gray-400 font-light">AIMS + Telemetry SDKs</p>
			</a>
		</div>
	</div>
</section>
