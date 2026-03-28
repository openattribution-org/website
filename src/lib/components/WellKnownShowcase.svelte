<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
</script>

<section class="py-20 px-6 bg-gray-900 text-white">
	<div class="max-w-6xl mx-auto">
		<div class="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
			<!-- Code block -->
			<div>
				<div class="mb-3">
					<span class="text-xs font-mono text-gray-400 uppercase tracking-wider">
						yourdomain.com/.well-known/openattribution
					</span>
				</div>
				<div class="rounded-xl overflow-hidden shadow-2xl">
					<div class="bg-gray-800 px-4 py-2.5 flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-red-500 opacity-60"></div>
						<div class="w-3 h-3 rounded-full bg-yellow-500 opacity-60"></div>
						<div class="w-3 h-3 rounded-full bg-green-500 opacity-60"></div>
						<span class="text-xs text-gray-400 font-mono ml-2">openattribution.json</span>
					</div>
					<pre class="bg-[#1e1e2e] px-6 py-5 text-sm font-mono leading-relaxed overflow-x-auto"><code><span class="text-gray-400">&#123;</span>
  <span class="text-[#cba6f7]">"version"</span><span class="text-gray-400">:</span> <span class="text-[#a6e3a1]">"0.1"</span><span class="text-gray-400">,</span>
  <span class="text-[#cba6f7]">"telemetry_endpoint"</span><span class="text-gray-400">:</span> <span class="text-[#a6e3a1]">"https://api.openattribution.org/v1"</span><span class="text-gray-400">,</span>
  <span class="text-[#cba6f7]">"domain"</span><span class="text-gray-400">:</span> <span class="text-[#a6e3a1]">"example.com"</span><span class="text-gray-400">,</span>
  <span class="text-[#cba6f7]">"org_id"</span><span class="text-gray-400">:</span> <span class="text-[#a6e3a1]">"org_abc123"</span>
<span class="text-gray-400">&#125;</span></code></pre>
				</div>
			</div>

			<!-- Explanation -->
			<div class="space-y-4">
				<div>
					<h2 class="text-2xl md:text-3xl font-normal leading-snug text-white">
						Your domain. <span class="text-brand-400">Our infrastructure.</span>
					</h2>
					<p class="mt-3 text-base text-gray-300 font-light leading-relaxed">
						This file tells AI agents and your own infrastructure where to send usage data.
						It sits at your domain's <code class="text-brand-400 text-sm">.well-known</code> path - the same pattern used for SSL verification and security policies.
					</p>
				</div>

				<div class="space-y-2.5 text-sm text-gray-300 font-light">
					<p>
						The endpoint points to OA's telemetry server - purpose-built, privacy-first, free to use. We handle collection, storage, and aggregation. Your CDN or server middleware reports retrieval events there. Cooperative agents check the file to find it. You see the results.
					</p>
					<p>
						Want a closed loop? The server is open source (Apache 2.0) - you can self-host and point the file at your own infrastructure. But for most domains, the OA endpoint is the fastest way to get visibility.
					</p>
					<p>
						The file is simple to publish. The work behind it - getting AI platforms, browsers, and marketplaces to respect it - is what OpenAttribution exists to do.
					</p>
				</div>

				<div>
					<a
						href="/login"
						class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-lg hover:shadow-xl font-normal"
					>
						Register your domain
						<ArrowRight size={18} />
					</a>
					<p class="mt-2 text-xs text-gray-400 font-light">We generate the file. You host it. Free.</p>
				</div>
			</div>
		</div>
	</div>
</section>
